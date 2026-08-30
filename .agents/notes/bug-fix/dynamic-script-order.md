# 坑：动态注入脚本不保证按插入顺序执行

> 状态：已修复 · 发现场景：骨架打样阶段 CDP 真浏览器验证 · 相关版本：Chromium 151 / jQuery 4.0.0

## 现象

- 打开页面时**随机**报错 `Uncaught ReferenceError: $ is not defined`，报错位置在
  `site/assets/js/site.js` 末尾的 `$(init)`；
- 表现不稳定：同一页面有时正常、有时侧边栏/页头/TOC/页脚全部空白（注入未发生）；
- Chromium `--dump-dom` 观察发现：`loader.js` 注入的 `<link>` 已在 head，但注入的
  4 个 `<script>` 尚未执行完，DOM 就被序列化了。

## 根因

`loader.js` 初版用 `forEach` 把 4 个脚本（jquery → bootstrap.bundle → highlight → site）
依次 `document.head.appendChild(s)`。**浏览器对“脚本插入的”经典脚本走
“execute as soon as possible”队列，不保证按插入顺序执行**（顺序保证只属于
parser-inserted 脚本），因此 site.js 可能抢在 jQuery 之前执行 → `$ is not defined`。

## 影响范围

全站所有页面（每个页面都依赖 loader 注入的公共脚本），表现为随机性故障——这是
它最阴险的地方：偶发、难复现、看起来像网络问题。

## 复现方法

```bash
# 反复刷新或交替打开，观察控制台
python3 -m http.server 8899 --directory site
# 打开 http://127.0.0.1:8899/bootstrap/01-intro.html 多次刷新
# 或直接 file:// 打开，命中概率更高（本地加载更快，竞态窗口更明显）
```

## 修复方案

1. **链式顺序加载**（`site/assets/js/loader.js`）：每个 script 的 `onload` 回调里
   再加载下一个，`onerror` 时告警并继续，保证 site.js 执行时 jQuery 一定就绪；
2. **jQuery 排队桩**：真实 jQuery 到达前，loader 先定义
   `window.jQuery = window.$ = stub(fn)`，把页面正文里演示用的 `$(function(){…})`
   收进队列，jQuery onload 后统一 `window.$(fn)` 放行——演示代码因此可以放心使用
   教程所教的就绪事件写法；
3. **DOJO.ready 队列**：需要 `bootstrap` 全局（tooltip/popover 手动初始化）的演示
   用 `DOJO.ready(fn)` 包裹，site.js 初始化完成后统一 `DOJO._flush()`。

## 预防措施

- 项目约定：**动态注入的脚本一律链式加载**（见 `../architecture.md` §2）；
- 任何新增“依赖加载顺序”的机制，必须在 http:// 与 file:// 下各连测多次；
- `../skills/verify-offline/SKILL.md` 的失败对照表第一行即为本坑。

## 相关

- 文件：`site/assets/js/loader.js`、`site/assets/js/site.js`
- 关联：`../skills/build-demo/SKILL.md`（演示脚本包裹规则）、`../architecture.md` §2
