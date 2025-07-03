import React, { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { usePipelineStore } from '../stores/pipelineStore';
import { useHistoryStore } from '../stores/historyStore';

interface HotKeysProps {
  onOpenCommandPalette: () => void;
}

export const HotKeys: React.FC<HotKeysProps> = ({ onOpenCommandPalette }) => {
  const { 
    selectedNodes, 
    selectedConnections, 
    removeNode, 
    removeConnection,
    clearSelection,
    executePipeline,
    newPipeline,
    savePipeline
  } = usePipelineStore();
  
  const { undo, redo, canUndo, canRedo } = useHistoryStore();

  // Command palette
  useHotkeys('cmd+k, ctrl+k', (e) => {
    e.preventDefault();
    onOpenCommandPalette();
  });

  // Undo/Redo
  useHotkeys('cmd+z, ctrl+z', (e) => {
    e.preventDefault();
    if (canUndo) {
      const previousState = undo();
      if (previousState) {
        usePipelineStore.setState({ pipeline: previousState });
      }
    }
  });

  useHotkeys('cmd+shift+z, ctrl+shift+z, cmd+y, ctrl+y', (e) => {
    e.preventDefault();
    if (canRedo) {
      const nextState = redo();
      if (nextState) {
        usePipelineStore.setState({ pipeline: nextState });
      }
    }
  });

  // Delete selected items
  useHotkeys('delete, backspace', (e) => {
    e.preventDefault();
    selectedNodes.forEach(nodeId => removeNode(nodeId));
    selectedConnections.forEach(connId => removeConnection(connId));
  });

  // Select all (TODO: implement select all)
  useHotkeys('cmd+a, ctrl+a', (e) => {
    e.preventDefault();
    // TODO: Select all nodes
  });

  // Clear selection
  useHotkeys('escape', (e) => {
    e.preventDefault();
    clearSelection();
  });

  // Save pipeline
  useHotkeys('cmd+s, ctrl+s', (e) => {
    e.preventDefault();
    savePipeline();
  });

  // New pipeline
  useHotkeys('cmd+n, ctrl+n', (e) => {
    e.preventDefault();
    newPipeline();
  });

  // Execute pipeline
  useHotkeys('cmd+enter, ctrl+enter', (e) => {
    e.preventDefault();
    executePipeline();
  });

  // Copy (TODO: implement copy/paste)
  useHotkeys('cmd+c, ctrl+c', (e) => {
    e.preventDefault();
    // TODO: Copy selected nodes
  });

  // Paste (TODO: implement copy/paste)
  useHotkeys('cmd+v, ctrl+v', (e) => {
    e.preventDefault();
    // TODO: Paste nodes
  });

  return null; // This component doesn't render anything
};