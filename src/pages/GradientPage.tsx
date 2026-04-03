import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { CopyButton } from '../components/CopyButton'
import { JsonLd } from '../components/JsonLd'
import { usePersistedState } from '../hooks/usePersistedState'
import { useLang, useT } from '../i18n'
import {
  type Rgb,
  type GradientDirection,
  rgbToHex,
  parseHex,
  interpolateColors,
  generateGradientCss,
} from '../calc'

const DIRECTION_KEYS: readonly { value: GradientDirection; key: keyof ReturnType<typeof useT>['gradient']['directions'] }[] = [
  { value: 'to right', key: 'toRight' },
  { value: 'to bottom', key: 'toBottom' },
  { value: '45deg', key: 'deg45' },
  { value: '135deg', key: 'deg135' },
  { value: 'to bottom right', key: 'toBottomRight' },
  { value: 'circle', key: 'circle' },
]

function getInitialColor(searchParams: URLSearchParams, param: string, fallback: Rgb): Rgb {
  const val = searchParams.get(param)
  if (val) { const p = parseHex(val); if (p) return p }
  return fallback
}

export default function GradientPage() {
  const lang = useLang()
  const t = useT()
  const [searchParams] = useSearchParams()
  const [initialFrom] = useState(() => getInitialColor(searchParams, 'from', { r: 255, g: 87, b: 51 }))
  const [initialTo] = useState(() => getInitialColor(searchParams, 'to', { r: 51, g: 87, b: 255 }))

  const [fromRgb, setFromRgb] = usePersistedState<Rgb>('gradient:from', initialFrom)
  const [toRgb, setToRgb] = usePersistedState<Rgb>('gradient:to', initialTo)
  const [steps, setSteps] = usePersistedState<number>('gradient:steps', 5)
  const [direction, setDirection] = usePersistedState<GradientDirection>('gradient:direction', 'to right')

  const fromHex = rgbToHex(fromRgb)
  const toHex = rgbToHex(toRgb)
  const stops = useMemo(() => interpolateColors(fromRgb, toRgb, steps), [fromRgb, toRgb, steps])
  const cssCode = useMemo(() => generateGradientCss([{ hex: fromHex }, { hex: toHex }], direction), [fromHex, toHex, direction])

  const handleFromPicker = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const p = parseHex(e.target.value); if (p) setFromRgb(p) }, [setFromRgb])
  const handleToPicker = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const p = parseHex(e.target.value); if (p) setToRgb(p) }, [setToRgb])
  const handleFromHex = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const p = parseHex(e.target.value); if (p) setFromRgb(p) }, [setFromRgb])
  const handleToHex = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const p = parseHex(e.target.value); if (p) setToRgb(p) }, [setToRgb])
  const handleSwap = useCallback(() => { setFromRgb(toRgb); setToRgb(fromRgb) }, [fromRgb, toRgb, setFromRgb, setToRgb])

  return (
    <>
      <PageHead title={t.gradient.title} description={t.gradient.description} path="/gradient" />
      <h1 className="page-title">{t.gradient.h1}</h1>
      <p className="page-description">{t.gradient.pageDescription}</p>

      <div className="card gradient-inputs">
        <div className="gradient-color-row">
          <label className="color-field__label">{t.gradient.fromColor}</label>
          <input type="color" value={fromHex} onChange={handleFromPicker} className="converter-picker-input palette-base__picker" aria-label={t.gradient.fromAria} />
          <input type="text" className="color-field__input" value={fromHex} onChange={handleFromHex} spellCheck={false} />
        </div>
        <button type="button" className="gradient-swap-btn" onClick={handleSwap} aria-label={t.gradient.swapAria}>⇄</button>
        <div className="gradient-color-row">
          <label className="color-field__label">{t.gradient.toColor}</label>
          <input type="color" value={toHex} onChange={handleToPicker} className="converter-picker-input palette-base__picker" aria-label={t.gradient.toAria} />
          <input type="text" className="color-field__input" value={toHex} onChange={handleToHex} spellCheck={false} />
        </div>
      </div>

      <div className="card gradient-settings">
        <div className="gradient-setting">
          <label className="color-field__label">{t.gradient.direction}</label>
          <div className="gradient-direction-btns">
            {DIRECTION_KEYS.map((d) => (
              <button key={d.value} type="button" className={`palette-tab${direction === d.value ? ' palette-tab--active' : ''}`} onClick={() => setDirection(d.value)}>
                {t.gradient.directions[d.key]}
              </button>
            ))}
          </div>
        </div>
        <div className="gradient-setting">
          <label className="color-field__label">{t.gradient.steps}: {steps}</label>
          <input type="range" min={2} max={20} value={steps} onChange={(e) => setSteps(Number(e.target.value))} className="gradient-range" />
        </div>
      </div>

      <div className="card">
        <div className="gradient-preview" style={{ background: cssCode }} />
      </div>

      <div className="card gradient-steps">
        <div className="gradient-steps__header"><span className="color-field__label">{t.gradient.stepsList}</span></div>
        <div className="gradient-steps__list">
          {stops.map((stop) => (
            <div key={stop.position} className="gradient-step-item">
              <div className="gradient-step-item__swatch" style={{ backgroundColor: stop.hex }} />
              <span className="gradient-step-item__hex">{stop.hex}</span>
              <CopyButton text={stop.hex} />
            </div>
          ))}
        </div>
      </div>

      <div className="card gradient-css">
        <div className="gradient-css__header">
          <span className="color-field__label">{t.gradient.cssCode}</span>
          <CopyButton text={`background: ${cssCode};`} label={t.gradient.copyCss} />
        </div>
        <code className="gradient-css__code">background: {cssCode};</code>
      </div>

      <section className="seo-content">
        <h2>{t.gradient.seoHeading}</h2>
        <p>{t.gradient.seoText}</p>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'WebApplication',
        name: t.gradient.jsonLdName, description: t.gradient.jsonLdDescription,
        url: `https://color-conv.pages.dev/${lang}/gradient`,
        applicationCategory: 'DesignApplication', operatingSystem: 'All',
        offers: { '@type': 'Offer', price: '0' },
      }} />
    </>
  )
}
