---
name: write-chapter
description: 从章节大纲产出一章合格教程页（site/bootstrap 与 site/jquery），含完整流程、验收清单与常见错误。适用于编写任何教程章节。
---

# 技能：write-chapter（编写一章教程）

> 用途：从章节大纲产出一章合格教程页。适用于 `site/bootstrap/` 与 `site/jquery/` 下的章节。

## 前置阅读

1. `.agents/notes/conventions.md`（骨架与五段式，**必读**）
2. `.agents/notes/style-guide.md`（文风与术语）
3. 打样基准：`site/bootstrap/01-intro.html`（Bootstrap 章）、`site/jquery/01-intro.html`（jQuery 章）
4. `tools/page-template.html`（可复制的骨架）

## 输入

- slug（文件名与 data-page，见 `.agents/notes/progress.md` 清单）
- 章节号与标题
- 内容大纲（讲哪些知识点、安排哪些演示）

## 步骤

1. **定大纲**：把知识点拆成 3–6 个 h2 小节，每小节配 1–2 个 `.demo`；全章 ≥3 个 `.demo`。
2. **写骨架**：复制 `tools/page-template.html`，替换 `__TITLE__`、`__DESC__`、
   `__ROOT__`（章节页一律 `../`）、`__PAGE_ID__`。
3. **写正文**：按五段式（章首语 → 本式要点 callout → 讲解与演示 → 练功 3 题 →
   本式小结 + blockquote 预告）。演示构造见 `skills/build-demo/SKILL.md`。
4. **写练功**：2 道动手题 + 1 道思考题；每个 `details.answer` 给代码 + 白话解释；
   思考题给“为什么”层面的解释。
5. **登记**：确认 slug 已在 site.js（新页面才需要登记，见 `skills/register-chapter/SKILL.md`）。
6. **自查**：跑 conventions.md 第 7 节的检查命令；浏览器双模式验证（`skills/verify-offline/SKILL.md`）。
7. **更新** `.agents/notes/progress.md` 中对应章节状态为 ✅。
   **注意**：并行多代理场景下，共享文档（含 progress.md）一律由协调者（父代理）统一更新，
   子代理只在自己的交付报告里说明，不要直接改（见 `skills/doc-sync/SKILL.md`）；独立单人工作时可自行更新。

## 验收清单（全部满足才算完成）

- [ ] 骨架与 template 一致，data-page 正确，无 h1；
- [ ] 五段式齐全：章首语、要点、≥3 个演示、练功 3 题含答案、小结与预告；
- [ ] 所有源码块 `<script type="text/plain" data-lang="…">`，`</script>` 已写成 `<\/script>`；
- [ ] 预览交互用 `$(function(){})` / `DOJO.ready`，id 全页唯一；
- [ ] 无外网资源引用；MDN 外链 ≤2；
- [ ] API 与 Bootstrap 5.3.8 / jQuery 4.0.0 行为一致（有疑问查离线文档）；
- [ ] 章首语、心法、预告的文风与打样一致；
- [ ] 浏览器里 http:// 与 file:// 双打开无报错、演示可交互。

## 常见错误（打样期总结）

- 忘了 `<\/script>` 转义 → 源码块提前闭合、页面碎裂；
- 演示 id 与页面其他元素重复 → 交互失效；
- 预览脚本不包 `$(function(){})` → jQuery 未就绪时随机报 `$ is not defined`；
- 把 Bootstrap 组件的 JS 初始化写错（tooltip/popover 必须手动 new，其余 data-bs-* 自动）；
- 标题里混用全角/半角标点。
