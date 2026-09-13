---
name: build-demo
description: 在章节里制作“现场演示”区块——上为可运行效果、下为高亮源码。这是本教程的核心教学形态。适用于章节内做现场演示。
---

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
- ⚠️ **也不要写 HTML 实体（`&lt;` 等）**：script 是 raw text，实体不会被解码，
  高亮器会再转义一次，读者会看到字面 `&lt;`（坑档案
  `bug-fix/raw-codeblock-double-escape.md`）。需要展示 `<` 就直接写 `<`。
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
- 先给效果（预览），再给源码，正文在两者之间用一两句话点出关键类名/方法；
- 统计类 UI（计数、汇总）抽成单一函数（如 `updateStats()`），每次数据变动后统一调用——单一事实来源，避免各处数字不同步；
- 带持久化（localStorage）的演示要用**独立 key**（如 `dojo-demo-*`），与成品页/其他演示错开，防止同一站点下串数据；
- 响应式演示的标准写法：同一元素叠加互斥的显隐工具类（如 `d-none d-md-inline d-xl-none`），读者缩放窗口即可看到三档变化；
- 演示中确需固定尺寸（对齐演示的行高、正圆等）时，允许**内联 `style`**；“不用自定义 CSS”
  仅指不用自定义 class / 内联 `<style>` 块；
- “链接式禁用按钮”类演示必须给 `<a>` 写 `href="#"`，否则无 href 的 a 本就不进 Tab 序，
  `tabindex="-1"` 的教学点演示不出来；
- 演示里“初始隐藏”的元素统一用内联 `style="display:none"`（不要用 `.d-none`），
  配合 `slideToggle`/`fadeIn` 的行为最直观；
- 无后端的 `load()` 演示套路：加载“本章自身的某段内容”（如 `.chapter-lead` 片段），
  真实可运行、不新增数据文件；
- 验证 `.show()` 类效果要用 `getComputedStyle(el).display !== 'none'` 断言——
  jQuery 的 `.show()` 会把 `style.display` 置回默认值 `''`，直接读 style.display 会误判；
- **Bootstrap 自带 CSS 过渡会干扰“读值运算”类演示**：`.progress-bar`（width .6s）、
  `.form-control`（border-color .15s）都带过渡——凡用 `css()` 读值参与计算（如进度步进），
  快速连点会读到过渡中间值导致错乱；这类演示给元素加内联 `transition: none`
  （或改用计数器），并在正文说明原因；
- 教学效果好的演示模式：**跨栏对比**（如“直接绑定 vs 事件委托”并排两栏，点同一按钮看两边行为差异），
  对比类知识点优先采用。

## 陷阱清单（打样期真实教训）

| 陷阱 | 症状 | 解法 |
| --- | --- | --- |
| text/plain 里写了 `</script>` | 页面碎裂、后续内容消失 | 写 `<\/script>` |
| 预览脚本裸用 `$` 不包 ready | 随机 `$ is not defined` | `$(function(){})` |
| tooltip/popover 只写 data 属性不 new | 悬浮无反应 | `DOJO.ready` 里 `new bootstrap.Tooltip(el)` |
| toast 写 data-bs-toggle | 点了没反应 | toast 是纯 JS opt-in：`bootstrap.Toast.getOrCreateInstance(el).show()`；仅关闭按钮用 `data-bs-dismiss="toast"` |
| 演示 id 与页面其他元素重复 | 事件绑错/失效 | 章节前缀 id |
| 演示里引用 CDN | 违反离线铁律 | 用本站 vendor/演示内联样式 |
| 动态项上“切换 + 删除按钮”同区 | 点 ✕ 冒泡误触切换 | 回调开头守卫：`if ($(e.target).closest('.btn-del').length) return;` |
| 断言 collapse 立即生效 | 误判组件失效 | `.show` 在过渡动画（~350ms）结束后才加上，测试需等待 |
| 演示/答案里用 h2/h3（如官方 `accordion-header`） | 污染右侧“本式目录” | 演示内部标题用 h4/h5；site.js 已排除 .demo/.practice/details.answer 内的标题（双保险） |
| 下拉菜单用 `<a href="#">` | 点击后页面跳到顶部 | 用 `<button class="dropdown-item">`；分页等占位链接用假锚点 `#demo4-p1` 并在正文说明 |
| 节选源码与预览不一致引发困惑 | 读者对不上 | 节选块在 data-title 里标“（节选）/（只列与例 N 不同的部分）”，正文说明对应关系 |
| 滚动监听（scrollspy）的 id 挂在小标题上 | 滚到底时高亮全灭（标题已滑出观察区） | id 挂**整节容器**（div），容器 `position-relative overflow-auto tabindex="0"`，演示后跑 CDP 断言 |
| 写完演示没做机器核对 | “源码能还原预览”这条红线靠肉眼记不住 | 收尾必跑 `python3 tools/check-demo-parity.py`（本轮靠它查出 4 处历史遗漏） |

**版本事实备忘（5.3.8）**：组合进度条推荐 `.progress-stacked` 包裹多条 `.progress`；
collapse 多目标共享触发用共享 class（data API 走 `getMultipleElementsFromSelector`）。

**版本事实备忘（jQuery 4.0.0）**：`.bind/.unbind/.delegate/.undelegate/.hover` 与 `$.proxy`
只是**弃用**、仍可调用；`$.trim/.type/.isArray/.isFunction/.isNumeric/.isWindow/.parseJSON/.now/.live/.die`
才是**已移除**——写 API 类演示前后各实测一次（见 `notes/bug-fix/jquery4-removed-api-misjudgment.md`）。

## 自查

```bash
grep -c 'type="text/plain"' <文件>     # 与 </script> 总数匹配
grep -n '<\\/script>' <文件>           # 确认转义写法存在（若有 script 源码）
```
