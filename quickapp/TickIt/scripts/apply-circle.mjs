// 圆屏适配补丁脚本（Node UTF-8，避免 PowerShell 编码损坏）
// 对 git HEAD 还原后的 9 页重放：height:100% / screentype=auto / object-fit + isCircle 三元
// 运行：node scripts/apply-circle.mjs
import fs from 'fs'
import path from 'path'

const P = (...p) => path.join(import.meta.dirname, '..', 'src', ...p)

function read (f) { return fs.readFileSync(f, 'utf8') }
function write (f, s) { fs.writeFileSync(f, s, 'utf8') }

// ── 通用替换 ──────────────────────────────────────────────
function applyCommon (src, { rootFlex = true, bgFit = false, keyboard = false, titleTop42 = false } = {}) {
  let s = src
  // 1) 根容器 height:480px → 100%
  s = s.replace(/width:336px;height:480px;/g, 'width:336px;height:100%;')
  // 2) 整图背景 object-fit
  if (bgFit) {
    s = s.replace(/style="position:absolute;left:0;top:0;width:336px;height:100%;">/g,
      'style="position:absolute;left:0;top:0;width:336px;height:100%;object-fit:cover;">')
    // 已是 480 高的背景图（notes 空态）
    s = s.replace(/style="position:absolute;left:0;top:0;width:336px;height:480px;"/g,
      'style="position:absolute;left:0;top:0;width:336px;height:100%;object-fit:cover;"')
  }
  // 3) screentype
  if (keyboard) {
    s = s.replace(/screentype="rect"/g, 'screentype="auto"')
  }
  // 4) 顶栏通用：左按钮 / 右按钮 / 时间 / 标题
  s = s.replace(/left:6px;top:6px;width:72px;height:72px;/g,
    'left:{{isCircle ? 18 : 6}}px;top:{{isCircle ? 18 : 6}}px;width:{{isCircle ? 64 : 72}}px;height:{{isCircle ? 64 : 72}}px;')
  s = s.replace(/left:258px;top:6px;width:72px;height:72px;/g,
    'left:{{isCircle ? 254 : 258}}px;top:{{isCircle ? 18 : 6}}px;width:{{isCircle ? 64 : 72}}px;height:{{isCircle ? 64 : 72}}px;')
  s = s.replace(/left:105px;top:10px;/g, 'left:105px;top:{{isCircle ? 24 : 10}}px;')
  if (titleTop42) {
    s = s.replace(/left:100px;top:42px;/g, 'left:100px;top:{{isCircle ? 56 : 42}}px;')
  }
  s = s.replace(/left:100px;top:40px;/g, 'left:100px;top:{{isCircle ? 56 : 40}}px;')
  return s
}

