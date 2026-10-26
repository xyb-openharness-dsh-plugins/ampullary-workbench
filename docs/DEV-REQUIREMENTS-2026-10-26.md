# DEV-REQUIREMENTS · 2026-10-26 · 壶腹部腺癌 小壶宝 AmpuPal

> 阶段 0 的交付物，不是可选项。每条约束都要能被某条命令或某张截图验证；写不出验证方式的，删掉。
> 本轮用户点名四类**新标准**必须落地：① 发布/部署目标（37 号）② 一图秀与指标体系（16 / 24 / 27 号）
> ③ AI 对话入口与"演示不伪装接通"（IP11 / 20 号 / 19 号 / 34 号）④ 临床试验三步与页面（35 号）。
> 脚手架基线 **1.7.0**（`8d7df5f`）。

## 一、范围（交付物 × 落点 × 怎么验）

| # | 交付物 | 落点 | 怎么验 |
| --- | --- | --- | --- |
| 1 | 项目骨架与文档体系 | `docs/` + `prompts/` | `npm run check` 全绿 |
| 2 | G1 五件套 | `docs/SPEC.md`、`SCENARIOS.md`、`PATIENT-FLOW.md`、`DIFF-MATRIX.md`、`INTERACTION-PATHS.md` | `npm run check:docs`（脚本 `scripts/check-g1-docs.mjs`）逐条断言章节存在且非空 |
| 3 | G2 HTML 原型 | `prototypes/v0.2/` 四件套 + `primer-data.js` | `file://` 打开，控制台 0 error；`npm run probe:proto` 断言 A1–A10 + 一图秀 + IP11 + 试验三步 |
| 4 | G3 业务 schema | `schema/0001_initial.sql` + `docs/freeze-contract.md` | 建库成功、`foreign_key_check` 空、冻结哈希登记 |
| 5 | 演示数据单一来源 | `demo/build-demo-data.mjs` | 同时产出 `demo/demo-data.sqlite` 与 `prototypes/v0.2/demo-data.js`，逐点 `deepStrictEqual` |
| 6 | 装机到本机 DSH Desktop | `scripts/check-install.mjs` 探测出的那个 profile | 37 号三条判据全过 |

**本轮明确未做**（验收里不算通过）：MinerU 云端解析真 Token 跑真实 PDF、市场投稿、真实病例、V2/V3 迭代。

## 二、四类新标准的落地形态

### 2.1 发布 / 部署目标（37 号，最高优先级）

| 约束 | 怎么验 |
| --- | --- |
| 唯一目标是本机 **DSH Desktop**（`io.dsh.desktop`）自己加载的那个 profile，`~/.dsh` 与 DeepSeek Harness 都不算 | `node scripts/check-install.mjs` 打印它实际认了哪个路径；判据里有 `dsh-desktop` 字样 |
| 不按目录名猜 profile（`web` 不是约定） | 脚本先读宿主配置/argv，`--profile` 可覆盖；文档里不写"装到 web" |
| 三条判据缺一即没装上 | ① `dependencies` 有本包且值 `file:<绝对路径>.tgz` ② `dsh.profile.bundles` 含包名 ③ 重启后 `desktop-workbenches/state.json` 有记录且 `harness.log` 无本包报错 |
| 没装 Desktop 就停下，给 <https://www.dshdesktop.com/>，不写"已验证" | `docs/GATE-RECORDS.md` 里装机一节必须有脚本原样输出 |

### 2.2 一图秀与指标体系（16 / 24 / 27 号）

| 约束 | 怎么验 |
| --- | --- |
| 每条线按**自身量纲**归一化，共用 Y 轴是反例 | 探针读 SVG：两条线 `d` 属性的 y 范围都落在 `[top,bottom]`，且脚本断言存在 `normalize()` 的单线调用而非全局 min/max |
| 归一化基准取**全部记录**的 min/max，不取时间窗内 | 单测：给 5 个点、窗内只有 2 个，断言 `hi/lo` 来自 5 个点 |
| 零跨度兜底 `span = hi-lo \|\| max(\|hi\|×0.08, 1)` | 单测：全部点相等时不产生 `NaN` |
| 图上必须有**可见**的"不可比"说明 | DOM 搜原文，缺字即失败 |
| 单点不连线（写"只有 1 次记录，暂不连线"） | 单测：1 点 → `d` 属性为空 |
| 治疗/事件条独立成行，关掉后指标路径 `d` 不变 | 探针：切换前后取 `d` 比对 |
| 事实源与指标卡、CSV 导出同一份 | `demo-data.js` 与 sqlite 逐点 `deepStrictEqual` |
| 指标卡 186px 高 / `perspective:1200px` / 整卡 180° 翻 / 背面迷你折线 | 探针读 computedStyle；键盘 Enter/Space 可翻（a11y） |
| 指标分档（23/24 号）只用**记录到的**阈值，不生成判读 | `scripts/check-wording.mjs`；数据层无 `risk_level` / `grade_auto` 类列 |

