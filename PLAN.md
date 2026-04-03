# PLAN.md — color-conv

## Phase 1（初期リリース）

### Step 1: プロジェクト基盤
- Vite + React 19 + TypeScript セットアップ
- React Router、ESLint、Vitest 設定
- Layout（ヘッダー/ナビ/フッター）
- 共通コンポーネント（コピーボタン、カラープレビュー）
- usePersistedState フック
- public/_headers, _redirects, robots.txt

### Step 2: 色変換エンジン（`src/calc/`）
- RGB <-> HEX
- RGB <-> HSL
- RGB <-> HSV
- RGB -> CMYK
- RGB -> Lab（XYZ経由）
- CIEDE2000 距離計算
- コントラスト比計算（WCAG 2.1）
- 全変換関数のユニットテスト

### Step 3: カラーコード変換ページ（`/`）
- 全形式入力フォーム（連動）
- ネイティブカラーピッカー
- 色見本プレビュー
- コピーボタン群（値 + CSS表記）

### Step 4: 配色ジェネレーター（`/palette`）
- ベースカラー入力（URLパラメータ対応）
- 6パターンのタブ切り替え
- CSS変数一括コピー

### Step 5: グラデーション生成（`/gradient`）
- 2色 + 中間色追加
- 方向設定（線形/放射状）
- ステップ数設定
- CSSコードコピー

### Step 6: コントラスト比チェッカー（`/contrast`）
- 前景色/背景色入力
- WCAG判定表示
- テキストプレビュー
- 合格色の提案

### Step 7: SEO・収益化・公開準備
- 各ページのメタタグ・OGP
- JSON-LD構造化データ
- AdSense埋め込み
- アフィリエイト導線（Canva、Adobe等をA8.netで検討）
- sitemap.xml
- GA4設定
- GitHubリポジトリ作成・Cloudflare Pages連携

## Phase 2
- 色覚シミュレーション（`/vision`）
- 和色・慣用色名辞典（`/colors`）
- 独自カラーピッカー（色相環 + SV パネル）

## 現在のフェーズ
**Phase 1 — Step 7: 公開準備**
