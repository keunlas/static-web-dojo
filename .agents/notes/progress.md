# 进度笔记（progress）

> 写给 AI 代理：接手长期任务时先读本文件，判断哪些已完成、哪些待办。
> **更新规则：每完成一批工作，立即更新本文件的“当前状态”小节。**

## 当前状态（全站完成 ✅ · 最后更新：内容审查问题修复）

### 🆕 最新一轮（内容审查问题修复 · 用户批准执行）

承接上一轮审查清单（见下一条），逐项修复（未动公共机制文件）：

- **三处高优先错误**：
  `jquery/08` 例 4 unwrap 演示——改为对**字条本身**调 `unwrap()`，并加“父级就是舞台说明没穿外衣、
  不动手”的保护；CDP 实测四条路径（先拆 / wrap 后拆 / wrapAll 后拆 / 还原）全部正常、舞台不再消失；
  `jquery/11` 例 2 `$.uniqueSort`——演示改用 DOM 元素数组（新增 A/B/C 三个桩，打乱且重复的
  `[C,A,B,A]` → `A、B、C`），表格与速查页补“只对 DOM 元素数组生效，数字数组原样返回”；
  `jquery/11` 回调签名——改为实测结论：`$.each`（同 `$(...).each`）是 `(index, value)`，
  `$.map` / `$.grep` 是 `(value, index)`。
- **三处“预览 ≠ 源码”**（check-demo-parity 的文字/属性盲区，深比对抓出）：
  `03-grid-2` 例 7 补回预览多出的那句文案、`11-collapse` 例 1 补回半句（练功答案 1 同步）、
  `14-icons` 例 1 源码块三个 `href="#"` 改为 `#bs14-demo1`。
- **第 16 式拆解块与成品 `demo/portfolio` 对齐**：骨架 CSS 补齐纸底 / `.seal` / `.portrait`
  字体底色字距 / `project-thumb` 颜色；hero 补 `class="seal"`；项目区补副标题并改 `<h2>` 类；
  关于区补 section 类与 jQuery 徽章；页脚去 `mt-5` 并补“由 Bootstrap 5.3.8 驱动”；
  同步修三处表述（“每张卡片不必各写 col 类”→“只需写一个不带数字的 col”、
  “十几行点缀样式”→“约四十行 CSS”、“bundle 按需加载”→“bundle 负责交互”）；
  成品页一处文案（“十几行点缀样式”→“一小段”）同步微调；拆解块仅“内嵌 SVG favicon”未收录，
  已在正文注明。
- **弃用类清理**：`text-muted` → `text-body-secondary`，共 41 处（jquery 07/08/09/10、
  demo/todo，含第 10 式正文里点名该类的句子）；速查页删除 `btn-close-white` 推荐，
  改注“深底给容器加 `data-bs-theme="dark"`”。
- **事实与交叉引用**：第 14 式“整套才几个 KB”→“约一百多 KB”；
  第 4 式“主题定制留到第十五式”→指向离线文档 Customize（该节真实存在）；
  第 15 式**新增《补遗：弹性工具类》一节 + 例 3 演示**（d-flex / flex-wrap / align-items /
  justify-content / gap / ms-auto），使第 1、4 式对 d-flex 的交叉引用成真；
  第 2 式断点表“无前缀｜<576px”→“所有宽度（基础款）”；第 3 式 order 0–5、去直引号；
  第 8 式 placeholder 措辞与 `needs-validation` 说明（实测 CSS/JS 均无该类，改为“标记 + 钩子”两段说清）；
  第 9 式 data API 首见指向第五式；第 12 式图标章改指第十四式；jquery 06 重复的“例 4”改例 5；
  jquery 12 答案“两个 end()”与例 1 文案；jquery 11 `.live/.die` 版本说法与小结句；
  basics“本回是重头戏”；首页 4 枚装饰图标补 `aria-hidden`；速查页“二級”错字、
  d-none 读屏说明（改为“读屏也读不到；要 visually-hidden”）、jQuery 速查 `.hover` 补弃用注记。
