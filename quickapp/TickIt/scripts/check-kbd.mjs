import fs from 'fs'
for (const p of ['notecreate', 'noteedit', 'numpad', 'token', 'viewer']) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  const s = fs.readFileSync(f, 'utf8')

  // InputMethod hide 绑定
  const imIdx = s.indexOf('<input-method')
  const imLine = s.substring(imIdx, s.indexOf('>', imIdx) + 1)
  const hideMatch = imLine.match(/hide="([^"]+)"/)

  // 遮罩层
  const overlayLines = s.split('\n').filter(l => l.includes('hideKeyboard') && l.includes('onclick'))

  // editing 是否在 private 中
  const hasEditing = s.includes('editing:') || s.includes('editing :')

  console.log(p + ': IM hide=' + (hideMatch ? hideMatch[1] : 'NONE') + '  overlays=' + overlayLines.length + '  hasEditing=' + hasEditing)
}
