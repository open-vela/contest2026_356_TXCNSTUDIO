import fs from 'fs'
const pages = ['home','list','token','logout','sync','about','mode','priority','viewer','numpad','confirm','qrcode']
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  const s = fs.readFileSync(f, 'utf8')
  const lines = s.split(/\r?\n/)
  // 找出包含 btn-back / icon-back / timeStr 的行，检查是否有 if 条件
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    if ((l.includes('btn-back') || l.includes('icon-back') || l.includes('timeStr')) && !l.includes('if=')) {
      console.log(p.padEnd(10) + ' line ' + (i + 1) + ': NO IF GUARD  ' + l.trim().substring(0, 100))
    }
  }
}
console.log('scan done')
