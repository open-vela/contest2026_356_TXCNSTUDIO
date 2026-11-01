// 补脚本区：import adapt / isCircle / onInit / probe（兼容 CRLF）
// 运行：node scripts/apply-circle-script.mjs
import fs from 'fs'
import path from 'path'

const dir = path.join(import.meta.dirname, '..', 'src', 'pages')
const names = ['confirm', 'home', 'logout', 'notecreate', 'noteedit', 'notes', 'numpad', 'token', 'viewer']

for (const name of names) {
  const f = path.join(dir, name, name + '.ux')
  let s = fs.readFileSync(f, 'utf8')
  const eol = s.includes('\r\n') ? '\r\n' : '\n'
  let changed = false

  if (!s.includes('import adapt from')) {
    // 在 import utils 行后插入
    const re = new RegExp('(import utils from \'\\.\\./\\.\\./common/utils\'' + eol.replace(/\r/g, '\\r') + ')')
    if (re.test(s)) {
      s = s.replace(re, '$1  import adapt from \'../../common/adapt\'' + eol)
      changed = true
    } else {
      console.log(name, 'WARN: import utils not found')
    }
  }

  if (!s.includes('isCircle:')) {
    const re = new RegExp('private: \\{' + eol.replace(/\r/g, '\\r'))
    if (re.test(s)) {
      s = s.replace(re, 'private: {' + eol + '      isCircle: false,' + eol)
      changed = true
    } else {
      console.log(name, 'WARN: private not found')
    }
  }

  if (!s.includes('isCircleSync')) {
    const re = new RegExp('onInit \\(\\) \\{' + eol.replace(/\r/g, '\\r'))
    if (re.test(s)) {
      s = s.replace(re, 'onInit () {' + eol + '      this.isCircle = adapt.isCircleSync()' + eol)
      changed = true
    } else {
      console.log(name, 'WARN: onInit not found')
    }
  }

  if (!s.includes('adapt.probe')) {
    const re = new RegExp('onShow \\(\\) \\{' + eol.replace(/\r/g, '\\r') + '(\\s+)(var that = this' + eol.replace(/\r/g, '\\r') + ')?')
    if (re.test(s)) {
      s = s.replace(re, (m, indent, thatLine) => {
        const t = thatLine || (indent + 'var that = this' + eol)
        return 'onShow () {' + eol + t + indent + 'adapt.probe().then(function (info) {' + eol +
          indent + '  that.isCircle = info.isCircle' + eol +
          indent + '})' + eol
      })
      changed = true
    } else {
      console.log(name, 'WARN: onShow not found')
    }
  }

  if (changed) {
    fs.writeFileSync(f, s, 'utf8')
    console.log('patched script:', name)
  } else {
    console.log('no script change:', name)
  }
}
console.log('done')
