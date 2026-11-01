import fs from 'fs'

// ===== HOME: 分块渲染 — 列表首帧只渲染前 8 条，后续分批加载 =====
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')

// 加 renderedCount 状态
if (!s.includes('renderedCount')) {
  s = s.replace(
    'circleAddVisible: false,',
    'circleAddVisible: false,\n      renderedCount: 8,'
  )
  console.log('added renderedCount')
}

// loadItems 后分批加载剩余
if (!s.includes('loadMoreItems')) {
  s = s.replace(
    /that\.items = sliced\.map/,
    `that.items = sliced.map`
  )
  // 在 loadItems 的 finally 后加分批加载
  s = s.replace(
    /loaded = true\s*\}/,
    `loaded = true
        if (that.items.length > 8 && that.renderedCount < that.items.length) {
          setTimeout(function () {
            that.renderedCount = Math.min(that.renderedCount + 8, that.items.length)
          }, 200)
        }`
  )
  console.log('added batch loading')
}

// 模板里 for 改为只渲染 renderedCount 条
// 实际 Vela for 不支持 slice，改用 items 本身截断
// 在 loadItems 里分批设置 items
s = s.replace(
  /that\.items = sliced\.map/,
  `var initial = sliced.slice(0, 8)
            that.renderedCount = 8
            that._allItems = sliced
            that.items = initial.map`
)

fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
console.log('home chunked render applied')
