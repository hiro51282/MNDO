# MNDO - AI連携マインドマップエディタ 引き継ぎ資料

## 📋 プロジェクト概要

**プロジェクト名**: MNDO (MindMap Editor)  
**技術スタック**: React 19 + TypeScript + Vite + ReactFlow + TailwindCSS + Zustand  
**AI機能**: OpenAI API + MCPサーバー（実装済み・テスト未実施）  
**開発期間**: 2025年6月7日〜現在  
**プロジェクト規模**: 中規模（約2,000行のコード）

## 🎯 プロジェクトの目的と経緯

### 開発の背景
- **LLMを使った開発実験**: このプロジェクトは「LLMってものを使ってみよう」という実験的な試みからスタート
- **CursorからClaudeCodeへの移行**: 開発環境の変更に伴う包括的な引き継ぎが必要
- **AI連携マインドマップエディタ**: 従来の静的マインドマップツールにAI機能を統合
- **React 19対応**: 最新のReact機能を活用したモダンなUI/UX

### 開発の経緯と対応

#### 1. 環境構築段階（初期対応）
**問題**: PostCSSとTailwindCSSの設定不整合
- **症状**: ESモジュールとCommonJSの形式の不整合
- **対応**: TailwindCSSをv3系にダウングレード、`postcss.config.cjs`をCommonJS形式で作成
- **結果**: 安定した開発環境を構築

#### 2. ReactFlow統合段階
**問題**: React 19との互換性
- **対応**: `reactflow`パッケージをv11.11.4に更新
- **結果**: React 19の新機能（useState、useEffect等）を活用可能

#### 3. 機能実装段階
**要望**: 複数選択、TABキーでのサブノード作成、ノード編集機能
- **対応**: カスタムノードコンポーネント、キーボードショートカット、右クリックメニューを実装
- **結果**: 直感的な操作感を実現

#### 4. AI機能統合段階（⚠️ 未完了）
**要望**: OpenAI APIとの連携、MCPサーバーによるAI処理
- **現状**: 
  - ✅ MCPサーバーの基本実装完了（Express.js + OpenAI API連携）
  - ✅ フロントエンドとの連携機能実装
  - ❌ **実際のテストは未実施**
  - ❌ **AI機能の動作確認は未完了**
- **対応済み**: Express.jsサーバー、AI処理エンジン、フロントエンド連携を実装
- **未対応**: 実際のAPIキーでの動作テスト、エラーハンドリングの検証

## 🏗️ アーキテクチャ詳細

### フロントエンド構成

#### コンポーネント階層
```
App.tsx
└── ReactFlowProvider
    └── MindMap.tsx
        ├── ControlPanel.tsx (左上)
        ├── InfoPanel.tsx (右上)
        ├── AiAssistant.tsx (左下)
        ├── McpTestPanel.tsx (中央上部)
        └── ReactFlow
            └── CustomNode.tsx
```

#### 状態管理
- **Zustand**: グローバル状態管理（未実装、現在はReact hooks）
- **ReactFlow hooks**: `useNodesState`, `useEdgesState`でノード・エッジ管理
- **カスタムフック**: `useMindMap`, `useAiAssistant`, `useKeyboardShortcuts`

#### 主要コンポーネント詳細

##### MindMap.tsx (メインコンポーネント)
```typescript
// 主要機能
- ReactFlowの初期化と設定
- 環境変数によるAI/MCP機能の制御
- 各パネルコンポーネントの配置
- イベントハンドラーの統合
```

##### CustomNode.tsx (カスタムノード)
```typescript
// 主要機能
- ダブルクリック編集
- 右クリックメニュー（スタイル変更、削除）
- 色の優先順位管理（選択色 > 永続色 > ローカルスタイル）
- エッジスタイル変更
```

##### ControlPanel.tsx (コントロールパネル)
```typescript
// 主要機能
- 保存/読み込み機能
- ノード追加/削除
- レイアウトスタイル切替
- 色変更・エッジスタイル変更
```

### バックエンド構成

#### MCPサーバー (server/)
```
server/
├── src/
│   ├── index.js (Express.jsサーバー)
│   └── aiProcessor.js (AI処理エンジン)
├── package.json
└── .env
```

#### API エンドポイント
- `GET /health`: ヘルスチェック
- `GET /api/models`: 利用可能なAIモデル一覧
- `POST /api/ai-assistant`: AI処理リクエスト

#### AI処理エンジン
```javascript
// 主要機能
- OpenAI API連携
- マインドマップ構造分析
- プロンプト生成
- 提案解析・生成
```

## 🔧 技術的な対応と解決策

