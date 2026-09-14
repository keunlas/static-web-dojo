#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查**基础篇**演示里是否用了“别人的类名”。

背景（本仓库真实踩过的坑）：站点皮肤叠加在 Bootstrap 之上，
演示若使用 `.row`、`.card`、`.navbar` 这类 Bootstrap 已有的类名，
就会悄悄继承栅格/组件的样式，演示效果与源码看起来对不上（而且不报错）。
本脚本扫描 `site/basics/` 下 .demo 的预览区，列出与 Bootstrap、site.css 撞名的类名。

约定：基础篇演示内的自定义类名统一加 `d-` 前缀（见 notes/conventions.md §3.2）；
留白类（mt-2 / mb-0 / p-3 这类间距工具类）属于有意使用，不计入冲突。
Bootstrap 篇与 jQuery 篇的演示**本来就该用 Bootstrap 类名**，因此不在检查范围内。

用法：
    python3 tools/check-demo-classes.py                      # 扫描 site/basics/
    python3 tools/check-demo-classes.py site/basics/21-css-flexbox.html [...]

退出码：0 无冲突；1 存在冲突。
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
SOURCES = [
    SITE / "assets/vendor/bootstrap/bootstrap.min.css",
    SITE / "assets/css/site.css",
]

# 站点自身的布局类（演示里也不会用到，但属于“别人的名字”）
EXTRA_RESERVED = {"skip-link", "layout", "content", "topbar", "sidebar", "toc"}

# 有意使用的 Bootstrap 间距工具类（演示里用来控制留白）
ALLOWED = re.compile(r"^(m[trblxy]?|p[trblxy]?)-[0-5]$")
# 有意使用的 Bootstrap Icons 图标类（无障碍一章讲图标按钮时会用到）
ALLOWED_ICONS = re.compile(r"^bi(-[\w-]+)?$")


def reserved_names():
    names = set(EXTRA_RESERVED)
    for path in SOURCES:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        names.update(re.findall(r"\.(-?[a-zA-Z_][\w-]*)", text))
    return names


def demo_previews(page: str):
    """返回页面上每个 .demo-preview 的内部 HTML。"""
    out = []
    for m in re.finditer(r'<div class="demo-preview">', page):
        i = m.end()
        depth = 1
        pos = i
        while depth > 0:
            nxt_o = page.find("<div", pos)
            nxt_c = page.find("</div>", pos)
            if nxt_c == -1:
                break
            if nxt_o != -1 and nxt_o < nxt_c:
                depth += 1
                pos = nxt_o + 4
            else:
                depth -= 1
                pos = nxt_c + 6
        out.append(page[i:pos - 6])
    return out


def check(path: Path, reserved):
    page = path.read_text(encoding="utf-8")
    hits = []
    for preview in demo_previews(page):
        for attr in re.findall(r'class="([^"]+)"', preview):
            for cls in attr.split():
                if (cls in reserved and not cls.startswith("d-")
                        and not ALLOWED.match(cls) and not ALLOWED_ICONS.match(cls)):
                    hits.append(cls)
    return sorted(set(hits))


def main(argv):
    reserved = reserved_names()
    targets = [Path(a) for a in argv] or sorted((SITE / "basics").glob("*.html"))
    targets = [p for p in targets if p.exists()
               and "archive/bootstrap-docs" not in p.as_posix()
               and "archive/examples" not in p.as_posix()
               and "archive/icons" not in p.as_posix()]
    failed = 0
    for path in targets:
        hits = check(path, reserved)
        if hits:
            failed += 1
            rel = path.relative_to(ROOT) if ROOT in path.parents else path
            print("✗ %s 演示里用了被占用的类名：%s" % (rel, "、".join("." + h for h in hits)))
    if failed:
        print("\n共 %d 个页面存在演示类名冲突：请改成 `d-` 前缀（见 notes/conventions.md §3.2）。" % failed)
        return 1
    print("✓ 演示类名检查通过：%d 个页面，演示里没有与 Bootstrap / site.css 撞名的类。" % len(targets))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
