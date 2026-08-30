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

# b) 离线纯净：站内资源类外链必须为空（允许 <a> 文字外链）
grep -rnE '<(link|script|img|iframe|source|video|audio)[^>]+(src|href)="https?://' \
  site/index.html site/basics site/bootstrap site/jquery site/archive/index.html site/playground 2>/dev/null
# 注：site/archive/bootstrap-docs 与 examples 是第三方镜像，不纳入本检查

# c) 禁用的模块/网络 API 扫描（应无输出）
grep -rnE 'type="module"|fetch\(|XMLHttpRequest' site/index.html site/basics site/bootstrap site/jquery || true
```

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
（如点击按钮后文本从 A 变 B）。

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
| favicon 404 | 未走 loader 的页面自己补 `<link rel="icon">` 或干脆不引 |
