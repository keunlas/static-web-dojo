#!/usr/bin/env python3
"""生成全站搜索索引 site/assets/js/search-index.js。

扫描 site/ 下本站手写页面（排除第三方镜像与资源目录），
提取 <title>、<body> 正文文本，输出为 window.DOJO_SEARCH 数组。
索引是嵌入式 JS（非 JSON），因此 file:// 双击打开也能搜索。

用法：python3 tools/gen-search-index.py
"""
import html.parser
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, "site")
OUT = os.path.join(SITE, "assets/js/search-index.js")

EXCLUDE_DIRS = {
    os.path.join(SITE, "archive/bootstrap-docs"),
    os.path.join(SITE, "archive/examples"),
    os.path.join(SITE, "assets"),
}

class Extract(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.in_title = False
        self.skip = 0  # script/style 深度
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.in_title = True
        if tag in ("script", "style", "noscript"):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag in ("script", "style", "noscript") and self.skip > 0:
            self.skip -= 1

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        elif self.skip == 0:
            self.parts.append(data)


def text_of(path):
    with open(path, encoding="utf-8") as f:
        src = f.read()
    p = Extract()
    p.feed(src)
    p.close()
    body = " ".join(p.parts)
    body = re.sub(r"\s+", " ", body).strip()
    return p.title.strip(), body


entries = []
for dirpath, dirnames, filenames in os.walk(SITE):
    dirnames[:] = [d for d in dirnames if os.path.join(dirpath, d) not in EXCLUDE_DIRS]
    for fn in filenames:
        if not fn.endswith(".html"):
            continue
        path = os.path.join(dirpath, fn)
        rel = os.path.relpath(path, SITE).replace(os.sep, "/")
        title, body = text_of(path)
        entries.append({"url": rel, "title": title, "text": body})

entries.sort(key=lambda e: e["url"])

with open(OUT, "w", encoding="utf-8") as f:
    f.write("// 本文件由 tools/gen-search-index.py 生成，勿手改。\n")
    f.write("// 全站搜索索引：嵌入式 JS，file:// 下也可用（site.js 消费）。\n")
    f.write("window.DOJO_SEARCH = [\n")
    for e in entries:
        def js(s):
            return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")
        f.write("  { url: '%s', title: '%s', text: '%s' },\n"
                % (js(e["url"]), js(e["title"]), js(e["text"])))
    f.write("];\n")

print(f"已生成 {OUT}（{len(entries)} 个页面）")
