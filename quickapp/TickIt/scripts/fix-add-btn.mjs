import fs from 'fs'
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
s = s.replace(
  /if="\{\{isCircle && circleAddVisible\}\}"/,
  'if="{{isCircle}}" show="{{circleAddVisible}}"'
)
fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
console.log('done, replaced:', s.includes('show="{{circleAddVisible}}"'))