- **新坑档案**：`bug-fix/unwrap-parent-not-stage.md`、`bug-fix/uniquesort-not-for-numbers.md`，
  索引表已同步；`conventions.md` §7 新增“check-demo-parity 盲区（只比标签+class，
  文字与属性需人工/深比对）”警示。
- **验证证据**：`check-demo-parity` ✔ 41 页 125 演示（新增第 15 式例 3）；
  自建深比对 ✔ 0 差异；`check-offline` ✔；`check-links` ✔ 44 页；页内 id / 锚点扫描仅剩
  “教学占位符”误报；`search-index.js` 已重新生成；
  CDP **http:// 44/44 页零 JS 报错**、改动过的 26 页 **file:// 零报错**；
  交互断言：unwrap 四路径、uniqueSort → `A、B、C`、第 15 式弹性演示
  （flex / wrap / center / gap=8px / ms-auto 推到右缘）全部通过。

剩余（非阻塞，待用户决定）：

- 练功答案里 3 处“插入式”写法（12-carousel 加第四页、13-overlays 新增按钮、16-project
  “改动的这一行”）性质上是“改动说明”，若按最严标准可再补全；
- jQuery 篇 JS 源码块仍普遍省略 `$(function(){…})` / `DOJO.ready(…)` 外壳（既有约定允许、
  校验器会归一化；若要“整段复制即运行”可批量补外壳）；
- `tools/check-demo-parity.py` 升级为“文字 + 属性”级比对（本轮未动 tools/，
  深比对脚本仍是临时工具）。

### 🕘 上一轮（全站内容审查 · 只审查不改文件，清单已在本轮修复）

用户要求对全站教程内容做仔细审查（错别字与语法、教程内容正确性、示例代码与实例是否完全一致、
新人难懂处是否讲清）。本轮为**只审查不改文件**（除本进度记录），产出问题清单；
清单已由用户拍板、在下一轮全部修复（见上一条），本节保留为审查过程与证据的记录。
审查方法与证据：

- 机器体检（全部通过，未发现新问题）：`check-offline.sh`、`check-links.py`（44 页）、
  `check-demo-parity.py`（41 页 124 演示）、逐页“重复 id / 悬空锚点引用”扫描、
  章节预览里用到的 Bootstrap 类名（curated 清单）与全部 `bi-*` 图标类名存在性核对、
  图标大全计数（2078 = CSS 类数）、`site/data/notes.json` 字段与条数。
- 自建临时工具（在 /tmp，不入库）：`parity-deep.py`——把 check-demo-parity 的盲区
  （文字内容与 class 以外属性）也纳入比对；`cdp-eval.js`——无头 Chromium 的通用求值脚本；
  `jq-lab*.html`——jQuery 4.0.0 行为实测页。
- 浏览器实测：Ajax 章 http:// 全链路（getJSON/serialize/getScript/load/全局 ajax 事件）、
  jQuery 方法/选择器存在性 100+ 项、`$.each/$.map/$.grep` 回调签名、`$.uniqueSort`、
  `:checked` 语义、`css('width')`、动画速度表、浮动标签空 placeholder、
  jquery/08 例 4 wrap/unwrap、jquery/11 例 2 各按钮输出。

**确认的问题（按严重度，行号为审查时快照）**：

1. [高] `jquery/08-manipulation.html:365` 例 4 “unwrap”按钮逻辑错误：
   `$('#jq08-wrap-stage .jq08-note').parent().unwrap()` 拆掉的是**舞台容器**
   （实测 `#jq08-wrap-stage` 消失），与按钮文案“外衣没了、字条还在”相反；
   且此后同演示所有按钮（依赖 `#jq08-wrap-stage`）全部失效。正确写法应为
   `$('#jq08-wrap-stage .jq08-note').unwrap()`。
2. [高] `jquery/11-utilities.html:135、169` `$.uniqueSort` 演示与描述错误：
   实测 `$.uniqueSort([3,1,2,3,1])` 在 jQuery 4.0.0 里**原样返回**（该方法只对
   DOM 元素数组去重排序）；按钮点下去什么也没发生，新手必然困惑。
