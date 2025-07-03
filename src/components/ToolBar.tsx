import React from 'react';
import { usePipelineStore } from '../stores/pipelineStore';
import * as Icons from 'lucide-react';

export const ToolBar: React.FC = () => {
  const {
    nodes,
    edges,
    isExecuting,
    uploadedFiles,
    executeWorkflow,
    clearWorkflow,
  } = usePipelineStore();

  const canExecute = nodes.length > 0 && uploadedFiles.length > 0;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icons.Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Convert Studio</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Icons.Circle className="w-4 h-4" />
              <span>{nodes.length} nodes</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.ArrowRight className="w-4 h-4" />
              <span>{edges.length} connections</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.File className="w-4 h-4" />
              <span>{uploadedFiles.length} files</span>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={clearWorkflow}
            disabled={nodes.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icons.Trash2 className="w-4 h-4" />
            Clear
          </button>
          
          <button
            onClick={executeWorkflow}
            disabled={!canExecute || isExecuting}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExecuting ? (
              <>
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Icons.Play className="w-4 h-4" />
                Execute
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};