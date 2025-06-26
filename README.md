# MNDO - AI連携マインドマップエディタ

React + react-flow + GPTを使用したAI連携マインドマップエディタです。

## 🚀 機能

- **マインドマップ作成**: ドラッグ&ドロップでノード作成・編集
- **AIアシスタント**: OpenAI APIを使用したマインドマップ改善提案
- **複数選択**: Ctrl+クリックで複数ノード選択
- **キーボードショートカット**: Tabキーでサブノード生成、Deleteキーで削除
- **レイアウト切替**: 複数のレイアウトスタイル
- **カスタマイズ**: ノード色、エッジスタイルの変更
- **保存・読み込み**: マインドマップの保存・復元

## 📦 セットアップ

### 前提条件
- Node.js 18以上
- npm

### 環境変数の設定（重要！）

⚠️ **セキュリティ警告**: APIキーなどの機密情報は絶対にGitにコミットしないでください！

1. 環境変数テンプレートをコピー
```bash
cp .env.example .env
```

2. `.env`ファイルを編集してAPIキーを設定
```bash
# AI機能の設定
VITE_ENABLE_AI=true
VITE_ENABLE_MCP=true

# OpenAI API設定（必須）
VITE_OPENAI_API_KEY=your_actual_openai_api_key_here
VITE_OPENAI_MODEL=gpt-4

# MCP設定（必要に応じて）
VITE_MCP_SERVER_URL=your_mcp_server_url_here
```

3. `.env`ファイルが`.gitignore`に含まれていることを確認
```bash
cat .gitignore | grep .env
```

### クイックセットアップ（推奨）
```bash
git clone <repository-url>
cd mndo
./setup.sh
```

### セットアップオプション
```bash
# 通常のセットアップ
./setup.sh

# クリーンアップ後にセットアップ
./setup.sh --clean

# 開発環境のみセットアップ（MCPサーバーなし）
./setup.sh --dev

# ヘルプ表示
./setup.sh --help
```

### 手動セットアップ
```bash
git clone <repository-url>
cd mndo
npm install
cd server && npm install && cd ..
```

## 🏃‍♂️ 起動方法

### 簡単起動（推奨）
```bash
# 全機能で起動
./start.sh

# AI機能なしで起動
./start.sh --no-ai

# MCPサーバーなしで起動
./start.sh --no-mcp

# 基本機能のみで起動
./start.sh --no-ai --no-mcp

# クリーンアップ後に起動
./start.sh --clean

# ヘルプ表示
./start.sh --help
```

### 手動起動
```bash
# フロントエンドのみ
npm run dev

# MCPサーバー（別ターミナル）
cd server
npm run dev
```

### 停止
```bash
# 起動スクリプトで起動した場合
Ctrl+C

# または完全停止スクリプト
./stop.sh
```

## 🧹 クリーンアップ機能

### 完全停止（推奨）
```bash
./stop.sh
```
- すべてのプロセスを停止
- 環境変数をクリーンアップ
- 一時ファイルを削除
- ポートを解放

### 起動時のクリーンアップ
```bash
./start.sh --clean
```
- 既存プロセスを停止
- 環境をクリーンアップ
- 新しく起動

## 🤖 AI機能の設定