### 2.3 AI 对话入口（IP11 / 20 / 19 / 34 号）

| 约束 | 怎么验 |
| --- | --- |
| **每页**标题行常驻「和 AI 讨论」按钮 | 探针遍历全部页面，逐页断言按钮存在 |
| 点击 → 拉起 AI 对话栏 + 把本页 `discussFacts`（事实摘要，**无判定词**）填进输入框 + **不代发** | 探针：点击后输入框含本页标记；`send` 调用计数为 0 |
| 事实摘要里出现"建议/可能/进展/稳定/好转/缓解"即失败 | `scripts/check-wording.mjs` 扫 `discussFacts` 源 |
| 顶栏三段式 + 五态文案固定（`AI 对话 / 正在连接… / 收起 AI 对话 / 打开 AI 对话 / AI 对话暂不可用`） | 探针逐态断言 |
| 「×」有 `aria-label`；splitter 有 `role="separator"` + `aria-valuenow` + ←→/Home/End | `scripts/check-a11y.mjs` |
| `businessSide:'left'` + `businessWidth(0.65) + AGENT_PANE.default(0.35) = 1` | 探针读 `lib/layout.js` 常量并断言和为 1 |
| **收起不等于结束会话**：不调用 close/delete | 探针在收起后断言会话节点仍挂载 |
| 演示态**不伪装已接通**：写明"未发送任何内容 / 待你发送 / 真实版本走宿主接口" | DOM 搜原文，缺字即失败 |
| 独立打开（无宿主）时走本地演示面板 + 上述说明；嵌入式走 `postMessage({type:'ampupal:agent-draft'})` | `templates/check-agent-draft-bridge.mjs` |

### 2.4 临床试验三步（35 号）+ 整页视图（32 号）+ 疾病概要（36 号）

| 约束 | 怎么验 |
| --- | --- |
| 三步固定：**档案建立 → 搜索查询 → 结果匹配分析**，页内分三段不合并 | 探针断言三个 section id 存在且顺序正确 |
| 只有"已确认入库"字段参与匹配，未核对候选不参与 | 单测：候选状态 `candidate` 时匹配函数返回 `not_ready` |
| 检索双通道（本地快照 + 在线），`FAILED`/`DENIED` 不算"查过" | 单测：三态分别断言 |
| 分层命中：结构化 / 文本 / **宽口径（basket）**；宽口径每条标"该项要求写的是 <原文瘤种>" | 探针 DOM 搜"原文瘤种"字样；本癌种专属 |
| **禁数值化综合分**做判定；允许展示层透明计分并**必须**并列 `matchNote` 证据行 | 标签固定「匹配分 N（字段重合度参考分，非入组资格）」；`templates/check-trial-matching.mjs` T1–T9 |
| 数据层**禁** `match_score` / `eligible` / `suitability` 列；只落 `saved_trial(trial_key, saved_at)` | `docs/freeze-contract.md` 里列出禁止列名并附 grep 断言 |
| 结果三态：命中 / 无法自动匹配（不判"不适用"）/ 不适用不产出 | 探针逐态截图 |
| 疾病概要每台一个「?」，是**整页**不是弹窗；四段固定（定义 → 规范与指南 → 治疗全景 → 发展趋势） | `docs/DISEASE-PRIMER.md` + README `## 疾病概要`；`scripts/check-derivative-leftovers.mjs` |
| 整页视图：返回与关闭**两个**入口、关掉回原滚动位置与焦点、Esc/浏览器返回各只退一层、history 为唯一真源（禁 `replaceState` 假装退栈） | `scripts/probe-page-view.mjs` A1–A10（`--self-test` 反向对照） |

