# 写作规范（conventions）

> 写给 AI 代理：写任何 `site/` 下的 HTML 页面之前必读。打样章节
> `site/bootstrap/01-intro.html` 与 `site/jquery/01-intro.html` 是全部规范的活例。

## 1. 页面骨架（逐字照抄）

```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>第X式 · 章节名 | 第X回 XXX篇 | 纯静态网页的修行</title>
<meta name="description" content="一句话简介">
<script src="../assets/js/loader.js"></script>
</head>
<body data-page="bootstrap-02">
<a class="skip-link" href="#main">跳到正文</a>
<div class="layout">
  <aside class="sidebar" id="sidebar" aria-label="全站目录"></aside>
  <div class="content">
    <main id="main">
      ……正文从这里开始……
    </main>
    <footer class="site-footer" id="site-footer"></footer>
  </div>
</div>
</body>
</html>
```

- loader 前缀按页面深度：根目录 `assets/js/loader.js`；一层 `../`；两层 `../../`。
- `data-page` 必须与 site.js 中登记一致（见 register-chapter 技能）。
- 正文**不写 `<h1>`**（页头由 site.js 注入）；从章首语开始，用 h2/h3 组织小节。
  例外：演示预览内的 `display-*` 标题类可照常使用（属于演示内容，不算正文标题）。

## 2. 章节五段式（每章固定结构）

1. **章首语**：`<p class="chapter-lead">` 一两句有味道的开场（1–3 句）；
2. **本式要点**：`<div class="callout"><div class="callout-title">本式要点</div><ul>3–5 条</ul></div>`；
   （内容单一时 3–4 条即可；组件/方法密集的章节实测多为 5 条，以“说全要点”优先，不硬凑不硬删）
3. **讲解与演示**：3–6 个 h2 小节，先讲道理（通俗、准确），再放现场演示。全章 ≥3 个 `.demo`；
   **例外**：收尾的“综合修炼”章（Bootstrap 16、jQuery 10）以代码拆解 + 完整成品链接为主，
   按任务要求可 0 个 .demo；
4. **练功**：`<div class="practice">` 内 3 道题（2 动手 + 1 思考），每题配一个
   `<details class="answer"><summary>参考答案 N</summary>…</details>`，答案给代码 + 解释；
5. **小结与预告**：`<h2>本式小结</h2>` + `<ul>` 要点，最后 `<blockquote>下一式，……</blockquote>`。

## 3. 演示区块（.demo）

```html
<div class="demo">
  <div class="demo-caption">例 1 · 一句话说明</div>
  <div class="demo-preview">
    ……真实可运行的代码（读者能直接看到/操作效果）……
  </div>
  <div class="demo-source">
    <script type="text/plain" data-lang="html" data-title="页面结构">
      ……源码，无需手动转义……
    </script>
    <script type="text/plain" data-lang="js" data-title="交互脚本">
      ……第二个源码块（可选）……
    </script>
  </div>
</div>
```

规则：
- 源码块用 `<script type="text/plain" data-lang="html|css|js" data-title="…">`，内容不转义；
- ⚠️ 源码内出现 `</script>` 必须写成 `<\/script>`（HTML 解析器限制，高亮器会自动还原）；
- **源码块必须与预览逐字一致（用户明确要求）**：不要把重复结构写成“同理/结构相同/省略/复制即可”
  或“（节选）”，也不要把外层容器、标签行（`<p class="mb-1"><strong>…</strong></p>` 这类说明行）、
  `mb-*` 等修饰类省掉——源码里的代码粘贴出去应能 100% 还原预览。结构块（非 .demo 的教学示例）同理。
  写完用它自查：`python3 - <<'EOF'` 对比预览与源码的标签多重集（见 progress.md 2025 轮次的脚本）。
