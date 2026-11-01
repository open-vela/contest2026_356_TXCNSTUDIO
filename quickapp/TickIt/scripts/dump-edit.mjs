import fs from 'fs'
const s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
// 找编辑模式的模板部分
const idx = s.indexOf('if="{{editing}}"')
console.log(s.substring(idx, idx + 600))
