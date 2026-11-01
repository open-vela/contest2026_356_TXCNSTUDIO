import fs from 'fs'
const f = 'src/components/InputMethod/InputMethod.ux'
let s = fs.readFileSync(f, 'utf8')

// onclick → @click（组件内事件必须用 @click 绑定到组件方法）
const n1 = (s.match(/onclick="/g) || []).length
s = s.replace(/onclick="/g, '@click="')

fs.writeFileSync(f, s, 'utf8')
console.log('reverted onclick → @click:', n1, 'occurrences')

// 同时确认 <image> 标签保留（这是正确的 Vela 组件名）
const n2 = (s.match(/<image /g) || []).length
console.log('image tags:', n2)
