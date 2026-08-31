# 进度笔记（progress）

> 写给 AI 代理：接手长期任务时先读本文件，判断哪些已完成、哪些待办。
> **更新规则：每完成一批工作，立即更新本文件的“当前状态”小节。**

## 当前状态（全站完成 ✅ · 最后更新：组合进度条示例修复）

### 🐛 最新修复（组合进度条 progress-stacked 文字挤叠 · 用户反馈）

用户反馈 12 式“例 3 · 组合进度条”看起来不对。CDP 复现：宽度写在了 `.progress-bar`
上（`style="width:50%"`），而 `.progress-stacked` 是横向 flex，每个 `.progress` 没设宽度、
按内容收缩到 51px，文字互相压叠。根因：**Bootstrap 5.3 的 progress-stacked 要求宽度写在
每条 `.progress` 容器上**（`.progress-stacked>.progress>.progress-bar{width:100%}` 会自动
撑满），写在内层 bar 上则各段按内容宽挤在一起。修复：宽度移到 `.progress`，bar 不再写
宽度；正文补一句心法（“宽度写在各条 .progress 上”）并在源码块注释注明；数值维持
50/30/15。CDP 复测：三段 50%/30%/15% 无缝相接、零重叠（gap=0）、http 与 file:// 双模式
零报错。与上轮 carousel-caption 修复（12 式例 1）为同页两处独立问题，
坑档案见 `bug-fix/carousel-progress-stacked-width.md`。


### 🐛 最新修复（轮播章节例 1 文字重叠 · 用户反馈）

用户反馈 12 式例 1 三页轮播“文字出现重叠”。CDP 复现：桌面宽度下标题 h5 与
carousel-caption 说明重叠 24px（cap top=1192 / h5 bottom=1232；窄屏 caption 被
`d-none d-md-block` 隐藏所以正常）。根因：`.carousel-caption` 是**绝对定位**钉在
容器底部，而原内容块只是 `py-5` 约 200px 高，底部空间不够放说明，位置恰好压住标题。
修复：每页内容改固定 `height:320px` 弹性容器（图标+标题垂直居中），caption 作为
`carousel-item` 直接子元素只放说明文字；标题 h5 保留在色块内（任何宽度可见）；
练功答案 1 同步新结构；正文补一句心法（“caption 是绝对定位说明区，内容块要留足高度”）。
CDP 复测：h5 与 caption 重叠 0、图标与 caption 间距约 18px，桌面/700px 窄屏均正常、
零报错。坑档案：`bug-fix/carousel-caption-overlap.md`。


### 🆕 最新一轮（用户两点意见：源码块不得节选、取值要逐一介绍）(用户指令优先)

用户反馈：①部分示例的源码块是“节选”（“同理/结构相同/省略/复制即可/（节选）”），
②像 `justify-content-*` 只列了 start/center/end/between/around/evenly 却不逐一解释用途，
并要求添加专门查阅章节。本轮整改：

- **demo 源码块全部与预览逐字一致**：03 例4/例5、04 例1–4、05 例1/4（及例2/3外层 flex 行）、
  02 例1/2/5/6、06 例2、07 例3、08 例2（id 统一）、09 例1/2/3（含练功答案1/2）、
  10 例2（长公告补全）、11 例1/3/4（含结构示例、答案1）、12 例1、15 例1/2、16（CSS 六色 +
  六张卡）、13/10 的（节选）标题移除。**jQuery 篇**：07 例1/2/3、08 例1/3、09 例1/2/3、
  10 例2/4 补上被省掉的“页面结构”块与外层 wrapper div，10 例5 JS 全量。
- **justify-content 六值逐一讲**：03-grid-2 新增取值表格（start/center/end/between/around/evenly
  各一句）+ 例5 改为“六值合影”演示（六个标签行 + 六行 row），预览与源码一致。
