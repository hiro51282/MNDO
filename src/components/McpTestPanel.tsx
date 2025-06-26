import { useState, useEffect } from 'react';

interface McpTestPanelProps {
  mindMapState: {
    nodes: any[];
    edges: any[];
  };
}

interface ModelInfo {
  name: string;
  description: string;
  cost: string;
}

interface ModelsResponse {
  success: boolean;
  models: Record<string, ModelInfo>;
  defaultModel: string;
}

export function McpTestPanel({ mindMapState }: McpTestPanelProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [availableModels, setAvailableModels] = useState<Record<string, ModelInfo>>({});
  const [defaultModel, setDefaultModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');

  // 利用可能なモデル一覧を取得
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/models');
        if (response.ok) {
          const data: ModelsResponse = await response.json();
          setAvailableModels(data.models);
          setDefaultModel(data.defaultModel);
          setSelectedModel(data.defaultModel);
        }
      } catch (err) {
        console.error('モデル一覧の取得に失敗:', err);
      }
    };

    fetchModels();
  }, []);

  const handleTestMcp = async () => {
    if (!apiKey.trim() || !userInput.trim()) {
      setError('APIキーとユーザー入力を入力してください');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const requestData = {
        mindMapState: {
          nodes: mindMapState.nodes,
          edges: mindMapState.edges,
          userInput: userInput
        },
        apiKey: apiKey,
        model: selectedModel
      };

      console.log('MCPサーバーに送信するデータ:', requestData);

      const response = await fetch('http://localhost:3001/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
      console.log('MCPサーバーからの応答:', data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`MCPサーバーとの通信エラー: ${errorMessage}`);
      console.error('MCPサーバーエラー:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '10px', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      zIndex: 1000,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.1), 0 3px 12px rgba(0,0,0,0.05)',
      border: '1px solid rgba(255,255,255,0.2)',
      minWidth: '400px',
      maxWidth: '600px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* ヘッダー */}
      <div style={{ 
        marginBottom: '16px', 
        textAlign: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        paddingBottom: '12px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#2d3748',
          letterSpacing: '0.3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '18px' }}>🔧</span>
          MCPサーバーテスト
        </h3>
      </div>

      {/* APIキー入力 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          fontSize: '12px', 
          fontWeight: '500',
          color: '#2d3748',
          marginBottom: '6px',
          display: 'block'
        }}>
          OpenAI APIキー
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '12px',
            outline: 'none',
            transition: 'all 0.2s ease',
            background: 'white'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4299e1';
            e.target.style.boxShadow = '0 0 0 2px rgba(66, 153, 225, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* モデル選択 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          fontSize: '12px', 
          fontWeight: '500',
          color: '#2d3748',
          marginBottom: '6px',
          display: 'block'
        }}>
          AIモデル選択
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '12px',
            outline: 'none',
            transition: 'all 0.2s ease',
            background: 'white'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4299e1';
            e.target.style.boxShadow = '0 0 0 2px rgba(66, 153, 225, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        >
          {Object.entries(availableModels).map(([modelId, modelInfo]) => (
            <option key={modelId} value={modelId}>
              {modelInfo.name} - {modelInfo.description}
            </option>
          ))}
        </select>
        {selectedModel && availableModels[selectedModel] && (
          <div style={{
            fontSize: '10px',
            color: '#718096',
            marginTop: '4px',
            padding: '4px 8px',
            background: '#f7fafc',
            borderRadius: '4px',
            border: '1px solid #e2e8f0'
          }}>
            💰 {availableModels[selectedModel].cost}
          </div>
        )}
      </div>

      {/* ユーザー入力 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          fontSize: '12px', 
          fontWeight: '500',
          color: '#2d3748',
          marginBottom: '6px',
          display: 'block'
        }}>
          テスト入力
        </label>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="例: メインアイデアにサブノードを追加して"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '12px',
            outline: 'none',
            transition: 'all 0.2s ease',
            background: 'white'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4299e1';
            e.target.style.boxShadow = '0 0 0 2px rgba(66, 153, 225, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* マインドマップ状態の表示 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          fontSize: '12px', 
          fontWeight: '500',
          color: '#2d3748',
          marginBottom: '6px',
          display: 'block'
        }}>
          現在のマインドマップ状態
        </label>
        <div style={{
          padding: '8px 12px',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          fontSize: '11px',
          background: '#f7fafc',
          color: '#4a5568',
          maxHeight: '100px',
          overflow: 'auto'
        }}>
          ノード数: {mindMapState.nodes.length} | エッジ数: {mindMapState.edges.length}
        </div>
      </div>

      {/* テストボタン */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={handleTestMcp}
          disabled={isLoading || !apiKey.trim() || !userInput.trim()}
          style={{
            width: '100%',
            background: isLoading || !apiKey.trim() || !userInput.trim()
              ? 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)'
              : 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: isLoading || !apiKey.trim() || !userInput.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            opacity: isLoading || !apiKey.trim() || !userInput.trim() ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading && apiKey.trim() && userInput.trim()) {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && apiKey.trim() && userInput.trim()) {
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {isLoading ? 'テスト中...' : 'MCPサーバーテスト実行'}
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div style={{ 
          marginBottom: '16px',
          padding: '12px',
          background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 107, 107, 0.2)',
          fontSize: '12px',
          color: '#e53e3e'
        }}>
          <strong>エラー:</strong> {error}
        </div>
      )}

      {/* レスポンス表示 */}
      {response && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            fontSize: '12px', 
            fontWeight: '500',
            color: '#2d3748',
            marginBottom: '6px',
            display: 'block'
          }}>
            MCPサーバーからの応答
          </label>
          <pre style={{
            padding: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '11px',
            background: '#f7fafc',
            color: '#2d3748',
            maxHeight: '200px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {response}
          </pre>
        </div>
      )}

      {/* ヘルプ情報 */}
      <div style={{ 
        fontSize: '11px', 
        color: '#718096',
        textAlign: 'center',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        paddingTop: '12px'
      }}>
        MCPサーバーが localhost:3001 で動作していることを確認してください
      </div>
    </div>
  );
} 