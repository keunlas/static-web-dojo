---
name: verify-offline
description: 验证页面在 http:// 与 file:// 两种打开方式下都正常渲染、交互、无报错，且不依赖任何互联网资源。适用于改完任何页面后执行。
---

# 技能：verify-offline（双模式与离线验证）

> 用途：验证页面在 http:// 与 file:// 两种打开方式下都正常渲染、交互、无报错，
> 且不依赖任何互联网资源。改完任何页面后都应执行。

## 1. 静态检查（最快，先做）

```bash
cd <项目根>

# a) JS 语法
node --check site/assets/js/loader.js
node --check site/assets/js/site.js
node --check site/assets/js/highlight.js

# b) 离线纯净 + 内部链接 + 公共 JS 禁用 API（现成脚本，一站式）
bash tools/check-offline.sh
python3 tools/check-links.py
python3 tools/check-demo-parity.py   # 每个 .demo 的“源码块 = 预览”一致性
python3 tools/check-demo-classes.py  # 基础篇演示类名是否撞 Bootstrap / site.css（应无输出）

# b2) check-offline.sh 的 2b 项已覆盖：公共 JS 里 jQuery 4 **已移除** API
#     （$.trim/.type/.isArray/.isFunction/.isNumeric/.isWindow/.parseJSON/.now/.live/.die）。
#     注意：.bind/.delegate/.hover/$.proxy 只是弃用、仍可调用，别写成“已移除”
#     （事实清单与实测方法见 notes/bug-fix/jquery4-removed-api-misjudgment.md）。
#     曾因 site.js 用 $.trim 导致全站搜索静默失效。

# c) 搜索索引与图标页是否最新（新增页面后）
python3 tools/gen-search-index.py && git status --short site/assets/js/search-index.js
```

> check-offline.sh 已排除第三方镜像；<a> 文字外链会列出供人工核对。

## 2. 本地服务器验证

```bash
python3 -m http.server 8899 --directory site   # 保持运行
curl -s -o /dev/null -w "%{http_code} %{url_effective}\n" http://127.0.0.1:8899/<待测路径>
```

## 3. 无头浏览器验证（CDP，真实验证渲染与交互）

项目无 npm 依赖，用 Node 内置 WebSocket + 系统 Chromium（已装）驱动。
核心思路：CDP 连接 `--remote-debugging-port`，导航后等待，再 `Runtime.evaluate` 采集标记。

**必须采集的渲染标记**（任一缺失即失败）：

| 标记 | 含义 |
| --- | --- |
| `#sidebar .side-chapters a` 数量 > 0 | 侧边栏注入成功 |
| `#sidebar-offcanvas` 存在 | 移动端抽屉就绪 |
| `.chapter-header` 存在（home 除外） | 页头注入成功 |
| `.codeblock` 数量 ≥ 源码块数 | 高亮器执行成功 |
| `.toc` 存在（h2≥2 时） | 右侧目录生成 |
| `#site-footer` 内容长度 > 0 | 页脚/翻页注入成功 |
| 无 `Runtime.exceptionThrown` | 零 JS 报错 |

**交互测试**：对含 jQuery 演示的页面，evaluate 中模拟点击并断言效果变化
（如点击按钮后文本从 A 变 B）。新写的演示（滚动、过渡、异步）**必须逐条做操作级断言**——
只做静态标记检查会把“点了没反应”的问题放过去（滚动监听 id 挂错位置的教训见
`notes/bug-fix/scrollspy-anchor-id-on-heading.md`）。

**布局测试**：对含 TOC 的页面，在 ≥1400px 宽度下测量 `.toc` 与 `#main` 的
`getBoundingClientRect()`，断言无重叠、`.toc a` 的 fontSize ≈ 13.6px（不是 32px）。

脚本模板与实现细节见会话中用过的方式（`/tmp/cdp-check.js` 风格）；
写完的脚本可沉淀到 `tools/verify/` 以便复用。现成两件：

- `node tools/verify-cdp.js <url…>`：批量打开页面，打印渲染标记 + 页面报错（http / file 通用）；
- `node tools/verify/cdp-eval.js <url> "<表达式>" …`：在页面里跑单条表达式，
  用来做**操作级断言**（读计算样式、查 DOM、点按钮后再读值）；
  视口默认 1280×900，用 `VIEWPORT=1600x1000` 覆盖（检查右侧目录时用这个宽度）；
  例：`node tools/verify/cdp-eval.js "file:///…/site/basics/02-html-text.html"
  "getComputedStyle(document.querySelector('#main mark')).backgroundColor"`。
- `node tools/verify/cdp-shot.js <url> <out.png> [宽] [高]`：整页截图，用来**人工目检**版式
  （新写的章节建议拍一张，看看演示区块、表格、代码块在纸墨风下是否好看）；
  只想看某一小块时用 `CLIP="x,y,w,h"` 截取区域（先用 `cdp-eval.js` 量出元素的
  `getBoundingClientRect().top + scrollY` 即可），例如
  `CLIP="0,4765,1200,700" node tools/verify/cdp-shot.js "<url>" /tmp/demo.png`。
  **验证悬停动效**时加 `HOVER_SELECTOR="选择器"`：脚本会用 CDP 强制给命中元素加上 `:hover`，
  等过渡播完再截图（例：`HOVER_SELECTOR="#css24-demo4 .d-card"`），
  这样“鼠标移上去会怎样”也能留下可复核的图片证据。