### OpenAI APIキーの取得
1. [OpenAI](https://platform.openai.com/)にアカウント作成
2. APIキーを取得（新規アカウントで$5の無料クレジット付与）

### 利用可能なモデル

#### 推奨モデル
- **GPT-4o Nano**: 最も高速で安価（推奨）
  - 入力: $0.15/1M tokens
  - 出力: $0.60/1M tokens

#### その他のモデル
- **GPT-4o Mini**: バランスの取れた性能
  - 入力: $0.15/1M tokens
  - 出力: $0.60/1M tokens
- **GPT-3.5 Turbo**: 安定した性能
  - 入力: $0.50/1M tokens
  - 出力: $1.50/1M tokens

#### 無料枠
- 新規アカウントで$5のクレジット（約3ヶ月分）
- GPT-4o Nanoなら約33M tokens使用可能

### モデル選択
1. MCPテストパネルでモデルを選択
2. 各モデルの特徴とコストを確認
3. 用途に応じて最適なモデルを選択

### APIキーの設定
```bash
# 方法1: 環境変数で設定
export OPENAI_API_KEY="your_api_key_here"

# 方法2: サーバーの.envファイルで設定
echo "OPENAI_API_KEY=your_api_key_here" >> server/.env

# 方法3: フロントエンドのパネルから直接入力
```

## 🎮 使用方法

### 基本操作
- **ノード追加**: ダブルクリックでテキスト編集
- **ノード移動**: ドラッグ&ドロップ
- **接続作成**: ノードのハンドルをドラッグ
- **複数選択**: Ctrl+クリック
- **ズーム**: マウスホイール

### キーボードショートカット
- **Tab**: 選択ノードにサブノード追加
- **Delete**: 選択ノード削除
- **Ctrl+A**: 全選択
- **Ctrl+S**: 保存

### AIアシスタント
1. 右側のAIアシスタントパネルを開く
2. APIキーを入力
3. 改善したい内容を入力
4. 「提案を生成」をクリック
5. AIの提案を確認・適用

## 🏗️ プロジェクト構造

```
mndo/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── MindMap.tsx     # メインコンポーネント
│   │   ├── CustomNode.tsx  # カスタムノード
│   │   ├── ControlPanel.tsx # コントロールパネル
│   │   ├── AiAssistant.tsx # AIアシスタント
│   │   └── McpTestPanel.tsx # MCPテストパネル
│   ├── hooks/              # カスタムフック
│   │   ├── useMindMap.ts   # マインドマップ状態管理
│   │   ├── useAiAssistant.ts # AI機能
│   │   └── useKeyboardShortcuts.ts # キーボードショートカット
│   └── App.tsx             # アプリケーションエントリーポイント
├── server/                 # MCPサーバー
│   ├── src/
│   │   ├── index.js        # メインサーバー
│   │   └── aiProcessor.js  # AI処理
│   └── package.json
├── start.sh               # 起動スクリプト
├── stop.sh                # 停止スクリプト
├── setup.sh               # セットアップスクリプト
└── package.json
```

## 🔧 開発

### 依存関係
- **フロントエンド**: React, TypeScript, Vite, react-flow, TailwindCSS, zustand
- **バックエンド**: Node.js, Express, OpenAI API

### 開発コマンド
```bash
# フロントエンド開発
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# 型チェック
npm run type-check
```

## 🌐 環境変数

### フロントエンド (.env)
```env
VITE_ENABLE_AI=true          # AI機能の有効/無効
VITE_ENABLE_MCP=true         # MCPサーバー機能の有効/無効
VITE_PORT=5173              # 開発サーバーポート
VITE_MCP_SERVER_URL=http://localhost:3001
```

### バックエンド (server/.env)
```env
PORT=3001                    # サーバーポート
OPENAI_API_KEY=your_key      # OpenAI APIキー
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=info
```

## 🛠️ トラブルシューティング

### よくある問題

#### ポートが使用中
```bash
# 完全停止してから再起動
./stop.sh
./start.sh
```

#### 依存関係の問題
```bash
# クリーンアップ後にセットアップ
./setup.sh --clean
```

#### 環境変数の問題
```bash
# 環境変数をリセット
./stop.sh
./start.sh --clean
```

### ログの確認
- フロントエンド: ブラウザの開発者ツール
- MCPサーバー: ターミナル出力
- 起動スクリプト: 色付きログで状態確認

## 📝 ライセンス

MIT License

## 🔒 セキュリティ

### APIキーの保護

⚠️ **重要**: APIキーなどの機密情報をGitにコミットしないでください！

#### 安全な設定方法
1. **環境変数ファイルの使用**
   ```bash
   # .envファイルを作成（.gitignoreに含まれている）
   cp .env.example .env
   # .envファイルを編集してAPIキーを設定
   ```

2. **Git履歴の確認**
   ```bash
   # 機密情報がコミットされていないか確認
   git log --oneline --grep="api" --grep="key" --grep="secret"
   ```

3. **誤ってコミットした場合の対処**
   ```bash
   # 最新のコミットを取り消し
   git reset --soft HEAD~1
   
   # または、機密情報を履歴から完全に削除
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch .env' \
     --prune-empty --tag-name-filter cat -- --all
   ```

#### 推奨されるセキュリティプラクティス
- ✅ 環境変数ファイル（.env）を使用
- ✅ .gitignoreで機密ファイルを除外
- ✅ APIキーを定期的にローテーション
- ✅ 最小権限の原則でAPIキーを設定
- ❌ ハードコーディングしない
- ❌ コミットメッセージに機密情報を含めない
- ❌ 公開リポジトリに機密情報をプッシュしない

### 環境変数の管理
```bash
# 開発環境
.env.development

# 本番環境
.env.production

# テスト環境
.env.test
```

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します！

### 貢献時の注意事項
1. 機密情報を含むファイルをコミットしない
2. 環境変数の変更は`.env.example`のみに反映
3. セキュリティ関連の変更は事前にレビューを依頼