- **新增「工具类速查」页** `site/archive/reference/index.html`（data-page="archive-reference"）：
  11 个小节 12 张表，覆盖 justify-content/align-*/间距/文本/颜色/边框圆角阴影/显示/弹性/尺寸/
  位置/可见性交互，全部取值一句话说明并注“带断点类从该断点起生效”；类名已在
  vendor bootstrap.min.css 逐个 grep 验证。site.js SECTIONS 藏经阁登记 + 卷首 realm-grid
  加“查”字卡；03 与 04 各加一条交叉链接。
- **文档同步**：conventions.md 补“源码块必须与预览逐字一致”红线（用户明确要求）、
  style-guide.md 术语补充，architecture.md 目录/`data-page` 说明更新。
- **验证**：check-offline ✔、check-links ✔ 36 页（索引重生成）、node --check ✔、
  CDP http:// 与 file:// 抽查全部零 JS 报错；速查页 TOC 11 项、翻页链
  （图标大全→工具类速查→练功场）正确；HTML 标签全平衡。


### 🐛 最新修复（练功场等页面无法从目录导航过去 · 用户反馈）

用户反馈有的页面无法从目录导航过去（如练功场）。根因：练功场只手动 push 进
`PAGES`（翻页序列），从未登记进 `SECTIONS`——侧边栏由 SECTIONS 自动生成，
所以它没有入口，只能靠「图标大全→下一式」翻页链或搜索触达（违背“单一数据源”铁律）。
修复：在 `SECTIONS` 新增「附页·练功场」回（id/href/pageTitle 齐全，chapters:[]），
删除手动 PAGES.push（由循环自动生成，位置不变）；`injectHeader` 跳过 playground
（页面自带手写页头，否则会重复注入）。CDP 实测：侧边栏出现「练功场·附页」且
当前页激活高亮正确（桌面与 offcanvas 两份同步）、翻页链 图标大全→练功场→回到首页、
页头不重复、零报错。

### 🆕 上一轮（右侧目录吸顶位置修复 · 用户反馈）

用户反馈右侧目录和顶部几乎挨着。根因：`.toc` 的 `position: sticky; top: 1.6rem`
是「桌面无顶栏时代」的坐标——页面级顶栏上线后没跟着让位，初始紧贴顶栏、
滚动时还会钻到顶栏底下。修复：`top: calc(var(--topbar-h) + 2.4rem)`（与正文
padding-top 对齐），练功场 `.pg-preview` 同理改为 `calc(var(--topbar-h) + 1rem)`。
CDP 实测：初始 tocTop=96px 与章节页头对齐；滚动后仍停在 96px（顶栏下 38px），
不再被顶栏遮挡；零报错、check-offline/links ✔。

### 🆕 上一轮（右侧目录刚出现时内容左倾 · 用户反馈）

用户反馈：1412px 附近（右侧目录刚出现的宽度）正文看起来失衡倒向左边。
根因：TOC 出现阈值是 ≥1400px，但 1400–1550px 区间内容区装不下
「正文最大宽 64rem + 目录 14rem + 间隔 3rem」，`justify-content:center` 把主列压到
~888px 并紧贴侧栏、目录顶到右缘——组合不再是平衡构图。
修复：TOC 阈值 **1400 → 1600px**（此时正文首次不再被压缩，组合居中、左右余量对称），
grid 间隔 3rem → 2rem。CDP 实测：1412/1520 无目录、正文居中；1600 目录出现，
左右余量各 35px；1920 各 195px；正文全程维持最大宽不被压窄，零报错。

### 🆕 上一轮（宽屏下正文过窄、侧栏过宽 · 用户反馈）

用户反馈：宽屏时正文 46rem 居中显得很窄、左侧目录 280px 反而显宽。
调整：侧栏 `--sidebar-w` 280→**240px**；正文最大宽度改为
`--content-max: clamp(46rem, (100vw−240px)*86%, 64rem)`（随屏宽增长、64rem 封顶），
首页 `.home-body`、`#main`、`.site-footer`、has-toc 网格（`minmax(0, var(--content-max)) + 14rem`）
同步改用该变量。CDP 实测：1440 正文 918px / 1920 1024px / 2560 1024px，TOC 不重叠，
零报错；check-offline/links ✔。

### 🐛 上一轮（Chromium 暗色下白色滚动条刺眼 · 用户反馈）

