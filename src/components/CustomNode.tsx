import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';

interface CustomNodeData {
  label: string;
  color?: string;
  selectedColor?: string;
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    borderStyle?: string;
    fontSize?: string;
  };
}

export function CustomNode({ data, id }: NodeProps<CustomNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [showMenu, setShowMenu] = useState(false);
  const [style, setStyle] = useState(data.style || {});
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setNodes, setEdges } = useReactFlow();

  // グローバルクリックイベントでメニューを閉じる
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('click', handleGlobalClick);
    }

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [showMenu]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsEditing(false);
    data.label = label;
  }, [label, data]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      data.label = label;
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLabel(data.label);
    }
  }, [label, data]);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(true);
  }, []);

  const handleStyleChange = useCallback((property: string, value: string) => {
    setStyle(prev => ({ ...prev, [property]: value }));
    setShowMenu(false);
  }, []);

  const handleEdgeStyleChange = useCallback((edgeStyle: string) => {
    // このノードから出るエッジのスタイルを変更
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.source === id) {
          if (edgeStyle === 'dashed') {
            return { ...edge, style: { ...edge.style, strokeDasharray: '5,5' } };
          } else if (edgeStyle === 'dotted') {
            return { ...edge, style: { ...edge.style, strokeDasharray: '2,2' } };
          } else {
            // 通常の線に戻す
            const { style: edgeStyle, ...rest } = edge;
            return { ...rest, style: { stroke: '#1a192b', strokeWidth: 1 } };
          }
        }
        return edge;
      })
    );
    setShowMenu(false);
  }, [id, setEdges]);

  const handleDelete = useCallback(() => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setShowMenu(false);
  }, [id, setNodes, setEdges]);

  // 色の優先順位: 選択色 > 永続色 > ローカルスタイル > デフォルト
  const backgroundColor = data.selectedColor || data.color || style.backgroundColor || '#ffffff';
  
  const nodeStyle = {
    backgroundColor,
    border: `2px ${style.borderStyle || 'solid'} ${style.borderColor || '#1a192b'}`,
    fontSize: style.fontSize || '14px',
    padding: '10px',
    borderRadius: '8px',
    minWidth: '120px',
    textAlign: 'center' as const,
  };

  return (
    <div
      style={nodeStyle}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleRightClick}
    >
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      
      {isEditing ? (
        <input
          ref={inputRef}
          value={label}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 'inherit',
            textAlign: 'center',
            width: '100%',
          }}
        />
      ) : (
        <div>{label}</div>
      )}

      {showMenu && (
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
            zIndex: 1000,
            minWidth: '180px',
          }}
        >
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>スタイル変更</div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>ノードスタイル:</div>
            <div style={{ marginBottom: '4px' }}>
              <label>背景色:</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                style={{ marginLeft: '8px' }}
              />
            </div>
            
            <div style={{ marginBottom: '4px' }}>
              <label>枠線色:</label>
              <input
                type="color"
                value={style.borderColor || '#1a192b'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                style={{ marginLeft: '8px' }}
              />
            </div>
            
            <div style={{ marginBottom: '4px' }}>
              <label>枠線スタイル:</label>
              <select
                value={style.borderStyle || 'solid'}
                onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
                style={{ marginLeft: '8px' }}
              >
                <option value="solid">実線</option>
                <option value="dashed">破線</option>
                <option value="dotted">点線</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '8px' }}>
              <label>フォントサイズ:</label>
              <select
                value={style.fontSize || '14px'}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                style={{ marginLeft: '8px' }}
              >
                <option value="12px">小</option>
                <option value="14px">中</option>
                <option value="16px">大</option>
                <option value="18px">特大</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>エッジスタイル:</div>
            <div style={{ marginBottom: '4px' }}>
              <button
                onClick={() => handleEdgeStyleChange('normal')}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  marginRight: '4px',
                }}
              >
                通常線
              </button>
              <button
                onClick={() => handleEdgeStyleChange('dashed')}
                style={{
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  marginRight: '4px',
                }}
              >
                破線
              </button>
              <button
                onClick={() => handleEdgeStyleChange('dotted')}
                style={{
                  backgroundColor: '#9C27B0',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                点線
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            削除
          </button>
        </div>
      )}
    </div>
  );
} 