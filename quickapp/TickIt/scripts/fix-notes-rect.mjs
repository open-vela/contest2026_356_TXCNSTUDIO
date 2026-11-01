import fs from 'fs'
let s = fs.readFileSync('src/pages/notes/notes.ux', 'utf8')
s = s.replace('<div if="{{empty}}">', '<div if="{{isCircle === false && empty}}">')
s = s.replace('<div elif="{{loading}}">', '<div elif="{{isCircle === false && loading}}">')
s = s.replace('<div else style="flex:1;flex-direction:column;">', '<div elif="{{isCircle === false}}" style="flex:1;flex-direction:column;">')
fs.writeFileSync('src/pages/notes/notes.ux', s, 'utf8')
console.log('done')
