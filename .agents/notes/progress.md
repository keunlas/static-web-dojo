# 进度笔记（progress）

> 写给 AI 代理：本文件**只记录当前要做的事**（待办 / 进行中的工作），不存已完成的流水账。
> **归档规则**（因用户指令调整，2026-09-14）：每完成一批工作，就把该批记录写成
> `.agents/notes/progress/<编号>.<英文名>.md`（编号从 1 起、按完成顺序递增、只增不改；
> 文件名用英文、内容用中文；正文原样搬移，只在文件头加来源说明），在下方「归档索引」
> 追加一行，并从「当前待办」划掉对应条目。
> 项目现状与机制请读 `architecture.md` / `conventions.md`；历史批次看 `progress/` 目录。
> （本文件最近整理：2026-09-14）

## 📝 当前待办

**进行中：基础篇改版（用户 2026-09-14 新目标「补充基础篇内容」）**

- 目标：把第一回从「MDN 引路」改为 **HTML + CSS + JS 全程教程**，既带新手入门、又能当字典查；
  MDN 降为每部分末尾的「课外阅读」。结构与原则见第 18 号归档。
- 规模：**43 式** = HTML 12 式 + CSS 14 式 + JavaScript 16 式 + 结业 1 式；
  `site/assets/js/site.js` 的 basics 回**每批随写随登记**（编号已锁定，不再变动）。
- 每批收尾动作：`check-demo-parity.py`（单文件+全站）→ `check-links.py` → `check-offline.sh` →
  `gen-search-index.py` → CDP 双模式 + `tools/verify/cdp-eval.js` 演示断言 → 归档本批。

### 基础篇编写计划（共 43 式，状态随进度更新）