3. [高] `jquery/11-utilities.html:38` 回调签名说法错误：称三者回调都是
   `function (index, value)`“和 $(...).each() 不同”。实测：`$.each` 与 `$(...).each`
   都是 (index, element)；`$.map`、`$.grep` 是 (value, index)。
4. [高] 第 16 式拆解块与成品 `demo/portfolio` 不一致（读者照抄得不到成品）：
   骨架 CSS 缺 `body` 纸底、`.seal`、`.portrait` 的字体/底色/字距、`project-thumb` 颜色
   （`16-project.html:61-75` vs `demo/portfolio/index.html:20-40`）；
   hero 少 `class="seal"`；项目区 `<h2>` 类名不同且缺一副标题；
   关于我 section 少 `bg-white border-top border-bottom`、技能徽章少 jQuery；
   页脚多 `mt-5`、少“· 由 Bootstrap 5.3.8 驱动”；正文“每张卡片不必各写 col 类”
   与代码里每张卡都写 `<div class="col">` 矛盾；`16-project.html:319`“bundle 脚本只是按需加载”
   与常规 `<script src>` 加载不符。
5. [高] 三处 check-demo-parity 盲区内的“预览 ≠ 源码”（文字/属性级）：
   `bootstrap/03-grid-2.html:399 vs 420`（预览多“把窗口拖窄，侧边栏会落到下方。”）；
   `bootstrap/11-collapse.html:60 vs 81`（预览多“每日晨起挥剑三百，风雨无阻，三年可成。”）；
   `bootstrap/14-icons.html:158-160`（预览 `href="#bs14-demo1"`，源码写 `href="#"` ×3）。
6. [中] `bootstrap/14-icons.html:41`“整套才几个 KB”与事实不符：
   vendor 里 `bootstrap-icons.woff2` 132KB、`woff` 176KB。
7. [中] 弃用类仍在教：
   - `.text-muted`（官方 5.3 迁移文档明示弃用，替代 `text-body-secondary`）在
     `jquery/07`（2 处）、`jquery/08`（2 处）、`jquery/09`（8 处）、`jquery/10`（26 处）、
     `demo/todo`（3 处）；
   - `archive/reference/index.html:294` 仍推荐 `btn-close-white`（5.3 已弃用，改用 `data-bs-theme="dark"`）。
8. [中] `archive/reference/index.html:163` 显隐说明写反：“内容仍在 HTML 里，读屏软件照样能读到”
   ——`display:none`（d-none）会把内容移出无障碍树，读屏读不到；视觉隐藏但可读应用
   `visually-hidden`。
9. [中] 交叉引用落空：`bootstrap/04-typography.html:149` 称“主题定制原理留到第十五式”，
   但全书没有任何章节讲主题定制/CSS 变量；`01-intro.html:151` 与 `04:232` 把 `d-flex`
   指到第十五式，但第十五式与全书正文都没有正式讲它（示例却大量使用）。
10. [中] `bootstrap/08-forms.html:59、143、589` `needs-validation` 的作用被夸大：
    实测 bootstrap.min.css 与 bundle.min.js 都**不含**该字符串——它只是官方示例里的
    JS 选择器钩子，本章演示也没有用它做钩子；真正生效的是 `was-validated`。
11. [中] `archive/reference/index.html:109` 错别字：`二級弱化`（“級”为繁体，应为“级”）——
    全站正文扫描（排除第三方镜像）仅此 1 处繁体混入。
12. [中] `jquery/06-effects.html:331` 两个演示都编号“例 4”（应为例 4/例 5）；
    `jquery/12-chaining.html:351` 答案说“两个 end()”，代码只有一个；
    `jquery/12-chaining.html:61、99` 例 1“不加 .end()：整行都跟着段落一起被操作”与
    实际效果（边框落在段落上、容器不变）不符。
