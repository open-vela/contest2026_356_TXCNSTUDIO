import fs from 'fs'
const s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
const start = s.indexOf('for="{{items}}"')
const end = s.indexOf('</scroll>')
console.log(s.substring(start, end))
