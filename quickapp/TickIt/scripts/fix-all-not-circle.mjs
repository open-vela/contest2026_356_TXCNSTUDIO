import fs from 'fs'
const pages = ['home','list','token','logout','sync','about','mode','priority','viewer','numpad','confirm','qrcode']
let total = 0
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // !isCircle → isCircle === false（null 时 !null=true 会误渲染方屏）
  s = s.replace(/!isCircle/g, 'isCircle === false')
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    const n = (before.match(/!isCircle/g) || []).length
    total += n
    console.log(p.padEnd(10) + ' fixed ' + n + ' places')
    // 显示修改后的上下文
    const lines = s.split(/\r?\n/)
    for (const l of lines) {
      if (l.includes('isCircle === false')) console.log('  ' + l.trim().substring(0, 110))
    }
  }
}
console.log('total ' + total + ' fixed')
