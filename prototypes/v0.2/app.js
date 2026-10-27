/* 小壶宝 AmpuPal v0.1.1 — 交互原型（G2 产物，非业务实现）
 *
 * 三条必须遵守的规矩，写在代码最前面，因为后面每一屏都在执行它：
 *   ① 事实可做（值 / 日期 / 谁说的 / 差值 / 天数），必须能点回来源；
 *   ② 解释可做（指标是什么、检查查什么、指南原文），必须同时有机构 + 版本 + 页码，缺一项整块不显示；
 *   ③ 判断一句都不生成（好坏 / 稳定 / 进展 / 复发 / 方案优劣 / 停药 / 能活多久），wording-ok（本行在陈述红线本身）
 *      统一出口是「这一句需要问你的医生」。
 *
 * 所以本文件里没有一处把指标值翻译成"好不好"。想让某个数变成结论，代码里没有这个函数，也没有这个字段。
 *
 * 数据唯一来源：demo/demo-source.mjs → scripts/build-prototype-data.mjs → demo-data.js。
 * 页面不写死任何业务数值。
 */

const APP = {
  name: '小壶宝', en: 'AmpuPal', version: 'v0.1.1', build: '2026-10-27',
  stage: '阶段 2 · HTML 原型（G2 未签）'
};

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------------- 图标 ---------------- */
const icons = {
  chart: 'M4 19V5M4 19h16M8 15l3-4 3 3 5-7',
  badge: 'M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6z',
  drop: 'M12 3s6 6.2 6 10a6 6 0 0 1-12 0c0-3.8 6-10 6-10z',
  scalpel: 'M4 20l7-7M9 6l9 9-3 3-9-9zM14 3l7 7',
  alert: 'M12 4 2.5 20h19zM12 10v4M12 17h.01',
  lab: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3',
  heart: 'M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9z',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3M7 12h10',
  link: 'M9 15l6-6M8 12l-2 2a4 4 0 0 0 6 6l2-2M16 12l2-2a4 4 0 0 0-6-6l-2 2',
  calendar: 'M7 3v3M17 3v3M3 9h18M5 6h14a2 2 0 0 1 2 2v12H3V8a2 2 0 0 1 2-2z',
  cog: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.3 1a7 7 0 0 0-1.7-1L14.6 3h-3.9l-.3 2.4a7 7 0 0 0-1.7 1l-2.3-1-2 3.4L2.4 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.3 2.4h3.9l.3-2.4a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.6c.1-.3.1-.7.1-1z',
  spark: 'M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1'
};
const icon = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[k] || icons.badge}"/></svg>`;

/* ---------------- 页面树：一级 11 / 二级 30（与 SPEC §三 一一对应） ---------------- */
/* 路由清单 —— 唯一来源。scripts/check-probe-coverage.mjs 从这里读路由表，
 * 再核对探针脚本有没有覆盖到每一条；加页面忘了改探针，这一条会红。
 * 顺序即左侧一级菜单顺序（11 项，SPEC §三）。 */
var ROUTES = ['dash', 'disease', 'preop', 'surgery', 'comp', 'metrics', 'nutrition', 'followup', 'trial', 'care', 'settings'];

/* 外观表：路由 → [标签, 图标]；PAGES 由 ROUTES 派生，保证"路由清单"只有一份 */
const PAGE_META = {
  dash: ['一图秀', 'chart'],
  disease: ['我的病', 'badge'],
  preop: ['术前减黄', 'drop'],
  surgery: ['手术治疗', 'scalpel'],
  comp: ['术后并发症', 'alert'],
  metrics: ['指标趋势', 'lab'],
  nutrition: ['营养与胰酶', 'heart'],
  followup: ['随访与影像', 'scan'],
  trial: ['临床试验', 'link'],
  care: ['复诊准备', 'calendar'],
  settings: ['设置', 'cog']
};
const PAGES = ROUTES.map((k) => [k, PAGE_META[k][0], PAGE_META[k][1]]);
const SUBS = {
  disease: ['定性依据', '病理与亚型', '分期原文', '鉴别'],
  preop: ['引流事件', '胆红素线', '术前评估'],
  surgery: ['手术记录', '病理分期', '住院事件'],
  comp: ['并发症卡', '分级解释', '处理与随访'],
  metrics: ['指标总表', '单指标放大', '分组对照'],
  nutrition: ['体重线', '胰酶记录', '血糖'],
  followup: ['复查日历', '影像对照', '标志物并列'],
  trial: ['档案建立', '搜索查询', '结果匹配'],
  care: ['问题清单', '导出'],
  settings: ['本机目录', '扫描件解析', '显示与关于']
};
const SUBTITLE = {
  dash: '三条线各自按自身量程铺开，只看形状与时间对齐，不比大小。',
  disease: '定性依据、病理亚型、三套分期并列。这里不写"你这属于第几期"。',
  preop: '从引流日数到手术日。胆红素是减黄段的指标，CA19-9 是肿瘤段的指标，两条线不合并。',
  surgery: '术式、切缘、淋巴结都照报告原文录。术式本身不评价。',
  comp: '分级照录报告原文，解释只说"这个标准怎么定义"，不说"你这个算严重"。',
  metrics: '每条指标一行，值有出处。缺测留空，不补 0、不插值。',
  nutrition: '体重、胰酶、血糖是 Whipple 术后三条独立的线，各有各的记录。',
  followup: '复查日期来自医嘱原文；影像只并列报告原话，不生成"变大/缩小"之外的结论。',
  trial: '三步：档案建立 → 搜索查询 → 结果匹配分析。匹配分只是字段重合度，不是入组资格。',
  care: '带什么、问什么。清单可以编辑，导出的是你自己写的那份。',
  settings: '资料放哪、Token 有没有、字多大。'
};

/* ---------------- 数据 ---------------- */
const D = window.DEMO_DATA;
const MET = D.metrics;
const TODAY = D.today;
const dec = (v, d = 0) => (typeof v === 'number' ? v.toFixed(d) : String(v ?? ''));
const pts = (m) => (m.points || []).filter((p) => typeof p.v === 'number').slice().sort((a, b) => a.d.localeCompare(b.d));
const last = (m) => { const a = pts(m); return a.length ? a[a.length - 1] : null; };
const prevOf = (m) => { const a = pts(m); return a.length > 1 ? a[a.length - 2] : null; };
const diffOf = (m) => { const a = last(m), b = prevOf(m); return a && b ? a.v - b.v : null; };
const dayGap = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
const na = (t = '暂无记录') => `<span class="na">${esc(t)}</span>`;
const pill = (t, c = '') => `<span class="pill ${c}">${esc(t)}</span>`;

/* ---------------- 状态 ---------------- */
const state = {
  view: 'dash', sub: null, range: 'all',
  sel: ['tbil', 'ca199', 'alb', 'weight'],
  flip: {}, bands: true, marks: true,
  pin: null, /* { code, d } —— 点选读数（16 号 R9 固定详情 + 回源） */
  tz: 'sm', agentOpen: false, agentW: 35,
  trial: { step: 'profile' }, pv: null
};

/* ---------------- 第 ③ 层的统一出口 ---------------- */
const verdictBox = (what) => `<div class="verdict"><b>${esc(what)}</b><span>这一句需要问你的医生。工作台只摆记录，不给结论。</span></div>`;

/* ---------------- 页头 + IP11「和 AI 讨论」 ---------------- */
function pageHead(title, extra = '') {
  return `<div class="page-head">
    <h1>${esc(title)}</h1>
    <div class="head-tools">${extra}
      <button class="discuss-btn" data-action="discuss" data-discuss="${state.view}"
              aria-label="和 AI 讨论这一页：把本页事实摘要填进输入框，不会自动发送">${icon('spark')}和 AI 讨论</button>
    </div>
  </div>`;
}

/* ==========================================================================
   一图秀（16 号 R1–R12）
   ========================================================================== */
const CW = 980, CH = 420, CX0 = 62, CX1 = 954, CY0 = 132, CY1 = 366;
const xOf = (t, t0, t1) => CX0 + (t - t0) / Math.max(1, t1 - t0) * (CX1 - CX0);

/* 归一化基准取「全部记录」的 min/max，不是时间窗内的（R3） */
function seriesScale(m) {
  const all = pts(m).map((p) => p.v);
  const lo = Math.min(...all), hi = Math.max(...all);
  return { lo, hi, span: (hi - lo) || Math.max(Math.abs(hi) * 0.08, 1) };
}

