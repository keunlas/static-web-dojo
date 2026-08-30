# 进度笔记（progress）

> 写给 AI 代理：接手长期任务时先读本文件，判断哪些已完成、哪些待办。
> **更新规则：每完成一批工作，立即更新本文件的“当前状态”小节。**

## 当前状态（全站完成 ✅ · 最后更新：图标大全体验优化完成）

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

- 新增“图标大全/练功场/搜索”页面时，需要同步登记到 site.js（读 register-chapter 技能）；
- `site/archive/icons/index.html`、`site/playground/index.html` 建好后，侧边栏“藏经阁”与
  PAGES 顺序需更新；
- 全部章节完成后记得把本文件的状态标记为“全站完成”，并跑一遍 verify-offline 终验。
