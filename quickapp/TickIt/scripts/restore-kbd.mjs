import fs from 'fs'
const f = 'src/components/InputMethod/InputMethod.ux'
let s = fs.readFileSync(f, 'utf8')
s = s.replace(
  '<div class="page" style="flex-direction: column;position:absolute;left:0;bottom:0;width:336px;height:185px;z-index:999;">',
  '<div class="page" style="flex-direction: column;" show="{{!hide}}">'
)
fs.writeFileSync(f, s, 'utf8')
console.log('restored:', s.includes('show="{{!hide}}"'))