function smoothPath(coords) {
  const n = coords.length;
  if (!n) return '';
  if (n === 1) return '';
  const dx = [], slope = [];
  for (let i = 0; i < n - 1; i++) {
    const ddx = coords[i + 1].x - coords[i].x;
    dx.push(ddx);
    slope.push(ddx ? (coords[i + 1].y - coords[i].y) / ddx : 0);
  }
  const tan = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) tan.push(0);
    else {
      const w1 = 2 * dx[i] + dx[i - 1], w2 = dx[i] + 2 * dx[i - 1];
      tan.push((w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]));
    }
  }
  tan.push(slope[n - 2]);
  let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const c1x = coords[i].x + dx[i] / 3, c1y = coords[i].y + tan[i] * dx[i] / 3;
    const c2x = coords[i + 1].x - dx[i] / 3, c2y = coords[i + 1].y - tan[i + 1] * dx[i] / 3;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${coords[i + 1].x.toFixed(1)} ${coords[i + 1].y.toFixed(1)}`;
  }
  return d;
}

function bounds() {
  const ds = [];
  for (const m of Object.values(MET)) for (const p of m.points) ds.push(p.d);
  for (const b of D.bands) { ds.push(b.from); ds.push(b.to); }
  ds.sort();
  return [Date.parse(ds[0]), Date.parse(ds[ds.length - 1])];
}
function domainRange() {
  const [s, e] = bounds();
  const months = { '3m': 3, '6m': 6, all: 0 }[state.range];
  if (!months) return [s, e];
  const d = new Date(e); d.setMonth(d.getMonth() - months);
  return [Math.max(s, d.getTime()), e];
}
const inDomain = (d, t0, t1) => { const t = Date.parse(d); return t >= t0 && t <= t1; };

function bandsFor(t0, t1) {
  const color = { drain: '#a9761c', surgery: '#5c7a3b', recovery: '#8b5e83' };
  return D.bands
    .filter((b) => Date.parse(b.to) >= t0 && Date.parse(b.from) <= t1)
    .map((b) => {
      const s = Math.max(Date.parse(b.from), t0), e2 = Math.min(Date.parse(b.to), t1);
      return { ...b, color: color[b.kind] || '#5c7a3b', x1: xOf(s, t0, t1), x2: xOf(e2, t0, t1) };
    });
}
function monthTicks(t0, t1) {
  const out = []; const d = new Date(t0);
  let cur = new Date(d.getFullYear(), d.getMonth(), 1);
  if (cur.getTime() < t0) cur.setMonth(cur.getMonth() + 1);
  while (cur.getTime() <= t1) {
    const x = xOf(cur.getTime(), t0, t1);
    if (x > CX0 + 6 && x < CX1 - 6) out.push({ x, label: `${cur.getMonth() + 1}月` });
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  return out.length > 7 ? out.filter((_, i) => i % 2 === 0) : out;
}

/* 返回 { svg, paths } —— paths 供探针比对"关掉治疗条后路径 d 不变"（R8） */
function chartSVG(t0, t1) {
  const sel = state.sel.filter((c) => MET[c]).map((c) => {
    const m = MET[c];
    const sc = seriesScale(m);
    return { code: c, m, sc, pts: pts(m).filter((p) => inDomain(p.d, t0, t1)) };
  }).filter((s) => s.pts.length);

  if (!sel.length) return { svg: `<div class="empty"><h3>这个时间窗里没有所选指标</h3><p>换一个时间范围，或在左侧加选一条指标。</p></div>`, paths: {} };

  const yOf = (s, v) => CY1 - (v - s.sc.lo) / s.sc.span * (CY1 - CY0);
  const grid = [0, 1, 2, 3, 4].map((i) => {
    const y = CY0 + i * (CY1 - CY0) / 4;
    return `<line class="grid" x1="${CX0}" x2="${CX1}" y1="${y}" y2="${y}" stroke="#eceee0"/>`;
  }).join('');

  const bands = bandsFor(t0, t1);
  /* R8：治疗条是独立的一行，只画色块；标签统一放在图下方的图例里，
     因为"手术日"这种单日事件的条只有一个点宽，把文字塞进条里必然重叠。 */
  const strip = state.bands ? `<g id="bands">${bands.map((b) => {
    const isPoint = b.from === b.to;
    const w = Math.max(b.x2 - b.x1, isPoint ? 4 : 7).toFixed(1);
    const x = (isPoint ? b.x1 - 2 : b.x1).toFixed(1);
    return `<rect x="${x}" y="36" width="${w}" height="9" rx="${isPoint ? 2 : 4.5}" fill="${b.color}" opacity=".45"><title>${esc(b.label)} · ${esc(b.from)}${b.from === b.to ? '' : ' → ' + esc(b.to)}</title></rect>`;
  }).join('')}</g>` : '';

  /* 事件竖线的标签也避让：按 x 排序后分两行交错，同一行里离得太近就不写（悬停有 title）。
     2026-10-26 实测：01-12 与 02-17 两条线只差几十像素，标签直接叠成一团。 */
  const markList = state.marks ? D.marks.filter((mk) => inDomain(mk.d, t0, t1))
    .map((mk) => ({ ...mk, x: xOf(Date.parse(mk.d), t0, t1) })).sort((a, b) => a.x - b.x) : [];
  const rows = [-Infinity, -Infinity];
  const marks = markList.map((mk) => {
    const row = mk.x - rows[0] >= 74 ? 0 : (mk.x - rows[1] >= 74 ? 1 : -1);
    if (row >= 0) rows[row] = mk.x;
    const y = row === 1 ? 26 : 14;
    const label = row < 0 ? '' : `<text x="${mk.x.toFixed(1)}" y="${y}" font-size="8.5" fill="#8b907c" text-anchor="middle">${esc(mk.label)}</text>`;
    return `<line x1="${mk.x.toFixed(1)}" x2="${mk.x.toFixed(1)}" y1="30" y2="${CY1}" stroke="#b9bea8" stroke-width="1" stroke-dasharray="3 6" opacity=".7"><title>${esc(mk.d)} ${esc(mk.label)}</title></line>${label}`;
  }).join('');

  /* 末点标签：按 y 排序，13px 下限避让，右端左锚定（R5） */
  const lastPos = sel.map((s) => {
    const c = s.pts.map((p) => ({ x: xOf(Date.parse(p.d), t0, t1), y: yOf(s, p.v) }));
    const l = c[c.length - 1];
    return { s, x: l.x, y: l.y, v: s.pts[s.pts.length - 1].v };
  }).sort((a, b) => a.y - b.y);
  let cursor = -Infinity;
  for (const it of lastPos) { it.ly = Math.max(it.y, cursor + 13); cursor = it.ly; }
  const over = lastPos.length ? Math.max(0, lastPos[lastPos.length - 1].ly - (CY1 + 2)) : 0;
  if (over) for (const it of lastPos) it.ly -= over;

  const paths = {};
  const lines = sel.map((s) => {
    const coords = s.pts.map((p) => ({ x: xOf(Date.parse(p.d), t0, t1), y: yOf(s, p.v) }));
    const d = smoothPath(coords);
    paths[s.code] = d;
    /* 单点不连线，也不假装连线：只画点 + 一句说明（R6） */
    const path = d ? `<path class="line" data-code="${s.code}" d="${d}" pathLength="1" fill="none" stroke="${s.m.color}" stroke-width="2.1" stroke-linecap="round"${state.bands ? '' : ' data-noband="1"'}/>` : '';
    /* 圆点可点选 → 读数条显示 值/单位/日期/来源（R9）；命中区比视觉半径大，手指也点得中 */
    const dots = coords.map((c, i) => {
      const p = s.pts[i];
      const pinned = state.pin && state.pin.code === s.code && state.pin.d === p.d;
      return `<circle class="pt${pinned ? ' pinned' : ''}" cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${i === s.pts.length - 1 ? 4.6 : 3.4}" fill="${s.m.color}" data-action="pin" data-code="${s.code}" data-date="${p.d}" tabindex="0" role="button" aria-label="${esc(s.m.name)} ${esc(p.d)} ${dec(p.v, s.m.dec)} ${esc(s.m.unit)}"><title>${esc(s.m.name)} ${esc(p.d)} ${dec(p.v, s.m.dec)} ${esc(s.m.unit)} · ${esc(s.m.source)}</title></circle>`;
    }).join('');
    const lp = lastPos.find((x) => x.s === s);
    const nearRight = lp.x > CX1 - 46;
    const single = s.pts.length === 1 ? `<text x="${(lp.x + 8).toFixed(1)}" y="${(lp.ly + 4).toFixed(1)}" font-size="9" fill="#8b907c">只有 1 次记录，暂不连线</text>` : '';
    const tag = `<text class="delta-tag" x="${(nearRight ? lp.x - 8 : lp.x + 8).toFixed(1)}" y="${(lp.ly + 4).toFixed(1)}" text-anchor="${nearRight ? 'end' : 'start'}" font-size="10" font-weight="600" fill="${s.m.color}">${dec(lp.v, s.m.dec)}</text>`;
    return `<g>${path}${dots}${tag}${single}</g>`;
  }).join('');

  const ticks = monthTicks(t0, t1).map((t) => `<line x1="${t.x.toFixed(1)}" x2="${t.x.toFixed(1)}" y1="${CY1}" y2="${CY1 + 5}" stroke="#cfd4bc"/><text x="${t.x.toFixed(1)}" y="${CY1 + 18}" font-size="9.5" fill="#8b907c" text-anchor="middle">${t.label}</text>`).join('');

  const svg = `<svg class="chart" data-chart="one" viewBox="0 0 ${CW} ${CH}" role="img"
      aria-label="所选 ${sel.length} 条指标的时间序列图，各条按自身全部记录的最小值到最大值归一化">
    ${grid}${ticks}${marks}${strip}${lines}
    <text x="6" y="34" font-size="9" fill="#8b907c">治疗</text>
    <text x="${CX0}" y="${CY1 + 36}" font-size="9.5" fill="#8b907c">各条按自身「全部记录」的最小值–最大值归一化，纵向位置不代表数值可比（16 号 R1/R3）</text>
  </svg>`;
  return { svg, paths };
}

/* 指标卡：186px / 整卡 180° 翻 / 背面迷你折线（27 号） */
function mcard(code) {
  const m = MET[code]; if (!m) return '';
  const list = pts(m);
  if (!list.length) return '';
  const a = list[list.length - 1], d = diffOf(m);
  const flipped = !!state.flip[code];
  const sc = seriesScale(m);
  const w = 200, h = 52;
  const path = list.length > 1
    ? smoothPath(list.map((p, i) => ({ x: (i / (list.length - 1)) * w, y: h - ((p.v - sc.lo) / sc.span) * (h - 6) - 3 })))
    : '';
  return `<button class="mcard" type="button" data-action="flip" data-code="${code}"
      data-flipped="${flipped}" aria-pressed="${flipped}" aria-label="${esc(m.name)}：按回车或空格翻面看记录清单">
    <span class="mcard-inner">
      <span class="mface">
        <span class="cat"><i style="background:${m.color}"></i>${esc(m.cat)}</span>
        <span class="name">${esc(m.name)}</span>
        <span class="val">${dec(a.v, m.dec)}<small>${esc(m.unit)}</small></span>
        <span class="delta">${d === null ? '只有 1 次记录' : `与上次 <em>${d > 0 ? '+' : ''}${dec(d, m.dec)}</em>`} · ${esc(a.d)}</span>
        <span class="rec">${path ? `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="${path}" fill="none" stroke="${m.color}" stroke-width="1.6"/></svg>` : '<span class="hint">只有 1 次记录，暂不连线</span>'}</span>
        <span class="meta"><span>${m.refHigh ? `参考上限 ${m.refHigh}` : m.refLow ? `参考下限 ${m.refLow}` : '未登记参考范围'}</span><span class="hint">点卡片翻面 →</span></span>
      </span>
      <span class="mface back">
        <span class="cat"><i style="background:${m.color}"></i>卡背 · 记录清单</span>
        <span class="name">${esc(m.name)} · 全部 ${list.length} 次</span>
        <span class="count">${list.slice(-4).map((p) => `${p.d.slice(5)} ${dec(p.v, m.dec)}`).join(' · ')}</span>
        <span class="rec" style="margin-top:auto">单位 ${esc(m.unit)}${m.refHigh ? ` · 参考上限 ${m.refHigh}` : ''}</span>
        <span class="foot">来源：${esc(m.source)}<br>卡背也只列事实，不含判读</span>
      </span>
    </span>
  </button>`;
}

function stageBar(active) {
  const steps = [['preop', '术前减黄段', '1'], ['surgery', '手术段', '2'], ['followup', '术后功能段', '3']];
  return `<div class="stagebar" aria-label="三段病程">${steps.map(([k, t, n]) =>
    `<a href="#${k}" data-action="go" data-view="${k}" class="${active === k ? 'on' : ''}"><span class="num">${n}</span>${t}</a>`).join('')}
    <span>三段各自记录，不相加、不互相换算</span></div>`;
}

/* 点选读数条（R9）：只回源，不判读。空态也要占位，避免点开/收起时版面跳动。 */
function pinBar() {
  const p = state.pin;
  const m = p && MET[p.code];
  const pt = m && pts(m).find((x) => x.d === p.d);
  if (!m || !pt) {
    return `<div class="pinbar idle" role="status" aria-live="polite"><span class="pin-hint">点图上任意一个圆点，这里显示它的值、日期和出处（原样回源，不含判读）。</span></div>`;
  }
  return `<div class="pinbar" role="status" aria-live="polite">
      <span class="pin-dot" style="background:${m.color}"></span>
      <b>${esc(m.name)}</b>
      <span class="pin-val">${dec(pt.v, m.dec)} <em>${esc(m.unit)}</em></span>
      <span class="pin-meta">${esc(pt.d)}</span>
      <span class="pin-src">来源：${esc(m.source)}</span>
      <button class="pin-clear" type="button" data-action="pin-clear" aria-label="清除点选读数">清除</button>
    </div>`;
}

/* 36 号 §2.6：看板首卡的病程状态卡。
 * 四件：卡头 eyebrow（D+N · 距下一阶段）／大字天数（锚点日派生，不手填）／
 * 现状行（阶段原文 + 状态 + 下次日期与事项）／出口按钮排（主按钮进当前阶段核心页，
 * 副按钮打开疾病概要整页）。锚点 = 手术日（Day 0）。无锚点时整卡「待初始化」。 */
