# MNDO MCP Server

マインドマップAIアシスタント用のMCP（Model Context Protocol）サーバーです。

## 🚀 機能

- OpenAI APIを使用したAIアシスタント機能
- マインドマップ構造の分析
- リアルタイム提案生成
- RESTful APIエンドポイント

## 📦 インストール

```bash
npm install
```

## ⚙️ 設定

1. `.env.example`を`.env`にコピー
```bash
cp .env.example .env
```

2. `.env`ファイルを編集してOpenAI APIキーを設定
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🏃‍♂️ 実行

### 開発モード
```bash
npm run dev
```

### 本番モード
```bash
npm start
```

## 📡 API エンドポイント

### ヘルスチェック
```
GET /health
```

### AIアシスタント
```
POST /api/ai-assistant
```

**リクエストボディ:**
```json
{
  "mindMapState": {
    "nodes": [...],
    "edges": [...],
    "userInput": "ユーザーの要求"
  },
  "apiKey": "openai_api_key"
}
```

**レスポンス:**
```json
{
  "success": true,
  "proposals": [...],
  "rawResponse": "AIの生応答",
  "analysis": {...}
}
```

## 🏗️ プロジェクト構造

```
server/
├── src/
│   ├── index.js          # メインサーバーファイル
│   └── aiProcessor.js    # AI処理モジュール
├── package.json
├── .env.example
└── README.md
```

## 🔧 開発

### 依存関係
- Express.js - Webサーバーフレームワーク
- OpenAI - AI API
- CORS - クロスオリジンリクエスト
- dotenv - 環境変数管理

### スクリプト
- `npm run dev` - 開発サーバー起動（nodemon）
- `npm start` - 本番サーバー起動
- `npm test` - テスト実行（未実装）

## 🌐 フロントエンド連携

フロントエンド（React）との連携:
- CORS設定済み（localhost:5173）
- JSON形式でのデータ交換
- エラーハンドリング対応

## 📝 ログ

サーバーは以下の情報をログ出力します:
- リクエスト受信
- AI処理結果
- エラー情報
- サーバー起動情報 