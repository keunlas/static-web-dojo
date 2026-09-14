#!/usr/bin/env python3
"""从 reference 的 bootstrap-icons.json 生成藏经阁「图标大全」页面。

用法：python3 tools/gen-icons-page.py
输出：site/archive/icons/index.html（静态骨架 + 全部图标的网格 + 过滤交互）
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS_JSON = os.path.join(ROOT, "reference/bootstrap/bootstrap-icons-1.13.1/bootstrap-icons.json")
OUT_DIR = os.path.join(ROOT, "site/archive/icons")
OUT_FILE = os.path.join(OUT_DIR, "index.html")

with open(ICONS_JSON, encoding="utf-8") as f:
    icons = json.load(f)  # dict: 图标名 -> 码点

names = sorted(icons.keys())
cells = "\n".join(
    f'      <div class="icon-cell" data-name="{n}"><i class="bi bi-{n}" aria-hidden="true"></i><span class="icon-name">{n}</span></div>'
    for n in names
)

page = f"""<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>图标大全 | 藏经阁 · 纯静态网页的修行</title>
<meta name="description" content="Bootstrap Icons 1.13.1 全部图标速查，支持按名称过滤，完全离线。">
<script src="../../assets/js/loader.js"></script>
</head>
<body data-page="archive-icons">
<a class="skip-link" href="#main">跳到正文</a>
<div class="layout">
  <aside class="sidebar" id="sidebar" aria-label="全站目录"></aside>
  <div class="content">
    <main id="main">

      <p class="chapter-lead">
        Bootstrap Icons 1.13.1 共收录 <strong>{len(names)}</strong> 个矢量图标。
        在输入框里敲名字即可过滤，点击图标可复制类名。
      </p>

      <script type="text/plain" data-lang="html" data-title="使用方式">
        <!-- 引入（css 与 fonts 目录必须在一起）-->
        <link rel="stylesheet" href="assets/vendor/bootstrap-icons/bootstrap-icons.min.css">

        <!-- 使用 -->
        <i class="bi bi-heart-fill"></i>
      </script>

      <div class="callout">
        <div class="callout-title">使用提示</div>
        <ul style="margin:0">
          <li>图标大小跟随字号（<code>font-size</code>），颜色跟随文字色（<code>color</code>）；</li>
          <li>常用：<code>bi-house</code>、<code>bi-search</code>、<code>bi-heart-fill</code>、<code>bi-trash</code>、<code>bi-pencil</code>；</li>
          <li>教程第十四式《图标库》有完整的引入讲解。</li>
        </ul>
      </div>

      <div class="icon-toolbar">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search" aria-hidden="true"></i></span>
          <input type="search" id="icon-filter" class="form-control" placeholder="输入图标名过滤，如 heart、house、arrow…" aria-label="过滤图标">
        </div>
        <button type="button" id="icon-clear" class="btn btn-outline-primary">清空</button>
      </div>
      <p class="icon-count" id="icon-count">显示 {len(names)} / {len(names)}</p>

      <div class="icons-grid" id="icons-grid">
{cells}
      </div>

      <script>
        $(function () {{
          var grid = $('#icons-grid');
          var cells = grid.find('.icon-cell');
          function apply(kw) {{
            kw = kw.trim().toLowerCase();
            var shown = 0;
            cells.each(function () {{
              var hit = !kw || $(this).attr('data-name').indexOf(kw) !== -1;
              $(this).toggle(hit);
              if (hit) shown++;
            }});
            $('#icon-count').text('显示 ' + shown + ' / ' + cells.length);
          }}
          $('#icon-filter').on('input', function () {{ apply(this.value); }});
          $('#icon-clear').on('click', function () {{ $('#icon-filter').val(''); apply(''); }});
          // 点击图标复制类名
          grid.on('click', '.icon-cell', function () {{
            var name = $(this).attr('data-name');
            var cls = 'bi-' + name;
            var ta = document.createElement('textarea');
            ta.value = cls;
            document.body.appendChild(ta);
            ta.select();
            try {{ document.execCommand('copy'); }} catch (e) {{}}
            document.body.removeChild(ta);
            $(this).addClass('copied');
            var self = this;
            setTimeout(function () {{ $(self).removeClass('copied'); }}, 700);
          }});
        }});
      </script>

    </main>
    <footer class="site-footer" id="site-footer"></footer>
  </div>
</div>
</body>
</html>
"""

os.makedirs(OUT_DIR, exist_ok=True)
with open(OUT_FILE, "w", encoding="utf-8") as f:
    f.write(page)

print(f"已生成 {OUT_FILE}（{len(names)} 个图标）")