function statusCard() {
  const anchor = D.surgery && D.surgery.date;
  const primerBtn = '<button type="button" data-action="primer">疾病概要：壶腹部腺癌是什么？</button>';
  if (!anchor) {
    return `<section class="panel status-card" aria-label="病程状态卡">
      <span class="eyebrow">D+N 状态卡</span>
      <div class="day">待初始化</div>
      <p class="status-line">还没有锚点日（手术日）。先完成三步初始化，这里才会按天计算。</p>
      <div class="status-actions">
        <button class="primary" data-action="go" data-view="settings">开始三步初始化 →</button>
        ${primerBtn}
      </div>
    </section>`;
  }
  const n = dayGap(anchor, TODAY);
  const recovery = (D.bands || []).find((b) => b.kind === 'recovery');
  const inHospital = recovery && TODAY <= recovery.to;
  const stage = inHospital ? '手术段 · 术后住院' : '术后功能段 · 随访中';
  const next = (D.visits || []).filter((v) => v.planned && v.on >= TODAY)
    .sort((a, b) => a.on.localeCompare(b.on))[0];
  const nextLine = next ? `下次：${next.on}（${next.what}）` : '下次：暂无已排期事项';
  return `<section class="panel status-card" aria-label="病程状态卡">
    <span class="eyebrow">D+${n} 状态卡 · 距下次复查</span>
    <div class="day">第 ${n} 天</div>
    <p class="status-line">当前阶段：${esc(stage)} · 锚点 ${esc(anchor)}（手术日，Day 0）</p>
    <p class="status-line">${esc(nextLine)}</p>
    <div class="status-actions">
      <button class="primary" data-action="go" data-view="followup">看术后随访（按次）→</button>
      ${primerBtn}
    </div>
  </section>`;
}

function vDash() {
  const [t0, t1] = domainRange();
  const { svg } = chartSVG(t0, t1);
  const cats = D.catOrder;
  const tb = last(MET.tbil), ca = last(MET.ca199), w = last(MET.weight);
  const sug = D.surgery;
  return pageHead('一图秀') + stageBar(null) + statusCard() + `
    <div class="notice"><b>这一屏只回答「什么时候记录了什么」。</b>
      ① 三条线量纲不同（胆红素 μmol/L、CA19-9 U/mL、体重 kg），各按自身「全部记录」的最小值–最大值归一化，
      纵向位置<b>不代表数值可比</b>；② 治疗条与事件竖线只表示"哪天发生了什么"；
      ③ 任何"好没好"的问题，这一屏没有答案。</div>

    <div class="overview">
      <aside class="rail">
        <h3>选指标（最多 4 条）</h3>
        ${cats.map((c) => `<div class="cat-label">${esc(c)}</div>
          ${D.metricOrder.map((k) => MET[k]).filter((m) => m && m.cat === c).map((m) => `
            <label class="metric-pick"><input type="checkbox" data-action="pick" data-code="${m.id}" ${state.sel.includes(m.id) ? 'checked' : ''}>
              <i style="background:${m.color}"></i><span>${esc(m.name)}</span><small>${pts(m).length}</small></label>`).join('')}`).join('')}
        <div class="small-note">未检测与缺失不会被插值补点。</div>
      </aside>
      <div class="timeline-main">
        <section class="chart-panel">
          <div class="chart-top">
            <div><h2>指标 · 治疗 · 事件 对齐时间轴</h2>
              <p class="muted" style="font-size:11.5px">${esc(D.profile.name)} · ${esc(D.profile.tag)}</p></div>
            <div class="chips">
              ${[['all', '全部'], ['6m', '近 6 个月'], ['3m', '近 3 个月']].map(([k, l]) =>
                `<button class="chip" data-action="range" data-range="${k}" aria-pressed="${state.range === k}">${l}</button>`).join('')}
            </div>
          </div>
          <div class="legend">
            ${state.sel.filter((c) => MET[c]).map((c) => `<span><i style="background:${MET[c].color}"></i><b>${esc(MET[c].short)}</b> <span class="range">${esc(MET[c].unit)}</span></span>`).join('')}
            <label class="legend-toggle"><input type="checkbox" data-action="toggle-bands" ${state.bands ? 'checked' : ''}>显示治疗条</label>
          </div>
          ${state.bands ? `<div class="band-legend">${D.bands.map((b) => {
            const c = { drain: '#a9761c', surgery: '#5c7a3b', recovery: '#8b5e83' }[b.kind] || '#5c7a3b';
            return `<span><i style="background:${c}"></i>${esc(b.label)} <em>${esc(b.from)}${b.from === b.to ? '' : ' → ' + esc(b.to)}</em></span>`;
          }).join('')}</div>` : ''}
          <div class="chart-wrap">${svg}</div>
          ${pinBar()}
        </section>

        <div class="metric-group">
          <div class="metric-group-head"><h3>指标卡</h3><span>点卡片或按回车翻面，背面是记录清单</span></div>
          <div class="metric-grid">${state.sel.filter((c) => MET[c]).map(mcard).join('')}</div>
        </div>

        <section class="panel">
          <h3>四个关键数字（都带日期与来源）</h3>
          <div class="kv">
            <div><span>最近总胆红素</span><b>${tb ? dec(tb.v) + ' ' + MET.tbil.unit : '—'}</b><em>${tb ? tb.d : ''}</em></div>
            <div><span>最近 CA19-9</span><b>${ca ? dec(ca.v) + ' ' + MET.ca199.unit : '—'}</b><em>${ca ? ca.d : ''}</em></div>
            <div><span>最近体重</span><b>${w ? dec(w.v, 1) + ' kg' : '—'}</b><em>${w ? w.d : ''}</em></div>
            <div><span>手术日距今</span><b>${dayGap(sug.date, TODAY)} 天</b><em>${sug.date} → ${TODAY}</em></div>
          </div>
          <p class="small-note">这四个数字全部是算术结果：取最近一次记录、或两个日期相减。</p>
        </section>
      </div>
    </div>`;
}

/* ==========================================================================
   我的病
   ========================================================================== */
function vDisease() {
  const sub = state.sub || '定性依据';
  const tabs = SUBS.disease.map((s, i) => `<button class="chip" data-action="sub" data-sub="${s}" aria-pressed="${sub === s}">2.${i + 1} ${s}</button>`).join('');
  let body = '';
  if (sub === '定性依据') {
    body = `<div class="notice"><b>这四份文件是"定性"的全部依据。</b>每一条都能点开看报告原句。工作台不判断这些依据够不够。</div>
      ${D.evidence.map((e) => `<div class="panel ev">
        <div class="ev-head"><b>${esc(e.kind)}</b><span>${esc(e.date)} · ${esc(e.org)}</span></div>
        <blockquote>“${esc(e.quote)}”</blockquote>
        <p class="small-note">出处：${esc(e.path)}</p>
      </div>`).join('')}
      ${verdictBox('这些依据说明什么，以及还需不需要再取一次组织')}`;
  } else if (sub === '病理与亚型') {
    const p = D.pathology;
    body = `<div class="panel">
        <h3>病理报告写了什么（原句照录）</h3>
        <table class="prof-table">
          <tr><th>亚型</th><td>${esc(p.subtypeLabel)}</td></tr>
          <tr><th>分化</th><td>${esc(p.grade)}（报告原文）</td></tr>
          <tr><th>浸润</th><td>${esc(p.invasion)}</td></tr>
          <tr><th>切缘</th><td>${esc(p.margin)}</td></tr>
          <tr><th>淋巴结</th><td>${esc(p.nodes)}</td></tr>
        </table>
        <p class="small-note">来源：${esc(p.source)}</p>
      </div>
      <div class="panel">
        <h3>免疫组化（只列报告上有的）</h3>
        <div class="ihc">${p.ihc.map((x) => `<div><span>${esc(x.name)}</span><b>${esc(x.value)}</b><em>${esc(x.note)}</em></div>`).join('')}</div>
        <p class="small-note">本台不由免疫组化反推亚型；缺失项写「未做」或「报告未列」，不写阴性。</p>
      </div>
      <div class="panel"><h3>亚型这三个词是什么意思（解释层）</h3>
        <p><b>肠型</b>：形态与免疫表型接近肠道来源的腺癌，常见 CK20(+) / CDX2(+) / MUC2(+)。
        <b>胰胆型</b>：接近胰胆管来源，常见 CK7(+) / MUC1(+) / MUC5AC(+)。
        <b>混合型</b>：两套特征都有。这个分类是病理医生按镜下形态与染色结果做的，工具不代判。</p>
        <p class="small-note">来源：NCCN Guidelines · Ampullary Adenocarcinoma · 未取得原件，据二次来源 · 页码待核</p>
      </div>
      ${verdictBox('这个亚型对你意味着什么')}`;
  } else if (sub === '分期原文') {
    body = `<div class="notice"><b>三套分期并列，各自照录，互不换算。</b>壶腹（AJCC 8th）按浸润深度分 T1a/T1b/T2/T3/T4；
      胆管与胰腺各是另一张表。这张页面不给你"相当于几期"，因为那需要把三张表混起来。</div>
      <div class="stagegrid">
        ${D.stages.map((s, i) => `<div class="stagecard ${s.written !== '未记录' ? 'rec' : 'isempty'}">
          <h4>${esc(s.system)}</h4>
          <div class="written">${esc(s.written)}</div>
          ${s.who ? `<p class="small-note">谁记录的：${esc(s.who)}</p>` : `<p class="small-note">本次未按这一套记录</p>`}
          ${s.basis ? `<p class="small-note">${esc(s.basis)}</p>` : ''}
          ${s.original ? `<div class="orig">${esc(s.original)}</div>` : ''}
          ${s.cite ? `<p class="cite">${esc(s.cite)}</p>` : ''}
        </div>`).join('')}
      </div>
      <div class="panel"><h3>为什么壶腹要单独一张表</h3>
        <p>T 的界标是"浸润到哪一层"，从里到外依次是：壶腹本身 → 十二指肠黏膜下层 → 十二指肠固有肌层 → 胰腺（≤0.5 cm / >0.5 cm）。
        胰腺癌的界标是"是否超越胰腺、是否侵犯血管"，胆管癌的界标是"管壁层次与肝侧范围"。
        三张表量的是不同东西，所以本台并列展示，不做换算。</p>
        <p class="small-note">来源：AJCC Cancer Staging Manual, 8th ed. · 未取得原件，据二次来源 · 页码待核</p>
      </div>
      ${verdictBox('你这个分期算早期还是晚期')}`;
  } else {
    body = `<div class="notice"><b>这一页只做一件事：把四份报告的原句放在一起。</b>
      "是不是壶腹原发"是病理医生结合镜下形态与免疫组化做的判断，不是本台能下的结论。</div>
      <div class="panel"><h3>四份报告并列</h3>
        ${D.evidence.filter((e) => /病理|影像|内镜/.test(e.kind)).map((e) => `
          <div class="ev"><div class="ev-head"><b>${esc(e.kind)}</b><span>${esc(e.date)} · ${esc(e.org)}</span></div>
          <blockquote>“${esc(e.quote)}”</blockquote></div>`).join('')}
        <p class="small-note">按下拉框"这是哪一种"需要术前影像 + 术中探查 + 病理三方面一致；本台不提供该判断。</p>
      </div>
      <div class="panel"><h3>四个候选（解释层：各自指什么）</h3>
        <table class="prof-table">
          <tr><th>壶腹原发</th><td>肿瘤中心位于十二指肠大乳头，主体在壶腹区</td></tr>
          <tr><th>胰头癌累及</th><td>主体在胰头，向壶腹方向侵犯</td></tr>
          <tr><th>远端胆管癌</th><td>主体在胆总管下段，向壶腹方向生长</td></tr>
          <tr><th>十二指肠癌</th><td>主体在十二指肠黏膜，累及乳头</td></tr>
        </table>
        <p class="small-note">来源：NCCN Guidelines · Ampullary Adenocarcinoma · 未取得原件，据二次来源 · 页码待核</p>
      </div>
      ${verdictBox('我这个到底是壶腹原发还是胰头癌累及')}`;
  }
  return pageHead('我的病', `<div class="chips">${tabs}</div>`) + `<p class="page-sub">${esc(SUBTITLE.disease)}</p>` + body;
}

