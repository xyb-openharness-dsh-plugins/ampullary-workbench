# DEV-PLAN · 里程碑（唯一权威）

- 首次：2026-10-26 ｜ 本次更新：2026-10-26（G1 五件套 + G2 原型 v0.2 + 一图秀规范 + 检查链补齐）
- 闸口顺序不可跳：**G1 业务流程 → G2 HTML 交互 demo → G3 数据模型**。通过必须留痕
  （确认人 / 原话要点 / 日期 / 产物版本），截图与脚本检查不算签认。
- 里程碑只认这一份。`docs/TASKS.md` 是它的**任务展开**，不是第二份计划。

> 一句话：**M0–M2 已经做完并留了证据，M3 之后一行没写。G1 与 G2 都还停在"产出齐了、等用户签认"，
> 所以 M1/M2 计 ✅ 但闸口栏写"待签"，不许自己宣布过关。**

## 进度总表

| 里程碑 | 内容 | 完成度 | 计分（项） | 状态 | 闸口 |
| --- | --- | --- | --- | --- | --- |
| M0 工程底座 | starter 1.7.0 init、文档体系、`npm run check` 基线、仓库与 issue 认领 | 100% | 3/3 | ✅ 完成 | — |
| M1 调研与场景 | SPEC / SCENARIOS / PATIENT-FLOW / DIFF-MATRIX / INTERACTION-PATHS / DEV-REQUIREMENTS | 100% | 6/6 | ✅ 完成 | **G1 待签认** |
| M2 原型 demo | v0.2 四件套 + 演示数据单一来源 + 一图秀（含 README 一图规范）+ 3D 卡 + IP11 + 试验三步 + 疾病概要 + 51 条探针 | 100% | 6/6 | ✅ 完成 | **G2 待签认** |
| M3 数据模型 | `schema/0001_initial.sql` + freeze-contract + SCHEMA-SPEC + 四项复核 + 生成器 parity | 0% | 0/5 | ⬜ 未开始 | G3 未开 |
| M4 临床库 | `research/ampullary-cancer/` 试验条目、逐来源终态、档案字段落库 | 0% | 0/3 | ⬜ 未开始 | 与 G2 交叉验证 |
| M5 开发版 | 六步移植、11 视图 27 子页、导入链路（MinerU）、设置页、`--tz` 三档、`lib/client.js` 真实现 | 0% | 0/8 | ⬜ 未开始 | 需 G2 + G3 均过 |
| M6 自测 | 检查链全绿、单测、生产版实跑、UI parity、装机前冒烟 | 40% | 2/5 | 🟡 进行中 | — |
| M7 装机与市场 | tgz、Desktop 实测三条判据、GATE-RECORDS、市场投稿 | 0% | 0/3 | ⬜ 未开始 | 只认目标 Desktop 实测 |

**整体：17 / 39 项 = 44%**

### 进度条（2026-10-26）

```
M0 工程底座   ██████████ 100%   3/3   ✅  starter 1.7.0 · issue #49 已认领
M1 调研与场景 ██████████ 100%   6/6   ✅  G1 待签认
M2 原型 demo  ██████████ 100%   6/6   ✅  G2 待签认（v0.2 · 探针 51 条）
M3 数据模型   ░░░░░░░░░░   0%   0/5   ⬜  下一步
M4 临床库     ░░░░░░░░░░   0%   0/3   ⬜
M5 开发版     ░░░░░░░░░░   0%   0/8   ⬜
M6 自测       ████░░░░░░  40%   2/5   🟡  check 全绿 + 原型探针已建
M7 装机与市场 ░░░░░░░░░░   0%   0/3   ⬜  不许先写"已验证"
                                        ─────────
                              整体   17/39 = 44%
```

### 计分口径（避免进度条变成形容词）

- 一个里程碑 = 一张交付项清单，**完成度 = 已完成项 / 总项数**，不接受"差不多做完了"。
- **半分只用于一种情况**：做了但有明确缺口，且缺口能一句话说清（例：功能通了但路径与六步要求不一致）。
- 闸口签认**不因为脚本变绿而自动发生**：探针全绿只证明"实现了"，不等于用户认了。

## 逐项清单

### M0 工程底座（3/3 ✅）

