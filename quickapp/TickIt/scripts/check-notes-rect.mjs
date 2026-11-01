import fs from 'fs'
for (const p of ['noteedit', 'notecreate']) {
  const s = fs.readFileSync(`src/pages/${p}/${p}.ux`, 'utf8')
  const t = s.substring(0, s.indexOf('</template>'))
  const lines = t.split('\n')
  let count = 0
  for (const l of lines) {
    if (/if="\{\{(empty|loading|editing)\}\}"/.test(l) || (l.includes('else style') && !l.includes('isCircle'))) {
      console.log(p + ': unguarded → ' + l.trim().substring(0, 80))
      count++
    }
  }
  if (count === 0) console.log(p + ': OK')
}