/* ==========================================================================
   术前减黄
   ========================================================================== */
function vPreop() {
  const sub = state.sub || '引流事件';
  const tabs = SUBS.preop.map((s, i) => `<button class="chip" data-action="sub" data-sub="${s}" aria-pressed="${sub === s}">3.${i + 1} ${s}</button>`).join('');
  let body = '';
  const d1 = D.drains[0];
  const opDay = D.surgery.date;
  if (sub === '引流事件') {
    body = `<div class="panel">
        <h3>引流事件（做过什么，不是"效果怎样"）</h3>
        ${D.drains.filter((d) => d.date).map((d) => `<div class="ev">
          <div class="ev-head"><b>${esc(d.modality)}</b><span>${esc(d.date)} · ${esc(d.by)}</span></div>
          <p>${esc(d.detail)}</p>
          <p class="small-note">${esc(d.note)} · ${esc(d.status)}</p>
        </div>`).join('')}
        ${D.drains.filter((d) => !d.date).map((d) => `<p class="small-note">${esc(d.modality)}：${esc(d.note)}</p>`).join('')}
      </div>
      <div class="panel"><h3>支架类型（解释层）</h3>
        <p>ERCP 途径常用塑料支架与金属支架；PTCD 是经皮经肝穿刺引流。塑料支架的通畅期通常短于金属支架，
        两者各有适应情形，选择由内镜/介入医生按梗阻部位与计划决定。</p>
        <p class="small-note">来源：NCCN Guidelines · Ampullary Adenocarcinoma · 未取得原件，据二次来源 · 页码待核</p>
      </div>
      ${verdictBox('这个支架放得对不对、什么时候该换')}`;
  } else if (sub === '胆红素线') {
    const [t0, t1] = [Date.parse('2026-01-01'), Date.parse('2026-03-15')];
    const rows = pts(MET.tbil).filter((p) => inDomain(p.d, t0, t1));
    body = `<div class="notice"><b>胆红素只属于"减黄段"。</b>它与 CA19-9 不是同一种量纲，所以两条线各自归一化，不在同一根轴上比高低。</div>
      <div class="panel">
        <h3>引流日之后每一次抽血</h3>
        <table class="prof-table">
          <tr><th>日期</th><th>总胆红素</th><th>距引流第几天</th><th>与上次差</th></tr>
          ${rows.map((p, i) => `<tr>
            <td>${esc(p.d)}</td><td>${dec(p.v)} μmol/L</td>
            <td>${p.d < d1.date ? '引流前' : '第 ' + (dayGap(d1.date, p.d) + 1) + ' 天'}</td>
            <td>${i === 0 ? '—' : (p.v - rows[i - 1].v > 0 ? '+' : '') + (p.v - rows[i - 1].v)}</td></tr>`).join('')}
        </table>
        <p class="small-note">"距引流第几天"与"与上次差"都是算术。手术日 ${esc(opDay)}，距今 ${dayGap(opDay, TODAY)} 天。</p>
      </div>
      <div class="chart-panel"><div class="chart-wrap">${chartSVG(t0, t1).svg}</div></div>
      ${verdictBox('降到多少才算可以手术')}`;
  } else {
    body = `<div class="panel">
        <h3>从引流日到手术日（时间轴）</h3>
        <div class="steps">
          <span class="st on"><span class="n">1</span>${esc(d1.date)} 置入支架</span><span class="arw">→</span>
          <span class="st"><span class="n">2</span>${dayGap(d1.date, opDay)} 天后手术</span><span class="arw">→</span>
          <span class="st"><span class="n">3</span>${esc(opDay)} 胰十二指肠切除</span>
        </div>
        <table class="prof-table">
          <tr><th>术前检查</th><th>状态</th><th>出处</th></tr>
          <tr><td>增强 CT（腹盆）</td><td>已做 2026-01-05</td><td>影像号 CT260105-771</td></tr>
          <tr><td>总胆红素 / 肝功</td><td>末次 2026-02-09（34 μmol/L）</td><td>化验单原件</td></tr>
          <tr><td>营养评估</td><td>${na('病历中未见独立记录')}</td><td>—</td></tr>
          <tr><td>麻醉门诊</td><td>未记录</td><td>—</td></tr>
        </table>
      </div>
      <div class="panel"><h3>这段时间出现过的事件</h3>
        <div class="ev"><div class="ev-head"><b>术后当天腹痛</b><span>2026-01-12 · 外院消化内科病程记录</span></div>
          <p>原话记录：支架置入后诉上腹胀痛，予观察。</p></div>
        <div class="ev"><div class="ev-head"><b>发热</b><span>2026-01-24 · 家属自述（未就诊）</span></div>
          <p>家属记录：晚 8 点体温 37.8℃，次日自行降至 37.0℃，未就诊。</p>
          <p class="small-note">自述记录与病历记录不合并，来源不同就分行。</p></div>
      </div>
      ${verdictBox('这段时间的情况要不要提前手术或延后手术')}`;
  }
  return pageHead('术前减黄', `<div class="chips">${tabs}</div>`) + `<p class="page-sub">${esc(SUBTITLE.preop)}</p>` + body;
}

/* ==========================================================================
   手术治疗
   ========================================================================== */
function vSurgery() {
  const sub = state.sub || '手术记录';
  const tabs = SUBS.surgery.map((s, i) => `<button class="chip" data-action="sub" data-sub="${s}" aria-pressed="${sub === s}">4.${i + 1} ${s}</button>`).join('');
  const s = D.surgery;
  let body = '';
  if (sub === '手术记录') {
    body = `<div class="panel">
        <h3>${esc(s.type)}</h3>
        <table class="prof-table">
          <tr><th>手术日</th><td>${esc(s.date)}</td></tr>
          <tr><th>术者团队</th><td>${esc(s.team)}</td></tr>
          <tr><th>切缘</th><td>${esc(s.margin)}</td></tr>
          <tr><th>淋巴结</th><td>${esc(s.nodes)}</td></tr>
          <tr><th>重建</th><td>${esc(s.recon)}</td></tr>
        </table>
      </div>
      <div class="panel"><h3>PD 与 PPPD 的区别（解释层）</h3>
        <p>两者切除范围相同（胰头、十二指肠、胆囊、胆总管下段、部分胃或幽门）；差别在是否保留幽门。
        保留幽门（PPPD）可能缩短手术时间、减少部分营养问题，但胃排空延迟的比例在部分研究中更高。选择由外科按病情决定。</p>
        <p class="small-note">来源：NCCN Guidelines · Ampullary Adenocarcinoma · 未取得原件，据二次来源 · 页码待核</p>
      </div>
      ${verdictBox('这次手术做得够不够彻底')}`;
  } else if (sub === '病理分期') {
    body = `<div class="notice"><b>pTNM 只照录。</b>报告写什么就是什么，本台不补、不推。</div>
      <div class="stagegrid">${D.stages.map((x) => `<div class="stagecard ${x.written !== '未记录' ? 'rec' : 'isempty'}">
        <h4>${esc(x.system)}</h4><div class="written">${esc(x.written)}</div>
        ${x.who ? `<p class="small-note">${esc(x.who)}</p>` : '<p class="small-note">未按这一套记录</p>'}
      </div>`).join('')}</div>
      ${verdictBox('这个 pTNM 属于哪一期、要不要做辅助治疗')}`;
  } else {
    body = `<div class="panel"><h3>住院事件（${esc(s.los)}）</h3>
        <table class="prof-table">
          <tr><th>引流管 / 胃管</th><th>术后第 3 天</th><th>术后第 5 天</th><th>拔除日</th></tr>
          ${s.tubes.map((t) => `<tr><td>${esc(t.site)}</td><td>${esc(t.day3)}</td><td>${esc(t.day5)}</td><td>${esc(t.removed)}</td></tr>`).join('')}
        </table>
        <p class="small-note">引流量是记录值，不是"好/不好"的判据。</p>
      </div>
      <div class="panel"><h3>住院期间报告记录的事件</h3>
        ${D.complications.filter((c) => c.date).map((c) => `<div class="ev">
          <div class="ev-head"><b>${esc(c.type)} · ${esc(c.grade)}</b><span>${esc(c.date)} · ${esc(c.by)}</span></div>
          <p>${esc(c.detail)}</p></div>`).join('')}
      </div>
      ${verdictBox('这次住院算顺利吗')}`;
  }
  return pageHead('手术治疗', `<div class="chips">${tabs}</div>`) + `<p class="page-sub">${esc(SUBTITLE.surgery)}</p>` + body;
}

/* ==========================================================================
   术后并发症
   ========================================================================== */
function vComp() {
  const sub = state.sub || '并发症卡';
  const tabs = SUBS.comp.map((s, i) => `<button class="chip" data-action="sub" data-sub="${s}" aria-pressed="${sub === s}">5.${i + 1} ${s}</button>`).join('');
  let body = '';
  if (sub === '并发症卡') {
    body = `<div class="notice"><b>分级是外科按国际标准写进病历的，本台只照录。</b>你看到的"B 级"是他们的记录，不是本台的判断。</div>
      ${D.complications.map((c) => `<div class="panel">
        <div class="ev-head"><b>${esc(c.type)}</b><span>${c.date ? esc(c.date) + ' · ' + esc(c.by) : '无记录'}</span></div>
        <p style="margin:8px 0 4px"><b>报告原文分级：</b>${c.grade ? esc(c.grade) : na('未记录')}</p>
        <p class="small-note">${esc(c.detail)}</p>
        ${c.scale ? `<button class="text-button" data-action="scale" data-id="${c.id}">这个分级是谁定的？→</button>` : ''}
      </div>`).join('')}
      ${verdictBox('这些并发症算严重吗、会不会留后遗症')}`;
  } else if (sub === '分级解释') {
    body = D.complications.filter((c) => c.scale).map((c) => `<div class="panel">
        <h3>${esc(c.type)}：${esc(c.scale)}</h3>
        <p>${esc(c.scaleText)}</p>
        <p class="small-note">来源：${esc(c.cite)}</p>
      </div>`).join('') + verdictBox('我这份报告上的分级意味着什么');
  } else {
    body = `<div class="panel"><h3>处理与随访（照病程记录）</h3>
        <table class="prof-table">
          <tr><th>日期</th><th>记录</th><th>出处</th></tr>
          <tr><td>2026-02-17</td><td>引流液淀粉酶 1 240 U/L；继续引流、肠外营养</td><td>病程记录</td></tr>
          <tr><td>2026-02-24</td><td>仍需胃管减压；进食流质后呕吐 1 次</td><td>病程记录</td></tr>
          <tr><td>2026-02-25</td><td>拔除胃管</td><td>护理记录</td></tr>
          <tr><td>2026-03-01</td><td>出院</td><td>出院小结</td></tr>
        </table>
      </div>
      <div class="panel"><h3>出院医嘱（原文条目化）</h3>
        <ul class="plain"><li>低脂饮食，少量多餐</li><li>胰酶制剂随餐服用（具体剂量见出院小结）</li>
        <li>2 周后门诊复查</li><li>出现发热、腹痛加重、引流液增多时就诊</li></ul>
        <p class="small-note">"出现发热时就诊"是出院小结的原话，不是本台给的分诊阈值。</p>
      </div>
      ${verdictBox('现在这些症状要不要紧')}`;
  }
  return pageHead('术后并发症', `<div class="chips">${tabs}</div>`) + `<p class="page-sub">${esc(SUBTITLE.comp)}</p>` + body;
}

/* ==========================================================================
   指标趋势 / 营养与胰酶
   ========================================================================== */
