// 对比同状态「完整图 vs 背景图」的像素差异块，定位按钮/动态元素区域
// 运行：node scripts/diff-sync-ui.mjs
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

const DIR = 'C:/Users/Administrator/Downloads/yuanpinui'

function decodePNG (buf) {
  // 极简 PNG 解码：仅支持 8bit RGBA/RGB 非交错
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not png')
  let pos = 8
  let w = 0, h = 0, bitDepth = 0, colorType = 0
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)
    if (type === 'IHDR') {
      w = data.readUInt32BE(0)
      h = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
    } else if (type === 'IDAT') {
      idat.push(data)
    } else if (type === 'IEND') break
    pos += 12 + len
  }
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : 0
  if (!bpp || bitDepth !== 8) throw new Error('unsupported png ' + colorType + '/' + bitDepth)
  const stride = w * bpp
  const out = Buffer.alloc(w * h * 4)
  // unfilter
  let prev = Buffer.alloc(stride)
  let o = 0
  for (let y = 0; y < h; y++) {
    const f = raw[o++]
    const line = raw.subarray(o, o + stride)
    o += stride
    const cur = Buffer.from(line)
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0
      const b = prev[i]
      const c = i >= bpp ? prev[i - bpp] : 0
      if (f === 1) cur[i] = (cur[i] + a) & 255
      else if (f === 2) cur[i] = (cur[i] + b) & 255
      else if (f === 3) cur[i] = (cur[i] + ((a + b) >> 1)) & 255
      else if (f === 4) {
        const p = a + b - c
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
        cur[i] = (cur[i] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255
      }
    }
    for (let x = 0; x < w; x++) {
      const si = x * bpp
      const di = (y * w + x) * 4
      out[di] = cur[si]
      out[di + 1] = cur[si + 1]
      out[di + 2] = cur[si + 2]
      out[di + 3] = bpp === 4 ? cur[si + 3] : 255
    }
    prev = cur
  }
  return { w, h, rgba: out }
}

function diffRegions (a, b, thresh = 18) {
  // 逐像素差分 → 标记不同像素 → 网格聚类出 bbox
  const { w, h, rgba: pa } = a
  const pb = b.rgba
  const cell = 12
  const cols = Math.ceil(w / cell)
  const rows = Math.ceil(h / cell)
  const grid = new Uint8Array(cols * rows)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const d = Math.abs(pa[i] - pb[i]) + Math.abs(pa[i + 1] - pb[i + 1]) + Math.abs(pa[i + 2] - pb[i + 2])
      if (d > thresh) grid[(Math.floor(y / cell)) * cols + Math.floor(x / cell)] = 1
    }
  }
  // 连通块（4邻接）合并 bbox
  const seen = new Uint8Array(cols * rows)
  const boxes = []
  for (let i = 0; i < grid.length; i++) {
    if (!grid[i] || seen[i]) continue
    const stack = [i]
    let minC = cols, maxC = 0, minR = rows, maxR = 0, n = 0
    while (stack.length) {
      const j = stack.pop()
      if (seen[j] || !grid[j]) continue
      seen[j] = 1
      n++
      const c = j % cols, r = (j / cols) | 0
      if (c < minC) minC = c
      if (c > maxC) maxC = c
      if (r < minR) minR = r
      if (r > maxR) maxR = r
      if (c > 0) stack.push(j - 1)
      if (c < cols - 1) stack.push(j + 1)
      if (r > 0) stack.push(j - cols)
      if (r < rows - 1) stack.push(j + cols)
    }
    if (n >= 4) {
      boxes.push({
        left: minC * cell,
        top: minR * cell,
        width: (maxC - minC + 1) * cell,
        height: (maxR - minR + 1) * cell,
        cells: n
      })
    }
  }
  boxes.sort((x, y) => y.cells - x.cells)
  return boxes
}

const pairs = [
  ['同步-等待连接.png', '同步-等待连接背景.png', 'wait'],
  ['同步-正在同步.png', '同步-正在同步背景.png', 'ing'],
  ['同步-连接成功.png', '同步-连接成功背景.png', 'ok'],
  ['同步-同步完成.png', '同步-同步完成背景.png', 'done'],
  ['同步失败.png', '同步失败背景.png', 'fail']
]

for (const [full, bg, tag] of pairs) {
  const A = decodePNG(fs.readFileSync(path.join(DIR, full)))
  const B = decodePNG(fs.readFileSync(path.join(DIR, bg)))
  const boxes = diffRegions(A, B)
  console.log('\n===', tag, full, 'vs bg ===')
  for (const b of boxes.slice(0, 8)) {
    console.log(`  ${b.left},${b.top}  ${b.width}x${b.height}  cells=${b.cells}`)
  }
}
