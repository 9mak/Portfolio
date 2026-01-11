# 🚀 System Development Projects

システム開発・Webアプリケーション開発のポートフォリオプロジェクト集です。

## 📁 プロジェクト一覧

### 1. 🍅 [app-pomodoro-timer](./app-pomodoro-timer/)
PWA対応のポモドーロタイマー

**技術スタック**: PWA, Service Worker, Notification API, Web Audio API
**特徴**: オフライン動作、統計管理、カスタマイズ可能

### 2. 📋 [app-task-manager](./app-task-manager/)
タスク管理アプリケーション

**技術スタック**: Vanilla JavaScript, LocalStorage
**特徴**: 優先度管理、フィルタ機能、進捗可視化

### 3. 🖼️ [tool-image-optimizer](./tool-image-optimizer/)
画像最適化ツール

**技術スタック**: HTML5 Canvas API, File API, Blob API
**特徴**: WebP変換、リサイズ、バッチ処理、完全クライアントサイド

### 4. ✍️ [ai-writing-assistant](./ai-writing-assistant/)
AI文章作成アシスタント

**技術スタック**: OpenAI API, Fetch API
**特徴**: 複数テンプレート、カスタマイズ、履歴管理

### 5. ⛅ [api-weather-dashboard](./api-weather-dashboard/)
天気情報ダッシュボード

**技術スタック**: OpenWeatherMap API, Geolocation API
**特徴**: リアルタイム情報、5日間予報、お気に入り機能

## 🎯 カテゴリー別分類

### Webアプリケーション (`app-`)
- **app-task-manager**: タスク管理
- **app-pomodoro-timer**: 時間管理（PWA）

### 開発ツール (`tool-`)
- **tool-image-optimizer**: 画像最適化

### AI連携 (`ai-`)
- **ai-writing-assistant**: AI文章作成

### API統合 (`api-`)
- **api-weather-dashboard**: 天気情報API

## 💡 技術的ハイライト

### フロントエンド技術
- **Modern JavaScript (ES6+)**: クラス構文、アロー関数、async/await
- **PWA実装**: Service Worker、Web App Manifest
- **レスポンシブデザイン**: モバイルファーストデザイン
- **LocalStorage活用**: データ永続化

### API統合
- **RESTful API**: OpenAI、OpenWeatherMap
- **非同期処理**: Fetch API、Promise
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
- OpenAI GPT-3.5 / GPT-4
- OpenWeatherMap API
- Browser APIs (Canvas, Notification, Geolocation, etc.)

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
| app-task-manager | 4 | JavaScript, LocalStorage | ⭐⭐ |
| tool-image-optimizer | 4 | Canvas API, File API | ⭐⭐⭐ |
| ai-writing-assistant | 4 | OpenAI API | ⭐⭐⭐ |
| api-weather-dashboard | 4 | REST API | ⭐⭐ |
| app-pomodoro-timer | 6 | PWA, Service Worker | ⭐⭐⭐⭐ |

## 🎨 デザイン原則

### UI/UX
- **シンプルで直感的**: ユーザーフレンドリーなインターフェース
- **一貫性**: 全プロジェクトで統一されたデザイン言語
- **アクセシビリティ**: 読みやすいフォント、適切なコントラスト

### カラーパレット
各プロジェクトで異なるテーマカラーを採用：
- Task Manager: Indigo (`#4f46e5`)
- Image Optimizer: Purple (`#8b5cf6`)
- AI Writing: Cyan (`#06b6d4`)
- Weather Dashboard: Blue (`#3b82f6`)
- Pomodoro Timer: Red (`#ef4444`)

## 🚀 セットアップ方法

### 基本的な使い方

1. 各プロジェクトのディレクトリに移動
2. `index.html` をブラウザで開く
3. すぐに使用開始！

### APIキーが必要なプロジェクト

#### ai-writing-assistant
1. [OpenAI Platform](https://platform.openai.com/api-keys) でAPIキーを取得
2. アプリ内でAPIキーを設定

#### api-weather-dashboard
1. [OpenWeatherMap](https://openweathermap.org/api) でAPIキーを取得
2. `app.js` の `apiKey` を変更

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