function metricTable() {
  return `<div class="panel"><h3>全部指标 · 最近一次</h3>
    <table class="prof-table">
      <tr><th>指标</th><th>最近值</th><th>日期</th><th>与上次差</th><th>记录数</th><th>来源</th></tr>
      ${D.metricOrder.map((k) => MET[k]).filter(Boolean).map((m) => {
        const a = last(m), d = diffOf(m);
        return `<tr><td>${esc(m.name)} <span class="lay">${esc(m.unit)}</span></td>
          <td><b>${dec(a.v, m.dec)}</b></td><td>${esc(a.d)}</td>
          <td>${d === null ? '—' : (d > 0 ? '+' : '') + dec(d, m.dec)}</td>
          <td>${pts(m).length}</td><td class="lay">${esc(m.source)}</td></tr>`;
      }).join('')}
    </table>
    <p class="small-note">差值是减法。表格里没有"正常 / 异常"这一列，因为参考范围随检验科与设备不同。</p>
  </div>`;
}
function vMetrics() {
  const sub = state.sub || '指标总表';
  const tabs = SUBS.metrics.map((s, i) => `<button class="chip" data-action="sub" data-sub="${s}" aria-pressed="${sub === s}">6.${i + 1} ${s}</button>`).join('');
  let body = '';
  if (sub === '指标总表') body = metricTable();
  else if (sub === '单指标放大') body = `<div class="panel">
      <h3>单条指标的每一次记录</h3>
      ${D.metricOrder.map((k) => MET[k]).filter(Boolean).map((m) => `
        <div class="mini-line"><b>${esc(m.name)}</b>
          <span class="vals">${pts(m).map((p) => `${p.d.slice(5)} <em>${dec(p.v, m.dec)}</em>`).join(' · ')}</span></div>`).join('')}
      <p class="small-note">单条指标可以并排看数值，因为同一单位；跨指标不能并排比，见一图秀。</p>
    </div>`;
  else body = `<div class="panel"><h3>分组对照</h3>
      <p>按段分组，看每段内的记录条数与首末值。分组是为了分开叙述，不是为了比较优劣。</p>
      <table class="prof-table"><tr><th>段</th><th>指标</th><th>首值</th><th>末值</th><th>记录数</th></tr>
      ${[['术前减黄段', '2026-01-01', '2026-02-10'], ['手术后', '2026-02-11', '2026-10-26']].map(([label, a, b]) => {
        const list = pts(MET.tbil).filter((p) => p.d >= a && p.d <= b);
        return `<tr><td>${label}</td><td>总胆红素</td><td>${list.length ? list[0].v : '—'}</td><td>${list.length ? list[list.length - 1].v : '—'}</td><td>${list.length}</td></tr>`;
      }).join('')}</table>
      <p class="small-note">首末值与条数都是算术，不含评价。</p>
    </div>`;
  return pageHead('指标趋势', `<div class="chips">${tabs}</div>`) + `<p class="page-sub">${esc(SUBTITLE.metrics)}</p>` + body;
}

function vNutrition() {
  const sub = state.sub || '体重线';
  const tabs = SUBS.nutrition.map((s, i) => `<button class="chip" data-action="sub" data-sub="${s}" aria-pressed="${sub === s}">7.${i + 1} ${s}</button>`).join('');
  let body = '';
  if (sub === '体重线') {
    const list = pts(MET.weight);
    body = `<div class="panel"><h3>体重（住院基线 + 每周自测）</h3>
        <table class="prof-table"><tr><th>日期</th><th>体重</th><th>与上次差</th><th>来源</th></tr>
        ${list.map((p, i) => `<tr><td>${esc(p.d)}</td><td>${dec(p.v, 1)} kg</td><td>${i === 0 ? '—' : (p.v - list[i - 1].v > 0 ? '+' : '') + dec(p.v - list[i - 1].v, 1)}</td><td>${i < 3 ? '住院/门诊' : '自测'}</td></tr>`).join('')}</table>
        <p class="small-note">手术前后最大差值：${dec(Math.max(...list.map((p) => p.v)) - Math.min(...list.map((p) => p.v)), 1)} kg（算术）。</p>
      </div>${chartSVG(Date.parse('2026-01-01'), Date.parse('2026-10-26')).svg ? '' : ''}
      <div class="panel"><h3>进食记录（自述）</h3>
        <p>每天记录：餐次 / 大致量 / 有没有恶心。示例：3 餐 + 2 次加餐；每餐约半碗。</p>
        <p class="small-note">自述记录与化验记录分开存，不合并成"营养状况"一个分数。</p>
      </div>
      ${verdictBox('体重掉这么多算不算营养不良')}`;
  } else if (sub === '胰酶记录') {
    body = `<div class="panel"><h3>胰酶制剂（照处方原文）</h3>
        <table class="prof-table"><tr><th>开始日期</th><th>药名（原文）</th><th>用法（原文）</th><th>记录人</th></tr>
        <tr><td>2026-02-20</td><td>胰酶肠溶胶囊</td><td>随餐 2 粒，加餐 1 粒</td><td>出院医嘱</td></tr>
        <tr><td>2026-06-18</td><td>胰酶肠溶胶囊</td><td>随餐 2 粒（未调整）</td><td>门诊记录</td></tr></table>
        <p class="small-note">剂量与调整一律以处方原文为准，本台不计算、不建议。</p>
      </div>
      <div class="panel"><h3>胰腺外分泌不足（PEI）是什么（解释层）</h3>
        <p>胰十二指肠切除后，胰腺外分泌组织减少、食物与胰液混合的路径改变，可能出现脂肪泻、体重下降、腹胀。
        诊断通常结合粪便弹性蛋白酶、症状与营养指标，由医生判断；治疗是胰酶替代，剂量由医生按进食量调整。</p>
        <p class="small-note">来源：NCCN Guidelines · Ampullary Adenocarcinoma · 未取得原件，据二次来源 · 页码待核</p>
      </div>
      ${verdictBox('我现在的胰酶够不够、要不要加量')}`;
  } else {
    const g = pts(MET.glu), h = pts(MET.hba1c);
    body = `<div class="panel"><h3>血糖与 HbA1c</h3>
        <table class="prof-table"><tr><th>日期</th><th>空腹血糖</th><th>HbA1c</th></tr>
        ${Array.from(new Set([...g.map((p) => p.d), ...h.map((p) => p.d)])).sort().map((d) => {
          const gg = g.find((p) => p.d === d), hh = h.find((p) => p.d === d);
          return `<tr><td>${esc(d)}</td><td>${gg ? dec(gg.v, 1) + ' mmol/L' : '—'}</td><td>${hh ? dec(hh.v, 1) + ' %' : '—'}</td></tr>`;
        }).join('')}</table>
        <p class="small-note">缺测写「—」，不补值、不外推。</p>
      </div>
      <div class="panel"><h3>术后新发糖尿病是怎么回事（解释层）</h3>
        <p>胰腺切除后胰岛素分泌可能减少，部分人术后出现血糖升高或新诊断糖尿病，通常由内分泌科评估与随访。
        本台只记录化验值，不判断是否达到诊断标准。</p>
        <p class="small-note">来源：NCCN Guidelines · Ampullary Adenocarcinoma · 未取得原件，据二次来源 · 页码待核</p>
      </div>
      ${verdictBox('这个血糖值算不算糖尿病、要不要吃药')}`;
  }
  return pageHead('营养与胰酶', `<div class="chips">${tabs}</div>`) + `<p class="page-sub">${esc(SUBTITLE.nutrition)}</p>` + body;
}

function vFollowup() {
  const sub = state.sub || '复查日历';
  const tabs = SUBS.followup.map((s, i) => `<button class="chip" data-action="sub" data-sub="${s}" aria-pressed="${sub === s}">8.${i + 1} ${s}</button>`).join('');
  let body = '';
  if (sub === '复查日历') {
    body = `<div class="panel"><h3>已发生的与已排期的</h3>
        <table class="prof-table"><tr><th>日期</th><th>科室</th><th>记录</th><th>状态</th></tr>
        ${D.visits.slice().sort((a, b) => a.on.localeCompare(b.on)).map((v) => `<tr>
          <td>${esc(v.on)}</td><td>${esc(v.dept)}</td><td>${esc(v.what)}</td>
          <td>${v.planned ? pill('已排期', 'warn') : pill('已发生')}</td></tr>`).join('')}</table>
        <p class="small-note">"已排期"的日期来自医嘱原文；本台不替你排日期，也不推算下次复查该隔多久。</p>
      </div>
      ${verdictBox('下次复查应该安排在什么时候')}`;
  } else if (sub === '影像对照') {
    body = `<div class="notice"><b>两份报告左右并列，原话不动。</b>本台不生成"变大/变小"的结论，只把两段原文与尺寸原值放在一起。</div>
      ${D.imaging.map((im) => `<div class="panel">
        <div class="ev-head"><b>${esc(im.modality)} · ${esc(im.date)}</b><span>${esc(im.org)}</span></div>
        <blockquote>“${esc(im.quote)}”</blockquote>
        <p class="small-note">病灶尺寸原值：${im.lesions.map((l) => `${esc(l.site)} ${esc(l.size)}`).join('；')}</p>
      </div>`).join('')}
      ${verdictBox('那个低密度影是什么、要不要紧')}`;
  } else {
    const list = pts(MET.ca199);
    body = `<div class="panel"><h3>肿瘤标志物与影像日期并列</h3>
        <table class="prof-table"><tr><th>日期</th><th>CA19-9</th><th>同期影像</th></tr>
        ${list.map((p) => {
          const im = D.imaging.find((x) => Math.abs(dayGap(p.d, x.date)) <= 5);
          return `<tr><td>${esc(p.d)}</td><td>${dec(p.v)} U/mL</td><td>${im ? esc(im.date) + ' ' + esc(im.modality) : '—'}</td></tr>`;
        }).join('')}</table>
        <p class="small-note">最近三次：${list.slice(-3).map((p) => dec(p.v)).join(' → ')} U/mL（${list.slice(-3).map((p) => p.d.slice(5)).join(' / ')}）。这是数值抄录与间隔天数，不是趋势判断。</p>
      </div>
      ${verdictBox('这个变化说明什么问题')}`;
  }
  return pageHead('随访与影像', `<div class="chips">${tabs}</div>`) + `<p class="page-sub">${esc(SUBTITLE.followup)}</p>` + body;
}

/* ==========================================================================
   临床试验三步（35 号 v2）
   ========================================================================== */
function factMap() {
  const m = {};
  for (const f of D.matchProfile) if (f.confirmed && f.on) m[f.key] = f.value;
  return m;
}

