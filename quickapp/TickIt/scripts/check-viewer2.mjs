import fs from 'fs'
const s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
const t = s.substring(0, s.indexOf('</template>'))

// 找出所有 if 条件及其所在行
const lines = t.split(/\r?\n/)
for (let i = 0; i < lines.length; i++) {
  const l = lines[i]
  if (l.includes('isCircle') || l.includes('editing')) {
    console.log(String(i + 1).padStart(4) + ': ' + l.trim().substring(0, 120))
  }
}

console.log('\n=== top bar elements ===')
for (let i = 0; i < lines.length; i++) {
  const l = lines[i]
  if (l.includes('btn-back') || l.includes('icon-back') || l.includes('btn-check') || l.includes('timeStr') || l.includes('确认') || l.includes('清单详情')) {
    console.log(String(i + 1).padStart(4) + ': ' + l.trim().substring(0, 130))
  }
}
