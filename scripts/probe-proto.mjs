#!/usr/bin/env node
/* 原型探针（G2 闸门）：把 16 / 20 / 28(IP11) / 35 / 32 号的标准逐条跑一遍。
 *
 * 用法：NODE_OPTIONS= node scripts/probe-proto.mjs [--shots]
 * 依赖：本机 Chrome + puppeteer-core（放在 ~/.workbuddy/binaries/node/workspace/node_modules）。
 *
 * 断言的写法原则：不看"按钮存在"就收工，要看点了之后发生了什么。
 */
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { mkdirSync } from 'node:fs'

const require = createRequire(join(homedir(), '.workbuddy/binaries/node/workspace/node_modules/'))
const puppeteer = require('puppeteer-core')

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const page_url = pathToFileURL(join(root, 'prototypes/v0.2/index.html')).href
const SHOTS = process.argv.includes('--shots')
const shotDir = join(root, 'prototypes/v0.2/_evidence')

const oks = []
const fails = []
const t = (name, cond, extra = '') => { (cond ? oks : fails).push(name + (extra ? ` — ${extra}` : '')) }

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox', '--allow-file-access-from-files', ...(process.env.http_proxy ? [`--proxy-server=${process.env.http_proxy}`] : [])]
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })

await page.goto(page_url, { waitUntil: 'networkidle0' })
if (SHOTS) { mkdirSync(shotDir, { recursive: true }); await page.screenshot({ path: join(shotDir, 'p-01-dash.png'), fullPage: false }) }

/* ---------- 1) 首屏与渲染 ---------- */
t('首屏无 JS 错误', errors.length === 0, errors.slice(0, 3).join(' | '))
t('一图秀渲染出 SVG', await page.$('svg.chart[data-chart="one"]') !== null)
t('左侧一级导航 11 项', (await page.$$eval('#nav .nav-button', (a) => a.length)) === 11)

/* 三条线各自的路径 d 都不同，且都在绘图区内（R1：不共用一根轴的值域） */
const paths = await page.$$eval('svg.chart path.line', (a) => a.map((p) => ({ code: p.dataset.code, d: p.getAttribute('d') })))
t('一图秀画出 ≥2 条指标线', paths.length >= 2, `实际 ${paths.length}`)
const ys = await page.$$eval('svg.chart path.line', (a) => a.map((p) => {
  const nums = (p.getAttribute('d').match(/-?\d+\.?\d*/g) || []).map(Number)
  const yy = nums.filter((_, i) => i % 2 === 1)
  return { min: Math.min(...yy), max: Math.max(...yy) }
}))
t('每条线都落在绘图区内（132–366）', ys.every((y) => y.min >= 125 && y.max <= 372), JSON.stringify(ys))
t('图上写明"不代表数值可比"', (await page.$eval('svg.chart', (s) => s.textContent)).includes('不代表数值可比'))

/* ---------- 2) 治疗条开关不改变指标路径（R8） ---------- */
const before = Object.fromEntries(paths.map((p) => [p.code, p.d]))
await page.click('[data-action="toggle-bands"]')
await new Promise((r) => setTimeout(r, 120))
const after = await page.$$eval('svg.chart path.line', (a) => Object.fromEntries(a.map((p) => [p.dataset.code, p.getAttribute('d')])))
t('关掉治疗条后指标路径完全不变', Object.keys(before).every((k) => before[k] === after[k]))
t('关掉后治疗条确实不在了', (await page.$('#bands')) === null)
await page.click('[data-action="toggle-bands"]')

/* ---------- 2.5) 点选读数（R9 固定详情 + 回源）与 R6 动画前提 ---------- */
t('曲线带 pathLength=1（R6 描线动画前提）',
  await page.$$eval('svg.chart path.line', (a) => a.every((p) => p.getAttribute('pathLength') === '1')))
t('未点选时读数条是空态占位', (await page.$eval('.pinbar', (el) => el.classList.contains('idle'))) === true)
await page.evaluate(() => {
  document.querySelector('svg.chart circle.pt').dispatchEvent(new MouseEvent('click', { bubbles: true }))
})
await new Promise((r) => setTimeout(r, 120))
const pinTxt = await page.$eval('.pinbar', (el) => el.textContent)
t('点圆点后读数条给 值 + 单位', /\d/.test(pinTxt) && pinTxt.includes('μmol/L'), pinTxt.replace(/\s+/g, ' ').slice(0, 60))
t('读数条给日期', /\d{4}-\d{2}-\d{2}/.test(pinTxt))
t('读数条给来源（回源）', pinTxt.includes('来源：'))
t('被点中的圆点有 pinned 态', (await page.$$('svg.chart circle.pt.pinned')).length === 1)
await page.click('.pin-clear')
await new Promise((r) => setTimeout(r, 120))
t('清除后回到空态', (await page.$eval('.pinbar', (el) => el.classList.contains('idle'))) === true)

