# Checkpoint spillover: 稳定 UI 规格指令
_Extracted from checkpoint.md §3 Directives（2026-08-02 checkpoint budget pass）。这些是已定稿的 UI 规格指令（SVG 设计稿来源、主页空状态、主页已批准部分）——核心数值/约束已留 MEMORY.md ## Rules，本文件为会话内细节存档，按需回读。_

- 全部页面 UI 规格来源 = 用户提供的 SVG 文件（C:\Users\Administrator\Downloads\主页清单ui，13 份已解码）；"ui一定要和我的设计稿一摸一样不能有一点差错" 仍为约束。实现时必须用 SVG 原始数值（rx36/#262626/时钟环+灰对勾），不要用 Edge 渲染图的颜色（渐变渲染有 bug）。
- ⚠️ 主页空状态（以用户 C:\Users\Administrator\Downloads\容器.png 为准，2026-08-01 已修正）：**含深灰卡片 #262626**（left:104 top:146，128x124，rx42），信封图标 empty-ico.png 68x56 在卡片内居中，"没有内容" 白28px 在卡片下方（left:105 top:306 width:126 center）。曾误判"无卡片"已恢复。空状态用**流式布局**（flex column + align-items:center + margin-top:60/36）——勿改回 absolute（Vela absolute 相对最近 positioned 祖先，放进列表区 div 会整体下移 86px）。
- 用户已批准主页其余部分（"其他的可以的"）——优先级色圆环 border + createdAt 时间行视为已认可，不要再要求拍板。
- 图标素材以用户自制为准：C:\Users\Administrator\Downloads\主页清单ui\tb\（添加图标.png 32x31 / 返回图标.png 16x27 / 顶端垃圾桶.png 30x32）→ src/common/icon-add.png|icon-back.png|icon-del-top.png，已应用到全部页面按钮。⚠️ icon-del-top.png 已换为 tb 449B 新版（29x31 实心白桶，用户二轮确认，勿再换）。⚠️ **主页返回键图标 2026-08-02 已换 = src/common/icon-back-home.png（用户切图5.png，40x10 三条竖线菜单图标，显示用原图尺寸 40x10，勿放大）**——主页返回按钮不再用 icon-back.png 左箭头；**home 完成圆圈对勾 2026-08-02 换 = src/common/icon-check.png（用户完成.png，45x45 打勾，替换原 text ✓ 38px）**。
