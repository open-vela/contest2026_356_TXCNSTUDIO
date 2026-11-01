import fs from 'fs'
const p = 'F:/新建文件夹/tickit/src/manifest.json'
let t = fs.readFileSync(p, 'utf8')
// 恢复默认启动页
t = t.replace('"entry": "pages/sync"', '"entry": "pages/home"')
fs.writeFileSync(p, t)
const m = t.match(/"entry":\s*"[^"]+"/)
console.log('entry now:', m && m[0])
