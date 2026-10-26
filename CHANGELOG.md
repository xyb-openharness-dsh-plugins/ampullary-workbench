# 变更记录

只增不删；每条写清"改了什么 + 为什么 + 用户可见结果"。版本号与 VERSION、package.json 三处必须一致。

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
