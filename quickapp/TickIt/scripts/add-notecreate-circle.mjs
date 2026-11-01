import fs from 'fs'
let s = fs.readFileSync('src/pages/notecreate/notecreate.ux', 'utf8')

// 1. 加圆屏分支
const circleBlock = `    <!-- ═══ 圆屏：三点+标题+输入卡片+键盘 ═══ -->
    <div if="{{isCircle}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">
      <!-- 三点 -->
      <image if.static="{{isCircle}}" src="../../common/circle-ctr-82.png" style="position:absolute;left:148px;top:15px;width:41px;height:41px;"></image>
      <!-- 标题 -->
      <text if="{{isCircle}}" style="position:absolute;left:36px;top:67px;width:264px;text-align:center;font-size:28px;font-weight:700;color:#FFFFFF;lines:1;">创建便签</text>
      <!-- 输入卡片 -->
      <div style="position:absolute;left:22px;top:120px;width:291px;height:77px;border-radius:24px;background-color:#262626;flex-direction:row;align-items:center;padding-left:22px;padding-right:22px;" onclick="showKeyboard">
        <text style="flex:1;font-size:24px;font-weight:700;color:{{content ? '#FFFFFF' : '#8E8E93'}};lines:1;text-overflow:ellipsis;">{{content || '请输入内容'}}{{cursorStr}}</text>
      </div>
    </div>

    <!-- ═══ 方屏原布局 ═══ -->
    <div if="{{isCircle === false}}">

    <!-- 创建便签：黑框输入 + ✓ 保存 + 键盘 -->`

s = s.replace(
  '    <!-- 创建便签：黑框输入 + ✓ 保存 + 键盘 -->',
  circleBlock
)

// 2. 方屏外层 div 闭合（在 input-method 前）
s = s.replace(
  '    <!-- 点击空白收起输入法 -->',
  '    </div>\n\n    <!-- 点击空白收起输入法 -->'
)

// 3. 移除条件编译残留
s = s.replace(/<!-- endif -->\s*/g, '')

fs.writeFileSync('src/pages/notecreate/notecreate.ux', s, 'utf8')
console.log('circle branch added')
