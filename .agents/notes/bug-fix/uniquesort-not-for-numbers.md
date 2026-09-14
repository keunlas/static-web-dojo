# 坑：$.uniqueSort 演示用数字数组，点了“什么也没发生”

> 状态：已修复 · 发现场景：全站内容审查（示例一致性 + 内容正确性）· 相关版本：jQuery 4.0.0

## 现象

`site/jquery/11-utilities.html` 例 2「小工具速验」中，点「$.uniqueSort」按钮，
日志显示：

```
$.uniqueSort([3,1,2,3,1]) → [3, 1, 2, 3, 1]
```

与表格里“去重并排序”的描述正好相反；新手会以为是自己看错了，或以为教程写错。

## 根因

jQuery 的 `uniqueSort()`（旧名 `unique()`）只对 **DOM 元素数组**去重并按文档顺序排序；
对普通数字、字符串数组会**原样返回**。这不区分版本，jQuery 4.0.0 实测如此：

```
$.uniqueSort([3,1,2,3,1])            // [3, 1, 2, 3, 1]，原样
$.uniqueSort([b, a, b])              // [a, b]，按文档顺序去重
```

## 影响范围

- `site/jquery/11-utilities.html` 例 2 按钮与表格描述；
- `site/archive/reference-jquery/index.html` 的 `$.uniqueSort` 速查条目（同样没写“只给 DOM 元素用”）。

## 复现方法

```js
// 浏览器控制台（本站任意加载了 jQuery 的页面）
$.uniqueSort([3, 1, 2, 3, 1])   // → [3, 1, 2, 3, 1]
```

## 修复方案

- 演示改用**DOM 元素数组**：新增 A / B / C 三个“桩”，用打乱且重复的
  `[C, A, B, A]` 调 `$.uniqueSort`，日志显示 `A、B、C`（去重 + 文档顺序）；
- 表格描述改为“给 DOM 元素数组去重并按文档顺序排序；普通数字、字符串数组会原样返回”；
- 速查页同步补上同一句限定。

## 预防措施

- 工具函数的演示必须使用“该方法真正支持的数据类型”，不能拿数字数组去演 DOM 专用方法；
- 继续执行 `jquery4-removed-api-misjudgment.md` 的教训：**方法行为要实测**，
  文档描述写完必须能被一次真实调用验证。

## 相关

- 文件：`site/jquery/11-utilities.html`、`site/archive/reference-jquery/index.html`
- 关联：`jquery4-removed-api-misjudgment.md`、`skills/verify-offline/SKILL.md`
