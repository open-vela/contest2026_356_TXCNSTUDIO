import fs from 'fs'
const pages = ['home','list','sync','about','token','logout','mode','priority','viewer','numpad','confirm','qrcode']
let totalStatic = 0, totalCover = 0
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const circleStart = s.indexOf('圆屏')
  if (circleStart < 0) continue
  const circleEnd = s.indexOf('</template>')
  const circle = s.substring(circleStart, circleEnd)
  let mod = circle
  mod = mod.replace(/object-fit:cover;\s*/g, '')
  // 给不含 {{}} 的静态 div/text 加 static
  mod = mod.replace(/<div(?!\s+static)(\s+style="[^"]*")(?![^>]*\{\{)/g, '<div static$1')
  mod = mod.replace(/<text(?!\s+static)(\s+style="[^"]*")(?![^>]*\{\{)/g, '<text static$1')
  s = s.substring(0, circleStart) + mod + s.substring(circleEnd)
  const beforeStatic = (circle.match(/static/g) || []).length
  const afterStatic = (mod.match(/static/g) || []).length
  const beforeCover = (circle.match(/object-fit:cover/g) || []).length
  const afterCover = (mod.match(/object-fit:cover/g) || []).length
  totalStatic += afterStatic - beforeStatic
  totalCover += beforeCover - afterCover
  if (mod !== circle) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(`${p.padEnd(10)} static+${afterStatic - beforeStatic} cover-${beforeCover - afterCover}`)
  }
}
console.log(`---\ntotal: static+${totalStatic} cover-${totalCover}`)
