/* 演示数据契约测试（L30：数据只有一个来源，两处同时钉住）
 *
 * 只测"数据本身站不站得住"，不测渲染——渲染由 scripts/probe-proto.mjs 在真实 Chrome 里断言。
 * 这样分工的原因：把同样的数值逻辑抄进测试里，抄错了测试也跟着错（家族里踩过两次）。
 * 到了 M5，`lib/onechart.mjs` / `lib/trial-match.mjs` 抽出纯函数后，再补逻辑级单测。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { demoData as D } from '../demo/demo-source.mjs'

const DATE = /^\d{4}-\d{2}-\d{2}$/
const parse = (d) => Date.parse(`${d}T00:00:00Z`)

test('七条指标线齐全，且每条都带单位 / 精度 / 来源', () => {
  const want = ['tbil', 'dbil', 'ca199', 'alb', 'weight', 'glu', 'hba1c']
  assert.deepEqual(Object.keys(D.metrics).sort(), [...want].sort())
  for (const [code, m] of Object.entries(D.metrics)) {
    assert.equal(m.id, code, `${code} 的 id 与键名不一致`)
    assert.ok(m.unit && typeof m.unit === 'string', `${code} 缺单位`)
    assert.ok(Number.isInteger(m.dec), `${code} 缺精度 dec`)
    assert.ok(m.source && m.source.length > 4, `${code} 缺来源（第 ① 层必须能点回来源）`)
    assert.ok(m.points.length >= 1, `${code} 没有数据点`)
  }
})

test('每个数据点：日期合法、值是数字、日期不重复且按时间递增', () => {
  for (const [code, m] of Object.entries(D.metrics)) {
    const seen = new Set()
    let prev = 0
    for (const p of m.points) {
      assert.match(p.d, DATE, `${code} 日期格式不对：${p.d}`)
      assert.ok(Number.isFinite(p.v), `${code} ${p.d} 的值不是数字`)
      assert.ok(!seen.has(p.d), `${code} 同一天出现两次：${p.d}`)
      seen.add(p.d)
      const t = parse(p.d)
      assert.ok(t > prev, `${code} 点没有按时间递增：${p.d}`)
      prev = t
    }
  }
})

test('术前减黄段与肿瘤/代谢段的点不互相借用（不插值补点）', () => {
  /* 直接胆红素只在减黄段与随访前段有值：不能被"补"到术后每个月 */
  assert.ok(D.metrics.dbil.points.length < D.metrics.tbil.points.length,
    '直接胆红素应当是比总胆红素更稀疏的分项，不该被补齐')
  const allDates = new Set(D.metrics.tbil.points.map((p) => p.d))
  for (const p of D.metrics.dbil.points) {
    assert.ok(allDates.has(p.d), `直接胆红素 ${p.d} 在总胆红素里没有对应记录，说明是凭空造的`)
  }
})

test('治疗带：三类齐全，手术是单日事件（from === to）', () => {
  const kinds = D.bands.map((b) => b.kind)
  for (const k of ['drain', 'surgery', 'recovery']) assert.ok(kinds.includes(k), `缺 ${k} 治疗带`)
  const s = D.bands.find((b) => b.kind === 'surgery')
  assert.equal(s.from, s.to, '手术是时点事件，不该有跨度')
  for (const b of D.bands) {
    assert.match(b.from, DATE)
    assert.match(b.to, DATE)
    assert.ok(parse(b.to) >= parse(b.from), `${b.label} 的结束日早于开始日`)
  }
})

test('试验条目全部是演示编号，不伪造 NCT 号', () => {
  assert.ok(D.trials.length >= 3)
  for (const t of D.trials) {
    assert.match(t.key, /^DEMO-/, `${t.key} 不是演示编号`)
    assert.ok(!/NCT\d{8}/.test(JSON.stringify(t)), `${t.key} 里出现了看起来像真实登记号的内容`)
  }
  /* 三态都要在演示数据上真的出现，否则页面上那三种状态只是文案 */
  const scopes = D.trials.map((t) => t.tumorScope)
  assert.ok(scopes.includes('specific') && scopes.includes('basket'), '缺宽口径 basket 条目')
  const basket = D.trials.filter((t) => t.tumorScope === 'basket')
  for (const t of basket) {
    assert.ok(t.basketText && t.basketText.includes('该项入组要求里写的是'),
      `${t.key} 宽口径命中必须原样写出原文瘤种（35 号 v2）`)
  }
})

test('检索通道：在线通道的失败态被记成 DENIED，且写明"不算查过"', () => {
  const online = D.channels.find((c) => c.id === 'online')
  assert.ok(online, '缺在线通道')
  assert.equal(online.state, 'DENIED')
  assert.ok(/没有查到|不算/.test(online.detail),
    'DENIED 必须写明"本次没有查到、不算查过"')
})

test('匹配档案里未确认项必须 confirmed:false（不能默认勾上）', () => {
  const pend = D.matchProfile.filter((f) => f.confirmed === false).map((f) => f.key)
  assert.deepEqual(pend.sort(), ['her2', 'msi'], 'MSI / HER2 应当是"未确认"，不是默认已知')
})

test('分期三套并列，未记录的写"未记录"而不是留空或补 0', () => {
  const keys = D.stages.map((s) => s.system)
  assert.ok(keys.length >= 3, '分期应当并列多套（壶腹 AJCC / 胆管 / 胰腺）')
  for (const s of D.stages) {
    /* 未记录就是"未记录"：不许留空串、也不许写 0 或"未见异常" */
    assert.ok(s.written && s.written.length > 0, `${s.system} 缺 written`)
    if (s.written === '未记录') {
      assert.equal(s.cite, '', `${s.system} 未记录却给了出处，说明是编的`)
      assert.ok(s.basis && s.basis.includes('未'), `${s.system} 未记录时要写明"为什么没有"`)
    } else {
      assert.ok(s.cite && s.cite.length > 0, `${s.system} 有值就必须能点回来源`)
      assert.ok(s.original && s.original.length > 0, `${s.system} 有值就要给界标原文（第 ② 层）`)
    }
  }
})
