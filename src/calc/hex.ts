import type { Rgb } from './types'

/**
 * RGB → HEX変換
 * @returns "#RRGGBB" 形式の文字列
 */
export function rgbToHex(rgb: Rgb): string {
  const toHex = (n: number): string =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

/**
 * HEX → RGB変換
 * 3桁(#RGB)、6桁(#RRGGBB)、#なしにも対応
 */
export function hexToRgb(hex: string): Rgb {
  let h = hex.replace(/^#/, '')

  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  }

  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`Invalid hex color: ${hex}`)
  }

  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}
