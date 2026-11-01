import fs from 'fs'
const s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
const idx = s.indexOf('if="{{editing}}"')
console.log(s.substring(idx, idx + 600))
