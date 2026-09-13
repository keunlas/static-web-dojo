/**
 * 站点逻辑：本教程网站唯一需要维护的“目录中枢”。
 *
 * 它负责：
 *   1. 渲染左侧侧边栏（桌面端固定，移动端收进 offcanvas）
 *   2. 为章节页注入“印章 + 标题”页头
 *   3. 为分卷页自动生成章节列表
 *   4. 从正文 h2/h3 生成右侧迷你目录（TOC）
 *   5. 渲染页脚与“上一式 / 下一式”翻页
 *   6. 明暗主题切换（按钮注入 + localStorage 持久化）
 *   7. 触发代码高亮
 *
 * 新增章节时只需在下面的 CHAPTERS 里加一条，
 * 侧边栏、分卷列表、翻页顺序会自动更新。
 */
(function () {
  'use strict';

  var ROOT = window.SITE_ROOT || '.';

  var T = {
    title: '纯静态网页的修行',
    tagline: '不修仙，不炼丹。一行一行写页面，把网页的基本功练扎实。'
  };

  // ================= 全站目录（单一数据源） =================

  var SECTIONS = [
    {
      id: 'basics',
      label: '第一回',
      title: '基础篇 · MDN 引路',
      pageTitle: 'MDN 引路',
      href: 'basics/index.html',
      seal: '一',
      desc: 'HTML、CSS、JavaScript 的基础，我们推荐你前往 MDN 学习。',
      chapters: []
    },
    {
      id: 'bootstrap',
      label: '第二回',
      title: 'Bootstrap 篇',
      href: 'bootstrap/index.html',
      seal: '二',
      desc: '借 Bootstrap 之手，让布局与组件信手拈来。',
      chapters: [
        { num: '01', href: 'bootstrap/01-intro.html', title: '初入江湖', desc: 'Bootstrap 是什么、如何本地引入、写出第一个页面' },
        { num: '02', href: 'bootstrap/02-grid-1.html', title: '容器与栅格（上）', desc: 'container、row、col 与十二列系统、五大断点' },
        { num: '03', href: 'bootstrap/03-grid-2.html', title: '容器与栅格（下）', desc: '嵌套、偏移、对齐与 gutter 的实战套路' },
        { num: '04', href: 'bootstrap/04-typography.html', title: '排版与工具类', desc: '标题、文本、颜色与间距工具类' },
        { num: '05', href: 'bootstrap/05-buttons.html', title: '按钮·徽章·提示框', desc: 'btn、badge 与 alert 三件套' },
        { num: '06', href: 'bootstrap/06-cards.html', title: '卡片', desc: 'card 的结构与组合玩法' },
        { num: '07', href: 'bootstrap/07-lists-tables.html', title: '列表组与表格', desc: 'list-group 与 table' },
        { num: '08', href: 'bootstrap/08-forms.html', title: '表单', desc: '控件、布局与校验' },
        { num: '09', href: 'bootstrap/09-navs.html', title: '导航组件', desc: 'navbar、navs、tabs 与 breadcrumb' },
        { num: '10', href: 'bootstrap/10-modal-dropdown.html', title: '模态框与下拉菜单', desc: 'modal 与 dropdown' },
        { num: '11', href: 'bootstrap/11-collapse.html', title: '折叠与手风琴', desc: 'collapse 与 accordion' },
        { num: '12', href: 'bootstrap/12-carousel.html', title: '轮播与杂项', desc: 'carousel、progress、pagination、spinner' },
        { num: '13', href: 'bootstrap/13-overlays.html', title: '提示与浮层', desc: 'tooltip、popover 与 toast' },
        { num: '14', href: 'bootstrap/14-icons.html', title: '图标库', desc: 'bootstrap-icons 的引入与使用' },
        { num: '15', href: 'bootstrap/15-responsive.html', title: '响应式心法', desc: '移动优先的思路总结' },
        { num: '16', href: 'bootstrap/16-project.html', title: '综合修炼', desc: '手写一个作品集主页' },
        { num: '17', href: 'bootstrap/17-media.html', title: '图片与媒体', desc: 'img-fluid、figure、ratio 与 object-fit' },
        { num: '18', href: 'bootstrap/18-naming.html', title: '类名命名规律', desc: '读懂类名的钥匙：公式、暗号与速查三路' }
      ]
    },
    {
      id: 'jquery',
      label: '第三回',
      title: 'jQuery 篇',
      href: 'jquery/index.html',
      seal: '三',
      desc: '一柄轻剑，让 DOM 操作化繁为简。',
      chapters: [
        { num: '01', href: 'jquery/01-intro.html', title: '引子·轻剑快马', desc: '为什么还学 jQuery、本地引入与 ready' },
        { num: '02', href: 'jquery/02-selectors.html', title: '选择器', desc: '与 CSS 选择器一一对照' },
        { num: '03', href: 'jquery/03-content-attr.html', title: '内容与属性', desc: 'text、html、val 与 attr' },
        { num: '04', href: 'jquery/04-class-style.html', title: '类与样式', desc: 'addClass、toggleClass 与 css' },
        { num: '05', href: 'jquery/05-events.html', title: '事件', desc: 'on、click 与事件委托' },
        { num: '06', href: 'jquery/06-effects.html', title: '显隐与动画', desc: 'hide、fadeIn、slideUp 与 animate' },
        { num: '07', href: 'jquery/07-traversing.html', title: '遍历', desc: 'parent、children、find 与 each' },
        { num: '08', href: 'jquery/08-manipulation.html', title: '节点的增删改', desc: 'append、before、remove 与 clone' },
        { num: '09', href: 'jquery/09-ajax.html', title: 'Ajax', desc: 'load、get、post 与本地 JSON' },
        { num: '10', href: 'jquery/10-todo.html', title: '综合修炼', desc: 'jQuery + Bootstrap 写一个待办清单' },
        { num: '11', href: 'jquery/11-utilities.html', title: '工具函数', desc: '$ 家族：each、map、grep、extend、param 与 4.0 版本事实' },
        { num: '12', href: 'jquery/12-chaining.html', title: '链式与尺寸', desc: '退一步的 .end()、尺寸与位置、.data() 数据缓存' },
        { num: '13', href: 'jquery/13-plugins.html', title: '插件与扩展', desc: '$.fn 自定义插件与 $.extend 默认选项' },
        { num: '14', href: 'jquery/14-performance.html', title: '性能心法', desc: '缓存选择器、限定范围、批量 DOM 与委托' }
      ]
    },
    {
      id: 'archive',
      label: '第四回',
      title: '藏经阁',
      href: 'archive/index.html',
      seal: '四',
      desc: '离线文档、官方示例、图标大全与速查表，无需联网即可查阅。',
      chapters: [
        { num: '', href: 'archive/bootstrap-docs/index.html', title: 'Bootstrap 离线文档', desc: '' },
        { num: '', href: 'archive/examples/index.html', title: '官方示例集', desc: '' },
        { num: '', pageId: 'archive-icons', href: 'archive/icons/index.html', title: '图标大全', desc: '' },
        { num: '', pageId: 'archive-reference', href: 'archive/reference/index.html', title: '工具类速查', desc: '' },
        { num: '', pageId: 'archive-jquery', href: 'archive/reference-jquery/index.html', title: 'jQuery 方法速查', desc: '' }
      ]
    },
    {
      // 附页：练功场。登记进 SECTIONS 后，侧边栏、翻页顺序都自动生成；
      // 但页面页头是手写的（playground/index.html 自带 chapter-header），
      // 因此 injectHeader 需要跳过它（见 injectHeader 内注释）。
      id: 'playground',
      label: '附页',
      title: '练功场',
      pageTitle: '在线练功场',
      href: 'playground/index.html',
      seal: '练',
      desc: 'HTML / CSS / JS 三栏在线编辑，代码自动保存在本机浏览器。',
      chapters: []
    }
  ];

  // ================= 页面顺序（驱动“上一式 / 下一式”） =================

  var PAGES = [
    { id: 'home', href: 'index.html', nav: '总览', title: '修行地图', chapter: false }
  ];
  SECTIONS.forEach(function (sec) {
    PAGES.push({ id: sec.id, href: sec.href, nav: sec.label + ' · ' + sec.title.split(' · ')[0], title: sec.pageTitle || '卷首语', chapter: false });
    sec.chapters.forEach(function (ch) {
      // 纯外链条目（离线文档、示例集）只进侧边栏，不进翻页顺序
      if (!ch.num && !ch.pageId) return;
      PAGES.push({
        id: ch.pageId || (sec.id + '-' + ch.num),
        href: ch.href,
        nav: ch.pageId ? (sec.label + ' · ' + ch.title) : (sec.label + ' · 第' + ch.num + '式'),
        title: ch.title,
        chapter: !ch.pageId
      });
    });
  });
  // 注：练功场不再是手动 push —— 已登记为 SECTIONS 里的「附页」回，
  // 上面 forEach 循环会自动把它送进 PAGES（排在藏经阁之后）。

  var BY_ID = {};
  PAGES.forEach(function (p) { BY_ID[p.id] = p; });

  function url(path) { return ROOT + '/' + path; }

  function findSectionOf(pageId) {
    var secId = pageId.split('-')[0];
    for (var i = 0; i < SECTIONS.length; i++) {
      if (SECTIONS[i].id === secId) return SECTIONS[i];
    }
    return null;
  }

  function findPageIndex(pageId) {
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i].id === pageId) return i;
    return -1;
  }

  // ================= 渲染：侧边栏 =================

  function renderSidebar(pageId) {
    var html = '';
    // 侧边栏只渲染章节目录：品牌 / 搜索 / 主题切换已整体上移到页面级吸顶顶栏（.topbar）
    SECTIONS.forEach(function (sec) {
      html += '<nav class="side-section">';
      var secActive = sec.id === pageId ? ' class="active"' : '';
      html += '<div class="side-section-title' + (secActive ? ' active' : '') + '"><a href="' + url(sec.href) + '">' + sec.title + '</a>'
            + '<span class="side-label">' + sec.label + '</span></div>';
      if (sec.chapters.length) {
        html += '<ul class="side-chapters">';
        sec.chapters.forEach(function (ch) {
          var pid = ch.pageId || (sec.id + '-' + ch.num);
          var cls = pid === pageId ? ' class="active"' : '';
          html += '<li><a' + cls + ' data-page-id="' + pid + '" href="' + url(ch.href) + '">'
                + (ch.num ? '<span class="chap-num">' + ch.num + '</span>' : '') + ch.title + '</a></li>';
        });
        html += '</ul>';
      }
      html += '</nav>';
    });
    return html;
  }

  // ================= 渲染：章节页头 =================

  function injectHeader(page) {
    // home / archive / playground 的页头是页面手写的（home 用 hero、
    // 藏经阁卷首与练功场自带 chapter-header），不重复注入
    if (!page || page.id === 'home' || page.id === 'archive' || page.id === 'playground') return;
    var sec = findSectionOf(page.id);
    if (!sec) return;
    var seal = page.chapter ? page.id.split('-').pop() : sec.seal;
    var stage = page.chapter ? sec.label + ' · ' + sec.title + ' · 第' + seal + '式'
                             : sec.label + ' · ' + sec.title;
    var h =
      '<header class="chapter-header">' +
        '<div class="seal">' + seal + '</div>' +
        '<div>' +
          '<p class="chapter-stage">' + stage + '</p>' +
          '<h1>' + page.title + '</h1>' +
        '</div>' +
      '</header>';
    $('#main').prepend(h);
  }

  // ================= 渲染：分卷页章节列表 =================

  function injectChapterList(pageId) {
    var $list = $('#chapter-list');
    if (!$list.length) return;
    var sec = findSectionOf(pageId);
    if (!sec) return;
    var html = '<div class="chapter-grid">';
    sec.chapters.forEach(function (ch) {
      html += '<a class="chapter-card" href="' + url(ch.href) + '">'
            + '<span class="seal seal-small">' + ch.num + '</span>'
            + '<span><span class="chapter-card-title">第' + ch.num + '式 · ' + ch.title + '</span>'
            + (ch.desc ? '<span class="chapter-card-desc">' + ch.desc + '</span>' : '')
            + '</span></a>';
    });
    html += '</div>';
    $list.replaceWith(html);
  }

  // ================= 渲染：TOC（正文小目录） =================

  function injectToc() {
    var $main = $('#main');
    // 只收录正文标题：演示区/练功区/参考答案里的 h2/h3 不进目录
    var heads = $main.find('h2, h3').filter(function () {
      return !$(this).closest('.demo, .practice, details.answer, .callout').length;
    });
    if (heads.length < 2) return;

    var items = [];
    heads.each(function (i) {
      var $h = $(this);
      var id = $h.attr('id');
      if (!id) {
        id = 'sec-' + (i + 1);
        $h.attr('id', id);
      }
      items.push({ id: id, level: $h.prop('tagName').toLowerCase(), text: $h.text() });
    });

    var html = '<nav class="toc" aria-label="本页目录"><div class="toc-title">本式目录</div>';
    items.forEach(function (it) {
      // 注意：这里用 l2/l3 而非 h2/h3 —— Bootstrap 自带 .h2/.h3 标题类，
      // 若直接使用会让目录链接变成巨大标题字。
      html += '<a class="l' + (it.level === 'h3' ? '3' : '2') + '" href="#' + it.id + '">' + it.text + '</a>';
    });
    html += '</nav>';

    var $toc = $(html);
    $main.after($toc);
    $('.content').addClass('has-toc');

    // 滚动高亮当前小节
    var $links = $toc.find('a');
    var onScroll = function () {
      var pos = window.scrollY + 90;
      var cur = null;
      items.forEach(function (it) {
        var el = document.getElementById(it.id);
        if (el && el.offsetTop <= pos) cur = it.id;
      });
      $links.removeClass('active');
      if (cur) $toc.find('a[href="#' + cur + '"]').addClass('active');
    };
    $(window).on('scroll.toc', onScroll);
    onScroll();
  }

  // ================= 渲染：页脚与翻页 =================

  function injectFooter(pageId) {
    var idx = findPageIndex(pageId);
    var prev = idx > 0 ? PAGES[idx - 1] : null;
    var next = idx >= 0 && idx < PAGES.length - 1 ? PAGES[idx + 1] : null;

    var html = '<div class="pager">';
    if (prev) {
      html += '<a class="pager-prev" href="' + url(prev.href) + '">'
            + '<span class="pager-dir">‹ 上一式</span>'
            + '<span class="pager-title">' + prev.nav + ' · ' + prev.title + '</span></a>';
    } else {
      html += '<span></span>';
    }
    if (next) {
      html += '<a class="pager-next" href="' + url(next.href) + '">'
            + '<span class="pager-dir">下一式 ›</span>'
            + '<span class="pager-title">' + next.nav + ' · ' + next.title + '</span></a>';
    } else {
      html += '<a class="pager-next" href="' + url('index.html') + '">'
            + '<span class="pager-dir">回到首页 ›</span>'
            + '<span class="pager-title">修行地图</span></a>';
    }
    html += '</div>';

    html += '<div class="footer-meta">'
          + '<p>' + T.title + ' · ' + T.tagline + '</p>'
          + '<p>本站完全离线可用 · 零构建工具 · 依据 <a href="' + url('archive/bootstrap-docs/index.html') + '">Bootstrap 5.3.8</a> 与 jQuery 4.0.0 本地文件编写</p>'
          + '</div>';

    $('#site-footer').html(html);
  }

  // ================= 全站搜索（索引由 tools/gen-search-index.py 生成） =================

  function initSearch() {
    var data = window.DOJO_SEARCH || [];
    if (!data.length) return;

    var $wrap = $('<div class="search-box">'
      + '<input type="search" id="site-search" class="form-control form-control-sm" placeholder="搜索全站 · 按 / 聚焦" aria-label="全站搜索">'
      + '<div class="search-results" id="search-results" hidden></div>'
      + '</div>');
    $('.topbar-search').append($wrap);

    var $input = $('#site-search');
    var $res = $('#search-results');

    function escHtml(s) {
      return s.replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }

    function run() {
      // 注意：jQuery 4 已移除 $.trim，这里用原生 String#trim
      var q = ($input.val() || '').trim().toLowerCase();
      if (q.length < 1) { $res.attr('hidden', true); return; }
      var terms = q.split(/\s+/);
      var hits = [];
      data.forEach(function (d) {
        var title = d.title.toLowerCase();
        var text = d.text.toLowerCase();
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          var t = terms[i];
          if (title.indexOf(t) !== -1) score += 3;
          else if (text.indexOf(t) !== -1) score += 1;
          else { score = 0; break; }
        }
        if (score > 0) hits.push({ d: d, score: score });
      });
      hits.sort(function (a, b) { return b.score - a.score; });
      hits = hits.slice(0, 12);

      if (!hits.length) {
        $res.html('<div class="search-empty">没有找到相关章节</div>');
      } else {
        var html = '';
        hits.forEach(function (h) {
          html += '<a class="search-item" href="' + url(h.d.url) + '">'
                + '<span class="search-item-title">' + escHtml(h.d.title) + '</span>'
                + '<span class="search-item-url">' + escHtml(h.d.url) + '</span></a>';
        });
        $res.html(html);
      }
      $res.attr('hidden', false);
    }

    var timer = null;
    $input.on('input', function () {
      clearTimeout(timer);
      timer = setTimeout(run, 150);
    });
    $input.on('keydown', function (e) {
      if (e.key === 'Escape') { $res.attr('hidden', true); $input.blur(); }
    });
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.search-box').length) $res.attr('hidden', true);
    });
    $(document).on('keydown', function (e) {
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        e.preventDefault();
        $input.focus();
      }
    });
  }

  // ================= 明暗主题切换 =================
  // 开关是 <html data-bs-theme="...">（Bootstrap 5.3 官方主题属性）；
  // loader.js 在 <head> 中已尽早应用（localStorage 或系统偏好），
  // 这里负责按钮 UI 的注入与切换、持久化。

  var THEME_KEY = 'dojo-theme';

  function isDarkTheme() {
    return document.documentElement.getAttribute('data-bs-theme') === 'dark';
  }

  // 同步所有切换按钮的图标与提示（日间显示月亮，夜间显示太阳）
  function syncThemeUI() {
    var dark = isDarkTheme();
    var label = dark ? '切换到浅色模式' : '切换到暗色模式';
    $('.theme-toggle').each(function () {
      var $btn = $(this);
      $btn.html(dark ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>');
      $btn.attr('aria-pressed', dark ? 'true' : 'false');
      $btn.attr('aria-label', label);
      $btn.attr('title', label);
    });
  }

  function toggleTheme() {
    var next = isDarkTheme() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 隐私模式等场景下静默失败 */ }
    syncThemeUI();
  }

  // 系统明暗偏好变化时自动跟随（仅当用户从未手动选择过——手动选择后以用户为准）
  function initTheme() {
    syncThemeUI();
    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq && typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', function (e) {
        var saved = null;
        try { saved = localStorage.getItem(THEME_KEY); } catch (err) { /* 忽略 */ }
        if (saved === 'light' || saved === 'dark') return;
        document.documentElement.setAttribute('data-bs-theme', e.matches ? 'dark' : 'light');
        syncThemeUI();
      });
    }
  }

  // ================= 初始化 =================

  function init() {
    var pageId = document.body.getAttribute('data-page') || 'home';
    var page = BY_ID[pageId];

    // 侧边栏（桌面 + 移动端 offcanvas 共用同一份渲染结果）
    var sidebarHtml = renderSidebar(pageId);
    $('#sidebar').html(sidebarHtml);

    var $oc = $('<div class="offcanvas offcanvas-start sidebar-offcanvas" tabindex="-1" id="sidebar-offcanvas">'
              +   '<div class="offcanvas-header"><span class="offcanvas-title brand-title">' + T.title + '</span>'
              +   '<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="关闭目录"></button></div>'
              +   '<div class="offcanvas-body">' + sidebarHtml + '</div>'
              + '</div>').appendTo('body');

    // 页面级吸顶顶栏：品牌 + 全站搜索（桌面）+ 明暗切换，全尺寸共用一条。
    // 移动端 <992px 时搜索框收起来，hamburger 展开 offcanvas 目录。
    var $top = $('<header class="topbar">'
              + '<button type="button" class="hamburger" data-bs-toggle="offcanvas" data-bs-target="#sidebar-offcanvas" aria-label="打开目录"><i class="bi bi-list"></i></button>'
              + '<a class="topbar-brand" href="' + url('index.html') + '">'
              +   '<span class="seal">静</span>'
              +   '<span class="brand-title">' + T.title + '</span>'
              + '</a>'
              + '<div class="topbar-search"></div>'
              + '<button type="button" class="theme-toggle theme-toggle-top" aria-pressed="false" aria-label="切换明暗主题" title="切换明暗主题"></button>'
              + '</header>').prependTo('body');
    initSearch();

    // 明暗主题切换：绑定（事件委托）+ 同步初始状态
    $(document).on('click', '.theme-toggle', toggleTheme);
    initTheme();

    // 当前页在侧边栏中滚动到可见位置
    var $active = $('#sidebar .side-chapters a.active');
    if ($active.length) {
      var pos = $active.position();
      if (pos) $('#sidebar').scrollTop(Math.max(0, pos.top - 120));
    }

    injectHeader(page);
    injectChapterList(pageId);
    injectToc();
    injectFooter(pageId);
    HL.enhance(document);

    // 放行需要“全资源就绪”的演示脚本（loader.js 的 DOJO.ready 队列）
    if (window.DOJO && typeof DOJO._flush === 'function') DOJO._flush();
  }

  $(init);
})();
