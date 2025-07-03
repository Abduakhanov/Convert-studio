/**
 * Node Specification v0.1
 * Contract between frontend and backend orchestrator
 */

export interface NodeSpec {
  id: string;
  type: string;
  version: string;
  metadata: NodeMetadata;
  inputs: NodePort[];
  outputs: NodePort[];
  parameters: NodeParameter[];
  uiMeta: NodeUIMeta;
}

export interface NodeMetadata {
  name: string;
  description: string;
  category: 'document' | 'image' | 'audio' | 'video' | 'ai' | 'utility';
  tags: string[];
  author?: string;
  license?: string;
  documentation?: string;
}

export interface NodePort {
  id: string;
  name: string;
  mimeTypes: string[];
  required: boolean;
  multiple: boolean;
  description?: string;
}

export interface NodeParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'file' | 'range';
  defaultValue: any;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: Array<{ value: any; label: string }>;
  };
  description?: string;
  uiHints?: {
    placeholder?: string;
    suffix?: string;
    step?: number;
  };
}

export interface NodeUIMeta {
  icon: string;
  color: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  collapsed?: boolean;
  preview?: {
    enabled: boolean;
    maxSize: number; // bytes
    supportedTypes: string[];
  };
}

// Runtime node instance
export interface NodeInstance {
  id: string;
  nodeSpec: NodeSpec;
  position: { x: number; y: number };
  parameters: Record<string, any>;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress?: number;
  error?: string;
  outputs?: Record<string, any>;
}

// Pipeline definition
export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  version: string;
  nodes: NodeInstance[];
  connections: Connection[];
  metadata: {
    created: string;
    modified: string;
    author?: string;
    tags: string[];
  };
}

export interface Connection {
  id: string;
  source: string; // node id
  sourcePort: string;
  target: string; // node id
  targetPort: string;
  validated: boolean;
}