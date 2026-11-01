import fs from 'fs'
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
const oldStr = 'show="{{circleAddVisible}}" src="../../common/circle-ctr-92.png"'
const newStr = 'src="../../common/circle-ctr-92.png"'
if (s.includes(oldStr)) {
  s = s.replace(oldStr, newStr)
  fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
  console.log('home: button always visible')
}

// notes 也一样
s = fs.readFileSync('src/pages/notes/notes.ux', 'utf8')
if (s.includes(oldStr)) {
  s = s.replace(oldStr, newStr)
  fs.writeFileSync('src/pages/notes/notes.ux', s, 'utf8')
  console.log('notes: button always visible')
}
