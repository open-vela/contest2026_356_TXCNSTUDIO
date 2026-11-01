import fs from 'fs'
for (const p of ['numpad', 'notecreate']) {
  const f = `src/pages/${p}/${p}.ux`
  let s = fs.readFileSync(f, 'utf8')
  // 移除 if="{{editing}}"，改用 hide 控制
  s = s.replace(/<input-method\s+if="\{\{editing\}\}"/, '<input-method')
  s = s.replace(/hide="\{\{hide\}\}"/, 'hide="{{!editing || hide}}"')
  fs.writeFileSync(f, s, 'utf8')
  const idx = s.indexOf('<input-method')
  console.log(p + ': ' + s.substring(idx, idx + 120).replace(/\n/g, ' '))
}
