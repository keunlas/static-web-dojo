# 坑：TOC 链接用 class="h2" 撞上 Bootstrap 标题类（32px 巨字）

> 状态：已修复 · 发现场景：打样阶段用户反馈“右侧标题栏有问题” · 相关版本：Bootstrap 5.3.8

## 现象

- 章节页右侧「本式目录」里的链接渲染成 **32px 巨型标题字**（正常应为 13.6px）；
- 用户肉眼可见右侧栏完全不像目录，误以为是设计问题。

## 根因

`site.js` 的 `injectToc()` 生成目录链接时写的是
`<a class="h2" …>` / `<a class="h3" …>`（本意是标记层级）。
但 **Bootstrap 自带 `.h2`/`.h3` 标题类**（`h2, .h2 { font-size: 2rem }`），
目录链接被当成标题渲染成巨字。站点 CSS 里只有 `.toc a.h3` 的覆盖规则，压不住
Bootstrap 的 `.h2` 类。

## 影响范围

所有章节页（h2 ≥ 2 个即生成 TOC）的右侧目录显示异常。

## 复现方法

```bash
python3 -m http.server 8899 --directory site
# 窗口宽度 ≥1400px 打开 http://127.0.0.1:8899/bootstrap/01-intro.html
# 观察右侧“本式目录”字号；CDP 断言：getComputedStyle(tocLink).fontSize === '32px'
```

## 修复方案

1. `site.js`：目录层级类名改为 `l2`/`l3`（避开 Bootstrap 标题类），并加注释说明原因；
2. `site.css`：`.toc a.l2, .toc a.l3` 基础样式 + `.toc a.l3` 缩进变小；
3. 顺手修复同区域第二个问题：TOC 只收录正文标题——`injectToc` 用
   `.filter()` 排除 `.demo / .practice / details.answer / .callout` 内的 h2/h3
   （写作代理发现：照官方文档在演示里写 `<h2 class="accordion-header">` 会污染目录）。

## 预防措施

- 约定：**站点自定义类名禁止裸用 Bootstrap 已有类名**（如 `h2`/`h3`/`card`/`btn`），
  层级标记类一律用项目自有前缀（`l2/l3`）；
- `../skills/verify-offline.md` 的布局测试要求：TOC 存在时断言 `.toc a` 的
  `fontSize ≈ 13.6px`（不是 32px）；
- CDP 布局测量（`/tmp/cdp-layout.js` 风格）已作为常规检查手段。

## 相关

- 文件：`site/assets/js/site.js`（injectToc）、`site/assets/css/site.css`
- 关联：`../skills/build-demo.md`（演示内避免 h2/h3）、`../architecture.md` §3
