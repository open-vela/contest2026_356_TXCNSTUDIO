import fs from 'fs'
const s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')

// isCircle 初始值
const priv = s.match(/isCircle:\s*(\w+)/)
console.log('isCircle init:', priv?.[1])

// 所有 if 条件
const ifs = s.match(/if="\{\{[^"]+\}\}"/g) || []
console.log('\nall if conditions (' + ifs.length + '):')
for (const i of ifs) console.log('  ' + i)

// 检查是否有 !isCircle 残留
const neg = s.match(/!isCircle/g) || []
console.log('\n!isCircle count:', neg.length)

// 检查 top bar 是否在 if 外面
const topBar = s.indexOf('btn-back-round') !== -1 || s.indexOf('icon-back') !== -1
console.log('has top bar refs:', topBar)
