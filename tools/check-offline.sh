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

echo "==> 2) 禁用技术扫描（应为空：type=module / fetch / XMLHttpRequest）"
while IFS= read -r f; do
  hits=$(grep -nE 'type="module"|fetch\(|XMLHttpRequest' "$f" || true)
  if [ -n "$hits" ]; then
    FAIL=1
    echo "✘ $f"
    echo "$hits" | sed 's/^/    /'
  fi
done <<< "$files"

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
