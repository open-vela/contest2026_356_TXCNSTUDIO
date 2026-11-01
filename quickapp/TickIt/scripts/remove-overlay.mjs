import fs from 'fs'

// 移除独立遮罩层（它是透明的但会拦截触摸事件）
// 键盘收起改为：点击输入卡片外的输入区域本身触发
for (const p of ['notecreate', 'noteedit', 'numpad', 'viewer']) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s

  // 删除遮罩层 div（单独的 hideKeyboard 点击区）
  s = s.replace(
    /<!-- 点击空白收起输入法[^>]*-->\s*\n\s*<div if="\{\{!hide\}\}"[^>]*onclick="hideKeyboard"[^>]*><\/div>\s*\n/g,
    ''
  )

  // 如果还有残留
  s = s.replace(
    /<div if="\{\{!hide\}\}" style="position:absolute;left:0;top:0;width:336px;height:\{\{isCircle \? 151 : 220\}\}px;" onclick="hideKeyboard"><\/div>\s*\n/g,
    ''
  )

  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': overlay removed')
  } else {
    console.log(p + ': no overlay found')
  }
}
