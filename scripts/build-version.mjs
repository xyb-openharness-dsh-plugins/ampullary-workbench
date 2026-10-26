#!/usr/bin/env node
/**
 * 生成 lib/version.js —— 版本号的唯一手写处是仓库根的 VERSION。
 *
 * 为什么要有它：页面徽标、包清单、关于弹窗三处各写一遍 v0.1.0，升版时必然漏一处，
 * 而且没有任何检查会响（家族里两支病种都踩过）。这里的做法是：
 *   VERSION（手写） → lib/version.js（生成） → 客户端读 APP_INFO
 *
 * 用法：node scripts/build-version.mjs [--check]
 *   --check 只比对不写盘，不一致时退出码 1（给 check 链用）。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const CHECK = process.argv.includes('--check')

const version = readFileSync(join(root, 'VERSION'), 'utf8').trim()
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`✗ VERSION 内容不是 x.y.z：${JSON.stringify(version)}`)
  process.exit(1)
}

const build = new Date().toISOString().slice(0, 10)
let commit = 'unknown'
try {
  commit = execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim()
} catch { /* 没有 git 或不在仓库里：写 unknown，不假装有 */ }

/* 原型阶段的渠道名：不许写成"已发布"，因为还没装机（37 号） */
const channel = 'prototype'
const channelLabel = '交互原型 · 未接入 DSH'

const body = `// 本文件由 scripts/build-version.mjs 生成，请勿手改。
// 唯一来源：仓库根目录的 VERSION。改版本先改 VERSION，再跑 npm run build:version。
export const version = '${version}'
export const build = '${build}'
export const channel = '${channel}'
export const commit = '${commit}'

export const displayVersion = \`v\${version}\`
export const channelLabel = '${channelLabel}'

export const APP_INFO = Object.freeze({
  version,
  displayVersion,
  build,
  channel,
  channelLabel,
  commit,
})
`

const out = join(root, 'lib/version.js')

if (CHECK) {
  /* 只比版本号与渠道：build 日期与 commit 每次都变，不该被当成"不一致" */
  const cur = existsSync(out) ? readFileSync(out, 'utf8') : ''
  const gotVersion = cur.match(/export const version = '([^']+)'/)?.[1]
  const gotChannel = cur.match(/export const channel = '([^']+)'/)?.[1]
  if (gotVersion !== version || gotChannel !== channel) {
    console.error(`✗ lib/version.js 与 VERSION 不一致：文件 ${gotVersion}/${gotChannel}，VERSION ${version}/${channel}`)
    console.error('  修：npm run build:version')
    process.exit(1)
  }
  console.log(`✓ 版本一致 v${version}（${channel}）`)
  process.exit(0)
}

writeFileSync(out, body)
console.log(`✓ 写入 lib/version.js：v${version} · ${channel} · ${commit} · ${build}`)
