import fs from 'fs'
for (const p of ['token', 'viewer']) {
  const f = `src/pages/${p}/${p}.ux`
  const s = fs.readFileSync(f, 'utf8')
  const t = s.substring(0, s.indexOf('</template>'))
  console.log(`\n=== ${p} ===`)
  console.log('tags:', (t.match(/<(div|image|text|scroll|img|marquee|input-method)[\s>]/g) || []).length)
  console.log('images:', (t.match(/<image /g) || []).length)
  console.log('scrolls:', (t.match(/<scroll /g) || []).length)
  console.log('ifs:', (t.match(/if=/g) || []).length)
  console.log('for loops:', (t.match(/for="/g) || []).length)

  // 列出所有 image src
  const imgs = t.match(/src="[^"]*"/g) || []
  console.log('image srcs:')
  for (const i of imgs) console.log('  ' + i)

  // 检查 if/elif 链长度
  const elifs = t.match(/elif=/g) || []
  console.log('elif count:', elifs.length)
}
