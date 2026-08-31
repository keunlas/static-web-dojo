# 坑：carousel-caption 绝对定位叠层与内容重叠

> 状态：已修复 · 发现场景：用户反馈轮播章示例出现文字重叠 · 相关版本：Bootstrap 5.3.8

## 现象

`site/bootstrap/12-carousel.html` 例 1（三页轮播）在桌面宽度（≥768px，即
`carousel-caption` 的 `d-md-block` 生效时）出现文字重叠：页面标题“静夜思 · 打坐”与
底部说明“戌时静坐，气沉丹田”挤在一起，两行字相互压盖。窄屏（<768px）正常，
因为 caption 被 `d-none d-md-block` 隐藏。

## 根因

1. Bootstrap 的 `.carousel-caption` 是**绝对定位**（`position:absolute; bottom:1.25rem;
   left:15%; right:15%`），它脱离文档流、钉在 `.carousel-item` 内容的底部。
2. 原演示每页内容是一个 `py-5` 的色块（约 200px 高），色块内依次放了图标、`h5` 标题、
   再放 `.carousel-caption`。绝对定位的 caption 不再参与排版，于是被钉到容器底部
   20px 处——而这个位置正好与色块内 `h5` 标题所在的行重叠。
3. CDP 实测：caption top=1192、h5 bottom=1232，重叠 24px（`overlap:24`）。
   根因本质：**绝对定位元素与其“兄弟内容”的垂直空间没有规划**——内容太矮时，
   底部悬浮的说明必然压住标题。

## 影响范围

- 仅 Bootstrap 篇 12 式例 1（含练功参考答案 1 的旧结构）；其他章节没有用
  carousel-caption 叠层。
- 桌面/平板宽度可见；移动端无影响。

## 复现方法

1. `python3 -m http.server 8899 --directory site` 启动后访问
   http://127.0.0.1:8899/bootstrap/12-carousel.html；
2. 窗口宽度 ≥ 768px，滚动到“例 1 · 三页轮播”；
3. 观察：标题与说明文字重叠。

## 修复方案

- 每页内容改为**固定高度**（`style="height:320px"`）的弹性容器，图标与标题
  `d-flex flex-column align-items-center justify-content-center` 垂直居中，
  把底部约 1/4 的高度留给 caption；
- `.carousel-caption` 作为 `.carousel-item` 的**直接子元素**（与 Bootstrap 官方结构一致），
  不再嵌在色块 div 内部，只放说明文字（`<p>`）；
- 标题 `h5` 留在色块内（任何宽度都可见），说明文字进 caption（≥md 才显示）；
- 练功答案 1（加第四页）同步改为同一结构；
- 正文补了一句心法：`carousel-caption` 是绝对定位的说明区，内容块要留足高度。

修复后 CDP 实测：h5 与 caption 重叠 = 0，图标与 caption 间距约 18px，桌面/窄屏
（700px）均正常，零 JS 报错。

## 预防措施

- 写轮播/浮层类演示时，凡是**绝对定位叠层**（carousel-caption、浮在内容上的标签），
  一律给内容容器显式固定高度或足够 padding，再核验“正文行底边 < 叠层顶边”。
- 用 CDP `getBoundingClientRect` 求两元素的重叠量（`overlap = max(0, min(b1,b2)
  - max(t1,t2))`），应等于 0。
- conventions.md 的“演示源码与预览逐字一致”检查同样覆盖此类结构：修改后源码块
  （text/plain）要与预览同步更新。

## 相关

- 文件：`site/bootstrap/12-carousel.html`
- 关联：`.agents/notes/conventions.md`（演示区块规则）、
  `bug-fix/has-toc-main-margin-auto-overflow.md`（同为布局/定位类坑）