## 三、硬约束（每条带错误来源）

### 数据层

| 约束 | 错误来源 |
| --- | --- |
| 复合主键表裸 SELECT 必须 `ORDER BY rowid` | 家族通用坑 |
| 缺测显式 NULL，不用 0 顶替；缺健侧不出差值 | 家族四契约 |
| 分类值（T 分期原文、胰瘘分级、亚型）`dec IS NULL` 且 `kind ∈ {grade,qual}` | 本项目：T1a/T1b 与 CR-POPF A/B/C 都不能当数值连线 |
| **AJCC 壶腹 T / 胆管 / 胰腺三套分期并列不换算**，不存 derived 分期 | 本项目新增：三张表按不同浸润深度定义，换算即造假 |
| 迁移只增不改；INSERT 写显式列名 + 显式问号数 | 家族通用 |
| 面板参数唯一来源 `lib/layout.js`；`apiBase` 不含 `/api` | 家族通用 |

### 前端

| 约束 | 错误来源 |
| --- | --- |
| 页面只能引用所在目录内的相对路径 | 乳腺癌 v0.3：`file://` 能显示、HTTP 预览 404 |
| 内联 svg 必须给宽高出 | 家族通用 |
| 窄屏 `body.scrollWidth === innerWidth`；`--tz` 三档 1 / 1.15 / 1.32 | 小甘宝 v0.3.6 实测 |
| `[hidden]{display:none!important}`（`display:flex` 会盖掉 `hidden`） | 家族通用 |
| 版本三处同源（顶栏 chip / 页脚 / 关于） | 35-PAGE-VERSION-LITERAL |

### 工程

| 约束 | 错误来源 |
| --- | --- |
| 跑测试 / pnpm 前先 `NODE_OPTIONS=` | 家族通用 |
| 单测用 `:memory:` + `--disable-warning=ExperimentalWarning` | 家族通用 |
| sh 里 `$var` 紧跟中文写 `${var}`；BSD sed 无 `0,/re/`；grep 或匹配用 `-E`；`comm` 前 `export LC_ALL=C` | 本机多次踩坑 |
| 临时目录 `mkdtemp(join(homedir(),'.xyb-…'))` | 家族通用 |
| 假宿主与真宿主入参形状逐字对齐（GET 传 `null` 不是 `{}`） | 小甘宝 v0.3.6 实证：路由把 `{}` 判成写分支，探针 400 |

### 本癌种专属

| 约束 | 错误来源 |
| --- | --- |
| 术前减黄段（胆红素 / 支架 / PTCD）与肿瘤标志物段各自成线，不合并、不相加 | 两条线量纲不同，合并即暗示"黄疸与肿瘤负荷同步" |
| 病理亚型（肠型 / 胰胆型 / 混合型）只照录报告原文，不由免疫组化反推 | 反推属第 ③ 层判断 |
| Whipple 术后并发症（CR-POPF / DGE）只记**报告原文分级 + 记录人 + 日期**，不重算 | 分级由外科按 ISGPS 记录，工具重算会与病历不符 |
| 「壶腹原发 vs 胰头/远端胆管累及」不生成结论，只并列四份报告原文 | 这需要病理医生判断 |
| 试验宽口径命中必须原样写出"该项入组要求里写的是 <原文瘤种>"，不改写成"符合" | 35 号 v2：宽口径不得伪装成命中资格 |

## 四、检查链（`npm run check` 收口）

```
check:docs      G1 五件套章节存在且非空
check:wording   文案红线（建议治疗/可能复发/可以停药/无需就医/治愈率/进展/稳定/好转/缓解）
check:trial     templates/check-trial-matching.mjs T1–T9
check:onechart  R1–R12 断言（单测 + 探针）
check:a11y      aria-label / separator / 键盘
check:pageview  probe-page-view.mjs A1–A10
check:primer    疾病概要四段 + 「?」入口
check:install   37 号三条判据（只在装机阶段跑，不进 check 链）
```

## 五、签认口径

G1 / G2 / G3 通过须留痕：确认人 + 原话 + 日期 + 版本，写进 `docs/GATE-RECORDS.md`。截图**不算**签认。
本文档本身不是签认物，是签认时逐条对照的清单。
