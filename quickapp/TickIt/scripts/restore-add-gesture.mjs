import fs from 'fs'

// 恢复按钮 show 控制
for (const p of ['home', 'notes']) {
  const f = `src/pages/${p}/${p}.ux`
  let s = fs.readFileSync(f, 'utf8')
  const oldStr = 'src="../../common/circle-ctr-92.png"'
  const newStr = 'show="{{circleAddVisible}}" src="../../common/circle-ctr-92.png"'
  if (s.includes(oldStr) && !s.includes(newStr)) {
    s = s.replace(oldStr, newStr)
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': button gesture show/hide restored')
  }
}
