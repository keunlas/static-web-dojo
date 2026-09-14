# 坑：用 `pkill -f "工具名"` 清理进程，把正在执行这条命令的 shell 自己也杀了

> 状态：已知坑（无需改站点，已写进技能与坑档案） · 发现场景：2026-09-14 基础篇终验，
> CDP 验证工具卡住时清理进程 · 相关工具：`tools/verify-cdp.js`、`tools/verify/cdp-eval.js`

## 现象

在代理的 shell 里执行“清理卡住的 CDP 验证进程”这类命令时，命令**自己被杀掉**：

```bash
pkill -f 'cdp-eval.js' ; sleep 1 ; pgrep -fa 'chromium.*9334' | head -3 ; echo done
# → 进程退出码 143（SIGTERM），后续的 pgrep 与 echo 都没输出
```

看起来像“命令跑到一半神秘消失”，容易被误判成“工具坏了”或者“环境不稳定”。

## 根因

`pkill -f` 匹配的是**整个命令行**，而不是只有目标程序的名字。
代理执行 shell 命令时，实际命令行大致是：

```bash
/bin/bash -c "pkill -f 'cdp-eval.js' ; sleep 1 ; ..."
```

这条 bash 自己的命令行里**就包含字符串 `cdp-eval.js`**，于是它同时匹配上了规则，
SIGTERM 先送到自己手上——命令在第一步就退出了。
（真实需求：杀掉的是 `node tools/verify/cdp-eval.js …` 与它拉起的 Chromium，
与执行清理动作的 shell 无关。）

## 影响范围

- 只影响“用 `pkill -f` 做粗放清理”的操作本身，**不影响 `site/` 产物与页面**；
- 但危害不小：清理没做成、命令静默中断，后续步骤全部没跑，
  而且退出码 143 很容易被当成“验证工具失败”，把排查引向错误方向。

## 复现方法

```bash
# 在代理 shell 里（或任何命令行里包含该字符串的场景）
pkill -f 'cdp-eval.js' ; echo "这行不会被执行"
echo $?        # 见 143（被 SIGTERM 终止）
```

## 修复方案

改用“先找、再核对、后杀”的三步法，**只对具体 PID 下手**：

```bash
pgrep -fa 'node tools/verify/cdp-eval.js'      # 1) 只看：列出候选与它们的完整命令行
ps -o pid=,etime=,cmd= -p <上面列出的 PID>      # 2) 核对：确认是目标（看启动时间与路径）
kill <PID>                                      # 3) 动手：杀具体 PID，而不是按名字匹配
```

经验证可行的写法（本仓库实际用过）：先 `pgrep` 拿到 PID，再逐个 `kill`；
Chromium 实例按 `--user-data-dir=/tmp/cdp-eval-*` 精确匹配进程后再处理。

## 预防措施

1. **别用 `pkill -f`**：它的自匹配问题无解，除非模式绝对不会出现在自己的命令行里；
2. 用 `pgrep`（只列不杀）+ `ps` 核对 PID + `kill <PID>`；
3. 若确实要按“进程名”批量结束，用 `pkill -x <精确进程名>` 或按
   `/proc/<pid>/cmdline` 内容筛选，别用会命中当前 shell 的子串；
4. 在技能文档里写清“如何安全地收尾一个卡住的验证进程”，避免下一个代理重踩
   （见 `skills/verify-offline/SKILL.md` 的 CDP 串行说明）。

## 相关

- 文件：`tools/verify-cdp.js`、`tools/verify/cdp-eval.js`（被清理的对象）
- 关联：`skills/verify-offline/SKILL.md`（CDP 工具串行纪律与清理办法）、
  `notes/progress/46.basics-js-37-dom.md`、`notes/progress/47.basics-js-38-events.md`（本轮卡住的现场）
