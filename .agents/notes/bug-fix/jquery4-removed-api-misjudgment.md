# 坑：把“弃用”当成“移除”——jQuery 4.0.0 移除清单被 grep 误判

> 状态：已修正（文档 + 工具 + 教程全站核实） · 发现场景：2026-09 对照前身查缺补漏
> · 相关版本：jQuery 4.0.0（`reference/jquery/jquery-4.0.0.js`，Date: 2026-01-18）

## 现象

项目文档（`conventions.md` §6、`bug-fix/positional-pseudos-fact-conflict.md`、
`skills/verify-offline/SKILL.md`、`tools/check-offline.sh`）一致声称
“`.bind/.unbind/.live/.die/.delegate/.undelegate`、`$.trim`、`jQuery.proxy` 已彻底移除”，
其中 `tools/check-offline.sh` 还把它们列为禁用 API 扫描项。

实际上：拿无头 Chromium 加载本站 vendor 的 jQuery 4.0.0，逐个实测——

- **仍存在、可调用（deprecated）**：`.bind` `.unbind` `.delegate` `.undelegate` `.hover`、`$.proxy`；
- **确实移除（typeof === 'undefined'，调用即报错）**：`$.trim` `$.type` `$.isArray`
  `$.isFunction` `$.isNumeric` `$.isWindow` `$.parseJSON` `$.now` `$.nodeName` `$.camelCase`、
  `.live` `.die`。

## 根因

“文档是事实的镜像”这条原则被两次违反在同一处：

1. 复核时用的 grep 模式是**对象字面量键**写法（`"(bind|unbind|...)"：`），
   而 4.0.0 源码里它们是 `jQuery.fn.extend({ bind: function ... })`——**没命中 ≠ 不存在**；
2. 没有做“调用级”验证（哪怕 `typeof jQuery.fn.bind` 一行也能定案），
   二手资料与本地源码冲突时轻信了前者。

## 影响范围

- 教程事实：学习者若照文档相信 `.bind` 已移除，会得到错误的兼容性结论；
- 工具误伤：`check-offline.sh` 用错误清单扫描，虽不影响运行，但把“风格不推荐”
  当成“调用即报错”；
- 文档互指：坑档案本身也写错了，形成“错证据链”。

## 复现方法

```bash
# 1) 源码层面：
grep -n 'bind: function\|proxy = function' reference/jquery/jquery-4.0.0.js
# 2) 调用层面（无头 Chromium 打开任一引用 vendor jquery 的页面后执行）：
#    typeof $('#x').bind  → "function"
#    typeof $.trim        → "undefined"
python3 tools/check-demo-parity.py   # 顺带确认教程演示仍自洽
bash tools/check-offline.sh          # 2b 项已按新清单扫描
```

## 修复方案

1. **事实清单**：把“已移除”与“仍在但弃用”分成两张表，写进 `conventions.md` §6 与
   `site/archive/reference-jquery/index.html`（页尾“移除与弃用清单”）；
2. **教程正文**：在 jQuery 第十一式《工具函数》写入正确版本事实，并明确
   “不是它们坏了，而是新写法更好”；
3. **工具**：`tools/check-offline.sh` 的 2b 项只扫描真正移除的 API；
4. **旧坑档案**：`positional-pseudos-fact-conflict.md` 增加“第二次翻案”补记，指向本篇。

## 预防措施

- **API 存在性必须做调用级验证**：`typeof` 一行即可定案，不靠 grep 猜；
- grep 只用来“找线索”，结论必须回到源码定义处（`jQuery.fn.extend({...})` 这类
  对象字面量挂载方式容易漏检）；
- 涉及“移除/弃用”的结论，一律在文档里附一句验证方式（本篇给出了可复现命令）。

## 相关

- 文件：`reference/jquery/jquery-4.0.0.js`、`.agents/notes/conventions.md` §6、
  `site/archive/reference-jquery/index.html`、`site/jquery/11-utilities.html`、
  `tools/check-offline.sh`
- 关联：`positional-pseudos-fact-conflict.md`（同类问题的第一次，也是本案的导火索）
