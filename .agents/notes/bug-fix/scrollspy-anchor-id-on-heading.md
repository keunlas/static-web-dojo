# 坑：滚动监听把 id 挂在小标题上，滚到底反而全部熄灭

> 状态：已修复 · 发现场景：2026-09 第九式新增“滚动监听”演示后的浏览器交互测试
> · 相关版本：Bootstrap 5.3.8

## 现象

按官方写法做了滚动监听演示：滚动容器 `data-bs-spy="scroll" data-bs-target="#导航id"`，
容器 `position-relative overflow-auto tabindex="0"`，导航三个链接分别指向
`#a` `#b` `#c`——而这三个 id 挂在**各个小节的小标题 `<h5>`** 上。

结果：初始状态第一节会亮；把容器滚到底，三个链接**全部熄灭**（`.active` 一个都没有）。

## 根因

Bootstrap 5.3 的 ScrollSpy 用 IntersectionObserver 观察 **id 所在的元素本身**，
判断的是它的可见比例（阈值 0.1 / 0.5 / 1，rootMargin 默认 `0px 0px -25%`）。

- id 挂在小标题上 → 观察对象只有几十像素高；
- 滚到底时，最后一节的小标题已经**滑出容器上沿**，可见比例为 0 → 判定“不在视野”；
- 之前可见的小节也已离开，于是所有链接都被清掉 active。

一句话：**观察对象不是“小节”，而是“你挂了 id 的那个元素”**。

## 影响范围

仅新增的第九式例 4 演示（以及任何照抄这种写法的页面）；
站点自身的右侧目录高亮是 site.js 自算的，不受影响。

## 复现方法

```bash
python3 -m http.server 8899 --directory site
# 打开 http://127.0.0.1:8899/bootstrap/09-navs.html
# 在例 4 的右栏滚到底，观察左栏目录是否还有高亮
# 或 CDP：把 [data-bs-spy="scroll"] 的 scrollTop 设为 scrollHeight，再查 .nav-link.active
```

## 修复方案

把 id 从 `<h5>` 移到**包住整段内容的 `<div>`** 上（每个小节一个 div），
让观察对象与“一节”的范围一致；正文里补一句心法点明这个要求。

```html
<div id="bs09-spy-a">
  <h5>入门心法</h5>
  <p>…</p>
</div>
```

修后 CDP 实测：滚到底 → 第三条链接高亮（“剑法总纲”），滚回顶部 → 第一条高亮。

## 预防措施

- 写滚动监听演示时，**id 挂在整节容器上**，不要挂在小标题上；
- 交互类演示（滚动、过渡、异步）一律用 CDP 做一次“操作 → 断言”，
  只看静态渲染会把这类问题放过去。

## 相关

- 文件：`site/bootstrap/09-navs.html`（例 4）
- 关联：`../skills/verify-offline/SKILL.md`（交互断言清单）、
  `../skills/build-demo/SKILL.md`（演示构造陷阱）
