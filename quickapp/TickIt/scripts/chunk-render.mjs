import fs from 'fs'

// ===== VIEWER: 分块渲染 — 按钮延迟到首帧后渲染 =====
let s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')

// 1. 加 chunkRendered 状态
if (!s.includes('chunkRendered')) {
  s = s.replace(
    'isCircle: null,',
    'isCircle: null,\n      chunkRendered: false,'
  )
  console.log('added chunkRendered state')
}

// 2. onShow 里延迟设置 chunkRendered（首帧后 100ms 再渲染按钮）
if (!s.includes('chunkRendered = true')) {
  s = s.replace(
    /this\.loadItem\(\)/,
    `this.loadItem()
      var that = this
      if (!that.chunkRendered) {
        setTimeout(function () { that.chunkRendered = true }, 100)
      }`
  )
  console.log('added chunked render trigger')
}

// 3. 按钮图片加 chunkRendered 条件（先只渲染背景+卡片）
s = s.replace(
  /(<image src="\.\.\/\.\.\/common\/circle-ctr-9[4-7]\.png")/g,
  '$1 show="{{chunkRendered}}"'
)

fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8')
console.log('viewer chunked render applied')
