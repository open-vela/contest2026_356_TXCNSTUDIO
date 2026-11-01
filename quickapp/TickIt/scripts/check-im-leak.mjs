import fs from 'fs'
const s = fs.readFileSync('src/components/InputMethod/InputMethod.ux', 'utf8')
const js = s.substring(s.indexOf('export default'))
console.log('Promise count:', (js.match(/new Promise/g) || []).length)
console.log('then count:', (js.match(/\.then\(/g) || []).length)
console.log('watch count:', (js.match(/\$watch/g) || []).length)
console.log('catch count:', (js.match(/\.catch\(/g) || []).length)
console.log('setTimeout:', (js.match(/setTimeout/g) || []).length)

// 查看 $watch 注册处
const watchIdx = js.indexOf('$watch')
if (watchIdx >= 0) {
  console.log('\n$watch context:')
  console.log(js.substring(Math.max(0, watchIdx - 50), watchIdx + 100))
}
