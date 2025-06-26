import { useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
} from 'reactflow';
import { CustomNode } from './CustomNode';
import { ControlPanel } from './ControlPanel';
import { InfoPanel } from './InfoPanel';
import { AiAssistant } from './AiAssistant';
import { useMindMap } from '../hooks/useMindMap';
import { useAiAssistant } from '../hooks/useAiAssistant';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import 'reactflow/dist/style.css';

const nodeTypes = {
  custom: CustomNode,
};

export function MindMap() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  const {
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
    deleteSelectedNodes,
    saveMindMap,
    openFileDialog,
    addProposalNodes,
    acceptProposal,
    rejectProposal,
    setLayoutStyle,
    setSelectedNodeColor,
    setSelectedNodes,
  } = useMindMap();

  const { 
    aiInput, 
    setAiInput, 
    handleAiInput,
    isProcessing,
    currentProposal,
    handleAcceptProposal,
    handleRejectProposal,
  } = useAiAssistant(
    nodes,
    edges,
    addProposalNodes,
    acceptProposal,
    rejectProposal
  );

  useKeyboardShortcuts(addSubNodes, deleteSelectedNodes);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ControlPanel
        selectedNodesCount={selectedNodes.length}
        selectedEdgesCount={selectedEdges.length}
        layoutStyle={layoutStyle}
        selectedNodeColor={selectedNodeColor}
        onAddNode={addNode}
        onAddSubNodes={() => addSubNodes('forward')}
        onDeleteSelectedNodes={deleteSelectedNodes}
        onLayoutStyleChange={setLayoutStyle}
        onNodeColorChange={setSelectedNodeColor}
        onChangeNodeColor={changeSelectedNodeColor}
        onEdgeStyleChange={changeSelectedEdgeStyle}
        onSaveMindMap={saveMindMap}
        onLoadMindMap={openFileDialog}
      />

      <InfoPanel
        selectedNodesCount={selectedNodes.length}
        selectedEdgesCount={selectedEdges.length}
        layoutStyle={layoutStyle}
      />

      <AiAssistant
        aiInput={aiInput}
        onAiInputChange={setAiInput}
        onAiInputSubmit={handleAiInput}
        isProcessing={isProcessing}
        currentProposal={currentProposal}
        onAcceptProposal={handleAcceptProposal}
        onRejectProposal={handleRejectProposal}
      />

      <ReactFlow
        ref={reactFlowWrapper}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        multiSelectionKeyCode="Control"
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background gap={12} size={1} />
      </ReactFlow>
      
      <div style={{ position: 'absolute', bottom: '10px', right: '300px', zIndex: 1001 }}>
        <Controls />
      </div>
      
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 1000 }}>
        <MiniMap />
      </div>
    </div>
  );
} 