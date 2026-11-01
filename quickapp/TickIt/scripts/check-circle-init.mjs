import fs from 'fs'
const pages = ['home','list','token','logout','sync','about','mode','priority','viewer','numpad','confirm','qrcode']
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  const s = fs.readFileSync(f, 'utf8')
  const m = s.match(/isCircle:\s*(\w+)/)
  const rect = (s.match(/if="\{\{!isCircle\}\}"/g) || []).length
  const circ = (s.match(/if="\{\{isCircle/g) || []).length
  console.log(p.padEnd(10) + ' init=' + m?.[1] + '  rectIf=' + rect + '  circleIf=' + circ)
}
