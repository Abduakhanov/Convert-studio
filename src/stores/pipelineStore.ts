import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { NodeInstance, Pipeline, Connection } from '../types/node-spec';
import { UploadedFile } from '../types';
import { useHistoryStore } from './historyStore';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { NODE_SPECS } from '../data/nodeSpecs';

interface PipelineStore {
  pipeline: Pipeline;
  selectedNodes: string[];
  selectedConnections: string[];
  uploadedFiles: UploadedFile[];
  isExecuting: boolean;
  
  // Actions
  addNode: (node: NodeInstance) => void;
  addFileNode: (file: UploadedFile) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<NodeInstance>) => void;
  moveNode: (nodeId: string, position: { x: number; y: number }) => void;
  
  addConnection: (connection: Connection) => void;
  removeConnection: (connectionId: string) => void;
  validateConnection: (sourceNodeId: string, sourcePortId: string, targetNodeId: string, targetPortId: string) => boolean;
  
  selectNode: (nodeId: string, multiSelect?: boolean) => void;
  selectConnection: (connectionId: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileId: string) => void;
  
  executePipeline: () => void;
  stopExecution: () => void;
  savePipeline: () => void;
  newPipeline: () => void;
}

const createEmptyPipeline = (): Pipeline => ({
  id: crypto.randomUUID(),
  name: 'Untitled Pipeline',
  description: '',
  version: '1.0.0',
  nodes: [],
  connections: [],
  metadata: {
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    tags: []
  }
});

