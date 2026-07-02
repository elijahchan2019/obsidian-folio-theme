# AGENTS.md — Folio

Obsidian theme. Single-file CSS, no build step. Aesthetic: **Anthropic 社论衬线风**
— 衬线标题、典雅陶土/书卷色板（Clay `#D97757`、Ivory、Olive、Fig、Sky、Heather）、
克制的链接与交互、纸张微质感。基调是"安静、文气、可长时间阅读"，不是科技感。

## 纪律（必须遵守）

1. **只改 `theme.css`，且只在本目录（`Folio-dev`）。** 这是 `dev` 分支的工作区。
   - 旁边的 `../Folio` 是 **`main` 分支**（发布产物）。**禁止直接编辑**它。
   - 发布流程是 `dev` → `main` 的合并，不是手动拷贝文件。
   - 注意 `snippets/` 目录（如 `folio-h1-color`）也属于本主题配套。
2. **改前先读。** 2300+ 行单文件，先定位区段（见下表）再动手。
3. **最小改动。** 不重构、不加装饰注释、不"顺手优化"未要求的部分。
4. **改完即验**（见下）。纯 CSS 必须肉眼确认。
5. Obsidian 约定：**优先用官方变量**；自造变量已成体系（`--callout-color-*`、
   `--code-*`、`--radius-*`、`--anim-*`、`--font-*-theme`），改之前先看 token 区是否已有。
6. **light / dark 双覆盖**：亮色块（~88）+ 暗色块（~210）。颜色改动两套都要顾。
   本主题为避免运行时 `color-mix` 开销，**用预算好的实色 token**（如 `--code-*`、
   微染背景）——改色时改 token，别在组件里散写魔法色值。
7. 已有完整 **可访问性** 区（高对比、减少动画、键盘导航）——动交互/颜色时别破坏它。

## 可视化验证回路

DEV_VAULT 已 symlink 挂载到 `../DEV_VAULT/.obsidian/themes/Folio-dev`。改完后：

1. 在 `../DEV_VAULT` 的 `appearance.json` 把 `cssTheme` 切到 `Folio-dev`，
   Obsidian 里 reload（`Cmd+R`）或外观设置切换主题。
2. 用测试文档对照：`表格测试.md`、`按钮体系测试.md`、`可访问性测试.md`、
   `Anthropic Design Reference.md`（这份是本主题的设计基准）。
3. 桌面截图比对（Electron，用系统截图，不是浏览器 MCP）。
4. light + dark 都要看；如改了打印相关区段，顺手验证 PDF 导出。

## 调试方法论（改 CSS bug 前先读）

一次修 4 个 bug 的复盘：三个几步就好，一个（modal 输入框焦点环底部被削平）
反复撞墙好几轮。**不是问题难，是方法错。** 总结成规矩：

### 1. 先给 bug 分类，两类修法完全不同

- **确定性修复 —— 成因能从 CSS 直接看出来的**（如：列表圆点颜色不对、表格背景多余、
  字号/间距不合适）。判据：症状 = 某元素的某个属性值不对。
  → 选择器写对 + 特异性够就一次生效，可以直接改。

- **渲染态修复 —— 成因在 DOM 布局 / 层叠 / 裁剪，静态看 CSS 猜不出来的**
  （如：元素某条边被削平、焦点环缺一块、内容被别的元素盖住、莫名其妙的间距）。
  判据：症状是「被裁 / 被盖 / 位置错位」，而不是「某属性值错」。
  → **必须先用开发者工具量真实渲染，拿到数据再改。禁止无数据连改多版。**

### 2. 「症状在 X 元素上」≠「病根在 X 元素上」

被裁 / 被盖类的症状元素，病根**十有八九在祖先容器**，不在元素自己。

真实例子：某插件 modal 里输入框聚焦时，橙色焦点环底部被削平。头几轮都在输入框自己的
`border / outline / box-shadow` 上试 → 全无效。真凶是祖先容器
（一个 `overflow:hidden` 的 `.modal-content`）底边正好与输入框底边同一条 y 线，
在那条线上把输入框连边框带圆角带焦点环一起裁掉。**在元素本身上怎么改都没用，
因为裁剪发生在外层。**

### 3. 裁剪 / 遮挡类 bug 的标准第一步：devtools 量祖先链

`Cmd+Opt+I` → Console，从目标元素往上逐层打印每个祖先的
`getBoundingClientRect()`（`top/bottom/left/right`）+ `getComputedStyle().overflow`。

判据：**哪个祖先的某条边 ≈ 目标元素的同一条边，且该祖先 `overflow` 非 `visible`，
它就是真凶**——它在那条边上裁掉了目标的溢出部分（边框/圆角/`outline`/`box-shadow`）。
拿到坐标后修那一层（放开它的 `overflow`，或给它加内边距让目标别贴边），别再动目标本身。

这一步约 5 分钟，能省掉 5 次以上的瞎改。参考探针（在 Console 顶层跑）：