/* 分层命中：结构化 / 文本 / 宽口径。expect 是"条件原文要能对上什么"，不是资格判定。 */
function evalCrit(c, facts) {
  const v = facts[c.key];
  if (v === undefined) return { state: 'unknown', why: '档案里没有这一项（或你取消了它的参与）' };
  const ex = c.expect || '';
  if (ex.startsWith('contain:')) {
    const needle = ex.slice(8);
    return v.includes(needle) ? { state: 'hit', why: `档案「${v}」含「${needle}」` } : { state: 'miss', why: `档案「${v}」不含「${needle}」` };
  }
  if (ex.startsWith('have:')) {
    const k = ex.slice(5);
    const bad = /未检测|未做|未知/.test(v);
    return bad ? { state: 'unknown', why: `档案「${v}」，没有可对上的结果` } : { state: 'hit', why: `档案「${v}」` };
  }
  if (ex === 'age_ge_18') {
    const n = parseInt(v, 10);
    return n >= 18 ? { state: 'hit', why: `档案「${v}」≥18` } : { state: 'miss', why: `档案「${v}」<18` };
  }
  if (ex === 'lines_ge_1') {
    return /^1|^2|^3/.test(v) ? { state: 'hit', why: `档案「${v}」` } : { state: 'miss', why: `档案「${v}」，条件要求至少 1 线` };
  }
  if (ex === 'stage_pT2N1') {
    return /pT2|pT3|pT4|N1|N2/.test(v) ? { state: 'hit', why: `档案「${v}」含 pT2/T3/T4 或 N+` } : { state: 'miss', why: `档案「${v}」不含 pT2–T4 且非 N+` };
  }
  if (ex === 'tbil_le_1_5uln') {
    const m = /总胆红素\s*([\d.]+)/.exec(v);
    if (!m) return { state: 'unknown', why: '档案里没有可解析的总胆红素值' };
    const ratio = Number(m[1]) / 21;
    return ratio <= 1.5 ? { state: 'hit', why: `档案总胆红素 ${m[1]} μmol/L = ${ratio.toFixed(2)}×ULN（ULN 取 21）` }
      : { state: 'miss', why: `档案总胆红素 ${m[1]} μmol/L = ${ratio.toFixed(2)}×ULN（ULN 取 21）` };
  }
  if (ex.startsWith('text:')) {
    const kw = ex.slice(5);
    return v.includes(kw) ? { state: 'hit', why: `文本命中「${kw}」` } : { state: 'unknown', why: '文本条件无法自动核对，需人工读全文' };
  }
  return { state: 'unknown', why: '条件写法本台不认识，需人工读全文' };
}

/* 透明计分（展示层，不落库）：瘤种 +15（专属）/ +5（宽口径）；结构化每项 +30 上限 60；文本每项 +10 上限 20 */
function scoreTrial(t, facts) {
  const evals = t.criteria.map((c) => ({ c, r: evalCrit(c, facts) }));
  const struct = evals.filter((e) => e.c.layer === 'struct');
  const text = evals.filter((e) => e.c.layer === 'text');
  const structHit = struct.filter((e) => e.r.state === 'hit').length;
  const textHit = text.filter((e) => e.r.state === 'hit').length;
  const tumorPart = t.tumorScope === 'specific' ? 15 : 5;
  const structPart = Math.min(60, structHit * 30);
  const textPart = Math.min(20, textHit * 10);
  const total = tumorPart + structPart + textPart;
  const hardMiss = struct.some((e) => e.r.state === 'miss');
  const unknown = evals.filter((e) => e.r.state === 'unknown').length;
  const status = hardMiss ? 'unmatched' : (total > 0 ? 'match' : 'unmatched');
  return { evals, total, status, unknown, parts: { tumorPart, structPart, textPart } };
}

function trialCard(t) {
  const facts = factMap();
  const s = scoreTrial(t, facts);
  const notes = s.evals.map((e) => {
    const mk = e.r.state === 'hit' ? '✓' : e.r.state === 'miss' ? '✕' : '?';
    const cls = e.r.state === 'hit' ? 'hit' : e.r.state === 'miss' ? 'miss' : 'unk';
    return `<li><span class="mk ${cls}" aria-hidden="true">${mk}</span><span><b>${esc(e.c.text)}</b> —— ${esc(e.r.why)}</span></li>`;
  }).join('');
  const statusText = s.status === 'match'
    ? `命中的条件 ${s.evals.filter((e) => e.r.state === 'hit').length} 项${s.unknown ? `，${s.unknown} 项待人工核对` : ''}`
    : '无法自动匹配 —— 有结构化条件与档案对不上，需人工读全文';
  return `<article class="trialcard" data-trial="${esc(t.key)}" data-status="${s.status}">
    <h4>${esc(t.title)}</h4>
    <div class="meta"><span>${esc(t.key)}</span><span>${esc(t.phase)}</span><span>${esc(t.status)}</span><span>${esc(t.sponsor)}</span></div>
    ${t.tumorScope === 'basket' ? `<div class="basket"><b>宽口径命中（basket）。</b>${esc(t.basketText)}</div>` : ''}
    <p style="margin:6px 0 0"><b>瘤种口径：</b>${esc(t.tumor)}</p>
    <div class="score" data-score="${s.total}">
      <span class="num">${s.total}</span>
      <span class="lbl">匹配分 ${s.total}（字段重合度参考分，非入组资格）</span>
      <span class="bar" aria-hidden="true"><i style="width:${s.total}%"></i></span>
    </div>
    <p class="small-note">${statusText}。分数构成：瘤种 ${s.parts.tumorPart} + 结构化 ${s.parts.structPart}（每项 30，上限 60）+ 文本 ${s.parts.textPart}（每项 10，上限 20）。</p>
    <ul class="notes">${notes}</ul>
    <div class="row-actions">
      <button class="text-button" data-action="trial-detail" data-key="${esc(t.key)}">看这条的登记信息 →</button>
      <button class="text-button" data-action="trial-save" data-key="${esc(t.key)}">收藏（只记 trial_key 与时间）</button>
    </div>
  </article>`;
}

function vTrial() {
  const step = state.trial.step;
  const tabs = ['profile', 'search', 'match'];
  const stepBar = `<div class="steps" aria-label="临床试验三步">
    ${[['profile', '1', '档案建立'], ['search', '2', '搜索查询'], ['match', '3', '结果匹配分析']].map(([k, n, t], i) =>
      `<button class="st ${step === k ? 'on' : ''}" data-action="trial-step" data-step="${k}"><span class="n">${n}</span>${t}</button>${i < 2 ? '<span class="arw">→</span>' : ''}`).join('')}
  </div>`;

  let body = '';
  if (step === 'profile') {
    const on = D.matchProfile.filter((f) => f.on).length;
    body = `<div class="notice"><b>只有「已确认入库」的字段才会出现在这张表里。</b>
      还躺在候选区、你还没核对过的信息不会参与匹配——这是为了不拿没确认的东西去对试验条件。
      每一项可以单独关掉。</div>
      <div class="panel">
        <table class="prof-table">
          <tr><th class="q">参与</th><th>字段</th><th>值</th><th>层</th></tr>
          ${D.matchProfile.map((f) => `<tr>
            <td class="q"><input type="checkbox" data-action="prof-toggle" data-key="${esc(f.key)}" ${f.on ? 'checked' : ''} ${f.confirmed ? '' : 'disabled'} aria-label="让「${esc(f.label)}」参与匹配"></td>
            <td>${esc(f.label)}${f.confirmed ? '' : ' <span class="lay">（候选，未核对）</span>'}</td>
            <td>${esc(f.value)}</td>
            <td class="lay">${f.layer === 'struct' ? '结构化' : '文本'}</td></tr>`).join('')}
        </table>
        <p class="small-note">当前参与匹配 ${on} 项。档案只保存"哪些字段参与"，不保存任何分数。</p>
      </div>
      <div class="row-actions"><button class="primary" data-action="trial-step" data-step="search" ${on ? '' : 'disabled'}>下一步：搜索查询 →</button></div>`;
  } else if (step === 'search') {
    body = `<div class="notice"><b>两条通道各自记录终态。</b>本地快照离线可用；在线检索没完成时，
      页面会明说"这次没查到"，而不是把失败写成"没有结果"。</div>
      <div class="panel"><h3>通道状态</h3>
        <table class="prof-table"><tr><th>通道</th><th>终态</th><th>时间</th><th>说明</th></tr>
        ${D.channels.map((c) => `<tr><td>${esc(c.name)}</td>
          <td>${pill(c.state, c.state === 'OK' ? '' : 'warn')}</td><td>${esc(c.at)}</td><td>${esc(c.detail)}</td></tr>`).join('')}
        </table>
        <p class="small-note">FAILED / DENIED 不算"查过"：这两态下结果集不完整，不能据此说"没有试验"。</p>
      </div>
      <div class="panel"><h3>检索条件（来自档案）</h3>
        <p>瘤种：${esc(factMap().dx || '未提供')} · 原发部位：${esc(factMap().site || '未提供')} · 分期：${esc(factMap().stage || '未提供')}</p>
        <p class="small-note">条件只用于筛选，不写进任何"资格"字段。</p>
      </div>
      <div class="row-actions"><button class="primary" data-action="trial-step" data-step="match">查看匹配结果 →</button></div>`;
  } else {
    const facts = factMap();
    const scored = D.trials.map((t) => ({ t, s: scoreTrial(t, facts) }));
    const hit = scored.filter((x) => x.s.status === 'match');
    const un = scored.filter((x) => x.s.status === 'unmatched');
    body = `<div class="notice"><b>分数是"字段重合度"，不是"你能不能进"。</b>
      每一条都附证据行（哪个条件对上了、原文是什么）。宽口径（basket）命中会原样写出该项要求的是哪个瘤种，
      不改写成"符合"。</div>
      ${hit.length ? `<h3 class="sec-h">命中 ${hit.length} 条</h3>${hit.map((x) => trialCard(x.t)).join('')}` : ''}
      ${un.length ? `<h3 class="sec-h">无法自动匹配 ${un.length} 条</h3>
        <p class="small-note" style="margin:-4px 0 10px">"无法自动匹配"不等于"不适用"：可能只是本档案缺一项结果，或需要研究者判断。</p>
        ${un.map((x) => trialCard(x.t)).join('')}` : ''}
      <div class="state-none"><b>不适用的条目不产出。</b>本次检索另有 1 条胰腺癌专属试验因瘤种口径与档案不符，未列入结果。
        本台不生成"你不适用"的结论，只把它排除在结果之外。</div>
      <p class="small-note">匹配分只在展示层计算（瘤种 +15 或 +5，结构化每项 +30 上限 60，文本每项 +10 上限 20）。
        数据层只保存收藏关系，不存在 match_score / eligible / suitability 这类列。</p>`;
  }
  return pageHead('临床试验', `<span class="pill">演示条目，不是真实登记</span>`) +
    `<p class="page-sub">${esc(SUBTITLE.trial)}</p>` + stepBar + body;
}

/* ==========================================================================
   复诊准备 / 设置
   ========================================================================== */
function vCare() {
  const sub = state.sub || '问题清单';
  const tabs = SUBS.care.map((s, i) => `<button class="chip" data-action="sub" data-sub="${s}" aria-pressed="${sub === s}">10.${i + 1} ${s}</button>`).join('');
  let body = '';
  if (sub === '问题清单') {
    body = `<div class="notice"><b>这些问题来自你自己的记录。</b>可以改、可以删、可以加。带进门诊的是你写的那份。</div>
      <div class="panel"><h3>待问（${D.questions.filter((q) => !q.done).length} 条）</h3>
        ${D.questions.map((q) => `<label class="qrow"><input type="checkbox" data-action="q-done" data-id="${esc(q.id)}" ${q.done ? 'checked' : ''}>
          <span>${esc(q.text)}</span><em>${esc(q.from)}</em></label>`).join('')}
      </div>
      <div class="panel"><h3>要带的材料</h3>
        <ul class="plain"><li>最近一次 CT 报告（${esc(D.imaging[D.imaging.length - 1].date)}）</li>
        <li>最近一次化验单（${esc(D.metricOrder.length ? last(MET.ca199).d : '')}）</li>
        <li>出院小结（2026-03-01）</li><li>正在吃的药与胰酶制剂包装</li></ul>
      </div>
      ${verdictBox('这次复查会不会查出问题')}`;
  } else {
    body = `<div class="panel"><h3>导出</h3>
        <p>可导出为一份文本清单：问题 + 要带的材料 + 最近三个数字（都带日期与来源）。
        导出的内容不含任何判断词，也不含试验匹配分。</p>
        <div class="row-actions"><button class="primary" data-action="export">生成清单（演示：显示在下方）</button></div>
        <pre class="export-box" id="export-box" hidden></pre>
      </div>`;
  }
  return pageHead('复诊准备', `<div class="chips">${tabs}</div>`) + `<p class="page-sub">${esc(SUBTITLE.care)}</p>` + body;
}

