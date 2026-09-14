#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""离线红线检查（技术层面）：只在**真实执行的脚本**里找禁用写法。

背景：JS 篇必须给读者讲 `fetch`、`XMLHttpRequest`、ES 模块这些东西（以及它们在
file:// 下的限制），正文与教学源码块里出现这些字眼是**应该的**。
所以这里不看正文，只看页面里真正会执行的 <script>：

  ✘ <script type="module">        —— 离线站点不用 ES 模块（file:// 下会被 CORS 拦）
  ✘ 脚本体内调用 fetch( / XMLHttpRequest —— 同上，需要服务器环境

`type="text/plain"` 的教学源码块会被跳过（它们只是展示用的文本）。

用法：python3 tools/check-offline-tech.py <文件…>
退出码：0 全部干净；1 存在违规。
"""
import re
import sys
from pathlib import Path

SCRIPT_RE = re.compile(r"<script\b([^>]*)>(.*?)</script\s*>", re.S | re.I)


def scan(path: Path):
    src = path.read_text(encoding="utf-8", errors="replace")
    problems = []
    for m in SCRIPT_RE.finditer(src):
        attrs, body = m.group(1), m.group(2)
        if "text/plain" in attrs:
            continue                      # 教学源码块：只是文本，不执行
        line_no = src[:m.start()].count("\n") + 1
        if re.search(r'type\s*=\s*["\']?module', attrs, re.I):
            problems.append((line_no, '<script type="module">（离线站点不用 ES 模块）'))
        if re.search(r"\bfetch\s*\(", body):
            problems.append((line_no, "脚本体内调用了 fetch()"))
        if "XMLHttpRequest" in body:
            problems.append((line_no, "脚本体内使用了 XMLHttpRequest"))
    return problems


def main(argv):
    failed = 0
    for arg in argv:
        path = Path(arg)
        problems = scan(path)
        if problems:
            failed = 1
            print("✘ %s" % path)
            for line_no, why in problems:
                print("    第 %d 行起：%s" % (line_no, why))
    if failed:
        print("发现真实脚本里的离线违规写法，请修复后重跑。")
    return failed


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
