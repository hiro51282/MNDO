# AI連携マインドマップエディタ

このプロジェクトは、React、TypeScript、TailwindCSS、ReactFlowを使用したマインドマップエディタです。

## 環境構築手順

1. **Node.jsとnpmのインストール**  
   最新のNode.jsとnpmをインストールしてください。

2. **プロジェクトのセットアップ**  
   ```bash
   npm install
   ```

3. **依存関係のインストール**  
   以下のパッケージをインストールします：
   ```bash
   npm install -D tailwindcss@3 postcss@latest autoprefixer@latest
   ```

4. **TailwindCSSの初期化**  
   ```bash
   npx tailwindcss init -p
   ```

5. **設定ファイルの確認**  
   - `tailwind.config.js` は以下の内容で、CommonJS形式に設定されています：
     ```js
     module.exports = {
       content: [
         "./index.html",
         "./src/**/*.{js,ts,jsx,tsx}",
       ],
       theme: {
         extend: {},
       },
       plugins: [],
     }
     ```
   - `postcss.config.cjs` は以下の内容で、CommonJS形式に設定されています：
     ```js
     module.exports = {
       plugins: {
         tailwindcss: {},
         autoprefixer: {},
       },
     }
     ```

6. **開発サーバーの起動**  
   ```bash
   npm run dev -- --host 0.0.0.0
   ```
   これにより、ローカル（http://localhost:5173/）およびネットワーク（http://192.168.11.15:5173/）でアクセス可能になります。

## 動作確認

- ブラウザで `http://localhost:5173/` を開くと、マインドマップが表示されます。
- マインドマップは、ReactFlowを使用して描画され、ノードとエッジが表示されます。

## ソースコード

- `src/App.tsx` は以下の内容で、MindMapコンポーネントを描画しています：
  ```tsx
  import { MindMap } from './components/MindMap'

  function App() {
    return (
      <div className="w-screen h-screen">
        <MindMap />
      </div>
    )
  }

  export default App
  ```

- `src/components/MindMap.tsx` は以下の内容で、ReactFlowを使用してマインドマップを描画しています：
  ```tsx
  import { useCallback } from 'react';
  import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
  } from 'reactflow';
  import 'reactflow/dist/style.css';

  const initialNodes = [
    {
      id: '1',
      type: 'input',
      data: { label: 'メインアイデア' },
      position: { x: 250, y: 25 },
    },
    {
      id: '2',
      data: { label: 'サブアイデア1' },
      position: { x: 100, y: 125 },
    },
    {
      id: '3',
      data: { label: 'サブアイデア2' },
      position: { x: 400, y: 125 },
    },
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
  ];

  export function MindMap() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
      (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
      [setEdges],
    );

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    );
  }
  ```

- `src/index.css` は以下の内容で、TailwindCSSの設定が含まれています：
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;
  }
  a:hover {
    color: #535bf2;
  }

  body {
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
  }

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
  }
  button:hover {
    border-color: #646cff;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  @media (prefers-color-scheme: light) {
    :root {
      color: #213547;
      background-color: #ffffff;
    }
    a:hover {
      color: #747bff;
    }
    button {
      background-color: #f9f9f9;
    }
  }
  ```

## 履歴

- 2023-10-01: プロジェクト初期化
- 2023-10-02: TailwindCSSの設定を修正し、マインドマップの基本実装を完了

## Gitリポジトリへの登録手順

1. **不要なファイルの削除**  
   - `node_modules` や `package-lock.json` などの不要なファイルを削除します。これらは `.gitignore` に追加して、Gitに登録しないようにします。

2. **`.gitignore` ファイルの作成**  
   - `.gitignore` ファイルを作成し、以下の内容を追加します：
     ```
     node_modules/
     package-lock.json
     .env
     .DS_Store
     ```

3. **READMEの更新**  
   - READMEに、Gitリポジトリに登録する際の手順や注意点を追加します。例えば、`node_modules` をインストールする手順や、環境変数の設定方法など。

4. **コミットメッセージの準備**  
   - 最初のコミットメッセージを準備します。例えば、「Initial commit: Project setup with React, TypeScript, and TailwindCSS」など。

5. **Gitリポジトリの初期化**  
   - プロジェクトディレクトリで以下のコマンドを実行して、Gitリポジトリを初期化します：
     ```bash
     git init
     ```

6. **ファイルのステージング**  
   - 以下のコマンドを実行して、変更をステージングします：
     ```bash
     git add .
     ```

7. **最初のコミット**  
   - 以下のコマンドを実行して、最初のコミットを作成します：
     ```bash
     git commit -m "Initial commit: Project setup with React, TypeScript, and TailwindCSS"
     ```

8. **リモートリポジトリの設定（オプション）**  
   - もしGitHubやGitLabなどのリモートリポジトリを使用する場合は、リモートリポジトリのURLを設定します：
     ```bash
     git remote add origin <リモートリポジトリのURL>
     ```

9. **プッシュ（オプション）**  
   - リモートリポジトリにプッシュする場合は、以下のコマンドを実行します：
     ```bash
     git push -u origin main
     ```

10. **動作確認**  
    - 最後に、プロジェクトが正常に動作することを確認します。`npm run dev` を実行して、開発サーバーが起動することを確認してください。
