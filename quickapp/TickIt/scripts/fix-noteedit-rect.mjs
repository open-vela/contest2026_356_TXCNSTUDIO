import fs from 'fs'
let s = fs.readFileSync('src/pages/noteedit/noteedit.ux', 'utf8')
s = s.replace('<div if="{{editing}}" style="width:336px;height:100%;">', '<div if="{{isCircle === false && editing}}" style="width:336px;height:100%;">')
s = s.replace('<div else style="width:336px;height:100%;">', '<div elif="{{isCircle === false}}" style="width:336px;height:100%;">')
fs.writeFileSync('src/pages/noteedit/noteedit.ux', s, 'utf8')
console.log('done')
