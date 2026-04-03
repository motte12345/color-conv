import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { ColorPreview } from '../components/ColorPreview'
import { CopyButton } from '../components/CopyButton'
import { JsonLd } from '../components/JsonLd'
import { usePersistedState } from '../hooks/usePersistedState'
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

/** 全色空間の表示用文字列 */
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
  const [rgb, setRgb] = usePersistedState<Rgb>('home:rgb', DEFAULT_RGB)
  const colors = rgbToAllStrings(rgb)
  const hexForPicker = rgbToHex(rgb)

  // lastColor を更新（他ツールへの引き継ぎ用）
  const updateRgb = useCallback(
    (newRgb: Rgb) => {
      setRgb(newRgb)
      try {
        localStorage.setItem('color-conv:lastColor', rgbToHex(newRgb).replace('#', ''))
      } catch {
        // ignore
      }
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

  const handleHexInput = useCallback(
    (value: string) => {
      const parsed = parseHex(value)
      if (parsed) updateRgb(parsed)
    },
    [updateRgb],
  )

  const handleRgbInput = useCallback(
    (value: string) => {
      const parsed = parseRgb(value)
      if (parsed) updateRgb(parsed)
    },
    [updateRgb],
  )

  const handleHslInput = useCallback(
    (value: string) => {
      const parsed = parseHsl(value)
      if (parsed) updateRgb(hslToRgb(parsed))
    },
    [updateRgb],
  )

  const handleHsvInput = useCallback(
    (value: string) => {
      const parsed = parseHsv(value)
      if (parsed) updateRgb(hsvToRgb(parsed))
    },
    [updateRgb],
  )

  const handleCmykInput = useCallback(
    (value: string) => {
      const parsed = parseCmyk(value)
      if (parsed) updateRgb(cmykToRgb(parsed))
    },
    [updateRgb],
  )

  return (
    <>
      <PageHead
        title="カラー変換ツール｜HEX・RGB・HSL・CMYK相互変換"
        description="HEX、RGB、HSL、HSV、CMYKのカラーコードを相互変換。配色生成・グラデーション作成・コントラスト比チェックも。"
        path="/"
      />
      <h1 className="page-title">カラーコード変換</h1>
      <p className="page-description">
        HEX・RGB・HSL・HSV・CMYKを相互変換。色を入力すると全形式をリアルタイムで表示します。
      </p>

      {/* カラーピッカー + プレビュー */}
      <div className="card converter-preview">
        <div className="converter-preview__picker">
          <input
            type="color"
            value={hexForPicker}
            onChange={handlePickerChange}
            className="converter-picker-input"
            aria-label="カラーピッカー"
          />
        </div>
        <ColorPreview hex={hexForPicker} size="lg" />
      </div>

      {/* 変換フォーム */}
      <div className="card converter-form">
        <ColorField
          label="HEX"
          value={colors.hex}
          onChange={handleHexInput}
          placeholder="#FF5733"
          copyValue={colors.hex}
          cssValue={`color: ${colors.hex};`}
        />
        <ColorField
          label="RGB"
          value={colors.rgb}
          onChange={handleRgbInput}
          placeholder="255, 87, 51"
          copyValue={colors.rgb}
          cssValue={`color: rgb(${colors.rgb});`}
        />
        <ColorField
          label="HSL"
          value={colors.hsl}
          onChange={handleHslInput}
          placeholder="14, 100, 60"
          copyValue={colors.hsl}
          cssValue={`color: ${colors.hslCss};`}
        />
        <ColorField
          label="HSV"
          value={colors.hsv}
          onChange={handleHsvInput}
          placeholder="14, 80, 100"
          copyValue={colors.hsv}
          cssValue=""
        />
        <ColorField
          label="CMYK"
          value={colors.cmyk}
          onChange={handleCmykInput}
          placeholder="0, 66, 80, 0"
          copyValue={colors.cmyk}
          cssValue=""
        />
      </div>

      {/* 他ツールへのリンク */}
      <div className="card converter-links">
        <p className="converter-links__label">この色で:</p>
        <div className="converter-links__items">
          <Link to={`/palette?base=${hexForPicker.replace('#', '')}`}>
            配色を生成
          </Link>
          <Link to={`/gradient?from=${hexForPicker.replace('#', '')}`}>
            グラデーション作成
          </Link>
          <Link to={`/contrast?fg=${hexForPicker.replace('#', '')}`}>
            コントラスト比チェック
          </Link>
        </div>
      </div>

      {/* SEO補足コンテンツ */}
      <section className="seo-content">
        <h2>カラーコード変換の使い方</h2>
        <p>
          任意の形式でカラーコードを入力すると、他のすべての形式にリアルタイムで変換されます。
          カラーピッカーで直感的に色を選ぶこともできます。
          各値の横のコピーボタンで、HEXコードやCSS表記をクリップボードにコピーできます。
        </p>
        <h2>対応カラーフォーマット</h2>
        <ul>
          <li><strong>HEX</strong>: Web開発で広く使われる16進数表記（例: #FF5733）</li>
          <li><strong>RGB</strong>: 赤・緑・青の3原色の組み合わせ（例: 255, 87, 51）</li>
          <li><strong>HSL</strong>: 色相・彩度・輝度で色を指定（例: 14, 100%, 60%）</li>
          <li><strong>HSV / HSB</strong>: 色相・彩度・明度で色を指定（例: 14, 80%, 100%）</li>
          <li><strong>CMYK</strong>: 印刷で使われる4色分解（概算値）</li>
        </ul>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'カラー変換ツール',
        description: 'HEX、RGB、HSL、HSV、CMYKのカラーコードを相互変換するツール',
        url: 'https://color-conv.pages.dev/',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'All',
        offers: { '@type': 'Offer', price: '0' },
      }} />
    </>
  )
}

/** 色フォーム1行 */
interface ColorFieldProps {
  readonly label: string
  readonly value: string
  readonly onChange: (value: string) => void
  readonly placeholder: string
  readonly copyValue: string
  readonly cssValue: string
}

function ColorField({ label, value, onChange, placeholder, copyValue, cssValue }: ColorFieldProps) {
  return (
    <div className="color-field">
      <label className="color-field__label">{label}</label>
      <input
        type="text"
        className="color-field__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
      />
      <div className="color-field__actions">
        <CopyButton text={copyValue} label="値" />
        {cssValue && <CopyButton text={cssValue} label="CSS" />}
      </div>
    </div>
  )
}