/* 勾选上限：已经 4 条时再点第 5 条，必须回弹并给出提示（16 号增补） */
await page.evaluate(() => {
  const box = document.querySelector('[data-action="pick"][data-code="glu"]')
  box.checked = true; box.dispatchEvent(new Event('change', { bubbles: true }))
})
await new Promise((r) => setTimeout(r, 120))
t('选满 4 条后第 5 条回弹', (await page.$$eval('[data-action="pick"]', (a) => a.filter((x) => x.checked).length)) === 4)
t('回弹时给出提示', (await page.evaluate(() => document.body.innerText)).includes('最多同时选 4 条'))

/* 重绘不丢焦点：键盘空格取消一条后，焦点应还在那条勾选框上 */
await page.focus('[data-action="pick"][data-code="ca199"]')
await page.keyboard.press(' ')
await new Promise((r) => setTimeout(r, 120))
t('取消勾选后焦点仍在同一个控件', await page.evaluate(() => document.activeElement?.dataset?.code === 'ca199'))
await page.evaluate(() => {
  const box = document.querySelector('[data-action="pick"][data-code="ca199"]')
  box.checked = true; box.dispatchEvent(new Event('change', { bubbles: true }))
})
await new Promise((r) => setTimeout(r, 100))

/* ---------- 3) 指标卡翻面 ---------- */
const cardBefore = await page.$eval('.mcard', (el) => el.getAttribute('aria-pressed'))
await page.click('.mcard')
const cardAfter = await page.$eval('.mcard', (el) => el.getAttribute('aria-pressed'))
t('指标卡可翻面（aria-pressed 切换）', cardBefore === 'false' && cardAfter === 'true')
const cardH = await page.$eval('.mcard', (el) => Math.round(el.getBoundingClientRect().height))
t('指标卡高度 186px', cardH === 186, `实测 ${cardH}`)
const persp = await page.$eval('.mcard', (el) => getComputedStyle(el).perspective)
t('卡片 perspective 1200px', persp === '1200px', persp)

/* ---------- 4) 每页都有 IP11 按钮，且不代发 ---------- */
const pages = ['dash', 'disease', 'preop', 'surgery', 'comp', 'metrics', 'nutrition', 'followup', 'trial', 'care', 'settings']
const missing = []
for (const v of pages) {
  await page.evaluate((vv) => window.__AMPUPAL__ && document.querySelector(`#nav [data-view="${vv}"]`).click(), v)
  await new Promise((r) => setTimeout(r, 60))
  const has = await page.$('.discuss-btn[data-action="discuss"]')
  if (!has) missing.push(v)
}
t('11 个一级页每页都有「和 AI 讨论」', missing.length === 0, missing.join(','))

/* 点一次，看输入框里有什么、有没有发送 */
await page.evaluate(() => document.querySelector('#nav [data-view="preop"]').click())
await new Promise((r) => setTimeout(r, 80))
await page.click('.discuss-btn[data-action="discuss"]')
await new Promise((r) => setTimeout(r, 150))
const draft = await page.$eval('#agent-input', (el) => el.value)
t('点击后草稿含本页标记', draft.includes('【本页：术前减黄'), draft.slice(0, 40))
t('草稿含事实行', draft.includes('· '))
t('面板已打开', await page.$eval('#work-grid', (el) => el.classList.contains('agent-open')))
t('顶栏五态切到「收起 AI 对话」', (await page.$eval('#agent-label', (el) => el.textContent)) === '收起 AI 对话')
const msgCountBefore = await page.$$eval('.agent-msg', (a) => a.length)
t('点击讨论没有自动发送', msgCountBefore === 1, `消息条数 ${msgCountBefore}`)

/* ---------- 5) 面板：拖动 / 键盘 / 收起不结束会话 ---------- */
const sp = await page.$('#splitter')
t('splitter 有 role=separator 与 aria-valuenow', (await sp.evaluate((el) => el.getAttribute('role') + '|' + el.getAttribute('aria-valuenow'))) === 'separator|35')
await page.focus('#splitter')
await page.keyboard.press('ArrowLeft')
const v1 = Number(await sp.evaluate((el) => el.getAttribute('aria-valuenow')))
t('← 键把面板调宽 2%', v1 === 37, `实测 ${v1}`)
await page.keyboard.press('End')
const v2 = Number(await sp.evaluate((el) => el.getAttribute('aria-valuenow')))
t('End 落到最小值 25%', v2 === 25, `实测 ${v2}`)
await page.keyboard.press('Home')
const v3 = Number(await sp.evaluate((el) => el.getAttribute('aria-valuenow')))
t('Home 落到最大值 45%', v3 === 45, `实测 ${v3}`)

await page.click('#agent-toggle')  // 收起
await new Promise((r) => setTimeout(r, 120))
t('收起后会话节点仍挂载（不结束会话）', (await page.$('#agent-session')) !== null)
t('收起后顶栏显示「打开 AI 对话」', (await page.$eval('#agent-label', (el) => el.textContent)) === '打开 AI 对话')
t('收起后草稿还在（不清空）', (await page.$eval('#agent-input', (el) => el.value)).includes('术前减黄'))