export const usePipelineStore = create<PipelineStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      pipeline: createEmptyPipeline(),
      selectedNodes: [],
      selectedConnections: [],
      uploadedFiles: [],
      isExecuting: false,

      addNode: (node) => {
        set((draft) => {
          draft.pipeline.nodes.push(node);
          draft.pipeline.metadata.modified = new Date().toISOString();
        });
        
        // Save to history
        useHistoryStore.getState().pushState(get().pipeline);
        toast.success(`Added ${node.nodeSpec.metadata.name}`);
      },

      addFileNode: (file) => {
        const fileInputSpec = NODE_SPECS.find(spec => spec.id === 'file-input');
        if (!fileInputSpec) return;

        const nodeId = nanoid();
        const newNode: NodeInstance = {
          id: nodeId,
          nodeSpec: fileInputSpec,
          position: { 
            x: 50, 
            y: 50 + get().pipeline.nodes.length * 100 
          },
          parameters: {},
          status: 'idle',
          outputs: {
            output: file
          }
        };

        set((draft) => {
          // Add file to uploaded files if not already there
          if (!draft.uploadedFiles.find(f => f.id === file.id)) {
            draft.uploadedFiles.push(file);
          }
          
          // Add file input node
          draft.pipeline.nodes.push(newNode);
          draft.pipeline.metadata.modified = new Date().toISOString();
        });

        useHistoryStore.getState().pushState(get().pipeline);
        toast.success(`Added ${file.name} to pipeline`);
      },

      removeNode: (nodeId) => {
        set((draft) => {
          // Remove node
          draft.pipeline.nodes = draft.pipeline.nodes.filter(n => n.id !== nodeId);
          
          // Remove connections involving this node
          draft.pipeline.connections = draft.pipeline.connections.filter(
            c => c.source !== nodeId && c.target !== nodeId
          );
          
          // Remove from selection
          draft.selectedNodes = draft.selectedNodes.filter(id => id !== nodeId);
          
          draft.pipeline.metadata.modified = new Date().toISOString();
        });
        
        useHistoryStore.getState().pushState(get().pipeline);
        toast.success('Node removed');
      },

      updateNode: (nodeId, updates) => {
        set((draft) => {
          const node = draft.pipeline.nodes.find(n => n.id === nodeId);
          if (node) {
            Object.assign(node, updates);
            draft.pipeline.metadata.modified = new Date().toISOString();
          }
        });
        
        useHistoryStore.getState().pushState(get().pipeline);
      },

      moveNode: (nodeId, position) => {
        set((draft) => {
          const node = draft.pipeline.nodes.find(n => n.id === nodeId);
          if (node) {
            node.position = position;
          }
        });
      },

      addConnection: (connection) => {
        set((draft) => {
          draft.pipeline.connections.push(connection);
          draft.pipeline.metadata.modified = new Date().toISOString();
        });
        
        useHistoryStore.getState().pushState(get().pipeline);
      },

      removeConnection: (connectionId) => {
        set((draft) => {
          draft.pipeline.connections = draft.pipeline.connections.filter(c => c.id !== connectionId);
          draft.selectedConnections = draft.selectedConnections.filter(id => id !== connectionId);
          draft.pipeline.metadata.modified = new Date().toISOString();
        });
        
        useHistoryStore.getState().pushState(get().pipeline);
      },

      validateConnection: (sourceNodeId, sourcePortId, targetNodeId, targetPortId) => {
        const { pipeline } = get();
        
        // Check for cycles using DFS
        const hasPath = (from: string, to: string, visited = new Set<string>()): boolean => {
          if (from === to) return true;
          if (visited.has(from)) return false;
          
          visited.add(from);
          
          const outgoingConnections = pipeline.connections.filter(c => c.source === from);
          for (const conn of outgoingConnections) {
            if (hasPath(conn.target, to, visited)) {
              return true;
            }
          }
          
          return false;
        };
        
        // Would this connection create a cycle?
        if (hasPath(targetNodeId, sourceNodeId)) {
          return false;
        }
        
        return true;
      },

      selectNode: (nodeId, multiSelect = false) => {
        set((draft) => {
          if (multiSelect) {
            if (draft.selectedNodes.includes(nodeId)) {
              draft.selectedNodes = draft.selectedNodes.filter(id => id !== nodeId);
            } else {
              draft.selectedNodes.push(nodeId);
            }
          } else {
            draft.selectedNodes = [nodeId];
          }
          draft.selectedConnections = [];
        });
      },

      selectConnection: (connectionId, multiSelect = false) => {
        set((draft) => {
          if (multiSelect) {
            if (draft.selectedConnections.includes(connectionId)) {
              draft.selectedConnections = draft.selectedConnections.filter(id => id !== connectionId);
            } else {
              draft.selectedConnections.push(connectionId);
            }
          } else {
            draft.selectedConnections = [connectionId];
          }
          draft.selectedNodes = [];
        });
      },

      clearSelection: () => {
        set((draft) => {
          draft.selectedNodes = [];
          draft.selectedConnections = [];
        });
      },

      addUploadedFile: (file) => {
        set((draft) => {
          draft.uploadedFiles.push(file);
        });
      },

      removeUploadedFile: (fileId) => {
        set((draft) => {
          const file = draft.uploadedFiles.find(f => f.id === fileId);
          if (file) {
            URL.revokeObjectURL(file.url);
            draft.uploadedFiles = draft.uploadedFiles.filter(f => f.id !== fileId);
          }
        });
      },

      executePipeline: () => {
        const { pipeline } = get();
        
        if (pipeline.nodes.length === 0) {
          toast.error('Pipeline is empty');
          return;
        }
        
        set((draft) => {
          draft.isExecuting = true;
          // Set all nodes to running status
          draft.pipeline.nodes.forEach(node => {
            node.status = 'running';
            node.progress = 0;
          });
        });
        
        // Simulate execution
        const nodes = pipeline.nodes;
        let completed = 0;
        
        const executeNode = (nodeIndex: number) => {
          if (nodeIndex >= nodes.length) {
            set((draft) => {
              draft.isExecuting = false;
            });
            toast.success('Pipeline completed successfully!');
            return;
          }
          
          const node = nodes[nodeIndex];
          
          // Simulate progress
          let progress = 0;
          const progressInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
              progress = 100;
              clearInterval(progressInterval);
              
              set((draft) => {
                const currentNode = draft.pipeline.nodes.find(n => n.id === node.id);
                if (currentNode) {
                  currentNode.status = 'completed';
                  currentNode.progress = 100;
                }
              });
              
              completed++;
              setTimeout(() => executeNode(nodeIndex + 1), 500);
            } else {
              set((draft) => {
                const currentNode = draft.pipeline.nodes.find(n => n.id === node.id);
                if (currentNode) {
                  currentNode.progress = progress;
                }
              });
            }
          }, 200);
        };
        
        executeNode(0);
        toast.info('Pipeline execution started');
      },

      stopExecution: () => {
        set((draft) => {
          draft.isExecuting = false;
          draft.pipeline.nodes.forEach(node => {
            if (node.status === 'running') {
              node.status = 'idle';
              node.progress = undefined;
            }
          });
        });
        toast.warning('Pipeline execution stopped');
      },

      savePipeline: () => {
        const { pipeline } = get();
        
        // Save to localStorage for now
        const savedPipelines = JSON.parse(localStorage.getItem('convert-studio-pipelines') || '[]');
        const existingIndex = savedPipelines.findIndex((p: Pipeline) => p.id === pipeline.id);
        
        if (existingIndex >= 0) {
          savedPipelines[existingIndex] = pipeline;
        } else {
          savedPipelines.push(pipeline);
        }
        
        localStorage.setItem('convert-studio-pipelines', JSON.stringify(savedPipelines));
        toast.success('Pipeline saved');
      },

      newPipeline: () => {
        set((draft) => {
          draft.pipeline = createEmptyPipeline();
          draft.selectedNodes = [];
          draft.selectedConnections = [];
          draft.uploadedFiles = [];
          draft.isExecuting = false;
        });
        
        useHistoryStore.getState().clear();
        toast.success('New pipeline created');
      }
    }))
  )
);