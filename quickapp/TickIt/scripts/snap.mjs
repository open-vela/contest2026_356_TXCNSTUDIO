// gRPC 截屏 / 点击 工具
// 用法：node scripts/snap.mjs [out.png]
//       node scripts/snap.mjs --tap x y [out.png]
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const ROOT = path.join(import.meta.dirname, '..')
const emu = require(path.join(ROOT, 'node_modules', '@aiot-toolkit', 'emulator'))
const grpcMod = require(path.join(ROOT, 'node_modules', '@aiot-toolkit', 'emulator', 'lib', 'vvd', 'grpc'))
const GrpcEmulator = grpcMod.default
const protoPath = path.join(ROOT, 'node_modules', '@aiot-toolkit', 'emulator', 'lib', 'static', 'proto', 'emulator_controller.proto')

const files = emu.getRunningAvdConfigFiles()
const raw = emu.getRunningAvdConfig(files[0])
const conf = Array.isArray(raw) ? raw[0] : raw
const g = new GrpcEmulator({ 'grpc.port': conf['grpc.port'], 'grpc.token': conf['grpc.token'] || '' }, protoPath)

const args = process.argv.slice(2)
if (args[0] === '--tap') {
  const x = Number(args[1]), y = Number(args[2])
  const out = args[3] || 'shot-tap.png'
  await g.waitForReady()
  // 触摸：按下 → 抬起（pressure 0 注销）
  const down = { touches: [{ x, y, identifier: 0, pressure: 1, touchMajor: 10, touchMinor: 10 }], display: 0 }
  const up = { touches: [{ x, y, identifier: 0, pressure: 0, touchMajor: 10, touchMinor: 10 }], display: 0 }
  await new Promise((resolve) => g.client.sendTouch(down, g.authMate, resolve))
  await new Promise(r => setTimeout(r, 60))
  await new Promise((resolve) => g.client.sendTouch(up, g.authMate, resolve))
  await new Promise(r => setTimeout(r, 1500))
  const img = await g.getScreenshot()
  const p = path.join(ROOT, 'scripts', out)
  fs.writeFileSync(p, img)
  console.log('tapped', x, y, 'saved', p, img.length)
  process.exit(0)
}

if (args[0] === '--sleep') {
  await new Promise(r => setTimeout(r, Number(args[1]) || 1000))
  const out = args[2] || 'shot-sleep.png'
  const img = await g.getScreenshot()
  fs.writeFileSync(path.join(ROOT, 'scripts', out), img)
  console.log('slept and saved', out, img.length)
  process.exit(0)
}

const out = args[0] || 'shot.png'
await g.waitForReady()
const img = await g.getScreenshot()
const p = path.join(ROOT, 'scripts', out)
fs.writeFileSync(p, img)
console.log('saved', p, img.length, img.slice(0, 4).toString('hex'))
process.exit(0)