- 预览内交互脚本：jQuery 必须包 `$(function(){…})`（loader 排队桩保证 jQuery 就绪后放行）；
  需要 `bootstrap` 全局（tooltip/popover 手动初始化）必须包 `DOJO.ready(function(){…})`；
  纯原生 JS 的交互脚本同样可以用 `DOJO.ready` 排队（等价于“全部资源就绪后再动手”）；
- Bootstrap 组件（dropdown/collapse/modal/tabs/toast）用 `data-bs-*` 属性自动生效，无需 JS；
- 预览内 id 全页唯一，用章节前缀（如 `#bs08-demo1`、`#jq03-demo2`）；源码块里的 id 必须与预览一致；
- 演示效果要在**本站皮肤下**也好看（纸墨风，见 style-guide）。

## 4. 常用样式类清单（site.css 已提供，直接用）

| 类 | 用途 |
| --- | --- |
| `.callout` / `.callout.warn` | 要点/心法提示框；warn 变体黄色左边线 |
| `.callout-title` | 提示框标题（宋体、深朱砂） |
| `.demo` `.demo-caption` `.demo-preview` `.demo-source` | 演示区块四件套 |
| `.practice` `.practice-title` | 练功区（虚线框） |
| `details.answer` / `summary` | 参考答案折叠（无需 JS） |
| `.chapter-grid` `.chapter-card` | 分卷页章节卡片（site.js 自动生成，勿手写） |
| `.realm-grid` `.realm-card` | 首页/藏经阁的分卷卡片 |
| `.feature-grid` `.feature` | 首页特性卡片 |
| `.seal` `.seal-small` | 朱砂印章（章序号） |
| `main table` | 普通表格自动有纸墨样式 |
| `blockquote` | 引言/预告（朱砂左边线） |
| 行内代码 | 直接用 `p code`、`li code`，自动米底朱字样式 |

不存在的样式就说明不该用；不要发明新的自定义 class，确需新增请先在 site.css 追加并说明。
**例外**：`site/demo/` 下的独立整页示例（不经 loader/site.css），允许自带少量 `<style>`
与页内自定义类（作用域仅限该页）；章节页仍然禁止。

## 5. 离线红线（自查项）

1. `<link>/<script>/<img>/<iframe>/<source>/<video>/<audio>` 的 src/href **禁止** `http(s)://`；
2. `<a>` 外链仅限 MDN / VS Code 等必要链接，每章 ≤2 个，能不写就不写；
3. 无 `type="module"`、无 fetch/XHR 读本地文件；
4. 教程中展示“引入方式”示例时，统一用**教学路径** `libs/bootstrap.min.css`、
   `libs/bootstrap.bundle.min.js`、`libs/jquery-4.0.0.min.js`，并说明本站实际放在 vendor 目录；
5. 引用本站资源的相对路径以**当前文件**为基准（如从 `bootstrap/05-*.html` 引藏经阁是
   `../archive/…`，引 demo 是 `../demo/…`，引数据是 `../data/…`）。

## 6. 技术准确性红线

- Bootstrap 5.3.8：bundle 版已含 Popper；tooltip/popover 需手动 `new bootstrap.Tooltip(el)` 初始化；
  toast 是**纯 JS opt-in**（`bootstrap.Toast.getOrCreateInstance(el).show()`，没有 data-bs-toggle 触发方式，
  仅关闭按钮用 `data-bs-dismiss="toast"`）；alert 关闭按钮用 `data-bs-dismiss="alert"`；
  tab 切换用 `data-bs-toggle="tab"`、胶囊用 `data-bs-toggle="pill"`（导航类组件）；
  `navbar-expand-*` 会在对应断点自动展开菜单并隐藏 toggler，**不要**再给 toggler 加 `d-lg-none` 之类的类；
  组合进度条用 `.progress-stacked` 包裹多条 `.progress`。
  5.3 弃用点（写教程不要教旧写法）：badge 用 `text-bg-*`（`bg-*` 已弃用）；
  深色导航栏用 `data-bs-theme="dark"`（`navbar-dark` 已弃用）；
  input-group 内放 invalid-feedback 需给 input-group 加 `has-validation`。