function vSettings() {
  const sub = state.sub || '本机目录';
  const tabs = SUBS.settings.map((s, i) => `<button class="chip" data-action="sub" data-sub="${s}" aria-pressed="${sub === s}">11.${i + 1} ${s}</button>`).join('');
  let body = '';
  if (sub === '本机目录') {
    body = `<div class="panel"><h3>资料目录</h3>
        <p>当前目录：<code>~/Documents/健康记录/壶腹-陈慧兰</code></p>
        <p class="small-note">目录由你选定；换目录时不会自动搬文件。所有原件只在这台电脑上。</p>
        <div class="row-actions"><button data-action="demo-only">选择目录（演示）</button></div>
      </div>
      <div class="panel"><h3>还没做的</h3>
        <ul class="plain"><li>多档案切换</li><li>报告 PDF 导出</li><li>参考数据包更新</li></ul>
        <p class="small-note">不摆点了没反应的开关。</p>
      </div>`;
  } else if (sub === '扫描件解析') {
    body = `<div class="panel"><h3>扫描件解析（MinerU）</h3>
        <p>Token 状态：<b>已配置</b> · 显示为 <code>abcd****99</code></p>
        <p class="small-note">Token 只保存在本机密钥文件（权限 600）。页面永远不回显完整 Token。</p>
        <div class="row-actions"><button data-action="demo-only">换成新 Token（演示）</button><button data-action="demo-only">清空 Token（演示）</button></div>
      </div>
      <div class="panel"><h3>解析失败的两种情形</h3>
        <ul class="plain">
          <li><b>可重试</b>：没有 Token / 授权失败 / 网络 / 超时 → 文件留在「待解析」，配好之后直接重试，不用重传。</li>
          <li><b>文件本身不行</b>：扫描件没有文字层 / 加密 / 超过 200 MB → 明确说明原因，不静默丢弃。</li>
        </ul>
      </div>`;
  } else {
    body = `<div class="panel"><h3>字号</h3>
        <p>当前：${state.tz === 'sm' ? '标准（1.00 倍）' : state.tz === 'md' ? '大字（1.15 倍）' : '特大（1.32 倍）'}</p>
        <div class="chips">${[['sm', '标准'], ['md', '大字'], ['lg', '特大']].map(([k, l]) =>
          `<button class="chip" data-action="tz-set" data-tz="${k}" aria-pressed="${state.tz === k}">${l}</button>`).join('')}</div>
        <p class="small-note">SVG 图内文字不随档位变化，避免图被挤变形。</p>
      </div>
      <div class="panel"><h3>关于</h3>
        <p>${esc(APP.name)} ${esc(APP.en)} · ${esc(APP.version)} · 构建 ${esc(APP.build)}</p>
        <p class="small-note">${esc(APP.stage)} · 合成演示资料 · 未接入宿主</p>
      </div>`;
  }
  return pageHead('设置', `<div class="chips">${tabs}</div>`) + `<p class="page-sub">${esc(SUBTITLE.settings)}</p>` + body;
}

const VIEWS = { dash: vDash, disease: vDisease, preop: vPreop, surgery: vSurgery, comp: vComp, metrics: vMetrics, nutrition: vNutrition, followup: vFollowup, trial: vTrial, care: vCare, settings: vSettings };

/* ==========================================================================
   IP11：每页的 discussFacts（事实摘要，无判定词）
   ========================================================================== */
const DISCUSS = {
  dash: () => {
    const tb = last(MET.tbil), ca = last(MET.ca199), w = last(MET.weight);
    return [`总胆红素 ${dec(tb.v)} μmol/L（${tb.d}）`, `CA19-9 ${dec(ca.v)} U/mL（${ca.d}）`,
      `体重 ${dec(w.v, 1)} kg（${w.d}）`, `手术日 ${D.surgery.date}，距今 ${dayGap(D.surgery.date, TODAY)} 天`];
  },
  disease: () => [`病理原文：${D.pathology.subtypeLabel}、${D.pathology.invasion}、切缘 ${D.pathology.margin}、淋巴结 ${D.pathology.nodes}`,
    `分期原文：${D.stages[0].written}（${D.stages[0].system}）`],
  preop: () => [`引流：${D.drains[0].modality}，${D.drains[0].date}`, `术前总胆红素 ${dec(pts(MET.tbil)[0].v)} → ${dec(pts(MET.tbil).filter((p) => p.d < '2026-02-10').slice(-1)[0].v)} μmol/L`,
    `手术日 ${D.surgery.date}`],
  surgery: () => [`${D.surgery.type}，${D.surgery.date}`, `切缘 ${D.surgery.margin}`, `淋巴结 ${D.surgery.nodes}`, `住院 ${D.surgery.los}`],
  comp: () => D.complications.filter((c) => c.date).map((c) => `${c.type}：报告原文分级 ${c.grade}（${c.date}）`),
  metrics: () => D.metricOrder.map((k) => MET[k]).filter(Boolean).map((m) => `${m.name} ${dec(last(m).v, m.dec)} ${m.unit}（${last(m).d}）`),
  nutrition: () => [`体重 ${dec(last(MET.weight).v, 1)} kg（${last(MET.weight).d}）`, `空腹血糖 ${dec(last(MET.glu).v, 1)} mmol/L（${last(MET.glu).d}）`,
    `HbA1c ${dec(last(MET.hba1c).v, 1)} %（${last(MET.hba1c).d}）`],
  followup: () => [`最近影像 ${D.imaging[D.imaging.length - 1].date}：${D.imaging[D.imaging.length - 1].quote}`,
    `下次复查 ${D.visits.find((v) => v.planned).on}（${D.visits.find((v) => v.planned).what}）`],
  trial: () => [`参与匹配的字段 ${D.matchProfile.filter((f) => f.on).length} 项`, `本地快照状态 ${D.channels[0].state}；在线通道 ${D.channels[1].state}`,
    ...D.trials.slice(0, 2).map((t) => `${t.key}：匹配分 ${scoreTrial(t, factMap()).total}（字段重合度参考分）`)],
  care: () => D.questions.filter((q) => !q.done).map((q) => q.text),
  settings: () => ['资料目录：本机已选定', 'Token：已配置（不回显）', `字号档位：${state.tz}`]
};

function buildDraft(view) {
  const lines = (DISCUSS[view] || (() => []))();
  const label = (PAGES.find((p) => p[0] === view) || [])[1] || view;
  const head = `【本页：${label}${state.sub ? ' · ' + state.sub : ''}】以下是我这一页的记录（都是事实，没有结论）：`;
  return `${head}\n${lines.map((l) => '· ' + l).join('\n')}\n\n请帮我把这些整理成我下次门诊可以问医生的问题。不要替我判断病情。`;
}

/* ==========================================================================
   AI 面板（20 号：五态 / 拖动 / 收起不等于结束）
   ========================================================================== */
const AGENT_STATES = { closed: 'AI 对话', connecting: '正在连接…', open: '收起 AI 对话', reopen: '打开 AI 对话', down: 'AI 对话暂不可用' };
let agentSessionMade = false;

function setAgent(open, { silent = false } = {}) {
  const grid = $('#work-grid'), dock = $('#agent-dock'), sp = $('#splitter'), btn = $('#agent-toggle');
  state.agentOpen = open;
  grid.classList.toggle('agent-open', open);
  dock.hidden = !open;
  sp.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
  $('#agent-label').textContent = open ? AGENT_STATES.open : (agentSessionMade ? AGENT_STATES.reopen : AGENT_STATES.closed);
  $('#agent-state').textContent = open ? '已打开' : (agentSessionMade ? '已收起' : '未打开');
  $('#agent-dot').classList.toggle('on', open);
  applyAgentWidth(state.agentW);
  if (open) {
    /* 会话节点恒定挂载：收起只是 display:none，不销毁（20 号） */
    agentSessionMade = true;
  }
  if (open && !silent) {
    setTimeout(() => { const ta = $('#agent-input'); if (ta) ta.focus({ preventScroll: true }); }, 60);
  }
  if (open && window.innerWidth < 760) {
    document.body.classList.add('agent-drawer');
  } else {
    document.body.classList.remove('agent-drawer');
  }
}

function applyAgentWidth(pct) {
  const p = Math.min(45, Math.max(25, pct));
  state.agentW = p;
  const grid = $('#work-grid');
  const w = Math.round(grid.getBoundingClientRect().width * p / 100);
  grid.style.setProperty('--agent-w', `${w}px`);
  const sp = $('#splitter');
  sp.setAttribute('aria-valuenow', String(p));
  sp.setAttribute('aria-valuetext', `面板宽度 ${p}%（范围 25%–45%）`);
}

function initSplitter() {
  const sp = $('#splitter'), grid = $('#work-grid');
  let dragging = false;
  const setFromX = (clientX) => {
    const r = grid.getBoundingClientRect();
    const pct = (r.right - clientX) / r.width * 100;
    applyAgentWidth(pct);
  };
  sp.addEventListener('pointerdown', (e) => {
    dragging = true; sp.setPointerCapture?.(e.pointerId); e.preventDefault();
  });
  sp.addEventListener('pointermove', (e) => { if (dragging) setFromX(e.clientX); });
  sp.addEventListener('pointerup', (e) => { dragging = false; try { sp.releasePointerCapture?.(e.pointerId); } catch (_) {} });
  sp.addEventListener('pointercancel', () => { dragging = false; });
  sp.addEventListener('keydown', (e) => {
    const step = 2;
    if (e.key === 'ArrowLeft') { e.preventDefault(); applyAgentWidth(state.agentW + step); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); applyAgentWidth(state.agentW - step); }
    else if (e.key === 'Home') { e.preventDefault(); applyAgentWidth(45); }
    else if (e.key === 'End') { e.preventDefault(); applyAgentWidth(25); }
  });
  window.addEventListener('resize', () => { if (state.agentOpen) applyAgentWidth(state.agentW); });
}

