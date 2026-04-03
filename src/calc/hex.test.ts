import { describe, it, expect } from 'vitest'
import { rgbToHex, hexToRgb } from './hex'

describe('rgbToHex', () => {
  it('黒', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
  })

  it('白', () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff')
  })

  it('赤', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000')
  })

  it('任意の色', () => {
    expect(rgbToHex({ r: 255, g: 87, b: 51 })).toBe('#ff5733')
  })

  it('値をクランプ', () => {
    expect(rgbToHex({ r: 300, g: -10, b: 128 })).toBe('#ff0080')
  })
})

describe('hexToRgb', () => {
  it('6桁(#付き)', () => {
    expect(hexToRgb('#ff5733')).toEqual({ r: 255, g: 87, b: 51 })
  })

  it('6桁(#なし)', () => {
    expect(hexToRgb('ff5733')).toEqual({ r: 255, g: 87, b: 51 })
  })

  it('3桁(#付き)', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('大文字', () => {
    expect(hexToRgb('#FF5733')).toEqual({ r: 255, g: 87, b: 51 })
  })

  it('黒', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('白', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('不正な値でエラー', () => {
    expect(() => hexToRgb('#gggggg')).toThrow('Invalid hex color')
    expect(() => hexToRgb('#12345')).toThrow('Invalid hex color')
    expect(() => hexToRgb('')).toThrow('Invalid hex color')
  })
})
