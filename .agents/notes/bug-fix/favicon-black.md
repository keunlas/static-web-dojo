# 坑：favicon 双重编码导致标签页图标漆黑一片

> 状态：已修复 · 发现场景：用户反馈“浏览器标签页的网站图标是漆黑一片” · 相关版本：无（loader.js 初版即有）

## 现象

浏览器打开网站后，标签页上的站点图标是一个**黑色圆角方块**（朱砂红印章“修”字完全看不见）。

实测（CDP 读取页面注入的 `link[rel=icon]` href，用 `Image` 解码后取像素）：
修复前中心像素 `[0,0,0,255]`（纯黑）、角上透明；修复后中心像素 `[176,58,46,255]`（`#b03a2e` 朱砂红）。

## 根因

`loader.js` 里内嵌的 SVG favicon 字符串**已经手写了百分号编码**（`fill='%23b03a2e'`），
随后又整体过了一遍 `encodeURIComponent(favicon)` 拼进 data URI：

1. `encodeURIComponent` 把字符串里的 `%` 也编码成 `%25`，于是 `%23b03a2e` 变成 `%2523b03a2e`；
2. 浏览器解析 `data:image/svg+xml,...` 时把 payload 百分号解码**一次**，SVG 源码里留下的
   是字面量 `fill='%23b03a2e'`；
3. SVG/CSS 并不认识 `%23` 这个“URL 编码色值”，`fill` 是**非法颜色值** → 回退到 SVG 默认填充
   **黑色**；`stroke`、`<text>` 的 `fill` 同理全部失效（描边消失、文字黑字），
   最终整个图标就是一块黑漆漆的圆角方块。

## 影响范围

所有经 `loader.js` 加载的站内页面（35 个手写页）——文件：`site/assets/js/loader.js`。
`site/demo/` 下两个整页示例是手写在 HTML 属性里的 data URI（单层编码，正确），不受影响。

## 复现方法

1. 打开任意页面（http://127.0.0.1:8899 或 file:// 双击）；
2. 看标签页图标：黑色方块而非朱砂印章；
3. 或 CDP 里 `document.querySelector('link[rel=icon]').href` 取出 data URI，
   用 `<img>` 解码到 canvas 取中心像素：`[0,0,0,255]`。

## 修复方案

`site/assets/js/loader.js`：favicon 源字符串里改回**真实的 `#`**（`#b03a2e`、`#faf6ec`），
让 `encodeURIComponent` 统一编码成 `%23`，只编一次：

```js
"<rect width='100' height='100' rx='18' fill='#b03a2e'/>"   // 改前是 '%23b03a2e'
```

修后中心像素 `[176,58,46,255]`，角上透明 ✓。

## 预防措施

- **写 data URI 的通用规则**：源字符串里永远写原始字符（`#`、`<`、`>`、中文…），
  编码工作一次性交给 `encodeURIComponent`；千万不能先手写 `%xx` 再编码；
- 手写在 HTML 属性里的 data URI 则相反：属性值必须是单层百分号编码（如 demo 页的写法），
  两种写法别混用；
- 改 favicon / 图标类资源后，用一次“取中心像素”的 CDP 校验而不是只看 href 字符串
  （字符串正确≠渲染正确），命令见本文件“复现方法”第 3 步。

## 相关

- 文件：`site/assets/js/loader.js`
- 关联：`notes/architecture.md §2 加载机制`（favicon 注入处）
