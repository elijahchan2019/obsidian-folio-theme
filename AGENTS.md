# AGENTS.md — Folio

Obsidian theme. Single-file CSS, no build step. Aesthetic: **Anthropic 社论风（无衬线标题）**
— 标题自 v1.1.9 起默认与正文同为无衬线（中英混排下衬线视觉跳动，刻意取舍；
原衬线社论标题保留为 opt-in snippet `folio-heading-font-serif`，衬线栈 token
`--font-heading-theme` 仅由该 snippet 消费）、典雅陶土/书卷色板（Clay `#D97757`、
Ivory、Olive、Fig、Sky、Heather）、克制的链接与交互、纸张微质感。
基调是"安静、文气、可长时间阅读"，不是科技感。

## 纪律（必须遵守）

1. **只改 `theme.css`，且只在本目录（`Folio`）。** 这是唯一的 `main` 分支工作区。
   - **单分支架构（自 v1.4.0 起）**：不再有 dev 分支，所有开发都在 main 上。
   - 发布流程是 `bump version + commit + tag + push`，由 GitHub Action 自动发 release。
   - 注意 `snippets/` 目录（如 `folio-h2-color`）也属于本主题配套。
2. **改前先读。** 2300+ 行单文件，先定位区段（见下表）再动手。
3. **最小改动。** 不重构、不加装饰注释、不"顺手优化"未要求的部分。
4. **改完即验**（见下）。纯 CSS 必须肉眼确认。
5. Obsidian 约定：**优先用官方变量**；自造变量已成体系（`--callout-color-*`、
   `--code-*`、`--radius-*`、`--anim-*`、`--font-*-theme`），改之前先看 token 区是否已有。
6. **light / dark 双覆盖**：亮色块（~88）+ 暗色块（~210）。颜色改动两套都要顾。
   本主题为避免运行时 `color-mix` 开销，**用预算好的实色 token**（如 `--code-*`、
   微染背景）——改色时改 token，别在组件里散写魔法色值。
7. 已有完整 **可访问性** 区（高对比、减少动画、键盘导航）——动交互/颜色时别破坏它。
8. **manifest name 永远是 `Folio`**（不是 `Folio-dev`）。Obsidian 审核会读 tag 指向的 commit 的 manifest，name 不符会被拒。

## 可视化验证回路

DEV_VAULT 通过 symlink 把本主题挂进 `../DEV_VAULT/.obsidian/themes/Folio`。改完
`theme.css` 后：

> ⚠️ **单分支迁移后 name 从 `Folio-dev` 改为 `Folio`**：DEV_VAULT 里原先的 symlink
> 目录可能还叫 `Folio-dev`。需把 symlink 目录改名为 `Folio`（指向本工作区），否则
> Obsidian 按 manifest name `Folio` 找不到主题目录。

1. 在 `../DEV_VAULT/.obsidian/appearance.json` 把 `cssTheme` 切到 `Folio`
   （当前可能是别的主题），然后在 Obsidian 里 reload（`Cmd+R`）或外观设置切换主题。
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

### 2.5 「症状在 X 元素上」的姊妹篇：病根可能来自**共享底层语法的兄弟规则**

第 2 节讲的是「查祖先容器」（溢出 / 裁剪漏过来）。这是它的另一个维度：
**A 元素表现异常，先查是不是 B 元素的规则通过共享语法 / 共享 class 漏过来的。**

Obsidian 里这三对「共享底层语法」是这类误伤的高发区，改其中之一时务必想另一只会不会被波及：

| 共享语法 | 外观层 | 编辑态底层 | 误伤场景 |
|----------|--------|-----------|---------|
| **callout ↔ blockquote** | callout 是独立块 | callout 底层就是 `>`（`HyperMD-quote`） | 给 blockquote 写的引号伪装（`::before` SVG + 隐藏 `>`）会命中 callout 展开后的源码行 |
| **embed ↔ image** | `![[x]]` 嵌入 | 同图片语法 | 图片相关规则可能波及嵌入 |
| **tag ↔ link** | `#tag` 胶囊 | 同链接底层 | 链接规则可能波及 tag |

真实例子（v1.4.4 callout 编辑态空白，五轮误诊）：callout 在 Live Preview 下点击进入编辑态后，引号标题下方冒出大空白 + 引号图标。五轮全在 callout 自己的 CSS（flex / 宽度 / 间距 / widget 映射）里找 → 全无效。真凶是 **blockquote 的引号伪装规则**：callout 展开成源码时，每个 `>` 行带 `HyperMD-quote`，被 blockquote 的 `cm-formatting-quote::before`（伪装引号图标）+ `color: transparent`（隐藏 `>` 占位块）误伤——引号图标冒出来、`>` 被透明化但仍占宽、隐藏的 `[!note]` 标记堆出空白。**callout 的 CSS 一行都没错，是引用块规则越界了。**

