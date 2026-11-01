import fs from 'fs'
const f = 'src/components/InputMethod/InputMethod.ux'
let s = fs.readFileSync(f, 'utf8')

// 根节点去掉 show 控制（临时排查）——键盘始终可见
const before = s
s = s.replace(
  '<div class="page" style="flex-direction: column;" show="{{!hide}}">',
  '<div class="page" style="flex-direction: column;position:absolute;left:0;bottom:0;width:336px;height:185px;z-index:999;">'
)

if (s !== before) {
  fs.writeFileSync(f, s, 'utf8')
  console.log('InputMethod root: always visible with explicit dimensions')
} else {
  console.log('pattern not found')
}