13. [低] `bootstrap/03-grid-2.html:161`“order 取值 1–5”缺 0（CSS 实测 `.order-0`–`.order-5`）；
    `02-grid-1.html:204` 断点表“无前缀 | <576px”与同章 216 行“无前缀对所有屏幕生效”冲突；
    `01-intro.html:169` “第三、四式会专门讲颜色体系”（应为第四、五式）；
    `09-navs.html:41`“第一式就见过 data API 的把戏”（首个 data-bs-* 在第五式）；
    `12-carousel.html:166`“下一式之后专门修炼图标”（实际是第十四式，表述含糊）；
    `jquery/11-utilities.html:360`“1.9 起就已废弃”（.live/.die 是 1.7 弃用、1.9 移除）；
    `jquery/11-utilities.html:427` 小结“前两者返回原位，后两者返回新数组”句意混乱
    （三者是 $.each 返回原集合、$.map/$.grep 返回新数组）；
    `archive/reference-jquery/index.html:123` 把已弃用的 `.hover()` 列在常用表里且
    末尾“弃用清单”未收它（conventions 已认定 .hover 为“仍在但弃用”）。
14. [低] `bootstrap/08-forms.html:38`“placeholder……读屏器也不读它”表述过绝对
    （多数读屏器会朗读 placeholder，但确实不该替代 label）；
    `bootstrap/10-modal-dropdown.html:349` 禁用下拉项用 `<button class="disabled" aria-disabled>`
    而未加 `disabled` 属性（鼠标被 pointer-events 拦住、键盘仍可触发），与第五式“按钮用 disabled 属性”的教导不一致。
15. [低] 系统性写法（非错误，待用户决定）：jQuery 篇 108 个 JS 源码块中 104 个省略了
    `$(function () { … })` / `DOJO.ready(…)` 外壳（预览里有、源码块没有；
    check-demo-parity 按约定归一化，故机器检查通过）。第一章刚教“整体包在 $(function(){}) 里”，
    源码块却普遍不带——新手整段复制到 head 会踩坑，建议补外壳或加一句注明。

**备注**：第 1–5 条为“实打实的错误/不一致”，建议尽快修；第 6–12 条为事实性错误或
交叉引用错误；第 13–15 条为表述精度/风格问题。修复后需重跑三个 check 脚本并补
bug-fix 档案（unwrap 演示、uniqueSort 演示两坑）。本轮未改动任何教程文件。

### 🆕 最新一轮（对照前身查缺补漏 · 新人入门审查 · 字典化）

用户把项目前身 `static-webpage-tutorial`（29 节 Bootstrap + 12 节 jQuery 的 API 手册式教程）
放进仓库 `tmp/`，要求：①对照前身查缺补漏；②重新审查整站，确保新人能入门；
③入门之后能当字典查。本轮交付：

- **差距盘点（逐节 + 逐类名/逐方法比对，非凭印象）**：Bootstrap 缺图片媒体、滚动监听、
  类名命名规律与一批组件/工具类变体；jQuery 缺表单选择器、遍历/操作/效果/事件/Ajax 的
  一批方法，以及工具函数、链式与尺寸、插件、性能四块整章。
- **新增 Bootstrap 两式（补遗）**：**第十七式《图片与媒体》**（img-fluid / img-thumbnail /
  figure / ratio / object-fit，示例图是站内手写 SVG `site/assets/img/`，零外链）、
  **第十八式《类名命名规律》**（公式、方向与断点暗号、八系速览、三条查名路）。
  正篇仍是 16 式（综合修炼为第 16 式），补遗排在正篇之后，避免打断原有收束节奏。
- **新增 jQuery 四式（补遗）**：**第十一式《工具函数》**（$.each/map/grep/inArray/merge/
  makeArray/extend/param/uniqueSort + 4.0 版本事实）、**第十二式《链式与尺寸》**
  （.end()/.addBack()、尺寸四层、offset/position/scrollTop、.data()）、
  **第十三式《插件与扩展》**（$.fn 插件模板、$.extend 默认选项、第三方插件三问）、
  **第十四式《性能心法》**（缓存选择器、限定范围、批量 DOM、委托与原生替代，含现场计时对比）。
