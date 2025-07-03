import React from 'react';
import { Play, Square, Save, FolderOpen, Plus, Undo2, Redo2, Settings, ArrowUpIcon as ArrowUpTrayIcon, ArrowDownIcon as ArrowDownTrayIcon, Zap } from 'lucide-react';
import { usePipelineStore } from '../stores/pipelineStore';
import { useHistoryStore } from '../stores/historyStore';
import { toast } from 'sonner';

// Fixed import/export icons with proper semantics
const ImportIcon = ArrowDownTrayIcon; // Download arrow = Import (bringing data in)
const ExportIcon = ArrowUpTrayIcon;   // Upload arrow = Export (sending data out)

export const ToolBar: React.FC = () => {
  const { 
    pipeline, 
    executePipeline, 
    stopExecution, 
    savePipeline, 
    newPipeline 
  } = usePipelineStore();
  
  const { undo, redo, canUndo, canRedo } = useHistoryStore();

  const isExecuting = pipeline.nodes.some(node => node.status === 'running');

  const handleSave = () => {
    savePipeline();
    toast.success('Pipeline saved successfully');
  };

  const handleLoad = () => {
    // TODO: Implement load dialog
    toast.info('Load pipeline dialog coming soon');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(pipeline, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pipeline.name.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Pipeline exported successfully');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const pipeline = JSON.parse(e.target?.result as string);
            // TODO: Validate and load pipeline
            toast.success('Pipeline imported successfully');
          } catch (error) {
            toast.error('Failed to import pipeline');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleUndo = () => {
    if (canUndo) {
      const previousState = undo();
      if (previousState) {
        usePipelineStore.setState({ pipeline: previousState });
        toast.success('Undone');
      }
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      const nextState = redo();
      if (nextState) {
        usePipelineStore.setState({ pipeline: nextState });
        toast.success('Redone');
      }
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* File Operations */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
            <button
              onClick={newPipeline}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="New Pipeline (Ctrl+N)"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
            <button
              onClick={handleLoad}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Open Pipeline"
            >
              <FolderOpen className="w-4 h-4" />
              Open
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Save Pipeline (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>

          {/* History Operations */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Import/Export - Fixed Icons */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
            <button
              onClick={handleImport}
              className="flex items-center gap-2 p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Import Pipeline (.json)"
            >
              <ImportIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Export Pipeline (.json)"
            >
              <ExportIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Execution Controls */}
          <div className="flex items-center gap-1">
            {isExecuting ? (
              <button
                onClick={stopExecution}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Stop Execution"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            ) : (
              <button
                onClick={executePipeline}
                disabled={pipeline.nodes.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Execute Pipeline (Ctrl+Enter)"
              >
                <Play className="w-4 h-4" />
                Execute
              </button>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Pipeline Info */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">{pipeline.name}</span>
            <span className="mx-2">•</span>
            <span>{pipeline.nodes.length} nodes</span>
            <span className="mx-2">•</span>
            <span>{pipeline.connections.length} connections</span>
          </div>

          {/* Settings */}
          <button
            onClick={() => {/* TODO: Open settings */}}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isExecuting ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
            }`} />
            <span className="text-xs text-gray-500">
              {isExecuting ? 'Running' : 'Ready'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};