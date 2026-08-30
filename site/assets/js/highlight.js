/**
 * 迷你代码高亮器（纯手写、零依赖、完全离线）。
 *
 * 支持语言：html / css / js
 *
 * 页面中的写法有两种：
 *   A. 原始源码（推荐，无需手动转义 HTML 特殊字符）：
 *        <script type="text/plain" data-lang="html" data-title="页面结构">
 *          <h1>你好</h1>
 *        </script>
 *      注意：源码里若出现 </script>，请写成 <\/script>
 *      （这是 HTML 解析器的限制，高亮器展示时会自动还原为 </script>）。
 *
 *   B. 已转义源码：
 *        <pre><code data-lang="css">.btn { color: red; }</code></pre>
 *
 * 高亮器会把 A、B 两种写法统一渲染为带“复制”按钮的代码块。
 */
(function (global) {
  'use strict';

  // ---------- 基础工具 ----------

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /** 去掉源码首尾空行，并裁剪所有行共有的前导空白 */
  function dedent(s) {
    var lines = s.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
    var min = Infinity;
    lines.forEach(function (l) {
      if (l.trim() === '') return;
      var m = l.match(/^[\t ]*/)[0].length;
      if (m < min) min = m;
    });
    if (!isFinite(min)) min = 0;
    return lines.map(function (l) { return l.slice(min); }).join('\n');
  }

  // ---------- 各语言规则 ----------
  // 每条规则：regExp（内含多个捕获组）+ groups（组号 → 类名）。
  // 单次扫描替换，先匹配者先得，不会互相嵌套，简单可靠。

  var RULES = {
    js: {
      reg: /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(\d+(?:\.\d+)?)\b|\b(const|let|var|function|return|if|else|for|while|do|new|typeof|instanceof|in|of|this|class|extends|super|import|export|default|try|catch|finally|throw|switch|case|break|continue|delete|await|async|yield|true|false|null|undefined)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g,
      groups: { 1: 'tok-com', 2: 'tok-str', 3: 'tok-num', 4: 'tok-kw', 5: 'tok-fn' }
    },
    css: {
      reg: /(\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|fr|deg)?\b)|(@[a-zA-Z-]+)|([a-zA-Z-]+)(?=\s*:)/g,
      groups: { 1: 'tok-com', 2: 'tok-str', 3: 'tok-num', 4: 'tok-kw', 5: 'tok-attr' }
    },
    html: {
      reg: /(<!--[\s\S]*?-->)|(<!doctype[^>]*>)|(<\/?[a-zA-Z][\w-]*|\/?>)|([a-zA-Z-]+)(?==)|("[^"]*")/g,
      groups: { 1: 'tok-com', 2: 'tok-kw', 3: 'tok-tag', 4: 'tok-attr', 5: 'tok-str' }
    }
  };

  /** 对一段源码做高亮，返回 HTML 字符串 */
  function highlight(src, lang) {
    var rule = RULES[lang] || RULES.html;
    var safe = esc(src);
    return safe.replace(rule.reg, function (m) {
      for (var i = 1; i < arguments.length - 2; i++) {
        if (arguments[i] !== undefined) {
          var cls = rule.groups[i];
          if (cls) return '<span class="' + cls + '">' + m + '</span>';
        }
      }
      return m;
    });
  }

  /** 把一段原始源码包装成带复制按钮的代码块 */
  function codeBlock(src, lang, title) {
    var badge = lang.toUpperCase();
    var bar =
      '<div class="codeblock-bar">' +
        '<span class="codeblock-title">' + (title ? esc(title) : '源码') + '</span>' +
        '<span class="codeblock-lang">' + badge + '</span>' +
      '</div>';
    var pre =
      '<div class="codeblock">' + bar +
        '<pre><code>' + highlight(src, lang) + '</code></pre>' +
        '<button type="button" class="copy-btn">复制</button>' +
      '</div>';
    return pre;
  }

  // ---------- 对外接口 ----------

  function enhance(scope) {
    scope = scope || document;

    // A 型：script[type="text/plain"]
    var blocks = scope.querySelectorAll('script[type="text/plain"][data-lang]');
    Array.prototype.forEach.call(blocks, function (el) {
      var lang = el.getAttribute('data-lang');
      var title = el.getAttribute('data-title') || '';
      var raw = el.textContent || '';
      // 约定：源码中的 <\/script> 恢复为 </script>（HTML 解析限制的绕行写法）
      raw = dedent(raw).replace(/<\\\//g, '</');
      var wrap = document.createElement('div');
      wrap.innerHTML = codeBlock(raw, lang, title);
      el.parentNode.replaceChild(wrap.firstChild, el);
    });

    // B 型：pre > code[data-lang]（内容已由作者手动转义）
    var pres = scope.querySelectorAll('pre > code[data-lang]');
    Array.prototype.forEach.call(pres, function (code) {
      var lang = code.getAttribute('data-lang');
      var title = code.getAttribute('data-title') || '';
      var raw = code.textContent;
      var pre = code.parentNode;
      var wrap = document.createElement('div');
      wrap.innerHTML = codeBlock(raw, lang, title);
      pre.parentNode.replaceChild(wrap.firstChild, pre);
    });
  }

  // 复制按钮：事件委托，任何环境下（含 file://）都可用
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.copy-btn') : null;
    if (!btn) return;
    var code = btn.parentNode.querySelector('code');
    if (!code) return;
    var text = code.textContent;

    function done() {
      var old = btn.textContent;
      btn.textContent = '✓ 已复制';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = old;
        btn.classList.remove('copied');
      }, 1500);
    }

    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) { /* 忽略 */ }
      document.body.removeChild(ta);
      done();
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  });

  global.HL = { enhance: enhance, highlight: highlight };
})(window);