- **现有章节补遗（8 处）**：jQuery 02 表单选择器（:input/:checked/:selected/:disabled）、
  05 的 one/trigger/triggerHandler、06 的 fadeTo/delay/queue/finish、07 的 not/is/has 与
  Until 系列、08 的 wrap/replaceWith/insertX、09 的 serialize/getScript/全局 ajax 事件；
  Bootstrap 09 滚动监听（scrollspy）、07 表格与列表变体、08 表单配件（floating/尺寸/颜色/
  range/is-valid）、10 模态尺寸与下拉附件、12 carousel-fade 与分页/spinner 尺寸、04 颜色
  边框补遗（subtle/emphasis/link-*/opacity/边框方向）、05 工具栏与链接形按钮。
- **字典强化**：藏经阁新增 **《jQuery 方法速查》**（`site/archive/reference-jquery/`，
  选择器/遍历/内容/类样式/尺寸/节点/事件/效果/Ajax/工具函数/链式 + 移除与弃用清单，
  方法存在性全部经无头浏览器实测）；**《工具类速查》扩编**（浮动/垂直对齐/图片媒体/布局小助手/
  链接与透明度/组件变体后缀表）；藏经阁卷首页新增「剑」字卡与指路。
- **新人入门审查**：基础篇新增《动手第一课：你的第一个页面》（十分钟手写第一页、
  查看源码、练功场入口、三个新手坑）；首页新增《怎么用这个站》（阅读顺序、每章读法、
  搜索与两张速查表、离线使用说明）；README 新增《怎么读这座山》。
- **事实纠正（重要）**：实测发现文档把 jQuery 4.0.0 的“弃用”当成“移除”——
  `.bind/.unbind/.delegate/.undelegate/.hover` 与 `$.proxy` **仍然存在可调用**；
  真正移除的是 `$.trim/.type/.isArray/.isFunction/.isNumeric/.isWindow/.parseJSON/.now/
  .nodeName/.camelCase` 与 `.live/.die`。已同步修正 conventions §6、verify-offline 技能、
  `tools/check-offline.sh` 2b 项、坑档案，并在新章节写入正确版本事实。
- **新工具**：`tools/check-demo-parity.py`——“源码块必须能 100% 还原预览”这条红线的
  机器校验（HTML 标签多重集 + JS 归一化对比），已并入 `deploy.sh` 第 7 步。
  本轮靠它查出并修复 **4 处历史遗漏**：11-collapse 例 2（源码缺 `<p>` 包裹、文案不一致）、
  09-ajax 三例（状态清理、700ms 停留、load 两种写法）、10-todo 例 4（源码用“与例 3 相同”
  替代完整代码，违反用户红线）。
- **踩坑归档**：`bug-fix/jquery4-removed-api-misjudgment.md`（grep 未命中 ≠ 不存在，
  API 存在性必须调用级实测）、`bug-fix/scrollspy-anchor-id-on-heading.md`
  （滚动监听 id 要挂整节容器，挂小标题上滚到底会全灭）。
- **验证**：`node --check` 全绿；`check-offline.sh` / `check-links.py`（44 页）/
  `check-demo-parity.py`（41 页、124 个演示）全绿；无头 Chromium **http:// 41/41 页、
  file:// 41/41 页零 JS 报错**；新演示交互断言 21 项（grep/map/param、.end/尺寸/data、
  插件、计时、scrollspy 高亮到“剑法总纲”、is-invalid 反馈、modal-lg 弹出、
  getScript 在 http 下成功加载等）全部通过。

### 🆕 最新一轮（sitemap.xml 从 git 移除、改为部署时生成 · 用户反馈）

用户指出 sitemap.xml 被提交进了 git（上一轮改动入库时一并带上，提交者为用户本人，
代理未执行过 git add/commit）。处理：

- **`git rm --cached site/sitemap.xml`**（磁盘文件保留），并在 `.gitignore` 追加
  `site/sitemap.xml`：它是部署时生成物，内含部署域名（基址），必须部署前现生成；
- 仓库里只保留生成器 `tools/gen-sitemap.py`，`deploy.sh` 第 4 步照常生成它；
- 文档同步：README（一键部署准备与部署小节注明“sitemap.xml 不入库”）、
  architecture.md（§1 目录树 / §3.6 生成机制）、AGENTS.md 任务速查、本文件。
