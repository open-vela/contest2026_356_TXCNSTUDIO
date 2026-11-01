import fs from 'fs'

// ===== 1. toggleDone 写 storage =====
let s = fs.readFileSync('src/pages/viewer/viewer.ux', 'utf8')
s = s.replace(
  `toggleDone () {
      this.done = !this.done
      // 在线：同步云端完成状态（token 从 storage 读）
      var that = this`,
  `toggleDone () {
      this.done = !this.done
      var that = this
      // 先写本地 storage，防止 loadItem 覆盖
      utils.storageGet('todo_items').then(function (data) {
        var items = []
        if (data) { try { items = JSON.parse(data) } catch (e) {} }
        for (var i = 0; i < items.length; i++) {
          if (items[i].id === that.itemId) { items[i].done = that.done; break }
        }
        utils.storageSet('todo_items', JSON.stringify(items))
      })
      // 同步云端`
)
fs.writeFileSync('src/pages/viewer/viewer.ux', s, 'utf8')
console.log('viewer toggleDone fixed')

// ===== 2. logout 加 scroll =====
s = fs.readFileSync('src/pages/logout/logout.ux', 'utf8')
s = s.replace(
  '    <div if="{{isCircle}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">\n      <!-- 三点图标 -->',
  '    <div if="{{isCircle}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">\n      <scroll scroll-y="true" style="width:336px;height:336px;flex-direction:column;">\n        <div style="width:336px;height:336px;min-height:336px;flex-shrink:0;">\n          <!-- 三点图标 -->'
)
s = s.replace(
  '        <text style="font-size:24px;color:#FFFFFF;">✓</text>\n      </div>\n    </div>\n\n  </div>\n</template>',
  '            <text style="font-size:24px;color:#FFFFFF;">✓</text>\n          </div>\n        </div>\n      </scroll>\n    </div>\n\n  </div>\n</template>'
)
fs.writeFileSync('src/pages/logout/logout.ux', s, 'utf8')
console.log('logout scroll added')

// ===== 3. confirm 加 scroll =====
s = fs.readFileSync('src/pages/confirm/confirm.ux', 'utf8')
s = s.replace(
  '    <div if="{{isCircle}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">\n      <!-- 三点图标 -->',
  '    <div if="{{isCircle}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">\n      <scroll scroll-y="true" style="width:336px;height:336px;flex-direction:column;">\n        <div style="width:336px;height:336px;min-height:336px;flex-shrink:0;">\n          <!-- 三点图标 -->'
)
s = s.replace(
  '        <text style="font-size:24px;color:#FFFFFF;">✓</text>\n      </div>\n    </div>\n\n  </div>\n</template>',
  '            <text style="font-size:24px;color:#FFFFFF;">✓</text>\n          </div>\n        </div>\n      </scroll>\n    </div>\n\n  </div>\n</template>'
)
fs.writeFileSync('src/pages/confirm/confirm.ux', s, 'utf8')
console.log('confirm scroll added')

// ===== 4. 首页对勾居中 =====
s = fs.readFileSync('src/pages/home/home.ux', 'utf8')
// 卡片圆环中心约 (50, 49)@293x98 → 对勾 36x36 中心 (50, 49) → left=32, top=31
s = s.replace(
  'icon-check.png" style="position:absolute;left:28px;top:27px;width:36px;height:36px;"',
  'icon-check.png" style="position:absolute;left:32px;top:31px;width:36px;height:36px;"'
)
fs.writeFileSync('src/pages/home/home.ux', s, 'utf8')
console.log('home checkmark centered')
