import fs from 'fs'
import path from 'path'
const dir = 'F:/新建文件夹/tickit/src/pages'
for (const name of fs.readdirSync(dir)) {
  const f = path.join(dir, name, name + '.ux')
  if (!fs.existsSync(f)) continue
  const t = fs.readFileSync(f, 'utf8')
  console.log(name.padEnd(12), JSON.stringify({
    adapt: t.includes('import adapt from'),
    isCircle: t.includes('isCircle:'),
    sync: t.includes('isCircleSync'),
    probe: t.includes('adapt.probe'),
    auto: t.includes('screentype="auto"'),
    h100: t.includes('height:100%'),
    circle: (t.match(/isCircle \?/g) || []).length
  }))
}
