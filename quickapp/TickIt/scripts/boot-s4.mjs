// 无交互启动 s4（466x466 圆屏）模拟器 + 安装 RPK + 拉起同步页
// 运行：node scripts/boot-s4.mjs
import path from 'path'
import fs from 'fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const ROOT = path.join(import.meta.dirname, '..')
const PKG = 'com.txcnstudio.todo'
const RPK = path.join(ROOT, 'dist', 'com.txcnstudio.todo.debug.2.5.2.rpk')

const emulator = require(path.join(ROOT, 'node_modules', '@aiot-toolkit', 'emulator'))
const VvdManager = emulator.VvdManager || emulator.default?.VvdManager
const defaultSDKHome = emulator.defaultSDKHome || emulator.default?.defaultSDKHome
const defaultVvdHome = emulator.defaultVvdHome || emulator.default?.defaultVvdHome

console.log('emulator exports:', Object.keys(emulator).slice(0, 30))
const sdkHome = typeof defaultSDKHome === 'function' ? defaultSDKHome() : 'C:/Users/Administrator/.vela/sdk'
const vvdHome = typeof defaultVvdHome === 'function' ? defaultVvdHome() : 'C:/Users/Administrator/.vela/vvd'
console.log('sdkHome', sdkHome)
console.log('vvdHome', vvdHome)

const mgr = new VvdManager({ sdkHome, vvdHome })
const list = mgr.getVvdList()
console.log('vvd list:', list.map(x => x.name || x))

const vvdName = 's4'
const info = mgr.getVvdInfo(vvdName)
console.log('s4 info:', JSON.stringify(info, null, 2).slice(0, 500))

if (!fs.existsSync(RPK)) {
  console.error('RPK not found:', RPK)
  process.exit(1)
}

console.log('starting vvd', vvdName, '...')
const startRes = await mgr.startVvd({
  vvdName,
  origin: emulator.IStartOrigin ? emulator.IStartOrigin.Terminal : 'Terminal'
})
console.log('startRes keys:', Object.keys(startRes || {}))
const inst = startRes.emulatorInstance
if (!inst) {
  console.error('no emulatorInstance', startRes)
  process.exit(1)
}
console.log('emulator instance ready')

// 等 adb 上线
await new Promise(r => setTimeout(r, 8000))

const targetPath = await inst.pushRpk(RPK, PKG)
console.log('pushed to', targetPath)
await inst.install(targetPath, { packageName: PKG })
console.log('installed')
await inst.startApp(PKG)
console.log('app started')
process.exit(0)
