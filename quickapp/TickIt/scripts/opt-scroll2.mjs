import fs from 'fs'

// ===== 1. 移除所有 @scroll 事件（减少每帧 JS 调用） =====
const pages = ['home', 'viewer', 'token', 'logout', 'confirm', 'priority', 'notes', 'list', 'deadline']
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  s = s.replace(/ @scroll="[^"]*"/g, '')
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': @scroll removed')
  }
}

// ===== 2. home 列表 scroll → list（懒加载可见项） =====
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
if (s.includes('<scroll') && !s.includes('<list')) {
  // 把 scroll 换成 list（Vela list 组件支持懒加载）
  s = s.replace(
    /<scroll scroll-y="true" bounces="false"[^>]*>/,
    '<list scroll-y="true" bounces="false" style="position:absolute;left:0;top:110px;width:336px;height:226px;">'
  )
  s = s.replace(/<\/scroll>/, '</list>')
  // for 里的 div 改成 list-item
  s = s.replace(
    /<div for="\{\{items\}\}" style="width:293px;height:98px;/,
    '<list-item type="card" for="{{items}}" style="width:293px;height:98px;'
  )
  fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
  console.log('home: scroll → list')
}

// ===== 3. 所有 scroll 确保 bounces=false =====
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  s = s.replace(/<scroll scroll-y="true"(?! bounces)/g, '<scroll scroll-y="true" bounces="false"')
  fs.writeFileSync(f, s, 'utf8')
}

// ===== 4. viewer 的 scroll 也优化：减少滚动内容层 =====
s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
// scroll 内的 static div 再加上 if.static 让框架知道条件不变
fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8')

console.log('done')
