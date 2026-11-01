import fs from 'fs'
const s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
const start = s.indexOf('<script>')
const end = s.lastIndexOf('</script>')
let js = s.substring(start + 8, end)
js = js.replace(/^\s*import .*$/gm, '')
js = js.replace('export default', 'var page =')
try {
  new Function(js)
  console.log('SYNTAX OK')
} catch (e) {
  console.log('ERROR: ' + e.message)
  const lines = js.split('\n')
  const ln = parseInt(e.message.match(/line (\d+)/)?.[1] || '0')
  for (let i = Math.max(0, ln - 3); i < Math.min(lines.length, ln + 3); i++) {
    console.log(String(i + 1).padStart(4) + ': ' + lines[i])
  }
}
