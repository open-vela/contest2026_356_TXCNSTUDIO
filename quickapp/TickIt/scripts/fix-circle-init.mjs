import fs from 'fs'
const pages = ['home','list','token','logout','sync','about','mode','priority','viewer','numpad','confirm','qrcode']
let total = 0
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // 1. isCircle 初始值 false → null（探测完成前两边都不渲染）
  s = s.replace(/isCircle:\s*false/, 'isCircle: null')
  // 2. 方屏分支条件 !isCircle → isCircle === false（null 时不渲染）
  s = s.replace(/if="\{\{!isCircle\}\}"/g, 'if="{{isCircle === false}}"')
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    const n = (before.match(/isCircle:\s*false/g) || []).length + (before.match(/if="\{\{!isCircle\}\}"/g) || []).length
    total += n
    console.log(p.padEnd(10) + ' fixed ' + n + ' places')
  }
}
console.log('total ' + total + ' places fixed')
