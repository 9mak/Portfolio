# 🚀 System Development Projects

システム開発・Webアプリケーション開発のポートフォリオプロジェクト集です。

## 📁 プロジェクト一覧

### Webアプリケーション (app-)

#### 1. 🍅 [app-pomodoro-timer](./app-pomodoro-timer/)
PWA対応のポモドーロタイマー

**技術スタック**: PWA, Service Worker, Notification API, Web Audio API
**特徴**: オフライン動作、統計管理、カスタマイズ可能

#### 2. 📋 [app-task-manager](./app-task-manager/)
タスク管理アプリケーション

**技術スタック**: Vanilla JavaScript, LocalStorage
**特徴**: 優先度管理、フィルタ機能、進捗可視化

#### 3. 💰 [app-expense-tracker](./app-expense-tracker/)
家計簿・支出管理アプリ

**技術スタック**: Chart.js, IndexedDB, LocalStorage
**特徴**: カテゴリ別集計、グラフ表示、予算管理、CSV/JSONエクスポート

### 業務自動化ツール (tool-)

#### 4. 🖼️ [tool-image-optimizer](./tool-image-optimizer/)
画像最適化ツール

**技術スタック**: HTML5 Canvas API, File API, Blob API
**特徴**: WebP変換、リサイズ、バッチ処理、完全クライアントサイド

#### 5. 📊 [tool-csv-processor](./tool-csv-processor/)
CSV変換・集計ツール

**技術スタック**: Papa Parse, File API, Encoding.js
**特徴**: CSV/TSV/JSON変換、フィルタリング、集計、エンコーディング対応

#### 6. 🔗 [tool-url-shortener](./tool-url-shortener/)
URL短縮サービス（ローカル版）

**技術スタック**: QRCode.js, LocalStorage
**特徴**: カスタムエイリアス、QRコード生成、クリック数カウント、タグ管理

### AI/機械学習連携 (ai-)

#### 7. ✍️ [ai-writing-assistant](./ai-writing-assistant/)
AI文章作成アシスタント

**技術スタック**: Vanilla JavaScript, Demo Logic
**特徴**: 複数テンプレート、カスタマイズ、APIキー不要のデモ生成

#### 8. 📝 [ai-text-analyzer](./ai-text-analyzer/)
テキスト分析・インサイトツール

**技術スタック**: Vanilla JavaScript, Text Analysis Demo
**特徴**: 感情分析、キーワード抽出、可読性評価、改善提案

#### 9. 😂 [ai-photo-comedian](./ai-photo-comedian/)
写真で一言ジェネレーター（IPPONグランプリ風）

**技術スタック**: Vanilla JavaScript, Image UI Demo
**特徴**: サンプルキャプション生成、スタイル選択、いいね機能、一時ギャラリー

### 外部API統合 (api-)

#### 10. ⛅ [api-weather-dashboard](./api-weather-dashboard/)
天気情報ダッシュボード

**技術スタック**: OpenWeatherMap API, Geolocation API
**特徴**: リアルタイム情報、5日間予報、お気に入り機能

#### 11. 📰 [api-news-aggregator](./api-news-aggregator/)
ニュース集約ダッシュボード

**技術スタック**: Vanilla JavaScript, LocalStorage
**特徴**: サンプルニュース表示、カテゴリ別表示、ブックマーク、既読管理

#### 12. 🐙 [api-github-profile](./api-github-profile/)
GitHub統計ビューアー

**技術スタック**: GitHub REST API, Chart.js
**特徴**: ユーザー統計、リポジトリ一覧、言語統計、レスポンシブデザイン

## 🎯 カテゴリー別分類

### Webアプリケーション (`app-`)
Webアプリケーション、PWA（Progressive Web Apps）
- **app-pomodoro-timer**: 時間管理（PWA）
- **app-task-manager**: タスク管理
- **app-expense-tracker**: 家計簿・支出管理

### 業務自動化ツール (`tool-`)
業務効率化スクリプト、開発支援ツール、GAS連携
- **tool-image-optimizer**: 画像最適化
- **tool-csv-processor**: CSV変換・集計
- **tool-url-shortener**: URL短縮サービス

### AI/機械学習連携 (`ai-`)
AI連携を想定したUIデモ（公開版はAPIキー不要）
- **ai-writing-assistant**: AI文章作成
- **ai-text-analyzer**: テキスト分析・インサイトツール
- **ai-photo-comedian**: 写真で一言ジェネレーター

### 外部API統合 (`api-`)
バックエンドAPI、外部サービス連携
- **api-weather-dashboard**: 天気情報API
- **api-news-aggregator**: ニュース集約ダッシュボード
- **api-github-profile**: GitHub統計ビューアー

## 💡 技術的ハイライト

### フロントエンド技術
- **Modern JavaScript (ES6+)**: クラス構文、アロー関数、async/await
- **PWA実装**: Service Worker、Web App Manifest
- **レスポンシブデザイン**: モバイルファーストデザイン
- **LocalStorage活用**: データ永続化

### API統合
- **公開API利用**: GitHub公開API
- **デモモード**: 外部キー不要のサンプルデータ表示
- **エラーハンドリング**: 適切なエラー処理

### ブラウザAPI
- **Canvas API**: 画像処理
- **Notification API**: デスクトップ通知
- **Geolocation API**: 位置情報
- **Web Audio API**: サウンド生成

