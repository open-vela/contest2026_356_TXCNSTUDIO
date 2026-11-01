import fs from 'fs'

// ===== 1. utils 改为 global 挂载（文档实测内存降 60%） =====
// app.ux 里 import utils 并挂到 global
let app = fs.readFileSync('src/app.ux', 'utf8')
if (!app.includes('global.utils')) {
  app = app.replace(
    "import adapt from './common/adapt'",
    "import adapt from './common/adapt'\nimport utils from './common/utils'"
  )
  app = app.replace(
    'onCreate() {',
    `onCreate() {
    global.utils = utils`
  )
  fs.writeFileSync('src/app.ux', app, 'utf8')
  console.log('app: utils on global')
}

// 各页面移除 import utils，改用 global.utils
const pages = ['home','viewer','token','logout','confirm','sync','numpad','notecreate','noteedit','notes','list','priority','mode','deadline','qrcode','about']
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // 移除 import utils
  s = s.replace(/import utils from ['"]\.\.\/\.\.\/common\/utils['"];?\r?\n?/g, '')
  // 在 script 开头加 const utils = global.utils
  if (!s.includes('global.utils') && s.includes('utils.')) {
    s = s.replace(
      /export default \{/,
      `const utils = global.utils || {}

  export default {`
    )
  }
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': utils via global')
  }
}

// ===== 2. UI无关数据从 private 移出 =====
// home 的 _circleScrollY, _scrollThrottle 等是过程状态，不应放 private
// 但它们在 script 中用 this._xxx 赋值，Vela private 外也可用
// 实际上只要不放在 private 里就不会创建 observer
for (const p of ['home', 'viewer', 'token']) {
  const f = `src/pages/${p}/${p}.ux`
  let s = fs.readFileSync(f, 'utf8')
  // 移除 private 中的临时状态变量（用 _ 开头的）
  s = s.replace(/^\s*_(\w+):\s*[^,\n]+,?\r?\n/gm, '')
  fs.writeFileSync(f, s, 'utf8')
}

// ===== 3. .static 修饰符：不随数据变的 if/for 加 .static =====
// home 卡片背景的 bgIdx if/elif 是动态的，不能 .static
// 但三点图标、标题等的 if 可以 .static
for (const p of ['home', 'viewer', 'logout', 'confirm', 'token', 'sync']) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // 纯静态图片的 if="{{isCircle}}" 加 .static
  s = s.replace(
    /if="\{\{isCircle\}\}"( static)? src=/g,
    'if.static="{{isCircle}}"$1 src='
  )
  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': if.static added')
  }
}

console.log('done')
