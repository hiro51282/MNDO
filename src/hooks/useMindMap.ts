import { useCallback, useEffect, useState } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  OnSelectionChangeParams,
} from 'reactflow';

export type LayoutStyle = 'vertical' | 'horizontal';

interface MindMapData {
  nodes: Node[];
  edges: Edge[];
  layoutStyle: LayoutStyle;
  selectedNodeColor: string;
  timestamp: number;
  name: string;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'メインアイデア' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    type: 'custom',
    data: { label: 'サブアイデア1' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'custom',
    data: { label: 'サブアイデア2' },
    position: { x: 400, y: 125 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

export function useMindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>('vertical');
  const [selectedNodeColor, setSelectedNodeColor] = useState<string>('#87CEEB');
  const { getNode, getNodes, getEdges } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelectedNodes(params.nodes.map(node => node.id));
    setSelectedEdges(params.edges.map(edge => edge.id));
  }, []);

  const addNode = useCallback(() => {
    const newNodeId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      data: { label: '新しいアイデア' },
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const addSubNodes = useCallback((direction: 'forward' | 'backward' = 'forward') => {
    if (selectedNodes.length === 0) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    selectedNodes.forEach((parentId, index) => {
      const parentNode = getNode(parentId);
      if (!parentNode) return;

      const subNodeId = `subnode-${Date.now()}-${index}`;
      let position = { x: 0, y: 0 };
      let sourceHandle = '';
      let targetHandle = '';

      if (layoutStyle === 'vertical') {
        if (direction === 'forward') {
          position = {
            x: parentNode.position.x + (index * 50),
            y: parentNode.position.y + 100,
          };
          sourceHandle = 'bottom';
          targetHandle = 'top';
        } else {
          position = {
            x: parentNode.position.x + (index * 50),
            y: parentNode.position.y - 100,
          };
          sourceHandle = 'bottom';
          targetHandle = 'top';
        }
      } else {
        if (direction === 'forward') {
          position = {
            x: parentNode.position.x + 150,
            y: parentNode.position.y + (index * 50),
          };
          sourceHandle = 'right';
          targetHandle = 'left';
        } else {
          position = {
            x: parentNode.position.x - 150,
            y: parentNode.position.y + (index * 50),
          };
          sourceHandle = 'right';
          targetHandle = 'left';
        }
      }

      const subNode: Node = {
        id: subNodeId,
        type: 'custom',
        data: { label: 'サブアイデア' },
        position,
      };

      let edge: Edge;
      
      if (direction === 'backward') {
        edge = {
          id: `edge-${subNodeId}-${parentId}`,
          source: subNodeId,
          target: parentId,
          type: layoutStyle === 'horizontal' ? 'smoothstep' : 'default',
          style: layoutStyle === 'horizontal' ? { stroke: '#1a192b', strokeWidth: 2 } : undefined,
          sourceHandle,
          targetHandle,
        };
      } else {
        edge = {
          id: `edge-${parentId}-${subNodeId}`,
          source: parentId,
          target: subNodeId,
          type: layoutStyle === 'horizontal' ? 'smoothstep' : 'default',
          style: layoutStyle === 'horizontal' ? { stroke: '#1a192b', strokeWidth: 2 } : undefined,
          sourceHandle,
          targetHandle,
        };
      }

      newNodes.push(subNode);
      newEdges.push(edge);
    });

    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);
  }, [selectedNodes, getNode, setNodes, setEdges, layoutStyle]);

  const changeSelectedNodeColor = useCallback(() => {
    if (selectedNodes.length === 0) return;
    
    setNodes((nds) =>
      nds.map((node) =>
        selectedNodes.includes(node.id)
          ? { ...node, data: { ...node.data, color: selectedNodeColor } }
          : node
      )
    );
  }, [selectedNodes, selectedNodeColor, setNodes]);

  const changeSelectedEdgeStyle = useCallback((edgeStyle: string) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (selectedEdges.includes(edge.id)) {
          if (edgeStyle === 'dashed') {
            return { ...edge, style: { ...edge.style, strokeDasharray: '5,5' } };
          } else if (edgeStyle === 'dotted') {
            return { ...edge, style: { ...edge.style, strokeDasharray: '2,2' } };
          } else {
            const { style: edgeStyle, ...rest } = edge;
            return { ...rest, style: { stroke: '#1a192b', strokeWidth: 1 } };
          }
        }
        return edge;
      })
    );
  }, [selectedEdges, setEdges]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  // 複数選択ノードの削除機能
  const deleteSelectedNodes = useCallback(() => {
    if (selectedNodes.length === 0) return;
    
    // 現在のノードとエッジの状態を直接取得
    const currentNodes = nodes;
    const currentEdges = edges;
    
    // ノードを削除
    const filteredNodes = currentNodes.filter((node) => !selectedNodes.includes(node.id));
    
    // エッジを削除
    const filteredEdges = currentEdges.filter((edge) => 
      !selectedNodes.includes(edge.source) && !selectedNodes.includes(edge.target)
    );
    
    // 状態を更新
    setNodes(filteredNodes);
    setEdges(filteredEdges);
    
    // 選択状態をクリア
    setSelectedNodes([]);
  }, [selectedNodes, nodes, edges, setNodes, setEdges, setSelectedNodes]);

  // 保存機能
  const saveMindMap = useCallback((name?: string) => {
    try {
      console.log('保存機能開始');
      console.log('ノード数:', nodes.length);
      console.log('エッジ数:', edges.length);
      
      const mindMapData: MindMapData = {
        nodes,
        edges,
        layoutStyle,
        selectedNodeColor,
        timestamp: Date.now(),
        name: name || `マインドマップ_${new Date().toLocaleString('ja-JP')}`,
      };

      console.log('保存データ作成完了:', mindMapData.name);

      const dataStr = JSON.stringify(mindMapData, null, 2);
      console.log('JSON文字列化完了, サイズ:', dataStr.length);
      
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      console.log('Blob作成完了, サイズ:', dataBlob.size);
      
      // 方法1: 通常のダウンロード
      try {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `${mindMapData.name}.json`;
        
        console.log('ダウンロードリンク作成:', link.href);
        console.log('ファイル名:', link.download);
        
        // リンクをクリックしてダウンロードを開始
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(link.href);
        
        console.log('保存完了');
        alert(`マインドマップ「${mindMapData.name}」を保存しました。`);
      } catch (downloadError) {
        console.error('ダウンロードエラー:', downloadError);
        
        // 方法2: 代替手段 - クリップボードにコピー
        console.log('代替手段: クリップボードにコピー');
        navigator.clipboard.writeText(dataStr).then(() => {
          alert(`マインドマップ「${mindMapData.name}」のデータをクリップボードにコピーしました。\n手動でファイルに保存してください。`);
        }).catch((clipboardError) => {
          console.error('クリップボードエラー:', clipboardError);
          
          // 方法3: 最終手段 - コンソールに出力
          console.log('最終手段: コンソールに出力');
          console.log('=== マインドマップデータ ===');
          console.log(dataStr);
          alert(`マインドマップ「${mindMapData.name}」のデータをコンソールに出力しました。\n開発者ツールのコンソールを確認してください。`);
        });
      }
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました: ' + error);
    }
  }, [nodes, edges, layoutStyle, selectedNodeColor]);

  // 読み込み機能
  const loadMindMap = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const mindMapData: MindMapData = JSON.parse(content);
        
        // データの検証
        if (!mindMapData.nodes || !mindMapData.edges) {
          alert('無効なファイル形式です。');
          return;
        }

        // 状態を復元
        setNodes(mindMapData.nodes);
        setEdges(mindMapData.edges);
        if (mindMapData.layoutStyle) {
          setLayoutStyle(mindMapData.layoutStyle);
        }
        if (mindMapData.selectedNodeColor) {
          setSelectedNodeColor(mindMapData.selectedNodeColor);
        }

        alert(`マインドマップ「${mindMapData.name}」を読み込みました。`);
      } catch (error) {
        alert('ファイルの読み込みに失敗しました。');
        console.error('Load error:', error);
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges, setLayoutStyle, setSelectedNodeColor]);

  // ファイル選択ダイアログを開く
  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        loadMindMap(file);
      }
    };
    input.click();
  }, [loadMindMap]);

  // 選択状態が変更されたときに色を自動適用
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (selectedNodes.includes(node.id)) {
          return { ...node, data: { ...node.data, selectedColor: '#87CEEB' } };
        } else {
          const { selectedColor, ...dataWithoutSelectedColor } = node.data;
          return { ...node, data: dataWithoutSelectedColor };
        }
      })
    );
  }, [selectedNodes, setNodes]);

  // 提案ノード・エッジの追加
  const addProposalNodes = useCallback((proposalNodes: Node[], proposalEdges: Edge[]) => {
    setNodes((nds) => [...nds, ...proposalNodes]);
    setEdges((eds) => [...eds, ...proposalEdges]);
  }, [setNodes, setEdges]);

  // 提案の確定（点線を実線に変更）
  const acceptProposal = useCallback((proposalId: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.data?.proposalId === proposalId) {
          return {
            ...node,
            data: { ...node.data, isProposal: false },
            style: { 
              ...node.style,
              border: '2px solid #4CAF50',
              backgroundColor: 'white'
            }
          };
        }
        return node;
      })
    );

    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.data?.proposalId === proposalId) {
          return {
            ...edge,
            style: { 
              ...edge.style,
              stroke: '#1a192b',
              strokeDasharray: undefined,
              strokeWidth: 1
            },
            data: { ...edge.data, isProposal: false }
          };
        }
        return edge;
      })
    );
  }, [setNodes, setEdges]);

  // 提案の破棄（提案ノード・エッジを削除）
  const rejectProposal = useCallback((proposalId: string) => {
    setNodes((nds) => nds.filter((node) => node.data?.proposalId !== proposalId));
    setEdges((eds) => eds.filter((edge) => edge.data?.proposalId !== proposalId));
  }, [setNodes, setEdges]);

  return {
    nodes,
    edges,
    selectedNodes,
    selectedEdges,
    layoutStyle,
    selectedNodeColor,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onSelectionChange,
    addNode,
    addSubNodes,
    changeSelectedNodeColor,
    changeSelectedEdgeStyle,
    deleteNode,
    deleteSelectedNodes,
    saveMindMap,
    loadMindMap,
    openFileDialog,
    setLayoutStyle,
    setSelectedNodeColor,
    setSelectedNodes,
    addProposalNodes,
    acceptProposal,
    rejectProposal,
  };
} 