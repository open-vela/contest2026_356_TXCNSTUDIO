import fs from 'fs'
let s = fs.readFileSync('src/pages/confirm/confirm.ux', 'utf8')

// 内容高度改成 426（匹配 480x609 设计稿 ×0.7），这样才有滚动空间
s = s.replace(
  'style="width:336px;height:336px;min-height:336px;flex-shrink:0;"',
  'style="width:336px;height:426px;min-height:426px;flex-shrink:0;"'
)

fs.writeFileSync('src/pages/confirm/confirm.ux', s, 'utf8')

// logout 同样检查
s = fs.readFileSync('src/pages/logout/logout.ux', 'utf8')
const hasScroll = s.includes('<scroll scroll-y')
console.log('logout has scroll:', hasScroll)
if (hasScroll) {
  s = s.replace(
    'style="width:336px;height:336px;min-height:336px;flex-shrink:0;"',
    'style="width:336px;height:417px;min-height:417px;flex-shrink:0;"'
  )
  fs.writeFileSync('src/pages/logout/logout.ux', s, 'utf8')
  console.log('logout content height fixed')
}

// 验证
for (const p of ['confirm', 'logout']) {
  const v = fs.readFileSync(`src/pages/${p}/${p}.ux`, 'utf8')
  const t = v.substring(v.indexOf('圆屏'), v.indexOf('</template>'))
  const scroll = t.includes('<scroll')
  const h = t.match(/height:(\d+)px;min-height/)?.[1]
  console.log(p + ': scroll=' + scroll + ' contentH=' + h)
}
