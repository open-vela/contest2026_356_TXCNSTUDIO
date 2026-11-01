import fs from 'fs'
let s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
const lines = s.split('\n')
// 修复损坏的第 35 行和多余关闭标签
lines[34] = '    </div>'
// 删除多余的 36-37 行
lines.splice(35, 2)
s = lines.join('\n')
fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8')
console.log('fixed. lines 33-38:')
for (let i = 32; i < Math.min(38, lines.length); i++) {
  console.log(String(i + 1) + ': ' + JSON.stringify(lines[i]))
}
