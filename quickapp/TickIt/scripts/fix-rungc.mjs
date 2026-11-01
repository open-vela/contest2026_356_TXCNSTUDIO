import fs from 'fs'
const pages = ['home','list','token','logout','sync','about','mode','priority','viewer','numpad','confirm','qrcode','notecreate','noteedit','notes']
let total = 0
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // global.runGC 加 typeof 保护，防止 runGC 非函数时闪退
  s = s.replace(/if \(global && global\.runGC\) \{/g, 'if (typeof global.runGC === "function") {')
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    total++
    console.log(p + ' fixed')
  }
}
console.log(total + ' files fixed')
