import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { CopyButton } from '../components/CopyButton'
import { JsonLd } from '../components/JsonLd'
import { usePersistedState } from '../hooks/usePersistedState'
import { useLang, useT } from '../i18n'
import {
  type Rgb,
  rgbToHex,
  parseHex,
  checkWcag,
  suggestAccessibleColor,
} from '../calc'

function getInitialColor(searchParams: URLSearchParams, param: string, fallback: Rgb): Rgb {
  const val = searchParams.get(param)
  if (val) { const p = parseHex(val); if (p) return p }
  return fallback
}

export default function ContrastPage() {
  const lang = useLang()
  const t = useT()
  const [searchParams] = useSearchParams()
  const [initialFg] = useState(() => getInitialColor(searchParams, 'fg', { r: 51, g: 51, b: 51 }))
  const [initialBg] = useState(() => getInitialColor(searchParams, 'bg', { r: 255, g: 255, b: 255 }))

  const [fg, setFg] = usePersistedState<Rgb>('contrast:fg', initialFg)
  const [bg, setBg] = usePersistedState<Rgb>('contrast:bg', initialBg)

  const fgHex = rgbToHex(fg)
  const bgHex = rgbToHex(bg)
  const wcag = useMemo(() => checkWcag(fg, bg), [fg, bg])
  const suggestion = useMemo(() => {
    if (wcag.aa) return null
    return suggestAccessibleColor(fg, bg, 4.5)
  }, [fg, bg, wcag.aa])

  const handleFgPicker = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const p = parseHex(e.target.value); if (p) setFg(p) }, [setFg])
  const handleBgPicker = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const p = parseHex(e.target.value); if (p) setBg(p) }, [setBg])
  const handleFgHex = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const p = parseHex(e.target.value); if (p) setFg(p) }, [setFg])
  const handleBgHex = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const p = parseHex(e.target.value); if (p) setBg(p) }, [setBg])
  const handleSwap = useCallback(() => { setFg(bg); setBg(fg) }, [fg, bg, setFg, setBg])
  const handleApplySuggestion = useCallback(() => { if (suggestion) setFg(suggestion.rgb) }, [suggestion, setFg])

  return (
    <>
      <PageHead title={t.contrast.title} description={t.contrast.description} path="/contrast" />
      <h1 className="page-title">{t.contrast.h1}</h1>
      <p className="page-description">{t.contrast.pageDescription}</p>

      <div className="card gradient-inputs">
        <div className="gradient-color-row">
          <label className="color-field__label">{t.contrast.foreground}</label>
          <input type="color" value={fgHex} onChange={handleFgPicker} className="converter-picker-input palette-base__picker" aria-label={t.contrast.fgAria} />
          <input type="text" className="color-field__input" value={fgHex} onChange={handleFgHex} spellCheck={false} />
        </div>
        <button type="button" className="gradient-swap-btn" onClick={handleSwap} aria-label={t.contrast.swapAria}>⇄</button>
        <div className="gradient-color-row">
          <label className="color-field__label">{t.contrast.background}</label>
          <input type="color" value={bgHex} onChange={handleBgPicker} className="converter-picker-input palette-base__picker" aria-label={t.contrast.bgAria} />
          <input type="text" className="color-field__input" value={bgHex} onChange={handleBgHex} spellCheck={false} />
        </div>
      </div>

      <div className="card contrast-result">
        <div className="contrast-ratio">
          <span className="contrast-ratio__value">{wcag.ratio}:1</span>
          <CopyButton text={`${wcag.ratio}:1`} />
        </div>
        <div className="contrast-levels">
          <WcagBadge label={t.contrast.aaNormal} passed={wcag.aa} requirement="4.5:1" />
          <WcagBadge label={t.contrast.aaLarge} passed={wcag.aaLarge} requirement="3:1" />
          <WcagBadge label={t.contrast.aaaNormal} passed={wcag.aaa} requirement="7:1" />
          <WcagBadge label={t.contrast.aaaLarge} passed={wcag.aaaLarge} requirement="4.5:1" />
        </div>
      </div>

      <div className="card contrast-preview" style={{ backgroundColor: bgHex }}>
        <p className="contrast-preview__text-normal" style={{ color: fgHex }}>{t.contrast.previewNormal}</p>
        <p className="contrast-preview__text-large" style={{ color: fgHex }}>{t.contrast.previewLarge}</p>
        <p className="contrast-preview__text-small" style={{ color: fgHex }}>{t.contrast.previewSmall}</p>
      </div>

      {suggestion && (
        <div className="card contrast-suggestion">
          <p className="contrast-suggestion__label">{t.contrast.suggestionLabel}</p>
          <div className="contrast-suggestion__color">
            <div className="gradient-step-item__swatch" style={{ backgroundColor: suggestion.hex }} />
            <span className="gradient-step-item__hex">{suggestion.hex}</span>
            <span className="contrast-suggestion__ratio">{suggestion.ratio}:1</span>
            <button type="button" className="palette-tab" onClick={handleApplySuggestion}>{t.contrast.apply}</button>
            <CopyButton text={suggestion.hex} />
          </div>
        </div>
      )}

      <section className="seo-content">
        <h2>{t.contrast.seoHeading}</h2>
        <ul>
          {t.contrast.seoItems.map((item) => (
            <li key={item}><strong>{item.split(': ')[0]}</strong>: {item.split(': ').slice(1).join(': ')}</li>
          ))}
        </ul>
        <p>{t.contrast.seoText}</p>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'WebApplication',
        name: t.contrast.jsonLdName, description: t.contrast.jsonLdDescription,
        url: `https://color-conv.pages.dev/${lang}/contrast`,
        applicationCategory: 'DesignApplication', operatingSystem: 'All',
        offers: { '@type': 'Offer', price: '0' },
      }} />
    </>
  )
}

function WcagBadge({ label, passed, requirement }: { label: string; passed: boolean; requirement: string }) {
  return (
    <div className={`wcag-badge${passed ? ' wcag-badge--pass' : ' wcag-badge--fail'}`}>
      <span className="wcag-badge__status">{passed ? 'PASS' : 'FAIL'}</span>
      <span className="wcag-badge__label">{label}</span>
      <span className="wcag-badge__req">{requirement}</span>
    </div>
  )
}
