# ⛅ api-weather-dashboard

OpenWeatherMap APIを使用した天気ダッシュボードアプリケーションです。現在の天気情報と5日間の予報を美しいUIで表示します。

## ✨ 特徴

- **リアルタイム天気情報**: 現在の気温、湿度、風速などを表示
- **5日間予報**: 今後5日間の天気を確認
- **位置情報対応**: 現在地の天気を自動取得
- **お気に入り機能**: よく見る都市を保存
- **人気都市クイックアクセス**: 日本の主要都市をワンクリック
- **詳細情報**: 日の出・日の入り時刻、体感温度、雲量など
- **レスポンシブデザイン**: スマートフォン対応

## 🚀 使い方

### 初期設定

1. [OpenWeatherMap](https://openweathermap.org/api) でAPIキーを取得（無料プラン利用可）
2. `app.js` の `this.apiKey` を自分のAPIキーに変更

```javascript
this.apiKey = 'YOUR_API_KEY_HERE';
```

3. `index.html` をブラウザで開く

### 基本操作

1. **都市検索**
   - 検索ボックスに都市名を入力（英語または日本語）
   - 「検索」ボタンをクリック

2. **クイックアクセス**
   - 人気都市ボタンをクリックして即座に表示

3. **現在地の天気**
   - 「現在地」ボタンをクリック
   - 位置情報の使用を許可

4. **お気に入り登録**
   - 天気を表示後、「追加」ボタンでお気に入りに登録
   - お気に入りからワンクリックで表示

## 📊 表示情報

### 現在の天気
- 気温（°C）
- 天気の説明（晴れ、曇りなど）
- 湿度（%）
- 風速（m/s）
- 体感温度（°C）
- 雲量（%）
- 日の出・日の入り時刻

### 5日間予報
- 日付
- 予想気温
- 天気アイコン
- 天気の説明

## 🛠 技術スタック

- **OpenWeatherMap API**: 天気データ取得
  - Current Weather Data API
  - 5 Day / 3 Hour Forecast API
- **Geolocation API**: 位置情報取得
- **LocalStorage**: お気に入り保存
- **Vanilla JavaScript**: ES6+

## 🌐 API仕様

### エンドポイント

```javascript
// 現在の天気
GET https://api.openweathermap.org/data/2.5/weather
  ?q={city}
  &appid={API_KEY}
  &units=metric
  &lang=ja

// 5日間予報
GET https://api.openweathermap.org/data/2.5/forecast
  ?q={city}
  &appid={API_KEY}
  &units=metric
  &lang=ja

// 座標指定
GET https://api.openweathermap.org/data/2.5/weather
  ?lat={lat}
  &lon={lon}
  &appid={API_KEY}
  &units=metric
  &lang=ja
```

### パラメータ
- `units=metric`: 摂氏温度、m/s
- `lang=ja`: 日本語表示

## 💰 料金

### 無料プラン
- 1分あたり60コール
- 1日あたり1,000,000コール
- 現在の天気＆5日間予報

### 有料プラン
- より高頻度のリクエスト
- 16日間予報
- 過去の天気データ
- 詳細は [OpenWeatherMap Pricing](https://openweathermap.org/price)

## 🎨 カスタマイズ

### 人気都市の変更

`index.html` の人気都市ボタンを編集：

```html
<button class="city-btn" data-city="YourCity">都市名</button>
```

### 色のカスタマイズ

`style.css` の `:root` セクション：

```css
:root {
    --primary-color: #3b82f6;
    --success-color: #10b981;
}
```

### 温度単位の変更

華氏（°F）に変更する場合、`app.js` で：

```javascript
// units=metric を units=imperial に変更
const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=imperial&lang=ja`;
```

## 📱 対応ブラウザ

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔧 トラブルシューティング

### APIエラー
- APIキーが正しいか確認
- 無料プランの制限を超えていないか確認
- ネットワーク接続を確認

### 位置情報が取得できない
- ブラウザで位置情報の使用を許可
- HTTPS環境で動作させる（ローカルはHTTPでも可）

### 都市が見つからない
- 英語名で検索（例: Tokyo, Osaka）
- スペルが正しいか確認

## 📝 今後の拡張案

- [ ] 時間ごとの詳細予報
- [ ] 天気マップ表示
- [ ] 降水確率の表示
- [ ] 大気汚染指数（AQI）
- [ ] UV指数
- [ ] 複数都市の比較
- [ ] グラフによる可視化
- [ ] 通知機能（雨予報など）
- [ ] 多言語対応

## 🌍 サポートされる都市

OpenWeatherMapは世界20万都市以上の天気データに対応：
- 日本の全都道府県・主要都市
- 世界各国の都市
- 座標指定で任意の場所

## 📚 参考リンク

- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [Weather Icons](https://openweathermap.org/weather-conditions)
- [API Response Examples](https://openweathermap.org/current)

## 📄 ライセンス

MIT License

## ⚠️ 注意事項

- APIキーは公開しないでください
- レート制限に注意してください
- 無料プランは商用利用に制限がある場合があります
- OpenWeatherMapの利用規約を確認してください

## 👤 作成者

Portfolio Project - System Development
