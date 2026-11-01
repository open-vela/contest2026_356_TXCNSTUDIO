import fs from 'fs'

const pages = ['home','viewer','token','logout','confirm','sync','numpad','notecreate','noteedit','notes','list','priority','mode','deadline','qrcode','about']

for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  let s = fs.readFileSync(f, 'utf8')
  const before = s

  // 方屏分支：找到 <div if="{{isCircle === false}}" 的开始和对应的结束
  // 用简化方式：在分支前后插入条件编译注释
  // 方屏
  s = s.replace(
    /(\n\s*<!-- ═══ 矩形[^\n]*-->\n)/,
    '\n<!-- if true: process.env.SHAPE === "RECT" -->\n$1'
  )
  // 圆屏开始
  s = s.replace(
    /(\n\s*<!-- ═══ 圆屏[^\n]*-->\n)/,
    '\n<!-- if true: process.env.SHAPE === "CIRCLE" -->\n$1'
  )

  // 在 </template> 前加两个 endif
  s = s.replace(
    /\n<\/template>/,
    '\n<!-- endif -->\n<!-- endif -->\n</template>'
  )

  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    console.log(p + ': cond compilation added')
  }
}

console.log('done')
