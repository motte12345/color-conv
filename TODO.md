# TODO.md — color-conv

## Phase 1

### Step 1: プロジェクト基盤
- [x] Vite + React 19 + TypeScript プロジェクト作成
- [x] React Router 設定
- [x] ESLint 設定
- [x] Vitest 設定
- [x] Layout コンポーネント（ヘッダー/ナビ/フッター）
- [x] 共通コンポーネント（CopyButton, ColorPreview）
- [x] usePersistedState フック
- [x] public/_headers, _redirects, robots.txt 配置

### Step 2: 色変換エンジン
- [x] RGB <-> HEX 変換
- [x] RGB <-> HSL 変換
- [x] RGB <-> HSV 変換
- [x] RGB -> CMYK 変換
- [x] RGB -> XYZ -> Lab 変換
- [x] CIEDE2000 距離計算
- [x] コントラスト比計算（WCAG 2.1）
- [x] 全変換関数のユニットテスト

### Step 3: カラーコード変換ページ（/）
- [x] 全形式入力フォーム（連動）
- [x] ネイティブカラーピッカー
- [x] 色見本プレビュー
- [x] コピーボタン群（値 + CSS表記）
- [x] SEO（メタタグ、JSON-LD）

### Step 4: 配色ジェネレーター（/palette）
- [x] ベースカラー入力（URLパラメータ対応）
- [x] 補色・類似色・トライアド・スプリットコンプリメンタリー・テトラード・モノクロマティック
- [x] CSS変数一括コピー
- [x] SEO

### Step 5: グラデーション生成（/gradient）
- [x] 2色 + 中間色追加
- [x] 方向設定（線形/放射状）
- [x] ステップ数設定
- [x] CSSコードコピー
- [x] SEO

### Step 6: コントラスト比チェッカー（/contrast）
- [x] 前景色/背景色入力
- [x] WCAG判定表示
- [x] テキストプレビュー
- [x] 合格色の提案
- [x] SEO

### Step 7: 公開準備
- [x] OGP画像生成
- [x] AdSense埋め込み（index.htmlに設定済み）
- [ ] アフィリエイト導線（A8.netで案件選定後）
- [x] sitemap.xml
- [x] GA4設定（G-PFRY4H8ERY）
- [x] GitHubリポジトリ作成（https://github.com/motte12345/color-conv）
- [x] Cloudflare Pages連携（https://color-conv.pages.dev/）
- [x] ルートの CLAUDE.md, PLAN.md, SHARED_CONFIG.md 更新

### i18n対応
- [x] 自前の軽量i18n（React Context + 翻訳JSON）
- [x] /ja/ と /en/ のURLプレフィックス
- [x] 全5ページの英語翻訳
- [x] ヘッダーにJA/EN切替
- [x] hreflangタグ + sitemap二言語化
- [x] 旧パスの301リダイレクト

### 追加改善（Phase 1.5）
- [x] Suspense位置修正（Layout外→Outlet内）
- [x] h1二重問題修正（Layoutのh1をdivに）
- [x] ダークモード対応（prefers-color-scheme）
- [x] 入力エラーフィードバックUI
- [x] SSGプリレンダリング（10ルート静的HTML）

## Phase 2
- [ ] 色覚シミュレーション（/:lang/vision）
- [ ] 和色・慣用色名辞典（/:lang/colors）
- [ ] 独自カラーピッカー
- [ ] 独自ドメイン取得 → SHARED_CONFIG.md更新
- [ ] A8.netアフィリエイト導線（Canva Pro, Adobe CC）
- [ ] 各ページの解説テキスト充実（300-500字）
- [ ] モバイルUX改善（ピッカーサイズ、コピーボタン）
- [ ] CSS分割（global.css → ページ別）