| # | 交付项 | 证据 | 状态 |
| --- | --- | --- | --- |
| 0.1 | `dsh-wb-cli init` 出 197 个文件，`.dsh-wb-starter.json` 记 starter 1.7.0 / `8d7df5f` | 初始提交 `6add732` | ✅ |
| 0.2 | 组织 issue 认领（#49，labels `claim, claimed, triage`，assignee `samqin123`） | 仓库 `xyb-openharness-dsh-plugins/ampullary-workbench`（private） | ✅ |
| 0.3 | `npm run check` 基线全绿（含文案红线、单测、版本一致） | `NODE_OPTIONS= npm run check` → EXIT 0 | ✅ |

### M1 调研与场景（6/6 ✅，G1 待签）

| # | 交付项 | 证据 | 状态 |
| --- | --- | --- | --- |
| 1.1 | `docs/SPEC.md`（三条断档 / 一级 11 项 / 二级 27 项 / 三条 ADR） | 本次重写 | ✅ |
| 1.2 | `docs/SCENARIOS.md`（S1–S12，每条写"给什么 + 不给什么"） | 本次新建 | ✅ |
| 1.3 | `docs/PATIENT-FLOW.md`（A–D 四条流程 + 页面树） | 本次新建 | ✅ |
| 1.4 | `docs/DIFF-MATRIX.md`（14 行差异，6 项硬差异 + 与 BiliPal/PDAC 重合度） | 本次新建 | ✅ |
| 1.5 | `docs/INTERACTION-PATHS.md`（P01–P13 六要素 + CRUD 双通道 + IP1–IP11 自检） | 本次新建 | ✅ |
| 1.6 | `docs/DEV-REQUIREMENTS-2026-10-26.md`（四类新标准 × 怎么验） | 本次新建 | ✅ |

### M2 原型 demo（6/6 ✅，G2 待签）

| # | 交付项 | 证据 | 状态 |
| --- | --- | --- | --- |
| 2.1 | `prototypes/v0.2/` 四件套（index / app / style / primer）+ 疾病概要四段 | `probe:proto` 第 ⑦ 段 | ✅ |
| 2.2 | 演示数据单一来源：`demo/demo-source.mjs` → `demo-data.js`，页面零硬编码 | `build:proto-data` + `test/demo-source.test.mjs` 8 条 | ✅ |
| 2.3 | 一图秀 R1–R12：7 条线各自归一化、治疗带 3 类、事件竖线避让、点选读数回源 | `docs/ONE-CHART-SPEC.md` + 探针 C1–C12 | ✅ |
| 2.4 | 3D 指标卡 186px / `perspective:1200px` / `aria-pressed` 同步 / 卡背迷你折线 | 探针第 ③ 段 | ✅ |
| 2.5 | IP11「和 AI 讨论」11 页全覆盖，草稿不代发；疾病概要「和 AI 讨论这个」 | 探针第 ④⑦ 段（消息条数仍为 1） | ✅ |
| 2.6 | 试验三步 + 透明匹配分 + 三态 + 宽口径原文瘤种 + DENIED 通道 | 探针第 ⑥ 段 | ✅ |

### M3 数据模型（0/5 ⬜）

| # | 交付项 | 判据 | 状态 |
| --- | --- | --- | --- |
| 3.1 | `schema/0001_initial.sql`：档案 1 + 指标 3 + 通用 8 + 壶腹专属 N | 建库成功、`foreign_key_check` 空 | ⬜ |
| 3.2 | `schema/freeze-contract.md` 登记 sha256 与内容边界 | 哈希可复算 | ⬜ |
| 3.3 | `docs/SCHEMA.md` 逐表逐列说明（含"禁列名"清单） | `saved_trial` 只有 `(trial_key, saved_at)` | ⬜ |
| 3.4 | 四项复核：无 `is_conclusion` / 缺健侧不生成差值 / 更正只新增 / 四层不合并 | 脚本断言 | ⬜ |
| 3.5 | `demo/build-demo-data.mjs` 同源产出 sqlite 与 `demo-data.js`，逐点 `deepStrictEqual` | parity 全等 | ⬜ |

### M4 临床库（0/3 ⬜）

| # | 交付项 | 判据 | 状态 |
| --- | --- | --- | --- |
| 4.1 | `research/ampullary-cancer/` 试验条目（本地快照，含 basket 口径） | 每条带来源 + 抓取日期 + 终态 | ⬜ |
| 4.2 | 通道终态写清（OK / FAILED / DENIED 都不算"查过"） | 页面与数据一致 | ⬜ |
| 4.3 | 档案字段（12 项）与试验条件字段的对应关系可核对 | 每项匹配都能指到具体字段 | ⬜ |

