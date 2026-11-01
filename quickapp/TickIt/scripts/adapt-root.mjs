// 把各页根容器 height:480px -> height:100%（仅首个含 background-color:#000000 的根 div）
// 以此让页面高度随屏幕形状自适应（矩形 480 物理=100% 不变；圆屏/胶囊自动收放）
// 运行：node scripts/adapt-root.mjs
import fs from 'fs'
import path from 'path'

const PAGES = ['home','list','numpad','viewer','confirm','qrcode','sync','token','logout','about','notes','notecreate','noteedit']
const ROOT = path.join(import.meta.dirname, '..', 'src', 'pages')

let total = 0
for (const p of PAGES) {
  const file = path.join(ROOT, p, p + '.ux')
  if (!fs.existsSync(file)) { console.log('skip (no file):', p); continue }
  let src = fs.readFileSync(file, 'utf8')
  // 只匹配根 div 的那一行：style 内 `flex-direction:column;width:336px;height:480px;background-color:#000000`
  const before = src
  src = src.replace(/style="flex-direction:column;width:336px;height:480px;background-color:#000000;"/, 'style="flex-direction:column;width:336px;height:100%;background-color:#000000;"')
  if (src !== before) { fs.writeFileSync(file, src, 'utf8'); total++ }
  else console.log('NO-ROOT-MATCH:', p)
}
console.log('pages patched root height:100%:', total)