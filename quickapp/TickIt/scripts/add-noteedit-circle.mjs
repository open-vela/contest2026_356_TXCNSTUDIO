import fs from 'fs'
let s = fs.readFileSync('src/pages/noteedit/noteedit.ux', 'utf8')

// 在 template 内部开头加圆屏分支
const circleDetail = `    <!-- ═══ 圆屏详情：三点+标题+内容卡+操作按钮 ═══ -->
    <div if="{{isCircle && !editing}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">
      <scroll scroll-y="true" bounces="false" style="width:336px;height:336px;flex-direction:column;">
        <div static style="width:336px;height:520px;min-height:520px;flex-shrink:0;">
          <!-- 三点 -->
          <image src="../../common/circle-ctr-82.png" style="position:absolute;left:148px;top:15px;width:41px;height:41px;"></image>
          <!-- 标题 -->
          <text style="position:absolute;left:36px;top:67px;width:264px;text-align:center;font-size:28px;font-weight:700;color:#FFFFFF;lines:1;">便签详情</text>
          <!-- 内容卡片 -->
          <div style="position:absolute;left:22px;top:115px;width:291px;min-height:120px;border-radius:24px;background-color:#262626;flex-direction:column;padding:22px;">
            <text style="font-size:20px;color:#8E8E93;">便签内容</text>
            <text style="font-size:26px;font-weight:400;color:#FFFFFF;margin-top:10px;">{{content}}</text>
          </div>
          <!-- 操作按钮：修改内容 / 分享 / 删除 -->
          <image src="../../common/circle-ctr-96.png" style="position:absolute;left:22px;top:310px;width:291px;height:77px;" onclick="startEdit"></image>
          <image src="../../common/circle-ctr-97.png" style="position:absolute;left:22px;top:397px;width:291px;height:77px;" onclick="delNote"></image>
        </div>
      </scroll>
    </div>

    <!-- ═══ 圆屏编辑：三点+标题「修改内容」+文字输入 ═══ -->
    <div if="{{isCircle && editing}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">
      <!-- 三点 -->
      <image src="../../common/circle-ctr-82.png" style="position:absolute;left:148px;top:15px;width:41px;height:41px;"></image>
      <!-- 标题 -->
      <text style="position:absolute;left:36px;top:67px;width:264px;text-align:center;font-size:28px;font-weight:700;color:#FFFFFF;lines:1;">修改内容</text>
      <!-- 输入卡片 -->
      <div style="position:absolute;left:22px;top:120px;width:291px;height:77px;border-radius:24px;background-color:#262626;flex-direction:row;align-items:center;padding-left:22px;padding-right:22px;" onclick="showKeyboard">
        <text style="flex:1;font-size:24px;font-weight:700;color:{{content ? '#FFFFFF' : '#8E8E93'}};lines:1;text-overflow:ellipsis;">{{content || '请输入内容'}}{{cursorStr}}</text>
      </div>
    </div>

`

const marker = '    <!-- ═══ 编辑模式：黑框输入 + ✓ 保存 + 键盘 ═══ -->'
s = s.replace(marker, circleDetail + marker)

// 移除条件编译残留
s = s.replace(/<!-- endif -->\s*/g, '')

fs.writeFileSync('src/pages/noteedit/noteedit.ux', s, 'utf8')
console.log('circle branches added')
