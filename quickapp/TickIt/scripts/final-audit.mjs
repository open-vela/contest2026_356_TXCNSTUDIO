import fs from 'fs'

console.log('=== 极致优化：全面扫描 ===')

const pages = ['home','viewer','token','logout','confirm','sync','numpad','notecreate','noteedit','notes','list','priority','mode','deadline','qrcode','about']

for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  const s = fs.readFileSync(f, 'utf8')
  const issues = []

  // 1. 残留 console.log
  const cl = (s.match(/console\.log/g) || []).length
  if (cl > 0) issues.push('console.log x' + cl)

  // 2. 残留 !isCircle
  const neg = (s.match(/!isCircle/g) || []).length
  if (neg > 0) issues.push('!isCircle x' + neg)

  // 3. isCircle init 不是 null
  const init = s.match(/isCircle:\s*(\w+)/)?.[1]
  if (init && init !== 'null') issues.push('init=' + init)

  // 4. runGC 无 typeof 保护
  if (s.includes('global && global.runGC')) issues.push('runGC unsafe')

  // 5. InputMethod if 包裹
  if (/<input-method\s+if=/.test(s)) issues.push('IM if-wrapped')

  // 6. if+static 冲突
  const ifStatic = (s.match(/<image if="[^"]*"\s+static/g) || []).length
  if (ifStatic > 0) issues.push('if+static x' + ifStatic)

  // 7. import utils（应改 global）
  if (s.includes("import utils from")) issues.push('import utils')

  // 8. object-fit:cover 在圆屏（已缩放到336，不需要cover）
  const t = s.substring(s.indexOf('圆屏'), s.indexOf('</template>'))
  const cover = (t.match(/object-fit:cover/g) || []).length
  if (cover > 0) issues.push('cover x' + cover)

  // 9. 深嵌套（>5层）
  let depth = 0, maxDepth = 0
  for (const ch of t) {
    if (ch === '<') depth++
    if (ch === '>') { maxDepth = Math.max(maxDepth, depth); depth = Math.max(0, depth - 1) }
  }

  // 10. 无用 style 三元
  const ternary = (t.match(/\{\{isCircle \?/g) || []).length

  const status = issues.length === 0 ? '✅ OK' : '⚠ ' + issues.join(', ')
  console.log(p.padEnd(10) + ' depth=' + maxDepth + ' ternary=' + ternary + '  ' + status)
}

// InputMethod 检查
console.log('\n=== InputMethod ===')
const im = fs.readFileSync('src/components/InputMethod/InputMethod.ux', 'utf8')
console.log('$watch:', im.includes('this.$watch'))
console.log('console.log:', (im.match(/console\.log/g) || []).length)

// utils.js 检查
console.log('\n=== utils.js ===')
const u = fs.readFileSync('src/common/utils.js', 'utf8')
console.log('console.log:', (u.match(/console\.log/g) || []).length)
console.log('typeof runGC:', u.includes('typeof global.runGC'))