### 1. PostCSS設定問題
**問題**: ESモジュールとCommonJSの不整合
```javascript
// 解決策: postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 2. ReactFlow React 19対応
**問題**: React 19の新機能との互換性
```typescript
// 解決策: ReactFlowProviderでラップ
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <ReactFlowProvider>
      <MindMap />
    </ReactFlowProvider>
  );
}
```

### 3. 環境変数管理
**問題**: フロントエンドとバックエンドの環境変数分離
```bash
# フロントエンド (.env)
VITE_ENABLE_AI=true
VITE_ENABLE_MCP=true
VITE_PORT=5173
VITE_MCP_SERVER_URL=http://localhost:3001

# バックエンド (server/.env)
PORT=3001
OPENAI_API_KEY=your_key
FRONTEND_URL=http://localhost:5173
```

### 4. プロセス管理
**問題**: 複数プロセスの起動・停止管理
```bash
# 解決策: 専用スクリプト
./start.sh      # 全機能起動
./stop.sh       # 完全停止
./setup.sh      # 環境セットアップ
```

## 🎮 機能詳細

### 基本機能
1. **ノード操作**
   - ドラッグ&ドロップ移動
   - ダブルクリック編集
   - 右クリックメニュー

2. **接続機能**
   - ハンドルドラッグで接続
   - 自動レイアウト調整
   - エッジスタイル変更

3. **選択機能**
   - 単一選択
   - Ctrl+クリックで複数選択
   - 全選択 (Ctrl+A)

### キーボードショートカット
- **Tab**: 選択ノードにサブノード追加
- **Delete**: 選択ノード削除
- **Ctrl+S**: 保存
- **Ctrl+A**: 全選択

### AI機能
1. **AIアシスタント**
   - テキスト入力による提案生成
   - リアルタイム処理
   - 提案の確定/破棄
   - ⚠️ **現状**: シミュレーション機能のみ実装済み、実際のAI連携は未テスト

2. **MCPサーバー**
   - OpenAI API連携（実装済み）
   - 複数モデル対応（実装済み）
   - 構造分析機能（実装済み）
   - ⚠️ **現状**: サーバー実装は完了、実際の動作テストは未実施
   - ⚠️ **課題**: APIキーでの動作確認、エラーハンドリングの検証が必要

### 保存・読み込み機能
```typescript
// 保存データ構造
interface MindMapData {
  nodes: Node[];
  edges: Edge[];
  layoutStyle: LayoutStyle;
  selectedNodeColor: string;
  timestamp: number;
  name: string;
}
```

## 🚀 起動・運用方法

### セットアップ
```bash
# 初回セットアップ
./setup.sh

# クリーンアップ後にセットアップ
./setup.sh --clean

# 開発環境のみ
./setup.sh --dev
```

### 起動
```bash
# 全機能で起動
./start.sh

# AI機能なし
./start.sh --no-ai

# MCPサーバーなし
./start.sh --no-mcp

# 基本機能のみ
./start.sh --no-ai --no-mcp
```

### 停止
```bash
# 完全停止
./stop.sh
```

## 🔒 セキュリティ対応

### APIキー管理
- **環境変数ファイル**: `.env`ファイルで管理
- **Git除外**: `.gitignore`で機密ファイルを除外
- **バックアップ**: 既存設定の自動バックアップ

### CORS設定
```javascript
// サーバー側
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## �� 現在の課題と今後の方針

### 技術的課題

#### 1. 状態管理の最適化
**現状**: React hooksによる状態管理
**課題**: 大規模データでのパフォーマンス
**方針**: Zustandの導入、状態の正規化

#### 2. AI機能の拡張
**現状**: 基本的な提案生成（シミュレーション機能のみ）
**課題**: 
- **最重要**: 実際のAPIキーでの動作テストが未実施
- MCPサーバーの動作確認が必要
- より高度なAI分析機能の実装
**方針**: 
- **即座に必要**: APIキーでの動作テスト実施
- エラーハンドリングの検証と改善
- 構造分析の高度化
- リアルタイム提案
- 学習機能の追加

#### 3. パフォーマンス最適化
**現状**: 基本的な最適化
**課題**: 大量ノードでの描画性能
**方針**:
- 仮想化の導入
- レンダリング最適化
- メモリ使用量の削減

### 機能拡張計画

#### 短期計画（1-2週間）
1. **Zustand状態管理の導入**
   ```typescript
   // 計画中のストア構造
   interface MindMapStore {
     nodes: Node[];
     edges: Edge[];
     selectedNodes: string[];
     layoutStyle: LayoutStyle;
     // ...
   }
   ```

