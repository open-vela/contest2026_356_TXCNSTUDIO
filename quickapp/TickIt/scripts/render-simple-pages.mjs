import fs from 'fs'

// ===== LOGOUT =====
let s = fs.readFileSync('src/pages/logout/logout.ux', 'utf8')
const oldLogout = s.substring(s.indexOf('圆屏：背景图'), s.indexOf('</template>'))
const newLogout = `圆屏：纯代码渲染（三点+标题+卡片+按钮）+ 右划返回 ═══ -->
    <div if="{{isCircle}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">
      <!-- 三点图标 -->
      <image src="../../common/circle-ctr-82.png" style="position:absolute;left:148px;top:32px;width:41px;height:41px;"></image>
      <!-- 标题 -->
      <text style="position:absolute;left:36px;top:67px;width:264px;text-align:center;font-size:28px;font-weight:700;color:#FFFFFF;lines:1;">退出登录</text>
      <!-- 确认卡片 -->
      <div style="position:absolute;left:22px;top:120px;width:291px;height:106px;border-radius:24px;background-color:#262626;flex-direction:column;justify-content:center;align-items:center;">
        <text style="font-size:24px;font-weight:700;color:#FFFFFF;lines:1;">确认退出登录?</text>
        <text style="font-size:16px;color:#FF4444;margin-top:8px;lines:1;">退出后将无法使用在线功能</text>
      </div>
      <!-- 红色退出按钮 -->
      <div style="position:absolute;left:22px;top:241px;width:291px;height:77px;border-radius:24px;background-color:#FF4444;flex-direction:row;align-items:center;padding-left:26px;padding-right:26px;" onclick="doLogout">
        <text style="flex:1;font-size:24px;font-weight:700;color:#FFFFFF;lines:1;">退出登录</text>
        <text style="font-size:24px;color:#FFFFFF;">✓</text>
      </div>
    </div>

  </div>
</template>

<script>`
s = s.replace(oldLogout, newLogout)
fs.writeFileSync('src/pages/logout/logout.ux', s, 'utf8')
console.log('logout done')

// ===== CONFIRM =====
s = fs.readFileSync('src/pages/confirm/confirm.ux', 'utf8')
const oldConfirm = s.substring(s.indexOf('圆屏：删除背景图'), s.indexOf('</template>'))
const newConfirm = `圆屏：纯代码渲染（三点+标题+卡片+按钮） ═══ -->
    <div if="{{isCircle}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">
      <!-- 三点图标 -->
      <image src="../../common/circle-ctr-82.png" style="position:absolute;left:148px;top:32px;width:41px;height:41px;"></image>
      <!-- 标题 -->
      <text style="position:absolute;left:36px;top:67px;width:264px;text-align:center;font-size:28px;font-weight:700;color:#FFFFFF;lines:1;">删除</text>
      <!-- 确认卡片 -->
      <div style="position:absolute;left:22px;top:120px;width:291px;height:106px;border-radius:24px;background-color:#262626;flex-direction:column;justify-content:center;align-items:center;">
        <text style="font-size:24px;font-weight:700;color:#FFFFFF;lines:1;">确认删除吗</text>
        <text style="font-size:16px;color:#FF4444;margin-top:8px;lines:1;">删除后将无法恢复</text>
      </div>
      <!-- 红色确认按钮 -->
      <div style="position:absolute;left:22px;top:241px;width:291px;height:77px;border-radius:24px;background-color:#FF4444;flex-direction:row;align-items:center;padding-left:26px;padding-right:26px;" onclick="doDelete">
        <text style="flex:1;font-size:24px;font-weight:700;color:#FFFFFF;lines:1;">确认删除</text>
        <text style="font-size:24px;color:#FFFFFF;">✓</text>
      </div>
    </div>

  </div>
</template>

<script>`
s = s.replace(oldConfirm, newConfirm)
fs.writeFileSync('src/pages/confirm/confirm.ux', s, 'utf8')
console.log('confirm done')
