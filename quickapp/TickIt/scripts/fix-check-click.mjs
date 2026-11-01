import fs from 'fs'
let s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
s = s.replace(
  /(<image if="\{\{done\}\}" src="\.\.\/\.\.\/common\/icon-check-white\.png"[^>]*?)(><\/image>)/,
  '$1 onclick="toggleDone"$2'
)
fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8')
console.log('onclick added:', s.includes('icon-check-white.png') && s.match(/icon-check-white[^>]*onclick/)?.length > 0)
