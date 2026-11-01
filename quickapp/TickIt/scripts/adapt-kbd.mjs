// InputMethod 键盘多屏适配：把 circle 分支坐标从 480 物理基准换算到 336 设计基准（×0.7）
// 仅处理 circle 分支（`<div if="{{screentype==='circle'}}"` 块）及其专属 CSS 类，
// pill（×1.75）待胶囊屏阶段再做。运行：node scripts/adapt-kbd.mjs
import fs from 'fs'
import path from 'path'

const FILE = path.join(import.meta.dirname, '..', 'src', 'components', 'InputMethod', 'InputMethod.ux')
let lines = fs.readFileSync(FILE, 'utf8').split('\n')

// circle 分支行范围：从 `<div if="{{screentype==='circle'}}"` 到 `<!-- 方屏67 -->` 之前
const startIdx = lines.findIndex(l => l.includes("screentype==='circle'"))
const endIdx = lines.findIndex(l => l.includes('<!-- 方屏67 -->'))
if (startIdx < 0 || endIdx < 0 || endIdx <= startIdx) {
  console.error('circle block not found:', startIdx, endIdx)
  process.exit(1)
}

const K = 0.7
const conv = v => Math.round(v * K)

// 只替换 style="..." 内联样式中 `数字px` 的长度数值
function rescaleStyleAttr (str) {
  return str.replace(/style="([^"]*)"/g, (_m, body) => {
    const out = body.replace(/(-?\d+(?:\.\d+)?)px/g, (_mm, num) => conv(parseFloat(num)) + 'px')
    return 'style="' + out + '"'
  })
}

let changed = 0
for (let i = startIdx; i <= endIdx; i++) {
  if (lines[i].includes('style=')) {
    const before = lines[i]
    lines[i] = rescaleStyleAttr(before)
    if (lines[i] !== before) changed++
  }
}

// 把 circle 分支里的 `class="calbtn0"` 改名为 `calbtn0c`（.calbtn0 被 pill 分支共用，必须隔离）
for (let i = startIdx; i <= endIdx; i++) {
  lines[i] = lines[i].replace(/class="calbtn0"/g, 'class="calbtn0c"')
}

// 定位 CSS 块，整块按行换算 circle 专属类；.calbtn0 保留
const styleStart = lines.findIndex(l => l.trim() === '<style>')
const styleEnd = lines.findIndex(l => l.trim() === '</style>')
if (styleStart < 0 || styleEnd < 0 || styleEnd <= styleStart) {
  console.error('style block not found')
  process.exit(1)
}

const exclusive = new Set(['.calbtnfull', '.calbtnt9', '.caltext', '.list3', '.item3', '.waiting-keys'])
let curClass = null
let cssChanged = 0
let calbtn0block = -1
for (let i = styleStart + 1; i < styleEnd; i++) {
  const m = lines[i].match(/^(\.[\w-]+)\s*\{/)
  if (m) {
    curClass = m[1]
    if (curClass === '.calbtn0') calbtn0block = i
  }
  if (curClass && exclusive.has(curClass)) {
    const before = lines[i]
    lines[i] = lines[i].replace(/(-?\d+(?:\.\d+)?)px/g, (_mm, num) => conv(parseFloat(num)) + 'px')
    if (lines[i] !== before) cssChanged++
  }
}

// .calbtn0 → 生成 .calbtn0c（与 .calbtn0 相同的行，类名与数值×0.7）
let calbtn0css = []
if (calbtn0block >= 0) {
  const srcClass = lines[calbtn0block]
  const closeIdx = lines.slice(calbtn0block).findIndex(l => l.trim() === '}')
  calbtn0css = lines.slice(calbtn0block, calbtn0block + closeIdx + 1).map(l =>
    l.replace(/(-?\d+(?:\.\d+)?)px/g, (_mm, num) => conv(parseFloat(num)) + 'px').replace('.calbtn0', '.calbtn0c')
  )
  // 插入到 </style> 之前
  lines.splice(styleEnd, 0, '', ...calbtn0css)
}

fs.writeFileSync(FILE, lines.join('\n'), 'utf8')
console.log('circle branch style attrs changed:', changed)
console.log('circle-only CSS rules changed:', cssChanged)
console.log('calbtn0c block lines appended:', calbtn0css.length)