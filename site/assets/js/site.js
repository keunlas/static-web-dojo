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
      title: '基础篇',
      href: 'basics/index.html',
      seal: '一',
      desc: 'HTML、CSS、JavaScript 三样基本功，四十三式从零讲起，读完可当字典查。',
      chapters: [
        { num: '01', href: 'basics/01-html-intro.html', title: '网页与 HTML', desc: 'HTML 是什么、页面骨架、元素与属性、写下第一个网页' },
        { num: '02', href: 'basics/02-html-text.html', title: '文本与语义', desc: '标题、段落、换行、强调、引用、代码与字符实体' },
        { num: '03', href: 'basics/03-html-lists-links.html', title: '列表与链接', desc: 'ul/ol/dl、路径写法、锚点、target 与 rel、download' },
        { num: '04', href: 'basics/04-html-images.html', title: '图片', desc: 'img 全属性、alt 怎么写得体、图片格式选择、响应式图片' },
        { num: '05', href: 'basics/05-html-media.html', title: '音视频与嵌入', desc: 'video/audio 属性、track 字幕、自动播放规矩、iframe 嵌入' },
        { num: '06', href: 'basics/06-html-tables.html', title: '表格', desc: '行列结构、caption 与行组、th 的 scope、colspan 与 rowspan' },
        { num: '07', href: 'basics/07-html-forms-1.html', title: '表单（上）', desc: 'form 与提交机制、label 绑定、文本类 input、三种按钮' },
        { num: '08', href: 'basics/08-html-forms-2.html', title: '表单（下）', desc: '单复选、下拉与 datalist、日期颜色文件、fieldset 与校验' },
        { num: '09', href: 'basics/09-html-semantics.html', title: '语义化结构', desc: '七个地标元素、标题层级、details/time/address 与 div 的用途' },
        { num: '10', href: 'basics/10-html-global-attrs.html', title: '全局属性与 head', desc: 'id/class/data-*、hidden/tabindex/contenteditable、head 元数据与脚本时机' },
        { num: '11', href: 'basics/11-html-a11y.html', title: '无障碍', desc: '语义优先、可访问名称、键盘可达性、ARIA 三条戒律与自测清单' },
        { num: '12', href: 'basics/12-html-project.html', title: '综合修炼：语义化个人主页', desc: 'HTML 部分收官：六步手写一个纯 HTML 的个人主页' },
        { num: '13', href: 'basics/13-css-intro.html', title: 'CSS 初识', desc: '规则集语法、三种引入方式、起步样式与开发者工具' },
        { num: '14', href: 'basics/14-css-selectors.html', title: '选择器大全', desc: '组合器、属性选择器、状态与结构伪类、伪元素与优先级计分' },
        { num: '15', href: 'basics/15-css-cascade.html', title: '层叠、继承与优先级', desc: '四步裁决、继承与四个关键字、!important 与 @layer、排查清单' },
        { num: '16', href: 'basics/16-css-box-model.html', title: '盒模型', desc: '四层结构、box-sizing、padding 与 margin、外边距折叠、溢出与行内元素' },
        { num: '17', href: 'basics/17-css-units-colors.html', title: '单位、数值与颜色', desc: 'px/em/rem/%/vw/ch、calc/clamp、颜色五种写法、currentColor 与透明度' },
        { num: '18', href: 'basics/18-css-typography.html', title: '排版与字体', desc: '字体栈、@font-face、字号字重行高、文本属性与中文排版经验' },
        { num: '19', href: 'basics/19-css-background-border.html', title: '背景、边框与阴影', desc: '背景全家桶、三种渐变、边框三要素与圆角、box-shadow 与渐变文字' },
        { num: '20', href: 'basics/20-css-display-position.html', title: '显示与定位', desc: 'display 各值、position 五种、z-index 与层叠上下文、float 与 BFC' },
        { num: '21', href: 'basics/21-css-flexbox.html', title: 'Flexbox 弹性布局', desc: '主轴交叉轴、容器六属性、项目四属性、gap 与六套常见布局套路' },
        { num: '22', href: 'basics/22-css-grid.html', title: 'Grid 网格布局', desc: 'fr/repeat/minmax/auto-fit、跨格与 grid-area、模板区域、对齐与叠加' },
        { num: '23', href: 'basics/23-css-responsive.html', title: '响应式心法', desc: '移动优先、viewport 与媒体查询、断点选择、容器查询与触控目标' },
        { num: '24', href: 'basics/24-css-transition-animation.html', title: '过渡、变形与动画', desc: 'transition 四件套、缓动函数、transform 家族、@keyframes 与性能三底线' },
        { num: '25', href: 'basics/25-css-variables.html', title: 'CSS 变量与主题', desc: '自定义属性、作用域与继承、回退值与无效值、主题切换与 calc/JS 配合' },
        { num: '26', href: 'basics/26-css-project.html', title: '综合修炼：把主页打扮起来', desc: 'CSS 部分收官：六步给纯 HTML 主页穿上衣服，附对照验收清单' },
        { num: '27', href: 'basics/27-js-intro.html', title: 'JavaScript 初识', desc: 'JS 负责什么、三种引入方式与脚本位置、控制台、注释分号与严格模式' },
        { num: '28', href: 'basics/28-js-variables.html', title: '变量与数据类型', desc: 'let/const/var、七种原始类型与 typeof、引用值、真假值与模板字符串' },
        { num: '29', href: 'basics/29-js-operators.html', title: '运算符与表达式', desc: '算术与拼接、=== 与 ==、逻辑短路、?? 与 ?.、优先级与结合性' },
        { num: '30', href: 'basics/30-js-control-flow.html', title: '控制流', desc: 'if 与 switch、三种循环、for...of 与 for...in、break 与 continue' },
        { num: '31', href: 'basics/31-js-functions.html', title: '函数与作用域', desc: '三种写法与提升、参数与返回值、作用域与遮蔽、闭包、递归、回调与 this 初步' },
        { num: '32', href: 'basics/32-js-arrays.html', title: '数组', desc: '增删改查、会/不改原数组的区别、查找与迭代方法全家桶、排序、解构与展开' },
        { num: '33', href: 'basics/33-js-objects.html', title: '对象与 Map/Set', desc: '属性与方法、解构与浅深复制、Object 静态方法、Map/Set、JSON 编解码' },
        { num: '34', href: 'basics/34-js-strings-numbers.html', title: '字符串、正则、数字与日期', desc: '字符串方法速查、正则元字符与方法、数字精度与 Math、Date 与时区、Intl 格式化' },
        { num: '35', href: 'basics/35-js-classes.html', title: '类与原型', desc: '构造函数与 new、原型链、class 语法与私有字段、extends 继承、call/apply/bind' },
        { num: '36', href: 'basics/36-js-errors.html', title: '错误处理与调试', desc: '错误对象与类型、try/catch/finally、throw 与自定义错误、异步陷阱、控制台与断点' },
        { num: '37', href: 'basics/37-js-dom.html', title: 'DOM 操作', desc: '查找元素、内容与属性、classList 与 style、增删改与 DocumentFragment、innerHTML 安全' },
        { num: '38', href: 'basics/38-js-events.html', title: '事件', desc: '监听与解绑、事件对象、冒泡与捕获、事件委托、默认行为、防抖与节流' },
        { num: '39', href: 'basics/39-js-async.html', title: '异步', desc: 'setTimeout 与 setInterval、Promise 三态与组合方法、async/await 与 try/catch、事件循环的先后顺序' },
        { num: '40', href: 'basics/40-js-storage.html', title: '浏览器与本地存储', desc: 'window 与视口、location 与 hashchange、localStorage 与 sessionStorage、file:// 下 fetch 的限制与静态站带数据的办法' },
        { num: '41', href: 'basics/41-js-modern.html', title: '现代 JavaScript', desc: 'ES6+ 特性总览、模块与经典脚本的取舍、特性检测与降级、polyfill 与转译、继续深入的地图' },
        { num: '42', href: 'basics/42-js-project.html', title: '综合修炼：让主页动起来', desc: '用原生 JavaScript 给个人主页加五个行为：主题切换、作品筛选、留言板、回到顶部、滚动高亮导航' },
        { num: '43', href: 'basics/43-next-steps.html', title: '结业：往后的路', desc: '43 式回顾、排错三步、查文档的三栏与关键词、复习的办法，以及接下来可以往哪走' }
      ]
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