2. **エクスポート機能の拡張**
   - PNG/PDF出力
   - テンプレート機能
   - 共有機能

3. **キーボードショートカットの拡張**
   - カスタムショートカット設定
   - ショートカット一覧表示

#### 中期計画（1-2ヶ月）
1. **コラボレーション機能**
   - リアルタイム共同編集
   - コメント機能
   - 変更履歴管理

2. **テンプレート機能**
   - 事前定義テンプレート
   - カスタムテンプレート作成
   - テンプレート共有

3. **高度なAI機能**
   - 構造最適化提案
   - 内容分析・要約
   - 関連性の自動発見

#### 長期計画（3-6ヶ月）
1. **クラウド連携**
   - クラウド保存
   - 同期機能
   - バージョン管理

2. **プラグインシステム**
   - カスタムノードタイプ
   - 外部サービス連携
   - 拡張機能開発

3. **モバイル対応**
   - レスポンシブデザイン
   - タッチ操作最適化
   - PWA対応

## 🛠️ 開発環境とツール

### 開発環境
- **Node.js**: 18以上
- **npm**: 最新版
- **TypeScript**: 5.8.3
- **Vite**: 6.3.5

### 主要ライブラリ
```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "reactflow": "^11.11.4",
  "zustand": "^5.0.5",
  "tailwindcss": "^3.4.17"
}
```

### 開発ツール
- **ESLint**: コード品質管理
- **TypeScript**: 型安全性
- **Vite**: 高速開発サーバー
- **PostCSS**: CSS処理

## 📝 コード品質とベストプラクティス

### コーディング規約
1. **TypeScript**: 厳密な型定義
2. **関数型プログラミング**: 副作用の最小化
3. **コンポーネント分割**: 単一責任の原則
4. **カスタムフック**: ロジックの再利用

### エラーハンドリング
```typescript
// 統一的なエラーハンドリング
try {
  // 処理
} catch (error) {
  console.error('エラー詳細:', error);
  // ユーザーフレンドリーなエラーメッセージ
}
```

### パフォーマンス最適化
1. **React.memo**: 不要な再レンダリング防止
2. **useCallback/useMemo**: 依存関係の最適化
3. **仮想化**: 大量データの効率的表示

## 🔄 継続的改善

### 監視・ログ
- **コンソールログ**: 開発時のデバッグ
- **エラートラッキング**: 本番環境でのエラー監視
- **パフォーマンス監視**: レスポンス時間の測定

### テスト戦略
1. **単体テスト**: コンポーネント・フックのテスト
2. **統合テスト**: API連携のテスト
3. **E2Eテスト**: ユーザーフローのテスト

### デプロイメント
- **開発環境**: localhost:5173
- **ステージング環境**: 未設定
- **本番環境**: 未設定

## 📚 参考資料とリソース

### 公式ドキュメント
- [React 19 Documentation](https://react.dev/)
- [ReactFlow Documentation](https://reactflow.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

### 技術記事
- React 19の新機能
- ReactFlowのベストプラクティス
- TypeScriptとReactの統合

### コミュニティ
- ReactFlow Discord
- React Japan
- TypeScript Community

## 🎯 ClaudeCode移行後の優先事項

### 即座に取り組むべき項目
1. **AI機能の動作テスト**: MCPサーバーとOpenAI APIの連携テスト（最重要）
2. **環境確認**: 新しい開発環境での動作確認
3. **依存関係の更新**: 最新版への更新検討
4. **ドキュメント整備**: コードコメントの追加

### 短期目標（1週間以内）
1. **AI機能の完全動作確認**: APIキーでのテスト、エラーハンドリング検証
2. **Zustand導入**: 状態管理の最適化
3. **テスト環境構築**: 基本的なテストの実装
4. **CI/CD設定**: 自動化パイプラインの構築

### 中期目標（1ヶ月以内）
1. **AI機能の拡張**: 実際のAI連携を基盤とした機能拡張
2. **機能拡張**: ユーザー要望の実装
3. **パフォーマンス改善**: 大規模データ対応
4. **セキュリティ強化**: 脆弱性の修正

## 📞 サポート・連絡先

### 技術的な質問
- プロジェクトの技術的な詳細について
- アーキテクチャの設計思想
- 実装方法の説明

### 今後の開発方針
- 機能拡張の優先順位
- 技術選定の理由
- リファクタリング計画

---

**作成日**: 2024年12月  
**作成者**: AI Assistant  
**バージョン**: 1.0.0  
**最終更新**: 2024年12月

この資料は、ClaudeCodeでの開発継続を支援するために作成されました。プロジェクトの全体像、技術的な詳細、今後の方針を包括的に記載しています。 