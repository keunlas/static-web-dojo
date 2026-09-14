# 坑：演示类名撞上 Bootstrap（`.row` 把演示悄悄改了样）

> 状态：已修复（并在工具层面加锁） · 发现场景：2026-09-14 写基础篇第二十一式
> Flexbox 的「min-width 陷阱」演示时，发现两条对照变成了同样的宽度
> · 相关版本：Bootstrap 5.3.8

## 现象

第二十一式例 6 想做一组对照：**没写 `min-width: 0`** 的弹性项目应当被长内容撑破容器，
**写了 `min-width: 0`** 的应当收在容器里显示省略号。

实测却发现两个项目都是 305px（正好等于容器内容宽），谁也没有溢出——
演示失去了教学意义。进一步量：`.row > *` 的 `flex-shrink` 计算值是 **0**、宽度是 **100%**，
像是被谁强制拉平了。

## 根因

站点皮肤建立在 Bootstrap 之上，而 Bootstrap 有全局的栅格类：

```css
.row { display: flex; flex-wrap: wrap; margin-right: -.5rem; margin-left: -.5rem; }
.row > * { flex-shrink: 0; width: 100%; max-width: 100%; padding-right: .5rem; /* … */ }
```

我给的演示容器写了 `class="row"`，于是它同时是“我的弹性容器”和“Bootstrap 的栅格行”；
Bootstrap 的 `.row > *` 把每个子项强制成 `width: 100%; flex-shrink: 0`，
刚好抵消了 `min-width: auto` 想演示的行为——**用户写的规则被框架规则悄悄盖掉了，且没有任何报错**。

同类撞名还有：`.card`、`.navbar`、`.badge`、`.col`、`.border`、`.visible`、`.shadow`、
以及站点自己的 `.content`（site.css 的布局类）。

## 影响范围

基础篇第 13、14、16、18、19、20、21 式的演示共 10 余处（`.row` 影响最广），
其中第十四式例 1 的“组合器对照列表”被 Bootstrap 排成了横向弹性行、
第十六式例 2 的两个盒子被强制拉成 100% 宽。**页面不报错，只是“看起来有点怪”。**

## 复现方法

```bash
python3 tools/check-demo-classes.py          # 会直接点出撞名的类与页面
# 或手工：打开 site/basics/21-css-flexbox.html，
# 用 CDP 读某个演示子项的 flex-shrink（应为 1，撞名后是 0）
```

## 修复方案

1. 把基础篇演示里的自定义类名统一改成 `d-` 前缀（`d-row`、`d-card`、`d-navbar`、
   `d-badge`、`d-col`、`d-bordered`、`d-visible`、`d-shadow`、`d-clearfix`、`d-contentbox`…），
   预览与源码块同步改（`check-demo-parity.py` 保证两边一致）；
2. 同步修掉 JS 里按类名查找的位置（`closest('.row')` → `closest('.d-row')`）——
   漏改会导致脚本静默抛错、输出停在“正在量……”；
3. 复测：例 6 现在实测 **未加 min-width 的项目 473px、超出容器 209px**，
   加了的那条 256px 收在框内，与正文描述一致；第十四式例 1 恢复纵向列表；
4. 新增工具 `tools/check-demo-classes.py`：扫描 `site/basics/` 的 `.demo-preview`，
   对照 Bootstrap 与 site.css 的类名清单，列出撞名（白名单：`mt-2` 这类间距工具类与 `bi-*` 图标类）。

## 预防措施

- 见 `conventions.md` §3.2：基础篇演示类名一律 `d-` 前缀；
- 写演示时先跑 `python3 tools/check-demo-classes.py site/basics/<你的文件>`；
- 教训一句话：**在“框架之上”的站点里，任何裸类名都可能已经被别人占用了**；
  演示要么加前缀，要么用演示专属 id 作用域。

## 相关

- 文件：`site/basics/13–21`、`tools/check-demo-classes.py`、`.agents/notes/conventions.md` §3.2
- 关联：`build-demo` 技能陷阱表、`verify-offline` 技能检查清单
