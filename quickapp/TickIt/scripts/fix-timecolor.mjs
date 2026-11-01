import fs from 'fs'
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
// 移除 timeColor 文字的 static（static 让绑定只算一次，颜色不更新）
const oldStr = '<text static style="position:absolute;left:110px;top:52px;width:140px;font-size:18px;color:{{'
const newStr = '<text style="position:absolute;left:110px;top:52px;width:140px;font-size:18px;color:{{'
if (!s.includes(oldStr)) { console.log('not found'); process.exit(1) }
s = s.replace(oldStr, newStr)
fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
console.log('done')
