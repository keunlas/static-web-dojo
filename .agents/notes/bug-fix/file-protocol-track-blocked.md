# 坑：file:// 下字幕轨（.vtt）被浏览器当作跨源请求拦下

> 状态：已知限制（已在章节内说明，不做代码绕过） · 发现场景：
> 2026-09-14 写基础篇第五式《音视频与嵌入》时，用 CDP 在 file:// 下跑演示断言
> · 相关版本：Chromium 2026 年版本（Firefox 行为同理：file: 视为独立来源）

## 现象

页面在 `file://` 下双击打开时，`<video>` 里的 `<track src="….vtt">` 加载被拒绝，
控制台出现：

```
Unsafe attempt to load URL file:///…/site/assets/media/demo-fade.zh.vtt
from frame with URL file:///…/site/basics/05-html-media.html.
'file:' URLs are treated as unique security origins.
```

表现：视频能播、封面与控件都在，唯独**字幕不出现**。
同一页面用 `python3 -m http.server` 起服务后访问，字幕正常显示。

## 根因

浏览器把每个 `file://` 文档当作**彼此隔离的独立来源**（opaque origin），
于是页面读取另一个本地文件（字幕、JSON、其它 fetch 目标）会被按跨源请求拦下。
这与第三回第九式 Ajax 读取本地 JSON 失败是**同一条安全策略**；
区别只在：`src` / `href` 类资源（`img`、`script`、`link`）在 file:// 下被放行，
而 `<track>`、`fetch`、XHR 这类需要“跨源读取”的路径被拦。

## 影响范围

- 仅基础篇第五式例 1 的**字幕显示**（视频、音频、iframe 均不受影响，已实测）；
- 站点其它页面不使用 `<track>`，无影响；
- `file://` 下该页会多一条控制台 LOG（resource 级错误，非 JS 异常）。

## 复现方法

```bash
# 方式一：双击 site/basics/05-html-media.html，播放例 1 的视频，字幕不出现
# 方式二（可复现的控制台证据）：
node tools/verify/cdp-eval.js "file:///…/site/basics/05-html-media.html" \
  "document.querySelector('#main video').textTracks.length"
#   → errors 字段里就是那条 LOG
# 方式三（正常表现）：起服务后同一断言不再报错
python3 -m http.server 8899 --directory site
node tools/verify/cdp-eval.js "http://127.0.0.1:8899/basics/05-html-media.html" \
  "document.querySelector('#main video').textTracks.length"
```

## 处理方案

不绕过（用 JS 内联字幕会破坏“演示源码 = 预览”的一致性，也会教错写法），改为**如实说明**：

1. 章节内加了一条 `callout warn`，明说 `file://` 下字幕会被拦、需本地服务器或部署后查看
   （与 Ajax 章同一处理口径）；
2. 本坑归档，并在 `architecture.md` 的离线约束清单里登记为**第二条已知例外**；
3. 新增媒体演示时继续实测：图片、音视频、iframe 在 file:// 下均正常（已断言），
   只有需要“读取另一个文件内容”的机制才受此策略影响。

## 预防措施

- 给页面加入 `<track>`、外部 JSON、fetch 演示时，**先在 file:// 下跑一遍**
  `node tools/verify-cdp.js` + `node tools/verify/cdp-eval.js`，看 `errors` 字段；
- 凡是“效果依赖服务器环境”的演示，一律在章节内用 callout 说明，
  不让读者以为是自己写错了。

## 相关

- 文件：`site/basics/05-html-media.html`、`site/assets/media/demo-fade.zh.vtt`
- 关联：`.agents/notes/architecture.md` §6「离线约束」、conventions.md §5「离线红线」、
  jQuery 第九式《Ajax》（同类限制的另一处说明）
