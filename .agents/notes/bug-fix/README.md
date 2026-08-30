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

## 使用约定

- 修完一个新 bug 后，**立即**在本目录按模板新增一个文件，并更新上面的索引表；
- 同时检查是否需要在对应 notes / skills 里补一行预防措施（见 `skills/doc-sync.md`）；
- `notes/architecture.md` 只保留坑的一句话索引，详细内容以本目录为准。
