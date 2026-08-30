/**
 * 极简加载器：把本教程站点共用的 CSS 与 JS 一次性引入。
 *
 * 用法：每页 <head> 中只需要这一行——
 *   <script src="../assets/js/loader.js"></script>
 * （src 路径随页面深度变化，加载器会根据自身位置自动推算站点根目录）
 *
 * 它依次引入：
 *   1. Bootstrap 5.3.8 样式与脚本（bundle 版，内含 Popper）
 *   2. Bootstrap Icons 图标库
 *   3. 本站纸墨风皮肤 site.css
 *   4. jQuery 4.0.0（本教程的“另一位主角”）
 *   5. 迷你代码高亮器 highlight.js 与站点逻辑 site.js
 *
 * 两个贴心设计：
 *   · 脚本按“链式”逐个加载：后一个等前一个就绪才登场，
 *     保证 site.js 执行时 jQuery 一定已经可用；
 *   · 在真实 jQuery 到达之前，先用一个“排队桩”接住页面里
 *     的 $(function(){…}) 演示脚本，等 jQuery 就绪后逐一放行——
 *     于是正文里的演示代码可以放心使用最地道的写法。
 */
(function () {
  'use strict';

  // —— 明暗主题：尽早应用，避免页面闪一下错误配色 ——
  // 开关用 Bootstrap 5.3 官方的 data-bs-theme 属性（唯一真源），
  // site.css 在 html[data-bs-theme="dark"] 下覆盖纸墨调色板为暗夜版。
  // 用户手动选择存在 localStorage；从未选过则跟随系统 prefers-color-scheme。
  (function () {
    var KEY = 'dojo-theme';
    var mode = null;
    try { mode = localStorage.getItem(KEY); } catch (e) { /* file:// 或隐私模式可能不可用 */ }
    if (mode !== 'light' && mode !== 'dark') {
      mode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-bs-theme', mode);
  })();

  var me = document.currentScript;
  if (!me || !me.src) {
    console.warn('[loader] 无法定位 loader.js 的路径，公共资源未能自动加载。');
    return;
  }

  // 由 loader.js 自身位置反推站点根目录（file:// 与 http(s):// 都适用）
  var root = me.src.replace(/\/assets\/js\/loader\.js$/, '');
  window.SITE_ROOT = root;
  var A = root + '/assets';

  // —— 站点图标（朱砂印章，内嵌 SVG，无网络请求）——
  var favicon =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>" +
    "<rect width='100' height='100' rx='18' fill='%23b03a2e'/>" +
    "<rect x='6' y='6' width='88' height='88' rx='13' fill='none' stroke='%23faf6ec' stroke-width='2' opacity='.55'/>" +
    "<text x='50' y='70' font-size='56' text-anchor='middle' fill='%23faf6ec' font-family='serif'>修</text>" +
    "</svg>";
  var icon = document.createElement('link');
  icon.rel = 'icon';
  icon.type = 'image/svg+xml';
  icon.href = 'data:image/svg+xml,' + encodeURIComponent(favicon);
  document.head.appendChild(icon);

  // —— 样式 ——
  function addCss(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  addCss(A + '/vendor/bootstrap/bootstrap.min.css');
  addCss(A + '/vendor/bootstrap-icons/bootstrap-icons.min.css');
  addCss(A + '/css/site.css');

  // —— jQuery 排队桩 ——
  // 页面正文里若有 $(function(){…})（演示脚本），在 jQuery 到达前先排队。
  var pending = [];
  function stub(fn) {
    if (typeof fn === 'function') pending.push(fn);
  }
  window.jQuery = window.$ = stub;

  // —— DOJO 就绪队列 ——
  // 演示脚本若需要 Bootstrap 的 JS 全局（例如手动初始化 tooltip/popover：
  // new bootstrap.Tooltip(...)），请用 DOJO.ready(fn) 包裹；
  // site.js 会在所有资源加载完毕、页面就绪后统一放行。
  var dojoQueue = [];
  window.DOJO = {
    root: root,
    ready: function (fn) { dojoQueue.push(fn); },
    _flush: function () {
      var q = dojoQueue;
      dojoQueue = [];
      q.forEach(function (fn) {
        try { fn(); } catch (e) { console.error('[demo] 演示脚本出错：', e); }
      });
    }
  };

  // —— 脚本：链式顺序加载（后一个等前一个就绪）——
  var chain = [
    A + '/vendor/jquery/jquery-4.0.0.min.js',
    A + '/vendor/bootstrap/bootstrap.bundle.min.js',
    A + '/js/highlight.js',
    A + '/js/search-index.js',
    A + '/js/site.js'
  ];

  function loadNext(i) {
    if (i >= chain.length) return;
    var s = document.createElement('script');
    s.src = chain[i];
    s.onload = function () {
      // jQuery 刚就绪：放行此前排队的演示脚本（此时 $ 已是真正的 jQuery）
      if (i === 0) {
        pending.forEach(function (fn) { window.$(fn); });
        pending = [];
      }
      loadNext(i + 1);
    };
    s.onerror = function () {
      console.warn('[loader] 资源加载失败：' + s.src + '（离线打开时请检查文件是否完整）');
      loadNext(i + 1);
    };
    document.head.appendChild(s);
  }
  loadNext(0);
})();
