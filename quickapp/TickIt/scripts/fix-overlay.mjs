import fs from 'fs'
for (const p of ['notecreate', 'noteedit', 'viewer', 'token', 'numpad']) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // 遮罩高度：圆屏 151px（止于键盘顶部），方屏 220px
  s = s.replace(
    /height:220px;" onclick="hideKeyboard"/g,
    'height:{{isCircle ? 151 : 220}}px;" onclick="hideKeyboard"'
  )
  // 已经是动态的不重复改
  s = s.replace(/height:\{\{isCircle \? 151 : \{\{isCircle \? 151 : 220\}\}\}\}px/g, 'height:{{isCircle ? 151 : 220}}px')
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': overlay height fixed')
  } else {
    console.log(p + ': already OK or no match')
  }
}
