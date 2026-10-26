/* 面板布局参数。
 *
 * 这里是 DSH 面板合同的**唯一入参来源**：客户端 register、构建注入与包级检查都读它。
 * 别处不许再写一份 0.65（也别写它的补数 0.35）——面板参数散在 client.js 与构建脚本里时，
 * 改一处漏一处，最后连"业务区到底多宽"都要靠截图量。
 *
 * ## 本台用 customFrame = true（自己排版会话区）
 *
 * 理由（对应 starter `docs/20-AGENT-PANE-DESIGN.md`）：
 * 1. 顶栏要放自己的三段式（左=品牌 + 版本 chip / 中=状态说明 / 右=主按钮组），
 *    标准分栏下顶栏归宿主，塞不进这个结构，也放不下"和 AI 讨论"这类页级入口；
 * 2. 本台的分栏要能在 25%–45% 之间拖、键盘可调、收起后不结束会话，
 *    标准分栏的 `--workbench-business-width` 只是注册时的静态值，没有这些行为；
 * 3. 一切布局、弹层、拖拽都必须留在宿主分配的主内容区内（不越过宿主导航与权限控件）。
 *
 * 业务区宽度不再由宿主分栏决定，而由 AGENT_PANE 反推：默认会话占 35%（业务 65%），
 * 与原型 v0.2 的实测一致——11 个视图 × 27 个子页在 1440×65% ≈ 936px 下无横向溢出。
 */

/**
 * 宿主面板参数（写进客户端 register / dsh 清单时逐字使用）。
 * customFrame 下 businessSide/businessWidth 不再驱动宿主分栏，但注册时仍会被宿主
 * 校验（businessSide ∈ left/right，businessWidth ∈ 0.25–0.7），所以保留合法值：
 * businessWidth 记的是**默认业务区宽度**，与 AGENT_PANE.default 互补（和必须为 1）。
 */
export const PANEL = Object.freeze({
  businessSide: 'left',
  businessWidth: 0.65,
  customFrame: true,
});

/** 宿主允许的 businessWidth 区间（宿主 register() 强校验，越界直接抛错 → 插件激活失败） */
export const HOST_LIMITS = Object.freeze({ min: 0.25, max: 0.7 });

/**
 * AI 会话面板宽度（customFrame 下由我们实现拖动，宿主不参与）。
 * 取 starter 20 号基线：默认 35%，可拖 25%–45%；窄容器（< 760px）改为覆盖式抽屉，不用这个比例。
 */
export const AGENT_PANE = Object.freeze({
  default: 0.35,
  min: 0.25,
  max: 0.45,
  /** 步进：键盘一次 2%，与拖动精度一致，键盘与鼠标得到同一组取值 */
  step: 0.02,
  /** 容器宽度低于此值时，面板改为覆盖式抽屉 */
  narrowBelowPx: 760,
  /** 覆盖式抽屉宽度上限（px） */
  drawerMaxPx: 420,
});

/**
 * 一图秀绘图区的 min-content 宽度。
 * 936px 业务宽度减去左栏 248px 与内边距后实测约 610px；低于此值时
 * 末点标签与事件竖线标签会互相压住 → 必须降到 3 条指标或切成单列。
 */
export const ONE_CHART_MIN_PX = 610;

/** 业务区像素宽度：宿主给的比例 × 窗口宽度 */
export function businessPanePx(windowWidth, width = PANEL.businessWidth) {
  if (!Number.isFinite(windowWidth) || windowWidth <= 0) throw new TypeError('windowWidth 必须是正数');
  return Math.round(windowWidth * width);
}

/** 把任意输入夹到 AGENT_PANE 的允许区间内；非法输入（NaN 等）回落到默认值。 */
export function clampAgentWidth(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return AGENT_PANE.default;
  return Math.min(AGENT_PANE.max, Math.max(AGENT_PANE.min, n));
}

/** 会话区百分比 ↔ 业务区百分比必须互补：0.35 → '65%'，供 CSS 变量使用。 */
export function businessPercentFromAgent(agentRatio) {
  const r = clampAgentWidth(agentRatio);
  return `${Math.round((1 - r) * 100)}%`;
}
