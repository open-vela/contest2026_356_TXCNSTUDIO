import fs from 'fs'
let s = fs.readFileSync('src/manifest.json', 'utf8')
if (!s.includes('pages/deadline')) {
  s = s.replace('"pages/priority"', '"pages/deadline": { "component": "deadline" },\n      "pages/priority"')
  fs.writeFileSync('src/manifest.json', s, 'utf8')
}
console.log('deadline registered:', s.includes('pages/deadline'))
