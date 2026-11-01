import fs from 'fs'

const pages = ['home','viewer','token','logout','confirm','sync','numpad','notecreate','noteedit','notes','list','priority','mode','deadline','qrcode','about']

for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s

  // 1. 方屏分支：if="{{isCircle === false}}" 外包 RECT 条件编译
  s = s.replace(
    /(<div if="\{\{isCircle === false\}\}"[^>]*>)/g,
    '<!-- if true: process.env.SHAPE === "RECT" -->\n$1'
  )

  // 2. 圆屏分支：if="{{isCircle" 外包 CIRCLE 条件编译
  s = s.replace(
    /(<div if="\{\{isCircle && [^"]*\}\}"[^>]*>)/g,
    '<!-- if true: process.env.SHAPE === "CIRCLE" -->\n$1'
  )
  s = s.replace(
    /(<image if="\{\{isCircle && [^"]*\}\}"[^>]*>)/g,
    '<!-- if true: process.env.SHAPE === "CIRCLE" -->\n$1'
  )
  s = s.replace(
    /(<div if="\{\{isCircle\}\}"[^>]*>)/g,
    '<!-- if true: process.env.SHAPE === "CIRCLE" -->\n$1'
  )
  s = s.replace(
    /(<image if="\{\{isCircle\}\}"[^>]*>)/g,
    '<!-- if true: process.env.SHAPE === "CIRCLE" -->\n$1'
  )
  s = s.replace(
    /(<image if\.static="\{\{isCircle\}\}"[^>]*>)/g,
    '<!-- if true: process.env.SHAPE === "CIRCLE" -->\n$1'
  )

  // 3. 在 template 前加统一的 endif（条件编译在 template 外不需要闭合）
  // 实际上条件编译块需要显式 endif，但可以放在 template 外
  // 但 docs 示例是在 JS/CSS 中使用，template 中的注释格式不同
  // 最安全的方式：在页面 script 开头加条件编译包裹

  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': conditional compilation markers added')
  }
}

// 在 script 部分也加条件编译（JS 代码共享部分不需要）
// 模板的条件编译注释会被 webpack 插件处理

console.log('done')
