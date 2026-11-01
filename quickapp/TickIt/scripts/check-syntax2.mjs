import fs from 'fs'
const s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
// 找真正的 script 内容（跳过 import 标签里的 script 字样）
const marker = '<script>'
const start = s.lastIndexOf(marker)
const end = s.lastIndexOf('</script>')
let js = s.substring(start + marker.length, end)
js = js.replace(/^\s*import .*$/gm, '')
js = js.replace('export default', 'var page =')
console.log('js length:', js.length)
console.log('first 200:', js.substring(0, 200))
console.log('---')
console.log('last 200:', js.substring(js.length - 200))
try {
  new Function(js)
  console.log('SYNTAX OK')
} catch (e) {
  console.log('ERROR: ' + e.message)
}
