import fs from 'fs'
let s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
const lines = s.split(/\r?\n/)

// 第 9-14 行是共享顶栏，加 isCircle === false 条件（圆屏不渲染，靠背景图自带顶栏）
for (let i = 8; i < 14; i++) {
  const l = lines[i]
  if (l.includes('btn-back-round') && !l.includes('if=')) {
    lines[i] = l.replace('<image static', '<image if="{{isCircle === false}}" static')
  }
  if (l.includes('position:absolute') && l.includes('254') && l.includes('onclick') && !l.includes('if=')) {
    lines[i] = l.replace('<div style=', '<div if="{{isCircle === false}}" style=')
  }
  if (l.includes('timeStr') && !l.includes('if=')) {
    lines[i] = l.replace('<text style=', '<text if="{{isCircle === false}}" style=')
  }
  if (l.includes('清单详情') && l.includes('top:{{isCircle') && !l.includes('if=')) {
    lines[i] = l.replace('<text static', '<text if="{{isCircle === false}}" static')
  }
}

s = lines.join('\n')
fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8')

// 验证
for (let i = 8; i < 15; i++) {
  console.log(String(i + 1).padStart(3) + ': ' + lines[i].trim().substring(0, 120))
}
