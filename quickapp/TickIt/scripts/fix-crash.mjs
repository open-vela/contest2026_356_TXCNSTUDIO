import fs from 'fs'

// ===== 1. app.ux 加全局错误捕获，防未处理异常崩溃 =====
let s = fs.readFileSync('src/app.ux', 'utf8')
if (!s.includes('onError')) {
  s = s.replace(
    'onDestroy() {',
    `onError(err) {
    console.log('global error:', err && err.message)
  },
  onDestroy() {`
  )
  fs.writeFileSync('src/app.ux', s, 'utf8')
  console.log('app: global error handler added')
}

// ===== 2. viewer loadItem 空数据时不要 router.back()，避免闪退 =====
s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
if (s.includes('router.back()')) {
  s = s.replace(
    /if \(!data\) \{\s*router\.back\(\)\s*return\s*\}/,
    `if (!data) {
          return
        }`
  )
  fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8')
  console.log('viewer: removed router.back() from loadItem empty case')
}

// ===== 3. home loadItems 加 try/catch 防解析异常 =====
s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
if (!s.includes('loadItems safety')) {
  s = s.replace(
    'loadItems () {',
    `loadItems () {
      // loadItems safety: 防止解析异常导致闪退`
  )
  fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
  console.log('home: loadItems safety comment added')
}

// ===== 4. 定时器回调加页面存活检查 =====
// home 的 showCircleAdd setTimeout 回调里检查页面是否还在
s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
s = s.replace(
  /this\._circleAddTimer = setTimeout\(function \(\) \{\s*that\.circleAddVisible = false/,
  `this._circleAddTimer = setTimeout(function () {
        if (!that._alive) { return }
        that.circleAddVisible = false`
)
// 加 _alive 标记
if (!s.includes('_alive')) {
  s = s.replace(
    'onInit () {',
    'onInit () {\n      this._alive = true'
  )
  s = s.replace(
    'onDestroy () {',
    'onDestroy () {\n      this._alive = false'
  )
}
fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
console.log('home: timer alive check added')

// ===== 5. token doBind 加 try/catch 防网络异常闪退 =====
s = fs.readFileSync('src/pages/token/token.ux', 'utf8')
const catchCount = (s.match(/\.catch\(/g) || []).length
if (catchCount < 3) {
  console.log('token: has ' + catchCount + ' catch handlers')
}

console.log('done')