用户反馈：Firefox 滚动条明暗都能融入，Chromium 却违和，暗色下白滚动条刺眼。
根因：`site.css` 的 `:root { color-scheme: light }` 与 Bootstrap 的
`[data-bs-theme=dark]` 同特异性、且后加载，把暗色模式下的 `color-scheme` 压回 light，
Chromium 因此始终画亮色滚动条（原生控件同理）。修复两件事：
① 暗版块显式 `color-scheme: dark`（html[data-bs-theme="dark"]，特异性更高必然生效）；
② 新增主题滚动条：`scrollbar-width: thin` + `scrollbar-color: var(--sb-thumb)…`
（Firefox 与 Chromium 121+，`--sb-thumb` 明暗各一套：#d4cab0 / #4b4f5c），
`::-webkit-scrollbar` 兜底老 Blink；页面/侧边栏/代码块/下拉/编辑器全部继承生效。
CDP 实测：暗色下 `color-scheme: dark`、`scrollbar-color: rgb(75,79,92)`、右缘与侧边栏
滚动条均为暗色融入；明色 `rgb(212,202,176)`；零报错、check-offline/links ✔。

### 🔧 上一轮（favicon 漆黑一片 + 印章统一为“静” · 用户反馈）

用户反馈“浏览器标签页的网站图标漆黑一片”。根因：`loader.js` 内嵌 SVG favicon 的
字符串里手写了 `%23b03a2e`（已编码的 `#`），又整体过 `encodeURIComponent` 二次编码成
`%2523`；浏览器解码一次后 SVG 里留下非法颜色值 `%23b03a2e`，`fill` 回退默认黑色。
修复：字符串改回真实 `#`，编码交给 `encodeURIComponent` 一次完成。CDP 取像素验证：
中心点由 `[0,0,0,255]` → `[176,58,46,255]`（朱砂红）。坑档案：`bug-fix/favicon-black.md`。
同轮用户拍板：印章用字由“修”改为“**静**”（取“纯静态”之静），`loader.js` 与
`demo/portfolio`、`demo/todo` 两处内联 favicon 同步更新，放大渲染验证字形正确。
随后用户要求全站品牌印章统一为“静”：顶栏印章（原“行”）、首页 Hero 印章（原“修”）
均已换为“静”；**编号/功能印章保持原样**（回数一二三四、章式 01–26、藏经阁文/例/图、
练功场“练”），它们标识内容而非品牌。

### 🔧 上一轮（页面级吸顶顶栏 + 暗色切换第四版）

用户要求给全站加暗色模式（站点已静态部署在 http://127.0.0.1:8899，未重启任何服务器）。
切换入口迭代过四次：① 侧边栏底部吸底浮条（sticky + 阴影）——用户嫌“突兀地悬在侧边栏上”；
② 品牌行右侧安静图标小按钮——用户嫌“侧边栏一滚，顶部就看不到了”；
③ 侧边栏吸顶头部（搜索 + 品牌 + 切换）——用户嫌“与滚动的目录没有颜色区分，
干脆整体上移到页面顶部”；④ **最终版：页面级吸顶顶栏**（品牌 + 搜索 + 明暗切换
全尺寸共用一条，新纸底色；侧边栏回归纯目录，旧纸底色，顶到顶栏之下），详见下。

- **机制**：开关为 `<html data-bs-theme="light|dark">`（Bootstrap 5.3 官方主题属性，唯一真源）。
  `loader.js` 在注入任何 CSS **之前**尽早应用（首选 `localStorage['dojo-theme']` 手动选择，
  否则跟随 `prefers-color-scheme`），全站不闪色。
- **换肤**：`site.css` 只在 `html[data-bs-theme="dark"]` 一个块里重定义 CSS 变量
  （暗夜纸墨：纸 #17181d / 墨 #e6e1d2 / 朱砂 #d46a5d，代码块更暗一档），并覆盖少数
  Bootstrap 全局变量（--bs-body-*、--bs-primary* 及 subtle/emphasis 三件套），
  组件全部由 Bootstrap 官方暗色自动适配；写死色值处（印章字色/透明度底/warn/.btn-primary
  白字用深一档 #c14f43）逐个补暗版。
