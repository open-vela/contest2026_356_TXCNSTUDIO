import fs from 'fs'

// ===== TOKEN: 合并 4 个 scroll 为 1 个，减少大图解码 =====
let s = fs.readFileSync('src/pages/token/token.ux', 'utf8')
const circleStart = s.indexOf('圆屏：背景图进 scroll')
const circleEnd = s.indexOf('<!-- InputMethod')

if (circleStart < 0 || circleEnd < 0) {
  console.log('token: section not found, checking structure...')
  const idx = s.indexOf('circle-token-bg')
  console.log('first token bg at:', idx)
  console.log(s.substring(Math.max(0, idx - 100), idx + 200))
  process.exit(1)
}

const oldSection = s.substring(circleStart, circleEnd)
console.log('token old section length:', oldSection.length)
console.log('scroll count:', (oldSection.match(/<scroll/g) || []).length)

// 新结构：单个 scroll + if/elif/else 切换背景和内容
const newSection = `圆屏：单 scroll + if/elif 切换状态（减少大图解码） ═══ -->
    <div if="{{isCircle}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">
      <scroll scroll-y="true" style="width:336px;height:336px;flex-direction:column;">
        <div style="width:336px;height:417px;min-height:417px;flex-shrink:0;">
          <!-- 背景：if/elif/else 同时只渲染 1 张 -->
          <image if="{{!bound && !loginFail && !circleEditing}}" src="../../common/circle-token-bg.png" style="position:absolute;left:0;top:0;width:336px;height:417px;object-fit:contain;"></image>
          <image elif="{{bound}}" src="../../common/circle-token-bg.png" style="position:absolute;left:0;top:0;width:336px;height:417px;object-fit:contain;"></image>
          <image elif="{{loginFail}}" src="../../common/circle-token-bg.png" style="position:absolute;left:0;top:0;width:336px;height:417px;object-fit:contain;"></image>
          <image else src="../../common/circle-token-bind-bg.png" style="position:absolute;left:0;top:0;width:336px;height:417px;object-fit:contain;"></image>

          <!-- 未登录状态文字 -->
          <text if="{{!bound && !loginFail && !circleEditing}}" style="position:absolute;left:39.9px;top:168px;width:256px;height:35px;text-align:left;font-size:28px;font-weight:700;color:#FFFFFF;">未登录</text>
          <image if="{{!bound && !loginFail && !circleEditing}}" src="../../common/circle-card-8.png" style="position:absolute;left:21.7px;top:226.8px;width:291.2px;height:77px;" onclick="goLogin"></image>

          <!-- 已登录状态文字 -->
          <text if="{{bound}}" style="position:absolute;left:39.9px;top:168px;width:256px;height:35px;text-align:left;font-size:28px;font-weight:700;color:#FFFFFF;">已登录</text>
          <image if="{{bound}}" src="../../common/circle-card-7.png" style="position:absolute;left:21.7px;top:226.8px;width:291.2px;height:77px;" onclick="goLogout"></image>

          <!-- 失败状态文字 -->
          <text if="{{loginFail}}" style="position:absolute;left:39.9px;top:164px;width:256px;height:31px;text-align:left;font-size:26px;font-weight:700;color:#FFFFFF;">登录失败</text>
          <text if="{{loginFail}}" style="position:absolute;left:39.9px;top:195px;width:256px;height:21px;text-align:left;font-size:16px;color:#FF4444;">请检查网络</text>
          <image if="{{loginFail}}" src="../../common/circle-card-8.png" style="position:absolute;left:22px;top:227px;width:291px;height:77px;" onclick="retry"></image>

          <!-- 绑定态：标签已含在背景，叠绑定码和确认按钮 -->
          <text if="{{circleEditing && !bound && !loginFail}}" style="position:absolute;left:39.9px;top:168px;width:256px;height:35px;text-align:left;font-size:28px;font-weight:700;color:#FFFFFF;lines:1;text-overflow:ellipsis;" onclick="showKeyboard">{{code || '请输入'}}</text>
          <div if="{{circleEditing && !bound && !loginFail}}" style="position:absolute;left:21.7px;top:119.7px;width:292.6px;height:98px;" onclick="showKeyboard"></div>
          <image if="{{circleEditing && !bound && !loginFail}}" src="../../common/circle-card-9.png" style="position:absolute;left:22.4px;top:226.8px;width:291.2px;height:77px;" onclick="doBind"></image>
        </div>
      </scroll>
    </div>

    `

s = s.substring(0, circleStart) + newSection + s.substring(circleEnd)
fs.writeFileSync('src/pages/token/token.ux', s, 'utf8')
console.log('token: merged 4 scrolls into 1')