破局点：callout 的源码行有独有 class `HyperMD-callout`，用它做**反向豁免**（`:not` 思路），把引号图标去掉、`>` 恢复可见，编辑态一目了然。相关豁免见 theme.css 中 `HyperMD-callout .cm-formatting-quote` 规则。

**判据**：当 A 的症状无法用 A 自己的任何 CSS 解释、且 A 在底层和 B 共享语法时——先怀疑 B 的规则漏过来了，别在 A 上反复试。

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
- light + dark 都验过；改了打印区就验 PDF。
- `snippets/` 是否需要同步。
- 没有改到无关区段。
- **如果要发版**：bump version 后打 tag（无 v 前缀，== version）并 `git push origin main --tags`，workflow 自动接管（见下「发版流程」）。

> ⚠️ **别被 `versions.json` 误导。** 仓库里有个 `versions.json`，但**那是插件（plugin）概念，主题（theme）根本不读它**。它既不影响安装，也不影响市场可见性——留着无害，但**不要**把「同步 versions.json」当成发版必做项，更不要以为补它能修市场搜不到（这是上个 agent 的错误判断，已澄清见下）。

> ⚠️ **市场可见性 = 在官方索引里 + release 合规，缺一不可（且会被踢出）。**
> 能否在 app 内市场搜到，取决于主题在不在官方 `obsidianmd/obsidian-releases` 的
> `community-css-themes.json`（那份清单就是"索引"）。**但索引不是一劳永逸的**——
> 推了不合规的 release 会被官方**踢出索引**。Folio 就是这么掉的：一次 gh 版本推送后
> 被 de-index，清单里现在查无此项（姊妹项目 Opendian 目前仍在，别把它也搞掉）。所以
> release 合规不是"跟市场无关"，恰恰是**保住索引的必要条件**。
>
> **恢复 / 重新上架流程**：
> ① 先把仓库 + release 弄合规（tag == manifest `version` 且**无 v**、挂全资产、Latest 正确、
>   manifest 必填字段齐、theme.css 不引外部网络资源/远程字体）→
> ② 走 Obsidian 官方主题审核流程（在主题管理页拉取 gh 的**最新版本**提审）→
> ③ 通过后，官方索引机器人**每 1–2 小时**扫一遍，自动重新索引 → app 内又能搜到。
>
> **诊断顺序**：先 `grep -i folio` 那份清单看在不在索引里；再查 latest release 的 tag
> 是否 == manifest version（无 v）+ 资产是否齐。两头都要看，别只盯自己仓库改而不看索引状态。

## 🚨 红线：发版必须合规，否则会被踢出主题市场索引

> **这些红线现在由 `release.yml` workflow 作为校验步骤强制执行**（见下「发版流程」）。
> 但红线本身不会过时——它是 workflow 的设计依据，也是 workflow 故障时手动应急的核对清单。
> 理解红线，才能理解 workflow 在防什么。

**这是运营铁律，比任何代码改动都重要，牢记：**

- 主题**已在**官方索引里（`community-css-themes.json`）。只要每次发版都合规，
  发布后主题市场的版本号会**近乎实时**跟进更新——非常快。
- **一旦发出一个不合规的 release，主题会被官方直接剔除出索引**，app 内立刻搜不到。
  之后只能干等官方索引机器人**周期性扫描**（慢时要好几个小时）才重新收录。
- 所以：**宁可慢，不可错。** 发版前后必须逐条核对合规，绝不为图快跳过自检。

**"合规"= 每次发版都满足：**
1. release 的 tag **精确等于** manifest 的 `version`，**绝不带 `v` 前缀**。
2. release 挂全资产（至少 `theme.css` + `manifest.json`）。
3. release 被标为 **Latest**（`--latest`；乱序/超时可能标错，必须核）。
4. **tag 指向的 commit 的 manifest `name` 必须是 `"Folio"`**、必填字段齐。
   > ⚠️ Obsidian 审核读的是 **tag 关联 commit** 的 manifest，不是 release 资产。单分支架构下
   > tag 永远打在 main，manifest name 永远是 `Folio`，所以这条天然满足——但**绝不能**在仓库里
   > 出现第二个带 `Folio-dev` 的分支（这正是旧双分支时代埋的雷）。