```js
copy((()=>{const el=document.querySelector('要查的选择器');let n=el,out=[];
while(n&&n!==document.body){const r=n.getBoundingClientRect(),s=getComputedStyle(n);
out.push(`${n.tagName.toLowerCase()}.${(''+n.className).trim().replace(/\s+/g,'.')} `+
`| top=${r.top.toFixed(1)} bottom=${r.bottom.toFixed(1)} overflow=${s.overflow}`);
n=n.parentElement;}return out.join('\n');})())
```

- 坑：`copy()` 只在 Console **顶层**可用；放进 `setTimeout` 回调里会
  `copy is not defined`。要延迟取焦点态就改用 `console.log` 让用户截图。
- 想看某元素完整聚焦态样式，直接打 `getComputedStyle(el)` 的
  `border / borderColor / outline / outlineOffset / boxShadow / overflow`——
  能立刻看清「橙环」「灰框」各是 outline 还是 box-shadow、是谁画的。

### 4. 一版一验，不累计未验证改动

纯 CSS 看不到渲染就是盲改。用户说「没生效」时**不要猜为什么**——
要么要截图 / computed style，要么直说需要更多信息。

### 5. 覆盖官方规则：特异性 + 顺序双保险

要压过官方或既有规则，先算特异性（例：官方 `input[type=text]:focus-visible` = 0,2,1，
Folio 的 `input:focus` = 0,1,1 压不过它，所以 `border-color` 改不动、灰色 focus
`box-shadow` 也去不掉）。压不过就上 `!important`（本主题在「覆盖官方长选择器」这类
场景本就用 !important），并把规则放在被覆盖规则**之后**。

## theme.css 区段地图

行号近似，大改后会漂移。重新生成 `════` 大节标题：
`awk '/════════/{getline t; if(t!~/════/) print NR": "t}' theme.css`

| 行号 | 区段 |
|------|------|
| 1    | **TOKENS**：字体族（开源平替 + CJK 回退）、圆角、核心组件覆写、过渡速率、共享 SVG、标题字号、Callout 色板、辅助文字层级、表格间距、Mermaid 字体 |
| 88   | — 亮色模式 token（Ivory 系背景、accent、表格、`--code-*` 语法色） |
| 210  | — 暗色模式 token |
| 323  | **TYPOGRAPHY**：标题（衬线社论）→ 正文（排除 code/heading）→ 链接（仅内容区）→ 引用块（阅读 494 / 实时预览 525）→ 代码（566）→ 语法高亮映射 CM6+Prism（624）→ 列表（689）→ 分隔线（702）→ 标签（713）→ 复选框 Circle Minimal（755）→ 完成任务褪色（807） |
| 831  | **UI CHROME**：顶部栏（834）→ 标签页（854）→ 侧边栏（889）→ GPU 合成/containment（896）→ 大纲 TOC（911）→ 纸张微质感（965）→ 状态栏（993）→ 滚动条（1006）→ 按钮 4 型（1015）→ 输入框（1078）→ 模态框（1112）→ 提示框（1126）→ 下拉/右键菜单（1137）→ 表格（1264）→ Frontmatter/属性（1444） |
| 1727 | **SETTINGS PAGE**（只改颜色，不碰布局） |
| 1804 | **FOCUS & INTERACTION** |
| 1832 | **ACCESSIBILITY**：高对比（1835）、减少动画（1875）、键盘导航（1906）、链接 a11y（1929）、模态 a11y（1964） |
| 1978 | **SIDEBAR NOTION OVERHAUL**：隐藏帮助图标（2135）、设置齿轮换 Obsidian logo（2155）、搜索面板齿轮（2204）、库切换器极简（2226） |
| 2271 | **PRINT / PDF 导出** |

## 视觉品味（CSS 通用，迁移自 taste-skill）

写/审样式时主动规避 AI 设计 tells——本主题已大体遵守，改动别破坏它：

- **不用纯黑/纯白。** 用 off-black、charcoal、ivory 这类带微色温的中性色（本主题 Ivory/Slate 体系已如此）。
- **强调色克制：最多一个，饱和度压住。** 禁 "AI 紫/霓虹蓝" 那套发光渐变。本主题的 accent 是 Clay 陶土色，别引入抢戏的第二强调色。
- **层级靠字重+颜色，不靠一味放大字号。** H1 不该"嘶吼"。
- **阴影要么不用，要么染成背景色调**，不要默认黑色外发光。
- **动画只动 `transform` 和 `opacity`**，绝不动 `top/left/width/height`——避免重排掉帧（本主题已有 GPU 合成区）。
- **色板全局统一**，不在暖灰冷灰之间漂移；颜色走 token，别在组件里散写魔法色值。
- 衬线用在编辑/社论排版是本主题的特色——但 UI chrome（按钮、菜单、状态栏）仍应克制，不要到处上衬线。

## 提交前

