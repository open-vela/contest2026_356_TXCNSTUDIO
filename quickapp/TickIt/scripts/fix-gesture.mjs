import fs from 'fs'

// home: list 加 scroll 事件检测方向 → 显示按钮
let s = fs.readFileSync('src/pages/home/home.ux', 'utf8')

// 1. list 加 onscroll
s = s.replace(
  '<list if="{{isCircle && loaded && items.length>0}}" scroll-y="true"',
  '<list if="{{isCircle && loaded && items.length>0}}" scroll-y="true" onscroll="onCircleScroll"'
)

// 2. 移除根节点的 touchstart/touchend（不再需要）
s = s.replace(' @touchstart="onCircleTouchStart" @touchend="onCircleTouchEnd"', '')

// 3. 简化 onCircleScroll：向下滚动显示按钮
s = s.replace(
  /onCircleScroll \(e\) \{[\s\S]*?\},/,
  `onCircleScroll (e) {
      if (!this.isCircle || !e || typeof e.scrollY !== 'number') { return }
      var now = Date.now(); if (this._scrollThrottle && now - this._scrollThrottle < 150) { return }; this._scrollThrottle = now
      var previous = this._circleScrollY || 0
      this._circleScrollY = e.scrollY
      if (e.scrollY > previous) { this.showCircleAdd() }
    },`
)

fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
console.log('home: scroll-based trigger')

// notes 也一样
s = fs.readFileSync('src/pages/notes/notes.ux', 'utf8')
s = s.replace(' @touchstart="onCircleTouchStart" @touchend="onCircleTouchEnd"', '')
s = s.replace(
  /onCircleScroll \(e\) \{[\s\S]*?\},/,
  `onCircleScroll (e) {
      if (!this.isCircle || !e || typeof e.scrollY !== 'number') { return }
      var now = Date.now(); if (this._scrollThrottle && now - this._scrollThrottle < 150) { return }; this._scrollThrottle = now
      var previous = this._circleScrollY || 0
      this._circleScrollY = e.scrollY
      if (e.scrollY > previous) { this.showCircleAdd() }
    },`
)
// notes 的 scroll 也加 onscroll
s = s.replace(
  '<scroll if="{{isCircle && !empty && !loading}}" scroll-y="true" bounces="false"',
  '<scroll if="{{isCircle && !empty && !loading}}" scroll-y="true" bounces="false" onscroll="onCircleScroll"'
)
fs.writeFileSync('src/pages/notes/notes.ux', s, 'utf8')
console.log('notes: scroll-based trigger')
