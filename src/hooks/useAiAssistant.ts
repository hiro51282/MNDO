import { useCallback, useState } from 'react';
import { Node, Edge } from 'reactflow';

export interface AiProposal {
  id: string;
  nodes: Node[];
  edges: Edge[];
  description: string;
  timestamp: number;
}

export function useAiAssistant(
  nodes: Node[],
  edges: Edge[],
  addProposalNodes: (proposalNodes: Node[], proposalEdges: Edge[]) => void,
  acceptProposal: (proposalId: string) => void,
  rejectProposal: (proposalId: string) => void
) {
  const [aiInput, setAiInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentProposal, setCurrentProposal] = useState<AiProposal | null>(null);

  // AI提案の生成（シミュレーション）
  const generateAiProposal = useCallback(async (input: string) => {
    setIsProcessing(true);
    
    try {
      // 実際のAI API呼び出しをここに実装
      // 現在はシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const proposalId = `proposal-${Date.now()}`;
      
      // 入力内容を解析して提案を生成
      let proposalNodes: Node[] = [];
      let proposalEdges: Edge[] = [];
      let description = '';
      
      if (input.includes('ノードを追加') || input.includes('追加して')) {
        // ノード追加の提案
        const newNodeId1 = `proposal-node-${Date.now()}-1`;
        const newNodeId2 = `proposal-node-${Date.now()}-2`;
        
        proposalNodes = [
          {
            id: newNodeId1,
            type: 'custom',
            data: { 
              label: 'AI提案ノード1',
              isProposal: true,
              proposalId: proposalId
            },
            position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
            style: { 
              border: '2px dashed #ff6b6b',
              backgroundColor: 'rgba(255, 107, 107, 0.1)'
            }
          },
          {
            id: newNodeId2,
            type: 'custom',
            data: { 
              label: 'AI提案ノード2',
              isProposal: true,
              proposalId: proposalId
            },
            position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
            style: { 
              border: '2px dashed #ff6b6b',
              backgroundColor: 'rgba(255, 107, 107, 0.1)'
            }
          }
        ];
        
        // 既存のノードとの接続を提案
        if (nodes.length > 0) {
          const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
          proposalEdges = [
            {
              id: `proposal-edge-${Date.now()}-1`,
              source: randomNode.id,
              target: newNodeId1,
              style: { 
                stroke: '#ff6b6b',
                strokeDasharray: '5,5',
                strokeWidth: 2
              },
              data: { isProposal: true, proposalId: proposalId }
            },
            {
              id: `proposal-edge-${Date.now()}-2`,
              source: newNodeId1,
              target: newNodeId2,
              style: { 
                stroke: '#ff6b6b',
                strokeDasharray: '5,5',
                strokeWidth: 2
              },
              data: { isProposal: true, proposalId: proposalId }
            }
          ];
        }
        
        description = `「${input}」に基づいて2つのノードを追加する提案です。`;
      } else if (input.includes('会話') || input.includes('内容')) {
        // 会話内容のノード化提案
        const conversationNodeId = `proposal-conversation-${Date.now()}`;
        
        proposalNodes = [
          {
            id: conversationNodeId,
            type: 'custom',
            data: { 
              label: '会話内容: ' + input.substring(0, 20) + '...',
              isProposal: true,
              proposalId: proposalId
            },
            position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
            style: { 
              border: '2px dashed #4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)'
            }
          }
        ];
        
        description = `「${input}」の内容をノードとして追加する提案です。`;
      } else {
        // 汎用的な提案
        const genericNodeId = `proposal-generic-${Date.now()}`;
        
        proposalNodes = [
          {
            id: genericNodeId,
            type: 'custom',
            data: { 
              label: 'AI提案: ' + input.substring(0, 30) + '...',
              isProposal: true,
              proposalId: proposalId
            },
            position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
            style: { 
              border: '2px dashed #2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)'
            }
          }
        ];
        
        description = `「${input}」に基づく提案です。`;
      }
      
      const proposal: AiProposal = {
        id: proposalId,
        nodes: proposalNodes,
        edges: proposalEdges,
        description: description,
        timestamp: Date.now()
      };
      
      setCurrentProposal(proposal);
      addProposalNodes(proposalNodes, proposalEdges);
      
    } catch (error) {
      console.error('AI提案生成エラー:', error);
      alert('AI提案の生成に失敗しました。');
    } finally {
      setIsProcessing(false);
    }
  }, [nodes, addProposalNodes]);

  // 提案の確定
  const handleAcceptProposal = useCallback(() => {
    if (currentProposal) {
      acceptProposal(currentProposal.id);
      setCurrentProposal(null);
      setAiInput('');
    }
  }, [currentProposal, acceptProposal]);

  // 提案の破棄
  const handleRejectProposal = useCallback(() => {
    if (currentProposal) {
      rejectProposal(currentProposal.id);
      setCurrentProposal(null);
      setAiInput('');
    }
  }, [currentProposal, rejectProposal]);

  // AI入力の処理
  const handleAiInput = useCallback(() => {
    if (aiInput.trim() && !isProcessing) {
      generateAiProposal(aiInput.trim());
    }
  }, [aiInput, isProcessing, generateAiProposal]);

  return {
    aiInput,
    setAiInput,
    handleAiInput,
    isProcessing,
    currentProposal,
    handleAcceptProposal,
    handleRejectProposal,
  };
} 