| 编号 | 文件（site/basics/） | 主题 | 状态 |
| --- | --- | --- | --- |
| 01 | 01-html-intro.html | 网页与 HTML：骨架、元素属性、注释、文件与命名 | ✔ 2026-09-14 |
| 02 | 02-html-text.html | 文本与语义：标题、段落、语气、引用代码、字符实体 | ✔ 2026-09-14 |
| 03 | 03-html-lists-links.html | 列表与链接：ul/ol/dl、路径、锚点、target/rel/download | ✔ 2026-09-14 |
| 04 | 04-html-images.html | 图片：img 全属性、srcset/sizes、picture、figure | ✔ 2026-09-14 |
| 05 | 05-html-media.html | 音视频与嵌入：audio/video/source/track/iframe | ✔ 2026-09-14 |
| 06 | 06-html-tables.html | 表格：行列、caption/thead/tbody/tfoot、colspan/rowspan | ✔ 2026-09-14 |
| 07 | 07-html-forms-1.html | 表单（上）：form 与提交机制、label、文本类 input | ✔ 2026-09-14 |
| 08 | 08-html-forms-2.html | 表单（下）：选择类控件、文件日期颜色、约束校验 | ✔ 2026-09-14 |
| 09 | 09-html-semantics.html | 语义化结构：header/nav/main/article/section/aside/footer | ✔ 2026-09-14 |
| 10 | 10-html-global-attrs.html | 全局属性与 head：id/class/data-*、meta、link、script | ✔ 2026-09-14 |
| 11 | 11-html-a11y.html | 无障碍：alt、label、键盘、aria、对比度 | ✔ 2026-09-14 |
| 12 | 12-html-project.html | 综合修炼：语义化个人主页（纯 HTML） | ✔ 2026-09-14 |
| 13 | 13-css-intro.html | CSS 初识：三种引入、语法、DevTools | ✔ 2026-09-14 |
| 14 | 14-css-selectors.html | 选择器大全：组合器、属性、伪类、伪元素、优先级 | ✔ 2026-09-14 |
| 15 | 15-css-cascade.html | 层叠、继承与优先级：来源、特异性、!important、@layer | ✔ 2026-09-14 |
| 16 | 16-css-box-model.html | 盒模型：padding/border/margin、box-sizing、溢出、折叠 | ✔ 2026-09-14 |
| 17 | 17-css-units-colors.html | 单位、数值与颜色：px/em/rem/%、calc、颜色写法、透明度 | ✔ 2026-09-14 |
| 18 | 18-css-typography.html | 排版与字体：字体栈、字号字重、行高、文本属性、中文字体 | ✔ 2026-09-14 |
| 19 | 19-css-background-border.html | 背景、边框与阴影：background、渐变、border-radius、box-shadow | ✔ 2026-09-14 |
| 20 | 20-css-display-position.html | 显示与定位：display、position、z-index、float、层叠上下文 | ✔ 2026-09-14 |
| 21 | 21-css-flexbox.html | Flexbox：主轴交叉轴、对齐、伸缩、常见布局套路 | ✔ 2026-09-14 |
| 22 | 22-css-grid.html | Grid：模板、fr/repeat/minmax、跨格、区域、与 Flex 的选择 | ✔ 2026-09-14 |
| 23 | 23-css-responsive.html | 响应式：viewport、媒体查询、移动优先、断点、容器查询 | ✔ 2026-09-14 |
| 24 | 24-css-transition-animation.html | 过渡、变形与动画：transition、transform、@keyframes | ✔ 2026-09-14 |
| 25 | 25-css-variables.html | CSS 变量：作用域、var()、主题切换、与 JS 配合 | ✔ 2026-09-14 |
| 26 | 26-css-project.html | 综合修炼：把个人主页打扮起来（完整 CSS） | ✔ 2026-09-14 |
| 27 | 27-js-intro.html | JavaScript 初识：能做什么、引入、控制台、严格模式 | ✔ 2026-09-14 |
| 28 | 28-js-variables.html | 变量与数据类型：let/const/var、原始类型、转换、模板字符串 | ✔ 2026-09-14 |
| 29 | 29-js-operators.html | 运算符与表达式：比较、逻辑、?? / ?.、优先级、真假值 | ✔ 2026-09-14 |
| 30 | 30-js-control-flow.html | 控制流：if/switch/循环、for...of/in、break/continue | ✔ 2026-09-14 |
| 31 | 31-js-functions.html | 函数与作用域：声明/箭头、参数、闭包、递归、回调、this | ✔ 2026-09-14 |
| 32 | 32-js-arrays.html | 数组：增删改查、迭代方法全家、排序、展开与解构 | ✔ 2026-09-14 |
| 33 | 33-js-objects.html | 对象：属性方法、解构展开、Object 静态方法、Map/Set、JSON | ✔ 2026-09-14 |
| 34 | 34-js-strings-numbers.html | 字符串、正则、数字与日期：方法速查、Math、Date、Intl | ✔ 2026-09-14 |
| 35 | 35-js-classes.html | 类与原型：构造函数、原型链、class、继承、私有字段 | ✔ 2026-09-14 |
| 36 | 36-js-errors.html | 错误处理与调试：try/catch、throw、控制台、断点、常见错误 | ✔ 2026-09-14 |
| 37 | 37-js-dom.html | DOM 操作：查询、创建插入删除、classList、dataset、表单值 | ✔ 2026-09-14 |
| 38 | 38-js-events.html | 事件：监听与解绑、事件对象、冒泡委托、默认行为、防抖节流 | ✔ 2026-09-14 |
| 39 | 39-js-async.html | 异步：定时器、Promise、async/await、事件循环 | ✔ 2026-09-14 |
| 40 | 40-js-storage.html | 浏览器对象与存储：window/location、localStorage、fetch 限制 | ✔ 2026-09-14 |
| 41 | 41-js-modern.html | 现代 JavaScript：ES6+ 总览、模块、兼容性与 polyfill | ✔ 2026-09-14 |
| 42 | 42-js-project.html | 综合修炼：让个人主页动起来（原生 JS） | ✔ 2026-09-14 |
| 43 | 43-next-steps.html | 结业：回顾、查文档的方法、下一步往哪走 | ✔ 2026-09-14 |

