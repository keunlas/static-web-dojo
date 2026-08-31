# 纯静态网页的修行

> 不修仙，不炼丹。一行一行写页面，把网页的基本功练扎实。

## 这是什么

这是一份关于**纯静态网页**的修行手册。

在这里，我们只使用最朴素的三样工具：

- **HTML** —— 搭建页面的骨架
- **CSS** —— 为页面披上外衣
- **JavaScript** —— 赋予页面交互的灵魂

并借助两位江湖前辈：

- **Bootstrap** —— 让布局与组件信手拈来
- **jQuery** —— 让 DOM 操作化繁为简

仅此而已。

## 我们修行的边界

本教程刻意保持“纯粹”，因此**不涉及**以下内容：

- ❌ React / Vue / Angular 等现代前端框架
- ❌ Webpack / Vite 等构建工具与打包器
- ❌ Node.js 后端、数据库与接口开发
- ❌ TypeScript 等超集语言

我们相信：**把基本功练扎实，比急着上框架更重要。**

## 为什么叫“修行”

写静态页面看似简单，但真正写好它，需要日复一日的练习：

- 标签语义是否清晰？
- 布局是否稳健？
- 样式是否优雅？
- 脚本是否简洁？

每一次落笔，都是一次修行。

## 适合谁

- 完全零基础、想踏入前端世界的初学者
- 学过一点 HTML/CSS，但从未完整写过页面的人
- 想用最朴素的方式，扎实理解“网页是怎么写出来的”的人

## 开始之前

你只需要：

- 一个文本编辑器（VS Code 推荐）
- 一个现代浏览器（Chrome / Edge / Firefox 均可）
- 一颗愿意慢慢练习的心

> 修行没有捷径，但每写一行，你就离“会写网页”更近一步。

## 本教程网站本身

本仓库同时包含教程网站的全部源码，位于 `site/` 目录（零构建、纯静态、完全离线）。

### 本地预览

```bash
# 方式一：直接双击 site/index.html（除 jQuery Ajax 章外全部可用）
# 方式二：起一个本地服务器（全功能，推荐）
python3 -m http.server 8000 --directory site
# 浏览器打开 http://127.0.0.1:8000
```

> jQuery 第九式《Ajax》需要读取本地 JSON 文件，受浏览器安全策略限制，
> 双击打开（file://）时该章演示不可用，请用方式二或部署后访问。

### 同步本地资源

`reference/` 是原始资源库，部署前（或更换版本后）把所需文件复制进 `site/`：

```bash
bash tools/sync-assets.sh          # 同步 vendor 库文件 + 藏经阁（离线文档/示例集）
python3 tools/gen-icons-page.py    # 生成藏经阁图标大全页
python3 tools/gen-search-index.py  # 生成全站搜索索引
python3 tools/gen-sitemap.py --base https://你的域名/  # 生成站点地图（不传 --base 则用占位域名）
```

### 质量检查

```bash
bash tools/check-offline.sh   # 离线纯净性（无外网资源依赖）
python3 tools/check-links.py  # 内部链接有效性
```

### 部署

`site/` 是部署根目录，上传到任意静态服务器即可（相对路径设计，支持根目录或子目录部署）。

- 站点自带 `404.html`（迷路页）：nginx 需要一条 `error_page`；GitHub Pages / Netlify /
  Vercel 等静态托管会自动使用根目录的 `404.html`，无需配置。
- 站点自带 `sitemap.xml`：**部署前请用真实域名重新生成**
  （`python3 tools/gen-sitemap.py --base https://你的域名/`），否则其中是占位域名。

nginx 最小配置示例：

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/static-web-dojo/site;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
}
```

部署检查清单：

- [ ] 已运行 `tools/sync-assets.sh`（vendor 与藏经阁就位）
- [ ] 已运行 `gen-icons-page.py` 与 `gen-search-index.py`
- [ ] 已用真实域名运行 `gen-sitemap.py --base https://你的域名/`
- [ ] `bash tools/check-offline.sh` 通过
- [ ] `python3 tools/check-links.py` 通过
- [ ] 浏览器访问首页、章节页、练功场、图标大全、离线文档均正常
- [ ] 访问一个不存在的地址，确认出现本站 404 迷路页

### 维护文档

面向 AI 代理与协作者的开发规范见根目录 `AGENTS.md` 与 `.agents/` 目录
（架构、写作规范、文风指南、进度笔记、可复用技能）。

