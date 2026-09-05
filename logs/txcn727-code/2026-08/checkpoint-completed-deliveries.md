# Checkpoint spillover: 已完成交付详情（2026-08-02/08-03 历史闭环，均已同步进 MEMORY.md）
_Extracted from §5 Current work at 2026-08-03 checkpoint（§5 超预算）。均为已闭环交付，非当前焦点（当前焦点 = 整体预览.png 布局核对）。_

**✅ 云端 is_pinned 支持完成（2026-08-03，验证 OK）**
- download 目录恢复（api-watch.php 48343B 完整）→ api-watch.php `add` 分支（line 826-838）加 is_pinned：`$is_pinned = isset($input['is_pinned']) ? ($input['is_pinned'] ? 1 : 0) : 0;` + INSERT is_pinned 占位符 `0` → `?, ?`（execute([$user_id,$text,$priority,$is_pinned,$category_id,$due_date])）→ **node 大括号平衡校验 OK**
- 置顶全链路已通：numpad 置顶选项 → cloudAddTodo is_pinned → 云端 add → mergeCloudItems 同步 → home 排序置顶优先；**需用户替换服务器 api.php 才云端生效**

**✅ 修 bug：创建/删除清单后自动同步不可靠——三轮修复全部闭环（2026-08-03，build ✅ 08:31 / 08:39 / 08:43）**

**轮 1（build 08:31）——写入竞态 + 删除改 pending 机制**
- 用户："今天咱们来修bug，就是目前我发现就是这个删除清单和创建清单后这个自动同步有点问题，有时候会同步不了"
- 根因 ①：**numpad.ux confirm（line 160-169）** `items.push(newItem)` → `utils.storageSet('todo_items', ...)` **未等写入完成就 toast+router.back()** → home.onShow syncPending 读 storage 读到旧数据（无新项）→ 新建项不上传云端
- 根因 ②：**confirm.ux doDelete（line 54-90）** 同样 storageSet 未等待就 back；且 cloudDeleteTodo 链（storageGet token → loadOffline → cloudDeleteTodo）在 **router.back() 页面销毁后中断** → 云端未删、下次 autoSync 拉回"复活"
- 修复：① numpad = `utils.storageSet(...).then(function(){ utils.toast('已创建'); router.back() })` ② confirm = 本地删除 `storageSet('todo_items')` **写入完成后才 back** + 被删项 cloudId **记入 storage `todo_pending_delete`**（去重）→ 云端删除移交 home ③ home.syncPending 扩展：上传无 cloudId 项 + **执行待删云端项**（cloudDeleteTodo 成功清掉 / 失败保留 remaining 重试）

**轮 2（build 08:39）——网页加截止同步不过来 = autoSync 60s 节流**
- 用户："如果我在手环上创建了一个无这个截止时间的清单，但我去网页端加了截止时间，这样的话它就同步不过来"
- 排查：本地 api-watch.php **完整支持 due_date**（migration v8 + GET `SELECT ... due_date ...` + add/update 条件拼 SQL）✓ 代码侧无误；mergeCloudItems 的 due 处理（`parseInt(c.due_date,10)||undefined`）✓
- **根因 = home autoSync 的 60 秒 lastSyncTime 节流**：手环创建后回主页已 pull 过一次；去网页加完截止回来 **<60s 自动拉取被跳过** → 截止不同步
- 修复：**去掉 autoSync 节流**（删 private lastSyncTime）——每次 onShow 都拉取云端合并
- ⚠️ 交付时提醒用户：**服务器 api.php 必须是最新版**（含 due_date 支持）；确认方法 = 网页加截止后刷新页面截止仍在 → api.php 新版 ✓

**轮 3（build 08:43）——删除不灵敏 = syncPending/autoSync 并发竞态**
- 用户："这个删除还是不灵敏"
- **根因 = home onShow 里 autoSync（pull）与 syncPending（云端删除）并发启动**：autoSync 的 pull+merge 在云端删除完成前执行 → 把云端旧数据（**含被删项**）写回本地 → "删了又出现"
- 修复：**syncPending 重构返回 Promise**（上传链 → 删除链**串行**完成才 resolve）；onShow 改 `that.syncPending().then(function(){ that.autoSync() })`——**先执行待办（删云端完成）→ 再拉取合并**（此时云端已删，merge 不再加回）

