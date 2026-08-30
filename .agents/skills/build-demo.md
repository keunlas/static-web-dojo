# 技能：build-demo（构造演示区块）

> 用途：在章节里制作“现场演示”区块——上为可运行效果、下为高亮源码。
> 这是本教程的核心教学形态，务必做对。

## 标准结构

```html
<div class="demo">
  <div class="demo-caption">例 N · 一句话说明</div>
  <div class="demo-preview">
    <!-- 真实可运行的代码：读者能直接看到/操作效果 -->
  </div>
  <div class="demo-source">
    <script type="text/plain" data-lang="html" data-title="页面结构">
      <!-- 源码，无需手动转义 -->
    </script>
  </div>
</div>
```

## 要点

### 1. 源码块（text/plain 约定）

- `data-lang` 支持 `html` / `css` / `js`；`data-title` 是代码块顶栏标题（如“页面结构”“交互脚本”）。
- 内容**不需要**转义 `<`、`&`（text/plain 不解析），高亮器自动处理。
- ⚠️ 唯一例外：源码内出现 `</script>` 必须写 `<\/script>`，否则该 text/plain 会被
  当作真 script 提前闭合。高亮器展示时自动还原为 `</script>`。
- 一个 `.demo-source` 可放多个源码块（如“页面结构”+“交互脚本”），按执行顺序排列。

### 2. 预览区（demo-preview）

- 放真实可运行的 HTML/CSS/JS，读者直接在页面里看到并操作结果。
- 交互脚本的包裹规则（关键）：
  - 用 jQuery：一律 `$(function(){ … })` —— loader 的排队桩会等 jQuery 就绪后放行；
  - 需要 `bootstrap` 全局（`new bootstrap.Tooltip/…`）：一律 `DOJO.ready(function(){ … })`；
  - 纯 Bootstrap 组件（dropdown/collapse/modal/carousel/tabs/toast）：
    只写 `data-bs-*` 属性即可，bundle 的数据 API 自动生效，**不要**手写初始化。
- id 必须全页唯一：前缀建议 `#bs<章号>-demo<N>`（如 `#bs05-demo1`）或 `#jq03-demo2`。
- 预览内留白用 Bootstrap 工具类（`mt-3`、`mb-0` 等），别让内容顶边。

### 3. 演示设计原则

- 一个演示只讲清**一件事**；
- 演示要小（10–30 行），能一眼看出因果；
- 先给效果（预览），再给源码，正文在两者之间用一两句话点出关键类名/方法。

## 陷阱清单（打样期真实教训）

| 陷阱 | 症状 | 解法 |
| --- | --- | --- |
| text/plain 里写了 `</script>` | 页面碎裂、后续内容消失 | 写 `<\/script>` |
| 预览脚本裸用 `$` 不包 ready | 随机 `$ is not defined` | `$(function(){})` |
| tooltip/popover 只写 data 属性不 new | 悬浮无反应 | `DOJO.ready` 里 `new bootstrap.Tooltip(el)` |
| 演示 id 与页面其他元素重复 | 事件绑错/失效 | 章节前缀 id |
| 演示里引用 CDN | 违反离线铁律 | 用本站 vendor/演示内联样式 |

## 自查

```bash
grep -c 'type="text/plain"' <文件>     # 与 </script> 总数匹配
grep -n '<\\/script>' <文件>           # 确认转义写法存在（若有 script 源码）
```
