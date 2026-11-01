import fs from 'fs'
const pages = ['home','list','viewer','numpad','token','logout','confirm','deadline','priority','mode','sync','about','qrcode','notes','notecreate','noteedit']
console.log('=== 性能指标 ===')
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) { console.log(p + ': NOT FOUND'); continue }
  const s = fs.readFileSync(f, 'utf8')
  const t = s.substring(0, s.indexOf('</template>'))

  // 1. !isCircle 残留
  const negIsCircle = (s.match(/!isCircle/g) || []).length

  // 2. isCircle 初始值
  const init = s.match(/isCircle:\s*(\w+)/)?.[1]

  // 3. runGC typeof 保护
  const runGCUnsafe = s.includes('global && global.runGC')

  // 4. InputMethod if 包裹
  const imIf = /<input-method\s+if=/.test(s)

  // 5. if + static 同时出现在 image 上
  const ifStatic = (s.match(/<image if="[^"]*"\s+static/g) || []).length

  // 6. DOM 节点数
  const tags = (t.match(/<(div|image|text|scroll|img|marquee|input-method)[\s>]/g) || []).length

  // 7. 条件渲染数
  const ifs = (t.match(/if=/g) || []).length

  const issues = []
  if (negIsCircle > 0) issues.push('!isCircle x' + negIsCircle)
  if (init !== 'null') issues.push('init=' + init)
  if (runGCUnsafe) issues.push('runGC unsafe')
  if (imIf) issues.push('IM if-wrapped')
  if (ifStatic > 0) issues.push('if+static x' + ifStatic)

  const status = issues.length === 0 ? 'OK' : issues.join(', ')
  console.log(p.padEnd(10) + ' tags=' + String(tags).padStart(3) + ' ifs=' + String(ifs).padStart(3) + '  ' + status)
}

// InputMethod 检查
console.log('\n=== InputMethod ===')
const im = fs.readFileSync('src/components/InputMethod/InputMethod.ux', 'utf8')
console.log('has $watch:', im.includes('this.$watch'))
console.log('has watchHidePropsChange(newV:', im.includes('watchHidePropsChange(newV'))
console.log('has watchMaxLengthPropsChange(newV:', im.includes('watchMaxLengthPropsChange(newV'))

// utils.js 检查
console.log('\n=== utils.js ===')
const u = fs.readFileSync('src/common/utils.js', 'utf8')
console.log('challenge cookie cached:', u.includes('todo_challenge_cookie'))
console.log('typeof runGC:', u.includes('typeof global.runGC'))

// adapt.js 检查
console.log('\n=== adapt.js ===')
const a = fs.readFileSync('src/common/adapt.js', 'utf8')
console.log('isCircleSync returns null:', a.includes('return null'))
