# Checkpoint spillover: 稳定/历史指令（2026-08-01 至 08-03 已定案）
_Writer-extracted from checkpoint.md §3 Directives (2026-08-03) to keep the main section within budget. These are stable, completed, or MEMORY.md-duplicated directives — read only when revisiting these subsystems._

## 同步三修复（2026-08-03，已在 MEMORY.md Discovered "创建/删除后自动同步不可靠已闭环" 保留）
- ✅ **Vela storage 写入竞态已修（2026-08-03）**：`utils.storageSet` 是异步 Promise——**必须在 `.then()` 回调确认写入完成后再 router.back()**（numpad/confirm 已改）；删除云端同步已从中间页移出，改 **pending 机制**（confirm 记 cloudId 到 storage `todo_pending_delete` → home.onShow syncPending 执行，成功清除/失败保留重试）。根因家族：页面 router.back() 销毁后未完成 Promise 链回调不执行。
- ✅ **home.onShow 同步串行化（2026-08-03 定案）**：**先 `syncPending()`（执行待办：上传无 cloudId 项 → 删除 pending 云端项，返回 Promise），完成后 `autoSync()`（拉取云端合并）——顺序不能反**（autoSync 并发拉到云端旧数据会把刚删的项 merge 写回本地 → "删了又出现"）。
- ✅ **autoSync 无节流（2026-08-03）**：已去掉 60s lastSyncTime 节流，**每次 onShow 都拉取云端**（网页端外部改动及时同步优先；网络异步不阻塞 UI，数据量小频率低）。

## 网页版/手环 UI 稳定规则（均已在 MEMORY.md Discovered 或 ## Rules 保留原文）
- ⚠️ **网页版 checklist.html 配色 = 用户 2026-08-02 早上自改的 Material 3 CSS 变量主题**（`--primary:#5b5fc7` 紫系 + `[data-theme="dark"]` 深色块）——**该文件以用户版本为准，改动前先验证当前内容；新增 UI 一律用 CSS 变量**，**勿硬编码颜色**。大文件修改后用 node 脚本验证（indexOf 计数 + substring 打印），grep 工具对超长单行 HTML 失效。
- ⚠️ **新建自动同步根治范式（2026-08-02 验证）**：关键异步（上传/拉取/合并）放 **home.onShow 自动执行**（syncPending 上传无 cloudId 项、autoSync 拉取合并），**勿依赖中间页（numpad）等待网络**——页面 router.back() 销毁后未完成 Promise 链回调不执行。
- ⚠️ **网页动态弹窗层级约束（2026-08-02）**：页面预置确认框遮罩 `.scrim` z-index=100——**动态创建的弹窗（appendChild）z-index 必须 <100**（设备管理弹窗用 90），否则 showConfirm 确认框被弹窗盖住（"被堵住"）；**动态弹窗关闭必须按 id 定位 remove 整个外层（含遮罩）**（closeDevDlg()），勿用 parentElement.parentElement（只删内层→遮罩残留黑屏）。
- ⚠️ **checklist.html JS 模板字符串内 onclick 属性**：外层 JS 字符串用单引号包裹时，onclick 属性值**不能含单引号字符串字面量**（提前终止外层字符串 → `Unexpected identifier`）→ 改用独立全局函数（onclick="closeDevDlg()"）。
- ⚠️ **手环状态图标一律用普通字符**（'!' '↓' '✓' '✕' '…' '?'），**emoji 手环字体全部不渲染**——🔗（未绑定）与 ⚡/U+26A1（离线）实测均空白；{{}} 插值也不解析 HTML 实体。
- 统一风格规范（用户认可，用于所有页面）：背景 #000000；卡片 #262626 大圆角（卡片 20-36）；顶部栏 = 左返回 72px 圆按钮（left:6 top:6，#262626 + **icon-back.png 16x27**）+ 时间 26px #999999（top:10 居中）+ 标题 32px 白粗（top:40 居中）+ 右操作按钮 72px 圆；强调蓝 #3B82F6；删除红 #FF3B30。
- 视觉子代理模型：xiaomi/mimo-v2.5（已验证可用）；`--model vision` 组现也指向它。mimo/mimo-auto 的 key 仍 401，不要依赖。
- ⚠️ **网络约束（2026-08-01 更新）**：手表端自解挑战全链路已通（fetch http+UA——https → I/O 300 必须用 http、AES-128-CBC 干净重写版内联 utils.js、__test cookie）；**响应解析闭环（fmt=text）**：Vela fetch 对 application/json toString 破坏 → api-watch.php ?fmt=text 返回 text/plain → 手表 JSON.parse；viewer/confirm/numpad 均已补 `import fetch` + init。
- ⚠️ **UI 冻结例外（2026-08-02 扩充）**：用户主动要求改冻结页——home 对勾大小、viewer 间距、已完成划线、性能、完成项关跑马灯、token 已绑定 UI、sync 完成按钮、about 返回按钮、主页返回图标切图5、完成项视觉全套、confirm 只留右上角红桶、login 页删除、跑马灯 25、numpad 截止两列、numpad 大按钮轮（scroll 内容区）、设置页字号加大、token/sync 整体加大、select 页删除、logout 页大卡片改版（2026-08-02）、about 页两轮改动（2026-08-02）、**同步页 UI 重构（2026-08-03 用户新设计稿）**、**创建清单页 UI 重构（2026-08-03 用户新设计稿）**——**用户当前主动要求优先于冻结**。
