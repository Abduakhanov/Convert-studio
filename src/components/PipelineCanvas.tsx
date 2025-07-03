import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { ConversionNode } from './ConversionNode';
import { usePipelineStore } from '../stores/pipelineStore';
import { ConversionNode as ConversionNodeType } from '../types';

const nodeTypes = {
  conversion: ConversionNode,
};

interface PipelineCanvasProps {
  onNodeSelect: (node: Node | null) => void;
}

export const PipelineCanvas: React.FC<PipelineCanvasProps> = ({ onNodeSelect }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = usePipelineStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const nodeDataString = event.dataTransfer.getData('application/reactflow');
      if (!nodeDataString) return;

      const nodeData: ConversionNodeType = JSON.parse(nodeDataString);
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      addNode(nodeData, position);
    },
    [addNode]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div className="flex-1 relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls className="bg-white shadow-lg border border-gray-200" />
        <MiniMap
          className="bg-white shadow-lg border border-gray-200"
          nodeColor={(node) => {
            const data = node.data as ConversionNodeType;
            return data.color.replace('bg-', '#');
          }}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e5e7eb"
        />
      </ReactFlow>
    </div>
  );
};

export const PipelineCanvasWithProvider: React.FC<PipelineCanvasProps> = (props) => (
  <ReactFlowProvider>
    <PipelineCanvas {...props} />
  </ReactFlowProvider>
);