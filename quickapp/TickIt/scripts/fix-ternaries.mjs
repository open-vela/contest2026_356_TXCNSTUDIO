import fs from 'fs'

const pages = ['viewer','numpad','notecreate','noteedit','notes','qrcode','token']
let total = 0

for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s

  // 在 isCircle === false 的 rect 分支内，{{isCircle ? A : B}} 永远取 B
  // 直接替换为 B 的值
  s = s.replace(/\{\{isCircle \? \d+ : (\d+)\}\}/g, '$1')

  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    const n = (before.match(/\{\{isCircle \? \d+ : \d+\}\}/g) || []).length
    total += n
    console.log(p + ': ' + n + ' redundant ternaries removed')
  }
}

// home 和 sync 的 ternary 是数据驱动（pillColor 等），保留
console.log('total redundant ternaries removed:', total)
