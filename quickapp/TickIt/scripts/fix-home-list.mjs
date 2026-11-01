import fs from 'fs'
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')

// scroll → list
s = s.replace(
  '<scroll if="{{isCircle && loaded && items.length>0}}" scroll-y="true"',
  '<list if="{{isCircle && loaded && items.length>0}}" scroll-y="true"'
)
// 闭合标签
const lastClose = s.lastIndexOf('</scroll>')
if (lastClose > 0) {
  s = s.substring(0, lastClose) + '</list>' + s.substring(lastClose + '</scroll>'.length)
}
// list-item 尾部的 div spacer 也改 list-item
s = s.replace(
  '<div static style="height:84px;min-height:84px;flex-shrink:0;"></div>',
  '<list-item type="spacer" style="height:84px;min-height:84px;flex-shrink:0;"></list-item>'
)

fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
console.log('fixed')
