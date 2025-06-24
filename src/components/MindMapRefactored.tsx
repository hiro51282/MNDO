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

export function MindMapRefactored() {
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
    setLayoutStyle,
    setSelectedNodeColor,
    setSelectedNodes,
  } = useMindMap();

  const { aiInput, setAiInput, handleAiInput } = useAiAssistant(
    nodes,
    addSubNodes,
    setSelectedNodes
  );

  useKeyboardShortcuts(addSubNodes);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ControlPanel
        selectedNodesCount={selectedNodes.length}
        selectedEdgesCount={selectedEdges.length}
        layoutStyle={layoutStyle}
        selectedNodeColor={selectedNodeColor}
        onAddNode={addNode}
        onAddSubNodes={() => addSubNodes('forward')}
        onLayoutStyleChange={setLayoutStyle}
        onNodeColorChange={setSelectedNodeColor}
        onChangeNodeColor={changeSelectedNodeColor}
        onEdgeStyleChange={changeSelectedEdgeStyle}
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