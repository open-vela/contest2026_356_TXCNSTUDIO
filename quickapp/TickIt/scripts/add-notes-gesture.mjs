import fs from 'fs'
let s = fs.readFileSync('src/pages/notes/notes.ux', 'utf8')

// 加手势控制：上划显示按钮，下划/3秒隐藏
if (!s.includes('onCircleTouchStart')) {
  // 1. 根节点加 touch 事件
  s = s.replace(
    '<div style="flex-direction:column;width:336px;height:100%;background-color:#000000;">',
    '<div style="flex-direction:column;width:336px;height:100%;background-color:#000000;" @touchstart="onCircleTouchStart" @touchend="onCircleTouchEnd">'
  )

  // 2. 加手势函数
  s = s.replace(
    '    goBack () {',
    `    showCircleAdd () {
      if (!this.isCircle) { return }
      this.circleAddVisible = true
      if (this._circleAddTimer) { clearTimeout(this._circleAddTimer) }
      var that = this
      this._circleAddTimer = setTimeout(function () {
        if (!that._alive) { return }
        that.circleAddVisible = false
        that._circleAddTimer = null
      }, 3000)
    },

    hideCircleAdd () {
      if (this._circleAddTimer) { clearTimeout(this._circleAddTimer) }
      this._circleAddTimer = null
      this.circleAddVisible = false
    },

    onCircleTouchStart (e) {
      if (!this.isCircle || !e || !e.touches || !e.touches.length) { return }
      this._circleTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    },

    onCircleTouchEnd (e) {
      var start = this._circleTouch
      this._circleTouch = null
      if (!this.isCircle || !start || !e || !e.changedTouches || !e.changedTouches.length) { return }
      var touch = e.changedTouches[0]
      var dy = touch.clientY - start.y
      if (Math.abs(dy) < 24 || Math.abs(dy) <= Math.abs(touch.clientX - start.x)) { return }
      if (dy < 0) { this.showCircleAdd() } else { this.hideCircleAdd() }
    },

    onSwipe (e) {
      if (!this.isCircle || !e) { return }
      if (e.direction === 'up') { this.showCircleAdd() }
      if (e.direction === 'down') { this.hideCircleAdd() }
    },

    goBack () {`
  )

  // 3. onShow 时隐藏按钮
  s = s.replace(
    'onShow () {',
    'onShow () {\n      this.hideCircleAdd()\n      this._circleScrollY = 0'
  )

  // 4. onHide/onDestroy 清理
  s = s.replace(
    'onDestroy () {',
    'onHide () {\n      this.hideCircleAdd()\n    },\n\n    onDestroy () {\n      this.hideCircleAdd()'
  )

  // 5. _alive 标记
  s = s.replace('onInit () {', 'onInit () {\n      this._alive = true')
  s = s.replace('onDestroy () {', 'onDestroy () {\n      this._alive = false')
}

fs.writeFileSync('src/pages/notes/notes.ux', s, 'utf8')
console.log('gesture controls added')
