import fs from 'fs'
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')

const oldStr = `            if (that.items.length === raw.length) {
              // 原地更新，避免开辟新数组
              for (var ii = 0; ii < raw.length; ii++) {
                var item = raw[ii]`

const newStr = `            if (that.items.length === raw.length) {
              // 原地更新：按 id 匹配（items 已排序，raw 未排序，不能按索引对应）
              for (var ii = 0; ii < raw.length; ii++) {
                var item = raw[ii]
                var target = null
                for (var fi = 0; fi < that.items.length; fi++) {
                  if (that.items[fi].id === item.id) { target = that.items[fi]; break }
                }
                if (!target) { continue }`

if (s.includes(oldStr)) {
  s = s.replace(oldStr, newStr)
  // 把后续的 that.items[ii] 改为 target
  const start = s.indexOf('原地更新：按 id 匹配')
  const end = s.indexOf('} else {', start)
  if (start > 0 && end > start) {
    let block = s.substring(start, end)
    block = block.replace(/that\.items\[ii\]/g, 'target')
    s = s.substring(0, start) + block + s.substring(end)
  }
  fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
  console.log('in-place update fixed to match by id')
} else {
  console.log('pattern not found')
}