- **入口**：明暗切换按钮在页面级吸顶顶栏 `.topbar` 右端（`.theme-toggle-top`，安静图标、
  透明无边框、悬停才浮现）；`toggleTheme()` 写属性与 localStorage，事件委托到 document；
  未手动选择过时监听系统偏好实时跟随。
- **页面级顶栏**（用户第三轮反馈“固定块应和滚动目录有颜色区别，干脆做到页面顶部”）：
  品牌（印章 + 站名）+ 全站搜索（桌面显示、结果下拉）+ 明暗切换，全尺寸共用一条
  `header.topbar`（sticky top:0，高 `--topbar-h:3.6rem`，新纸 `--paper-card` 底色）。
  侧边栏回归**纯章节目录**（旧纸 `--paper-2` 底色，`top: var(--topbar-h)`），
  固定区与滚动目录在空间与用色上双重区分。移动端搜索收起、hamburger 展开 offcanvas；
  搜索结果从顶栏下拉（.search-results 改 absolute + 投影）。
  布局联动：`.sidebar` 的 top 与 `.layout` 的 min-height 都取 `calc(... var(--topbar-h))`。
- **约定**：练功场预览 iframe 刻意保持白底（渲染用户代码=浏览器默认画布）；
  `demo/` 整页示例为独立成品（未用 loader），不随站内主题。
- **验证**：CDP 双主题实测——点击切换/刷新持久化/系统偏好跟随（含实时切换）、
  file:// 模式、移动端顶栏与 offcanvas 按钮、按钮/提示框/代码块/练功场暗色渲染，
  全程零 JS 报错；`node --check` ✔、check-offline ✔、check-links ✔ 35 页。
- 文档同步：architecture.md（加载机制 §2 / 皮肤 §5 / 决策表 §7）、style-guide.md §3。

### ✅ 已完成（全部）

- 工程骨架、`.gitignore`、`tools/sync-assets.sh`（vendor + 藏经阁 + 图标页一体再生成）
- 公共资产：loader.js（链式加载 + jQuery 排队桩 + DOJO.ready + favicon）、site.js
  （26 章数据源 + 导航/页头/TOC/页脚/全站搜索注入，TOC 排除演示区标题）、
  highlight.js、search-index.js（生成）、site.css（纸墨风皮肤）
- 页面：首页、基础篇（MDN 引路）、四个分卷首页、**Bootstrap 16 式**、
  **jQuery 10 式**（全部 ✅ 已写已验）、藏经阁（卷首/离线文档/示例集/图标大全 2078 个）、
  练功场（三栏编辑 + srcdoc 预览 + localStorage）
- 整页示例：`demo/portfolio`、`demo/todo`（独立页、含内嵌 favicon）；`data/notes.json`
- 工具：check-offline.sh、check-links.py、gen-icons-page.py、gen-search-index.py、
  verify-cdp.js、page-template.html
- AI 代理文档体系：AGENTS.md + notes（architecture / conventions / style-guide /
  progress / **bug-fix 坑档案一坑一文件 × 8**）+ 7 篇 skills（含 doc-sync 纪律与
  “用户指令优先”铁律）
- README：教程定位 + 网站构建/部署/检查说明（nginx 示例）

### ✅ 终验证据（全站 35 个页面）

- 静态：`node --check` 全部 JS 通过；`check-offline.sh` ✔ 无外网资源依赖
  （仅 7 条 MDN/VS Code `<a>` 文字外链）；`check-links.py` ✔ 35 页内部链接全部有效
- 渲染：CDP 无头浏览器 **http:// 模式 35/35 页零 JS 报错**；
  **file:// 双击模式 35/35 页零报错**
- 交互实测：jQuery 演示点击改文、事件委托（新元素响应/直接绑定不响应）、增删克隆、
  Ajax http 加载 8 条 JSON / file 优雅降级提示、待办清单增删切换统计持久化、
  portfolio 移动端汉堡折叠、图标过滤 heart→55、练功场 srcdoc 组装——
  全部通过

