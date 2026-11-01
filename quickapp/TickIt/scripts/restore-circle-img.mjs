import fs from 'fs'
import path from 'path'

const SRC = 'C:/Users/Administrator/Downloads/yuanpinui'
const DST = 'src/common'

// Downloads 原名 → 工程内 circle-* 文件名
const map = {
  '云端账号已登录背景与未登录通用.png': 'circle-token-bg.png',
  '云端账号绑定背景.png': 'circle-token-bind-bg.png',
  '云端账号退出登录背景.png': 'circle-logout-bg.png',
  '云端账号未登录示例.png': 'circle-token-off.png',
  '云端账号已登录示例.png': 'circle-token-on.png',
  '云端账号绑定示例.png': 'circle-token-bind.png',
  '云端账号退出登录示例.png': 'circle-logout.png',
  '卡片 1.png': 'circle-card-1.png',
  '卡片 7.png': 'circle-card-7.png',
  '卡片 8.png': 'circle-card-8.png',
  '卡片 9.png': 'circle-card-9.png',
  '容器 54.png': 'circle-ctr-54.png',
  '容器 55.png': 'circle-ctr-55.png',
  '容器 58.png': 'circle-ctr-58.png',
  '容器 59.png': 'circle-ctr-59.png',
  '容器 60.png': 'circle-ctr-60.png',
  '容器 62.png': 'circle-ctr-62.png',
  '容器 64.png': 'circle-ctr-64.png',
  '容器 65.png': 'circle-ctr-65.png',
  '容器 66.png': 'circle-ctr-66.png',
  '容器 67.png': 'circle-ctr-67.png',
  '容器 68.png': 'circle-ctr-68.png',
  '容器 69.png': 'circle-ctr-69.png',
  '容器 70.png': 'circle-ctr-70.png',
  '容器 71.png': 'circle-ctr-71.png',
  '容器 76.png': 'circle-ctr-76.png',
  '容器 77.png': 'circle-ctr-77.png',
  '容器 78.png': 'circle-ctr-78.png',
  '容器 79.png': 'circle-ctr-79.png',
  '容器 80.png': 'circle-ctr-80.png',
  '容器 81.png': 'circle-ctr-81.png',
  '容器 82.png': 'circle-ctr-82.png',
  '容器 83.png': 'circle-mode-online-on.png',
  '容器 84.png': 'circle-mode-online-off.png',
  '容器 85.png': 'circle-mode-offline-on.png',
  '容器 86.png': 'circle-mode-offline-off.png',
  '容器 87.png': 'circle-ctr-87.png',
  '容器 88.png': 'circle-ctr-88.png',
  '容器 89.png': 'circle-ctr-89.png',
  '容器 90.png': 'circle-ctr-90.png',
  '容器 91.png': 'circle-ctr-91.png',
  '容器 92.png': 'circle-ctr-92.png',
  '容器 93.png': 'circle-ctr-93.png',
  '模式选择背景.png': 'circle-mode-bg.png',
  '模式选择示例.png': 'circle-mode.png',
  '关于示例.png': 'circle-about.png',
  '关于背景.png': 'circle-about-bg.png',
  '优先级.png': 'circle-priority.png',
  '清单首页示例.png': 'circle-home.png',
  '清单首页背景.png': 'circle-home-bg.png',
  '清单详情示例.png': 'circle-viewer.png',
  '清单详情背景.png': 'circle-viewer-bg.png',
  '空白背景.png': 'circle-blank-bg.png',
  '首页（无内容）示例.png': 'circle-home-empty.png',
  '首页（无内容）背景.png': 'circle-home-empty-bg.png',
  '设置示例.png': 'circle-list.png',
  '同步-等待连接.png': 'circle-sync-wait.png',
  '同步-等待连接背景.png': 'circle-sync-wait-bg.png',
  '同步-正在同步.png': 'circle-sync-ing.png',
  '同步-正在同步背景.png': 'circle-sync-ing-bg.png',
  '同步-连接成功.png': 'circle-sync-ok.png',
  '同步-连接成功背景.png': 'circle-sync-ok-bg.png',
  '同步-同步完成.png': 'circle-sync-done.png',
  '同步-同步完成背景.png': 'circle-sync-done-bg.png',
  '同步失败.png': 'circle-sync-fail.png',
  '同步失败背景.png': 'circle-sync-fail-bg.png'
}

let copied = 0, missing = []
for (const [from, to] of Object.entries(map)) {
  const src = path.join(SRC, from)
  const dst = path.join(DST, to)
  if (!fs.existsSync(src)) { missing.push(from); continue }
  fs.copyFileSync(src, dst)
  copied++
}
console.log(`copied ${copied}, missing ${missing.length}`)
if (missing.length) console.log('MISSING: ' + missing.join(', '))
