/**
 * OGP画像生成スクリプト
 * 1200x630px の PNG を public/ogp.png に出力
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '..', 'public', 'ogp.png')

const WIDTH = 1200
const HEIGHT = 630

// カラーパレット（サイトのプライマリカラー#5B5FC7ベース）
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5B5FC7"/>
      <stop offset="100%" stop-color="#4347A0"/>
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- 装飾：カラフルな円（色変換ツールらしさ） -->
  <circle cx="150" cy="180" r="80" fill="#FF5733" opacity="0.25"/>
  <circle cx="220" cy="240" r="80" fill="#33FF57" opacity="0.2"/>
  <circle cx="185" cy="300" r="80" fill="#3357FF" opacity="0.2"/>

  <circle cx="1050" cy="350" r="60" fill="#FFD700" opacity="0.2"/>
  <circle cx="1100" cy="400" r="60" fill="#FF69B4" opacity="0.2"/>
  <circle cx="1020" cy="420" r="60" fill="#00CED1" opacity="0.15"/>

  <!-- 装飾：色相環のイメージ -->
  <g transform="translate(600, 160)" opacity="0.12">
    ${Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30) * Math.PI / 180
      const x = Math.cos(angle) * 100
      const y = Math.sin(angle) * 100
      const hue = i * 30
      return `<circle cx="${x}" cy="${y}" r="18" fill="hsl(${hue}, 80%, 60%)"/>`
    }).join('\n    ')}
  </g>

  <!-- メインタイトル -->
  <text x="${WIDTH / 2}" y="330" text-anchor="middle"
        font-family="'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif"
        font-size="72" font-weight="bold" fill="#ffffff"
        letter-spacing="6">カラー変換ツール</text>

  <!-- アクセントライン -->
  <rect x="${WIDTH / 2 - 60}" y="360" width="120" height="4" rx="2" fill="#FFD700"/>

  <!-- サブタイトル -->
  <text x="${WIDTH / 2}" y="420" text-anchor="middle"
        font-family="'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif"
        font-size="26" fill="#ffffff" opacity="0.9">HEX・RGB・HSL・CMYK相互変換 &amp; 配色生成</text>

  <!-- 機能一覧 -->
  <g transform="translate(0, ${HEIGHT - 100})">
    <rect x="0" y="0" width="${WIDTH}" height="100" fill="#000000" opacity="0.15"/>
    <text x="${WIDTH / 2}" y="40" text-anchor="middle"
          font-family="'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif"
          font-size="20" fill="#ffffff" opacity="0.8">変換 ・ 配色 ・ グラデーション ・ コントラスト比チェック</text>
    <text x="${WIDTH / 2}" y="72" text-anchor="middle"
          font-family="'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif"
          font-size="16" fill="#ffffff" opacity="0.5">color-conv.pages.dev</text>
  </g>
</svg>
`

const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer()
await sharp(pngBuffer).toFile(OUTPUT_PATH)

console.log(`OGP image generated: ${OUTPUT_PATH}`)
