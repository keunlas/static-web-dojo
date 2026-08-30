#!/usr/bin/env python3
"""内部链接检查器：解析 site/ 下本站手写页面的相对 href/src，断言目标文件存在。

排除第三方镜像（archive/bootstrap-docs、archive/examples）与锚点（#）。
注意：site.js 里由 JS 拼接出的链接不在检查范围（其数据源在 site.js 中核对）。

用法：python3 tools/check-links.py
"""
import html.parser
import os
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, "site")

EXCLUDE_DIRS = {
    os.path.join(SITE, "archive/bootstrap-docs"),
    os.path.join(SITE, "archive/examples"),
    os.path.join(SITE, "assets"),
}

TAGS = {"a": "href", "link": "href", "script": "src", "img": "src",
        "iframe": "src", "source": "src"}


class Links(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.refs = []

    def handle_starttag(self, tag, attrs):
        attr = TAGS.get(tag)
        if not attr:
            return
        for k, v in attrs:
            if k == attr and v:
                self.refs.append((tag, v))


def check_file(path):
    rel = os.path.relpath(path, SITE).replace(os.sep, "/")
    with open(path, encoding="utf-8") as f:
        src = f.read()
    p = Links()
    p.feed(src)
    p.close()
    problems = []
    for tag, ref in p.refs:
        if ref.startswith(("http://", "https://", "//", "#", "data:", "mailto:")):
            continue
        url = urllib.parse.urlsplit(ref)
        target = os.path.normpath(os.path.join(os.path.dirname(path), url.path))
        if not os.path.exists(target):
            problems.append(f"  [{tag}] {ref}")
    return rel, problems


fail = 0
count = 0
for dirpath, dirnames, filenames in os.walk(SITE):
    dirnames[:] = [d for d in dirnames if os.path.join(dirpath, d) not in EXCLUDE_DIRS]
    for fn in filenames:
        if not fn.endswith(".html"):
            continue
        count += 1
        rel, problems = check_file(os.path.join(dirpath, fn))
        if problems:
            fail += 1
            print(f"✘ {rel}")
            for pr in problems:
                print(pr)

if fail:
    print(f"\n共检查 {count} 个页面，{fail} 个存在失效链接。")
    sys.exit(1)
print(f"✔ 共检查 {count} 个页面，内部链接全部有效。")
