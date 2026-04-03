import type { Rgb } from './types'

/** WCAG 2.1 適合レベル */
export interface WcagResult {
  /** コントラスト比 (例: 4.5) */
  readonly ratio: number
  /** AA 通常テキスト (4.5:1以上) */
  readonly aa: boolean
  /** AA 大テキスト (3:1以上) */
  readonly aaLarge: boolean
  /** AAA 通常テキスト (7:1以上) */
  readonly aaa: boolean
  /** AAA 大テキスト (4.5:1以上) */
  readonly aaaLarge: boolean
}

/**
 * sRGB値を線形値に変換（ガンマ補正を除去）
 */
function linearize(channel: number): number {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/**
 * WCAG 2.1 相対輝度を計算
 * @returns 0（黒）〜 1（白）
 */
export function relativeLuminance(rgb: Rgb): number {
  return (
    0.2126 * linearize(rgb.r) +
    0.7152 * linearize(rgb.g) +
    0.0722 * linearize(rgb.b)
  )
}

/**
 * 2色間のコントラスト比を計算
 * @returns 1〜21 の値
 */
export function contrastRatio(fg: Rgb, bg: Rgb): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * コントラスト比からWCAG 2.1適合レベルを判定
 */
export function checkWcag(fg: Rgb, bg: Rgb): WcagResult {
  const ratio = contrastRatio(fg, bg)
  const rounded = Math.round(ratio * 100) / 100

  return {
    ratio: rounded,
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  }
}