- 约定沉淀：**生成物入库的红线**——内含“部署环境相关值”（域名等）的产物一律
  .gitignore（与 archive 镜像同理）；站点通用、可离线直接用（file:// 即用）的
  生成物（search-index.js、icons 页）维持入库。

### 🆕 最新一轮（根目录一键部署脚本 deploy.sh · 用户需求）

用户反馈：部署时要依次执行多个脚本，希望在根目录提供一个脚本一次性执行完。
本轮交付：

- **根目录 `deploy.sh`**：按部署顺序串起全部 6 步——`tools/sync-assets.sh`
  （vendor + 藏经阁）→ `gen-icons-page.py`（图标大全）→ `gen-search-index.py`
  （搜索索引）→ `gen-sitemap.py`（站点地图，**参数原样透传**：`bash deploy.sh --base https://你的域名/`）
  → `check-offline.sh`（离线纯净自检）→ `check-links.py`（内部链接自检）；
  `set -euo pipefail`，任一步失败即停止并显示该工具自己的报错；脚本先 `cd` 到仓库根，
  从任意目录运行都正确。
- 定位说明（写入脚本头注释与 README）：deploy.sh 只是把现有工具按顺序串起来，
  **不是构建系统**——`site/` 仍零构建、纯静态，不违背项目哲学。
- 文档同步：README（新增「一键部署准备」小节、部署检查清单合并为一条、sitemap
  说明指向 deploy.sh）、AGENTS.md 任务速查新增一行、architecture.md tools 一览补
  deploy.sh。
- **验证**：`bash deploy.sh` 端到端跑通（6/6 全绿、退出码 0，产物重生成后
  git diff 为空即生成器幂等）；`bash deploy.sh --base https://deploy-check.invalid/`
  确认参数透传生效（sitemap 基址随之变化），随后已还原为占位域名；
  从仓库外目录运行同样正常（脚本自 cd）。

### 🆕 最新一轮（新增 sitemap.xml 与 404 迷路页 · 用户需求）

用户要求：① 一个 sitemap.xml 文件；② 一个 404 页面。本轮交付：

- **`tools/gen-sitemap.py` + `site/sitemap.xml`**：生成器从 site.js 的 `SECTIONS`
  （单一数据源）提取全部页面 href，前置首页 `index.html`，追加 `demo/portfolio`、
  `demo/todo` 两个整页示例，共 **38 个 URL**；`index.html` 收敛为目录 URL；
  基址由 `--base` 传入（sitemap 协议要求绝对 URL），未传则用占位域名并提示，
  部署前需换成真实域名重新生成。XML 良构性已用 ElementTree 校验。
- **`site/404.html`**：纸墨风迷路页（印章「迷」+ hero「此页不在山中」+ 四回地图卡 +
  迷路须知），`data-page="404"` 未入 SECTIONS——site.js 不注入章节页头（页面自带 hero）、
  翻页只显示“回到首页”，均为预期行为。
  **深路径陷阱**：GitHub Pages 等托管把 404.html “原地”返回给缺失路径，写死的相对
  `assets/js/loader.js` 会按原地址解析而 404——改为 `<head>` 内联**逐级上探**（0..10 级
  `onerror` 链）加载 loader；手写链接全部带 `data-root`，SITE_ROOT 就绪后改写为
  根地址 + 路径。坑档案：`bug-fix/404-deep-path-relative-links.md`。
- **搜索索引排除 404 页**：`tools/gen-search-index.py` 加 `EXCLUDE_FILES={"404.html"}`，
  重新生成索引（顺带把 12 式旧正文索引更新到最新，diff 即此修复）。
- **文档同步**：architecture.md（目录树/§2.1 404 加载机制/§3.6 sitemap/踩坑索引/
  决策表）、bug-fix 新档案 + 索引、README（部署 error_page 与托管说明、sitemap 重生成、
  检查清单）、AGENTS.md（任务速查加 sitemap 行）。
