# 坑：站点自己的 site.js 用了 jQuery 4 已移除的 $.trim，全站搜索静默失效

> 状态：已修复 · 发现场景：全站终验的功能实测（用户要求“重新检查一遍”时暴露） · 相关版本：jQuery 4.0.0

## 现象

- 侧边栏搜索框**输入任何关键词都无结果**，结果面板始终不出现；
- 控制台抛 `TypeError: $.trim is not a function`（但只有真正敲搜索框才会触发）；
- 页面其余功能（渲染、导航、演示）一切正常，极具迷惑性。

## 根因

`site.js` 的 `initSearch().run()` 里写的是：

```js
var q = $.trim($input.val()).toLowerCase();
```

而 **jQuery 4.0.0 已彻底移除 `$.trim`**（本项目 conventions.md 明确记载的红线，
讽刺的是站点自己的代码先违反了它）。`run()` 因此抛异常，防抖定时器照常触发、
异常静默吞掉 → 表现为“搜索没反应”。

**为什么此前的验证全漏了？** 所有 CDP 检查只断言了渲染标记（侧边栏/页头/TOC/
代码块数量），从未向搜索框输入并断言结果——静态检查与渲染检查覆盖不到交互路径。

## 影响范围

全站所有页面的搜索功能（桌面侧边栏搜索框），file:// 与 http:// 下均失效。

## 复现方法

```bash
python3 -m http.server 8899 --directory site
# CDP 或手动：任意页面侧边栏搜索框输入“栅格” → 无结果面板
# 修复前的断言脚本见会话中 /tmp 下的搜索调试脚本
```

## 修复方案

`site.js` 改为原生方法并加注释：

```js
// 注意：jQuery 4 已移除 $.trim，这里用原生 String#trim
var q = ($input.val() || '').trim().toLowerCase();
```

## 预防措施

1. **工具兜底**：`tools/check-offline.sh` 新增 2b 项——扫描三个公共 JS
   （loader/site/highlight）是否用了 jQuery 4 已移除 API
   （`$.trim`、`$.proxy`、`.bind/.unbind/.live/.die/.delegate/.undelegate`），
   违者判失败；
2. **验证升级**：`../skills/verify-offline.md` 明确要求“改完任何功能都要做
   交互级验证”——搜索必须真的敲词并断言结果数量，不能只查标记；
3. 教训沉淀：站点公共 JS 与教程章节遵守同一套红线（conventions.md §6）。

## 相关

- 文件：`site/assets/js/site.js`（initSearch）、`tools/check-offline.sh`（2b 项）
- 关联：`../conventions.md` §6、`../skills/verify-offline.md`、`../architecture.md` §3.5
