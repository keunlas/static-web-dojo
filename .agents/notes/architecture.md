# 架构笔记（architecture）

> 写给 AI 代理：理解本网站“为什么长这样”。动手前必读。

## 1. 目录结构

```
site/                        # 部署根目录（唯一需要上传的部分）
├── index.html               # 首页 · 修行地图（data-page="home"）
├── basics/index.html        # 第一回 · 基础篇（MDN 引路）
├── bootstrap/               # 第二回 · Bootstrap 篇（16 式）
├── jquery/                  # 第三回 · jQuery 篇（10 式）
├── archive/                 # 第四回 · 藏经阁（离线文档/示例集/图标大全）
│   ├── index.html           # 藏经阁卷首（手写，入库）
│   ├── icons/index.html     # 图标大全（tools/gen-icons-page.py 生成）
│   ├── bootstrap-docs/      # Bootstrap 离线文档镜像（脚本生成，gitignore）
│   └── examples/            # 官方示例集（脚本生成，gitignore）
├── demo/                    # 整页示例（综合修炼章配套，独立打开）
├── data/                    # Ajax 章用的本地 JSON 数据
├── playground/index.html    # 练功场（data-page="playground"，页头自写）
└── assets/
    ├── css/site.css         # 纸墨风皮肤（全站唯一自定义样式）
    ├── js/loader.js         # 公共资源加载器（每页 <head> 只引它一行）
    ├── js/site.js           # 全站目录数据 + 导航/TOC/页脚/搜索注入
    ├── js/highlight.js      # 迷你代码高亮器 + 复制按钮
    ├── js/search-index.js   # 全站搜索索引（tools/gen-search-index.py 生成）
    └── vendor/              # 本地库（入库、由 sync-assets.sh 从 reference 复制）
        ├── bootstrap/bootstrap.min.css、bootstrap.bundle.min.js
        ├── bootstrap-icons/bootstrap-icons.min.css、fonts/
        └── jquery/jquery-4.0.0.min.js
```

- `tools/` 一览：`sync-assets.sh`（同步 vendor/藏经阁）、`gen-icons-page.py`（图标大全）、
  `gen-search-index.py`（搜索索引）、`check-offline.sh`（离线纯净扫描）、
  `check-links.py`（内部链接检查）、`page-template.html`（作者模板）。
- 页面深度 → loader 引入前缀：根目录页面 `assets/js/loader.js`；一层子目录 `../assets/js/loader.js`；两层 `../../assets/js/loader.js`。

## 2. 加载机制（loader.js）

每页 `<head>` 只写一行 `<script src=".../assets/js/loader.js"></script>`，其余公共资源由 loader 按序注入：

1. 用 `document.currentScript.src` 反推站点根目录（file:// 与 http:// 通用），存入 `window.SITE_ROOT`；
2. 注入 favicon（内嵌 SVG data URI，朱砂印章，零网络请求）；
3. 注入 3 个 `<link>`（bootstrap.min.css → bootstrap-icons.min.css → site.css，顺序即优先级）；
4. **链式顺序加载** 5 个脚本：jquery → bootstrap.bundle → highlight.js → search-index.js → site.js。
   **必须链式**（onload 后才加载下一个）：动态插入的脚本不保证按插入顺序执行，
   直接 forEach 追加会随机出现 `$ is not defined`（这是本项目修过的真实 bug）。
5. **jQuery 排队桩**：在真实 jQuery 到达前，loader 先定义 `window.$ = window.jQuery = stub(fn)`，
   把页面正文里出现的 `$(function(){…})` 演示脚本收进队列；jQuery onload 后统一放行。
   因此章节演示可以放心使用教程所教的就绪事件写法。
6. **DOJO.ready 队列**：演示若需要 `bootstrap` 全局（如 `new bootstrap.Tooltip(...)`），
   用 `DOJO.ready(fn)` 包裹；site.js 初始化完成后统一 `DOJO._flush()`。

## 3. 导航机制（site.js）

- `SECTIONS`：全站目录的**单一数据源**（四回 + 每回章节列表，含 num/title/href/desc）。
- `PAGES`：由 SECTIONS 平铺出的阅读顺序，驱动“上一式 / 下一式”翻页。
- 页面通过 `<body data-page="...">` 声明身份，id 规则：
  - `home`、`basics`、`bootstrap`、`jquery`、`archive`（卷首/分卷页）
  - `bootstrap-01`…`bootstrap-16`、`jquery-01`…`jquery-10`（章节页，与 slug 一致）
  - `archive-icons`（藏经阁·图标大全，登记时用章节条目的 `pageId` 字段指定）
  - `playground`（练功场，独立 PAGES 条目，无对应 SECTIONS 回）
- 章节条目支持 `pageId` 字段：藏经阁这类无编号条目（离线文档/示例集/图标大全）用它指定
  data-page；无 `num` 且无 `pageId` 的条目只进侧边栏、不进翻页顺序。
- site.js 在 `$(init)` 里完成七件事：渲染侧边栏（桌面 fixed + 移动端 offcanvas 克隆 + 顶栏）、
  初始化全站搜索框、注入章节页头（印章 + 章回 + h1，`home`/`archive` 除外）、生成分卷页章节列表（`#chapter-list` 占位）、
  生成正文 TOC、渲染页脚与翻页、执行 `HL.enhance` 与 `DOJO._flush`。
