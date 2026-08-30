# 坑：两代理对“位置伪类是否移除”说法冲突——事实必须以源码为准

> 状态：已澄清（文档已按源码修正） · 发现场景：并行写作代理的交付报告互相矛盾 · 相关版本：jQuery 4.0.0

## 现象

- 写作代理 F 报告：位置伪类选择器 `:first/:last/:even/:odd` 在 jQuery 4.0.0 已移除；
- 写作代理 E 报告：这些伪类**仍然存在可用**，并给出源码行号
  （`reference/jquery/jquery-4.0.0.js` 约 1874–1929 行）；
- 协调者曾按 F 的说法把“已移除”写进 `conventions.md`，随后被 E 的证据推翻。

## 根因

- F 的结论是**二手推断**（可能基于旧资料或误查），未核对本仓库 reference 里的
  实际源码；
- 并行代理各自的“事实”没有经过同一裁判（原始源码）校验，协调者直接采信了
  先到的一方。

## 影响范围

文档层面：`conventions.md` §6 曾错误记载“位置伪类已在 4.0 移除”，
可能误导后续章节把“能用”写成“不能用”。

## 复现方法

```bash
grep -n 'first: createPositionalPseudo\|even: createPositionalPseudo' reference/jquery/jquery-4.0.0.js
# 输出 1874 行起的 jQuery.expr.pseudos 定义，证实伪类仍存在
grep -nE '"(bind|unbind|live|die|delegate|undelegate)":' reference/jquery/jquery-4.0.0.js
# 无输出 → 这些才是真正被移除的
```

## 修复方案（事实结论）

以 `reference/jquery/jquery-4.0.0.js` 源码为准：

- **仍存在可用**：`:first/:last/:even/:odd/:eq/:lt/:gt/:nth`
  （`jQuery.expr.pseudos`，`createPositionalPseudo`）——教程推荐 `.first()/.eq()`
  是**风格建议**（性能与可读性），不是兼容性要求；
- **已彻底移除**：`.bind/.unbind/.live/.die/.delegate/.undelegate`、`$.trim`、
  `jQuery.proxy`（deprecated）；
- `conventions.md` §6 已按上述修正，并注明“以下事实均以源码为准”。

## 预防措施

- 铁律升级：**API 存在性的最终裁判是仓库内 reference 源码/编译产物**，
  不是代理的口头报告、也不是二手资料；
- 并行代理结论冲突时，协调者必须先查源码定论、再写文档（doc-sync 原则
  “文档是事实的镜像”）；
- 多代理任务中，涉及版本事实的结论建议让代理附上源码行号作为证据。

## 相关

- 文件：`reference/jquery/jquery-4.0.0.js`（1874–1929 行）、`.agents/notes/conventions.md` §6
- 关联：`../skills/doc-sync/SKILL.md`（核心原则 2）、`../architecture.md` §8
