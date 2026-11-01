import fs from 'fs'
const pages = ['home','list','token','logout','sync','about','mode','priority','viewer','numpad','confirm','qrcode']
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // if + static 同时出现在 image 上 → static 会阻止 if 重新求值
  s = s.replace(/(<image if="\{\{[^"]*\}\}")\s+static(\s+src)/g, '$1$2')
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    const n = before.length - s.length
    console.log(p.padEnd(10) + ' fixed (' + n + ' bytes)')
  }
}
console.log('done')
