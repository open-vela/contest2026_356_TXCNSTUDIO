import fs from 'fs'
const f = 'src/components/InputMethod/InputMethod.ux'
let s = fs.readFileSync(f, 'utf8')

// @click → onclick（Vela 文档标准语法）
const before = s
s = s.replace(/@click="/g, 'onclick="')

// <img → <image（Vela 组件名）
s = s.replace(/<img /g, '<image ')
s = s.replace(/<\/img>/g, '</image>')

fs.writeFileSync(f, s, 'utf8')
console.log('click syntax:', (before.match(/@click/g)||[]).length, '→', (s.match(/onclick/g)||[]).length)
console.log('img tags:', (s.match(/<image /g)||[]).length)
