# 坑：宽屏 grid 内页脚因 margin:0 auto 收缩错位

> 状态：已修复 · 发现场景：排查 TOC 问题时顺带测量发现 · 相关版本：无（纯 CSS 行为）

## 现象

- 窗口宽度 ≥1400px（TOC 出现）时，页面底部 `.site-footer` 的宽度是 **652px**，
  而正文列是 **736px**——页脚（含“上一式/下一式”卡片）比正文窄 84px，两边对不齐；
- 宽度 <1400px 时无此问题（此时无 grid，页脚与正文同为居中块）。

## 根因

`.site-footer { max-width: 46rem; margin: 0 auto; }` 在 grid 布局下，
`margin: 0 auto` 使网格项**收缩到 max-content 宽度并居中**（652px = 翻页卡片
内容的最大内容宽度），而不是默认 stretch 到列宽 736px。正文 `#main` 因内容
天然超过 46rem 而撑满，两者宽度出现差异。

## 影响范围

仅 ≥1400px 宽屏、且页面有 TOC 时的页脚对齐观感问题（无功能影响）。

## 复现方法

```bash
# 1440px 宽窗口打开任意章节页，CDP 测量：
getBoundingClientRect() 对比 #main 与 .site-footer 的 width（736 vs 652）
```

## 修复方案

`site.css` 的 ≥1400px 媒体查询内补一条：

```css
.content.has-toc .site-footer { grid-column: 1; margin: 0; }
```

`margin: 0` 使网格项恢复默认 stretch，与列宽一致。

## 预防措施

- 网格子项的对齐检查纳入 CDP 布局测量：TOC 存在时断言
  `main / .site-footer` 宽度相等；
- 规则：**grid 容器内需要占满列宽的子项不要保留 `margin: 0 auto`**
  （居中交给容器的 `justify-content`）。

## 相关

- 文件：`site/assets/css/site.css`
- 关联：`../architecture.md` §5（布局规格）
