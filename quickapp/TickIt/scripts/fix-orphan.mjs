import fs from 'fs'
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
// 修复被 console.log 删除后残留的孤立括号
s = s.replace(/=== '\[object Array\]'\s*\n\s*\)\s*\n/, "=== '[object Array]'\n")
// 也修复其他可能的孤立行
const lines = s.split(/\r?\n/)
const out = []
for (let i = 0; i < lines.length; i++) {
  const l = lines[i].trim()
  // 跳过孤立的 ) 行（前后不是函数调用的一部分）
  if (l === ')' && i > 0 && !lines[i-1].trim().endsWith('(') && !lines[i-1].trim().endsWith(',')) {
    console.log('removed orphan ) at line', i + 1)
    continue
  }
  out.push(lines[i])
}
s = out.join('\n')
fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
console.log('fixed')
