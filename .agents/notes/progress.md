# 进度笔记（progress）

> 写给 AI 代理：本文件**只记录当前要做的事**（待办 / 进行中的工作），不存已完成的流水账。
> **归档规则**（因用户指令调整，2026-09-14）：每完成一批工作，就把该批记录写成
> `.agents/notes/progress/<编号>.<英文名>.md`（编号从 1 起、按完成顺序递增、只增不改；
> 文件名用英文、内容用中文；正文原样搬移，只在文件头加来源说明），在下方「归档索引」
> 追加一行，并从「当前待办」划掉对应条目。
> 项目现状与机制请读 `architecture.md` / `conventions.md`；历史批次看 `progress/` 目录。
> （本文件最近整理：2026-09-14）

## 📝 当前待办

- 当前没有进行中的任务：全站教程已完工并通过双模式终验。最近一批站点工作记录是
  第 15 号归档（[内容审查问题修复](progress/15.content-review-fixes.md)）；文档体系最近一次调整见
  第 17 号归档（[进度文档归档体系改造](progress/17.progress-archiving-system.md)）。
  新需求出现时直接登记在这里。

## 当前状态速览

- 全站 44 页（`check-links.py` ✔ 44 页；`check-demo-parity.py` ✔ 41 页 125 个演示）：
  Bootstrap 18 式 / jQuery 14 式 / 藏经阁 / 练功场 / 404 迷路页齐备，零构建、完全离线。
- 最近终验（2026-09-14）：`check-offline.sh` ✔；无头 Chromium **http:// 44/44 页、
  file:// 改动过的 26 页零 JS 报错**；演示交互断言全部通过——证据详见第 15 号归档。
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
