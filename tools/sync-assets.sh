#!/usr/bin/env bash
# 从 reference/ 原料库同步网站所需的资源到 site/。
# 用法：bash tools/sync-assets.sh [vendor|archive|all]（默认 all）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REF="$ROOT/reference"
SITE="$ROOT/site"

BS_DIST="$REF/bootstrap/bootstrap-5.3.8-dist"
BS_ICONS="$REF/bootstrap/bootstrap-icons-1.13.1"
BS_EXAMPLES="$REF/bootstrap/bootstrap-5.3.8-examples"
BS_DOCS="$REF/bootstrap/bootstrap-offline-docs-5.3"
JQ="$REF/jquery"

TARGET="${1:-all}"

sync_vendor() {
  echo "==> 同步 vendor 资源（Bootstrap / Icons / jQuery）"
  mkdir -p "$SITE/assets/vendor/bootstrap" \
           "$SITE/assets/vendor/bootstrap-icons/fonts" \
           "$SITE/assets/vendor/jquery"
  cp "$BS_DIST/css/bootstrap.min.css"      "$SITE/assets/vendor/bootstrap/"
  cp "$BS_DIST/js/bootstrap.bundle.min.js" "$SITE/assets/vendor/bootstrap/"
  cp "$BS_ICONS/bootstrap-icons.min.css"   "$SITE/assets/vendor/bootstrap-icons/"
  cp "$BS_ICONS/fonts/"*.woff "$BS_ICONS/fonts/"*.woff2 "$SITE/assets/vendor/bootstrap-icons/fonts/"
  cp "$JQ/jquery-4.0.0.min.js"           "$SITE/assets/vendor/jquery/"
  echo "==> vendor 同步完成"
}

sync_archive() {
  echo "==> 同步藏经阁（Bootstrap 离线文档 + 官方示例集）"
  rm -rf "$SITE/archive/bootstrap-docs" "$SITE/archive/examples"
  cp -r "$BS_DOCS"    "$SITE/archive/bootstrap-docs"
  cp -r "$BS_EXAMPLES" "$SITE/archive/examples"
  generate_examples_index
  echo "==> 藏经阁同步完成"
}

generate_examples_index() {
  local idx="$SITE/archive/examples/index.html"
  {
    cat <<'EOF'
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>官方示例集 | 藏经阁 · 纯静态网页的修行</title>
<meta name="robots" content="noindex">
<style>
  body { margin:0; font-family:-apple-system,"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif;
         background:#faf6ec; color:#2b2a26; }
  main { max-width:60rem; margin:0 auto; padding:2.5rem 1.25rem 4rem; }
  .muted { color:#6b675c; }
  h1 { font-family:"Songti SC","Noto Serif CJK SC","STSong","SimSun",serif; margin:.25rem 0 1rem; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(13rem,1fr)); gap:1rem; margin-top:1.5rem; }
  a { display:block; background:#fffdf7; border:1px solid #e3dcc8; border-radius:.6rem;
      padding:.9rem 1rem; color:#2b2a26; text-decoration:none; }
  a:hover { border-color:#b03a2e; color:#b03a2e; }
</style>
</head>
<body>
<main>
  <p class="muted">藏经阁 · Bootstrap 5.3.8 官方示例</p>
  <h1>官方示例集</h1>
  <p class="muted">以下示例拷贝自 Bootstrap 官方仓库，仅供学习结构时对照参考。点击即可在浏览器中打开。</p>
  <div class="grid">
EOF
    for dir in "$SITE/archive/examples"/*/; do
      [ -e "$dir/index.html" ] || continue
      name="$(basename "$dir")"
      printf '    <a href="%s/index.html">%s</a>\n' "$name" "$name"
    done
    cat <<'EOF'
  </div>
</main>
</body>
</html>
EOF
  } > "$idx"
  echo "==> 已生成示例集索引 $idx"
}

case "$TARGET" in
  vendor)  sync_vendor ;;
  archive) sync_archive ;;
  all)     sync_vendor; sync_archive ;;
  *) echo "未知目标：$TARGET（可选 vendor|archive|all）" >&2; exit 1 ;;
esac