### M5 开发版（0/8 ⬜）

| # | 交付项 | 判据 | 状态 |
| --- | --- | --- | --- |
| 5.1 | `lib/client.js` 真实现（11 视图 × 27 子页），逐字符对齐 v0.2 | UI parity | ⬜ |
| 5.2 | customFrame 三条硬要求：`currentSession()+ownsSession()` 判归属、`ensureSession({folder})` 非空、会话区常挂载只切 display | 假宿主外壳 + 真实点击 | ⬜ |
| 5.3 | 导入链路：`import/` 五段（嗅探 → 取行 → 闸门 → 抽候选 → 落库） | 断点可复算 | ⬜ |
| 5.4 | MinerU 设置页（Token 走本机文件，不落日志） | 失败态可见 | ⬜ |
| 5.5 | `--tz` 三档字号 + `businessWidth` 与 `AGENT_PANE` 互补 | 无横向溢出 | ⬜ |
| 5.6 | 面板参数唯一来源 `lib/layout.js` | ✅ 已就位（本项随 5.1 才算完成） | 🟡 |
| 5.7 | 路由 `ROUTES` 单一来源 + 11 条 history 栈 | 返回键只退一层 | ✅ 原型已做（开发版待接） |
| 5.8 | `apiBase` 不含 `/api`；所有调用 `${apiBase}/api/xxx` | grep 断言 | ⬜ |

### M6 自测（2/5 🟡）

| # | 交付项 | 判据 | 状态 |
| --- | --- | --- | --- |
| 6.1 | 检查链全绿（语法 / 版本一致 / 文案红线 / 单测 / 冻结） | `npm run check` EXIT 0 | ✅ |
| 6.2 | 原型探针（51 条，真实 Chrome） | `npm run probe:proto` 全通过 | ✅ |
| 6.3 | 生产版实跑（真实目录 + 真实 sqlite） | 冒烟脚本 | ⬜ |
| 6.4 | UI parity（原型 ↔ 开发版逐页） | 截图对账 | ⬜ |
| 6.5 | 装机前冒烟（`smoke-activate` + 假宿主点击） | 无 console error | ⬜ |

### M7 装机与市场（0/3 ⬜）

| # | 交付项 | 判据 | 状态 |
| --- | --- | --- | --- |
| 7.1 | `npm pack` 出 tgz，包内文件与 `files` 一致 | `pack-contents.test.mjs` | ⬜ |
| 7.2 | 装进 **本机 DSH Desktop 实际加载的那个 profile**，37 号三条判据全过 | `node scripts/check-install.mjs` 原样输出 | ⬜ |
| 7.3 | `docs/GATE-RECORDS.md` 抄下三条判据输出 | 未装就写"未装"，不许写"已验证" | ⬜ |

## 当前失败 / 复现

- 无失败项。`npm run check` EXIT 0；`npm run probe:proto` 51/51。
- 审计（`npm run audit`，家族一致性 36 项）：仅剩 `data/冻结合同` 一条 warn（M3 未开始，属预期）。

## 未验证项（不许当通过）

1. 真实宿主里的面板拖动、会话归属、`ensureSession` —— 全部要等 M5 + M7 实测。
2. 本机 DSH Desktop 是否装了、装到哪个 profile —— 未探测过，M7 才做。
3. 试验条目全部是 `DEMO-*` 演示编号，**没有任何一条真实登记号**；宽口径 basket 的"允许瘤种"写的是演示原文。
4. 指南原文（NCCN / AJCC / CSCO / ISGPS）**全部未取得原件**，一律标注"据二次来源 · 页码待核"。

## 下一步具体动作

1. 请用户签 G1 与 G2（`docs/GATE-RECORDS.md` 留痕：确认人 / 原话 / 日期 / 版本）。
2. 签完后开 M3：`schema/0001_initial.sql` → `freeze-contract.md` → `demo/build-demo-data.mjs` parity。
3. M3 过 G3 后才动 M5 的 `lib/client.js`。

## 用户已确认的偏好与授权

- 病种：**壶腹部腺癌**（2026-10-26 确认）；临床试验三步 = 档案建立 → 搜索查询 → 结果匹配分析。
- 仓库：**private**，暂不对外开放（家族长期决定）。
- 三层信息边界：事实可做 / 解释可做带机构版本页码 / 判断一句不生成，统一出口「这一句需要问你的医生」。
- 整页视图替代万能弹窗：内容超 1.5 屏或需分区 → 整页；返回与关闭两个入口。
