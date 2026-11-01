import fs from 'fs'

// 修正被统一改成 417.2px 的内容高度
const fixes = {
  'confirm': '426px',
  'priority': '548px',
  'logout': '417px',
}

for (const [p, h] of Object.entries(fixes)) {
  const f = `src/pages/${p}/${p}.ux`
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  s = s.replace(/height:417\.2px;min-height:417\.2px/g, `height:${h};min-height:${h}`)
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': height fixed to ' + h)
  }
}

console.log('done')
