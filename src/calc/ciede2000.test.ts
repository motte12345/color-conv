import { describe, it, expect } from 'vitest'
import { ciede2000 } from './ciede2000'

describe('ciede2000', () => {
  it('同一色の距離は0', () => {
    const lab = { l: 50, a: 25, b: -10 }
    expect(ciede2000(lab, lab)).toBe(0)
  })

  it('黒と白は大きな距離', () => {
    const black = { l: 0, a: 0, b: 0 }
    const white = { l: 100, a: 0, b: 0 }
    expect(ciede2000(black, white)).toBeGreaterThan(90)
  })

  it('知覚的に近い色は小さな距離', () => {
    const lab1 = { l: 50, a: 2.6772, b: -79.7751 }
    const lab2 = { l: 50, a: 0, b: -82.7485 }
    const delta = ciede2000(lab1, lab2)
    expect(delta).toBeCloseTo(2.0425, 1)
  })

  // Sharma et al. (2005) テストデータ
  it('Sharma テストペア1', () => {
    const lab1 = { l: 50, a: 2.6772, b: -79.7751 }
    const lab2 = { l: 50, a: 0, b: -82.7485 }
    expect(ciede2000(lab1, lab2)).toBeCloseTo(2.0425, 3)
  })

  it('Sharma テストペア2', () => {
    const lab1 = { l: 50, a: 3.1571, b: -77.2803 }
    const lab2 = { l: 50, a: 0, b: -82.7485 }
    expect(ciede2000(lab1, lab2)).toBeCloseTo(2.8615, 3)
  })

  it('Sharma テストペア3', () => {
    const lab1 = { l: 50, a: 2.8361, b: -74.0200 }
    const lab2 = { l: 50, a: 0, b: -82.7485 }
    expect(ciede2000(lab1, lab2)).toBeCloseTo(3.4412, 3)
  })

  it('Sharma テストペア4 (ΔE=1.0000)', () => {
    const lab1 = { l: 50, a: -1.3802, b: -84.2814 }
    const lab2 = { l: 50, a: 0, b: -82.7485 }
    expect(ciede2000(lab1, lab2)).toBeCloseTo(1.0000, 3)
  })

  it('Sharma テストペア16 (色相差が大きい)', () => {
    const lab1 = { l: 50, a: 2.5, b: 0 }
    const lab2 = { l: 50, a: 0, b: -2.5 }
    expect(ciede2000(lab1, lab2)).toBeCloseTo(4.3065, 3)
  })

  it('Sharma テストペア7 (無彩色付近)', () => {
    const lab1 = { l: 50, a: 0, b: 0 }
    const lab2 = { l: 50, a: -1, b: 2 }
    expect(ciede2000(lab1, lab2)).toBeCloseTo(2.3669, 3)
  })

  it('対称性: ciede2000(a,b) === ciede2000(b,a)', () => {
    const lab1 = { l: 50, a: 25, b: -10 }
    const lab2 = { l: 70, a: -15, b: 30 }
    expect(ciede2000(lab1, lab2)).toBeCloseTo(ciede2000(lab2, lab1), 10)
  })
})
