#!/usr/bin/env python3
"""生成全站站点地图 site/sitemap.xml。

页面清单取自 site/assets/js/site.js 的 SECTIONS（全站目录唯一数据源），
前置首页 index.html，追加 SECTIONS 之外的整页示例（demo/portfolio、demo/todo）。
错误页（404.html）与纯资源文件按惯例不收录。

sitemap 协议要求 <loc> 为绝对 URL，而本站可部署到任意域名/子目录，
因此基址由 --base 指定；未指定时使用占位域名 https://example.com/，
部署前务必换成真实域名重新生成：
    python3 tools/gen-sitemap.py --base https://你的域名/

用法：python3 tools/gen-sitemap.py [--base https://example.com/]
"""
import argparse
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, "site")
SITE_JS = os.path.join(SITE, "assets/js/site.js")
OUT = os.path.join(SITE, "sitemap.xml")

# 首页登记在 site.js 的 PAGES 里，不在 SECTIONS 中，这里手动前置。
HOME = "index.html"

# SECTIONS 之外的独立成品页（demo/ 整页示例，章节正文有链接），一并收录。
EXTRA_PAGES = [
    "demo/portfolio/index.html",
    "demo/todo/index.html",
]


def parse_sections():
    """从 site.js 的 SECTIONS 数组里按顺序提取全部 href（分卷页 + 章节页）。"""
    with open(SITE_JS, encoding="utf-8") as f:
        src = f.read()
    m = re.search(r"var SECTIONS = \[(.*?)\n\s*\];", src, re.S)
    if not m:
        sys.exit("无法在 site.js 中找到 SECTIONS 数组")
    return re.findall(r"href:\s*'([^']+)'", m.group(1))


def normalize_loc(href):
    """index.html 收敛为目录 URL（与真实访问路径一致，对搜索引擎更友好）。"""
    if href == HOME:
        return ""
    if href.endswith("/index.html"):
        return href[: -len("index.html")]
    return href


def main():
    ap = argparse.ArgumentParser(description="生成 site/sitemap.xml")
    ap.add_argument(
        "--base",
        default="https://example.com/",
        help="站点基址（含协议与结尾斜杠），如 https://example.com/",
    )
    args = ap.parse_args()
    base = args.base if args.base.endswith("/") else args.base + "/"
    if "example.com" in base:
        print("⚠ 未指定真实 --base，输出使用占位域名；部署前请重新生成：")
        print("  python3 tools/gen-sitemap.py --base https://你的域名/")

    hrefs = [HOME] + parse_sections() + EXTRA_PAGES
    seen, missing = set(), []
    for href in hrefs:
        if href in seen:
            continue
        seen.add(href)
        if not os.path.exists(os.path.join(SITE, href)):
            missing.append(href)
    if missing:
        print("⚠ 以下页面文件尚不存在（藏经阁镜像需先跑 tools/sync-assets.sh）：")
        for href in missing:
            print("  - " + href)

    # 注：XML 注释内不允许出现“--”（会破坏良构性），所以这里不写带 --base 的命令行。
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        "<!-- 本文件由 tools/gen-sitemap.py 生成，勿手改。",
        "     部署前请用真实域名替换下方占位域名并重新生成，用法见该脚本顶部注释。 -->",
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for href in hrefs:
        lines.append("  <url><loc>%s</loc></url>" % (base + normalize_loc(href)))
    lines.append("</urlset>")
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print("已生成 %s（%d 个页面，基址 %s）" % (OUT, len(seen), base))


if __name__ == "__main__":
    main()
