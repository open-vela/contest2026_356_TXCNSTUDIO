import fs from 'fs'

// ===== 1. 定时器清理：所有页面 onDestroy 清理定时器 =====
const pagesWithTimers = ['home', 'token', 'sync', 'viewer', 'numpad', 'deadline']
for (const p of pagesWithTimers) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  // onDestroy 里清理所有可能的定时器
  if (!s.includes('clearTimeout')) {
    s = s.replace(
      /onDestroy \(\) \{/,
      `onDestroy () {
      if (this._circleAddTimer) { clearTimeout(this._circleAddTimer); this._circleAddTimer = null }
      if (this._syncTimer) { clearTimeout(this._syncTimer); this._syncTimer = null }
      if (this._chunkTimer) { clearTimeout(this._chunkTimer); this._chunkTimer = null }`
    )
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': timer cleanup added')
  }
}

// ===== 2. home 原地更新（避免每次 map 新建数组） =====
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
if (!s.includes('inPlaceUpdate')) {
  // loadItems 里改用原地更新
  s = s.replace(
    /that\.items = (?:initial|sliced|rawItems)\.map\(function \(item\) \{/,
    `var raw = (initial || sliced || rawItems)
            if (that.items.length === raw.length) {
              // 原地更新，避免开辟新数组
              for (var ii = 0; ii < raw.length; ii++) {
                var item = raw[ii]
                var p = parseInt(item.priority, 10)
                if (isNaN(p)) { p = 2 }
                var done = item.done || false
                var due = parseInt(item.due, 10) || 0
                var now2 = Date.now()
                var overdue = !done && due > 0 && due < now2
                var pinned = item.is_pinned === 1
                var bgIdx = p === 3 ? (pinned ? 0 : 1) : (p === 1 ? (pinned ? 4 : 5) : (pinned ? 2 : 3))
                that.items[ii].title = item.text || item.title || '未命名'
                that.items[ii].done = done
                that.items[ii].priority = p
                that.items[ii].pinned = pinned
                that.items[ii].bgIdx = bgIdx
                that.items[ii].dueStr = due > 0 ? (overdue ? '已逾期' : '截止 ' + that.fmtItemTime(due)) : that.fmtItemTime(item.createdAt)
                that.items[ii].timeColor = done ? '#555555' : (overdue ? '#FF3B30' : '#C9C9C9')
              }
            } else {
              that.items = raw.map(function (item) {`
  )
  // 需要闭合原来的 map
  s = s.replace(
    /\}\)\.sort\(function \(a, b\)/,
    `})
            }
            that.items.sort(function (a, b)`
  )
  fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
  console.log('home: in-place update added')
}

// ===== 3. 减少 console.log（移除非必要的长日志） =====
for (const p of ['home', 'viewer', 'token', 'sync']) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // 移除 JSON.stringify 调用的 console.log（大对象序列化影响性能）
  s = s.replace(/\s*console\.log\([^)]*JSON\.stringify[^)]*\)\s*/g, '\n')
  // 移除 storageGet success 里的 console.log
  s = s.replace(/\s*console\.log\('storageGet[^']*'[^)]*\)\s*/g, '\n')
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': verbose console.log removed')
  }
}

// ===== 4. 按钮防重复点击（网络请求按钮加 disabled 标记） =====
// token 的 doBind 已有 binding 标记，其他页加上
s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
if (!s.includes('_saveLock')) {
  s = s.replace(
    'saveState () {',
    `saveState () {
      if (this._saveLock) { return }
      this._saveLock = true
      var lockRef = this
      setTimeout(function () { lockRef._saveLock = false }, 500)`
  )
  fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8')
  console.log('viewer: save button debounce added')
}

console.log('done')
