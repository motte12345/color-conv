# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

カラー変換ツール — 色コードの相互変換・配色生成・グラデーション作成・コントラスト比チェックをブラウザで完結させる静的Webツール。
収益モデル: AdSense + デザインツール系アフィリエイト（Canva、Adobe等）+ A8.net。
メンテナンスフリー（色の計算は数学的に確定している）。

本番URL: https://color-conv.pages.dev/
GitHub: https://github.com/motte12345/color-conv

## コマンド

```bash
npm run dev        # 開発サーバー起動（Vite）
npm run build      # TypeScript型チェック + Viteビルド + プリレンダリング
npm run lint       # ESLint
npm run typecheck  # TypeScript型チェックのみ
npm test           # Vitest全テスト実行
npm run test:watch # Vitestウォッチモード
npm run preview    # ビルド結果プレビュー
npm run generate:ogp  # OGP画像生成
```

## 技術スタック

- React 19 + TypeScript + Vite 8
- React Router DOM（SPA、lazy loading）
- react-helmet-async（ページ別メタタグ）
- Vitest + Testing Library（テスト）
- 自前i18n（React Context + 翻訳JSON、ライブラリ不使用）
- プリレンダリング（ビルド後に静的HTML生成、scripts/prerender.mjs）
- ダークモード対応（prefers-color-scheme）
- デプロイ: Cloudflare Pages（GitHub連携、main push時に自動デプロイ）

## アーキテクチャ

```
src/
  calc/           # 色変換エンジン（純粋関数、UIに依存しない）
  components/     # 共通UIコンポーネント（Layout, PageHead, CopyButton等）
  i18n/           # 多言語対応（types, ja, en, context, hooks）
  pages/          # ページコンポーネント（ルート単位）
  hooks/          # カスタムフック（usePersistedState等）
  styles/         # グローバルCSS（ダークモード含む）
public/           # 静的ファイル（_headers, _redirects, robots.txt, sitemap.xml）
scripts/          # ビルドスクリプト（OGP生成、プリレンダリング）
```

### 計算エンジン（`src/calc/`）
UIから完全に独立した純粋関数群。全ての色変換・色差計算ロジックがここにある。
- 色空間変換: RGB <-> HEX, HSL, HSV, CMYK, Lab（XYZ経由）
- 色差計算: CIEDE2000（最近接色判定用）
- コントラスト比: WCAG 2.1準拠の相対輝度計算
- 配色生成: HSLベースの色相回転（roleKeyは言語非依存キー）
- アクセシブル色提案: 明度調整でWCAG AA基準を満たす色を探索
- 全関数にユニットテスト必須（68テスト）

### i18n（`src/i18n/`）
- 対応言語: 日本語（ja）、英語（en）
- URL構造: `/:lang/` プレフィックス（`/ja/palette`, `/en/palette`等）
- `/` → `/ja/` にリダイレクト
- 翻訳は`ja.ts`/`en.ts`にTypescript型付きオブジェクトとして定義
- `useLang()` で現在の言語、`useT()` で翻訳オブジェクトを取得
- `langPath(lang, '/path')` でリンクパスを生成

### ツール間の色引き継ぎ
URLクエリパラメータで実現（例: `/:lang/palette?base=FF5733`）。
localStorageでも直近の色を保持（`color-conv:lastColor`）。

### 状態永続化
`usePersistedState` フックでlocalStorageに保存。
キー命名: `color-conv:{page}:{field}`

### プリレンダリング
`scripts/prerender.mjs` がビルド後に10ルート分の静的HTMLを生成。
各HTMLにはメタタグ（title, description, canonical, hreflang）とnoscriptテキストを注入。
Cloudflare Pagesは静的ファイルを`_redirects`より優先するため、botに適切なHTMLが配信される。

## ページ構成

| パス | 内容 | Phase |
|---|---|---|
| `/:lang/` | カラーコード変換（メインツール） | 1 ✅ |
| `/:lang/palette` | 配色ジェネレーター | 1 ✅ |
| `/:lang/gradient` | グラデーション生成 | 1 ✅ |
| `/:lang/contrast` | コントラスト比チェッカー | 1 ✅ |
| `/:lang/about` | 概要・免責 | 1 ✅ |
| `/:lang/vision` | 色覚シミュレーション | 2 |
| `/:lang/colors` | 和色・慣用色名辞典 | 2 |

## 免責事項（全ページに表示）

- CMYKはICCプロファイル非考慮の概算
- モニター表示特性により実際の色は環境依存
