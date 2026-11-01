import fs from 'fs'

// ===== 1. 移除所有非必要 console.log（减少 bytecode 体积） =====
const pages = ['home', 'viewer', 'token', 'logout', 'confirm', 'sync', 'numpad', 'notecreate', 'noteedit', 'notes', 'list', 'priority', 'mode', 'deadline', 'qrcode', 'about']
let removed = 0
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // 移除所有 console.log（保留 console.error）
  s = s.replace(/^[ \t]*console\.log\(.*\)[ \t]*\r?\n/gm, '')
  // 移除孤立的 console.log 语句（可能在行内）
  s = s.replace(/console\.log\([^)]*\);?\s*/g, '')
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    const n = (before.match(/console\.log/g) || []).length
    removed += n
    console.log(p + ': removed ' + n + ' console.log')
  }
}

// ===== 2. utils.js 也清理 =====
let s = fs.readFileSync('src/common/utils.js', 'utf8')
const before = s
s = s.replace(/^[ \t]*console\.log\(.*\)[ \t]*\r?\n/gm, '')
s = s.replace(/console\.log\([^)]*\);?\s*/g, '')
if (s !== before) {
  fs.writeFileSync('src/common/utils.js', s, 'utf8')
  const n = (before.match(/console\.log/g) || []).length
  removed += n
  console.log('utils.js: removed ' + n + ' console.log')
}

// ===== 3. InputMethod 也清理 =====
s = fs.readFileSync('src/components/InputMethod/InputMethod.ux', 'utf8')
const before2 = s
s = s.replace(/^[ \t]*console\.log\(.*\)[ \t]*\r?\n/gm, '')
s = s.replace(/console\.log\([^)]*\);?\s*/g, '')
if (s !== before2) {
  fs.writeFileSync('src/components/InputMethod/InputMethod.ux', s, 'utf8')
  const n = (before2.match(/console\.log/g) || []).length
  removed += n
  console.log('InputMethod: removed ' + n + ' console.log')
}

// ===== 4. adapt.js 清理 =====
s = fs.readFileSync('src/common/adapt.js', 'utf8')
const before3 = s
s = s.replace(/^[ \t]*console\.log\(.*\)[ \t]*\r?\n/gm, '')
if (s !== before3) {
  fs.writeFileSync('src/common/adapt.js', s, 'utf8')
  console.log('adapt.js: cleaned')
}

console.log('total console.log removed:', removed)
