import type { Rgb, Hsl } from './types'

/**
 * RGB → HSL変換
 * H: 0-360, S: 0-100, L: 0-100
 */
export function rgbToHsl(rgb: Rgb): Hsl {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  const l = (max + min) / 2

  if (delta === 0) {
    return { h: 0, s: 0, l: round(l * 100) }
  }

  const s = Math.min(1, delta / (1 - Math.abs(2 * l - 1)))

  let h: number
  if (max === r) {
    h = ((g - b) / delta) % 6
  } else if (max === g) {
    h = (b - r) / delta + 2
  } else {
    h = (r - g) / delta + 4
  }

  h = h * 60
  if (h < 0) h += 360

  return {
    h: round(h),
    s: round(s * 100),
    l: round(l * 100),
  }
}

/**
 * HSL → RGB変換
 */
export function hslToRgb(hsl: Hsl): Rgb {
  const s = hsl.s / 100
  const l = hsl.l / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1))
  const m = l - c / 2

  let r1: number, g1: number, b1: number

  const h = ((hsl.h % 360) + 360) % 360

  if (h < 60) {
    ;[r1, g1, b1] = [c, x, 0]
  } else if (h < 120) {
    ;[r1, g1, b1] = [x, c, 0]
  } else if (h < 180) {
    ;[r1, g1, b1] = [0, c, x]
  } else if (h < 240) {
    ;[r1, g1, b1] = [0, x, c]
  } else if (h < 300) {
    ;[r1, g1, b1] = [x, 0, c]
  } else {
    ;[r1, g1, b1] = [c, 0, x]
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  }
}

function round(n: number): number {
  return Math.round(n * 10) / 10
}
