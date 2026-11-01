import fs from 'fs'
import { execSync } from 'child_process'

const pages = ['home','viewer','token','logout','confirm','sync','numpad','notecreate','noteedit','notes','list','priority','mode','deadline','qrcode','about']

function stripRect() {
  const backups = {}

  // 1. 各页面：删方屏模板分支
  for (const p of pages) {
    const f = `src/pages/${p}/${p}.ux`
    if (!fs.existsSync(f)) continue
    const orig = fs.readFileSync(f, 'utf8')
    backups[f] = orig
    let s = orig

    // 移除条件编译标记
    s = s.replace(/<!-- if true: process\.env\.SHAPE === "[A-Z]+" -->/g, '')
    s = s.replace(/<!-- endif -->/g, '')

    // 删除方屏分支 <div if="{{isCircle === false}}" ...> ... </div>
    let idx
    while ((idx = s.indexOf('<div if="{{isCircle === false}}"')) >= 0) {
      let depth = 0, i = idx
      while (i < s.length) {
        const chunk = s.substr(i, 5)
        if (chunk === '<div ' || chunk === '<div>') depth++
        if (s.substr(i, 6) === '</div>') { depth--; if (depth === 0) break }
        i++
      }
      const end = s.indexOf('>', i) + 1
      s = s.substring(0, idx) + s.substring(end)
    }

    // 也删除 <image if="{{isCircle === false}}" ...> 单行
    s = s.replace(/<image if="\{\{isCircle === false\}\}"[^>]*>\s*/g, '')
    s = s.replace(/<text if="\{\{isCircle === false\}\}"[^>]*>[^<]*<\/text>\s*/g, '')

    // 圆屏条件简化
    s = s.replace(/if="\{\{isCircle && ([^}]+)\}\}"/g, 'if="{{true && $1}}"')
    s = s.replace(/if\.static="\{\{isCircle\}\}"/g, '')
    s = s.replace(/if="\{\{isCircle\}\}"/g, '')

    fs.writeFileSync(f, s, 'utf8')
  }

  // 2. InputMethod：删方屏和胶囊键盘
  const imF = 'src/components/InputMethod/InputMethod.ux'
  const imOrig = fs.readFileSync(imF, 'utf8')
  backups[imF] = imOrig
  let im = imOrig

  // 删除 rect 键盘块 <div if="{{screenTypeResolved==='rect'}}" ...> ... </div>
  let ridx
  while ((ridx = im.indexOf('screenTypeResolved===\'rect\'')) >= 0) {
    const start = im.lastIndexOf('<div', ridx)
    let depth = 0, i = start
    while (i < im.length) {
      const chunk = im.substr(i, 5)
      if (chunk === '<div ' || chunk === '<div>') depth++
      if (im.substr(i, 6) === '</div>') { depth--; if (depth === 0) break }
      i++
    }
    const end = im.indexOf('>', i) + 1
    im = im.substring(0, start) + im.substring(end)
  }

  // 删除 pill 键盘块
  while ((ridx = im.indexOf('screenTypeResolved===\'pill-shaped\'')) >= 0) {
    const start = im.lastIndexOf('<div', ridx)
    let depth = 0, i = start
    while (i < im.length) {
      const chunk = im.substr(i, 5)
      if (chunk === '<div ' || chunk === '<div>') depth++
      if (im.substr(i, 6) === '</div>') { depth--; if (depth === 0) break }
      i++
    }
    const end = im.indexOf('>', i) + 1
    im = im.substring(0, start) + im.substring(end)
  }

  // 删除 rect/pill 的 CSS
  im = im.replace(/\.calbtn67[\s\S]*?\}/g, '')
  im = im.replace(/\.calbtn66[\s\S]*?\}/g, '')
  im = im.replace(/#keyboard67[\s\S]*?\}/g, '')
  im = im.replace(/#keyboard66[\s\S]*?\}/g, '')
  im = im.replace(/\.list67[\s\S]*?\}/g, '')
  im = im.replace(/\.list66[\s\S]*?\}/g, '')
  im = im.replace(/\.item67[\s\S]*?\}/g, '')
  im = im.replace(/\.item66[\s\S]*?\}/g, '')

  fs.writeFileSync(imF, im, 'utf8')

  return backups
}

function restore(backups) {
  for (const [f, orig] of Object.entries(backups)) {
    fs.writeFileSync(f, orig, 'utf8')
  }
}

const backups = stripRect()
console.log('rect + pill keyboard stripped, building...')
execSync('npx aiot build', { stdio: 'inherit' })
restore(backups)
console.log('files restored')
