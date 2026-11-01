import fs from 'fs'
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
const circleStart = s.indexOf('圆屏')
const start = s.indexOf('for="{{items}}"', circleStart)
const end = s.indexOf('</scroll>', start)
let old = s.substring(start, end)
let nw = old
  .replace(/width:270px/g, 'width:293px')
  .replace(/height:90px/g, 'height:98px')
  .replace(/margin-left:33px/g, 'margin-left:22px')
  .replace(/left:100px/g, 'left:110px')
s = s.substring(0, start) + nw + s.substring(end)
fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
console.log('restored to 293x98, text left:110')
