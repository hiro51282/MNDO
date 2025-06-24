import { ReactFlowProvider } from 'reactflow';
import { MindMapRefactored } from './components/MindMapRefactored';

function App() {
  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <MindMapRefactored />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
