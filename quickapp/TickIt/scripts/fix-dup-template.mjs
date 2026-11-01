import fs from 'fs'
let s = fs.readFileSync('src/pages/logout/logout.ux', 'utf8')
const lines = s.split('\n')
// 找到并删除损坏的 <script></template> 行
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<script></template>')) {
    lines.splice(i, 1)
    console.log('removed line', i + 1)
    break
  }
}
s = lines.join('\n')
fs.writeFileSync('src/pages/logout/logout.ux', s, 'utf8')

// 同样检查 confirm
s = fs.readFileSync('src/pages/confirm/confirm.ux', 'utf8')
const lines2 = s.split('\n')
for (let i = 0; i < lines2.length; i++) {
  if (lines2[i].includes('<script></template>')) {
    lines2.splice(i, 1)
    console.log('confirm removed line', i + 1)
    break
  }
}
s = lines2.join('\n')
fs.writeFileSync('src/pages/confirm/confirm.ux', s, 'utf8')

// 验证
for (const p of ['logout', 'confirm']) {
  const v = fs.readFileSync(`src/pages/${p}/${p}.ux`, 'utf8')
  console.log(p + ': template count=' + (v.match(/<\/template>/g) || []).length + ', script count=' + (v.match(/<script>/g) || []).length)
}
