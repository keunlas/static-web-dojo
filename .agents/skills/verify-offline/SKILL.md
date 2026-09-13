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
写完的脚本可沉淀到 `tools/verify/` 以便复用。

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
| table-dark 断言误判 | 背景实际落在 `th` 单元格上 → 查 `th` 的 backgroundColor，别查 `thead` |
