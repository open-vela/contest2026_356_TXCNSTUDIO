import fs from 'fs'
const s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
const t = s.substring(s.indexOf('圆屏'))
const start = t.indexOf('for="{{items}}"')
const end = t.indexOf('</scroll>')
console.log(t.substring(start, end))
