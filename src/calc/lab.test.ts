import { describe, it, expect } from 'vitest'
import { rgbToXyz, rgbToLab, labToRgb } from './lab'

describe('rgbToXyz', () => {
  it('白', () => {
    const xyz = rgbToXyz({ r: 255, g: 255, b: 255 })
    expect(xyz.x).toBeCloseTo(95.047, 0)
    expect(xyz.y).toBeCloseTo(100, 0)
    expect(xyz.z).toBeCloseTo(108.883, 0)
  })

  it('黒', () => {
    const xyz = rgbToXyz({ r: 0, g: 0, b: 0 })
    expect(xyz.x).toBeCloseTo(0, 1)
    expect(xyz.y).toBeCloseTo(0, 1)
    expect(xyz.z).toBeCloseTo(0, 1)
  })
})

describe('rgbToLab', () => {
  it('白', () => {
    const lab = rgbToLab({ r: 255, g: 255, b: 255 })
    expect(lab.l).toBeCloseTo(100, 0)
    expect(lab.a).toBeCloseTo(0, 0)
    expect(lab.b).toBeCloseTo(0, 0)
  })

  it('黒', () => {
    const lab = rgbToLab({ r: 0, g: 0, b: 0 })
    expect(lab.l).toBeCloseTo(0, 0)
    expect(lab.a).toBeCloseTo(0, 0)
    expect(lab.b).toBeCloseTo(0, 0)
  })

  it('赤', () => {
    const lab = rgbToLab({ r: 255, g: 0, b: 0 })
    expect(lab.l).toBeCloseTo(53.23, 0)
    expect(lab.a).toBeCloseTo(80.11, 0)
    expect(lab.b).toBeCloseTo(67.22, 0)
  })

  it('緑', () => {
    const lab = rgbToLab({ r: 0, g: 128, b: 0 })
    expect(lab.l).toBeCloseTo(46.23, 0)
    expect(lab.a).toBeCloseTo(-51.70, 0)
    expect(lab.b).toBeCloseTo(49.90, 0)
  })
})

describe('labToRgb', () => {
  it('RGB→Lab→RGBラウンドトリップ', () => {
    const colors = [
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 128, g: 64, b: 192 },
      { r: 200, g: 150, b: 100 },
    ]

    for (const original of colors) {
      const lab = rgbToLab(original)
      const result = labToRgb(lab)
      expect(result.r).toBeCloseTo(original.r, 0)
      expect(result.g).toBeCloseTo(original.g, 0)
      expect(result.b).toBeCloseTo(original.b, 0)
    }
  })
})
