import fs from 'fs'

// ===== 优化所有 scroll：static + bounces=false =====
const pages = ['home', 'viewer', 'token', 'logout', 'confirm', 'priority', 'list', 'notes']
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s

  // scroll 加 bounces="false" 减少回弹计算
  s = s.replace(/<scroll scroll-y="true"/g, '<scroll scroll-y="true" bounces="false"')

  // scroll 内的固定高度内容容器加 static（内容不随数据变化）
  s = s.replace(
    /<div style="width:336px;height:\d+(?:\.\d+)?px;min-height:\d+(?:\.\d+)?px;flex-shrink:0;">/g,
    '<div static style="width:336px;height:417.2px;min-height:417.2px;flex-shrink:0;">'
  )

  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': scroll optimized')
  }
}

// ===== viewer scroll 内容高度特定修正 =====
let s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
s = s.replace(
  '<div static style="width:336px;height:417.2px;min-height:417.2px;flex-shrink:0;">',
  '<div static style="width:336px;height:785px;min-height:785px;flex-shrink:0;">'
)
fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8')
console.log('viewer: content height fixed to 785px')

// ===== home scroll 也优化 =====
s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
s = s.replace(
  /<scroll scroll-y="true"([^>]*?)>/g,
  '<scroll scroll-y="true" bounces="false"$1>'
)
fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
console.log('home: bounces=false added')

console.log('done')
