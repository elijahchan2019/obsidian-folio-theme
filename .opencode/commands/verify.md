---
description: Folio 改动的可视化验证清单（DEV_VAULT reload + 截图 + light/dark + 打印）
---

刚改完 `theme.css`。带我走完整可视化验证，别跳步。

未提交改动概览：

!`git diff --stat`

改动命中的位置（确认没误伤无关区段、没破坏可访问性区）：

!`git diff -U0 theme.css | grep -E '^@@' | head -40`

请按顺序执行并逐项汇报：

1. 在 `../DEV_VAULT/.obsidian/appearance.json` 把 `cssTheme` 切到 `Folio`
   （当前可能是别的主题），然后在 Obsidian 里 `Cmd+R` reload。symlink 已挂载
   （单分支迁移后 name 为 `Folio`，symlink 目录需对应改名为 `Folio`）。
2. 列出本次改动**应该肉眼检查**的 DEV_VAULT 测试文档（依据改动区段，从
   `表格测试.md / 按钮体系测试.md / 可访问性测试.md / Anthropic Design Reference.md`
   中挑相关的）。`Anthropic Design Reference.md` 是本主题设计基准，颜色/排版改动必看。
3. 提醒分别在 **light** 和 **dark** 下各看一遍——重点是改了颜色/`--code-*`/token 的地方，
   确认没有散落的魔法色值绕过 token。
4. 若改动涉及 ACCESSIBILITY 区（高对比/减少动画/键盘导航），提醒在对应系统设置下验证。
5. 若改动涉及 PRINT / PDF 区或正文排版，提醒导出一次 PDF 检查。
6. 给一句总结：这次改动需要重点盯的视觉风险点是什么。

$ARGUMENTS
