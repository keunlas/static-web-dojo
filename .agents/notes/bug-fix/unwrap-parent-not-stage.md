# 坑：jQuery 第八式 unwrap 演示把“舞台容器”整个拆掉

> 状态：已修复 · 发现场景：全站内容审查（用户要求核对“示例代码与实例是否完全一致”）· 相关版本：jQuery 4.0.0

## 现象

打开 `site/jquery/08-manipulation.html` 例 4「包一包、换一换」：

1. 点「wrap：各自包一层」——三张字条各穿一层红边外衣，正常；
2. 点「unwrap：拆掉外衣」——三张字条的**舞台容器 `#jq08-wrap-stage` 整个消失**，
   字条裸露在外层 `div.border` 里；日志却写“外衣没了，字条还在”，与事实相反；
3. 此后同演示的 wrapAll / wrapInner / replaceWith / 还原 全部失灵——
   它们的代码都按 `#jq08-wrap-stage` 查找，容器没了自然一片寂静。

（浏览器实测：`document.getElementById('jq08-wrap-stage')` 在点击后返回 `null`。）

## 根因

`unwrap()` 拆掉的是**被选中元素的父级**。原代码：

```js
$('#jq08-wrap-stage .jq08-note').parent().unwrap();
```

选中集合是“字条”，`.parent()` 得到的是**外衣**（wrap 生成的 span），
再对外衣调 `unwrap()`——拆掉的成了外衣的父级，也就是舞台容器本身。

如果先点 unwrap 再包（字条还没穿外衣），`.parent()` 得到的就是舞台，
同样会把它拆掉：两条路径都指向同一个错。

## 影响范围

- 仅 `site/jquery/08-manipulation.html` 例 4（http:// 与 file:// 均复现）；
- 不影响示例成品与其它章节；但该演示的“包装与拆包”教学点因此完全失效。

## 复现方法

```bash
python3 -m http.server 8899 --directory site
# 打开 http://127.0.0.1:8899/jquery/08-manipulation.html
# 依次点击「wrap：各自包一层」→「unwrap：拆掉外衣」
# 再用 DevTools 查询 #jq08-wrap-stage —— null
```

## 修复方案

对**字条本身**调用 `unwrap()`，并加一道保护：字条的父级就是舞台时（说明还没包过）不动手。

```js
var $notes = $('#jq08-wrap-stage .jq08-note');
if ($notes.parent().is('#jq08-wrap-stage')) {
  log('字条现在没穿外衣——先点一种包法，再来拆。');
  return;
}
$notes.unwrap();
```

预览脚本与源码块两处同步修改；实测四种路径（先拆、wrap 后拆、wrapAll 后拆、还原）全部正常，
舞台始终健在、其余按钮不再失灵。

## 预防措施

- 用 `unwrap()` 前，先问一句“我选中的是谁、我要拆谁的父级”；
- 新增或修改**交互类**演示时，必须做操作级断言（点一遍、查 DOM、看日志），
  不能只看静态标记——本坑与 `carousel-progress-stacked-width.md`、
  `carousel-caption-overlap.md` 同属“看着像对、点起来不对”的一族；
- 复习 `skills/verify-offline/SKILL.md` 的操作级断言清单。

## 相关

- 文件：`site/jquery/08-manipulation.html`（例 4 预览脚本与源码块）
- 关联：`skills/build-demo/SKILL.md`、`skills/verify-offline/SKILL.md`
