import fs from 'fs'
let s = fs.readFileSync('src/pages/sync/sync.ux', 'utf8')
// 去掉条件图上的 static（static + if 冲突，导致 if 不重新求值）
s = s.replace(/(<image if="\{\{isCircle[^"]*\}\}")\s+static\s+src/g, '$1 src')
// 去掉 if 尾部多余空格
s = s.replace(/\}\}"\s+"/g, '}}"')
fs.writeFileSync('src/pages/sync/sync.ux', s, 'utf8')
const t = s.substring(s.indexOf('圆屏背景'))
for (const l of t.split('\n').filter(l => l.includes('circle-sync'))) {
  console.log(l.trim().substring(0, 130))
}
