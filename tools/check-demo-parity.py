#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check-demo-parity —— 校验 .demo 演示的“预览”与“源码块”是否一致。

本项目的硬性规范（见 .agents/notes/conventions.md）：
源码块必须与预览逐字一致 —— 不允许“同理 / 结构相同 / 省略 / 复制即可”这类节选，
读者把源码块整段复制出去，应当 100% 还原预览。

检查内容：
  1) HTML 源码块（data-lang="html"）与预览区的标签多重集一致（标签名 + class 排序后的集合）；
  2) JS 源码块（data-lang="js"）与预览区 <script> 归一化后一致
     （去注释、压空白、紧凑链式写法等价；$(function(){…}) / DOJO.ready(…) 外壳两边都可省略）。

用法：
    python3 tools/check-demo-parity.py            # 扫描 site/ 下全部页面
    python3 tools/check-demo-parity.py site/jquery/10-todo.html [...]

退出码：0 全部一致；1 存在不一致。
"""
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOID = {'img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'base',
        'col', 'embed', 'track', 'wbr'}


def extract_div(page, start_idx, cls):
    """返回从 start_idx 起第一个 class 含 cls 的 <div> 的内部 HTML。"""
    m = re.compile(r'<div[^>]*class="[^"]*\b' + re.escape(cls) + r'\b[^"]*"[^>]*>').search(page, start_idx)
    if not m:
        return None, None
    i = m.end()
    depth = 1
    pos = i
    while depth > 0:
        nxt_o = page.find('<div', pos)
        nxt_c = page.find('</div>', pos)
        if nxt_c == -1:
            return None, None
        if nxt_o != -1 and nxt_o < nxt_c:
            depth += 1
            pos = nxt_o + 4
        else:
            depth -= 1
            pos = nxt_c + 6
    return page[i:pos - 6], m.start()


def demos(page):
    out = []
    for m in re.finditer(r'<div class="demo">', page):
        body, _ = extract_div(page, m.start(), 'demo')
        cap = re.search(r'<div class="demo-caption">(.*?)</div>', body, re.S)
        prev, _ = extract_div(body, 0, 'demo-preview')
        src, _ = extract_div(body, 0, 'demo-source')
        out.append((cap.group(1).strip() if cap else '?', prev or '', src or ''))
    return out


def tags_of(fragment):
    fragment = re.sub(r'<script\b[^>]*>.*?</script>', '', fragment, flags=re.S)
    out = []
    for m in re.finditer(r'<(/?)([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|\'[^\']*\'|[^>"\'])*?)(/?)>', fragment):
        closing, name, attrs = m.group(1), m.group(2).lower(), m.group(3)
        if closing:
            if name in VOID:
                continue
            out.append('</' + name + '>')
            continue
        cls = re.search(r'class="([^"]*)"', attrs)
        c = ' '.join(sorted(cls.group(1).split())) if cls else ''
        out.append('<' + name + (' class="' + c + '"' if c else '') + '>')
    return out


def strip_comments(txt):
    txt = re.sub(r'(?<!:)//[^\n]*', '', txt)          # 行注释（避开 http:// 的冒号情形）
    txt = re.sub(r'/\*.*?\*/', '', txt, flags=re.S)   # 块注释
    return txt


def norm_js(txt):
    txt = strip_comments(txt)
    txt = re.sub(r'\s+', ' ', txt).strip()
    txt = re.sub(r'\s*\.\s*', '.', txt)               # 链式换行与紧凑写等价
    for pat in (r'^\$\(function \(\) \{(.*)\}\);$',
                r'^\$\(document\)\.ready\(function \(\) \{(.*)\}\);$',
                r'^DOJO\.ready\(function \(\) \{(.*)\}\);$'):
        m = re.match(pat, txt)
        if m:
            txt = m.group(1).strip()
    return txt


def check_file(path):
    page = path.read_text(encoding='utf-8', errors='replace')
    problems = []
    count = 0
    for cap, prev, src in demos(page):
        count += 1
        html_src = ''.join(re.findall(
            r'<script type="text/plain" data-lang="html"[^>]*>(.*?)</script>', src, re.S))
        js_src = ''.join(re.findall(
            r'<script type="text/plain" data-lang="js"[^>]*>(.*?)</script>', src, re.S))
        if html_src:
            ca, cb = Counter(tags_of(prev)), Counter(tags_of(html_src))
            if ca != cb:
                problems.append('    [%s] HTML 不一致：预览多出 %s / 源码多出 %s'
                                % (cap, list((ca - cb).elements())[:6], list((cb - ca).elements())[:6]))
        scripts = re.findall(r'<script>(.*?)</script>', prev, re.S)
        if js_src and scripts:
            pj, sj = norm_js(' '.join(scripts)), norm_js(js_src)
            if pj != sj:
                i = 0
                while i < min(len(pj), len(sj)) and pj[i] == sj[i]:
                    i += 1
                problems.append('    [%s] JS 不一致 @%d：\n      预览…%s\n      源码…%s'
                                % (cap, i, pj[max(0, i - 60):i + 120], sj[max(0, i - 60):i + 120]))
    return count, problems


def default_targets():
    skip = ('archive/bootstrap-docs', 'archive/examples', 'archive/icons', 'demo/')
    files = []
    for p in sorted((ROOT / 'site').rglob('*.html')):
        rel = p.relative_to(ROOT).as_posix()
        if any(s in rel for s in skip):
            continue
        files.append(p)
    return files


def main(argv):
    targets = [Path(a) if Path(a).is_absolute() else ROOT / a for a in argv] or default_targets()
    total_pages = total_demos = failed = 0
    for path in targets:
        count, problems = check_file(path)
        total_pages += 1
        total_demos += count
        rel = path.relative_to(ROOT).as_posix() if path.is_absolute() and ROOT in path.parents else str(path)
        if problems:
            failed += 1
            print('✗ %s（%d 个演示）' % (rel, count))
            print('\n'.join(problems))
    if failed:
        print('\n检查完成：%d / %d 个页面存在源码块与预览不一致，请修正。' % (failed, total_pages))
        return 1
    print('✓ 演示一致性检查通过：%d 个页面、%d 个演示，全部与源码块一致。' % (total_pages, total_demos))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
