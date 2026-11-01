import fs from 'fs'
const s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
const js = s.substring(s.indexOf('<script>'))

// 找出所有异步操作和重渲染点
console.log('=== onInit ===')
const onInit = js.substring(js.indexOf('onInit'), js.indexOf('onShow'))
console.log(onInit.trim())

console.log('\n=== onShow ===')
const onShow = js.substring(js.indexOf('onShow'), js.indexOf('onHide'))
console.log(onShow.trim())

console.log('\n=== loadItems (triggers items re-render) ===')
const li = js.substring(js.indexOf('loadItems ()'), js.indexOf('viewItem'))
console.log(li.trim().substring(0, 400))

console.log('\n=== autoSync ===')
const as = js.substring(js.indexOf('autoSync ()'), js.indexOf('syncPending'))
console.log(as.trim().substring(0, 500))

console.log('\n=== syncPending ===')
const sp = js.substring(js.indexOf('syncPending ()'), js.indexOf('updateTime'))
console.log(sp.trim().substring(0, 300))

console.log('\n=== isCircle usage in template ===')
const t = s.substring(s.indexOf('圆屏'))
const ifs = t.match(/if="\{\{isCircle[^"]*\}\}"/g) || []
const shows = t.match(/show="\{\{[^"]*\}\}"/g) || []
console.log('if isCircle:', ifs.length, 'show:', shows.length)

console.log('\n=== items dependency (re-render triggers) ===')
const itemsUsage = t.match(/\$item\.\w+/g) || []
const uniq = [...new Set(itemsUsage)]
console.log('item fields used:', uniq.join(', '))
