import { AiProposal } from '../hooks/useAiAssistant';

interface AiAssistantProps {
  aiInput: string;
  onAiInputChange: (value: string) => void;
  onAiInputSubmit: () => void;
  isProcessing: boolean;
  currentProposal: AiProposal | null;
  onAcceptProposal: () => void;
  onRejectProposal: () => void;
}

export function AiAssistant({
  aiInput,
  onAiInputChange,
  onAiInputSubmit,
  isProcessing,
  currentProposal,
  onAcceptProposal,
  onRejectProposal,
}: AiAssistantProps) {
  return (
    <div style={{ position: 'absolute', bottom: '80px', left: '10px', zIndex: 1000 }}>
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        padding: '15px', 
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.2)',
        minWidth: '320px',
        maxWidth: '400px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.1), 0 3px 12px rgba(0,0,0,0.05)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        
        {/* ヘッダー */}
        <div style={{ 
          marginBottom: '12px', 
          textAlign: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          paddingBottom: '8px'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#2d3748',
            letterSpacing: '0.3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '16px' }}>🤖</span>
            AI アシスタント
          </h3>
        </div>

        {/* 入力セクション */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', marginBottom: '8px', color: '#666' }}>
            自由にテキストを入力してください
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={aiInput}
              onChange={(e) => onAiInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isProcessing) {
                  onAiInputSubmit();
                }
              }}
              placeholder="例: メインサブアイデアにノードを2つ追加して"
              disabled={isProcessing}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
                outline: 'none',
                transition: 'all 0.2s ease',
                background: isProcessing ? '#f7fafc' : 'white',
                opacity: isProcessing ? 0.6 : 1
              }}
              onFocus={(e) => {
                if (!isProcessing) {
                  e.target.style.borderColor = '#4299e1';
                  e.target.style.boxShadow = '0 0 0 2px rgba(66, 153, 225, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={onAiInputSubmit}
              disabled={isProcessing || !aiInput.trim()}
              style={{
                background: isProcessing || !aiInput.trim()
                  ? 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)'
                  : 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: isProcessing || !aiInput.trim() ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                opacity: isProcessing || !aiInput.trim() ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isProcessing && aiInput.trim()) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing && aiInput.trim()) {
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {isProcessing ? '処理中...' : '提案'}
            </button>
          </div>
        </div>

        {/* 提案表示セクション */}
        {currentProposal && (
          <div style={{ 
            marginTop: '12px',
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
            borderRadius: '8px',
            border: '1px solid rgba(76, 175, 80, 0.2)'
          }}>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#2d3748',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '14px' }}>💡</span>
              AI提案
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#4a5568',
              marginBottom: '12px',
              lineHeight: '1.4'
            }}>
              {currentProposal.description}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={onAcceptProposal}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '12px' }}>✅</span>
                確定
              </button>
              <button
                onClick={onRejectProposal}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '12px' }}>❌</span>
                破棄
              </button>
            </div>
          </div>
        )}

        {/* 処理中インジケーター */}
        {isProcessing && (
          <div style={{ 
            marginTop: '8px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid #e2e8f0',
              borderTop: '2px solid #4CAF50',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            AIが提案を生成中...
          </div>
        )}
      </div>
    </div>
  );
} 