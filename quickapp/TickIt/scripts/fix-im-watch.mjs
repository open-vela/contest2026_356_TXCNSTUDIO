import fs from 'fs'
let s = fs.readFileSync('src/components/InputMethod/InputMethod.ux', 'utf8')
// 移除引用不存在回调的 $watch（导致对象泄漏）
s = s.replace(
  /\s*this\.\$watch\("hide", "watchHidePropsChange"\);\s*\r?\n\s*this\.\$watch\("maxlength", "watchMaxLengthPropsChange"\);/,
  '\n    // $watch removed: callbacks were never defined, causing object leaks'
)
fs.writeFileSync('src/components/InputMethod/InputMethod.ux', s, 'utf8')
console.log('removed:', !s.includes('$watch'))
