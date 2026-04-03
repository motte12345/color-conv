import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { CopyButton } from '../components/CopyButton'
import { JsonLd } from '../components/JsonLd'
import { usePersistedState } from '../hooks/usePersistedState'
import {
  type Rgb,
  type GradientDirection,
  rgbToHex,
  parseHex,
  interpolateColors,
  generateGradientCss,
} from '../calc'

const DIRECTIONS: readonly { value: GradientDirection; label: string }[] = [
  { value: 'to right', label: '右へ' },
  { value: 'to bottom', label: '下へ' },
  { value: '45deg', label: '45°' },
  { value: '135deg', label: '135°' },
  { value: 'to bottom right', label: '右下へ' },
  { value: 'circle', label: '放射状' },
]

function getInitialColor(searchParams: URLSearchParams, param: string, fallback: Rgb): Rgb {
  const val = searchParams.get(param)
  if (val) {
    const parsed = parseHex(val)
    if (parsed) return parsed
  }
  return fallback
}

export default function GradientPage() {
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

  const cssCode = useMemo(
    () => generateGradientCss([{ hex: fromHex }, { hex: toHex }], direction),
    [fromHex, toHex, direction],
  )

  const handleFromPicker = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseHex(e.target.value)
      if (parsed) setFromRgb(parsed)
    },
    [setFromRgb],
  )

  const handleToPicker = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseHex(e.target.value)
      if (parsed) setToRgb(parsed)
    },
    [setToRgb],
  )

  const handleFromHex = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseHex(e.target.value)
      if (parsed) setFromRgb(parsed)
    },
    [setFromRgb],
  )

  const handleToHex = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseHex(e.target.value)
      if (parsed) setToRgb(parsed)
    },
    [setToRgb],
  )

  const handleSwap = useCallback(() => {
    setFromRgb(toRgb)
    setToRgb(fromRgb)
  }, [fromRgb, toRgb, setFromRgb, setToRgb])

  return (
    <>
      <PageHead
        title="グラデーション生成"
        description="2色以上からCSSグラデーションを生成。線形・放射状に対応し、linear-gradient()コードをそのままコピーできます。"
        path="/gradient"
      />
      <h1 className="page-title">グラデーション生成</h1>
      <p className="page-description">
        開始色と終了色からグラデーションを生成し、CSSコードをコピーできます。
      </p>

      {/* 色入力 */}
      <div className="card gradient-inputs">
        <div className="gradient-color-row">
          <label className="color-field__label">開始色</label>
          <input
            type="color"
            value={fromHex}
            onChange={handleFromPicker}
            className="converter-picker-input palette-base__picker"
            aria-label="開始色ピッカー"
          />
          <input
            type="text"
            className="color-field__input"
            value={fromHex}
            onChange={handleFromHex}
            spellCheck={false}
          />
        </div>

        <button type="button" className="gradient-swap-btn" onClick={handleSwap} aria-label="色を入れ替え">
          ⇄
        </button>

        <div className="gradient-color-row">
          <label className="color-field__label">終了色</label>
          <input
            type="color"
            value={toHex}
            onChange={handleToPicker}
            className="converter-picker-input palette-base__picker"
            aria-label="終了色ピッカー"
          />
          <input
            type="text"
            className="color-field__input"
            value={toHex}
            onChange={handleToHex}
            spellCheck={false}
          />
        </div>
      </div>

      {/* 設定 */}
      <div className="card gradient-settings">
        <div className="gradient-setting">
          <label className="color-field__label">方向</label>
          <div className="gradient-direction-btns">
            {DIRECTIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                className={`palette-tab${direction === d.value ? ' palette-tab--active' : ''}`}
                onClick={() => setDirection(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="gradient-setting">
          <label className="color-field__label">ステップ数: {steps}</label>
          <input
            type="range"
            min={2}
            max={20}
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            className="gradient-range"
          />
        </div>
      </div>

      {/* プレビュー */}
      <div className="card">
        <div
          className="gradient-preview"
          style={{ background: cssCode }}
        />
      </div>

      {/* ステップ色一覧 */}
      <div className="card gradient-steps">
        <div className="gradient-steps__header">
          <span className="color-field__label">ステップ色一覧</span>
        </div>
        <div className="gradient-steps__list">
          {stops.map((stop) => (
            <div key={stop.position} className="gradient-step-item">
              <div
                className="gradient-step-item__swatch"
                style={{ backgroundColor: stop.hex }}
              />
              <span className="gradient-step-item__hex">{stop.hex}</span>
              <CopyButton text={stop.hex} label="コピー" />
            </div>
          ))}
        </div>
      </div>

      {/* CSSコード */}
      <div className="card gradient-css">
        <div className="gradient-css__header">
          <span className="color-field__label">CSSコード</span>
          <CopyButton text={`background: ${cssCode};`} label="CSSをコピー" />
        </div>
        <code className="gradient-css__code">background: {cssCode};</code>
      </div>

      <section className="seo-content">
        <h2>CSSグラデーションの使い方</h2>
        <p>
          開始色と終了色を選択し、方向を設定するだけでCSSグラデーションコードを生成できます。
          linear-gradient（線形）とradial-gradient（放射状）に対応しています。
          生成されたコードはそのままCSSにコピーして使用できます。
        </p>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'グラデーション生成ツール',
        description: '2色からCSSグラデーションを生成するツール',
        url: 'https://color-conv.pages.dev/gradient',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'All',
        offers: { '@type': 'Offer', price: '0' },
      }} />
    </>
  )
}
