import type { Rgb, Xyz, Lab } from './types'

// D65 光源の基準白色点
const D65_X = 95.047
const D65_Y = 100.0
const D65_Z = 108.883

/**
 * RGB → XYZ変換 (D65光源, sRGB)
 */
export function rgbToXyz(rgb: Rgb): Xyz {
  // sRGBガンマ補正を線形化
  let r = rgb.r / 255
  let g = rgb.g / 255
  let b = rgb.b / 255

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

  // sRGB → XYZ (D65) 変換行列
  return {
    x: (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) * 100,
    y: (r * 0.2126729 + g * 0.7151522 + b * 0.0721750) * 100,
    z: (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) * 100,
  }
}

/**
 * XYZ → Lab変換
 */
export function xyzToLab(xyz: Xyz): Lab {
  const fx = labF(xyz.x / D65_X)
  const fy = labF(xyz.y / D65_Y)
  const fz = labF(xyz.z / D65_Z)

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  }
}

/**
 * RGB → Lab変換（XYZ経由）
 */
export function rgbToLab(rgb: Rgb): Lab {
  return xyzToLab(rgbToXyz(rgb))
}

/**
 * Lab → XYZ変換
 */
export function labToXyz(lab: Lab): Xyz {
  const fy = (lab.l + 16) / 116
  const fx = lab.a / 500 + fy
  const fz = fy - lab.b / 200

  return {
    x: labFInv(fx) * D65_X,
    y: labFInv(fy) * D65_Y,
    z: labFInv(fz) * D65_Z,
  }
}

/**
 * XYZ → RGB変換 (D65光源, sRGB)
 */
export function xyzToRgb(xyz: Xyz): Rgb {
  const x = xyz.x / 100
  const y = xyz.y / 100
  const z = xyz.z / 100

  // XYZ → sRGB 逆行列
  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314
  let g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560
  let b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252

  // 線形 → sRGBガンマ補正
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b

  return {
    r: Math.round(Math.max(0, Math.min(255, r * 255))),
    g: Math.round(Math.max(0, Math.min(255, g * 255))),
    b: Math.round(Math.max(0, Math.min(255, b * 255))),
  }
}

/**
 * Lab → RGB変換（XYZ経由）
 */
export function labToRgb(lab: Lab): Rgb {
  return xyzToRgb(labToXyz(lab))
}

// CIE Lab のf関数
function labF(t: number): number {
  const delta = 6 / 29
  return t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta ** 2) + 4 / 29
}

// CIE Lab のf逆関数
function labFInv(t: number): number {
  const delta = 6 / 29
  return t > delta ? t ** 3 : 3 * delta ** 2 * (t - 4 / 29)
}
