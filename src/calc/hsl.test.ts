import { describe, it, expect } from 'vitest'
import { rgbToHsl, hslToRgb } from './hsl'

describe('rgbToHsl', () => {
  it('黒', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 })
  })

  it('白', () => {
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100 })
  })

  it('赤', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
  })

  it('緑', () => {
    expect(rgbToHsl({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, l: 50 })
  })

  it('青', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, l: 50 })
  })

  it('任意の色 (#ff5733)', () => {
    const hsl = rgbToHsl({ r: 255, g: 87, b: 51 })
    expect(hsl.h).toBeCloseTo(10.6, 0)
    expect(hsl.s).toBe(100)
    expect(hsl.l).toBeCloseTo(60, 0)
  })

  it('グレー', () => {
    const hsl = rgbToHsl({ r: 128, g: 128, b: 128 })
    expect(hsl.h).toBe(0)
    expect(hsl.s).toBe(0)
    expect(hsl.l).toBeCloseTo(50.2, 0)
  })
})

describe('hslToRgb', () => {
  it('黒', () => {
    expect(hslToRgb({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('白', () => {
    expect(hslToRgb({ h: 0, s: 0, l: 100 })).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('赤', () => {
    expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('緑', () => {
    expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0 })
  })

  it('青', () => {
    expect(hslToRgb({ h: 240, s: 100, l: 50 })).toEqual({ r: 0, g: 0, b: 255 })
  })

  it('RGB→HSL→RGBラウンドトリップ', () => {
    const original = { r: 200, g: 100, b: 50 }
    const hsl = rgbToHsl(original)
    const result = hslToRgb(hsl)
    expect(result.r).toBeCloseTo(original.r, 0)
    expect(result.g).toBeCloseTo(original.g, 0)
    expect(result.b).toBeCloseTo(original.b, 0)
  })
})