- `manifest.json` 的 `version` 是否需要 bump。
- `versions.json` 是否需要同步加新版本（**首次发版前要确认这文件存在**——v1.2.1 hotfix 就是因为仓库从来没有这文件导致主题市场搜不到，补上的）。
- light + dark 都验过；改了打印区就验 PDF。
- `snippets/` 是否需要同步。
- 没有改到无关区段。

## 发布前（dev → main 合并时）

**这个清单是"上次发布踩坑"沉淀出来的，**严格按顺序执行**。**

1. **dev 上完成所有 dev commit + 版本 bump**（如 `v1.2.0: ...`）。**不要**在 main 上手动改 `theme.css`。
2. **push dev 到 remote**：`git push origin dev`。
3. **切到 Folio 目录（main）**，`git fetch origin`。
4. **检查能否 fast-forward**：
   ```bash
   git merge-base --is-ancestor origin/main origin/dev && echo "ff" || echo "diverged"
   ```
   - **`ff` 输出** → 走第 5a 步（fast-forward + amend）
   - **`diverged` 输出**（上次 v1.1.13 在 main 用 --amend 改 name 就会触发）→ 走第 5b 步（--no-ff + 解决 manifest 冲突）

   **为什么会有 diverged**：上版本（v1.1.13）发版时 fast-forward 后用 `--amend` 改了 `ff05fcb` 的 manifest name（"Folio-dev" → "Folio"），这把 main 的 commit hash 改了，但 dev 上还有原版（"Folio-dev"），从此两边 manifest 路径分叉。如果以后发布前都先检查这一步，可以避免。

5a. **fast-forward 路径**：
   ```bash
   git merge --ff-only origin/dev
   ```
   merge 会把 dev 的 manifest 带过来——`name: "Folio-dev"`，要改回：
   ```bash
   sed -i '' 's/"name": "Folio-dev"/"name": "Folio"/' manifest.json
   git add manifest.json
   git commit --amend --no-edit   # 把 name 改动 amend 进版本 commit，保持 main 上版本 commit 干净
   ```

5b. **--no-ff 路径**（diverged 时用）：merge 会报 manifest.json 冲突（main 想留 `name="Folio"`，dev 带来 `version="X.Y.Z"`）：
   ```bash
   git merge --no-ff origin/dev -m "Merge dev for vX.Y.Z release"
   ```
   冲突里取**name="Folio" + dev 的 version**（其他字段留 dev 的），整个文件重写：
   ```json
   {
     "name": "Folio",
     "version": "X.Y.Z",
     "minAppVersion": "1.5.0",
     "author": "elijahchan2019",
     "authorUrl": "https://github.com/elijahchan2019"
   }
   ```
   ```bash
   git add manifest.json
   git commit --no-edit
   ```
   **不要 amend merge commit**——amend 会丢掉 dev 的 fix commit 和版本 bump commit（merge commit 的 parent 链路），整个发布会回退。

6. **确认 manifest 内容**（两个路径都跑一次）：
   ```bash
   cat manifest.json   # name: "Folio", version: 新版号
   ```

7. **打 tag + push**：

   ⚠️ **tag 名必须与 manifest 的 `version` 精确一致，绝不能带 `v` 前缀。**
   Obsidian 的检测/更新按 manifest `version` 字符串去找同名 release：manifest 是
   `1.2.1` 就必须有 tag `1.2.1`。带了 `v`（`v1.2.1`）会导致 Obsidian 手动检测报
   「no GitHub release with that version has been published yet」。
   历史坑：老版本本来是无前缀的（`1.0.2`…`1.1.12`，正确），后来有人改成 `v` 前缀
   （`v1.1.13`/`v1.2.0`/`v1.2.1`）把匹配全破坏了。**别再加 v。**

   ```bash
   git tag -a X.Y.Z -m "X.Y.Z: <一句话 summary>"   # 无 v 前缀！
   git push origin main
   git push origin X.Y.Z
   ```

8. **写 GitHub Release note**：进 https://github.com/elijahchan2019/obsidian-folio-theme/releases/new → 选刚推的 tag（`X.Y.Z`，无 v）→ 标题 `X.Y.Z`，正文按"累积改动"列（参考上次 release note 风格，把上个版本之后未发版的所有 dev commit 都包进来——这是 minor bump 的标准做法）。**发布时确认这个 release 被标为 Latest**（GitHub 按发布时间判定，乱序补发会标错，必要时 `gh release edit X.Y.Z --latest` 手动纠正）。

**为什么 dev 的 name 是 "Folio-dev"**：两个主题同名会在 Obsidian 里冲突。Folio-dev 加载时会盖掉 Folio。保持 dev 叫 "Folio-dev"、main 叫 "Folio" 才能在同一 vault 同时存在并对照调试。

**反向同步（main → dev）时也要查 name**：如果从 main cherry-pick hotfix 回 dev，dev 的 manifest 可能被改成 "Folio"，要再改回 "Folio-dev"。
