import React, { useState } from 'react';
import { Node } from 'reactflow';
import { ToolBar } from './components/ToolBar';
import { FileUpload } from './components/FileUpload';
import { NodeLibrary } from './components/NodeLibrary';
import { PipelineCanvasWithProvider } from './components/PipelineCanvas';
import { PropertyPanel } from './components/PropertyPanel';
import { ConversionNode } from './types';

function App() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [draggedNode, setDraggedNode] = useState<ConversionNode | null>(null);

  const handleNodeDragStart = (node: ConversionNode) => {
    setDraggedNode(node);
  };

  const handleNodeSelect = (node: Node | null) => {
    setSelectedNode(node);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <ToolBar />
      
      {/* File Upload */}
      <FileUpload />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Library */}
        <NodeLibrary onNodeDragStart={handleNodeDragStart} />
        
        {/* Canvas */}
        <PipelineCanvasWithProvider onNodeSelect={handleNodeSelect} />
        
        {/* Properties Panel */}
        <PropertyPanel node={selectedNode} />
      </div>
    </div>
  );
}

export default App;