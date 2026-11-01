import fs from 'fs'
const s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
const t = s.substring(s.indexOf('圆屏'))

// 找 scroll
const scrollStart = t.indexOf('<scroll')
const scrollEnd = t.indexOf('</scroll>')
if (scrollStart < 0) { console.log('NO SCROLL'); process.exit(1) }
const scroll = t.substring(scrollStart, scrollEnd)
const ifMatch = scroll.match(/if="([^"]+)"/)
const forMatch = scroll.match(/for="([^"]+)"/)
console.log('scroll if:', ifMatch?.[1])
console.log('card for:', forMatch?.[1])

// 背景图条件
console.log('\nbackground conditions:')
for (const m of t.matchAll(/<image\s+(?:if|elif)="([^"]+)"[^>]*src="([^"]+)"/g)) {
  console.log('  ' + m[1].substring(0, 50) + '  →  ' + m[2].split('/').pop())
}

// items 依赖
console.log('\nitems fields used in scroll:')
const fields = scroll.match(/\$item\.\w+/g) || []
console.log([...new Set(fields)].join(', '))