// ── 脚本区：import adapt + isCircle + onInit + probe ─────────
function applyScript (src) {
  let s = src
  if (!s.includes("import adapt from '../../common/adapt'")) {
    s = s.replace(/(import utils from '\.\.\/\.\.\/common\/utils'\n)/,
      "$1  import adapt from '../../common/adapt'\n")
    // logout 无 fetch 的情况
    if (!s.includes("import adapt from")) {
      s = s.replace(/(import utils from '\.\.\/\.\.\/common\/utils'\n)/,
        "$1  import adapt from '../../common/adapt'\n")
    }
  }
  // private 加 isCircle
  if (!s.includes('isCircle:')) {
    s = s.replace(/private: \{\n/, "private: {\n      isCircle: false,\n")
  }
  // onInit 插入同步读取（若已有 onInit）
  if (!s.includes('isCircleSync')) {
    s = s.replace(/onInit \(\) \{\n/, "onInit () {\n      this.isCircle = adapt.isCircleSync()\n")
  }
  // onShow 补 probe
  if (!s.includes('adapt.probe')) {
    s = s.replace(/onShow \(\) \{\n(\s+)(var that = this\n)?/,
      (m, indent, thatLine) => {
        const t = thatLine || indent + 'var that = this\n'
        return `onShow () {\n${t}${indent}adapt.probe().then(function (info) {\n${indent}  that.isCircle = info.isCircle\n${indent}})\n`
      })
  }
  return s
}

// ── 逐页 ────────────────────────────────────────────────
const jobs = [
  { file: P('pages/confirm/confirm.ux'), opt: { bgFit: true, titleTop42: false } },
  { file: P('pages/home/home.ux'), opt: {} },
  { file: P('pages/logout/logout.ux'), opt: { bgFit: true } },
  { file: P('pages/notecreate/notecreate.ux'), opt: { keyboard: true } },
  { file: P('pages/noteedit/noteedit.ux'), opt: { keyboard: true } },
  { file: P('pages/notes/notes.ux'), opt: { bgFit: true } },
  { file: P('pages/numpad/numpad.ux'), opt: { keyboard: true } },
  { file: P('pages/token/token.ux'), opt: { bgFit: true, keyboard: true } },
  { file: P('pages/viewer/viewer.ux'), opt: { keyboard: true } }
]

for (const j of jobs) {
  let s = read(j.file)
  s = applyCommon(s, j.opt)
  s = applyScript(s)
  write(j.file, s)
  console.log('common+script:', path.basename(j.file))
}

// ── 页内专项（底部按钮 / scroll / 四宫格 / about 等）────────
// confirm: 仅顶栏即可（背景 object-fit 已做）

// home: 无底部按钮，顶栏已通用

// logout: 顶栏已通用

// notecreate: 输入框 + 顶栏
{
  const f = P('pages/notecreate/notecreate.ux')
  let s = read(f)
  s = s.replace(/left:6px;top:90px;width:324px;min-height:112px;/,
    'left:{{isCircle ? 24 : 6}}px;top:{{isCircle ? 100 : 90}}px;width:{{isCircle ? 288 : 324}}px;min-height:112px;')
  write(f, s)
  console.log('detail: notecreate')
}

// noteedit: 两处模式容器 + 输入框 + scroll + 按钮
{
  const f = P('pages/noteedit/noteedit.ux')
  let s = read(f)
  s = s.replace(/width:336px;height:100%;/g, 'width:336px;height:100%;') // 已改
  // 编辑态黑框
  s = s.replace(/left:6px;top:90px;width:324px;min-height:112px;/,
    'left:{{isCircle ? 24 : 6}}px;top:{{isCircle ? 100 : 90}}px;width:{{isCircle ? 288 : 324}}px;min-height:112px;')
  // 详情 scroll
  s = s.replace(/left:0;top:86px;width:336px;height:394px;/,
    'left:0;top:{{isCircle ? 100 : 86}}px;width:336px;height:{{isCircle ? 220 : 394}}px;')
  // 详情卡与三按钮
  s = s.replace(/width:324px;min-height:112px;margin-left:6px;margin-right:6px;/g,
    'width:{{isCircle ? 288 : 324}}px;min-height:112px;margin-left:{{isCircle ? 24 : 6}}px;margin-right:{{isCircle ? 24 : 6}}px;')
  s = s.replace(/width:324px;height:112px;margin-left:6px;margin-right:6px;/g,
    'width:{{isCircle ? 288 : 324}}px;height:112px;margin-left:{{isCircle ? 24 : 6}}px;margin-right:{{isCircle ? 24 : 6}}px;')
  write(f, s)
  console.log('detail: noteedit')
}

// notes: 空态/加载容器 480→100% + scroll margin + 卡片宽
{
  const f = P('pages/notes/notes.ux')
  let s = read(f)
  s = s.replace(/width:336px;height:480px;/g, 'width:336px;height:100%;')
  s = s.replace(/margin-top:86px;/, 'margin-top:{{isCircle ? 100 : 86}}px;')
  s = s.replace(/width:324px;min-height:112px;margin-left:6px;margin-right:6px;/g,
    'width:{{isCircle ? 288 : 324}}px;min-height:112px;margin-left:{{isCircle ? 24 : 6}}px;margin-right:{{isCircle ? 24 : 6}}px;')
  write(f, s)
  console.log('detail: notes')
}

// numpad: scroll 动态高 + 2x2 网格
{
  const f = P('pages/numpad/numpad.ux')
  let s = read(f)
  s = s.replace(/left:0;top:85px;width:336px;height:\{\{hide \? 395 : 140\}\}px;/,
    'left:0;top:{{isCircle ? 100 : 85}}px;width:336px;height:{{isCircle ? (hide ? 220 : 100) : (hide ? 395 : 140)}}px;')
  s = s.replace(/width:157px;height:112px;margin-left:6px;margin-right:4px;margin-bottom:12px;/g,
    'width:{{isCircle ? 128 : 157}}px;height:{{isCircle ? 92 : 112}}px;margin-left:{{isCircle ? 20 : 6}}px;margin-right:4px;margin-bottom:12px;')
  write(f, s)
  console.log('detail: numpad')
}

// token: 底部按钮 + 失败文案 + 绑定输入 + 说明
{
  const f = P('pages/token/token.ux')
  let s = read(f)
  s = s.replace(/left:18px;top:373px;width:300px;height:80px;/g,
    'left:{{isCircle ? 48 : 18}}px;top:{{isCircle ? 230 : 373}}px;width:{{isCircle ? 240 : 300}}px;height:{{isCircle ? 60 : 80}}px;')
  s = s.replace(/left:0;top:330px;width:336px;/,
    'left:0;top:{{isCircle ? 188 : 330}}px;width:336px;')
  s = s.replace(/left:6px;top:96px;width:324px;height:104px;/,
    'left:{{isCircle ? 24 : 6}}px;top:{{isCircle ? 96 : 96}}px;width:{{isCircle ? 288 : 324}}px;height:104px;')
  s = s.replace(/left:6px;top:216px;width:324px;/,
    'left:{{isCircle ? 24 : 6}}px;top:{{isCircle ? 216 : 216}}px;width:{{isCircle ? 288 : 324}}px;')
  write(f, s)
  console.log('detail: token')
}

// viewer: 详情容器+scroll + 编辑输入框 + 2x2
{
  const f = P('pages/viewer/viewer.ux')
  let s = read(f)
  s = s.replace(/left:0;top:85px;width:336px;height:395px;/,
    'left:0;top:{{isCircle ? 100 : 85}}px;width:336px;height:{{isCircle ? 220 : 395}}px;')
  s = s.replace(/width:336px;height:395px;flex-direction:column;/,
    'width:336px;height:{{isCircle ? 220 : 395}}px;flex-direction:column;')
  s = s.replace(/left:0;top:90px;width:336px;height:130px;/,
    'left:0;top:{{isCircle ? 100 : 90}}px;width:336px;height:130px;')
  s = s.replace(/left:6px;top:6px;width:324px;height:80px;/,
    'left:{{isCircle ? 24 : 6}}px;top:6px;width:{{isCircle ? 288 : 324}}px;height:80px;')
  s = s.replace(/width:157px;height:112px;margin-left:6px;margin-right:4px;margin-bottom:12px;/g,
    'width:{{isCircle ? 128 : 157}}px;height:{{isCircle ? 92 : 112}}px;margin-left:{{isCircle ? 20 : 6}}px;margin-right:4px;margin-bottom:12px;')
  write(f, s)
  console.log('detail: viewer')
}

// confirm: 仅顶栏（已通用）
console.log('done')
