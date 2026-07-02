---
description: 从 theme.css 重新扫描区段，刷新 AGENTS.md 里的区段地图表格
---

下面是 `theme.css` 当前的真实大节结构（`════` banner + 行号）：

!`awk '/════════/{getline t; if(t !~ /════/) printf "%6d  %s\n", NR, t}' theme.css`

各大节内的子区段（`── 标题 ──` 注释 + 行号）：

!`grep -nE '/\* ── .+ ──' theme.css | sed -E 's/[─━]{2,}//g'`

任务：用上面的真实输出，更新 @AGENTS.md 中「## theme.css 区段地图」表格的行号与条目。

要求：
- 只改那张表格，不动 AGENTS.md 其余内容。
- 行号以扫描结果为准。
- 大节用 `════` 输出，子区段行号写进对应大节的描述里（沿用现有风格）。
- 改完简述哪些行号变了。
