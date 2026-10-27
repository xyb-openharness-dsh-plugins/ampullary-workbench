# 变更记录

只增不删；每条写清"改了什么 + 为什么 + 用户可见结果"。版本号与 VERSION、package.json 三处必须一致。

## 0.1.1 — 2026-10-27

### 36 号 v2 补齐（指南可点 + 状态卡）

改了什么：

- **模式层同步**：`prototypes/v0.2/primer.js` / `primer.css` 对齐 starter 最新
  `disease-primer.js/.css`（§2.5 可点链接版），并保留本台 IP11 的「和 AI 讨论这个」入口。
- **指南表原件可点**：evidence 表 6 行「原件」列全部改为 `{text,url}` 对象，
  不再有纯文字；sources 全部补齐 `original` + `url` / `secondaryUrl`。
- **链接 6 条，全部逐条用 `verify-links.mjs` 验活为 OK**：
  NCCN 官网指南目录页、ACS/AJCC 出版方页、人卫社 CSCO 出版方页、
  国家卫生健康委 2022 版《胰腺癌诊疗指南》通知页（附件 PDF，唯一取得全文的一份）、
  ISGPS CR-POPF 2016 与 DGE 2007 的出版方书目页。
- **未取得项**：NCCN / AJCC / CSCO / ISGPS 均未取得原件，表内文字如实写「未取得原件」，
  note 说明原因（需账号 / 需购买 / 仅书目摘要），未编造 URL。
- **看板状态卡（§2.6）**：一图秀首卡新增四件结构——卡头 `D+N 状态卡 · 距下次复查`、
  大字天数（手术日 Day 0 派生，不手填）、现状行（当前阶段 + 下次 2026-11-05 复查）、
  出口按钮排（主按钮进术后随访页 + 副按钮打开疾病概要）。无锚点时整卡显示「待初始化」。
- **浮窗四段自查**：`definition → evidence → landscape → trend` 四段齐全；
  landscape 补固定出口句「不代表任何一项适合你…这一句需要问你的医生」。
- **检查链**：新增 `scripts/check-primer-links.mjs`（L1–L6，17 项断言）并接进 `npm run check`。

为什么：36 号 §2.5 要求「已取得/未取得」都必须可点；§2.6 要求状态卡四件齐全。

用户可见结果：病概要指南表每行都能点开；一图秀首屏出现按天计算的状态卡；
`npm run check` 退出码 0；疾病概要探针 9/9 PASS。

## 0.1.0 — 2026-10-26

- 由社区脚手架 dsh-wb-cli@1.7.0 (8d7df5f) 初始化，仅有注册骨架与健康接口，无业务功能。

### 同日：G1 文档 + G2 原型（仍为 0.1.0 · prototype 渠道，未发版）

改了什么：

- **G1 五件套**：`docs/SPEC.md`（一级 11 / 二级 27 / 三条 ADR）、`SCENARIOS.md`（S1–S12）、
  `PATIENT-FLOW.md`（A–D 四条流程 + 页面树）、`DIFF-MATRIX.md`（14 行差异，6 项硬差异）、
  `INTERACTION-PATHS.md`（P01–P13 + CRUD 双通道 + IP1–IP11）；
  另加 `DEV-REQUIREMENTS-2026-10-26.md`（四类新标准 × 怎么验）、`DEV-PLAN.md`（M0–M7）、`TASKS.md`、`ONE-CHART-SPEC.md`（项目实例）。
- **G2 原型** `prototypes/v0.2/`：一图秀（7 条线各自归一化、3 类治疗带、5 条事件竖线、点选读数回源）、
  3D 指标卡（186px）、11 页逐一接「和 AI 讨论」（只填草稿不代发）、临床试验三步（建档 → 检索 → 匹配，
  透明匹配分 + 三态 + 宽口径原文瘤种 + DENIED 通道）、疾病概要整页（返回与关闭两个入口）。
- **演示数据单一来源**：`demo/demo-source.mjs` → `scripts/build-prototype-data.mjs` → `demo-data.js`，页面零硬编码。
- **工程**：`lib/layout.js`（customFrame / businessWidth 0.65 / AGENT_PANE 25–45 默认 35）、
  `lib/version.js`（生成物）、`scripts/build-version.mjs`、`scripts/check-wording.mjs`、
  `scripts/probe-proto.mjs`（51 条断言）、`test/demo-source.test.mjs`（8 条）。

为什么：用户点名四类新标准（发布目标 / 一图秀与指标体系 / AI 对话入口与"演示不伪装接通" / 临床试验三步）必须先落到 G1/G2，再谈开发版。

用户可见结果：`npm run probe:proto` 全通过；四张证据截图在 `prototypes/v0.2/_evidence/`；
**尚未装进 DSH Desktop，页面上的 AI 对话是演示态，不连任何模型**。
