# 坑档案（bug-fix）

> 本目录记录项目历史上踩过的每一个坑：**一坑一文件**，按统一模板详细描述，
> 供后来的 AI 代理与协作者在动手前查阅，避免重蹈覆辙。

## 写作模板（新坑按此结构写）

```markdown
# 坑：<一句话标题>

> 状态：已修复 · 发现场景：<在做什么时发现> · 相关版本：<如 jQuery 4.0.0>

## 现象
（用户/测试看到什么：报错原文、页面表现、日志）

## 根因
（为什么发生：机制层面的解释，写清因果链）

## 影响范围
（哪些页面/功能受影响，影响多大）

## 复现方法
（可操作的复现步骤，含命令/URL）

## 修复方案
（怎么修的：关键改动、文件与行、修后的代码要点）

## 预防措施
（工具/约定/检查项层面的兜底，防止复发）

## 相关
- 文件：<涉及的文件>
- 关联：<相关笔记/技能/其他坑>
```

## 档案索引

| 文件 | 一句话 |
| --- | --- |
| `dynamic-script-order.md` | 动态注入脚本不保证按插入顺序执行，导致随机 `$ is not defined` |
| `toc-bootstrap-h2-class-collision.md` | TOC 链接用 `class="h2"` 撞上 Bootstrap 标题类，右侧目录变 32px 巨字 |
| `footer-grid-margin-shrink.md` | 宽屏 grid 内页脚因 `margin:0 auto` 收缩，与正文列错位 |
| `jquery-filename-with-version.md` | jQuery 文件名带版本号（`jquery-4.0.0.min.js`），同步脚本曾写错 |
| `site-js-used-removed-jquery-trim.md` | 站点自己的 site.js 用了 jQuery 4 已移除的 `$.trim`，全站搜索静默失效 |
| `positional-pseudos-fact-conflict.md` | 两代理对“位置伪类是否移除”说法冲突，以源码为准定论的教训 |
| `has-toc-main-margin-auto-overflow.md` | has-toc 网格下正文残留 `margin: 0 auto` 被 fit-content 定宽，长代码行撑破 46rem 列压住右侧目录 |
| `raw-codeblock-double-escape.md` | text/plain 源码块里写 HTML 实体（script raw text 不解码），代码块双重转义显示 `&lt;` |
| `favicon-black.md` | favicon SVG 字符串手写 `%23` 后又过 encodeURIComponent，二次编码成非法颜色，图标漆黑一片 |
| `carousel-caption-overlap.md` | carousel-caption 绝对定位钉在底部，内容块太矮时与标题文字重叠 |
| `carousel-progress-stacked-width.md` | progress-stacked 的宽度写在 .progress-bar 上，各段按内容宽挤成一团 |
| `404-deep-path-relative-links.md` | 404 页被“原地”渲染在深路径时相对引用全失效（含 loader 自身），需逐级上探 + SITE_ROOT 改写 |
| `jquery4-removed-api-misjudgment.md` | 把“弃用”当“移除”：`.bind/.delegate/$.proxy` 其实仍在，移除清单被 grep 误判 |
| `scrollspy-anchor-id-on-heading.md` | 滚动监听的 id 挂在小标题上，标题滑出视野后高亮全灭；id 应挂整节容器 |
| `unwrap-parent-not-stage.md` | `unwrap()` 拆的是“被选中元素的父级”，选错了对象会把演示的舞台容器整个拆掉 |
| `uniquesort-not-for-numbers.md` | `$.uniqueSort` 只对 DOM 元素数组去重排序，数字数组原样返回，演示“点了没反应” |

## 使用约定

- 修完一个新 bug 后，**立即**在本目录按模板新增一个文件，并更新上面的索引表；
- 同时检查是否需要在对应 notes / skills 里补一行预防措施（见 `skills/doc-sync/SKILL.md`）；
- `notes/architecture.md` 只保留坑的一句话索引，详细内容以本目录为准。