**🆕 云端 is_pinned 支持（2026-08-03 进行中——后被上方的"支持完成"取代）**
- 背景：创建清单页设计稿新增"置顶"选项 → 手表端已全链路实现（见下）；云端 add 需接收 is_pinned
- ⚠️ 中途：C:\Users\Administrator\Downloads\download 目录（含 api-watch.php/checklist.html/api.php）**整体被用户删除**（清理 C 盘）→ api-watch.php edit 报 File not found → 告知用户需提供服务器 api.php → 用户"好了，你继续改" → **目录已恢复**（api-watch.php 48343B 含此前全部改动）→ 重新编辑
- ✅ 已改（最后操作）：api-watch.php `add` 分支（line 826-838）：
  - 加 `$is_pinned = isset($input['is_pinned']) ? ($input['is_pinned'] ? 1 : 0) : 0;`
  - INSERT 改 `... priority, is_pinned, category_id, due_date) VALUES (?, ?, 0, ?, ?, ?, ?)` + execute([$user_id, $text, $priority, $is_pinned, $category_id, $due_date])
- 待办：验证改动（重读/php -l）→ 交付总结（提醒替换服务器 api.php 后置顶云端生效）

**✅ 创建清单页 UI 重构（2026-08-03，build ✅ 17:16:44）**
- 设计稿 C:\Users\Administrator\Downloads\创建清单页ui（16 张 157x112 容器切图 + 背景 + 整体预览 336x806）；像素级验证（主代理三重交叉验证，**纠正两个子代理"金色边框 #FFD60A 选中态"幻觉**——真实选中态 = 整卡彩色填充白字）
- 布局（336x806 可滚动长页）：时间 → 返回按钮（#262626 圆角）→ 标题"创建清单"→ 名称输入框（112 高圆角 16）→ 优先级标签 → 优先级 2×2（高/中/低/**置顶**）→ 截止时间标签 → 截止 2×2（无/今天/明天/3天，**去"一周"**）；卡片 152x110 圆角 16、左卡 x8 右卡 x176；背景图含标题+输入框底+两个区域标签（覆盖层不重复）
- 切图映射：高=容器26(选)/41、中=27/40、低=29/39、置顶=28/38、无=30/37、今天=31/36、明天=33/35、3天=32/34；选中色：高 #D22D2D 红/中 #3A75DB 蓝/低 #8B1EB7 紫/置顶 #269841 绿/截止统一 #428CE1 蓝；未选中 #262626
- 实现：
  - 素材复制 src/common/：pri-high-sel/high/mid-sel/mid/low-sel/low/pin-sel/pin + due-none-sel/none/today-sel/today/tomorrow-sel/tomorrow/3day-sel/3day（16 张）
  - **numpad.ux 重写**：标题"创建清单"；scroll 内容区（left:8 top:96 width:320 height:384）；名称输入框 112 高（"名称"灰标签 + 内容白 `{{title||'请输入'}}_`，点击 showKeyboard）；优先级 2×2（image 动态 src `{{priority===3 ? sel : plain}}`，置顶用 `{{pinned ? ...}}` onclick togglePin）；截止 2×2（for 循环 dueOptions 4 个）；顶部保留返回+时间+✓确认按钮（**设计稿无确认按钮但功能必需**）；JS：priority/pinned/dueSel + setPriority/togglePin/setDue/getDueTs（无/今天/明天=23:59:59/3天=now+3d）
  - **home.ux**：loadItems map 加 `pinned: item.is_pinned === 1`；排序 `if (b.pinned !== a.pinned) return (b.pinned?1:0) - (a.pinned?1:0)`（done 后置顶优先）；syncPending cloudAddTodo 传 `item.is_pinned || 0`
  - **utils.js**：cloudAddTodo(token, text, priority, dueDate, isPinned) 加 `if (isPinned) { data.is_pinned = 1 }`；mergeCloudItems 两处（已有项 + 云端新增项）加 is_pinned 同步（parseInt 归一化）
- 编译 ✅ 17:16:44

