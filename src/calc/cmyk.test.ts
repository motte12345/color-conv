import { describe, it, expect } from 'vitest'
import { rgbToCmyk, cmykToRgb } from './cmyk'

describe('rgbToCmyk', () => {
  it('白', () => {
    expect(rgbToCmyk({ r: 255, g: 255, b: 255 })).toEqual({ c: 0, m: 0, y: 0, k: 0 })
  })

  it('黒', () => {
    expect(rgbToCmyk({ r: 0, g: 0, b: 0 })).toEqual({ c: 0, m: 0, y: 0, k: 100 })
  })

  it('赤', () => {
    expect(rgbToCmyk({ r: 255, g: 0, b: 0 })).toEqual({ c: 0, m: 100, y: 100, k: 0 })
  })

  it('任意の色', () => {
    const cmyk = rgbToCmyk({ r: 255, g: 87, b: 51 })
    expect(cmyk.c).toBe(0)
    expect(cmyk.m).toBeCloseTo(65.9, 0)
    expect(cmyk.y).toBe(80)
    expect(cmyk.k).toBe(0)
  })
})

describe('cmykToRgb', () => {
  it('白', () => {
    expect(cmykToRgb({ c: 0, m: 0, y: 0, k: 0 })).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('黒', () => {
    expect(cmykToRgb({ c: 0, m: 0, y: 0, k: 100 })).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('RGB→CMYK→RGBラウンドトリップ', () => {
    const original = { r: 200, g: 100, b: 50 }
    const cmyk = rgbToCmyk(original)
    const result = cmykToRgb(cmyk)
    expect(result.r).toBeCloseTo(original.r, 0)
    expect(result.g).toBeCloseTo(original.g, 0)
    expect(result.b).toBeCloseTo(original.b, 0)
  })
})
