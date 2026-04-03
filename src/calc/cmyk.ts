import type { Rgb, Cmyk } from './types'

/**
 * RGB → CMYK変換
 * ICCプロファイル非考慮の概算値
 * 各チャンネル 0-100
 */
export function rgbToCmyk(rgb: Rgb): Cmyk {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const k = 1 - Math.max(r, g, b)

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 }
  }

  return {
    c: round(((1 - r - k) / (1 - k)) * 100),
    m: round(((1 - g - k) / (1 - k)) * 100),
    y: round(((1 - b - k) / (1 - k)) * 100),
    k: round(k * 100),
  }
}

/**
 * CMYK → RGB変換
 * ICCプロファイル非考慮の概算値
 */
export function cmykToRgb(cmyk: Cmyk): Rgb {
  const c = cmyk.c / 100
  const m = cmyk.m / 100
  const y = cmyk.y / 100
  const k = cmyk.k / 100

  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  }
}

function round(n: number): number {
  return Math.round(n * 10) / 10
}
