import type { Rgb } from './types'
import { rgbToHex } from './hex'

export type GradientDirection = 'to right' | 'to bottom' | 'to bottom right' | '45deg' | '135deg' | 'circle'

export interface GradientStop {
  readonly rgb: Rgb
  readonly hex: string
  readonly position: number // 0-100
}

/** 2色間を線形補間してステップ数分の色を生成 */
export function interpolateColors(from: Rgb, to: Rgb, steps: number): readonly GradientStop[] {
  const clampedSteps = Math.max(2, steps)
  const result: GradientStop[] = []

  for (let i = 0; i < clampedSteps; i++) {
    const t = i / (clampedSteps - 1)
    const rgb: Rgb = {
      r: Math.round(from.r + (to.r - from.r) * t),
      g: Math.round(from.g + (to.g - from.g) * t),
      b: Math.round(from.b + (to.b - from.b) * t),
    }
    result.push({
      rgb,
      hex: rgbToHex(rgb),
      position: Math.round(t * 100),
    })
  }

  return result
}

/** CSSグラデーションコードを生成 */
export function generateGradientCss(
  stops: readonly { readonly hex: string }[],
  direction: GradientDirection,
): string {
  const colorStops = stops.map((s) => s.hex).join(', ')
  if (direction === 'circle') {
    return `radial-gradient(circle, ${colorStops})`
  }
  return `linear-gradient(${direction}, ${colorStops})`
}
