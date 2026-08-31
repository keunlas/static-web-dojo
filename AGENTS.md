# AGENTS.md — AI 代理工作指南

> 本文件是 AI 代理进入本仓库的**入口**。开始任何任务前，请先读完本文件，
> 再按需阅读 `.agents/` 下的详细文档。

## 项目是什么

《纯静态网页的修行》——一份**完全离线可用**的纯静态网页教程网站（中文）。

- 教程主题：HTML / CSS / JS 基础（引路到 MDN）+ Bootstrap 5.3.8 + jQuery 4.0.0
- 部署产物：`site/` 目录，零构建工具、零外部依赖，可直接丢到任意静态服务器
- 原始资源：`reference/`（原料库，**不部署、不被引用**）

## 铁律（任何任务都必须遵守）

1. **完全离线**：`site/` 内页面不得出现任何外网资源引用
   （`<link>/<script>/<img>/<iframe>/<source>` 的 src/href 禁止 `http(s)://`）。
   允许少量 `<a>` 文字外链（仅限 MDN / VS Code 等必要链接，每章 ≤2 个）。
2. **file:// 可用**：不用 ES Module（`type="module"`）、不用 fetch/XHR 读本地文件、
   一律相对路径、只写经典 `<script>`。Ajax 章节例外，必须在章节内说明需本地服务器。
3. **零构建工具**：不引入 npm、打包器、模板引擎。页面手写 HTML。
4. **单一数据源**：章节目录只登记在 `site/assets/js/site.js` 的 `SECTIONS` 里，
   侧边栏 / 分卷列表 / 翻页顺序由它自动生成。改目录只改这一处。
5. **公共文件保护**：除非任务明确要求，不要修改
   `site/assets/js/{loader,site,highlight}.js`、`site/assets/css/site.css`、
   `tools/`、`reference/`、`README.md` 和其他章节文件。
6. **文档同步纪律（重要）**：`.agents/` 与 `AGENTS.md` 必须时刻与项目实际保持一致，
   **实事求是**——写文档前先读真实文件核实，禁止凭记忆或臆测编造。
   - 每完成一批工作，**立即**更新 `notes/progress.md` 的当前状态；
   - 产生新的约定、工具、踩坑或设计变更时，**当场**沉淀进对应 notes / skills；
   - 每轮工作收尾按 `skills/doc-sync/SKILL.md` 过一遍文档维护清单。
   - 并行多代理时，共享文档由协调者统一更新，避免并发写坏文件。
7. **用户指令优先于文档（项目开发纪律）**：当人类用户的直接指令与本仓库已有文档
   （包括本文件、`.agents/` 下所有文档、`README.md`）冲突时，**一律以用户指令为准**执行；
   执行后**立即**更新相关文档，使文档与用户的最新决定保持一致，并在更新处简要说明
   “因用户指令调整”。文档永远追随现实与用户意图，绝不让用户迁就过时的文档。

## 文档地图（按需阅读）

### 笔记（.agents/notes/）— 理解项目用的参考文档

| 文件 | 内容 | 何时读 |
| --- | --- | --- |
| `architecture.md` | 目录结构、加载机制、导航机制、关键设计决策与踩过的坑 | 第一次进入项目必读 |
| `conventions.md` | 页面骨架、章节五段式、演示区块、练功题的精确写法规范 | 写任何 HTML 之前 |
| `style-guide.md` | 文风要求、术语约定、纸墨风视觉变量与可用样式类清单 | 写章节正文之前 |
| `progress.md` | 当前完成度、章节清单与状态、遗留事项 | 接手长期任务时 |
| `bug-fix/` | **坑档案：一坑一文件**，现象/根因/复现/修复/预防全记录 | 写公共机制、排查诡异现象、怀疑“这问题似曾相识”时先查 |

### 技能（.agents/skills/）— 完成任务用的操作手册

| 文件 | 内容 | 何时用 |
| --- | --- | --- |
| `write-chapter/SKILL.md` | 从大纲到合格章节的完整流程 + 验收清单 | 编写任何教程章节 |
| `build-demo/SKILL.md` | 演示区块（预览+源码）的构造方法与常见陷阱 | 章节内做现场演示 |
| `register-chapter/SKILL.md` | 在 site.js 登记新章节 / 新页面的方法 | 新增页面时 |
| `verify-offline/SKILL.md` | 双模式（http:// 与 file://）验证、离线纯净检查、链接检查 | 改完任何页面后 |
| `sync-assets/SKILL.md` | vendor / 藏经阁资源的同步与再生成 | 处理本地资源时 |
| `doc-sync/SKILL.md` | `.agents/` 文档与 AGENTS.md 的同步维护纪律与流程 | **每轮工作收尾时** |

## 常见任务速查

| 任务 | 做法 |
| --- | --- |
| 新写一章教程 | 读 `notes/conventions.md` + `skills/write-chapter/SKILL.md` → 写文件 → 登记章节 → 按 `skills/verify-offline/SKILL.md` 自查 |
| 章节里加演示 | 读 `skills/build-demo/SKILL.md` |
| 调整全站导航/目录 | 只改 `site/assets/js/site.js` 的 `SECTIONS`，读 `skills/register-chapter/SKILL.md` |
| 增删章节后重新生成站点地图 | `python3 tools/gen-sitemap.py --base https://你的域名/`（部署前换成真实域名） |
| 改 404 迷路页 | 先读 `bug-fix/404-deep-path-relative-links.md`（loader 逐级上探机制，勿改回写死相对路径） |
| 本地预览 | `python3 -m http.server 8899 --directory site`（Ajax 章也用它） |
| 同步本地资源 | `bash tools/sync-assets.sh`（读 `skills/sync-assets/SKILL.md`） |

## 不要做的事

- 不要给站点引入任何构建步骤、依赖包或 CDN；
- 不要把 `reference/` 里的文件直接引用进 `site/`（必须先复制到 `site/assets/vendor` 或 `site/archive`）；
- 不要修改第三方镜像内容（`site/archive/bootstrap-docs/`、`site/archive/examples/`）；
- 不要提交 `site/archive/` 下的生成物（已被 .gitignore 忽略）。