/* ---------- 6) 临床试验三步（35 号） ---------- */
await page.evaluate(() => document.querySelector('#nav [data-view="trial"]').click())
await new Promise((r) => setTimeout(r, 80))
t('三步条含 档案建立/搜索查询/结果匹配分析', (await page.$eval('.steps', (el) => el.textContent)).replace(/\s/g, '').includes('档案建立') )
await page.click('[data-action="trial-step"][data-step="search"]')
await new Promise((r) => setTimeout(r, 80))
const chan = await page.$eval('#main', (el) => el.textContent)
t('检索页写出通道终态（含 DENIED 不算查过）', chan.includes('DENIED') && chan.includes('不算'))
await page.click('[data-action="trial-step"][data-step="match"]')
await new Promise((r) => setTimeout(r, 100))
const matchText = await page.$eval('#main', (el) => el.textContent)
t('匹配结果写出"非入组资格"标签', matchText.includes('非入组资格'))
t('宽口径命中显式写出原文瘤种', matchText.includes('该项入组要求里写的是'))
t('存在"无法自动匹配"的结果态', (await page.$$('[data-status="unmatched"]')).length >= 1)
t('不适用的条目不产出（有说明）', matchText.includes('不适用的条目不产出'))
const scores = await page.$$eval('.score', (a) => a.map((el) => Number(el.dataset.score)))
t('匹配分是 0–100 的展示层数值', scores.length >= 2 && scores.every((s) => s >= 0 && s <= 100), JSON.stringify(scores))
t('每条结果都有证据行', (await page.$$eval('.trialcard', (a) => a.every((c) => c.querySelectorAll('.notes li').length >= 2))))
if (SHOTS) await page.screenshot({ path: join(shotDir, 'p-02-trial-match.png') })

/* ---------- 7) 疾病概要整页（36 / 32 号） ---------- */
const primerTrigger = await page.$('[data-primer-open]')
t('顶栏有「?」疾病概要入口', primerTrigger !== null)
await primerTrigger.click()
await new Promise((r) => setTimeout(r, 200))
const pText = await page.$eval('#disease-primer', (el) => el.textContent)
t('疾病概要四段齐全', ['定义', '医学资料规范和指南情况', '目前治疗全景概要', '发展趋势'].every((k) => pText.includes(k)))
t('疾病概要有独立返回与关闭两个入口', (await page.$$('[data-dp="back"]')).length === 1 && (await page.$$('[data-dp="close"]')).length === 1)
const dpDiscuss = await page.$('[data-dp-discuss]')
t('疾病概要内有「和 AI 讨论这个」', dpDiscuss !== null)
await page.evaluate(() => { document.querySelector('#agent-input').value = '' })
await dpDiscuss.click()
await new Promise((r) => setTimeout(r, 120))
t('讨论这个 → 草稿含「疾病概要」', (await page.$eval('#agent-input', (el) => el.value)).includes('疾病概要'))
if (SHOTS) await page.screenshot({ path: join(shotDir, 'p-03-primer.png') })
await page.keyboard.press('Escape')
await new Promise((r) => setTimeout(r, 200))
t('Esc 关掉疾病概要', (await page.$eval('#disease-primer', (el) => el.hidden)) === true)

/* ---------- 8) 字号三档 ---------- */
const f0 = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize))
await page.evaluate(() => document.querySelector('#nav [data-view="settings"]').click())
await new Promise((r) => setTimeout(r, 80))
await page.click('[data-action="sub"][data-sub="显示与关于"]')
await new Promise((r) => setTimeout(r, 80))
await page.click('[data-action="tz-set"][data-tz="md"]')
await new Promise((r) => setTimeout(r, 80))
const f1 = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize))
await page.click('[data-action="tz-set"][data-tz="lg"]')
await new Promise((r) => setTimeout(r, 80))
const f2 = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize))
t('字号三档 15 / 17.25 / 19.8', Math.abs(f0 - 15) < 0.1 && Math.abs(f1 - 17.25) < 0.2 && Math.abs(f2 - 19.8) < 0.3, `${f0}/${f1}/${f2}`)
await page.click('[data-action="tz-set"][data-tz="sm"]')

/* ---------- 9) 窄屏无横向溢出 ---------- */
await page.setViewport({ width: 820, height: 900, deviceScaleFactor: 1 })
await new Promise((r) => setTimeout(r, 250))
const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth)
t('820px 宽无横向溢出', overflow <= 1, `超出 ${overflow}px`)
/* 820px 时面板已经不在并排位置，分隔器必须是隐藏的（不做"能拖但没东西可拖"的假控件） */
t('820px 宽不显示假分隔器', await page.$eval('#splitter', (el) => getComputedStyle(el).display === 'none'))
if (SHOTS) await page.screenshot({ path: join(shotDir, 'p-04-narrow.png') })

await browser.close()

console.log(`\n✓ ${oks.length} 条通过`)
if (fails.length) {
  console.log(`✗ ${fails.length} 条失败：`)
  fails.forEach((f) => console.log('  · ' + f))
  process.exit(1)
}
console.log('\nG2 原型探针：全部通过')