## 🛠 使用技術まとめ

### 言語・マークアップ
- HTML5
- CSS3 (Grid, Flexbox, CSS Variables)
- JavaScript (ES6+)

### API・サービス
- GitHub API
- Browser APIs (Canvas, Notification, Geolocation, etc.)
- APIキー不要の公開デモ設計

### PWA技術
- Service Worker
- Web App Manifest
- Cache API

### データ管理
- LocalStorage
- Session Management
- State Management

## 📊 プロジェクト統計

| プロジェクト | ファイル数 | 主要技術 | 難易度 |
|------------|----------|---------|--------|
| app-pomodoro-timer | 6 | PWA, Service Worker | ⭐⭐⭐⭐ |
| app-task-manager | 4 | JavaScript, LocalStorage | ⭐⭐ |
| app-expense-tracker | 4 | Chart.js, IndexedDB | ⭐⭐⭐ |
| tool-image-optimizer | 4 | Canvas API, File API | ⭐⭐⭐ |
| tool-csv-processor | 4 | Papa Parse, File API | ⭐⭐⭐ |
| tool-url-shortener | 4 | QRCode.js, LocalStorage | ⭐⭐ |
| ai-writing-assistant | 4 | Demo Logic | ⭐⭐⭐ |
| ai-text-analyzer | 4 | Text Analysis Demo | ⭐⭐⭐ |
| ai-photo-comedian | 4 | Image UI Demo | ⭐⭐⭐⭐ |
| api-weather-dashboard | 4 | REST API | ⭐⭐ |
| api-news-aggregator | 4 | Sample Data, LocalStorage | ⭐⭐ |
| api-github-profile | 4 | GitHub API, Chart.js | ⭐⭐⭐ |

## 🎨 デザイン原則

### UI/UX
- **シンプルで直感的**: ユーザーフレンドリーなインターフェース
- **一貫性**: 全プロジェクトで統一されたデザイン言語
- **アクセシビリティ**: 読みやすいフォント、適切なコントラスト

### カラーパレット
各プロジェクトで異なるテーマカラーを採用：
- **app-pomodoro-timer**: Red (`#ef4444`)
- **app-task-manager**: Indigo (`#4f46e5`)
- **app-expense-tracker**: Indigo (`#4f46e5`)
- **tool-image-optimizer**: Purple (`#8b5cf6`)
- **tool-csv-processor**: Purple (`#8b5cf6`)
- **tool-url-shortener**: Blue (`#3b82f6`)
- **ai-writing-assistant**: Cyan (`#06b6d4`)
- **ai-text-analyzer**: Cyan (`#06b6d4`)
- **ai-photo-comedian**: Orange (`#f59e0b`)
- **api-weather-dashboard**: Blue (`#3b82f6`)
- **api-news-aggregator**: Blue (`#3b82f6`)
- **api-github-profile**: Green (`#238636`)

## 🚀 セットアップ方法

### 基本的な使い方

1. 各プロジェクトのディレクトリに移動
2. `index.html` をブラウザで開く
3. すぐに使用開始！

### 公開デモのセキュリティ方針

- 公開版ではAI/APIキーを入力させない
- APIキーをHTML/JavaScript/READMEに埋め込まない
- 実API接続が必要な場合はサーバー側にキーを置く
- 入力内容やアップロード画像を不要に永続保存しない

## 📱 対応環境

### ブラウザ
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### デバイス
- デスクトップ（Windows, macOS, Linux）
- タブレット（iPad, Android Tablet）
- スマートフォン（iPhone, Android）

## 🌟 実装の特徴

### コード品質
- **クリーンコード**: 読みやすく保守しやすい
- **ES6+構文**: モダンなJavaScript
- **エラーハンドリング**: 適切な例外処理
- **セキュリティ**: XSS対策、入力検証

### パフォーマンス
- **軽量**: 外部ライブラリ不使用（一部を除く）
- **高速**: 最適化されたコード
- **レスポンシブ**: 遅延なし

### ユーザビリティ
- **直感的操作**: 説明不要のUI
- **フィードバック**: 適切な通知・メッセージ
- **データ永続化**: 設定・履歴の保存

## 📚 学習リソース

各プロジェクトのREADMEには以下が含まれます：
- 詳細な機能説明
- 使い方ガイド
- 技術仕様
- カスタマイズ方法
- トラブルシューティング

## 🔄 今後の展開

### 短期（1-3ヶ月）
- [ ] テストコードの追加
- [ ] TypeScript化
- [ ] パフォーマンス最適化

### 中期（3-6ヶ月）
- [ ] バックエンド統合（Node.js + Express）
- [ ] データベース連携（MongoDB, PostgreSQL）
- [ ] 認証機能追加

### 長期（6ヶ月以上）
- [ ] モバイルアプリ化（React Native）
- [ ] クラウドデプロイ（AWS, Vercel）
- [ ] チーム機能・同期機能

## 📄 ライセンス

各プロジェクトはMIT Licenseの下で公開されています。

## 👤 作成者

Portfolio Project Collection
System Development Category

---

**実績作りと技術力向上のために作成したポートフォリオです 🚀**

各プロジェクトは実際に使用可能なアプリケーションとして設計されており、実務レベルの品質を目指しています。
