import fs from 'fs'
const s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
const circleStart = s.indexOf('圆屏')
const scrollStart = s.indexOf('for="{{items}}"', circleStart)
const scrollEnd = s.indexOf('</scroll>', scrollStart)
console.log(s.substring(scrollStart, scrollEnd))