function agentSay(who, text) {
  const log = $('#agent-log');
  const el = document.createElement('div');
  el.className = 'agent-msg' + (who === '我' ? ' me' : '');
  el.innerHTML = `<span class="who">${esc(who)}</span>${esc(text)}`;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

/* ==========================================================================
   整页视图（32 号：history 是唯一真源）
   ========================================================================== */
const pv = $('#pageview');

function pvRender(payload) {
  state.pv = payload;
  pv.hidden = false;
  pv.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('pv-lock');
  $('#pv-title').textContent = payload.title;
  $('#pv-eyebrow').textContent = payload.eyebrow || '小壶宝';
  $('#pv-body').innerHTML = `<div class="pageview-inner">${payload.html}
    <div class="row-actions" style="margin-top:18px">
      <button class="discuss-btn" data-action="discuss" data-discuss="${payload.view || state.view}">${icon('spark')}和 AI 讨论这一页</button>
      <button data-action="pv-back">← 返回</button>
      <button data-action="pv-close">关闭</button>
    </div></div>`;
  $('#pv-body').scrollTop = 0;
  $('#pv-body').focus({ preventScroll: true });
}

function openPageView(payload) {
  pvRender(payload);
  history.pushState({ amp: 1, pv: payload.key, view: state.view, sub: state.sub }, '', `#page/${payload.key}`);
}

function pvClose(kind) {
  if (history.state && history.state.pv) history.back();
  else {
    pv.hidden = true;
    document.documentElement.classList.remove('pv-lock');
    state.pv = null;
    if (kind === 'close') go('dash', null, { push: false });
  }
}

/* ==========================================================================
   弹窗 / 提示
   ========================================================================== */
const dlg = $('#dialog');
function openDialog({ eyebrow = '小壶宝', title, body, foot = '' }) {
  $('#dialog-eyebrow').textContent = eyebrow;
  $('#dialog-title').textContent = title;
  $('#dialog-body').innerHTML = body;
  $('#dialog-foot').innerHTML = foot;
  if (!dlg.open) dlg.showModal();
}
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ==========================================================================
   路由与渲染
   ========================================================================== */
function go(view, sub = null, { push = true } = {}) {
  state.view = view;
  state.sub = sub || null;
  if (push) history.pushState({ amp: 1, view, sub: state.sub }, '', `#${view}${state.sub ? '/' + encodeURIComponent(state.sub) : ''}`);
  render();
}

function renderNav() {
  $('#nav').innerHTML = PAGES.map(([k, t, ic]) => `
    <button class="nav-button ${state.view === k ? 'on' : ''}" data-action="go" data-view="${k}" ${state.view === k ? 'aria-current="page"' : ''}>
      ${icon(ic)}<span>${esc(t)}</span></button>`).join('');
}

function render() {
  const title = (PAGES.find((p) => p[0] === state.view) || [])[1] || '';
  $('#breadcrumb').textContent = title + (state.sub ? ' / ' + state.sub : '');
  renderNav();
  const html = (VIEWS[state.view] || vDash)();
  $('#main').innerHTML = html;
  document.title = `${APP.name} ${APP.en} · ${title} · ${APP.version}`;
  window.scrollTo({ top: 0 });
}

/* ==========================================================================
   事件
   ========================================================================== */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;

  if (a === 'go') { e.preventDefault(); go(el.dataset.view); return; }
  if (a === 'primer') {
    /* 状态卡副按钮：打开疾病概要整页；焦点交回顶栏常驻「?」，避免看板重渲染后焦点丢失 */
    const t = document.querySelector('.top-actions [data-primer-open]');
    if (window.DiseasePrimer) window.DiseasePrimer.open(t);
    return;
  }
  if (a === 'sub') { state.sub = el.dataset.sub; go(state.view, el.dataset.sub); return; }
  if (a === 'pin') {
    state.pin = { code: el.dataset.code, d: el.dataset.date };
    render();
    return;
  }
  if (a === 'pin-clear') { state.pin = null; render(); return; }
  if (a === 'range') { state.range = el.dataset.range; rerenderFocus(`[data-action="range"][data-range="${el.dataset.range}"]`); return; }
  if (a === 'toggle-bands') { state.bands = !state.bands; render(); return; }
  if (a === 'flip') {
    const c = el.dataset.code;
    state.flip[c] = !state.flip[c];
    el.dataset.flipped = String(!!state.flip[c]);
    el.setAttribute('aria-pressed', String(!!state.flip[c]));
    return;
  }
  if (a === 'discuss') { onDiscuss(el.dataset.discuss); return; }
  if (a === 'agent') { setAgent(!state.agentOpen); return; }
  if (a === 'agent-draft') {
    agentSay('我', $('#agent-input').value || '（空）');
    agentSay('AI（演示）', '这一条是演示回复，没有经过任何模型：本原型未接入宿主会话。真实版本会把这段草稿交给 DSH 原生会话，由你按回车才发送。');
    return;
  }
  if (a === 'agent-clear') { $('#agent-input').value = ''; return; }
  if (a === 'pv-back') { pvClose('back'); return; }
  if (a === 'pv-close') { pvClose('close'); return; }
  if (a === 'close') { dlg.close(); return; }
  if (a === 'settings') { go('settings'); return; }
  if (a === 'about') {
    openDialog({ title: '关于小壶宝', body: `<p>${esc(APP.name)} ${esc(APP.en)} · ${esc(APP.version)} · 构建 ${esc(APP.build)}</p>
      <p class="small-note">${esc(APP.stage)} · 全部为合成演示资料 · 未接入 DSH 宿主</p>
      <p class="small-note">本台不提供诊断与治疗建议。任何与你有关的判断，这一句需要问你的医生。</p>` });
    return;
  }
  if (a === 'tz' || a === 'tz-set') {
    const order = ['sm', 'md', 'lg'];
    const next = a === 'tz' ? order[(order.indexOf(state.tz) + 1) % 3] : el.dataset.tz;
    state.tz = next;
    document.body.dataset.tz = next;
    $('#font-toggle').setAttribute('aria-pressed', String(next !== 'sm'));
    if (state.view === 'settings') render(); else toast(`字号：${next === 'sm' ? '标准' : next === 'md' ? '大字' : '特大'}`);
    return;
  }
  if (a === 'profile') {
    openDialog({ title: '演示档案', body: `<p>${esc(D.profile.name)}，${D.profile.age} 岁，${esc(D.profile.dx)}。</p>
      <p>${esc(D.profile.tag)}</p><p class="small-note">全部为合成资料，不是真实患者。</p>` });
    return;
  }
  if (a === 'help') {
    openDialog({ title: '原型操作说明', body: `<ul class="plain">
      <li>左侧竖栏切一级页；页内 chips 切二级页。</li>
      <li>每页右上「和 AI 讨论」把本页事实摘要填进右侧输入框，<b>不会自动发送</b>。</li>
      <li>顶栏「AI 对话」开关面板；面板左边界可拖动，也可聚焦后按 ←→。</li>
      <li>指标卡点一下翻面，背面是记录清单。</li>
      <li>疾病概要：顶栏右侧的「?」，打开的是整页。</li></ul>` });
    return;
  }
  if (a === 'scale') {
    const c = D.complications.find((x) => x.id === el.dataset.id);
    openDialog({ title: c.type + ' 的分级标准', body: `<p>${esc(c.scaleText)}</p><p class="small-note">来源：${esc(c.cite)}</p>` });
    return;
  }
  if (a === 'trial-step') { state.trial.step = el.dataset.step; render(); return; }
  if (a === 'trial-detail') {
    const t = D.trials.find((x) => x.key === el.dataset.key);
    openDialog({ title: t.key, body: `<p><b>${esc(t.title)}</b></p>
      <p>${esc(t.sponsor)} · ${esc(t.phase)} · ${esc(t.status)}</p>
      <p>瘤种口径：${esc(t.tumor)}</p>
      <p class="small-note">登记页：${esc(t.url)}（演示地址，不是真实登记）</p>
      <p class="small-note">本台不判断你是否符合这条试验的入组要求。</p>` });
    return;
  }
  if (a === 'trial-save') {
    toast('已收藏（只记录 trial_key 与收藏时间，不记录分数）');
    return;
  }
  if (a === 'q-done') {
    const q = D.questions.find((x) => x.id === el.dataset.id);
    if (q) q.done = el.checked;
    return;
  }
  if (a === 'export') {
    const box = $('#export-box');
    const lines = [
      `复诊清单（生成于 ${TODAY}，合成演示数据）`,
      '',
      '【要问的问题】', ...D.questions.filter((q) => !q.done).map((q, i) => `${i + 1}. ${q.text}`),
      '',
      '【最近三个数字】',
      `· 总胆红素 ${dec(last(MET.tbil).v)} μmol/L（${last(MET.tbil).d}）`,
      `· CA19-9 ${dec(last(MET.ca199).v)} U/mL（${last(MET.ca199).d}）`,
      `· 体重 ${dec(last(MET.weight).v, 1)} kg（${last(MET.weight).d}）`,
      '',
      '以上均为记录与算术，不含判断。任何与你有关的判断，这一句需要问你的医生。'
    ];
    box.hidden = false;
    box.textContent = lines.join('\n');
    toast('清单已生成在下方');
    return;
  }
  if (a === 'demo-only') { toast('演示版：这个动作没有接到真实后端'); return; }
});

document.addEventListener('change', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  if (el.dataset.action === 'pick') {
    const c = el.dataset.code;
    if (el.checked) {
      if (state.sel.length >= 4) { el.checked = false; toast('最多同时选 4 条'); return; }
      state.sel.push(c);
    } else state.sel = state.sel.filter((x) => x !== c);
    rerenderFocus(`[data-action="pick"][data-code="${c}"]`);
  }
  if (el.dataset.action === 'prof-toggle') {
    const f = D.matchProfile.find((x) => x.key === el.dataset.key);
    if (f) f.on = el.checked;
    render();
  }
  if (el.dataset.action === 'q-done') {
    const q = D.questions.find((x) => x.id === el.dataset.id);
    if (q) q.done = el.checked;
  }
});

/* 重绘后把焦点放回同一个控件：不改结构、只搬焦点（16 号增补：重绘不丢翻面/焦点） */
function rerenderFocus(sel) {
  render();
  const again = sel && document.querySelector(sel);
  if (again && again.focus) again.focus({ preventScroll: true });
}

function onDiscuss(view) {
  const draft = buildDraft(view);
  const ta = $('#agent-input');
  ta.value = draft;
  if (!state.agentOpen) setAgent(true, { silent: true });
  else applyAgentWidth(state.agentW);
  ta.focus({ preventScroll: true });
  ta.setSelectionRange(ta.value.length, ta.value.length);
  toast('已填入草稿 · 不会自动发送，你自己按发送');
}

/* 疾病概要在整页里的「和 AI 讨论这个」 */
window.addEventListener('ampupal:discuss', (e) => {
  const ta = $('#agent-input');
  ta.value = `【本页：疾病概要】以下是我刚看完的解释内容要点：\n· ${(e.detail && e.detail.facts || []).join('\n· ')}\n\n我想问的是：这些内容里，哪些需要结合我的具体情况才能回答？`;
  if (!state.agentOpen) setAgent(true, { silent: true });
  ta.focus({ preventScroll: true });
  toast('已填入草稿 · 不会自动发送');
});

/* 键盘：Esc 退一层 */
document.addEventListener('keydown', (e) => {
  /* 图上的圆点是 role="button"：Enter / 空格 等价于点击（R12 可访问性） */
  if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('circle.pt[data-action="pin"]')) {
    e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); return;
  }
  if (e.key !== 'Escape') return;
  if (dlg.open) { dlg.close(); return; }
  if (state.pv) { pvClose('back'); return; }
  if (state.agentOpen && window.innerWidth < 760) { setAgent(false); }
});

window.addEventListener('popstate', (e) => {
  const s = e.state || {};
  if (s.pv) {
    const p = { key: s.pv, title: '疾病概要', html: '' };
    /* 已打开的整页：保持内容，只恢复可见性 */
    if (state.pv && state.pv.key === s.pv) { pv.hidden = false; document.documentElement.classList.add('pv-lock'); return; }
    pvRender(p); return;
  }
  if (state.pv) {
    pv.hidden = true;
    document.documentElement.classList.remove('pv-lock');
    state.pv = null;
  }
  if (s.view) { state.view = s.view; state.sub = s.sub || null; render(); }
});

/* ---------------- 启动 ---------------- */
function boot() {
  document.body.dataset.tz = state.tz;
  applyAgentWidth(state.agentW);
  initSplitter();
  if (location.hash && location.hash.length > 1 && !location.hash.startsWith('#')) history.replaceState(null, '', '#dash');
  history.replaceState({ amp: 1, view: 'dash', sub: null }, '', '#dash');
  render();
  agentSay('AI（演示）', '这里是演示面板：没有连接任何模型，也不会自动发送。左侧每页右上角有「和 AI 讨论」，点了只会把这一页的事实摘要填进下面的输入框。');
  /* 供探针识别状态 */
  window.__AMPUPAL__ = { state, APP, DISCUSS, scoreTrial, factMap, chartSVG };
}
boot();
