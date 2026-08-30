# 坑：has-toc 网格下正文因 `margin: 0 auto` 撑破 46rem 列、压住右侧目录

> 状态：已修复 · 发现场景：用户报告“除早期打样页外，正文与右侧目录排版错乱” · 相关版本：无（纯 CSS 网格行为）

## 现象

- 窗口宽度 ≥1400px（右侧 TOC 出现）时，Bootstrap 02–16 式、jQuery 02–10 式等
  **代码行较长的章节页**，正文 `main` 宽度超过第一列（46rem = 736px），
  实测最宽达 923px——正文内容（演示卡片、代码块、文字）横向溢出到列间距和
  右侧 TOC 区域，与目录叠在一起，观感错乱；
- 早期打样页（bootstrap-01、jquery-01 等）代码行较短，min-content 小于列宽，
  侥幸不露馅，因此看起来“只有部分页面坏了”；
- 宽度 <1400px 无此问题（无 grid，TOC 隐藏）。

## 根因

`.content.has-toc` 在 ≥1400px 是 `grid-template-columns: minmax(0, 46rem) 14rem`，
`main` 是网格子项。但基础规则 `main { margin: 0 auto; }`（为无 TOC 时居中而设）
**仍然生效**：CSS Grid 里子项带 auto 边距时，其宽度按 `fit-content` 求解，
而不再拉伸到轨道宽度。fit-content 下限是内容的 min-content——
演示源码块 `pre` 的最长代码行（如 12 个 `col-1` 的长标签行）就是那个 min-content。
于是 `main` 宽 = min-content + 左右 padding（923px = 872 + 51.2），
把 736px 的列挤破。设置 `min-width: 0` 无效——fit-content 用的是内容
min-content，不看 `min-width` 属性。

与坑 `footer-grid-margin-shrink.md` **同源**：都是 grid 子项残留 `margin: 0 auto`
导致不拉伸（那个坑里页脚收缩到 652px，这个坑里正文膨胀到 923px）。

## 影响范围

≥1400px 且正文有 TOC 的页面；代码行越长的章节错位越严重。共涉及
Bootstrap 01–16、jQuery 01–10 共 26 个章节页（打样页轻、后续页重）。
无功能损失，纯排版观感。

## 复现方法

```bash
# 1600px 宽窗口打开 bootstrap/02-grid-1.html，CDP 测量：
#   main 的 getBoundingClientRect().width 为 923（修复前）/ 736（修复后）
node tools/verify-cdp.js  # 或自定义 CDP 脚本加宽窗口
```

## 修复方案

`site/assets/css/site.css` 的 ≥1400px 媒体查询内：

```css
.content.has-toc main { grid-column: 1; max-width: none; margin: 0; min-width: 0; }
.content.has-toc .site-footer { grid-column: 1; margin: 0; min-width: 0; }
```

- `margin: 0`：去掉 auto 边距，子项恢复 stretch 到 736px 列宽；
- `min-width: 0`：双保险，解除 auto 最小尺寸，未来再出现超长代码行时
  代码块内部横向滚动（`pre` 已有 `overflow: auto`），不会再撑破布局。

## 预防措施

- 规则（并入 footer-grid-margin-shrink.md 的同款规则）：
  **grid 容器内需要占满列宽的子项，不要保留 `margin: 0 auto`**
  （居中交给容器的 `justify-content`）；
- CDP 布局断言：TOC 存在时 `main` 与 `.site-footer` 宽度必须等于 736px
  （46rem），超出即视为该坑复发；
- 新章节若演示源码行很长，验证时务必用 ≥1400px 窗口看一眼右侧 TOC。

## 相关

- 文件：`site/assets/css/site.css`
- 关联：同源坑 `footer-grid-margin-shrink.md`；`../architecture.md` §5（布局规格）