**✅ 同步页 UI 重构（2026-08-03，build 14:05:37 / 14:12:37 / 14:13:05）**
- 设计稿 C:\Users\Administrator\Downloads\同步页ui：3 状态背景图（同步中/成功/失败 336x480）+ 示例图 + 4 按钮素材（取消/完成 300x80、离线模式/去绑定 150x80，#262626 底白字圆角 30）
- **整图背景方案**：背景图（自带标题"同步内容"+中央图标+状态文字）if/elif/else 按状态切换（sync-bg/sync-success-bg/sync-fail-bg）；覆盖层 = 返回按钮（72px 圆 #262626）+ 时间 + 动态说明文字（top 两轮微调 **344→330→316**，syncing #AAAAAA"正在拉取云数据"/fail/offline/nobind #999999）+ 按钮素材（syncing=btn-cancel top392 300x80 goBack / success=btn-done / fail/offline/nobind=btn-offline 150x80 switchOffline + btn-bind 150x80 goBind→pages/token）
- JS 简化：删 statusIcon/statusColor/statusTitle/progress/animateProgress/syncStep；状态 syncing/success/fail/offline/nobind；descText/descColor 动态；流程 onShow→loadOffline→checkBindAndSync→startSync→pullAndMerge→mergeAndSave→push→success
- 编译 ✅ 三轮（14:05 重构 / 14:12 说明文字 344→330 / 14:13 →316）

**✅ codify MCP 配置→验证→删除闭环（2026-08-03）**
- 用户贴 Claude Code mcpServers 格式（@codify-ai/mcp-client + https://mcp.codify-api.com + CODIFY_ACCESS_KEY 明文）
- 调研（mimocode-docs skill + guide.md §MCP servers line 90-107 + config.md mcp 表格）：MiMoCode `mcp` key；local `{type:"local", command:[...], env:{...}}`（command 单键数组、**local 支持 env**）；remote url+headers+oauth；enabled:false 禁用；timeout 5000ms；`mimo mcp` 管理；配置 = 全局 `~/.config/mimocode/mimocode.jsonc`
- 执行：读现有全局配置（$schema + provider.mimo + model_groups.vision）→ 加 mcp.codify 块 → `mimo mcp list` ✓ **codify connected** → 用户问能否看"莫高设计"UI 稿（答：MCP 需**新会话**才挂载工具，当前会话无）→ 用户"把刚刚那个删了吧" → 移除 mcp 块 → `mimo mcp list` **No MCP servers configured** ✓ 闭环；key 全程脱敏

**✅ C 盘素材使用核实（2026-08-03）**
- 用户："你还用不用c盘下载里的那些ui了" → node 脚本扫描全部 .ux 引用图片：页面引用 15 张**全部在 src/common（缺失 0）**，打包进 rpk、运行时**不再依赖 C 盘**；C 盘 Downloads（主页清单ui/同步页ui/散图）只是源素材存档，可删可留

**✅ 正式版 release 打包两轮（2026-08-02，均成功）**
- 17:11 首轮：把工具链内置 pem（node_modules/@aiot-toolkit/aiotpack/lib/compiler/javascript/vela/utils/signature/pem/）复制到项目根 `F:\TXCN清单\sign\`（certificate.pem 1670B + private.pem 3242B）→ `npm run release` ✅ → `F:\TXCN清单\dist\com.txcnstudio.todo.release.2.0.0.rpk`（295038B）——**release 输出到项目根 dist（debug 在 F:\.temp_TXCN清单\dist）**
- 17:22 重打（用户"重新打一个正式版包吧"，含图标清理后代码）✅ → 同路径 **275498B**
- ⚠️ 当前用工具链自带**调试证书**签名；真机安装若提示签名不受信任 → 需小米正式签名证书替换 sign/ 下两个 pem 再 release

**✅ common 图标清理（2026-08-02，build ✅ 17:15:14）**
- 用户："看看那些图标，没有用的删一删"；node 脚本全量扫描 src（.ux/.js/.css/.less/.json）引用计数确认
- 删除 9 个未引用：btn-add / btn-back / del-ico-small / del-ico / empty-icon / home-bg / ic-back / ic-plus / list-bg
- 保留在用：confirm-bg（删除页背景）、empty-ico（空状态信封）、icon-add、icon-back-home、icon-back（10 处引用）、icon-check、icon-del-top、icon-logout（2 处）、logo（2 处）、utils.js

（前置交付已闭环：sync 图标 emoji 全换普通字符 17:01/17:02、about 页两轮 17:07/17:09、设备管理全套、绑定码 8 位、logout 竞态修复、手表端 3 项、syncPending 根治——见前 checkpoint §5，本轮未改）
