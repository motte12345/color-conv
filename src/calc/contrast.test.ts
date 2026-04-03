import { describe, it, expect } from 'vitest'
import { relativeLuminance, contrastRatio, checkWcag } from './contrast'

describe('relativeLuminance', () => {
  it('黒は0', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0)
  })

  it('白は1', () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 4)
  })

  it('sRGBガンマ補正を正しく線形化', () => {
    // 中間グレー
    const lum = relativeLuminance({ r: 128, g: 128, b: 128 })
    expect(lum).toBeCloseTo(0.2158, 2)
  })
})

describe('contrastRatio', () => {
  it('黒と白のコントラスト比は21', () => {
    const black = { r: 0, g: 0, b: 0 }
    const white = { r: 255, g: 255, b: 255 }
    expect(contrastRatio(black, white)).toBeCloseTo(21, 0)
  })

  it('同じ色のコントラスト比は1', () => {
    const color = { r: 128, g: 128, b: 128 }
    expect(contrastRatio(color, color)).toBeCloseTo(1, 4)
  })

  it('引数の順序に関係なく同じ結果', () => {
    const fg = { r: 255, g: 0, b: 0 }
    const bg = { r: 255, g: 255, b: 255 }
    expect(contrastRatio(fg, bg)).toBeCloseTo(contrastRatio(bg, fg), 4)
  })
})

describe('checkWcag', () => {
  it('黒と白はすべてのレベルに合格', () => {
    const result = checkWcag({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })
    expect(result.aa).toBe(true)
    expect(result.aaLarge).toBe(true)
    expect(result.aaa).toBe(true)
    expect(result.aaaLarge).toBe(true)
    expect(result.ratio).toBeCloseTo(21, 0)
  })

  it('コントラスト比が低い組み合わせは不合格', () => {
    // 薄いグレーと白
    const result = checkWcag({ r: 200, g: 200, b: 200 }, { r: 255, g: 255, b: 255 })
    expect(result.aa).toBe(false)
    expect(result.aaLarge).toBe(false)
    expect(result.aaa).toBe(false)
    expect(result.aaaLarge).toBe(false)
  })

  it('中程度のコントラスト', () => {
    // ダークグレーと白 — AA大テキストは通るがAAA通常は不合格になるレベル
    const result = checkWcag({ r: 118, g: 118, b: 118 }, { r: 255, g: 255, b: 255 })
    expect(result.aaLarge).toBe(true)
    expect(result.aa).toBe(true)
    expect(result.aaa).toBe(false)
  })
})
