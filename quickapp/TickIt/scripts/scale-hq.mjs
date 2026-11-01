import fs from 'fs'
import { PNG } from 'pngjs'

// 双线性缩放（比最近邻更平滑）
function bilinearScale(src, tw, th) {
  const dst = new PNG({ width: tw, height: th })
  const xRatio = src.width / tw
  const yRatio = src.height / th

  for (let y = 0; y < th; y++) {
    const sy = y * yRatio
    const y0 = Math.floor(sy)
    const y1 = Math.min(y0 + 1, src.height - 1)
    const fy = sy - y0

    for (let x = 0; x < tw; x++) {
      const sx = x * xRatio
      const x0 = Math.floor(sx)
      const x1 = Math.min(x0 + 1, src.width - 1)
      const fx = sx - x0

      const di = (y * tw + x) * 4
      for (let c = 0; c < 4; c++) {
        const p00 = src.data[(y0 * src.width + x0) * 4 + c]
        const p01 = src.data[(y0 * src.width + x1) * 4 + c]
        const p10 = src.data[(y1 * src.width + x0) * 4 + c]
        const p11 = src.data[(y1 * src.width + x1) * 4 + c]
        const top = p00 * (1 - fx) + p01 * fx
        const bot = p10 * (1 - fx) + p11 * fx
        dst.data[di + c] = Math.round(top * (1 - fy) + bot * fy)
      }
    }
  }
  return dst
}

// 只处理最重的几张大图
const targets = [
  'circle-viewer-bg.png',
  'circle-token-bg.png',
  'circle-token-bind-bg.png',
  'circle-sync-wait-bg.png',
  'circle-sync-ing-bg.png',
  'circle-sync-ok-bg.png',
  'circle-sync-done-bg.png',
  'circle-sync-fail-bg.png',
  'circle-home-bg.png',
  'circle-home-empty-bg.png',
]

const dir = 'src/common'
for (const f of targets) {
  const path = dir + '/' + f
  if (!fs.existsSync(path)) continue
  const src = PNG.sync.read(fs.readFileSync(path))
  const tw = Math.round(src.width * 336 / 480)
  const th = Math.round(src.height * 336 / 480)
  if (tw === src.width && th === src.height) continue

  const before = fs.statSync(path).size
  const dst = bilinearScale(src, tw, th)
  const buf = PNG.sync.write(dst)
  fs.writeFileSync(path, buf)
  console.log(`${f}: ${src.width}x${src.height}(${(before/1024).toFixed(1)}KB) → ${tw}x${th}(${(buf.length/1024).toFixed(1)}KB)`)
}

console.log('done')
