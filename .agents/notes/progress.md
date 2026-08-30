# 进度笔记（progress）

> 写给 AI 代理：接手长期任务时先读本文件，判断哪些已完成、哪些待办。
> **更新规则：每完成一批工作，立即更新本文件的“当前状态”小节。**

## 当前状态（最后更新：文档体系建立完毕）

### ✅ 已完成

- 工程骨架：目录结构、`.gitignore`、`tools/sync-assets.sh`（已跑通，vendor 与藏经阁已同步到位）
- 公共资产：
  - `site/assets/js/loader.js` —— 链式加载 + jQuery 排队桩 + DOJO.ready 队列 + favicon
  - `site/assets/js/site.js` —— 全站目录数据（**26 章 slug 已全部登记**）+ 导航/页头/TOC/页脚注入
  - `site/assets/js/highlight.js` —— 迷你高亮器 + 复制按钮
  - `site/assets/css/site.css` —— 纸墨风皮肤
- 页面：`site/index.html`（首页）、`site/basics/index.html`、`site/bootstrap/index.html`、
  `site/jquery/index.html`、`site/archive/index.html`
- 打样章节（质量基准）：`site/bootstrap/01-intro.html`、`site/jquery/01-intro.html`
- `tools/page-template.html`（作者模板）
- **AI 代理文档体系**：`AGENTS.md` + `.agents/notes/`（architecture / conventions /
  style-guide / progress）+ `.agents/skills/`（write-chapter / build-demo /
  register-chapter / verify-offline / sync-assets / doc-sync）
- **藏经阁图标大全**：`tools/gen-icons-page.py` → `site/archive/icons/index.html`
  （2078 个图标、名称过滤、点击复制类名），已接入导航（data-page="archive-icons"）
- **练功场**：`site/playground/index.html`（HTML/CSS/JS 三栏 + iframe srcdoc 实时预览 +
  localStorage 保存 + 3 个内置示例），已接入导航（data-page="playground"）
- **全站搜索**：`tools/gen-search-index.py` → `site/assets/js/search-index.js` +
  site.js 侧边栏搜索框（标题 3 分/正文 1 分、`/` 聚焦），loader 链已加入索引脚本
- **工具与部署**：`tools/check-offline.sh`（离线纯净扫描）、`tools/check-links.py`
  （内部链接检查）；README 已补「本教程网站本身」章节（预览/同步/检查/nginx 部署）
- 验证：CDP 双模式（http:// 与 file://）渲染、交互、样式全部通过，零 JS 报错；
  check-offline 与 check-links 均通过
- 已修复的 bug：动态脚本乱序、TOC `.h2` 撞类（32px 巨字）、宽屏页脚错位、jQuery 文件名

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
| 03 | bootstrap/03-grid-2.html 容器与栅格（下） | bootstrap-03 | 🔄 代理写作中 |
| 04 | bootstrap/04-typography.html 排版与工具类 | bootstrap-04 | 🔄 代理写作中 |
| 05 | bootstrap/05-buttons.html 按钮·徽章·提示框 | bootstrap-05 | 🔄 代理写作中 |
| 06 | bootstrap/06-cards.html 卡片 | bootstrap-06 | ✅ 已写已验 |
| 07 | bootstrap/07-lists-tables.html 列表组与表格 | bootstrap-07 | ✅ 已写已验 |
| 08 | bootstrap/08-forms.html 表单 | bootstrap-08 | ✅ 已写已验 |
| 09 | bootstrap/09-navs.html 导航组件 | bootstrap-09 | 🔄 代理写作中 |
| 10 | bootstrap/10-modal-dropdown.html 模态框与下拉菜单 | bootstrap-10 | ✅ 已写已验 |
| 11 | bootstrap/11-collapse.html 折叠与手风琴 | bootstrap-11 | ✅ 已写已验 |
| 12 | bootstrap/12-carousel.html 轮播与杂项 | bootstrap-12 | 🔄 代理写作中 |
| 13 | bootstrap/13-overlays.html 提示与浮层 | bootstrap-13 | 🔄 代理写作中 |
| 14 | bootstrap/14-icons.html 图标库 | bootstrap-14 | ✅ 已写已验 |
| 15 | bootstrap/15-responsive.html 响应式心法 | bootstrap-15 | ✅ 已写已验 |
| 16 | bootstrap/16-project.html 综合修炼 | bootstrap-16 | ✅ 已写已验 |

### 第三回 · jQuery 篇（10 式）

| num | 文件 | data-page | 状态 |
| --- | --- | --- | --- |
| 01 | jquery/01-intro.html 引子·轻剑快马 | jquery-01 | ✅ 打样 |
| 02 | jquery/02-selectors.html 选择器 | jquery-02 | 📝 |
| 03 | jquery/03-content-attr.html 内容与属性 | jquery-03 | 📝 |
| 04 | jquery/04-class-style.html 类与样式 | jquery-04 | 📝 |
| 05 | jquery/05-events.html 事件 | jquery-05 | 📝 |
| 06 | jquery/06-effects.html 显隐与动画 | jquery-06 | 📝 |
| 07 | jquery/07-traversing.html 遍历 | jquery-07 | 📝 |
| 08 | jquery/08-manipulation.html 节点的增删改 | jquery-08 | 📝 |
| 09 | jquery/09-ajax.html Ajax | jquery-09 | 📝（需 data/notes.json） |
| 10 | jquery/10-todo.html 综合修炼 | jquery-10 | 📝（需 demo/todo） |

## 注意事项

- 新增“图标大全/练功场/搜索”页面时，需要同步登记到 site.js（读 register-chapter 技能）；
- `site/archive/icons/index.html`、`site/playground/index.html` 建好后，侧边栏“藏经阁”与
  PAGES 顺序需更新；
- 全部章节完成后记得把本文件的状态标记为“全站完成”，并跑一遍 verify-offline 终验。