- **验证**：`node --check` ✔；`check-offline.sh` ✔（无外网资源依赖）；`check-links.py` ✔
  **37 页**（含新 404 页）全部内部链接有效；CDP 四场景 PASS——`http://…/404.html`、
  模拟“原地渲染”深路径 `/bootstrap/no-such-page.html` 与
  `/archive/bootstrap-docs/docs/5.3/components/…`（侧边栏 30 条、顶栏/页脚就位、
  6 条手写链接全部改写指向站点根、零 JS 报错）、`file://` 双击打开；
  明暗两主题数值断言（朱砂 #b03a2e / 暗版 #c14f43、无横向溢出、4 张 realm 卡等宽）。
  sitemap.xml 经 8899 端口 http 服务返回 200 text/xml。
- 已知代价（预期噪声）：原地渲染场景下上探探测产生“路径深度”条 resource-404
  控制台日志，根目录部署与 file:// 下为 0 条；详见坑档案。

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
  （SECTIONS 单一数据源：18+14 式与藏经阁/练功场条目 + 导航/页头/TOC/页脚/全站搜索注入，
  TOC 排除演示区标题）、
  highlight.js、search-index.js（生成）、site.css（纸墨风皮肤）
- 页面：首页（含“怎么用这个站”）、基础篇（MDN 引路 + 动手第一课）、四个分卷首页、
  **Bootstrap 18 式**（正篇 16 + 补遗 2）、**jQuery 14 式**（正篇 10 + 补遗 4）、
  藏经阁（卷首/离线文档/示例集/图标大全 2078 个/工具类速查/jQuery 方法速查）、
  练功场（三栏编辑 + srcdoc 预览 + localStorage）、**404 迷路页**（深路径免疫，
  见 `bug-fix/404-deep-path-relative-links.md`）
- 整页示例：`demo/portfolio`、`demo/todo`（独立页、含内嵌 favicon）；
  `data/notes.json` 与 `data/demo-greeting.js`（getScript 演示）；`assets/img/`（演示 SVG 两枚）
- 工具：check-offline.sh、check-links.py、gen-icons-page.py、gen-search-index.py、
  **gen-sitemap.py（sitemap.xml 生成器）**、**根目录 deploy.sh（一键部署准备）**、
  **check-demo-parity.py（演示源码块一致性）**、verify-cdp.js、page-template.html
- AI 代理文档体系：AGENTS.md + notes（architecture / conventions / style-guide /
  progress / **bug-fix 坑档案一坑一文件 × 14**）+ 7 篇 skills（含 doc-sync 纪律与
  “用户指令优先”铁律）
- README：教程定位 + 网站构建/部署/检查说明（nginx 示例）

### ✅ 终验证据（全站 41 个页面）

- 静态：`node --check` 全部 JS 通过；`check-offline.sh` ✔ 无外网资源依赖
  （仅 7 条 MDN/VS Code `<a>` 文字外链）；`check-links.py` ✔ 44 页内部链接全部有效；
  `check-demo-parity.py` ✔ 41 页 124 个演示源码块与预览一致
- 渲染：CDP 无头浏览器 **http:// 模式 41/41 页零 JS 报错**；
  **file:// 双击模式 41/41 页零报错**；新演示交互断言 21 项全过
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

- 补遗章的“正篇 / 补遗”分层是**有意设计**：综合修炼仍是第 16 / 10 式，
  只在卷首页与本文件说明总量（18 式 / 14 式）；
- 第十七式的示例图是站内手写 SVG（`site/assets/img/`）——教程演示不引入任何位图，
  要放真实照片时读者用自己的本地图片即可；
- jQuery 方法速查页的方法清单来自 4.0.0 实测；将来升级 jQuery 大版本时，
  先重跑存在性实测再改进度说明（页面内已注明“以本站携带版本为准”）；
- 站内暗色模式不影响 `demo/` 下两个整页示例（portfolio/todo，独立成品未用 loader）；
- `site/archive/bootstrap-docs/` 镜像内自带的文档站内搜索依赖第三方索引，可能不可用，
  以目录浏览为主（藏经阁页面已注明）；
