import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { CopyButton } from '../components/CopyButton'
import { JsonLd } from '../components/JsonLd'
import { usePersistedState } from '../hooks/usePersistedState'
import {
  type Rgb,
  rgbToHex,
  parseHex,
  checkWcag,
  suggestAccessibleColor,
} from '../calc'

function getInitialColor(searchParams: URLSearchParams, param: string, fallback: Rgb): Rgb {
  const val = searchParams.get(param)
  if (val) {
    const parsed = parseHex(val)
    if (parsed) return parsed
  }
  return fallback
}

export default function ContrastPage() {
  const [searchParams] = useSearchParams()
  const initialFg = useMemo(() => getInitialColor(searchParams, 'fg', { r: 51, g: 51, b: 51 }), []) // eslint-disable-line react-hooks/exhaustive-deps
  const initialBg = useMemo(() => getInitialColor(searchParams, 'bg', { r: 255, g: 255, b: 255 }), []) // eslint-disable-line react-hooks/exhaustive-deps

  const [fg, setFg] = usePersistedState<Rgb>('contrast:fg', initialFg)
  const [bg, setBg] = usePersistedState<Rgb>('contrast:bg', initialBg)

  const fgHex = rgbToHex(fg)
  const bgHex = rgbToHex(bg)
  const wcag = useMemo(() => checkWcag(fg, bg), [fg, bg])
  const suggestion = useMemo(() => {
    if (wcag.aa) return null
    return suggestAccessibleColor(fg, bg, 4.5)
  }, [fg, bg, wcag.aa])

  const handleFgPicker = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseHex(e.target.value)
      if (parsed) setFg(parsed)
    },
    [setFg],
  )

  const handleBgPicker = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseHex(e.target.value)
      if (parsed) setBg(parsed)
    },
    [setBg],
  )

  const handleFgHex = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseHex(e.target.value)
      if (parsed) setFg(parsed)
    },
    [setFg],
  )

  const handleBgHex = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseHex(e.target.value)
      if (parsed) setBg(parsed)
    },
    [setBg],
  )

  const handleSwap = useCallback(() => {
    setFg(bg)
    setBg(fg)
  }, [fg, bg, setFg, setBg])

  const handleApplySuggestion = useCallback(() => {
    if (suggestion) setFg(suggestion.rgb)
  }, [suggestion, setFg])

  return (
    <>
      <PageHead
        title="コントラスト比チェッカー"
        description="テキスト色と背景色のコントラスト比をWCAG 2.1基準で判定。AA/AAAレベルの合否を表示し、合格色の提案も。"
        path="/contrast"
      />
      <h1 className="page-title">コントラスト比チェッカー</h1>
      <p className="page-description">
        前景色と背景色のコントラスト比をWCAG 2.1基準で判定します。
      </p>

      {/* 色入力 */}
      <div className="card gradient-inputs">
        <div className="gradient-color-row">
          <label className="color-field__label">前景色</label>
          <input
            type="color"
            value={fgHex}
            onChange={handleFgPicker}
            className="converter-picker-input palette-base__picker"
            aria-label="前景色ピッカー"
          />
          <input
            type="text"
            className="color-field__input"
            value={fgHex}
            onChange={handleFgHex}
            spellCheck={false}
          />
        </div>

        <button type="button" className="gradient-swap-btn" onClick={handleSwap} aria-label="色を入れ替え">
          ⇄
        </button>

        <div className="gradient-color-row">
          <label className="color-field__label">背景色</label>
          <input
            type="color"
            value={bgHex}
            onChange={handleBgPicker}
            className="converter-picker-input palette-base__picker"
            aria-label="背景色ピッカー"
          />
          <input
            type="text"
            className="color-field__input"
            value={bgHex}
            onChange={handleBgHex}
            spellCheck={false}
          />
        </div>
      </div>

      {/* コントラスト比表示 */}
      <div className="card contrast-result">
        <div className="contrast-ratio">
          <span className="contrast-ratio__value">{wcag.ratio}:1</span>
          <CopyButton text={`${wcag.ratio}:1`} label="コピー" />
        </div>

        <div className="contrast-levels">
          <WcagBadge label="AA 通常テキスト" passed={wcag.aa} requirement="4.5:1" />
          <WcagBadge label="AA 大テキスト" passed={wcag.aaLarge} requirement="3:1" />
          <WcagBadge label="AAA 通常テキスト" passed={wcag.aaa} requirement="7:1" />
          <WcagBadge label="AAA 大テキスト" passed={wcag.aaaLarge} requirement="4.5:1" />
        </div>
      </div>

      {/* テキストプレビュー */}
      <div className="card contrast-preview" style={{ backgroundColor: bgHex }}>
        <p className="contrast-preview__text-normal" style={{ color: fgHex }}>
          通常テキスト (16px) — The quick brown fox jumps over the lazy dog
        </p>
        <p className="contrast-preview__text-large" style={{ color: fgHex }}>
          大テキスト (24px) — カラーコード変換
        </p>
        <p className="contrast-preview__text-small" style={{ color: fgHex }}>
          小テキスト (12px) — 免責事項: 色の見え方はモニターにより異なります
        </p>
      </div>

      {/* 合格色の提案 */}
      {suggestion && (
        <div className="card contrast-suggestion">
          <p className="contrast-suggestion__label">
            AA基準を満たす最も近い前景色:
          </p>
          <div className="contrast-suggestion__color">
            <div
              className="gradient-step-item__swatch"
              style={{ backgroundColor: suggestion.hex }}
            />
            <span className="gradient-step-item__hex">{suggestion.hex}</span>
            <span className="contrast-suggestion__ratio">{suggestion.ratio}:1</span>
            <button
              type="button"
              className="palette-tab"
              onClick={handleApplySuggestion}
            >
              適用
            </button>
            <CopyButton text={suggestion.hex} label="コピー" />
          </div>
        </div>
      )}

      <section className="seo-content">
        <h2>WCAG 2.1 コントラスト比の基準</h2>
        <ul>
          <li><strong>AA 通常テキスト</strong>: コントラスト比 4.5:1 以上が必要</li>
          <li><strong>AA 大テキスト</strong>: コントラスト比 3:1 以上（18pt以上、または14pt太字以上）</li>
          <li><strong>AAA 通常テキスト</strong>: コントラスト比 7:1 以上が必要</li>
          <li><strong>AAA 大テキスト</strong>: コントラスト比 4.5:1 以上</li>
        </ul>
        <p>
          Webアクセシビリティを確保するためには、テキストと背景のコントラスト比を適切に保つことが重要です。
          WCAG 2.1はW3Cが策定したアクセシビリティガイドラインで、多くの法規制やガイドラインの基準として採用されています。
        </p>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'コントラスト比チェッカー',
        description: 'テキスト色と背景色のコントラスト比をWCAG 2.1基準で判定するツール',
        url: 'https://color-conv.pages.dev/contrast',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'All',
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
