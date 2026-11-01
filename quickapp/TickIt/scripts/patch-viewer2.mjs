import fs from 'fs'
const p = 'F:/新建文件夹/tickit/src/pages/viewer/viewer.ux'
let t = fs.readFileSync(p, 'utf8')

// 在详情模式 scroll 前插入圆屏整图分支，并给 rect 路径加 if=!isCircle
// 找到「详情模式」区块
const startMark = '    <!-- 详情模式：可滑动，切图一比一复刻 -->'
const endMark = '    <!-- 编辑模式：输入框在上（点击弹出键盘），输入法独立于页面底部 -->'
const i0 = t.indexOf(startMark)
const i1 = t.indexOf(endMark)
if (i0 < 0 || i1 < 0) {
  console.log('marks not found', i0, i1)
  process.exit(1)
}

const circleBlock = `    <!-- ═══ 圆屏详情：设计稿整图进 scroll + 动态标题 + 点击区 ═══ -->
    <div if="{{isCircle && !editing}}" style="position:absolute;left:0;top:70px;width:336px;height:340px;">
      <scroll scroll-y="true" style="width:336px;height:340px;flex-direction:column;">
        <div style="width:336px;height:785px;">
          <image src="../../common/circle-viewer.png" style="position:absolute;left:0;top:0;width:336px;height:785px;"></image>
          <!-- 动态标题（覆盖设计稿示例文字） -->
          <text style="position:absolute;left:40px;top:172px;width:256px;font-size:22px;font-weight:700;color:#FFFFFF;lines:1;text-overflow:ellipsis;">{{title}}</text>
          <!-- 状态点击区（卡片2） -->
          <div style="position:absolute;left:22px;top:220px;width:292px;height:90px;" onclick="toggleDone"></div>
          <!-- 优先级点击区 → 跳优先级页 -->
          <div style="position:absolute;left:22px;top:310px;width:292px;height:80px;" onclick="openPriority"></div>
          <!-- 截止时间点击区 -->
          <div style="position:absolute;left:22px;top:390px;width:292px;height:80px;" onclick="cycleDue"></div>
          <!-- 底部操作按钮区：编辑 / 分享 / 删除（480 y≈540-1150 → 336 y≈378-805） -->
          <div style="position:absolute;left:22px;top:378px;width:292px;height:100px;" onclick="startEdit"></div>
          <div style="position:absolute;left:22px;top:500px;width:292px;height:100px;" onclick="shareItem"></div>
          <div style="position:absolute;left:22px;top:620px;width:292px;height:100px;" onclick="startConfirmDelete"></div>
        </div>
        <div style="height:12px;"></div>
      </scroll>
    </div>

    <!-- ═══ 矩形屏详情（原逻辑）═══ -->
    <div if="{{!isCircle && !editing}}" style="position:absolute;left:0;top:85px;width:336px;height:395px;">
      <scroll scroll-y="true" style="width:336px;height:395px;flex-direction:column;">
`

// 保留原 rect scroll 内容，但去掉原来的外层 div 开头（已被上面替换）
// 找到原 rect 的 scroll 开始行，保留其内容到 endMark
// 实际上 i0 到 i1 之间的原内容需要去掉开头的 <div ...> 和 <scroll ...> 行，
// 保留卡片内容。简化：整块替换为 circle + 精简 rect（rect 保持原卡片结构）

// 从原文提取 rect scroll 内部内容（跳过原开头两行 div/scroll）
const orig = t.slice(i0, i1)
const scrollStart = orig.indexOf('<scroll')
const scrollOpenEnd = orig.indexOf('>', scrollStart) + 1
const innerStart = orig.indexOf('\n', scrollOpenEnd) + 1
// 原内容到 endMark 前，还要去掉末尾的 </scroll></div>
let inner = orig.slice(innerStart)
inner = inner.replace(/<\/scroll>\s*<\/div>\s*$/m, '')

const newContent = circleBlock + inner + `      </scroll>
    </div>

`

t = t.slice(0, i0) + newContent + t.slice(i1)
fs.writeFileSync(p, t)
console.log('viewer circle block injected, inner length', inner.length)
