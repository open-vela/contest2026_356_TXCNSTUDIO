import fs from 'fs'

// 1. viewer if+static
let s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
const before = s
s = s.replace(/(<image if="\{\{[^"]*\}\}")\s+static(\s+src)/g, '$1$2')
if (s !== before) { fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8'); console.log('viewer if+static fixed') }

// 2. notes/notecreate/noteedit isCircle init
for (const p of ['notes', 'notecreate', 'noteedit']) {
  const f = `src/pages/${p}/${p}.ux`
  s = fs.readFileSync(f, 'utf8')
  const b = s
  s = s.replace(/isCircle:\s*false/, 'isCircle: null')
  s = s.replace(/if="\{\{!isCircle\}\}"/g, 'if="{{isCircle === false}}"')
  if (s !== b) { fs.writeFileSync(f, s, 'utf8'); console.log(p + ' isCircle init fixed') }
}

// 3. utils.js runGC typeof 保护
s = fs.readFileSync('src/common/utils.js', 'utf8')
const b2 = s
s = s.replace(/if \(global && global\.runGC\)/g, 'if (typeof global.runGC === "function")')
if (s !== b2) { fs.writeFileSync('src/common/utils.js', s, 'utf8'); console.log('utils.js runGC fixed') }

console.log('done')
