#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check-demo-parity —— 校验 .demo 演示的“预览”与“源码块”是否一致。

本项目的硬性规范（见 .agents/notes/conventions.md）：
源码块必须能 100% 还原预览 —— 不允许“同理 / 结构相同 / 省略 / 复制即可”这类节选，
读者把源码块整段复制出去，应当 100% 还原预览。

检查内容（2026-09 升级，补上旧版的三处盲区）：
  1) HTML 源码块（data-lang="html"）与预览区逐节点比对：
     - 标签名 + 全部属性（class 忽略顺序、style 归一化空白）
     - 文本内容（空白归一化）
  2) CSS 源码块（data-lang="css"）与预览区 <style> 归一化比对；
  3) JS 源码块（data-lang="js"）与预览区 <script> 逐块归一化比对
     （去注释、压空白、紧凑链式写法等价；$(function(){…}) / DOJO.ready(…) 外壳两边都可省略，
      且**每个源码块各自剥外壳**后再拼接，兼容一个演示拆成多个 JS 块的情况）。

用法：
    python3 tools/check-demo-parity.py            # 扫描 site/ 下全部页面
    python3 tools/check-demo-parity.py site/jquery/10-todo.html [...]

退出码：0 全部一致；1 存在不一致。
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOID = {'img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'base',
        'col', 'embed', 'track', 'wbr'}


# ---------- HTML 解析（标签 + 全部属性 + 文本） ----------

class Node:
    __slots__ = ('tag', 'attrs', 'children')

    def __init__(self, tag, attrs):
        self.tag = tag
        self.attrs = attrs
        self.children = []


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('#root', {})
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, dict(attrs))
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, dict(attrs)))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def norm_attrs(attrs):
    out = {}
    for k, v in attrs.items():
        if v is None:
            out[k] = ''
            continue
        v = re.sub(r'\s+', ' ', v).strip()
        if k == 'class':
            v = ' '.join(sorted(v.split()))
        if k == 'style':
            v = v.replace('; ', ';').replace(': ', ':').replace(' ;', ';').rstrip(';')
        out[k] = v
    return out


def canon(fragment, drop_scripts=True):
    """解析成可比较的扁平序列：open(标签,属性) / text / close。"""
    parser = Builder()
    parser.feed(fragment)
    parser.close()
    out = []

    def walk(node, path):
        for child in node.children:
            if isinstance(child, str):
                text = re.sub(r'\s+', ' ', child)
                if text.strip():
                    out.append(('text', path, text.strip()))
                continue
            if drop_scripts and child.tag in ('script', 'style'):
                continue
            out.append(('open', path, (child.tag, tuple(sorted(norm_attrs(child.attrs).items())))))
            walk(child, path + '/' + child.tag)
            out.append(('close', path, child.tag))

    walk(parser.root, '')
    return out


# ---------- 演示区块提取 ----------

def extract_div(page, start_idx, cls):
    """返回从 start_idx 起第一个 class 含 cls 的 <div> 的**内部 HTML**。"""
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


# ---------- JS / CSS 归一化 ----------

def strip_comments(txt):
    txt = re.sub(r'(?<!:)//[^\n]*', '', txt)          # 行注释（避开 http:// 的冒号情形）
    txt = re.sub(r'/\*.*?\*/', '', txt, flags=re.S)   # 块注释
    return txt


def strip_ready_wrapper(txt):
    """剥掉整段外层包裹的 $(function(){…}) / $(document).ready(…) / DOJO.ready(…)；
    可重复剥（源码块可能被包了不止一层）。"""
    changed = True
    while changed:
        changed = False
        for pat in (r'^\$\(function \(\) \{(.*)\}\);$',
                    r'^\$\(document\)\.ready\(function \(\) \{(.*)\}\);$',
                    r'^DOJO\.ready\(function \(\) \{(.*)\}\);$'):
            m = re.match(pat, txt.strip())
            if m:
                txt = m.group(1).strip()
                changed = True
                break
    return txt


def norm_js(txt):
    txt = strip_comments(txt)
    txt = re.sub(r'\s+', ' ', txt).strip()
    txt = re.sub(r'\s*\.\s*', '.', txt)               # 链式换行与紧凑写等价
    return strip_ready_wrapper(txt)


def norm_css(txt):
    return re.sub(r'\s+', ' ', strip_comments(txt)).strip()


# ---------- 单页检查 ----------

def check_file(path):
    page = path.read_text(encoding='utf-8', errors='replace')
    problems = []
    count = 0
    for cap, prev, src in demos(page):
        count += 1
        html_src = ''.join(re.findall(
            r'<script type="text/plain" data-lang="html"[^>]*>(.*?)</script>', src, re.S))
        css_srcs = re.findall(
            r'<script type="text/plain" data-lang="css"[^>]*>(.*?)</script>', src, re.S)
        js_srcs = re.findall(
            r'<script type="text/plain" data-lang="js"[^>]*>(.*?)</script>', src, re.S)

        if html_src:
            a = canon(prev)
            b = canon(html_src, drop_scripts=False)
            if a != b:
                i = 0
                while i < min(len(a), len(b)) and a[i] == b[i]:
                    i += 1
                problems.append('    [%s] HTML 不一致（第 %d 个节点起）：\n      预览: %s\n      源码: %s'
                                % (cap, i, a[i:i + 4], b[i:i + 4]))
                if len(a) != len(b):
                    problems.append('    节点总数：预览 %d / 源码 %d' % (len(a), len(b)))

        if css_srcs:
            styles = re.findall(r'<style[^>]*>(.*?)</style>', prev, re.S)
            if not styles:
                problems.append('    [%s] 有 css 源码块，但预览里没有 <style>' % cap)
            else:
                pa = norm_css(' '.join(styles))
                pb = norm_css(' '.join(css_srcs))
                if pa != pb:
                    problems.append('    [%s] CSS 不一致：\n      预览: %s\n      源码: %s'
                                    % (cap, pa[:200], pb[:200]))

        scripts = re.findall(r'<script>(.*?)</script>', prev, re.S)
        if js_srcs and scripts:
            pj = norm_js(' '.join(scripts))
            # 每个源码块各自剥外壳后再拼，兼容“一个演示拆成多个 JS 块”
            sj = ' '.join(norm_js(block) for block in js_srcs).strip()
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
    print('✓ 演示一致性检查通过：%d 个页面、%d 个演示，预览与源码块逐字一致'
          '（标签 + 全部属性 + 文本 + CSS + JS）。' % (total_pages, total_demos))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
