import type { Rgb, Hsl, Hsv, Cmyk } from './types'

/** HEX文字列をパースしてRGBを返す。不正なら null */
export function parseHex(input: string): Rgb | null {
  const h = input.replace(/^#/, '').trim()
  let expanded = h
  if (h.length === 3) {
    expanded = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  }
  if (expanded.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(expanded)) {
    return null
  }
  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  }
}

/** "255, 87, 51" or "255 87 51" をパース */
export function parseRgb(input: string): Rgb | null {
  const parts = input.split(/[\s,]+/).map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return null
  const [r, g, b] = parts
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return null
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) }
}

/** "14, 100, 60" or "14 100 60" をパース */
export function parseHsl(input: string): Hsl | null {
  const parts = input.replace(/[°%]/g, '').split(/[\s,]+/).map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return null
  const [h, s, l] = parts
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null
  return { h, s, l }
}

/** "14, 80, 100" or "14 80 100" をパース */
export function parseHsv(input: string): Hsv | null {
  const parts = input.replace(/[°%]/g, '').split(/[\s,]+/).map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return null
  const [h, s, v] = parts
  if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100) return null
  return { h, s, v }
}

/** "0, 66, 80, 0" or "0 66 80 0" をパース */
export function parseCmyk(input: string): Cmyk | null {
  const parts = input.replace(/%/g, '').split(/[\s,]+/).map(Number)
  if (parts.length !== 4 || parts.some(isNaN)) return null
  const [c, m, y, k] = parts
  if (c < 0 || c > 100 || m < 0 || m > 100 || y < 0 || y > 100 || k < 0 || k > 100) return null
  return { c, m, y, k }
}