- jQuery 4.0.0（以下事实均以 `reference/jquery/jquery-4.0.0.js` 源码为准）：
  - **已彻底移除**（调用即报错）：`$.trim`、`$.type`、`$.isArray`、`$.isFunction`、`$.isNumeric`、
    `$.isWindow`、`$.parseJSON`、`$.now`、`$.nodeName`、`$.camelCase`、`.live`、`.die`——
    用原生 `String.prototype.trim()` / `typeof` / `Array.isArray()` / `JSON.parse()` / `Date.now()` 与
    `on/off` 替代；
  - **仍在、只是弃用**（别再写成“已移除”！）：`.bind/.unbind/.delegate/.undelegate/.hover` 与
    `$.proxy`——它们只是 `on/off` 等新 API 的马甲，仍可调用；教程统一教新写法是风格与未来兼容考虑。
    **核实方式：`tools/check-offline.sh` 的 2b 项 + 浏览器实测（悬案记录见
    `bug-fix/jquery4-removed-api-misjudgment.md`）**；
  - **仍然存在可用**：位置伪类选择器 `:first/:last/:even/:odd/:eq/:lt/:gt/:nth`
    （源码 `jQuery.expr.pseudos` 约 1874–1929 行，`createPositionalPseudo`）——
    教程推荐 `.first()/.eq()` 方法是**风格建议**（性能与可读性更好），不是兼容性要求，不要写成“4.0 已移除”；
  - 其他已核实事实：`$.get/$.post/$.getJSON` 齐全；`$.ajax` 支持 `method`（`type` 为别名）；
    `animate()` 支持 `'show'/'hide'/'toggle'` 特殊值；`fn.load(url + 空格 + 选择器)` 可截取片段；
    `attr/text/html/val/css` 回调形如 `function(index, oldValue)`；`off(type, selector)` 解绑委托需与绑定时选择器一致；
    `css('width')` 读回计算后像素值。
- 代码用半角标点；中文叙述用全角标点。
- 不确定的 API 行为先去 `reference/bootstrap/bootstrap-offline-docs-5.3` 查证，不要编造。
- **类名是否存在的最终裁判是编译产物**：`grep` 查 `site/assets/vendor/bootstrap/bootstrap.min.css`
  （离线文档镜像的 API 清单可能不全）；图标类名同理查 `bootstrap-icons.min.css`。

## 7. 完成自查（提交成果前必须全过）

```bash
# 1) 外链检查（除允许的 <a> 外应为空）
grep -nE '(src|href)="https?://' <你写的文件>
# 2) script 标签配平：<script 开标签数 == </script> 闭合数；
#    （源码块数 text/plain 恒小于 </script> 数——差值来自 loader 与预览真实脚本）
grep -c '<script' <你写的文件> && grep -c '</script>' <你写的文件>
# 3) UTF-8 合法
python3 -c "open('<你写的文件>','rb').read().decode('utf-8')"
# 4) data-page 与文件名和 site.js 登记一致（人工核对）
# 5) 浏览器验证见 skills/verify-offline/SKILL.md
# 6) 演示源码块与预览一致性（机器核对，全站或单文件）
python3 tools/check-demo-parity.py
python3 tools/check-demo-parity.py site/jquery/10-todo.html
```

⚠️ **该工具的已知盲区**（2026-09 内容审查时确认）：它只比对
「标签名 + class 多重集」与归一化后的 JS，**不比对正文文字、id、href、
`data-bs-*`、style 等属性**。因此：

- 预览与源码块“文字不同 / 属性不同”的问题它抓不到（历史上已漏过 3 处：
  03-grid-2 例 7 少一句文案、11-collapse 例 1 少半句、14-icons 例 1 的 href 写成 `#`）；
- 写完或改完演示，除跑本脚本外，还要**人工比对文字与属性**（或临时用更严格的
  标签+属性+文字级比对脚本）；发现新盲区时优先考虑把比对升级进工具。
