import type { Rgb } from './types'
import { rgbToHsl, hslToRgb } from './hsl'
import { rgbToHex } from './hex'
import { contrastRatio } from './contrast'

export interface SuggestedColor {
  readonly rgb: Rgb
  readonly hex: string
  readonly ratio: number
}

/**
 * 指定した背景色に対してWCAG AA基準(4.5:1)を満たす
 * 最も近い前景色を提案する。
 * 色相・彩度を保ったまま明度を調整する。
 */
export function suggestAccessibleColor(
  fg: Rgb,
  bg: Rgb,
  targetRatio: number = 4.5,
): SuggestedColor | null {
  const current = contrastRatio(fg, bg)
  if (current >= targetRatio) {
    return { rgb: fg, hex: rgbToHex(fg), ratio: Math.round(current * 100) / 100 }
  }

  const hsl = rgbToHsl(fg)

  // 明度を上下に探索して最も近い合格色を見つける
  let bestDarker: SuggestedColor | null = null
  let bestLighter: SuggestedColor | null = null

  // 暗い方向
  for (let l = hsl.l; l >= 0; l -= 0.5) {
    const candidate = hslToRgb({ h: hsl.h, s: hsl.s, l })
    const ratio = contrastRatio(candidate, bg)
    if (ratio >= targetRatio) {
      bestDarker = {
        rgb: candidate,
        hex: rgbToHex(candidate),
        ratio: Math.round(ratio * 100) / 100,
      }
      break
    }
  }

  // 明るい方向
  for (let l = hsl.l; l <= 100; l += 0.5) {
    const candidate = hslToRgb({ h: hsl.h, s: hsl.s, l })
    const ratio = contrastRatio(candidate, bg)
    if (ratio >= targetRatio) {
      bestLighter = {
        rgb: candidate,
        hex: rgbToHex(candidate),
        ratio: Math.round(ratio * 100) / 100,
      }
      break
    }
  }

  // 元の明度に近い方を返す
  if (bestDarker && bestLighter) {
    const darkerDist = Math.abs(rgbToHsl(bestDarker.rgb).l - hsl.l)
    const lighterDist = Math.abs(rgbToHsl(bestLighter.rgb).l - hsl.l)
    return darkerDist <= lighterDist ? bestDarker : bestLighter
  }
  return bestDarker ?? bestLighter
}
