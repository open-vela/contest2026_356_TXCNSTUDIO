import fs from 'fs'
let s = fs.readFileSync('src/components/InputMethod/InputMethod.ux', 'utf8')
const lines = s.split(/\r?\n/)
const out = []
let skip = false
for (let i = 0; i < lines.length; i++) {
  const l = lines[i]
  if (l.includes('watchHidePropsChange(newV') || l.includes('watchMaxLengthPropsChange(newV')) {
    skip = true
    continue
  }
  if (skip) {
    // 跳到下一个顶层方法（以  }, 开头后跟空行或下一个方法）
    if (l.trim() === '},') { skip = false }
    continue
  }
  out.push(l)
}
s = out.join('\n')
fs.writeFileSync('src/components/InputMethod/InputMethod.ux', s, 'utf8')
console.log('removed watcher callbacks:', !s.includes('watchHidePropsChange(newV'))
