import { create } from 'zustand';
import { Node, Edge, addEdge, Connection, EdgeChange, NodeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { ConversionNode, UploadedFile } from '../types';

interface PipelineStore {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  uploadedFiles: UploadedFile[];
  isExecuting: boolean;
  
  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (nodeData: ConversionNode, position: { x: number; y: number }) => void;
  selectNode: (node: Node | null) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileId: string) => void;
  executeWorkflow: () => void;
  clearWorkflow: () => void;
}

export const usePipelineStore = create<PipelineStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  uploadedFiles: [],
  isExecuting: false,
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  
  addNode: (nodeData, position) => {
    const newNode: Node = {
      id: `${nodeData.id}-${Date.now()}`,
      type: 'conversion',
      position,
      data: {
        ...nodeData,
        parameters: nodeData.parameters?.reduce((acc, param) => {
          acc[param.name] = param.default;
          return acc;
        }, {} as Record<string, any>) || {},
      },
    };
    
    set({
      nodes: [...get().nodes, newNode],
    });
  },
  
  selectNode: (node) => {
    set({ selectedNode: node });
  },
  
  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },
  
  addUploadedFile: (file) => {
    set({
      uploadedFiles: [...get().uploadedFiles, file],
    });
  },
  
  removeUploadedFile: (fileId) => {
    set({
      uploadedFiles: get().uploadedFiles.filter((file) => file.id !== fileId),
    });
  },
  
  executeWorkflow: () => {
    set({ isExecuting: true });
    
    // Simulate workflow execution
    setTimeout(() => {
      set({ isExecuting: false });
    }, 3000);
  },
  
  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      uploadedFiles: [],
      isExecuting: false,
    });
  },
}));