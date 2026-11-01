import fs from 'fs'
const pages = ['home','viewer','token','logout','confirm','sync','numpad','notecreate','noteedit','notes','list','priority','mode','deadline','qrcode','about']

for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  const s = fs.readFileSync(f, 'utf8')
  const t = s.substring(0, s.indexOf('</template>'))

  // 深度嵌套分析（打开标签减闭合标签）
  let maxD = 0, cur = 0
  const opens = t.match(/<([a-z][a-z0-9-]*)(?![^>]*\/>)/g) || []
  const closes = (t.match(/<\/[a-z][a-z0-9-]*>/g) || []).length
  for (const tag of t.matchAll(/<(\/?)([a-z][a-z0-9-]*)[^>]*?(\/?)>/g)) {
    if (tag[1] === '/') cur--
    else if (tag[3] !== '/') { cur++; maxD = Math.max(maxD, cur) }
  }

  // 图片清单
  const imgs = t.match(/src="([^"]*circle-[^"]*)"/g) || []
  // 可见图片数（非 if 保护的）
  const visibleImgs = imgs.filter(i => !i.includes('if'))

  // 可压缩的样式三元
  const styleTernary = (t.match(/style="[^"]*\{\{[^}]*\}\}[^"]*"/g) || []).length

  // 可加 static 的不变文本
  const staticTexts = (t.match(/<text(?!\s+static)[^>]*>\{\{(?!\$item)[^}]+\}\}<\/text>/g) || []).length

  // scroll 嵌套
  const scrolls = (t.match(/<scroll/g) || []).length

  if (maxD > 4 || styleTernary > 0 || visibleImgs.length > 6 || scrolls > 2) {
    console.log(p.padEnd(10) + ' depth=' + maxD + ' img=' + visibleImgs.length + ' styleTernary=' + styleTernary + ' scrolls=' + scrolls + ' staticText=' + staticTexts)
    if (styleTernary > 0) {
      const samples = t.match(/style="[^"]*\{\{[^}]*\}\}[^"]*"/g) || []
      for (const st of samples.slice(0, 3)) console.log('  ternary style: ' + st.substring(0, 80))
    }
  } else {
    console.log(p.padEnd(10) + ' depth=' + maxD + ' img=' + visibleImgs.length + ' ✅')
  }
}
