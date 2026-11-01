import fs from 'fs'
import { execSync } from 'child_process'

const pages = ['home','viewer','token','logout','confirm','sync','numpad','notecreate','noteedit','notes','list','priority','mode','deadline','qrcode','about']

// 圆屏构建：临时删除方屏代码，构建完恢复
function buildCircle() {
  const backups = {}
  for (const p of pages) {
    const f = `src/pages/${p}/${p}.ux`
    if (!fs.existsSync(f)) continue
    const orig = fs.readFileSync(f, 'utf8')
    backups[f] = orig

    let s = orig
    // 移除条件编译标记（我们直接删代码）
    s = s.replace(/<!-- if true: process\.env\.SHAPE === "RECT" -->/g, '')
    s = s.replace(/<!-- if true: process\.env\.SHAPE === "CIRCLE" -->/g, '')
    s = s.replace(/<!-- endif -->/g, '')

    // 找到方屏分支 <div if="{{isCircle === false}}" ...> 整块删掉
    const rectStart = s.indexOf('<div if="{{isCircle === false}}"')
    if (rectStart >= 0) {
      // 找到匹配的 </div>
      let depth = 0, i = rectStart
      while (i < s.length) {
        if (s.substring(i, i+4) === '<div') depth++
        if (s.substring(i, i+6) === '</div>') { depth--; if (depth === 0) break }
        i++
      }
      const rectEnd = s.indexOf('>', i) + 1
      s = s.substring(0, rectStart) + s.substring(rectEnd)
    }

    // 也移除圆屏的 isCircle 条件（总是渲染圆屏）
    s = s.replace(/if="\{\{isCircle === false\}\}"\s*/g, '')
    s = s.replace(/if="\{\{isCircle && ([^}]+)\}\}"/g, 'if="{{true && $1}}"')
    s = s.replace(/if\.static="\{\{isCircle\}\}"/g, 'if="{{true}}"')
    s = s.replace(/if="\{\{isCircle\}\}"/g, '')

    fs.writeFileSync(f, s, 'utf8')
  }

  console.log('rect code stripped, building...')
  execSync('npx aiot build', { stdio: 'inherit' })

  // 恢复原始文件
  for (const [f, orig] of Object.entries(backups)) {
    fs.writeFileSync(f, orig, 'utf8')
  }
  console.log('files restored')
}

buildCircle()
