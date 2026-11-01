import fs from 'fs'

// 把转发方法从 export default 移到 onInit 里的 this.xxx = function
// Vela VM 可能不把 export default 的方法复制到实例，但 onInit 里的 this 挂载一定生效
const pages = ['viewer', 'numpad', 'notecreate', 'noteedit', 'token']
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s

  // 移除 export default 里的转发方法
  s = s.replace(/\s*onBtnClick \(sign, evt\) \{[^}]*\},?/g, '')
  s = s.replace(/\s*onSelect \(num, evt\) \{[^}]*\},?/g, '')
  s = s.replace(/\s*onRsSelect \(txt\) \{[^}]*\},?/g, '')
  s = s.replace(/\s*onSelectWaiting \(i\) \{[^}]*\},?/g, '')

  // 在 onInit 里挂到 this
  s = s.replace(
    /onInit \(\) \{/,
    `onInit () {
      this.onBtnClick = function(sign, evt) { if (global.__kbd) return global.__kbd.onBtnClick(sign) }
      this.onSelect = function(num, evt) { if (global.__kbd) return global.__kbd.onSelect(num) }
      this.onRsSelect = function(txt) { if (global.__kbd) return global.__kbd.onRsSelect(txt) }
      this.onSelectWaiting = function(i) { if (global.__kbd) return global.__kbd.onSelectWaiting(i) }`
  )

  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': methods moved to onInit')
  }
}
