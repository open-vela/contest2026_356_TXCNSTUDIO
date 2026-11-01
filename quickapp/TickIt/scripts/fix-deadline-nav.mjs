import fs from 'fs'
let s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')

// 模板：cycleDue → openDeadline
s = s.replace('onclick="cycleDue"', 'onclick="openDeadline"')

// script：cycleDue → openDeadline（跳转到 deadline 页）
const oldFn = `cycleDue () {
      var next = (this.dueSel + 1) % 4
      this.setDue(next)
      this.saveToCloud()
    },`
const newFn = `openDeadline () {
      router.push({ uri: 'pages/deadline', params: { currentDue: this.due || 0 } })
    },`
s = s.replace(oldFn, newFn)

fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8')
console.log('done, has openDeadline:', s.includes('openDeadline'))
