import fs from 'fs'

// 1. InputMethod 的 onInit 里把方法挂到 global
let s = fs.readFileSync('src/components/InputMethod/InputMethod.ux', 'utf8')
if (!s.includes('global.__kbd')) {
  s = s.replace(
    /onInit\(\) \{/,
    `onInit() {
      // 把组件实例挂到 global，供页面 click 处理器调用（Vela 组件 @click 会被编译到页面 VM）
      global.__kbd = this`
  )
  fs.writeFileSync('src/components/InputMethod/InputMethod.ux', s, 'utf8')
  console.log('InputMethod: global.__kbd registered')
}

// 2. 各页面加转发方法（让 _vm_.onBtnClick / _vm_.onSelect 能找到）
const pages = ['viewer', 'numpad', 'notecreate', 'noteedit', 'token']
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  s = fs.readFileSync(f, 'utf8')
  if (s.includes('global.__kbd')) continue

  s = s.replace(
    /export default \{/,
    `export default {
    onBtnClick (sign, evt) { if (global.__kbd) { return global.__kbd.onBtnClick(sign) } },
    onSelect (num, evt) { if (global.__kbd) { return global.__kbd.onSelect(num) } },
    onRsSelect (txt) { if (global.__kbd) { return global.__kbd.onRsSelect(txt) } },
    onSelectWaiting (i) { if (global.__kbd) { return global.__kbd.onSelectWaiting(i) } },`
  )
  fs.writeFileSync(f, s, 'utf8')
  console.log(p + ': kbd forwarding methods added')
}
