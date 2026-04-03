/**
 * プリレンダリングスクリプト
 * ビルド後に各ルートのHTMLファイルを生成する。
 * メタタグとSEOテキストをbotに見せるための静的HTML。
 * Cloudflare Pagesは静的ファイルを_redirectsより優先する。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const BASE_URL = 'https://color-conv.pages.dev'

const template = readFileSync(join(DIST, 'index.html'), 'utf-8')

const routes = [
  {
    path: '/ja/',
    title: 'カラー変換ツール｜HEX・RGB・HSL・CMYK相互変換',
    description: 'HEX、RGB、HSL、HSV、CMYKのカラーコードを相互変換。配色生成・グラデーション作成・コントラスト比チェックも。',
    h1: 'カラーコード変換',
    text: 'HEX・RGB・HSL・HSV・CMYKを相互変換。色を入力すると全形式をリアルタイムで表示します。',
    lang: 'ja',
  },
  {
    path: '/en/',
    title: 'Color Converter | HEX, RGB, HSL, CMYK Conversion',
    description: 'Convert color codes between HEX, RGB, HSL, HSV, and CMYK. Also includes palette generation, gradient creation, and contrast ratio checking.',
    h1: 'Color Code Converter',
    text: 'Convert between HEX, RGB, HSL, HSV, and CMYK. Enter a color in any format to see all formats in real time.',
    lang: 'en',
  },
  {
    path: '/ja/palette',
    title: '配色ジェネレーター｜カラー変換ツール',
    description: 'ベースカラーから補色・類似色・トライアド・テトラードなど6種類の配色パターンを自動生成。CSS変数としてコピーも可能。',
    h1: '配色ジェネレーター',
    text: 'ベースカラーから6種類の配色パターンを自動生成します。',
    lang: 'ja',
  },
  {
    path: '/en/palette',
    title: 'Palette Generator | Color Converter',
    description: 'Automatically generate 6 types of color palettes from a base color. Copy as CSS variables.',
    h1: 'Palette Generator',
    text: 'Automatically generate 6 types of color palettes from a base color.',
    lang: 'en',
  },
  {
    path: '/ja/gradient',
    title: 'グラデーション生成｜カラー変換ツール',
    description: '2色以上からCSSグラデーションを生成。線形・放射状に対応し、linear-gradient()コードをそのままコピーできます。',
    h1: 'グラデーション生成',
    text: '開始色と終了色からグラデーションを生成し、CSSコードをコピーできます。',
    lang: 'ja',
  },
  {
    path: '/en/gradient',
    title: 'Gradient Generator | Color Converter',
    description: 'Generate CSS gradients from two or more colors. Supports linear and radial gradients.',
    h1: 'Gradient Generator',
    text: 'Generate gradients from start and end colors and copy the CSS code.',
    lang: 'en',
  },
  {
    path: '/ja/contrast',
    title: 'コントラスト比チェッカー｜カラー変換ツール',
    description: 'テキスト色と背景色のコントラスト比をWCAG 2.1基準で判定。AA/AAAレベルの合否を表示し、合格色の提案も。',
    h1: 'コントラスト比チェッカー',
    text: '前景色と背景色のコントラスト比をWCAG 2.1基準で判定します。',
    lang: 'ja',
  },
  {
    path: '/en/contrast',
    title: 'Contrast Ratio Checker | Color Converter',
    description: 'Check the contrast ratio between text and background colors against WCAG 2.1 standards.',
    h1: 'Contrast Ratio Checker',
    text: 'Check the contrast ratio between foreground and background colors against WCAG 2.1 standards.',
    lang: 'en',
  },
  {
    path: '/ja/about',
    title: '概要・免責事項｜カラー変換ツール',
    description: 'カラー変換ツールの概要、免責事項、お問い合わせ先について。',
    h1: '概要・免責事項',
    text: 'カラー変換ツールは、色コードの相互変換と配色生成をブラウザ上で完結させる無料ツールです。',
    lang: 'ja',
  },
  {
    path: '/en/about',
    title: 'About & Disclaimer | Color Converter',
    description: 'About the Color Converter tool, disclaimer, and contact information.',
    h1: 'About & Disclaimer',
    text: 'Color Converter is a free tool that handles color code conversion and palette generation entirely in your browser.',
    lang: 'en',
  },
]

for (const route of routes) {
  const altLang = route.lang === 'ja' ? 'en' : 'ja'
  const altPath = route.path.replace(`/${route.lang}`, `/${altLang}`)

  const seoBlock = `
    <noscript>
      <h1>${route.h1}</h1>
      <p>${route.text}</p>
    </noscript>`

  const metaTags = `
    <title>${route.title}</title>
    <meta name="description" content="${route.description}" />
    <link rel="canonical" href="${BASE_URL}${route.path}" />
    <link rel="alternate" hreflang="${route.lang}" href="${BASE_URL}${route.path}" />
    <link rel="alternate" hreflang="${altLang}" href="${BASE_URL}${altPath}" />
    <link rel="alternate" hreflang="x-default" href="${BASE_URL}${route.path.replace(`/${route.lang}`, '/ja')}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:url" content="${BASE_URL}${route.path}" />`

  let html = template
    .replace(/<html lang="ja"[^>]*>/, `<html lang="${route.lang}">`)
    .replace(/<title>[^<]*<\/title>/, metaTags)
    .replace('</body>', `${seoBlock}\n  </body>`)

  // ディレクトリ作成 & ファイル書き込み
  const filePath = route.path.endsWith('/')
    ? join(DIST, route.path, 'index.html')
    : join(DIST, route.path, 'index.html')

  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, html, 'utf-8')
  console.log(`Prerendered: ${route.path}`)
}

console.log(`\nPrerendered ${routes.length} routes`)
