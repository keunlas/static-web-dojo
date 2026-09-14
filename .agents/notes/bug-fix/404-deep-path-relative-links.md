# 坑：404 页被“原地”渲染在深路径时，相对引用（含 loader 自身）全部失效

> 状态：已修复 · 发现场景：为本站新增 404 页面并用 CDP 验证“深路径缺失地址”场景时

## 现象

- 直接访问 `http://127.0.0.1:8899/404.html`：一切正常；
- 用“缺页即返回 404.html”的模拟服务器访问 `http://127.0.0.1:8898/bootstrap/no-such-page.html`
  （模拟 GitHub Pages / Netlify 等静态托管“原地渲染 404 页”的行为）：浏览器控制台刷出
  `Failed to load resource: the server responded with a status of 404`，
  `window.SITE_ROOT === undefined`，侧边栏/顶栏/页脚全部为空，页面只剩一张裸 HTML。

## 根因

1. 很多静态托管对缺失路径的处理是**原地返回** 404.html 的内容（状态码 404），
   **地址栏仍是原地址**（如 `/bootstrap/no-such-page.html`）；
2. 浏览器解析 404.html 里的相对引用（`<script src="assets/js/loader.js">`、
   `href="index.html"`）时，基准不是“404.html 所在位置”，而是**原请求地址**——
   `assets/js/loader.js` 被解析成 `/bootstrap/assets/js/loader.js`，加载器自己先 404，
   `SITE_ROOT` 无从谈起，后续注入全灭；
3. 手写链接同理：`href="index.html"` 在 `/bootstrap/xxx` 语境下指向 `/bootstrap/index.html`，二次 404。
   这正是“原地渲染”与 nginx `error_page 404 /404.html;`（内部重定向到真实路径 `/404.html`）
   的本质区别——后者相对路径天然正确，前者必坏。

## 影响范围

- 404 页面自身：在任何“原地渲染”型托管（GitHub Pages、Netlify、Vercel、Cloudflare Pages、
  Apache `ErrorDocument` 等）上，从深路径触发 404 时页面全裸、链接全断；
- 站内其余页面不受影响（它们只可能被访问真实地址，相对路径基准正确）。

## 复现方法

```bash
# 1) 起一个“缺页即返回 site/404.html”的模拟服务器（状态码 404，地址不变）
#    （脚本见本轮会话 /tmp/serve-404.py：SimpleHTTPRequestHandler.send_error 重写）
# 2) 浏览器打开 http://127.0.0.1:8898/bootstrap/no-such-page.html
# 3) 控制台出现 resource 404；document.querySelector('.sidebar') 无内容；SITE_ROOT 为 undefined
```

## 修复方案

`site/404.html` 两处配套改动（不碰 loader.js / site.js）：

1. **loader 引用改为“逐级上探”**（`<head>` 内联脚本）：从当前目录起依次尝试
   `assets/js/loader.js`、`../assets/js/loader.js`、`../../…`（最多上探 10 级），
   `onerror` 触发下一级，直到命中。`loader.js` 从**自身真实位置**反推 `SITE_ROOT`
   （http(s)、file://、子目录部署全部正确），其后注入的侧边栏/顶栏/页脚天然免疫深路径。
   根目录部署与 file:// 双击场景下第 0 级即命中，与原先等价、零额外请求。
2. **手写链接全部带 `data-root`**（相对站点根的路径），页尾内联脚本在 `SITE_ROOT`
   就绪后（先试一次，未就绪则每 50ms 轮询、最多约 5 秒）把 `href` 改写成
   `SITE_ROOT + '/' + data-root`。

验证（CDP，4 个场景全部通过、零 JS 报错）：`http://…/404.html` 直接访问、
`/bootstrap/no-such-page.html` 深路径原地渲染、`/archive/bootstrap-docs/docs/5.3/components/`
深层镜像路径、`file://` 双击打开。侧边栏 30 条、顶栏/页脚就位、6 条手写链接全部指向站点根、
翻页只给“回到首页”。

## 预防措施

- **已知代价（预期噪声）**：原地渲染型托管下，上探必然产生“路径深度”条
  `Failed to load resource` 控制台日志（试错的每一级都是真 404）——这是无服务器配合下
  深度发现的固有成本，根目录部署与 file:// 下为 0 条；不要把它当 bug 修；
- 给站点新增“原地渲染型”场景下的页面时，引用公共资源不要写死相对路径，
  走 loader 上探或 SITE_ROOT；
- 404 页的 `data-page="404"` 未登记进 SECTIONS：site.js 对它不注入章节页头
  （`BY_ID` 查无 → `injectHeader` 直接返回）、翻页只显示“回到首页”，这是预期行为；
- 改完 404 页记得重跑 `check-offline.sh` / `check-links.py`（两者都会扫到它）。

## 相关

- 文件：`site/404.html`、`tools/check-links.py`（检查覆盖）
- 关联：`notes/architecture.md`（§2 加载机制、目录结构）、
  `notes/progress/10.sitemap-and-404-page.md`（归档记录）、
  `skills/verify-offline/SKILL.md`（CDP 双模式验证流程）