5. `theme.css` 不引用外部网络资源 / 远程字体（审核硬性要求）。

**发完 30 秒强制自检（缺一不可）：**
```bash
gh api repos/elijahchan2019/obsidian-folio-theme/releases/latest --jq '.tag_name'  # == manifest version，无 v
gh release view <版本> --json assets --jq '.assets[].name'                          # theme.css / manifest.json 在
gh api repos/elijahchan2019/obsidian-folio-theme/releases --jq '.[]|select(.tag_name=="<版本>")|.draft'  # 必须 false
```
> ⚠️ 坑：`gh release create` 传大图（如 feature-artboard.png）可能**客户端超时**，
> 把 release 卡在 **draft** 态——draft 不建 tag、不算 Latest、市场也看不到。
> 若自检发现 `draft=true`，用 `gh release edit <版本> --draft=false --latest` 转正。

## 发版流程（tag 触发，单分支，GitHub Action 自动发 release）

> 自 v1.4.0 起采用**单分支架构**：所有开发在 main 上，不再有 dev 分支。
> 发版由 `.github/workflows/release.yml` 自动化——校验合规、打包白名单资产、发 release、自检。
> 红线（无 v、tag==version、name==Folio、资产齐、`--latest`、非 draft、无外部资源）
> 全部作为显式校验步骤硬编码——任一不符直接 fail，发不出不合规的 release。

### 日常发版（你的全部操作）

```bash
# 在 main 上：
# 0. 先同步远端 + 读 manifest 确认当前版本号（多会话/多机器下本地常落后；
#    ⚠️ push 里 main 被拒时 tag 仍会推成功 → 悬空 tag 触发错误 release，1.4.6 踩过）：
git pull --rebase origin main && jq -r .version manifest.json
# 1. 改 theme.css（或其他发布产物）
# 2. bump manifest.json 的 version，例如 1.4.1
# 3. commit + 打 tag（tag 必须无 v 前缀，必须 == version）+ 一条命令推送：
git add -A
git commit -m "v1.4.1: <改动摘要>"
git tag 1.4.1
git push origin main --tags
# 完成。workflow 接管，约 1 分钟后 release 上线。
# （workflow 有"tag 必须在 main 上"校验闸，悬空 tag 会被直接 fail 掉）
```

**就这些。** 因为 tag 打在 main commit 上，而 main 的 manifest name 永远是 `Folio`，
所以 Obsidian 审核读 tag 关联 commit 时永远看到正确的 name——这是单分支架构根治
旧双分支时代「dev 上 name 是 Folio-dev、打 tag 后审核拒」这类问题的关键。

### workflow 做了什么（无需你管，但要知道）

1. **校验红线**：tag 无 `v` 前缀、tag == manifest version、**manifest name == "Folio"**、
   theme.css 无外部网络资源、必备文件齐全。任一不过 → fail，不发 release。
2. **建 release**：`--latest`，非 draft，挂白名单资产（theme.css/manifest.json/README×2/截图×2）。
   开发文件（AGENTS.md/.opencode/.github）留在仓库里，但不进 release 资产。
3. **自检**：latest tag == 推送 tag、theme.css+manifest.json 在、draft=false。任一不符 → fail。

### 仍需人工把关的（workflow 管不到的）

- **release notes 内容**：workflow 从 commit 历史自动生成。如果要精心写 changelog，在 commit message body 里写清楚。
- **light/dark 视觉验证**：workflow 不看截图，你必须在发版前肉眼验过。
- **obsidian 市场确认**：发版成功后，回 Obsidian 点「检查更新」确认不报错。

### 为什么是单分支（不再用 dev/main 双分支）

双分支时代的痛点是「同 vault 双主题对照调试」需要 dev/main 的 manifest name 不同
（`Folio-dev` vs `Folio`），但 Obsidian 审核读 tag 关联 commit 的 manifest——
tag 打在 dev 上时 name 是 `Folio-dev`，审核直接拒。单分支消灭了这个矛盾：
只有一个 name `Folio`，tag 永远在 main。

代价：失去同 vault 双主题实时对照。调试时改用**两个 vault 隔离**——
一个 vault 装当前开发版（通过 symlink 指向本工作区），另一个装商店稳定版。

### 手动发版（仅当 workflow 故障时的应急）

正常情况下**永远不要**手动发版。仅当 workflow 本身坏了：

```bash
# 应急流程（在 main 上）：
# 1. 确保 manifest version 已 bump、name 是 Folio
# 2. gh release create <version> --latest --title <version> theme.css manifest.json ...
# 3. 立刻修 workflow，避免下次又得手动
```
