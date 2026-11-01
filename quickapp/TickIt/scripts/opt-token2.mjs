import fs from 'fs'
let s = fs.readFileSync('src/pages/token/token.ux', 'utf8')
const lines = s.split(/\r?\n/)

// 找到圆屏注释行开始和 InputMethod 前结束
let start = -1, end = -1
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('圆屏：背景图进 scroll')) { start = i; break }
}
for (let i = start + 1; i < lines.length; i++) {
  if (lines[i].includes('<input-method')) { end = i; break }
}

if (start < 0 || end < 0) {
  console.log('section not found:', start, end)
  process.exit(1)
}

const newLines = [
  '    <!-- ═══ 圆屏：单 scroll + if/elif 切换状态（减少大图解码） ═══ -->',
  '    <div if="{{isCircle}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">',
  '      <scroll scroll-y="true" style="width:336px;height:336px;flex-direction:column;">',
  '        <div style="width:336px;height:417px;min-height:417px;flex-shrink:0;">',
  '          <!-- 背景：if/elif/else 同时只渲染 1 张 -->',
  '          <image if="{{!bound && !loginFail && !circleEditing}}" src="../../common/circle-token-bg.png" style="position:absolute;left:0;top:0;width:336px;height:417px;"></image>',
  '          <image elif="{{bound}}" src="../../common/circle-token-bg.png" style="position:absolute;left:0;top:0;width:336px;height:417px;"></image>',
  '          <image elif="{{loginFail}}" src="../../common/circle-token-bg.png" style="position:absolute;left:0;top:0;width:336px;height:417px;"></image>',
  '          <image else src="../../common/circle-token-bind-bg.png" style="position:absolute;left:0;top:0;width:336px;height:417px;"></image>',
  '',
  '          <!-- 未登录 -->',
  '          <text if="{{!bound && !loginFail && !circleEditing}}" style="position:absolute;left:39.9px;top:168px;width:256px;height:35px;text-align:left;font-size:28px;font-weight:700;color:#FFFFFF;">未登录</text>',
  '          <image if="{{!bound && !loginFail && !circleEditing}}" src="../../common/circle-card-8.png" style="position:absolute;left:21.7px;top:226.8px;width:291.2px;height:77px;" onclick="goLogin"></image>',
  '',
  '          <!-- 已登录 -->',
  '          <text if="{{bound}}" style="position:absolute;left:39.9px;top:168px;width:256px;height:35px;text-align:left;font-size:28px;font-weight:700;color:#FFFFFF;">已登录</text>',
  '          <image if="{{bound}}" src="../../common/circle-card-7.png" style="position:absolute;left:21.7px;top:226.8px;width:291.2px;height:77px;" onclick="goLogout"></image>',
  '',
  '          <!-- 失败 -->',
  '          <text if="{{loginFail}}" style="position:absolute;left:39.9px;top:164px;width:256px;height:31px;text-align:left;font-size:26px;font-weight:700;color:#FFFFFF;">登录失败</text>',
  '          <text if="{{loginFail}}" style="position:absolute;left:39.9px;top:195px;width:256px;height:21px;text-align:left;font-size:16px;color:#FF4444;">请检查网络</text>',
  '          <image if="{{loginFail}}" src="../../common/circle-card-8.png" style="position:absolute;left:22px;top:227px;width:291px;height:77px;" onclick="retry"></image>',
  '',
  '          <!-- 绑定态 -->',
  '          <text if="{{circleEditing && !bound && !loginFail}}" style="position:absolute;left:39.9px;top:168px;width:256px;height:35px;text-align:left;font-size:28px;font-weight:700;color:#FFFFFF;lines:1;text-overflow:ellipsis;" onclick="showKeyboard">{{code || "请输入"}}</text>',
  '          <div if="{{circleEditing && !bound && !loginFail}}" style="position:absolute;left:21.7px;top:119.7px;width:292.6px;height:98px;" onclick="showKeyboard"></div>',
  '          <image if="{{circleEditing && !bound && !loginFail}}" src="../../common/circle-card-9.png" style="position:absolute;left:22.4px;top:226.8px;width:291.2px;height:77px;" onclick="doBind"></image>',
  '        </div>',
  '      </scroll>',
  '    </div>',
  '',
  '    <!-- 输入法 -->',
]

// 替换 start..end-1 行
const result = [...lines.slice(0, start), ...newLines, ...lines.slice(end)]
fs.writeFileSync('src/pages/token/token.ux', result.join('\n'), 'utf8')
console.log('token optimized: 4 scrolls → 1, lines', start, 'to', end, 'replaced')