**43 式全部成稿并登记**，全站终验已完成：逐条审计了用户的五项要求，
三项自检 + 全站 file:// 批量渲染扫描全绿，并补掉三个内容缺口
（`AbortController` / `history.pushState` / `Element.animate()`）与一份“深水区清单”
——证据见下方「当前状态速览」与第 53 号归档。

## 当前状态速览

- **HTML 12 式、CSS 14 式、JavaScript 16 式、结业 1 式全部完成**：
  第一回 43 式已全部登记（`site/assets/js/site.js`）。
- 全站 90 页（`check-links.py` ✔ 90 页；`check-demo-parity.py` ✔ 84 页 296 个演示）：
  Bootstrap 18 式 / jQuery 14 式 / 藏经阁 / 练功场 / 404 迷路页齐备，零构建、完全离线。
- 演示自查新增第四件：`check-demo-classes.py`（基础篇演示类名不得撞 Bootstrap / site.css）。
- 整页示例增至五件：`demo/html-home`（纯 HTML 版）、`demo/html-home-styled`（穿好衣服版，
  与前者标签序列逐节点一致）、`demo/html-home-interactive`（动起来版，第四十二式成品）、
  `demo/portfolio`、`demo/todo`。
- 已知例外新增一条：file:// 下 `<track>` 字幕轨被拦（视频/音频/iframe 不受影响），
  见 `bug-fix/file-protocol-track-blocked.md` 与 architecture §6。
- 最近三十六批终验（2026-09-14）：`check-offline.sh` ✔（已升级为脚本感知扫描）；
  **全站 file:// 批量扫描 86 个页面**（三批跑完）渲染标记齐全、除上述 VTT 例外外零 JS 报错；
  关键新页另有逐条操作级断言（37 式五个演示、38 式六个演示、第四十二式成品页的
  主题/筛选/留言板、结业式的 43 条侧栏链接）——证据详见第 18–52 号归档；
  上一轮全站竣工证据见第 15 号归档。
- 接手路径：`AGENTS.md`（铁律 + 文档地图）→ `notes/architecture.md` → 对应 skills；
  页面改完按 `skills/verify-offline/SKILL.md` 验收，收尾按 `skills/doc-sync/SKILL.md` 归档；
  章节目录 / 页面登记的唯一真源是 `site/assets/js/site.js` 的 `SECTIONS`（见 register-chapter 技能）。

## 🗂 归档索引（按完成顺序编号）

