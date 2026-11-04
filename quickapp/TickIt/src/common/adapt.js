// 多屏适配工具：探测屏幕形状/尺寸并归类，供页面做数值分支
// 设计基准 width 336（manifest config.designWidth）
import device from '@system.device'

// 物理分辨率参考：
// 矩形 336x480（手环8 Pro/9 Pro，DPR 2.1） 胶囊 192x490（手环9）/ 212x520（手环10）
// 圆屏 466x466（Watch S3/S4）、480x480（Watch S1 Pro）
const DESIGN_WIDTH = 336

let cached = null
let pending = null

// 屏幕宽高比决定形状；screenShape 缺失时按宽高比兜底
function kindOf (w, h, shape) {
  // 宽高优先（与 InputMethod 判型一致，screenShape 误报不致命）：等宽高=圆屏，极窄=胶囊，其余矩形
  if (w === h) return 'circle'
  if (w / h <= 0.55) return 'pill'
  if (shape === 'circle') return 'circle'
  return 'rect'
}

function classify (res) {
  const w = res && res.screenWidth ? res.screenWidth : 336
  const h = res && res.screenHeight ? res.screenHeight : 480
  const dpr = res && res.screenDensity ? res.screenDensity : 2
  const kind = kindOf(w, h, res && res.screenShape ? res.screenShape : '')
  return {
    w: w,
    h: h,
    dpr: dpr,
    kind: kind,
    isCircle: kind === 'circle',
    isPill: kind === 'pill',
    isRect: kind === 'rect',
    // 纵向可用设计px：等比缩放后屏幕高对应的设计稿高度
    designHeight: Math.round((h / w) * DESIGN_WIDTH),
    // 横向缩放系数（设计px -> 物理px）
    scale: w / DESIGN_WIDTH
  }
}

// 首次调用发起 getInfo 并缓存；并发调用共享同一请求
function probe () {
  if (cached) return Promise.resolve(cached)
  if (pending) return pending
  pending = new Promise(function (resolve) {
    device.getInfo({
      success: function (res) {
        cached = classify(res)
        if (typeof global !== 'undefined') { global.__adaptInfo = cached }
        resolve(cached)
      },
      fail: function () {
        cached = classify(null)
        if (typeof global !== 'undefined') { global.__adaptInfo = cached }
        resolve(cached)
      }
    })
  })
  return pending
}

// 同步读取缓存结果（未探测完成时返回 null）
function peek () {
  return cached
}

// 同步读取 isCircle（未探测完返回 null，调用方据此延迟渲染两边 UI，避免先渲染方屏再切圆屏）
function isCircleSync () {
  if (cached) return cached.isCircle
  if (typeof global !== 'undefined' && global.__adaptInfo) return global.__adaptInfo.isCircle
  return null
}

export default {
  probe: probe,
  peek: peek,
  isCircleSync: isCircleSync,
  DESIGN_WIDTH: DESIGN_WIDTH
}
