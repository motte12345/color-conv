import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { ColorPreview } from '../components/ColorPreview'
import { CopyButton } from '../components/CopyButton'
import { JsonLd } from '../components/JsonLd'
import { usePersistedState } from '../hooks/usePersistedState'
import { useLang, useT } from '../i18n'
import {
  type Rgb,
  type PaletteType,
  rgbToHex,
  parseHex,
  generatePalette,
} from '../calc'

const PALETTE_TYPES: readonly PaletteType[] = [
  'complementary', 'analogous', 'triadic', 'split-complementary', 'tetradic', 'monochromatic',
]

const DEFAULT_RGB: Rgb = { r: 255, g: 87, b: 51 }

function getInitialRgb(searchParams: URLSearchParams): Rgb {
  const base = searchParams.get('base')
  if (base) { const p = parseHex(base); if (p) return p }
  try {
    const last = localStorage.getItem('color-conv:lastColor')
    if (last) { const p = parseHex(last); if (p) return p }
  } catch { /* ignore */ }
  return DEFAULT_RGB
}

export default function PalettePage() {
  const lang = useLang()
  const t = useT()
  const [searchParams] = useSearchParams()
  const [initialRgb] = useState(() => getInitialRgb(searchParams))
  const [rgb, setRgb] = usePersistedState<Rgb>('palette:rgb', initialRgb)
  const [activeType, setActiveType] = usePersistedState<PaletteType>('palette:type', 'complementary')

  const hexValue = rgbToHex(rgb)
  const palette = useMemo(() => generatePalette(rgb, activeType), [rgb, activeType])

  const cssVars = useMemo(
    () => palette.map((c, i) => `  --palette-${i + 1}: ${c.hex};`).join('\n'),
    [palette],
  )

  const handleHexInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => { const p = parseHex(e.target.value); if (p) setRgb(p) },
    [setRgb],
  )
  const handlePickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => { const p = parseHex(e.target.value); if (p) setRgb(p) },
    [setRgb],
  )

  return (
    <>
      <PageHead title={t.palette.title} description={t.palette.description} path="/palette" />
      <h1 className="page-title">{t.palette.h1}</h1>
      <p className="page-description">{t.palette.pageDescription}</p>

      <div className="card palette-base">
        <label className="color-field__label">{t.palette.baseColor}</label>
        <div className="palette-base__inputs">
          <input type="color" value={hexValue} onChange={handlePickerChange} className="converter-picker-input palette-base__picker" aria-label={t.palette.baseColorAria} />
          <input type="text" className="color-field__input" value={hexValue} onChange={handleHexInput} placeholder="#FF5733" spellCheck={false} />
          <ColorPreview hex={hexValue} size="sm" />
        </div>
      </div>

      <div className="palette-tabs" role="tablist">
        {PALETTE_TYPES.map((type) => (
          <button key={type} role="tab" type="button" className={`palette-tab${activeType === type ? ' palette-tab--active' : ''}`} aria-selected={activeType === type} onClick={() => setActiveType(type)}>
            {t.palette.types[type]}
          </button>
        ))}
      </div>

      <div className="card palette-result">
        <div className="palette-strip">
          {palette.map((c) => (
            <div key={`${c.roleKey}-${c.hex}`} className="palette-strip__color" style={{ backgroundColor: c.hex }} title={t.palette.roles[c.roleKey]} />
          ))}
        </div>
        <div className="palette-colors">
          {palette.map((c) => (
            <div key={`${c.roleKey}-${c.hex}`} className="palette-color-item">
              <ColorPreview hex={c.hex} size="sm" />
              <div className="palette-color-item__info">
                <span className="palette-color-item__label">{t.palette.roles[c.roleKey]}</span>
                <span className="palette-color-item__hex">{c.hex}</span>
                <span className="palette-color-item__rgb">{c.rgb.r}, {c.rgb.g}, {c.rgb.b}</span>
              </div>
              <CopyButton text={c.hex} label="HEX" />
            </div>
          ))}
        </div>
        <div className="palette-css">
          <CopyButton text={`:root {\n${cssVars}\n}`} label={t.palette.copyVars} />
        </div>
      </div>

      <section className="seo-content">
        <h2>{t.palette.seoHeading}</h2>
        <ul>
          <li><strong>{t.palette.types.complementary}</strong>: {t.palette.seoComplementary.split(': ').slice(1).join(': ')}</li>
          <li><strong>{t.palette.types.analogous}</strong>: {t.palette.seoAnalogous.split(': ').slice(1).join(': ')}</li>
          <li><strong>{t.palette.types.triadic}</strong>: {t.palette.seoTriadic.split(': ').slice(1).join(': ')}</li>
          <li><strong>{t.palette.types['split-complementary']}</strong>: {t.palette.seoSplit.split(': ').slice(1).join(': ')}</li>
          <li><strong>{t.palette.types.tetradic}</strong>: {t.palette.seoTetradic.split(': ').slice(1).join(': ')}</li>
          <li><strong>{t.palette.types.monochromatic}</strong>: {t.palette.seoMono.split(': ').slice(1).join(': ')}</li>
        </ul>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'WebApplication',
        name: t.palette.jsonLdName, description: t.palette.jsonLdDescription,
        url: `https://color-conv.pages.dev/${lang}/palette`,
        applicationCategory: 'DesignApplication', operatingSystem: 'All',
        offers: { '@type': 'Offer', price: '0' },
      }} />
    </>
  )
}
