# 技能：register-chapter（登记章节 / 新页面）

> 用途：在 `site/assets/js/site.js` 的 `SECTIONS` 中登记新章节或新页面，
> 让侧边栏、分卷列表、翻页顺序自动更新。

## 原则

- `SECTIONS` 是**全站目录的唯一数据源**：只改这里，不要手改任何页面的侧边栏 HTML。
- 文件位置：`site/assets/js/site.js` 顶部 `var SECTIONS = [...]`。
- 修改后必须 `node --check site/assets/js/site.js`。

## 1. 登记一个普通章节（最常见）

在对应回（`bootstrap` / `jquery`）的 `chapters` 数组里按 num 顺序加入：

```js
{ num: '02', href: 'bootstrap/02-grid-1.html', title: '容器与栅格（上）', desc: 'container、row、col 与十二列系统、五大断点' }
```

字段说明：
- `num`：两位字符串（'01'…'16'），生成 data-page `bootstrap-02` 与印章文字；
- `href`：**相对站点根**的路径（不要带 `../`）；
- `title`：章节名（同时是页头 h1 与侧边栏文字）；
- `desc`：一句话简介（分卷页卡片与搜索索引使用）。

注意：文件名 slug 一旦登记并发布，就不要改名（外部链接会失效）。

## 2. 登记非章节页面（藏经阁条目、练功场等）

- 藏经阁条目：加进 `archive` 的 `chapters` 数组，`num` 留空字符串：
  ```js
  { num: '', href: 'archive/icons/index.html', title: '图标大全', desc: '' }
  ```
- 练功场等独立工具页：在 `SECTIONS` 之后追加 `PAGES` 条目并给 `data-page`，
  页面自身 `<body data-page="playground">`，侧边栏如需入口可在 `renderSidebar` 中加链接。
- 非章节页的翻页顺序：`PAGES` 数组按阅读顺序平铺，手动插入即可。

## 3. 验证

```bash
node --check site/assets/js/site.js
# 浏览器打开分卷页（如 /bootstrap/）确认新章卡片出现；
# 打开新章页确认：侧边栏高亮、页头印章、上一式/下一式正确。
```

## 提醒

- `PAGES` 由 `SECTIONS` 自动生成，**不要**手动维护其中的章节条目；
- 改动后若在已打开页面看不到变化，刷新浏览器（无缓存问题则 Ctrl+F5）。
