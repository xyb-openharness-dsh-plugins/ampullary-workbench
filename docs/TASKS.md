# 实施任务与当前交接

规格版本：`docs/SPEC.md`（2026-10-26 重写） ｜ 原型：`prototypes/v0.2/`（探针 51 条通过） ｜
当前分支/包版本：`main` / `@xyb-community/ampullary-workbench@0.1.0`（prototype 渠道）

> 本文件是 `docs/DEV-PLAN.md` 的**任务展开**，不是第二份计划：里程碑与计分只认 DEV-PLAN。
> 「状态」只有三种：`待开始` / `进行中` / `已完成`；`不适用` 必须写理由。

| ID | 业务单元 | 前置依赖 | 拥有文件/模块 | 实现/检查要求 | 证据 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | 工程底座与认领 | — | `package.json`、`.dsh-wb-starter.json`、issue #49 | starter 1.7.0 init；`npm run check` 基线全绿 | 提交 `6add732`；check EXIT 0 | 已完成 |
| T02 | G1 五件套 + 强约束 | T01 | `docs/SPEC.md`、`SCENARIOS.md`、`PATIENT-FLOW.md`、`DIFF-MATRIX.md`、`INTERACTION-PATHS.md`、`DEV-REQUIREMENTS-2026-10-26.md` | 每份章节非空、每条约束能说清怎么验 | `docs/DEV-PLAN.md` M1 | 已完成（G1 待签） |
| T03 | 演示数据单一来源 | T01 | `demo/demo-source.mjs`、`scripts/build-prototype-data.mjs` | 页面不写死业务数值；源文件改动后重新生成 `demo-data.js` | `npm run build:proto-data`；`test/demo-source.test.mjs` 8 条 | 已完成 |
| T04 | 原型：一图秀 | T03 | `prototypes/v0.2/app.js` 的 `chartSVG()`、`docs/ONE-CHART-SPEC.md` | 各线自身归一化；单点不连线；治疗条不参与归一化；点选读数回源 | `npm run probe:proto` R1–R12 / C1–C12 | 已完成（G2 待签） |
| T05 | 原型：指标卡与字号 | T04 | `.mcard`、`--tz` 三档 | 186px / `perspective:1200px` / `aria-pressed` 同步 / 卡背迷你折线；三档 15·17.25·19.8 | 探针第 ③⑧ 段 | 已完成 |
| T06 | 原型：IP11 与 AI 面板 | T04 | `pageHead()`、`pinBar()`、`setAgent()`、`applyAgentWidth()` | 每页有「和 AI 讨论」；只填草稿不代发；五态文案；25%–45%；收起不结束会话；窄屏覆盖抽屉且无假分隔器 | 探针第 ④⑤⑨ 段 | 已完成 |
| T07 | 原型：试验三步 | T03 | `vTrial()`、`scoreTrial()`、`evalCrit()` | 建档 → 检索 → 匹配；分值只在展示层；宽口径写原文瘤种；FAILED/DENIED 不算查过；不适用的条目不产出 | 探针第 ⑥ 段 | 已完成 |
| T08 | 原型：疾病概要 | T03 | `primer-data.js`、`primer.js`、`#pageview` | 四段固定；「?」进整页；返回与关闭两个入口；Esc 只退一层 | 探针第 ⑦ 段 | 已完成（G2 待签） |
| T09 | 检查链 | T01 | `package.json` 的 `check`、`scripts/build-version.mjs`、`scripts/check-wording.mjs` | 语法 / 版本一致 / 文案红线 / 单测 / 冻结合同 五项齐 | `npm run check` EXIT 0 | 已完成（冻结项随 T10） |
| T10 | G3 schema | T02 签认后 | `schema/0001_initial.sql`、`schema/freeze-contract.md`、`docs/SCHEMA.md` | 四契约落地；`saved_trial` 只有 `(trial_key, saved_at)`；冻结 sha256 可复算 | 待建 | 待开始 |
| T11 | 演示数据 parity | T10 | `demo/build-demo-data.mjs` | 同源产出 sqlite 与 `demo-data.js`，逐点 `deepStrictEqual` | 待建 | 待开始 |
| T12 | 临床库（本地快照） | T10 | `research/ampullary-cancer/` | 每条带来源 + 抓取日期 + 通道终态；basket 口径原文 | 待建 | 待开始 |
| T13 | 开发版前端 | T10 + G2/G3 签认 | `lib/client.js` | 11 视图 × 27 子页对齐 v0.2；customFrame 三条硬要求；`apiBase` 不含 `/api` | 待做 | 待开始 |
| T14 | 导入链路 | T13 | `import/`（嗅探 → 取行 → 闸门 → 抽候选 → 落库）、MinerU 设置页 | 五段顺序固定、断点可复算；Token 不落日志 | 待做 | 待开始 |
| T15 | 自测与 parity | T13 | `scripts/smoke-activate.mjs`、截图对账 | 生产版实跑 + 逐页 UI parity | 待做 | 待开始 |
| T16 | 装机到本机 Desktop | T15 | `scripts/check-install.mjs`、`docs/GATE-RECORDS.md` | 37 号三条判据全过，输出原样抄进记录；未装就写"未装" | 待做 | 待开始 |
| T17 | 市场投稿 | T16 | `docs/RELEASE.md` | 未获用户授权前一律 `不适用`（理由：用户未授权投稿） | — | 不适用 |

## 当前失败 / 复现

- 无失败。`npm run check` EXIT 0；`npm run probe:proto` 51/51；`npm run audit` 0 失败 3 项待人工
  （其中两项是 `lib/client.js` 还是骨架、会话归属要在 T13 才实现，这是如实记录，不是漏做）。

## 未验证项

1. 真实宿主里的面板拖动 / 会话归属 / `ensureSession` —— 要 T13 + T16 实测。
2. 本机 DSH Desktop 装没装、装到哪个 profile —— 未探测。
3. 试验条目全部 `DEMO-*` 演示编号，无真实登记号；指南原件全部未取得。

## 下一步具体动作 / 命令

1. 用户签 G1 / G2 → 写 `docs/GATE-RECORDS.md`。
2. `schema/0001_initial.sql` 起草 → 建库 → `foreign_key_check` → 算 sha256 写 `freeze-contract.md`。
3. `npm run build:proto-data && npm run probe:proto`（改数据后必跑）。

## 用户已确认的偏好与授权

- 病种：壶腹部腺癌；临床试验三步 = 档案建立 → 搜索查询 → 结果匹配分析。
- 仓库 private；三层信息边界（事实 / 解释 / 判断）；整页视图替代万能弹窗；老项目不回溯改文案红线。
