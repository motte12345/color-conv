import { describe, it, expect } from 'vitest'
import { rgbToHsv, hsvToRgb } from './hsv'

describe('rgbToHsv', () => {
  it('黒', () => {
    expect(rgbToHsv({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, v: 0 })
  })

  it('白', () => {
    expect(rgbToHsv({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, v: 100 })
  })

  it('赤', () => {
    expect(rgbToHsv({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, v: 100 })
  })

  it('緑', () => {
    expect(rgbToHsv({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, v: 100 })
  })

  it('青', () => {
    expect(rgbToHsv({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, v: 100 })
  })

  it('任意の色 (#ff5733)', () => {
    const hsv = rgbToHsv({ r: 255, g: 87, b: 51 })
    expect(hsv.h).toBeCloseTo(10.6, 0)
    expect(hsv.s).toBe(80)
    expect(hsv.v).toBe(100)
  })
})

describe('hsvToRgb', () => {
  it('黒', () => {
    expect(hsvToRgb({ h: 0, s: 0, v: 0 })).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('白', () => {
    expect(hsvToRgb({ h: 0, s: 0, v: 100 })).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('赤', () => {
    expect(hsvToRgb({ h: 0, s: 100, v: 100 })).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('RGB→HSV→RGBラウンドトリップ', () => {
    const original = { r: 200, g: 100, b: 50 }
    const hsv = rgbToHsv(original)
    const result = hsvToRgb(hsv)
    expect(result.r).toBeCloseTo(original.r, 0)
    expect(result.g).toBeCloseTo(original.g, 0)
    expect(result.b).toBeCloseTo(original.b, 0)
  })
})
