import { useCallback, useState } from 'react';
import { Node } from 'reactflow';

export function useAiAssistant(
  nodes: Node[],
  addSubNodes: (direction: 'forward' | 'backward') => void,
  setSelectedNodes: (nodes: string[]) => void
) {
  const [aiInput, setAiInput] = useState<string>('');

  const handleAiInput = useCallback(() => {
    const pattern = /＜(.+?)＞に子ノードを生成してください/;
    const match = aiInput.match(pattern);
    
    if (match) {
      const targetNodeLabel = match[1];
      
      // 指定されたラベルのノードを探す
      const targetNode = nodes.find(node => node.data.label === targetNodeLabel);
      
      if (targetNode) {
        // そのノードを選択状態にして子ノードを生成
        setSelectedNodes([targetNode.id]);
        
        // 少し遅延させてから子ノードを生成（選択状態の更新を待つ）
        setTimeout(() => {
          addSubNodes('forward');
          setAiInput(''); // 入力フィールドをクリア
        }, 100);
      } else {
        alert(`「${targetNodeLabel}」というノードが見つかりませんでした。`);
      }
    }
  }, [aiInput, nodes, addSubNodes, setSelectedNodes]);

  return {
    aiInput,
    setAiInput,
    handleAiInput,
  };
} 