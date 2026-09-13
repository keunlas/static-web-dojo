#!/usr/bin/env bash
# 一键部署准备：重新生成站点全部产物，并跑质量自检。
#
# 依次执行：
#   1. tools/sync-assets.sh          同步 vendor 库文件 + 藏经阁（离线文档/示例集）
#   2. tools/gen-icons-page.py       生成藏经阁图标大全页
#   3. tools/gen-search-index.py     生成全站搜索索引
#   4. tools/gen-sitemap.py          生成站点地图（参数原样透传，如 --base https://你的域名/）
#   5. tools/check-offline.sh        离线纯净性自检（无外网资源依赖）
#   6. tools/check-links.py          内部链接有效性自检
#   7. tools/check-demo-parity.py    演示源码块一致性自检（源码必须能还原预览）
#
# 用法：
#   bash deploy.sh                                   # sitemap 使用占位域名（部署前必须换成真实域名）
#   bash deploy.sh --base https://example.com/       # 指定站点基址
#
# 说明：本脚本只是把仓库里现有的各工具按部署顺序串起来，不是构建系统——
# site/ 本身仍然零构建、纯静态，任何一步失败都会立即停止并给出该工具自己的报错。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "════════ 纯静态网页的修行 · 部署准备 ════════"

echo ""
echo "==> [1/7] 同步本地资源（vendor + 藏经阁）"
bash tools/sync-assets.sh

echo ""
echo "==> [2/7] 生成图标大全页"
python3 tools/gen-icons-page.py

echo ""
echo "==> [3/7] 生成全站搜索索引"
python3 tools/gen-search-index.py

echo ""
echo "==> [4/7] 生成站点地图"
python3 tools/gen-sitemap.py "$@"

echo ""
echo "==> [5/7] 离线纯净性自检"
bash tools/check-offline.sh

echo ""
echo "==> [6/7] 内部链接自检"
python3 tools/check-links.py

echo ""
echo "==> [7/7] 演示源码块一致性自检"
python3 tools/check-demo-parity.py

echo ""
echo "════════ 部署准备完成：site/ 已是最新产物，可直接上传部署 ════════"
