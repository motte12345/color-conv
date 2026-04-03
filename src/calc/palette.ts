import type { Rgb, Hsl } from './types'
import { rgbToHsl, hslToRgb } from './hsl'
import { rgbToHex } from './hex'

export type PaletteType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic'

export interface PaletteColor {
  readonly rgb: Rgb
  readonly hex: string
  readonly hsl: Hsl
  readonly label: string
}

function rotateHue(hsl: Hsl, degrees: number): Hsl {
  return {
    h: ((hsl.h + degrees) % 360 + 360) % 360,
    s: hsl.s,
    l: hsl.l,
  }
}

function hslToColor(hsl: Hsl, label: string): PaletteColor {
  const rgb = hslToRgb(hsl)
  return { rgb, hex: rgbToHex(rgb), hsl, label }
}

function baseColor(rgb: Rgb): { hsl: Hsl; color: PaletteColor } {
  const hsl = rgbToHsl(rgb)
  return { hsl, color: { rgb, hex: rgbToHex(rgb), hsl, label: 'ベース' } }
}

/** 補色 */
function complementary(rgb: Rgb): readonly PaletteColor[] {
  const { hsl, color } = baseColor(rgb)
  return [color, hslToColor(rotateHue(hsl, 180), '補色')]
}

/** 類似色 */
function analogous(rgb: Rgb): readonly PaletteColor[] {
  const { hsl, color } = baseColor(rgb)
  return [
    hslToColor(rotateHue(hsl, -30), '類似色 -30°'),
    color,
    hslToColor(rotateHue(hsl, 30), '類似色 +30°'),
  ]
}

/** トライアド */
function triadic(rgb: Rgb): readonly PaletteColor[] {
  const { hsl, color } = baseColor(rgb)
  return [
    color,
    hslToColor(rotateHue(hsl, 120), 'トライアド 120°'),
    hslToColor(rotateHue(hsl, 240), 'トライアド 240°'),
  ]
}

/** スプリットコンプリメンタリー */
function splitComplementary(rgb: Rgb): readonly PaletteColor[] {
  const { hsl, color } = baseColor(rgb)
  return [
    color,
    hslToColor(rotateHue(hsl, 150), 'スプリット 150°'),
    hslToColor(rotateHue(hsl, 210), 'スプリット 210°'),
  ]
}

/** テトラード */
function tetradic(rgb: Rgb): readonly PaletteColor[] {
  const { hsl, color } = baseColor(rgb)
  return [
    color,
    hslToColor(rotateHue(hsl, 90), 'テトラード 90°'),
    hslToColor(rotateHue(hsl, 180), 'テトラード 180°'),
    hslToColor(rotateHue(hsl, 270), 'テトラード 270°'),
  ]
}

/** モノクロマティック（明度・彩度の段階） */
function monochromatic(rgb: Rgb): readonly PaletteColor[] {
  const { hsl } = baseColor(rgb)
  const steps = [
    { s: Math.min(100, hsl.s + 20), l: Math.max(0, hsl.l - 30), label: '暗い・鮮やか' },
    { s: hsl.s, l: Math.max(0, hsl.l - 15), label: '暗い' },
    { s: hsl.s, l: hsl.l, label: 'ベース' },
    { s: hsl.s, l: Math.min(100, hsl.l + 15), label: '明るい' },
    { s: Math.max(0, hsl.s - 20), l: Math.min(100, hsl.l + 30), label: '明るい・淡い' },
  ]
  return steps.map(({ s, l, label }) =>
    hslToColor({ h: hsl.h, s: Math.round(s * 10) / 10, l: Math.round(l * 10) / 10 }, label),
  )
}

const generators: Record<PaletteType, (rgb: Rgb) => readonly PaletteColor[]> = {
  complementary,
  analogous,
  triadic,
  'split-complementary': splitComplementary,
  tetradic,
  monochromatic,
}

export function generatePalette(rgb: Rgb, type: PaletteType): readonly PaletteColor[] {
  return generators[type](rgb)
}

export const PALETTE_LABELS: Record<PaletteType, string> = {
  complementary: '補色',
  analogous: '類似色',
  triadic: 'トライアド',
  'split-complementary': 'スプリット',
  tetradic: 'テトラード',
  monochromatic: 'モノクロ',
}
