import { useEffect } from 'react';

export function useKeyboardShortcuts(
  addSubNodes: (direction: 'forward' | 'backward') => void,
  deleteSelectedNodes?: () => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        const direction = event.shiftKey ? 'backward' : 'forward';
        addSubNodes(direction);
      }
      
      if (event.key === 'Delete' && deleteSelectedNodes) {
        event.preventDefault();
        deleteSelectedNodes();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [addSubNodes, deleteSelectedNodes]);
} 