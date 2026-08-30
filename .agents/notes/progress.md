# 进度笔记（progress）

> 写给 AI 代理：接手长期任务时先读本文件，判断哪些已完成、哪些待办。
> **更新规则：每完成一批工作，立即更新本文件的“当前状态”小节。**

## 当前状态（全站完成 ✅ · 最后更新：终验通过）

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
  progress / **bug-fix 坑档案一坑一文件 × 6**）+ 7 篇 skills（含 doc-sync 纪律与
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

### 遗留说明（非阻塞）

- `site/archive/bootstrap-docs/` 镜像内自带的文档站内搜索依赖第三方索引，可能不可用，
  以目录浏览为主（藏经阁页面已注明）；
- jQuery Ajax 章在 file:// 下按设计走降级提示（需本地服务器），其余全部页面
  双击即可用；
- 三个写作子代理的收尾报告均已回收，其建议已全部沉淀进 `.agents/` 文档。

### 📝 待办（按顺序）

1. **Bootstrap 02–16 共 15 章**（文件见下表，slug 已登记、文件未建）——7 个写作代理并行进行中
2. **jQuery 02–10 共 9 章**——并行进行中
3. 整页示例：`site/demo/portfolio/index.html`、`site/demo/todo/index.html`——并行进行中
4. `site/data/notes.json`（jQuery Ajax 章演示数据）——并行进行中
5. ~~藏经阁图标大全~~ ✅ 已完成
6. ~~练功场~~ ✅ 已完成
7. ~~全站搜索~~ ✅ 已完成（新增页面后记得重跑 gen-search-index.py）
8. ~~tools/check-offline.sh 与链接检查器~~ ✅ 已完成
9. ~~README 部署说明~~ ✅ 已完成
10. 全站终验：所有页面 CDP 双模式 + 链接 + 离线纯净（章节批量完成后执行）

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
