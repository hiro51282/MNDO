import { LayoutStyle } from '../hooks/useMindMap';

interface InfoPanelProps {
  selectedNodesCount: number;
  selectedEdgesCount: number;
  layoutStyle: LayoutStyle;
}

export function InfoPanel({
  selectedNodesCount,
  selectedEdgesCount,
  layoutStyle,
}: InfoPanelProps) {
  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        padding: '10px', 
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <div>選択されたノード: {selectedNodesCount}個</div>
        <div>選択されたエッジ: {selectedEdgesCount}個</div>
        <div>TABキー: サブノード作成（下/右）</div>
        <div>Shift+TAB: サブノード作成（上/左）</div>
        <div>Ctrl+クリック: 複数選択</div>
        <div>生成スタイル: {layoutStyle === 'vertical' ? '縦方向' : '横方向'}</div>
      </div>
    </div>
  );
} 