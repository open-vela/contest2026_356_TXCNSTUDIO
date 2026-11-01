import fs from 'fs'
const p = 'F:/新建文件夹/tickit/src/pages/viewer/viewer.ux'
let t = fs.readFileSync(p, 'utf8')

const marker = '        <!-- 优先级（2x2：高/中/低/置顶） -->'
const endMark = '        <!-- 截止时间'
const i0 = t.indexOf(marker)
const i1 = t.indexOf(endMark)
if (i0 < 0 || i1 < 0 || i1 < i0) {
  console.log('block not found', i0, i1)
  process.exit(1)
}

const newBlock = `        <!-- 优先级：矩形=2x2 直选；圆屏=点进优先级页 -->
        <text if="{{!isCircle}}" static style="font-size:24px;color:#8E8E93;margin-top:16px;margin-left:30px;">优先级</text>
        <div if="{{!isCircle}}" style="width:336px;flex-direction:row;flex-wrap:wrap;margin-top:10px;">
          <image if="{{priority===3}}" src="../../common/pri-high-sel.png" style="width:157px;height:112px;margin-left:6px;margin-right:4px;margin-bottom:12px;" onclick="setPriority(3)"></image>
          <image else src="../../common/pri-high.png" style="width:157px;height:112px;margin-left:6px;margin-right:4px;margin-bottom:12px;" onclick="setPriority(3)"></image>
          <image if="{{priority===2}}" src="../../common/pri-mid-sel.png" style="width:157px;height:112px;margin-left:6px;margin-right:4px;margin-bottom:12px;" onclick="setPriority(2)"></image>
          <image else src="../../common/pri-mid.png" style="width:157px;height:112px;margin-left:6px;margin-right:4px;margin-bottom:12px;" onclick="setPriority(2)"></image>
          <image if="{{priority===1}}" src="../../common/pri-low-sel.png" style="width:157px;height:112px;margin-left:6px;margin-right:4px;margin-bottom:12px;" onclick="setPriority(1)"></image>
          <image else src="../../common/pri-low.png" style="width:157px;height:112px;margin-left:6px;margin-right:4px;margin-bottom:12px;" onclick="setPriority(1)"></image>
          <image if="{{pinned}}" src="../../common/pri-pin-sel.png" style="width:157px;height:112px;margin-left:6px;margin-right:4px;margin-bottom:12px;" onclick="togglePin"></image>
          <image else src="../../common/pri-pin.png" style="width:157px;height:112px;margin-left:6px;margin-right:4px;margin-bottom:12px;" onclick="togglePin"></image>
        </div>
        <div if="{{isCircle}}" style="width:291px;height:77px;margin-left:22px;margin-top:12px;border-radius:24px;background-color:#262626;flex-direction:row;align-items:center;padding-left:22px;padding-right:22px;" onclick="openPriority">
          <text style="font-size:20px;color:#8E8E93;margin-right:12px;">优先级</text>
          <text style="flex:1;font-size:22px;font-weight:700;color:#FFFFFF;">{{priLabel}}{{pinned ? ' · 置顶' : ''}}</text>
          <text style="font-size:22px;color:#666666;">›</text>
        </div>

`

t = t.slice(0, i0) + newBlock + t.slice(i1)
fs.writeFileSync(p, t)
console.log('viewer priority block replaced')
