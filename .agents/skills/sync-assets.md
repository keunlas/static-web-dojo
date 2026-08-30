# 技能：sync-assets（同步与再生成本地资源）

> 用途：从 `reference/` 原料库复制 vendor 库文件与藏经阁到 `site/`，
> 并再生成本站生成物（示例集索引等）。修改参考资源或更换版本后使用。

## 命令

```bash
bash tools/sync-assets.sh            # 同步全部（vendor + 藏经阁）
bash tools/sync-assets.sh vendor     # 只同步 vendor 库文件
bash tools/sync-assets.sh archive    # 只同步藏经阁（离线文档 + 示例集 + 索引）
python3 tools/gen-icons-page.py      # 再生成藏经阁图标大全页（2078 个图标）
python3 tools/gen-search-index.py    # 再生成全站搜索索引（新增页面后必跑）
```

## 脚本行为（tools/sync-assets.sh）

- `vendor`：把 reference 里的 `bootstrap.min.css`、`bootstrap.bundle.min.js`、
  `bootstrap-icons.min.css` + `fonts/*.woff(2)`、`jquery-4.0.0.min.js`
  复制到 `site/assets/vendor/`（幂等，可重复执行）。
- `archive`：整体重建 `site/archive/bootstrap-docs/` 与 `site/archive/examples/`
  （**先删后复制**），用目录循环重新生成 `examples/index.html` 索引页
  （该索引页为本站手写的离线极简样式，不含任何 CDN），并调用
  `gen-icons-page.py` 再生成图标大全页。

## 注意事项

1. **文件名带版本号**：jQuery 文件是 `jquery-4.0.0.min.js`（不是 `jquery.min.js`），
   换版本时同步改 loader.js 与教程内示例文本。
2. **icons 字体必须一起复制**：只复制 css 不复制 `fonts/` 会导致图标全部空白。
3. **不要**把 `reference/` 直接引用进 `site/`，任何文件都必须经过本脚本（或手动复制）落到
   `site/assets/vendor/` 或 `site/archive/` 后再引用。
4. `site/archive/bootstrap-docs/`、`site/archive/examples/` 已 gitignore，属生成物，
   不要手改其中内容（第三方镜像）。
5. 同步后建议跑 `skills/verify-offline.md` 的静态检查确认资源齐全。

## 版本基线（当前）

| 资源 | 版本 | reference 路径 |
| --- | --- | --- |
| Bootstrap | 5.3.8 | reference/bootstrap/bootstrap-5.3.8-dist |
| Bootstrap Icons | 1.13.1 | reference/bootstrap/bootstrap-icons-1.13.1 |
| 官方示例 | 5.3.8 | reference/bootstrap/bootstrap-5.3.8-examples |
| 离线文档 | 5.3 | reference/bootstrap/bootstrap-offline-docs-5.3 |
| jQuery | 4.0.0 | reference/jquery |
