import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { ColorPreview } from '../components/ColorPreview'
import { CopyButton } from '../components/CopyButton'
import { JsonLd } from '../components/JsonLd'
import { usePersistedState } from '../hooks/usePersistedState'
import {
  type Rgb,
  type PaletteType,
  rgbToHex,
  parseHex,
  generatePalette,
  PALETTE_LABELS,
} from '../calc'

const PALETTE_TYPES: readonly PaletteType[] = [
  'complementary',
  'analogous',
  'triadic',
  'split-complementary',
  'tetradic',
  'monochromatic',
]

const DEFAULT_RGB: Rgb = { r: 255, g: 87, b: 51 }

function getInitialRgb(searchParams: URLSearchParams): Rgb {
  const base = searchParams.get('base')
  if (base) {
    const parsed = parseHex(base)
    if (parsed) return parsed
  }
  // lastColorから復元を試みる
  try {
    const last = localStorage.getItem('color-conv:lastColor')
    if (last) {
      const parsed = parseHex(last)
      if (parsed) return parsed
    }
  } catch {
    // ignore
  }
  return DEFAULT_RGB
}

export default function PalettePage() {
  const [searchParams] = useSearchParams()
  const initialRgb = useMemo(() => getInitialRgb(searchParams), []) // eslint-disable-line react-hooks/exhaustive-deps
  const [rgb, setRgb] = usePersistedState<Rgb>('palette:rgb', initialRgb)
  const [activeType, setActiveType] = usePersistedState<PaletteType>('palette:type', 'complementary')

  const hexValue = rgbToHex(rgb)
  const palette = useMemo(() => generatePalette(rgb, activeType), [rgb, activeType])

  const cssVars = useMemo(
    () =>
      palette
        .map((c, i) => `  --palette-${i + 1}: ${c.hex};`)
        .join('\n'),
    [palette],
  )

  const handleHexInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseHex(e.target.value)
      if (parsed) setRgb(parsed)
    },
    [setRgb],
  )

  const handlePickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseHex(e.target.value)
      if (parsed) setRgb(parsed)
    },
    [setRgb],
  )

  return (
    <>
      <PageHead
        title="配色ジェネレーター"
        description="ベースカラーから補色・類似色・トライアド・テトラードなど6種類の配色パターンを自動生成。CSS変数としてコピーも可能。"
        path="/palette"
      />
      <h1 className="page-title">配色ジェネレーター</h1>
      <p className="page-description">
        ベースカラーから6種類の配色パターンを自動生成します。
      </p>

      {/* ベースカラー入力 */}
      <div className="card palette-base">
        <label className="color-field__label">ベースカラー</label>
        <div className="palette-base__inputs">
          <input
            type="color"
            value={hexValue}
            onChange={handlePickerChange}
            className="converter-picker-input palette-base__picker"
            aria-label="ベースカラーピッカー"
          />
          <input
            type="text"
            className="color-field__input"
            value={hexValue}
            onChange={handleHexInput}
            placeholder="#FF5733"
            spellCheck={false}
          />
          <ColorPreview hex={hexValue} size="sm" />
        </div>
      </div>

      {/* パターンタブ */}
      <div className="palette-tabs" role="tablist">
        {PALETTE_TYPES.map((type) => (
          <button
            key={type}
            role="tab"
            type="button"
            className={`palette-tab${activeType === type ? ' palette-tab--active' : ''}`}
            aria-selected={activeType === type}
            onClick={() => setActiveType(type)}
          >
            {PALETTE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* 配色結果 */}
      <div className="card palette-result">
        {/* 帯プレビュー */}
        <div className="palette-strip">
          {palette.map((c) => (
            <div
              key={`${c.label}-${c.hex}`}
              className="palette-strip__color"
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
        </div>

        {/* 色一覧 */}
        <div className="palette-colors">
          {palette.map((c) => (
            <div key={`${c.label}-${c.hex}`} className="palette-color-item">
              <ColorPreview hex={c.hex} size="sm" />
              <div className="palette-color-item__info">
                <span className="palette-color-item__label">{c.label}</span>
                <span className="palette-color-item__hex">{c.hex}</span>
                <span className="palette-color-item__rgb">
                  {c.rgb.r}, {c.rgb.g}, {c.rgb.b}
                </span>
              </div>
              <CopyButton text={c.hex} label="HEX" />
            </div>
          ))}
        </div>

        {/* CSS変数コピー */}
        <div className="palette-css">
          <CopyButton text={`:root {\n${cssVars}\n}`} label="CSS変数をコピー" />
        </div>
      </div>

      {/* SEO */}
      <section className="seo-content">
        <h2>配色パターンの種類</h2>
        <ul>
          <li><strong>補色</strong>: 色相環で正反対（180°）の色。強いコントラストを生む</li>
          <li><strong>類似色</strong>: 色相環で隣り合う色（±30°）。調和のとれた配色</li>
          <li><strong>トライアド</strong>: 色相環を3等分（120°間隔）。バランスの良い3色</li>
          <li><strong>スプリット</strong>: 補色の両隣（150°, 210°）。補色よりソフトな印象</li>
          <li><strong>テトラード</strong>: 色相環を4等分（90°間隔）。豊かな4色パレット</li>
          <li><strong>モノクロ</strong>: 同一色相で明度・彩度を変化させた配色</li>
        </ul>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '配色ジェネレーター',
        description: 'ベースカラーから6種類の配色パターンを自動生成するツール',
        url: 'https://color-conv.pages.dev/palette',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'All',
        offers: { '@type': 'Offer', price: '0' },
      }} />
    </>
  )
}
