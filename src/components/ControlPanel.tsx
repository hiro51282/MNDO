import { LayoutStyle } from '../hooks/useMindMap';

interface ControlPanelProps {
  selectedNodesCount: number;
  selectedEdgesCount: number;
  layoutStyle: LayoutStyle;
  selectedNodeColor: string;
  onAddNode: () => void;
  onAddSubNodes: () => void;
  onLayoutStyleChange: (style: LayoutStyle) => void;
  onNodeColorChange: (color: string) => void;
  onChangeNodeColor: () => void;
  onEdgeStyleChange: (style: string) => void;
  onSaveMindMap: () => void;
  onLoadMindMap: () => void;
}

export function ControlPanel({
  selectedNodesCount,
  selectedEdgesCount,
  layoutStyle,
  selectedNodeColor,
  onAddNode,
  onAddSubNodes,
  onLayoutStyleChange,
  onNodeColorChange,
  onChangeNodeColor,
  onEdgeStyleChange,
  onSaveMindMap,
  onLoadMindMap,
}: ControlPanelProps) {
  return (
    <div style={{ 
      position: 'absolute', 
      top: '15px', 
      left: '15px', 
      zIndex: 1000,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '15px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.1), 0 3px 12px rgba(0,0,0,0.05)',
      border: '1px solid rgba(255,255,255,0.2)',
      minWidth: '240px',
      maxWidth: '280px',
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
          letterSpacing: '0.3px'
        }}>
          🎯 コントロール
        </h3>
      </div>

      {/* 保存/読み込みボタン */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '12px' 
        }}>
          <button
            onClick={() => {
              console.log('保存ボタンクリック');
              console.log('onSaveMindMap関数:', onSaveMindMap);
              onSaveMindMap();
            }}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 3px 8px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 3px 8px rgba(16, 185, 129, 0.3)';
            }}
          >
            <span style={{ fontSize: '14px' }}>💾</span>
            保存
          </button>
          <button
            onClick={onLoadMindMap}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 3px 8px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 3px 8px rgba(139, 92, 246, 0.3)';
            }}
          >
            <span style={{ fontSize: '14px' }}>📂</span>
            読み込み
          </button>
        </div>
      </div>

      {/* メインアクションボタン */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '12px' 
        }}>
          <button
            onClick={onAddNode}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 3px 8px rgba(76, 175, 80, 0.3)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 3px 8px rgba(76, 175, 80, 0.3)';
            }}
          >
            <span style={{ fontSize: '14px' }}>➕</span>
            追加
          </button>
          <button
            onClick={onAddSubNodes}
            disabled={selectedNodesCount === 0}
            style={{
              flex: 1,
              background: selectedNodesCount > 0 
                ? 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' 
                : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: selectedNodesCount > 0 ? 'pointer' : 'not-allowed',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: selectedNodesCount > 0 
                ? '0 3px 8px rgba(33, 150, 243, 0.3)' 
                : '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              opacity: selectedNodesCount > 0 ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (selectedNodesCount > 0) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedNodesCount > 0) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 3px 8px rgba(33, 150, 243, 0.3)';
              }
            }}
          >
            <span style={{ fontSize: '14px' }}>🔗</span>
            サブ ({selectedNodesCount})
          </button>
        </div>
      </div>

      {/* 設定セクション */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '12px', 
          fontWeight: '600', 
          color: '#4a5568',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '14px' }}>⚙️</span>
          設定
        </h4>
        
        {/* 生成スタイル */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            fontSize: '11px', 
            fontWeight: '500',
            color: '#2d3748',
            marginBottom: '4px',
            display: 'block'
          }}>
            生成スタイル
          </label>
          <select
            value={layoutStyle}
            onChange={(e) => onLayoutStyleChange(e.target.value as LayoutStyle)}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '11px',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
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
            <option value="vertical">📏 縦方向</option>
            <option value="horizontal">↔️ 横方向</option>
          </select>
        </div>
        
        {/* ノード色 */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            fontSize: '11px', 
            fontWeight: '500',
            color: '#2d3748',
            marginBottom: '4px',
            display: 'block'
          }}>
            ノード色
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="color"
              value={selectedNodeColor}
              onChange={(e) => onNodeColorChange(e.target.value)}
              style={{
                width: '32px',
                height: '32px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
            <button
              onClick={onChangeNodeColor}
              disabled={selectedNodesCount === 0}
              style={{
                flex: 1,
                background: selectedNodesCount > 0 
                  ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' 
                  : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: selectedNodesCount > 0 ? 'pointer' : 'not-allowed',
                fontSize: '11px',
                fontWeight: '600',
                boxShadow: selectedNodesCount > 0 
                  ? '0 2px 6px rgba(255, 107, 107, 0.3)' 
                  : '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                opacity: selectedNodesCount > 0 ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (selectedNodesCount > 0) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedNodesCount > 0) {
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              🎨 変更 ({selectedNodesCount})
            </button>
          </div>
        </div>

        {/* エッジスタイル */}
        <div>
          <label style={{ 
            fontSize: '11px', 
            fontWeight: '500',
            color: '#2d3748',
            marginBottom: '4px',
            display: 'block'
          }}>
            エッジスタイル
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => onEdgeStyleChange('normal')}
              disabled={selectedEdgesCount === 0}
              style={{
                flex: 1,
                background: selectedEdgesCount > 0 
                  ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' 
                  : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                color: 'white',
                border: 'none',
                padding: '6px 8px',
                borderRadius: '4px',
                cursor: selectedEdgesCount > 0 ? 'pointer' : 'not-allowed',
                fontSize: '10px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                opacity: selectedEdgesCount > 0 ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (selectedEdgesCount > 0) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedEdgesCount > 0) {
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              ━ 通常
            </button>
            <button
              onClick={() => onEdgeStyleChange('dashed')}
              disabled={selectedEdgesCount === 0}
              style={{
                flex: 1,
                background: selectedEdgesCount > 0 
                  ? 'linear-gradient(135deg, #FF9800 0%, #f57c00 100%)' 
                  : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                color: 'white',
                border: 'none',
                padding: '6px 8px',
                borderRadius: '4px',
                cursor: selectedEdgesCount > 0 ? 'pointer' : 'not-allowed',
                fontSize: '10px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                opacity: selectedEdgesCount > 0 ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (selectedEdgesCount > 0) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedEdgesCount > 0) {
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              ┅ 破線
            </button>
            <button
              onClick={() => onEdgeStyleChange('dotted')}
              disabled={selectedEdgesCount === 0}
              style={{
                flex: 1,
                background: selectedEdgesCount > 0 
                  ? 'linear-gradient(135deg, #9C27B0 0%, #7b1fa2 100%)' 
                  : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                color: 'white',
                border: 'none',
                padding: '6px 8px',
                borderRadius: '4px',
                cursor: selectedEdgesCount > 0 ? 'pointer' : 'not-allowed',
                fontSize: '10px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                opacity: selectedEdgesCount > 0 ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (selectedEdgesCount > 0) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedEdgesCount > 0) {
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              ⋯ 点線
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 