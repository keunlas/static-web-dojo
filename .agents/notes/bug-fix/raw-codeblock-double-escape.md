# 坑：text/plain 源码块里写 HTML 实体，代码块显示双重转义的 `&lt;`

> 状态：已修复 · 发现场景：用户报告“图标大全”代码块里 `&lt;link …&gt;` 原样显示 · 相关版本：无（HTML 解析规则）

## 现象

藏经阁「图标大全」页底部“使用方式”代码块显示为：

```
&lt;!-- 引入（css 与 fonts 目录必须在一起）--&gt;
&lt;link rel="stylesheet" href="…"&gt;
```

——本应显示 `<link …>`，用户看到的却是字面 `&lt;` 符号。高亮、复制也跟着坏
（复制出来的是 `&lt;` 而不是 `<`）。

## 根因

双重转义：

1. `<script>` 元素（含 `type="text/plain"`）按 HTML 规范的 **raw text** 解析，
   **不解码字符引用**——源码里写的 `&lt;` 在 `el.textContent` 里就是
   `&` `l` `t` `;` 四个字面字符（这与 `<pre>`/普通文本节点不同，后者会解码）；
2. `highlight.js` 对 A 型块取 `textContent` 后**再转义一次**渲染（`esc()`），
   于是 `&lt;` → `&amp;lt;`，页面显示字面 `&lt;`。

生成器 `tools/gen-icons-page.py` 把 HTML 转义过的实体写进了
`script[type="text/plain"]` 源码块，违背了 A 型块“写原始源码、不转义”的约定。

## 影响范围

仅 `site/archive/icons/index.html` 的“使用方式”代码块（全站扫描确认其余
text/plain 块均无实体）。正文 `<code>` 行内代码里的 `&lt;` 是**正确用法**，
不受影响。

## 复现方法

```bash
node /tmp/xxx.js http://127.0.0.1:8899/archive/icons/index.html
# 取 .codeblock code 的 textContent：修复前以 "&lt;!--" 开头，修复后以 "<!--" 开头
```

或用浏览器直接看页面底部代码块。

## 修复方案

`tools/gen-icons-page.py` 模板中把转义实体改回原始源码：

```html
<script type="text/plain" data-lang="html" data-title="使用方式">
  <!-- 引入（css 与 fonts 目录必须在一起）-->
  <link rel="stylesheet" href="assets/vendor/bootstrap-icons/bootstrap-icons.min.css">

  <!-- 使用 -->
  <i class="bi bi-heart-fill"></i>
</script>
```

然后重跑 `python3 tools/gen-icons-page.py` 再生成页面
（`tools/sync-assets.sh` 也会一并再生成）。

注意安全边界：A 型块内唯一不能写的是 `</script` 序列（写 `<\/script`）；
`<!--`、`<link>`、`</i>` 都安全，无需转义。

## 预防措施

- 约定重申：**A 型（text/plain）源码块永远写原始源码，禁止写 HTML 实体**；
  需要转义的场景改用 B 型 `<pre><code data-lang=…>`（作者手动转义一次）；
- 检查项：全站扫描 `text/plain` 块内是否出现 `&lt;`/`&gt;`/`&amp;`
  （一段 Python 正则即可，本坑排查时用过）；新生成的页面（图标大全等）
  生成后抽查代码块 `textContent` 首字符不是 `&`；
- 生成器模板与手写页面同等待遇：改动后同样跑 verify-cdp 抽查渲染结果。

## 相关

- 文件：`tools/gen-icons-page.py`、`site/archive/icons/index.html`（生成物）
- 关联：`../../skills/build-demo/SKILL.md`（源码块约定）、`../architecture.md` §4（代码高亮管线）
