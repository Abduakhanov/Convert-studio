import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ConversionNode } from './ConversionNode';
import { usePipelineStore } from '../stores/pipelineStore';
import { NODE_SPECS } from '../data/nodeSpecs';
import { NodeInstance } from '../types/node-spec';
import { ConnectionValidator } from './ConnectionValidator';
import { toast } from 'sonner';

const nodeTypes = {
  conversionNode: ConversionNode,
};

const CanvasContent: React.FC = () => {
  const { 
    pipeline, 
    selectedNodes, 
    addNode, 
    addConnection, 
    moveNode, 
    selectNode, 
    clearSelection,
    validateConnection 
  } = usePipelineStore();
  
  const [connectionValidator, setConnectionValidator] = useState<{
    source: string;
    sourcePort: string;
    target: string;
    targetPort: string;
    position: { x: number; y: number };
  } | null>(null);

  const { screenToFlowPosition } = useReactFlow();

  // Convert pipeline nodes to ReactFlow nodes
  const nodes: Node[] = pipeline.nodes.map(node => ({
    id: node.id,
    type: 'conversionNode',
    position: node.position,
    data: node,
    selected: selectedNodes.includes(node.id)
  }));

  // Convert pipeline connections to ReactFlow edges
  const edges: Edge[] = pipeline.connections.map(conn => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    sourceHandle: conn.sourcePort,
    targetHandle: conn.targetPort,
    type: 'smoothstep',
    animated: !conn.validated,
    style: {
      stroke: conn.validated ? '#10B981' : '#EF4444',
      strokeWidth: 2
    }
  }));

  const [, setNodes] = useNodesState(nodes);
  const [, setEdges] = useEdgesState(edges);

  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target || !params.sourceHandle || !params.targetHandle) {
      return;
    }

    const isValid = validateConnection(
      params.source,
      params.sourceHandle,
      params.target,
      params.targetHandle
    );

    if (isValid) {
      addConnection({
        id: crypto.randomUUID(),
        source: params.source,
        sourcePort: params.sourceHandle,
        target: params.target,
        targetPort: params.targetHandle,
        validated: true
      });
      toast.success('Connection created successfully');
    } else {
      toast.error('Invalid connection: incompatible types or would create cycle');
    }
  }, [validateConnection, addConnection]);

  const onNodeDrag = useCallback((event: any, node: Node) => {
    moveNode(node.id, node.position);
  }, [moveNode]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    selectNode(node.id, event.ctrlKey || event.metaKey);
  }, [selectNode]);

  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    try {
      const data = JSON.parse(event.dataTransfer.getData('application/json'));
      
      if (data.type === 'node' && data.nodeSpecId) {
        const nodeSpec = NODE_SPECS.find(spec => spec.id === data.nodeSpecId);
        if (!nodeSpec) return;

        const newNode: NodeInstance = {
          id: crypto.randomUUID(),
          nodeSpec,
          position,
          parameters: nodeSpec.parameters.reduce((acc, param) => {
            acc[param.id] = param.defaultValue;
            return acc;
          }, {} as Record<string, any>),
          status: 'idle'
        };

        addNode(newNode);
        toast.success(`Added ${nodeSpec.metadata.name} node`);
      }
    } catch (error) {
      console.error('Failed to parse drop data:', error);
    }
  }, [addNode, screenToFlowPosition]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        <Background color="#E5E7EB" size={1} />
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-lg" />
        <MiniMap 
          className="bg-white border border-gray-200 rounded-lg shadow-lg"
          nodeColor={(node) => {
            const nodeData = node.data as NodeInstance;
            return nodeData.nodeSpec.uiMeta.color;
          }}
        />
      </ReactFlow>

      {/* Connection Validator Tooltip */}
      {connectionValidator && (
        <div 
          className="absolute z-50"
          style={{ 
            left: connectionValidator.position.x, 
            top: connectionValidator.position.y 
          }}
        >
          <ConnectionValidator
            sourceNodeId={connectionValidator.source}
            sourcePortId={connectionValidator.sourcePort}
            targetNodeId={connectionValidator.target}
            targetPortId={connectionValidator.targetPort}
          />
        </div>
      )}
    </div>
  );
};

export const PipelineCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  );
};