# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

カラー変換ツール — 色コードの相互変換・配色生成・グラデーション作成・コントラスト比チェックをブラウザで完結させる静的Webツール。
収益モデル: AdSense + デザインツール系アフィリエイト（Canva、Adobe等）+ A8.net。
メンテナンスフリー（色の計算は数学的に確定している）。

本番URL: https://color-conv.pages.dev/（予定）

## コマンド

```bash
npm run dev        # 開発サーバー起動（Vite）
npm run build      # TypeScript型チェック + Viteビルド
npm run lint       # ESLint
npm run typecheck  # TypeScript型チェックのみ
npm test           # Vitest全テスト実行
npm run test:watch # Vitestウォッチモード
npm run preview    # ビルド結果プレビュー
```

## 技術スタック

- React 19 + TypeScript + Vite 8
- React Router DOM（SPA、lazy loading）
- react-helmet-async（ページ別メタタグ）
- Vitest + Testing Library（テスト）
- デプロイ: Cloudflare Pages（GitHub連携）

## アーキテクチャ

```
src/
  calc/           # 色変換エンジン（純粋関数、UIに依存しない）
  components/     # 共通UIコンポーネント
  pages/          # ページコンポーネント（ルート単位）
  hooks/          # カスタムフック（usePersistedState等）
  styles/         # グローバルCSS
public/           # 静的ファイル（_headers, _redirects, robots.txt）
```

### 計算エンジン（`src/calc/`）
UIから完全に独立した純粋関数群。全ての色変換・色差計算ロジックがここにある。
- 色空間変換: RGB <-> HEX, HSL, HSV, CMYK, Lab（XYZ経由）
- 色差計算: CIEDE2000（最近接色判定用）
- コントラスト比: WCAG 2.1準拠の相対輝度計算
- 配色生成: HSLベースの色相回転
- 全関数にユニットテスト必須

### ツール間の色引き継ぎ
URLクエリパラメータで実現（例: `/palette?base=FF5733`）。
localStorageでも直近の色を保持（`color-conv:lastColor`）。

### 状態永続化
`usePersistedState` フックでlocalStorageに保存。
キー命名: `color-conv:{page}:{field}`

## ページ構成

| パス | 内容 | Phase |
|---|---|---|
| `/` | カラーコード変換（メインツール） | 1 |
| `/palette` | 配色ジェネレーター | 1 |
| `/gradient` | グラデーション生成 | 1 |
| `/contrast` | コントラスト比チェッカー | 1 |
| `/vision` | 色覚シミュレーション | 2 |
| `/colors` | 和色・慣用色名辞典 | 2 |
| `/about` | 概要・免責 | 1 |

## 免責事項（全ページに表示）

- CMYKはICCプロファイル非考慮の概算
- モニター表示特性により実際の色は環境依存