### 🧭 最新一轮修复（图标大全体验优化，含视觉审查）

用户反馈“图标大全的使用方式被埋在 2078 个图标最底部”，本轮由有视觉能力的模型
截图（HTTP 桌面/移动 + 1600px TOC 页）逐页审查后修复：

- **图标大全改为“用法先行”**：`tools/gen-icons-page.py` 模板把「使用方式」代码块 +
  「使用提示」提示框从页面底部移到 chapter-lead 之后、过滤工具栏之前，并重新生成
  `site/archive/icons/index.html`。用户打开页面第一眼即会用法，再往下逛图标。
  （用户反馈移至顶部后与导语无空隙：`.chapter-lead` 下边距为 0 而 `.codeblock` 无 margin，
  章节页无感是因为代码块前都是带下边距的 `<p>`；`site.css` 补
  `.chapter-lead + .codeblock { margin-top: 1.2rem }`，仅对“导语后直接跟代码块”生效。）
- **图标页「清空」按钮文字竖排**：`.icon-toolbar` 内按钮被压缩后“清空”折成两行。
  `site.css` 补 `.icon-toolbar .input-group { flex:1 1 auto; min-width:0 }` 与
  `.icon-toolbar .btn { white-space:nowrap; flex-shrink:0 }`。（Site.css 属公共文件，
  本次因用户明确要求体验优化而改动，改动范围仅此一处。）
- **藏经阁卷首缺「图标大全」入口**：`archive/index.html` 的 realm-grid 只有文档/示例
  两张卡，图标大全仅存在于侧边栏；补了第三张“图”字卡，并把「使用建议」里的
  “翻 Bootstrap Icons”改为指向 `icons/index.html` 的链接。
- 视觉复检：首页、三分卷卷首、基础篇、第 8/14/16 式、jQuery 卷首与第 5 式、
  练功场、藏经阁、图标大全（桌面+移动）、portfolio/todo 示例页——布局无溢出、
  TOC 无重叠、移动端工具栏正常。
- 复验：check-offline ✔、check-links ✔ 35 页、CDP http 与 file:// 均零报错、
  图标过滤 heart→55 / 复制类名 / 清空 2078 交互实测通过；搜索索引重新生成
  （图标页与藏经阁文案变化）。

### 🔧 上一轮修复（用户报告两处问题）

- **宽屏正文 + 右侧目录错乱**：根因 `main { margin: 0 auto }` 在 has-toc 网格下
  被 fit-content 定宽，长代码行把正文撑到 923px 压住 TOC 列。修复
  `site.css` ≥1400px 媒体查询补 `margin: 0; min-width: 0`（main 与 site-footer）。
  CDP 复测 33 个手写页 1600px 宽：main/footer 全部 736px、TOC 就位、零报错。
  坑档案：`bug-fix/has-toc-main-margin-auto-overflow.md`。
- **图标大全代码块双重转义**：`gen-icons-page.py` 把 HTML 实体写进了
  text/plain 源码块，script raw text 不解码实体 + 高亮器再转义 → 显示字面
  `&lt;`。修复生成器模板为原始源码并重新生成页面；全站扫描确认其余
  text/plain 块无此问题。坑档案：`bug-fix/raw-codeblock-double-escape.md`。
- 复验：check-links ✔ 35 页、check-offline ✔、file:// CDP 抽查零报错、
  搜索索引已重新生成（无 diff）。

### 遗留说明（非阻塞）

- 站内暗色模式不影响 `demo/` 下两个整页示例（portfolio/todo，独立成品未用 loader）；
- `site/archive/bootstrap-docs/` 镜像内自带的文档站内搜索依赖第三方索引，可能不可用，
  以目录浏览为主（藏经阁页面已注明）；
- jQuery Ajax 章在 file:// 下按设计走降级提示（需本地服务器），其余全部页面
  双击即可用；
- 三个写作子代理的收尾报告均已回收，其建议已全部沉淀进 `.agents/` 文档。

### 📝 待办