- jQuery Ajax 章在 file:// 下按设计走降级提示（需本地服务器），其余全部页面
  双击即可用；
- 三个写作子代理的收尾报告均已回收，其建议已全部沉淀进 `.agents/` 文档。

### 📝 待办

- 其余无阻塞项。全部页面已完成并通过双模式终验（见上）。
- 可选收尾（见顶部“最新一轮”末段）：3 处插入式练功答案是否补全、jQuery JS 源码块是否批量补
  `$(function(){…})` 外壳、`tools/check-demo-parity.py` 是否升级为“文字 + 属性”级比对。

## 章节登记清单（site.js SECTIONS）

slug 与 data-page 已固定，写章节时**必须逐字一致**：

### 第二回 · Bootstrap 篇（18 式：正篇 16 + 补遗 2）

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
| 17 | bootstrap/17-media.html 图片与媒体（补遗） | bootstrap-17 | ✅ 已写已验（示例图为站内 SVG） |
| 18 | bootstrap/18-naming.html 类名命名规律（补遗） | bootstrap-18 | ✅ 已写已验 |

### 第三回 · jQuery 篇（14 式：正篇 10 + 补遗 4）

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
| 11 | jquery/11-utilities.html 工具函数（补遗） | jquery-11 | ✅ 已写已验（含 4.0 版本事实实测） |
| 12 | jquery/12-chaining.html 链式与尺寸（补遗） | jquery-12 | ✅ 已写已验 |
| 13 | jquery/13-plugins.html 插件与扩展（补遗） | jquery-13 | ✅ 已写已验 |
| 14 | jquery/14-performance.html 性能心法（补遗） | jquery-14 | ✅ 已写已验（含现场计时对比） |

### 第四回 · 藏经阁（页面）

| 文件 | data-page | 状态 |
| --- | --- | --- |
| archive/icons/index.html 图标大全 | archive-icons | ✅（生成物，tools/gen-icons-page.py） |
| archive/reference/index.html 工具类速查 | archive-reference | ✅ 本轮扩编（浮动/媒体/布局小助手/链接透明度/组件变体表） |
| archive/reference-jquery/index.html jQuery 方法速查 | archive-jquery | ✅ 本轮新增（方法存在性全部浏览器实测） |

## 注意事项

- 新增“图标大全/练功场/搜索/两张速查页”页面时，需要同步登记到 site.js（读 register-chapter 技能）；
  藏经阁条目用 `pageId` 指定 data-page，登记后自动进侧边栏与翻页链；
- `site/archive/icons/index.html`、`site/playground/index.html` 建好后，侧边栏“藏经阁”与
  PAGES 顺序需更新；两张速查页已登记（archive-reference / archive-jquery，均进侧边栏 + 翻页链）；
- 补遗章（Bootstrap 17/18、jQuery 11–14）排在正篇之后：正文与卷首页明确“正篇 16 / 10 式 +
  补遗”，改这些说法时全站搜一遍（首页、404、分卷页、16-project、10-todo 都有）；
- 章节演示改完立刻跑 `python3 tools/check-demo-parity.py`（源码块必须能 100% 还原预览，
  引擎已抓过多次历史遗漏）；新增交互类演示必须做操作级断言，别只看静态标记；
- jQuery 4.0.0 版本事实：**弃用 ≠ 移除**（`.bind/.delegate/$.proxy` 仍在）——
  引用版本结论前先读 `bug-fix/jquery4-removed-api-misjudgment.md` 并实测；
- `site/sitemap.xml` 是部署时生成物且**不入库**（.gitignore）：增删章节后跑
  `python3 tools/gen-sitemap.py --base https://你的域名/`；
  部署前一次性准备全部产物用根目录 `bash deploy.sh --base https://你的域名/`（含自检）；
  `site/404.html` 是特殊页（未入 SECTIONS、loader 逐级上探），改它前先读
  `bug-fix/404-deep-path-relative-links.md`；
- 全部章节完成后记得把本文件的状态标记为“全站完成”，并跑一遍 verify-offline 终验。
