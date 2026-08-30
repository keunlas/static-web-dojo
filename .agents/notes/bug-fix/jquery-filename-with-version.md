# 坑：jQuery 文件名带版本号，同步脚本写错过

> 状态：已修复 · 发现场景：首次运行 tools/sync-assets.sh · 相关版本：jQuery 4.0.0

## 现象

```text
cp: 对 '/home/keunlas/projects/static-web-dojo/reference/jquery/jquery.min.js'
调用 stat 失败: 没有那个文件或目录
```

## 根因

reference 里的 jQuery 文件名为**带版本号**的 `jquery-4.0.0.min.js`
（以及 `.js`、`.slim.js`、`.slim.min.js`），sync 脚本初版按惯例写成了
`jquery.min.js`，文件不存在。

## 影响范围

首次同步失败，vendor 目录不完整；若未及时发现，站点页面的 jQuery 会 404。

## 复现方法

```bash
bash tools/sync-assets.sh   # 修复前必然复现
ls reference/jquery/        # 查看真实文件名
```

## 修复方案

`tools/sync-assets.sh` 中改为复制 `jquery-4.0.0.min.js`；loader 链与教程示例文本
统一使用带版本号文件名（版本可追溯，这是有意保留的设计）。

## 预防措施

- 约定：**同步脚本里写死带版本号的文件名，换版本时三处同步**（sync 脚本、
  loader.js 链、教程内“引入方式”示例文本）；
- `../skills/sync-assets/SKILL.md` 记录了当前版本基线与“文件名带版本号”注意项；
- 同步后立即 `ls site/assets/vendor/*` 核对产物。

## 相关

- 文件：`tools/sync-assets.sh`、`site/assets/js/loader.js`
- 关联：`../skills/sync-assets/SKILL.md`
