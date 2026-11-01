import fs from 'fs'
const s = fs.readFileSync('build/pages/viewer/viewer.js', 'utf8')
const lines = s.split('\n')
for (const n of [1108, 1260, 1548]) {
  const i = n - 1
  console.log('=== line ' + n + ' ===')
  for (let j = Math.max(0, i - 3); j <= Math.min(lines.length - 1, i + 3); j++) {
    const marker = j === i ? '>>>' : '   '
    console.log(marker + ' ' + String(j + 1).padStart(4) + ': ' + (lines[j] || '').substring(0, 120))
  }
}