> ⚠️ **这几个 CDP 工具一律串行跑，别并行**（2026-09-14 第三十八式实测踩到）：
> `cdp-eval.js` 固定用 9334、`verify-cdp.js` 固定用 9333，两个同工具并行时
> 后一个会连上前一个的浏览器实例，断言结果被别的操作污染（当时读到过“10 次输入被点了两遍”的 20/6/0）。
> 同一时刻只跑一个；卡住的进程用 `ps -eo pid,etime,cmd | grep cdp-eval` 找到后清掉
> （连带它的 Chromium，按 `--user-data-dir=/tmp/cdp-eval-*` 精确匹配，别误杀真浏览器）。
> ⚠️ **别用 `pkill -f "cdp-eval.js"` 这类按子串匹配的清理命令**：执行清理的那条 shell
> 自己的命令行里也含这个子串，会把自己杀掉（退出码 143、后续步骤静默不执行）。
> 正确姿势是 `pgrep -fa <完整命令行>` 看候选 → `ps -o pid=,etime=,cmd= -p <PID>` 核对
> → `kill <PID>` 只杀具体进程（坑档案：`bug-fix/pkill-f-kills-own-shell.md`）。

> 沙箱里 Chromium 需要绑定本地调试端口，若报 `Operation not permitted` / 端口未就绪，
> 按权限流程以提权方式重跑（本项目实测如此）。

## 4. file:// 验证

CDP 的 `Page.navigate` 直接给 `file:///绝对路径/site/<页面>` 再跑同一套标记检查。
重点确认：`window.SITE_ROOT` 正确推导、无 fetch/CORS 报错、样式字体正常加载。

## 5. 内部链接检查

遍历 `site/`（排除 archive 镜像）所有 html，解析 `href`/`src` 相对路径，
逐一断言目标文件存在。实现可用 Python（html.parser + os.path）。

## 6. 常见失败对照

| 现象 | 原因与修复 |
| --- | --- |
| 随机 `$ is not defined` | 注入脚本乱序 → loader 必须链式加载（已修复）；新代码别破坏链 |
| TOC 链接 32px 巨字 | 用了 Bootstrap `.h2/.h3` 类 → 必须用 `l2/l3` |
| file:// 下资源 404 | 相对路径层级写错（深度 1 用 `../`，深度 2 用 `../../`） |
| favicon 404 | 未走 loader 的独立页自己补 `<link rel="icon">`（内嵌 SVG data URI） |
| id 唯一性误报 | grep 会把 text/plain 源码块里的示例 id 也计入 → 先剔除 text/plain 内容再查 |
| `.show()` 断言失败 | jQuery 把 style.display 置回默认值 → 用 getComputedStyle 断言 |
| 表单校验色断言误判 | `.form-control` 边框色有 0.15s 过渡 → 改类后等 ≥250ms 再读计算样式 |
| 过渡类断言普遍偏早 | headless Chromium 下过渡完成明显慢于标称时长 → 读计算样式前等 ≥1s，或断言页面自写的内联值 |
| 亮色断言受系统暗色干扰 | headless 默认 prefers-color-scheme: dark，UA 默认控件色随系统变 → 站点皮肤已声明 `color-scheme: light`；断言优先测页面自己写的内联样式值 |
| 聚焦断言假失败（脚本没反应、`:focus` 样式不生效） | 无头 Chromium 默认**窗口没有焦点**：`focus()` 不派发聚焦事件、`document.hasFocus()` 为 false。`tools/verify/cdp-eval.js` 已开启 `Emulation.setFocusEmulationEnabled`；若用别的方式驱动，记得补这一步 |
| 用 `element.click()` 测“点击后聚焦”没反应 | `.click()` 是**合成事件**，不会像真实鼠标那样移动焦点（对靠 `tabindex` 聚焦的 div 尤其明显）→ 改用 `element.focus()` 断言聚焦逻辑，或用 CDP `Input.dispatchMouseEvent` 模拟真实点击 |
| `elementFromPoint` / 坐标断言突然全为 null | 本站 `html { scroll-behavior: smooth }`：`scrollIntoView()` 是**动画滚动**，紧接着取的坐标还在途中 → 断言前先 `document.documentElement.style.scrollBehavior='auto'`，`window.scrollTo(0, 绝对坐标)`，并在 `requestAnimationFrame` 里再取坐标 |
| table-dark 断言误判 | 背景实际落在 `th` 单元格上 → 查 `th` 的 backgroundColor，别查 `thead` |
| check-offline.sh 报“脚本体内调用了 fetch()” | 多半是演示的特性检测清单里写了带括号的字符串（如 `'fetch()'`）→ 真实脚本里提到被禁 API 时别带调用括号（第四十一式踩到，改成 `'fetch 网络请求'` 即通过） |
