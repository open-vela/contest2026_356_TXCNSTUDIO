import fs from 'fs'
for (const p of ['viewer', 'token', 'sync', 'home']) {
  const f = `src/pages/${p}/${p}.ux`
  const s = fs.readFileSync(f, 'utf8')
  const lines = s.split(/\r?\n/)
  const out = []
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim()
    const prev = (lines[i-1] || '').trim()
    // 跳过孤立的 ) —— 前一行不是以 ( 或 , 结尾
    if (l === ')' && !prev.endsWith('(') && !prev.endsWith(',') && !prev.endsWith('function')) {
      continue
    }
    out.push(lines[i])
  }
  const result = out.join('\n')
  if (result !== s) {
    fs.writeFileSync(f, result, 'utf8')
    console.log(p + ': fixed orphan parens')
  }
}
console.log('done')
