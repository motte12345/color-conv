import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { ColorPreview } from '../components/ColorPreview'
import { CopyButton } from '../components/CopyButton'
import { JsonLd } from '../components/JsonLd'
import { usePersistedState } from '../hooks/usePersistedState'
import { useLang, useT, langPath } from '../i18n'
import {
  type Rgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  rgbToCmyk,
  cmykToRgb,
  parseHex,
  parseRgb,
  parseHsl,
  parseHsv,
  parseCmyk,
} from '../calc'

interface ColorStrings {
  readonly hex: string
  readonly rgb: string
  readonly hsl: string
  readonly hslCss: string
  readonly hsv: string
  readonly cmyk: string
}

function rgbToAllStrings(rgb: Rgb): ColorStrings {
  const hex = rgbToHex(rgb)
  const hsl = rgbToHsl(rgb)
  const hsv = rgbToHsv(rgb)
  const cmyk = rgbToCmyk(rgb)
  return {
    hex,
    rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    hsl: `${hsl.h}, ${hsl.s}, ${hsl.l}`,
    hslCss: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsv: `${hsv.h}, ${hsv.s}, ${hsv.v}`,
    cmyk: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`,
  }
}

const DEFAULT_RGB: Rgb = { r: 255, g: 87, b: 51 }

export default function HomePage() {
  const lang = useLang()
  const t = useT()
  const [rgb, setRgb] = usePersistedState<Rgb>('home:rgb', DEFAULT_RGB)
  const colors = rgbToAllStrings(rgb)
  const hexForPicker = rgbToHex(rgb)

  const updateRgb = useCallback(
    (newRgb: Rgb) => {
      setRgb(newRgb)
      try {
        localStorage.setItem('color-conv:lastColor', rgbToHex(newRgb).replace('#', ''))
      } catch { /* ignore */ }
    },
    [setRgb],
  )

  const handlePickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseHex(e.target.value)
      if (parsed) updateRgb(parsed)
    },
    [updateRgb],
  )

  const handleHexInput = useCallback((v: string) => { const p = parseHex(v); if (p) updateRgb(p) }, [updateRgb])
  const handleRgbInput = useCallback((v: string) => { const p = parseRgb(v); if (p) updateRgb(p) }, [updateRgb])
  const handleHslInput = useCallback((v: string) => { const p = parseHsl(v); if (p) updateRgb(hslToRgb(p)) }, [updateRgb])
  const handleHsvInput = useCallback((v: string) => { const p = parseHsv(v); if (p) updateRgb(hsvToRgb(p)) }, [updateRgb])
  const handleCmykInput = useCallback((v: string) => { const p = parseCmyk(v); if (p) updateRgb(cmykToRgb(p)) }, [updateRgb])

  const hexClean = hexForPicker.replace('#', '')

  return (
    <>
      <PageHead title={t.home.metaTitle} description={t.home.description} path="/" />
      <h1 className="page-title">{t.home.h1}</h1>
      <p className="page-description">{t.home.pageDescription}</p>

      <div className="card converter-preview">
        <div className="converter-preview__picker">
          <input type="color" value={hexForPicker} onChange={handlePickerChange} className="converter-picker-input" aria-label={t.home.pickerAria} />
        </div>
        <ColorPreview hex={hexForPicker} size="lg" />
      </div>

      <div className="card converter-form">
        <ColorField label="HEX" value={colors.hex} onChange={handleHexInput} placeholder="#FF5733" copyValue={colors.hex} cssValue={`color: ${colors.hex};`} />
        <ColorField label="RGB" value={colors.rgb} onChange={handleRgbInput} placeholder="255, 87, 51" copyValue={colors.rgb} cssValue={`color: rgb(${colors.rgb});`} />
        <ColorField label="HSL" value={colors.hsl} onChange={handleHslInput} placeholder="14, 100, 60" copyValue={colors.hsl} cssValue={`color: ${colors.hslCss};`} />
        <ColorField label="HSV" value={colors.hsv} onChange={handleHsvInput} placeholder="14, 80, 100" copyValue={colors.hsv} cssValue="" />
        <ColorField label="CMYK" value={colors.cmyk} onChange={handleCmykInput} placeholder="0, 66, 80, 0" copyValue={colors.cmyk} cssValue="" />
      </div>

      <div className="card converter-links">
        <p className="converter-links__label">{t.common.thisColorWith}</p>
        <div className="converter-links__items">
          <Link to={`${langPath(lang, '/palette')}?base=${hexClean}`}>{t.common.linkPalette}</Link>
          <Link to={`${langPath(lang, '/gradient')}?from=${hexClean}`}>{t.common.linkGradient}</Link>
          <Link to={`${langPath(lang, '/contrast')}?fg=${hexClean}`}>{t.common.linkContrast}</Link>
        </div>
      </div>

      <section className="seo-content">
        <h2>{t.home.seoHeading1}</h2>
        <p>{t.home.seoText1}</p>
        <h2>{t.home.seoHeading2}</h2>
        <ul>
          <li><strong>HEX</strong>: {t.home.formatHex.split(': ').slice(1).join(': ')}</li>
          <li><strong>RGB</strong>: {t.home.formatRgb.split(': ').slice(1).join(': ')}</li>
          <li><strong>HSL</strong>: {t.home.formatHsl.split(': ').slice(1).join(': ')}</li>
          <li><strong>HSV / HSB</strong>: {t.home.formatHsv.split(': ').slice(1).join(': ')}</li>
          <li><strong>CMYK</strong>: {t.home.formatCmyk.split(': ').slice(1).join(': ')}</li>
        </ul>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t.home.jsonLdName,
        description: t.home.jsonLdDescription,
        url: `https://color-conv.pages.dev/${lang}/`,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'All',
        offers: { '@type': 'Offer', price: '0' },
      }} />
    </>
  )
}

interface ColorFieldProps {
  readonly label: string
  readonly value: string
  readonly onChange: (value: string) => void
  readonly placeholder: string
  readonly copyValue: string
  readonly cssValue: string
}

function ColorField({ label, value, onChange, placeholder, copyValue, cssValue }: ColorFieldProps) {
  // keyにvalueを使って親の値変更時にリセット
  const [editState, setEditState] = useState<{ text: string; invalid: boolean }>({ text: value, invalid: false })

  // 親の値が変わったらリセット（Reactの key ではなく比較で検知）
  const displayValue = editState.text === value || editState.invalid ? editState.text : value

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    onChange(v)
    setEditState({ text: v, invalid: v.length > 2 && v !== value })
  }, [onChange, value])

  const handleBlur = useCallback(() => {
    setEditState((prev) => ({ ...prev, invalid: false }))
  }, [])

  return (
    <div className="color-field">
      <label className="color-field__label">{label}</label>
      <input
        type="text"
        className={`color-field__input${editState.invalid ? ' color-field__input--invalid' : ''}`}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        spellCheck={false}
      />
      <div className="color-field__actions">
        <CopyButton text={copyValue} />
        {cssValue && <CopyButton text={cssValue} label="CSS" />}
      </div>
    </div>
  )
}