- 无阻塞项。全部页面已完成并通过双模式终验（见上）。

## 章节登记清单（site.js SECTIONS）

slug 与 data-page 已固定，写章节时**必须逐字一致**：

### 第二回 · Bootstrap 篇（16 式）

| num | 文件 | data-page | 状态 |
| --- | --- | --- | --- |
| 01 | bootstrap/01-intro.html 初入江湖 | bootstrap-01 | ✅ 打样 |
| 02 | bootstrap/02-grid-1.html 容器与栅格（上） | bootstrap-02 | ✅ 已写已验 |
| 03 | bootstrap/03-grid-2.html 容器与栅格（下） | bootstrap-03 | ✅ 已写已验 |
| 04 | bootstrap/04-typography.html 排版与工具类 | bootstrap-04 | ✅ 已写已验 |
| 05 | bootstrap/05-buttons.html 按钮·徽章·提示框 | bootstrap-05 | ✅ 已写已验 |
| 06 | bootstrap/06-cards.html 卡片 | bootstrap-06 | ✅ 已写已验 |
| 07 | bootstrap/07-lists-tables.html 列表组与表格 | bootstrap-07 | ✅ 已写已验 |
| 08 | bootstrap/08-forms.html 表单 | bootstrap-08 | ✅ 已写已验 |
| 09 | bootstrap/09-navs.html 导航组件 | bootstrap-09 | ✅ 已写已验 |
| 10 | bootstrap/10-modal-dropdown.html 模态框与下拉菜单 | bootstrap-10 | ✅ 已写已验 |
| 11 | bootstrap/11-collapse.html 折叠与手风琴 | bootstrap-11 | ✅ 已写已验 |
| 12 | bootstrap/12-carousel.html 轮播与杂项 | bootstrap-12 | ✅ 已写已验 |
| 13 | bootstrap/13-overlays.html 提示与浮层 | bootstrap-13 | ✅ 已写已验 |
| 14 | bootstrap/14-icons.html 图标库 | bootstrap-14 | ✅ 已写已验 |
| 15 | bootstrap/15-responsive.html 响应式心法 | bootstrap-15 | ✅ 已写已验 |
| 16 | bootstrap/16-project.html 综合修炼 | bootstrap-16 | ✅ 已写已验（配套 demo/portfolio ✅） |

### 第三回 · jQuery 篇（10 式）

| num | 文件 | data-page | 状态 |
| --- | --- | --- | --- |
| 01 | jquery/01-intro.html 引子·轻剑快马 | jquery-01 | ✅ 打样 |
| 02 | jquery/02-selectors.html 选择器 | jquery-02 | ✅ 已写已验 |
| 03 | jquery/03-content-attr.html 内容与属性 | jquery-03 | ✅ 已写已验 |
| 04 | jquery/04-class-style.html 类与样式 | jquery-04 | ✅ 已写已验 |
| 05 | jquery/05-events.html 事件 | jquery-05 | ✅ 已写已验（委托教学点实测） |
| 06 | jquery/06-effects.html 显隐与动画 | jquery-06 | ✅ 已写已验 |
| 07 | jquery/07-traversing.html 遍历 | jquery-07 | ✅ 已写已验 |
| 08 | jquery/08-manipulation.html 节点的增删改 | jquery-08 | ✅ 已写已验（增删/克隆实测） |
| 09 | jquery/09-ajax.html Ajax | jquery-09 | ✅ 已写已验（http 加载 / file 降级实测） |
| 10 | jquery/10-todo.html 综合修炼 | jquery-10 | ✅ 已写已验（配套 demo/todo ✅） |

## 注意事项

- 新增“图标大全/练功场/搜索/工具类速查”页面时，需要同步登记到 site.js（读 register-chapter 技能）；
- `site/archive/icons/index.html`、`site/playground/index.html` 建好后，侧边栏“藏经阁”与
  PAGES 顺序需更新；速查页已登记（archive-reference，进侧边栏 + 翻页链）；
- 全部章节完成后记得把本文件的状态标记为“全站完成”，并跑一遍 verify-offline 终验。