| 编号 | 标题 | 完成时间 | 一句话 |
| --- | --- | --- | --- |
| 1 | [宽屏目录错乱与图标代码块转义修复](progress/1.fix-toc-overflow-and-codeblock-escape.md) | 2026-08-31 | 修 has-toc 正文溢出与图标大全源码块双重转义，补坑档案 |
| 2 | [图标大全体验优化](progress/2.icons-page-ux-improvements.md) | 2026-08-31 | 用法说明移到页首、清空按钮竖排修复、藏经阁补「图」字卡 |
| 3 | [页面级顶栏与暗色模式](progress/3.topbar-and-dark-mode.md) | 2026-08-31 | 明暗切换第 4 版定稿：页面级 topbar + 全站换肤 |
| 4 | [favicon、印章与暗色滚动条](progress/4.favicon-seal-and-scrollbar.md) | 2026-08-31 | favicon 双重编码修复、品牌印章统一为「静」、主题化滚动条 |
| 5 | [宽屏布局调整与目录阈值](progress/5.wide-layout-and-toc-threshold.md) | 2026-08-31 | 侧栏 280→240px、正文随屏宽、TOC 阈值 1400→1600px |
| 6 | [右侧目录吸顶位置修复](progress/6.fix-toc-sticky-offset.md) | 2026-08-31 | 右侧目录让位顶栏，sticky 坐标改 calc(var(--topbar-h) + …) |
| 7 | [练功场目录入口修复](progress/7.fix-playground-nav-entry.md) | 2026-08-31 | 练功场登记进 SECTIONS，恢复侧边栏入口 |
| 8 | [源码块不节选与工具类速查页](progress/8.full-source-blocks-and-utility-reference.md) | 2026-08-31 | 按用户指令补全所有节选源码块；新增工具类速查页 |
| 9 | [轮播与组合进度条演示修复](progress/9.fix-carousel-and-stacked-progress-demos.md) | 2026-08-31 | 12 式例 1 文字重叠、例 3 进度条宽度层级写错 |
| 10 | [sitemap 与 404 迷路页](progress/10.sitemap-and-404-page.md) | 2026-09-01 | gen-sitemap.py + 深路径免疫 404 页 |
| 11 | [deploy.sh 一键部署](progress/11.deploy-script.md) | 2026-09-01 | 根目录六步串联脚本（sync → 生成 → 自检） |
| 12 | [sitemap 移出 git](progress/12.sitemap-out-of-git.md) | 2026-09-01 | 部署环境相关生成物一律 .gitignore |
| 13 | [对照前身查缺补漏](progress/13.gap-filling-from-predecessor.md) | 2026-09-14 | 新增 Bootstrap 17/18、jQuery 11–14 与两张速查页 |
| 14 | [全站内容审查](progress/14.site-content-review.md) | 2026-09-14 | 只审查不改文件，产出 15 条问题清单（已全部修复） |
| 15 | [内容审查问题修复](progress/15.content-review-fixes.md) | 2026-09-14 | 清单逐项修复 + 第二批收尾（补 ready 外壳、parity 升级深比对） |
| 16 | [竣工总览与历史快照](progress/16.completion-overview-snapshot.md) | 2026-08-31 起 | 竣工清单、终验证据、遗留说明、章节登记清单（快照） |
| 17 | [进度文档归档体系改造](progress/17.progress-archiving-system.md) | 2026-09-14 | 本次整理：progress.md 只留当前待办，历史批次拆成 1–16 号归档（英文文件名） |
| 18 | [基础篇改版：总体设计 + 首批两式](progress/18.basics-volume-design-and-first-chapters.md) | 2026-09-14 | 第一回改 43 式全程教程：卷首语重写、登记 01/02 两式、新工具 cdp-eval.js、文档同步 |
| 19 | [基础篇 03–04 式](progress/19.basics-html-03-04.md) | 2026-09-14 | 列表与链接、图片两式成稿并登记；新增 cdp-shot.js 截图工具与 VIEWPORT 视口支持 |
| 20 | [基础篇 05–06 式](progress/20.basics-html-05-06.md) | 2026-09-14 | 音视频与嵌入、表格两式成稿；新增本地媒体素材（mp4/webm/mp3/vtt）；归档 file:// 字幕轨被拦的坑 |
| 21 | [基础篇 07 式](progress/21.basics-html-07-forms-1.md) | 2026-09-14 | 表单（上）成稿：GET/POST 对照、label 绑定、文本类 input 与三种按钮；确立“演示拦提交”写法 |
| 22 | [基础篇 08–10 式](progress/22.basics-html-08-10.md) | 2026-09-14 | 表单（下）、语义化结构、全局属性与 head 三式成稿；cdp-eval 补焦点模拟并记入技能 |
| 23 | [基础篇 11–12 式（HTML 部分收官）](progress/23.basics-html-11-12-html-part-done.md) | 2026-09-14 | 无障碍、综合修炼两式成稿；新增纯 HTML 成品页 demo/html-home；HTML 部分 12 式全部完成 |
| 24 | [基础篇 13–14 式（CSS 开篇）](progress/24.basics-css-13-14.md) | 2026-09-14 | CSS 初识与选择器大全成稿；确立 CSS 演示的作用域约定；cdp-shot 支持局部截图 |
| 25 | [基础篇 15 式（层叠与继承）](progress/25.basics-css-15-cascade.md) | 2026-09-14 | 层叠四步、继承与四个关键字、!important 与 @layer；把实测到的“层外强于层内”写进正文 |
| 26 | [基础篇 16–17 式（盒模型、单位与颜色）](progress/26.basics-css-16-17.md) | 2026-09-14 | 盒模型与单位颜色两式成稿；演示里的数字全部实测校准（含 hsl 与 hex 不等的修正） |
| 27 | [基础篇 18 式（排版与字体）](progress/27.basics-css-18-typography.md) | 2026-09-14 | 字体栈、@font-face、行高与文本属性、中文排版经验；实测行高重算与省略号配方 |
| 28 | [基础篇 19 式（背景、边框与阴影）](progress/28.basics-css-19-background-border.md) | 2026-09-14 | 背景全家桶、三种渐变、边框三要素与圆角、四种阴影与渐变文字；实测“只写 width 无边框” |
| 29 | [基础篇 20 式（显示与定位）](progress/29.basics-css-20-display-position.md) | 2026-09-14 | display/position/z-index/float 全覆盖；实测层叠上下文压制与浮动塌陷，并记下 smooth 滚动对断言的影响 |
| 30 | [基础篇 21 式（Flexbox）+ 演示类名大修](progress/30.basics-css-21-flexbox-and-class-fix.md) | 2026-09-14 | Flexbox 六演示成稿；发现并修复“演示类名撞 Bootstrap”，新增 check-demo-classes.py 与 §3.2 约定 |
| 31 | [基础篇 22 式（Grid）](progress/31.basics-css-22-grid.md) | 2026-09-14 | Grid 五演示成稿：自适应列、跨格、模板区域骨架、对齐与叠加层；实测校准叠加与实时列数 |
| 32 | [基础篇 23 式（响应式）](progress/32.basics-css-23-responsive.md) | 2026-09-14 | 响应式五演示成稿：媒体查询双向实测、流式字号、横滚表格、触控尺寸、容器查询；演示类名工具首次拦下新问题 |
| 33 | [基础篇 24 式（过渡与动画）](progress/33.basics-css-24-animation.md) | 2026-09-14 | 过渡/变形/关键帧五演示成稿；cdp-shot 支持强制 hover 截图，类名检查第二次拦下 .btn/.card |
| 34 | [基础篇 25 式（CSS 变量与主题）](progress/34.basics-css-25-variables.md) | 2026-09-14 | 变量五演示成稿：作用域覆盖、回退与非法值、主题切换、JS 驱动；实测校准过渡等待与边框取整 |
| 35 | [基础篇 26 式（CSS 收官·主页穿衣）](progress/35.basics-css-26-project.md) | 2026-09-14 | 新成品页 demo/html-home-styled（与纯 HTML 版标签序列逐节点一致）+ 六步拆解与验收清单；CSS 部分 26 式全部完成 |
| 36 | [基础篇 27 式（JavaScript 初识）](progress/36.basics-js-27-intro.md) | 2026-09-14 | JS 部分开篇：脚本位置实验、控制台、严格模式与三类错误；离线检查升级为脚本感知扫描（修掉正文误报） |
| 37 | [基础篇 28 式（变量与数据类型）](progress/37.basics-js-28-variables.md) | 2026-09-14 | 五演示成稿：块级作用域、typeof 全家福、原始值 vs 对象、真假值转换表、模板字符串；parity 抓出严格模式漏写 |
| 38 | [基础篇 29 式（运算符与表达式）](progress/38.basics-js-29-operators.md) | 2026-09-14 | 五演示成稿：算术与拼接、=== 与 ==、短路与返回值、?? 与 ?.、优先级与“必须加括号”的语法错误实测 |
| 39 | [基础篇 30 式（控制流）](progress/39.basics-js-30-control-flow.md) | 2026-09-14 | 五演示成稿：if 分级、switch 贯穿、三种循环、for…of 与 for…in、break/continue/标签；并修掉预览脚本的一处引号错误 |
| 40 | [基础篇 31 式（函数与作用域）](progress/40.basics-js-31-functions.md) | 2026-09-14 | 五演示成稿：提升、参数与返回值、三层作用域、闭包（含 var/let 循环经典对比）、递归与高阶函数；修掉预览里一处调用顺序错误 |
| 41 | [基础篇 32 式（数组）](progress/41.basics-js-32-arrays.md) | 2026-09-14 | 五演示成稿：增删改查、变异/非变异对照、迭代全家桶、排序与查找、解构与展开；parity 抓出两处预览/源码不同步 |
| 42 | [基础篇 33 式（对象与 Map/Set）](progress/42.basics-js-33-objects.md) | 2026-09-14 | 五演示成稿：读写与 this、浅/深复制、Object 静态方法与冻结、Map/Set 与集合运算、JSON 的丢与报错 |
| 43 | [基础篇 34 式（字符串、正则、数字与日期）](progress/43.basics-js-34-strings-numbers.md) | 2026-09-14 | 四演示成稿：字符串十五行速查、正则十个日常用法、数字精度与格式化、日期与时区坑；emoji 长度一行为读者拆成两行 |
| 44 | [基础篇 35 式（类与原型）](progress/44.basics-js-35-classes.md) | 2026-09-14 | 五演示成稿：原型与 instanceof、class 全零件与私有字段、extends 继承、call/apply/bind、Todo 类；修掉三处预览/文案问题 |
| 45 | [基础篇 36 式（错误处理与调试）](progress/45.basics-js-36-errors.md) | 2026-09-14 | 四演示成稿：七种错误的类型表、try/catch/finally 轨迹、自定义错误分类处理、console 家族演示；修掉一处求值顺序问题 |
| 46 | [基础篇 37 式（DOM 操作）](progress/46.basics-js-37-dom.md) | 2026-09-14 | 五演示成稿：五种找法与 NodeList/HTMLCollection、内容属性与 dataset、classList 与 CSS 变量、增删改与 DocumentFragment 计时、innerHTML 安全对照；确立“演示要读的属性不加过渡” |
| 47 | [基础篇 38 式（事件）](progress/47.basics-js-38-events.md) | 2026-09-14 | 六演示成稿（重写版为准）：绑/解绑与 once、target 与 currentTarget（含箭头函数 this）、捕获→目标→冒泡三栏对比、默认行为三连拦、委托（新条目照样能删）、防抖节流 5/0/1→5/1/1；修掉“新条目删不掉”的真 bug 与两处不诚实的演示写法 |
| 48 | [基础篇 39 式（异步）](progress/48.basics-js-39-async.md) | 2026-09-14 | 四演示成稿：同步/微任务/宏任务顺序、可取消倒计时、串行 901ms vs Promise.all 400ms、async/await 全轨迹（catch + finally + allSettled）；终验补 AbortController 一节 |
| 49 | [基础篇 40 式（浏览器与本地存储）](progress/49.basics-js-40-storage.md) | 2026-09-14 | 四演示成稿：视口与滚动（含节流回指）、location 与 hashchange、localStorage 便签与 storage 事件、file:// 下用 script 带数据；终验补 history/pushState（以 file:// 实测的 SecurityError 为准） |
| 50 | [基础篇 41 式（现代 JavaScript）](progress/50.basics-js-41-modern.md) | 2026-09-14 | 三演示成稿：ES6+ 特性总览表 + 新语法尝鲜、命名空间式“分家”、十二项特性检测；终验补 Element.animate()（Web Animations API） |
| 51 | [基础篇 42 式（综合修炼：让主页动起来）](progress/51.basics-js-42-project.md) | 2026-09-14 | 新成品页 demo/html-home-interactive（五个行为：主题/筛选/留言/回顶/高亮）+ 七段拆解与七条验收清单；顺手补上独立页漏了的 favicon |
| 52 | [基础篇 43 式（结业：往后的路）](progress/52.basics-js-43-next-steps.md) | 2026-09-14 | 三演示成稿：报错翻译器、关键词翻译、复习抽签筒；抓到“侧边栏 href 已被解析成绝对 URL”的选取器坑；**第一回 43 式全部完成** |
| 53 | [基础篇终验：全篇查缺补漏](progress/53.basics-final-audit-gap-filling.md) | 2026-09-14 | 逐条审计用户五项要求；补 AbortController（39 式）、history/pushState（40 式，以 file:// 实测的 SecurityError 为准）、Element.animate()（41 式）与“深水区清单”；90 页 / 296 个演示 / 86 页 file:// 批量扫描全绿 |
