# 坑：progress-stacked 组合进度条宽度写错层级，各段挤作一团

> 状态：已修复 · 发现场景：用户反馈轮播章“组合进度条”示例不对 · 相关版本：Bootstrap 5.3.8

## 现象

`site/bootstrap/12-carousel.html` 例 3（组合进度条：三门功课各占一段）渲染异常：
三段进度条没有按 50%/30%/15% 铺开，而是挤在轨道左侧各占约 51px 宽，
“外功 50%”“内功 30%”“轻功 15%”三行文字互相压叠，不可阅读。

## 根因

Bootstrap 5.3 的 `.progress-stacked` 是**横向 flex 容器**：

```css
.progress-stacked{display:flex;...}
.progress-stacked>.progress{overflow:visible}
.progress-stacked>.progress>.progress-bar{width:100%}
```

关键规则：stacked 模式下 `.progress-bar` 会被强制 `width:100%`（撑满自己所在的
`.progress`），因此**每段的宽度应该写在 `.progress` 容器上**
（`<div class="progress" style="width: 50%">`）。

原示例把宽度写在了内层 `.progress-bar` 上（`style="width: 50%"`），内联样式覆盖
了 `width:100%`；而外层 `.progress` 没有宽度，作为 flex 子项只能按内容宽收缩
（实测 51px）。三个 51px 的容器并排，各自内部的 bar 再按 50%/30%/15% 缩——文字
（white-space:nowrap）超出 bar 溢出，互相压叠。

## 影响范围

- 仅 12 式例 3 一处；示例 2 的普通 `.progress`（宽度在 bar 上）是正确的，不受影响；
- 全站其他章节未用 progress-stacked。

## 复现方法

1. `python3 -m http.server 8899 --directory site` 后访问
   http://127.0.0.1:8899/bootstrap/12-carousel.html；
2. 滚动到“例 3 · 组合进度条”；
3. 观察：三段挤在左侧、文字重叠。

## 修复方案

- 宽度从 `.progress-bar` 移到 `.progress`（50%/30%/15%），bar 不写宽度由
  `width:100%` 规则撑满；
- 正文与源码块注释各补一句：“width 写在各条 .progress 上，bar 自动撑满”；
- 数值维持 50/30/15（合计 95% ≤ 100% 的示范意图不变）。

修复后 CDP 实测：三段 left/right 无缝相接（gap=0）、零水平重叠，
bar 各占所属 progress 的 100%，文字单行清晰。http 与 file:// 双模式零报错。

## 预防措施

- 用进度条前先区分两种结构：**单条** `progress > progress-bar`（宽度在 bar 上）；
  **组合** `progress-stacked > progress > progress-bar`（宽度在每段 progress 上）。
- 验收时用 CDP 读 `getBoundingClientRect` 的相邻元素 right/left：`gap ≥ 0` 仅证明贴合，
  还要看各段宽度与设定的百分比是否一致。
- conventions.md 的“演示源码与预览逐字一致”同样要求：结构改后源码块同步。

## 相关

- 文件：`site/bootstrap/12-carousel.html`
- 关联：`bug-fix/carousel-caption-overlap.md`（同页另一处绝对定位/宽度类坑）、
  `.agents/notes/conventions.md`（演示区块规则）
