import fs from 'fs'
let s = fs.readFileSync('src/pages/notes/notes.ux', 'utf8')

const circleBlock = `    <!-- ═══ 圆屏：代码渲染（三点+标题+卡片列表） ═══ -->
    <div if="{{isCircle}}" style="position:absolute;left:0;top:0;width:336px;height:336px;">
      <!-- 三点图标 -->
      <image if.static="{{isCircle}}" src="../../common/circle-ctr-82.png" style="position:absolute;left:148px;top:15px;width:41px;height:41px;"></image>
      <!-- 标题 -->
      <text if="{{isCircle}}" style="position:absolute;left:36px;top:67px;width:264px;text-align:center;font-size:28px;font-weight:700;color:#FFFFFF;lines:1;">便签</text>
      <!-- 便签卡片列表 -->
      <scroll if="{{isCircle && !empty && !loading}}" scroll-y="true" bounces="false" style="position:absolute;left:0;top:110px;width:336px;height:226px;flex-direction:column;">
        <div for="{{notes}}" style="width:291px;min-height:77px;margin-left:22px;margin-bottom:10px;border-radius:24px;background-color:#262626;flex-direction:column;justify-content:center;padding-left:22px;padding-right:22px;" onclick="editNote($item.id)">
          <text style="font-size:22px;color:#FFFFFF;lines:2;text-overflow:ellipsis;">{{$item.content}}</text>
        </div>
        <div style="height:84px;min-height:84px;flex-shrink:0;"></div>
      </scroll>
      <!-- 空状态 -->
      <text if="{{isCircle && empty}}" style="position:absolute;left:36px;top:180px;width:264px;text-align:center;font-size:22px;color:#666666;">暂无便签</text>
    </div>

    <!-- 空状态`

s = s.replace('    <!-- 空状态', circleBlock)
fs.writeFileSync('src/pages/notes/notes.ux', s, 'utf8')
console.log('circle branch added')