- **TOC 层级类名用 `l2`/`l3`，绝不能用 `h2`/`h3`**：Bootstrap 自带 `.h2`/`.h3` 标题类，
  曾导致右侧目录链接渲染成 32px 巨型标题（本项目修过的真实 bug）。

## 3.5 全站搜索（离线可用）

- 索引：`site/assets/js/search-index.js` 由 `tools/gen-search-index.py` 扫描本站手写页面生成
  （排除第三方镜像），输出 `window.DOJO_SEARCH = [{url,title,text},…]`。
  它是 **JS 文件而非 JSON**，所以 file:// 双击打开也能搜索（不经过 fetch）。
- UI：site.js 的 `initSearch()` 在侧边栏顶部注入搜索框；输入即过滤（标题命中 3 分、正文 1 分），
  结果以下拉列表显示；快捷键 `/` 聚焦、`Esc` 关闭。
- **新增/修改页面后必须重跑 `python3 tools/gen-search-index.py`**，否则搜不到。

## 4. 代码高亮（highlight.js）

- 源码块两种写法：
  - A（推荐）：`<script type="text/plain" data-lang="html|css|js" data-title="…">` 原始源码，无需转义；
  - B：`<pre><code data-lang="css">` 已转义源码。
- 处理管线：去首尾空行 → dedent（裁公共缩进）→ 把 `<\/` 还原为 `</` → HTML 转义 → 单遍正则着色。
- 支持语言 html/css/js，token 类：`tok-com/tok-kw/tok-str/tok-num/tok-tag/tok-attr/tok-fn`。
- 每个代码块自动加“复制”按钮：`navigator.clipboard` + `execCommand` 降级（file:// 可用）。

## 5. 纸墨风皮肤（site.css）

- 调色板（CSS 变量）：宣纸底 `--paper:#faf6ec`、墨字 `--ink:#2b2a26`、朱砂 `--cinnabar:#b03a2e`、
  墨夜代码底 `--night:#20242e`、淡墨线 `--line:#e3dcc8`。
- 字体全部系统栈：正文无衬线（含 PingFang SC / Microsoft YaHei）、标题宋体系（Songti SC / SimSun）、代码等宽栈。
- 布局：侧边栏 fixed 280px（<992px 收进 offcanvas + 顶栏）；正文 max-width 46rem；
  右侧 TOC 仅 ≥1400px 出现（grid：46rem + 14rem）。
- Bootstrap 主题变量被覆盖为朱砂系（`--bs-primary` 等），`btn-primary` 即朱砂按钮。

## 6. 离线约束（file:// 兼容清单）

- 相对路径；经典 script；无 `type="module"`；无 fetch/XHR（file:// 下会被 CORS 拦截）。
- 唯一例外：jQuery Ajax 章——本地 JSON 演示在 file:// 下失败，章节内必须明示
  “需 `python3 -m http.server` 或部署后可用”。
- Bootstrap 5.3.8 本身无 Web 字体（系统字体栈），icons 字体随 vendor 复制，因此全站零外部字体请求。

## 7. 关键设计决策记录

| 决策 | 理由 |
| --- | --- |
| 不用构建工具、JS 运行时注入导航 | 与教程哲学一致；file:// 可用；单一数据源改一处生效 |
| vendor 入库、archive 脚本生成并 gitignore | 仓库精简（约 24MB 生成物不重复入库），部署前跑一条 sync 脚本 |
| 每页一行 loader 引入 | 版本升级只改一处；杜绝多页面路径写错 |
| 演示用 `$(function(){})` + DOJO.ready | 演示代码即教学代码，且异步加载下不报错 |
| 习题答案用原生 `<details>` | 零 JS 依赖，任何环境可展开 |
| 藏经阁打包离线文档（20MB） | 用户拍板：站内离线查阅优先于体积 |

## 8. 踩坑索引

每个坑的详细档案（现象/根因/复现/修复/预防）见 **`bug-fix/` 目录，一坑一文件**：

| 坑 | 档案 |
| --- | --- |
| 动态注入脚本乱序执行 | `bug-fix/dynamic-script-order.md` |
| TOC 链接撞 Bootstrap `.h2` 标题类（32px 巨字） | `bug-fix/toc-bootstrap-h2-class-collision.md` |
| 宽屏 grid 页脚收缩错位 | `bug-fix/footer-grid-margin-shrink.md` |
| jQuery 文件名带版本号写错 | `bug-fix/jquery-filename-with-version.md` |
| site.js 用 `$.trim` 致全站搜索静默失效 | `bug-fix/site-js-used-removed-jquery-trim.md` |
| has-toc 网格下正文 `margin:0 auto` 致 fit-content 撑破列宽、压住右侧 TOC | `bug-fix/has-toc-main-margin-auto-overflow.md` |
| text/plain 源码块写 HTML 实体致代码块双重转义 | `bug-fix/raw-codeblock-double-escape.md` |
| 位置伪类“是否移除”代理说法冲突 | `bug-fix/positional-pseudos-fact-conflict.md` |

新坑的登记规范见 `bug-fix/README.md`（模板 + 索引表 + 使用约定）。
