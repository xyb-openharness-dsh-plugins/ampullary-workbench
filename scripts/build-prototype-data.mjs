#!/usr/bin/env node
/* 从 demo/demo-source.mjs 生成原型数据 prototypes/v0.2/demo-data.js
 *
 * 唯一来源原则（LESSONS L30）：原型页面不写死任何业务数值，
 * 一律读这里生成的 window.DEMO_DATA。G3 落库时同一个 demo-source.mjs
 * 再生成 demo/demo-data.sqlite，两处逐点 deepStrictEqual。
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { demoData } from '../demo/demo-source.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'prototypes', 'v0.2', 'demo-data.js')

const header = `/* 自动生成，不要手改。来源：demo/demo-source.mjs（生成器 scripts/build-prototype-data.mjs）
 * 合成演示资料，不含真实患者信息；试验条目为 DEMO-* 演示编号，不是真实登记。
 */
`
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, `${header}window.DEMO_DATA = ${JSON.stringify(demoData, null, 2)};\n`, 'utf8')

const points = Object.values(demoData.metrics).reduce((n, m) => n + m.points.length, 0)
console.log(`✓ 生成 ${out}`)
console.log(`  指标线 ${Object.keys(demoData.metrics).length} 条 · 数据点 ${points} 个 · 试验 ${demoData.trials.length} 条 · 影像 ${demoData.imaging.length} 份`)
