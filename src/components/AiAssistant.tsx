interface AiAssistantProps {
  aiInput: string;
  onAiInputChange: (value: string) => void;
  onAiInputSubmit: () => void;
}

export function AiAssistant({
  aiInput,
  onAiInputChange,
  onAiInputSubmit,
}: AiAssistantProps) {
  return (
    <div style={{ position: 'absolute', bottom: '80px', left: '10px', zIndex: 1000 }}>
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid #ccc',
        minWidth: '300px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
          AI アシスタント
        </div>
        <div style={{ fontSize: '11px', marginBottom: '8px', color: '#666' }}>
          例: 「メインアイデア」に子ノードを生成してください
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={aiInput}
            onChange={(e) => onAiInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onAiInputSubmit();
              }
            }}
            placeholder="＜ノード名＞に子ノードを生成してください"
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <button
            onClick={onAiInputSubmit}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}
          >
            実行
          </button>
        </div>
      </div>
    </div>
  );
} 