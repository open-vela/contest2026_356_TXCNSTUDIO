import fs from 'fs'

// 检查修复后的代码是否有语法残留
const pages = ['home', 'viewer', 'token', 'logout', 'confirm', 'sync', 'numpad', 'notecreate', 'noteedit', 'notes', 'qrcode']
for (const p of pages) {
  const f = `src/pages/${p}/${p}.ux`
  if (!fs.existsSync(f)) continue
  const s = fs.readFileSync(f, 'utf8')
  const lines = s.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim()
    // 检查孤立括号、空 then、空 catch
    if (l === ')' || l === ');' || l === '})' || l === '});') {
      const prev = (lines[i-1] || '').trim()
      if (!prev.endsWith('(') && !prev.endsWith(',') && !prev.endsWith('function') && !prev.endsWith('{')) {
        console.log(p + ' line ' + (i+1) + ' orphan: ' + l + ' after: ' + prev.substring(0, 50))
      }
    }
    // 检查空的 then/catch
    if (/\.then\(\s*\)/.test(l) || /\.catch\(\s*\)/.test(l)) {
      console.log(p + ' line ' + (i+1) + ' empty handler: ' + l.substring(0, 80))
    }
  }
}

// ===== fixPromise Leak: utils.js 中的 storage 操作加上 complete 回调 =====
// 日志显示 "invoke complete callback failed" 说明 complete 回调缺失
let s = fs.readFileSync('src/common/utils.js', 'utf8')
// storageGet 里加 complete 空函数
if (!s.includes('complete: function')) {
  s = s.replace(
    /storage\.get\(\{/g,
    'storage.get({ complete: function(){}, '
  )
  s = s.replace(
    /storage\.set\(\{/g,
    'storage.set({ complete: function(){}, '
  )
  s = s.replace(
    /_storage\.get\(\{/g,
    '_storage.get({ complete: function(){}, '
  )
  s = s.replace(
    /_storage\.set\(\{/g,
    '_storage.set({ complete: function(){}, '
  )
  fs.writeFileSync('src/common/utils.js', s, 'utf8')
  console.log('utils.js: complete callbacks added')
}

console.log('check done')
