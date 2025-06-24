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
  const { getNode } = useReactFlow();

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
    setLayoutStyle,
    setSelectedNodeColor,
    setSelectedNodes,
  };
} 