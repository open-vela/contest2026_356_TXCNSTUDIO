import fs from 'fs'
let s = fs.readFileSync('src/pages/notes/notes.ux', 'utf8')
const oldStr = '      <!-- 空状态 -->'
const newStr = `      <!-- 新建按钮（容器92） -->
      <image if="{{isCircle}}" show="{{circleAddVisible}}" src="../../common/circle-ctr-92.png" style="position:absolute;left:112px;top:252px;width:112px;height:66.5px;" onclick="addNote"></image>
      <!-- 空状态 -->`
if (!s.includes(oldStr)) { console.log('not found'); process.exit(1) }
s = s.replace(oldStr, newStr)
// 加 circleAddVisible 状态
s = s.replace('isCircle: null,', 'isCircle: null,\n      circleAddVisible: false,')
fs.writeFileSync('src/pages/notes/notes.ux', s, 'utf8')
console.log('done')
