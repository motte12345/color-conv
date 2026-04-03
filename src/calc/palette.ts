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

/** 色の役割キー（UI層で翻訳する） */
export type PaletteRoleKey =
  | 'base'
  | 'complement'
  | 'analogous_minus'
  | 'analogous_plus'
  | 'triadic_120'
  | 'triadic_240'
  | 'split_150'
  | 'split_210'
  | 'tetradic_90'
  | 'tetradic_180'
  | 'tetradic_270'
  | 'mono_dark_vivid'
  | 'mono_dark'
  | 'mono_light'
  | 'mono_light_pale'

export interface PaletteColor {
  readonly rgb: Rgb
  readonly hex: string
  readonly hsl: Hsl
  readonly roleKey: PaletteRoleKey
}

function rotateHue(hsl: Hsl, degrees: number): Hsl {
  return {
    h: ((hsl.h + degrees) % 360 + 360) % 360,
    s: hsl.s,
    l: hsl.l,
  }
}

function hslToColor(hsl: Hsl, roleKey: PaletteRoleKey): PaletteColor {
  const rgb = hslToRgb(hsl)
  return { rgb, hex: rgbToHex(rgb), hsl, roleKey }
}

function baseColor(rgb: Rgb): { hsl: Hsl; color: PaletteColor } {
  const hsl = rgbToHsl(rgb)
  return { hsl, color: { rgb, hex: rgbToHex(rgb), hsl, roleKey: 'base' } }
}

function complementary(rgb: Rgb): readonly PaletteColor[] {
  const { hsl, color } = baseColor(rgb)
  return [color, hslToColor(rotateHue(hsl, 180), 'complement')]
}

function analogous(rgb: Rgb): readonly PaletteColor[] {
  const { hsl, color } = baseColor(rgb)
  return [
    hslToColor(rotateHue(hsl, -30), 'analogous_minus'),
    color,
    hslToColor(rotateHue(hsl, 30), 'analogous_plus'),
  ]
}

function triadic(rgb: Rgb): readonly PaletteColor[] {
  const { hsl, color } = baseColor(rgb)
  return [
    color,
    hslToColor(rotateHue(hsl, 120), 'triadic_120'),
    hslToColor(rotateHue(hsl, 240), 'triadic_240'),
  ]
}

function splitComplementary(rgb: Rgb): readonly PaletteColor[] {
  const { hsl, color } = baseColor(rgb)
  return [
    color,
    hslToColor(rotateHue(hsl, 150), 'split_150'),
    hslToColor(rotateHue(hsl, 210), 'split_210'),
  ]
}

function tetradic(rgb: Rgb): readonly PaletteColor[] {
  const { hsl, color } = baseColor(rgb)
  return [
    color,
    hslToColor(rotateHue(hsl, 90), 'tetradic_90'),
    hslToColor(rotateHue(hsl, 180), 'tetradic_180'),
    hslToColor(rotateHue(hsl, 270), 'tetradic_270'),
  ]
}

function monochromatic(rgb: Rgb): readonly PaletteColor[] {
  const { hsl } = baseColor(rgb)
  const steps: readonly { s: number; l: number; roleKey: PaletteRoleKey }[] = [
    { s: Math.min(100, hsl.s + 20), l: Math.max(0, hsl.l - 30), roleKey: 'mono_dark_vivid' },
    { s: hsl.s, l: Math.max(0, hsl.l - 15), roleKey: 'mono_dark' },
    { s: hsl.s, l: hsl.l, roleKey: 'base' },
    { s: hsl.s, l: Math.min(100, hsl.l + 15), roleKey: 'mono_light' },
    { s: Math.max(0, hsl.s - 20), l: Math.min(100, hsl.l + 30), roleKey: 'mono_light_pale' },
  ]
  return steps.map(({ s, l, roleKey }) =>
    hslToColor({ h: hsl.h, s: Math.round(s * 10) / 10, l: Math.round(l * 10) / 10 }, roleKey),
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
