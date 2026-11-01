import fs from 'fs'
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
const old = 'var previous = this._circleScrollY || 0'
const rep = 'var now = Date.now(); if (this._scrollThrottle && now - this._scrollThrottle < 100) { return }; this._scrollThrottle = now; var previous = this._circleScrollY || 0'
if (!s.includes(old)) { console.log('not found'); process.exit(1) }
s = s.replace(old, rep)
fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
console.log('throttled')
