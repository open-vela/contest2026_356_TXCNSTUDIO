import fs from 'fs'

// ===== 1. 消除样式中的三元表达式（减少每次渲染的样式重算） =====
// 先做 viewer、home、numpad 这三个重页面
for (const p of ['viewer', 'home', 'numpad']) {
  const f = `src/pages/${p}/${p}.ux`
  let s = fs.readFileSync(f, 'utf8')
  const before = s

  // 圆屏分支内的 {{isCircle ? 18 : 6}} 等三元 → 直接用圆屏值
  // 只在 isCircle 为 true 的分支内替换
  // 找到 isCircle 分支的模板部分
  const circleStart = s.indexOf('圆屏')
  if (circleStart < 0) continue

  // 在圆屏部分，把 {{isCircle ? X : Y}} 替换为 X（因为圆屏分支 isCircle 一定是 true）
  const beforeCircle = s.substring(0, circleStart)
  let circle = s.substring(circleStart)
  const ternaries = circle.match(/\{\{isCircle \? (\d+) : \d+\}\}/g) || []
  for (const t of ternaries) {
    const val = t.match(/isCircle \? (\d+)/)?.[1]
    if (val) circle = circle.replace(t, val)
  }
  s = beforeCircle + circle

  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': ' + ternaries.length + ' ternary styles staticized')
  } else {
    console.log(p + ': no ternary in circle branch')
  }
}

// ===== 2. home 列表分页 ≤20 =====
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
const oldLoad = `that.items = rawItems.map(function (item) {`
const newLoad = `var sliced = rawItems.length > 20 ? rawItems.slice(0, 20) : rawItems
            that.items = sliced.map(function (item) {`
if (s.includes(oldLoad) && !s.includes('sliced')) {
  s = s.replace(oldLoad, newLoad)
  fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
  console.log('home: list paginated to 20')
}

// ===== 3. loadItems 原地更新（避免每次新建数组） =====
// items 用 splice 更新而不是重新 map
// 这个改动较大，先跳过，保证当前版本稳定

console.log('done')
