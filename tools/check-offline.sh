#!/usr/bin/env bash
# 离线纯净性检查：扫描 site/ 下本站手写页面，
# 确认没有任何外网资源依赖（link/script/img/iframe 等的 http(s):// 引用）。
# 排除第三方镜像（archive/bootstrap-docs、archive/examples）与生成索引。
#
# 用法：bash tools/check-offline.sh
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="$ROOT/site"
FAIL=0

echo "==> 扫描站内页面（排除第三方镜像）"
files=$(find "$SITE" -name '*.html' -not -path '*/archive/bootstrap-docs/*' -not -path '*/archive/examples/*' | sort)

echo "==> 1) 外网资源依赖检查（应为空）"
while IFS= read -r f; do
  hits=$(grep -nE '<(link|script|img|iframe|source|video|audio)[^>]+(src|href)="https?://' "$f" || true)
  if [ -n "$hits" ]; then
    FAIL=1
    echo "✘ $f"
    echo "$hits" | sed 's/^/    /'
  fi
done <<< "$files"

echo "==> 2) 禁用技术扫描（只看真实脚本：type=module / fetch / XMLHttpRequest）"
# 说明：正文与 text/plain 教学源码块里出现这些字眼是应该的（JS 篇要讲它们），
# 因此本项交给 tools/check-offline-tech.py 做“脚本感知”的扫描：只拦会真正执行的代码。
while IFS= read -r f; do
  if ! out=$(python3 "$ROOT/tools/check-offline-tech.py" "$f"); then
    FAIL=1
    echo "$out"
  fi
done <<< "$files"

# 说明（jQuery 4.0.0 事实，经仓库内 reference/jquery 源码与浏览器实测核对）：
#   已移除：$.trim / $.type / $.isArray / $.isFunction / $.isNumeric / $.isWindow /
#           $.parseJSON / $.now / $.nodeName / $.camelCase / .live() / .die()
#   仍在运行但不推荐：.bind/.unbind/.delegate/.undelegate/.hover、$.proxy
# 本项只拦“已移除、调用即报错”的写法；弃用写法另行人工审阅（教程与站点统一用 on/off 等新写法）。
echo "==> 2b) 公共 JS 禁用 API 扫描（jQuery 4 已移除的 API，应为空）"
for f in "$SITE/assets/js/loader.js" "$SITE/assets/js/site.js" "$SITE/assets/js/highlight.js"; do
  hits=$(grep -nE '\\\$\.(trim|type|isArray|isFunction|isNumeric|isWindow|parseJSON|now|nodeName|camelCase)\b|\.(live|die)\(' "$f" || true)
  if [ -n "$hits" ]; then
    FAIL=1
    echo "✘ $f"
    echo "$hits" | sed 's/^/    /'
  fi
done

echo "==> 3) 允许的站外文字链接（仅 <a>，供人工核对）"
grep -rhoE '<a [^>]*href="https?://[^"]*"[^>]*>[^<]*</a>' $files 2>/dev/null | sort -u || true

if [ "$FAIL" -eq 0 ]; then
  echo ""
  echo "✔ 离线纯净性检查通过：无外网资源依赖。"
else
  echo ""
  echo "✘ 发现违规引用，请修复后重跑。"
fi
exit $FAIL
