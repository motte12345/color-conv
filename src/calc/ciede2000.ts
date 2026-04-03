import type { Lab } from './types'

/**
 * CIEDE2000 色差計算
 * CIE76より知覚的に正確な色差アルゴリズム
 *
 * 参考: Sharma, Wu, Dalal (2005)
 * "The CIEDE2000 Color-Difference Formula"
 */
export function ciede2000(lab1: Lab, lab2: Lab): number {
  const { l: L1, a: a1, b: b1 } = lab1
  const { l: L2, a: a2, b: b2 } = lab2

  // Step 1: 計算補助値
  const C1ab = Math.sqrt(a1 ** 2 + b1 ** 2)
  const C2ab = Math.sqrt(a2 ** 2 + b2 ** 2)
  const Cab_mean = (C1ab + C2ab) / 2

  const G =
    0.5 *
    (1 - Math.sqrt(Cab_mean ** 7 / (Cab_mean ** 7 + 25 ** 7)))

  const a1p = a1 * (1 + G)
  const a2p = a2 * (1 + G)

  const C1p = Math.sqrt(a1p ** 2 + b1 ** 2)
  const C2p = Math.sqrt(a2p ** 2 + b2 ** 2)

  const h1p = hueAngle(a1p, b1)
  const h2p = hueAngle(a2p, b2)

  // Step 2: 差分
  const dLp = L2 - L1
  const dCp = C2p - C1p

  let dhp: number
  if (C1p * C2p === 0) {
    dhp = 0
  } else if (Math.abs(h2p - h1p) <= 180) {
    dhp = h2p - h1p
  } else if (h2p - h1p > 180) {
    dhp = h2p - h1p - 360
  } else {
    dhp = h2p - h1p + 360
  }

  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp / 2))

  // Step 3: CIEDE2000
  const Lp_mean = (L1 + L2) / 2
  const Cp_mean = (C1p + C2p) / 2

  let hp_mean: number
  if (C1p * C2p === 0) {
    hp_mean = h1p + h2p
  } else if (Math.abs(h1p - h2p) <= 180) {
    hp_mean = (h1p + h2p) / 2
  } else if (h1p + h2p < 360) {
    hp_mean = (h1p + h2p + 360) / 2
  } else {
    hp_mean = (h1p + h2p - 360) / 2
  }

  const T =
    1 -
    0.17 * Math.cos(rad(hp_mean - 30)) +
    0.24 * Math.cos(rad(2 * hp_mean)) +
    0.32 * Math.cos(rad(3 * hp_mean + 6)) -
    0.20 * Math.cos(rad(4 * hp_mean - 63))

  const SL =
    1 +
    (0.015 * (Lp_mean - 50) ** 2) /
      Math.sqrt(20 + (Lp_mean - 50) ** 2)

  const SC = 1 + 0.045 * Cp_mean
  const SH = 1 + 0.015 * Cp_mean * T

  const RC =
    2 * Math.sqrt(Cp_mean ** 7 / (Cp_mean ** 7 + 25 ** 7))

  const dTheta =
    30 * Math.exp(-(((hp_mean - 275) / 25) ** 2))

  const RT = -Math.sin(rad(2 * dTheta)) * RC

  return Math.sqrt(
    (dLp / SL) ** 2 +
      (dCp / SC) ** 2 +
      (dHp / SH) ** 2 +
      RT * (dCp / SC) * (dHp / SH)
  )
}

function hueAngle(a: number, b: number): number {
  if (a === 0 && b === 0) return 0
  const angle = (Math.atan2(b, a) * 180) / Math.PI
  return angle >= 0 ? angle : angle + 360
}

function rad(deg: number): number {
  return (deg * Math.PI) / 180
}
