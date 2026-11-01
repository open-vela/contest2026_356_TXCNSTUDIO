import fs from 'fs'
for (const p of ['numpad', 'notecreate', 'noteedit', 'token']) {
  const f = `src/pages/${p}/${p}.ux`
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // 修复 export default { }, }, }, }, → export default {
  s = s.replace(/export default \{ \}, \}, \}, \},/g, 'export default {')
  s = s.replace(/export default \{ \}, \}, \},/g, 'export default {')
  s = s.replace(/export default \{ \}, \},/g, 'export default {')
  s = s.replace(/export default \{ \},/g, 'export default {')
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': fixed')
  } else {
    console.log(p + ': pattern not found')
  }
}
