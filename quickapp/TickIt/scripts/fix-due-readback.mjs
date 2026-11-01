import fs from 'fs'
let s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
const old = '      // 优先级页返回时读取选择'
const rep = `      // deadline 返回时读取截止时间
      utils.storageGet('todo_due_sel').then(function (ds) {
        if (ds) {
          try {
            var dd = JSON.parse(ds)
            if (dd.due) {
              that.due = dd.due
              that.dueSel = 0
              that.saveToCloud()
            }
          } catch (e) {}
          utils.storageSet('todo_due_sel', '')
        }
      })
      // 优先级页返回时读取选择`
if (!s.includes(old)) { console.log('not found'); process.exit(1) }
s = s.replace(old, rep)
fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8')
console.log('done')
