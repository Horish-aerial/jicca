# Jicca コーダー向け指示メモ

## 1. パララックス削除

`dist/js/script.js` の L223〜L260（`/* パララックス（PC のみ） */` ブロック）を削除する。

**対象要素：**
- `.p-value__item-image img` の yPercent アニメーション
- `.p-service__item-image img` の yPercent / scale アニメーション

**注意：**
- 削除後、`scale: 1.3` が残らないよう確認
- CSSで `overflow: hidden` がパララックス用にかかっている場合は不要なら合わせて外す
- Value / Service セクションの画像が正しいサイズで表示されるか確認

---

## 2. 慣性スクロール

Lenis は既に導入済み（`dist/js/script.js` L64〜L80）。
GSAP ScrollTrigger との連携も設定済み。

**確認ポイント：**
- 全ページで慣性スクロールが効いているか
- アンカーリンクのスムーススクロール（L264〜L279）が正常動作するか
- ハンバーガーメニュー開閉時にスクロールが干渉しないか

---

## 3. 画像パスの統一（相対パスに修正）

`index.html` 内の画像・アセットパスが **ルート相対パス（`/dist/...`）と相対パス（`dist/...`）で混在** しているため、全て**相対パスに統一**する。

### やること
先頭の `/` を除去して相対パスにする。

```
<!-- 修正前 -->
<img src="/dist/images/common/mv.jpg">
<link rel="icon" href="/dist/images/common/favicon.ico">
<video src="/dist/images/common/Jicca-movie.mp4">

<!-- 修正後 -->
<img src="dist/images/common/mv.jpg">
<link rel="icon" href="dist/images/common/favicon.ico">
<video src="dist/images/common/Jicca-movie.mp4">
```

### 対象箇所（`index.html`）
- `<link rel="icon" href="/dist/...">` → L32
- `<img src="/dist/images/...">` → ほぼ全画像（L46, L87〜L88, L161〜 等多数）
- `<video src="/dist/images/...">` → L136
- `<source srcset="/dist/images/...">` → picture要素内
- `<a href="/">` → ヘッダー・フッターのロゴリンク。サブディレクトリ配置なら要調整

### 既に相対パスになっている箇所（変更不要）
- L35: `dist/css/style.css`
- L162: `dist/images/common/value_01.jpg`

### 注意
- `<a href="/">` のロゴリンクは、本番のディレクトリ構成に合わせて判断すること
- 修正後、全セクションの画像・動画・favicon が正しく表示されるか確認

---

## 4. 使用ライブラリ（CDN読み込み済み）

| ライブラリ | 用途 |
|---|---|
| Lenis 1.1.18 | 慣性スクロール |
| GSAP 3 | アニメーション |
| ScrollTrigger | スクロール連動アニメーション |
| Swiper 11（コメントアウト中） | スライダー（未使用） |
