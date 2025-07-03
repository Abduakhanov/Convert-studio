export interface ConversionNode {
  id: string;
  type: 'input' | 'converter' | 'ai' | 'output';
  name: string;
  description: string;
  icon: string;
  inputMime?: string;
  outputMime?: string;
  category: 'file' | 'image' | 'document' | 'audio' | 'video' | 'ai';
  color: string;
  parameters?: Parameter[];
}

export interface Parameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  default?: any;
  options?: string[];
  min?: number;
  max?: number;
}

export interface PipelineStep {
  id: string;
  nodeId: string;
  x: number;
  y: number;
  parameters: Record<string, any>;
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  steps: PipelineStep[];
  connections: Array<{
    source: string;
    target: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}