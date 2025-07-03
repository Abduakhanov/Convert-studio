import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Settings, Play, Pause, CheckCircle, XCircle, Eye, MoreVertical } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { NodeInstance } from '../types/node-spec';
import { usePipelineStore } from '../stores/pipelineStore';
import { LivePreview } from './LivePreview';

interface ConversionNodeProps {
  data: NodeInstance;
  selected: boolean;
}

export const ConversionNode: React.FC<ConversionNodeProps> = ({ data, selected }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { updateNode, removeNode } = usePipelineStore();

  const IconComponent = (LucideIcons as any)[data.nodeSpec.uiMeta.icon] || LucideIcons.Box;

  const statusIcons = {
    idle: null,
    running: <Play className="w-3 h-3 text-blue-500 animate-pulse" />,
    completed: <CheckCircle className="w-3 h-3 text-green-500" />,
    error: <XCircle className="w-3 h-3 text-red-500" />
  };

  const statusColors = {
    idle: 'border-gray-300',
    running: 'border-blue-400 shadow-blue-100',
    completed: 'border-green-400 shadow-green-100',
    error: 'border-red-400 shadow-red-100'
  };

  const handleParameterChange = (paramId: string, value: any) => {
    updateNode(data.id, {
      parameters: {
        ...data.parameters,
        [paramId]: value
      }
    });
  };

  return (
    <div className="relative">
      <div 
        className={`
          bg-white rounded-xl border-2 shadow-lg transition-all duration-200 min-w-[200px]
          ${selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
          ${statusColors[data.status]}
          hover:shadow-xl
        `}
      >
        {/* Header */}
        <div 
          className="flex items-center gap-3 p-4 rounded-t-xl text-white"
          style={{ backgroundColor: data.nodeSpec.uiMeta.color }}
        >
          <IconComponent className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {data.nodeSpec.metadata.name}
            </div>
            <div className="text-xs opacity-80 truncate">
              {data.nodeSpec.metadata.category}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {statusIcons[data.status]}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar for running status */}
        {data.status === 'running' && data.progress !== undefined && (
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        )}

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Description */}
          <div className="text-xs text-gray-600 leading-relaxed">
            {data.nodeSpec.metadata.description}
          </div>

          {/* Key parameters */}
          {data.nodeSpec.parameters.slice(0, 2).map((param) => (
            <div key={param.id} className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                {param.name}
              </label>
              {param.type === 'select' ? (
                <select
                  value={data.parameters[param.id] || param.defaultValue}
                  onChange={(e) => handleParameterChange(param.id, e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                >
                  {param.validation?.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : param.type === 'boolean' ? (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.parameters[param.id] || param.defaultValue}
                    onChange={(e) => handleParameterChange(param.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-600">{param.description}</span>
                </label>
              ) : (
                <input
                  type={param.type === 'number' ? 'number' : 'text'}
                  value={data.parameters[param.id] || param.defaultValue}
                  onChange={(e) => handleParameterChange(param.id, 
                    param.type === 'number' ? parseFloat(e.target.value) : e.target.value
                  )}
                  placeholder={param.uiHints?.placeholder}
                  min={param.validation?.min}
                  max={param.validation?.max}
                  step={param.uiHints?.step}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {data.nodeSpec.uiMeta.preview?.enabled && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Toggle preview"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
              )}
              <button
                onClick={() => {/* TODO: Open settings panel */}}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Node settings"
              >
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            {data.status === 'error' && data.error && (
              <div className="text-xs text-red-600 truncate max-w-[100px]" title={data.error}>
                {data.error}
              </div>
            )}
          </div>
        </div>

        {/* Input Handles */}
        {data.nodeSpec.inputs.map((input, index) => (
          <Handle
            key={input.id}
            type="target"
            position={Position.Left}
            id={input.id}
            style={{
              top: 60 + index * 20,
              background: input.required ? '#EF4444' : '#6B7280',
              width: 8,
              height: 8
            }}
            title={`${input.name} (${input.mimeTypes.join(', ')})`}
          />
        ))}

        {/* Output Handles */}
        {data.nodeSpec.outputs.map((output, index) => (
          <Handle
            key={output.id}
            type="source"
            position={Position.Right}
            id={output.id}
            style={{
              top: 60 + index * 20,
              background: '#10B981',
              width: 8,
              height: 8
            }}
            title={`${output.name} (${output.mimeTypes.join(', ')})`}
          />
        ))}
      </div>

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute top-0 right-0 mt-12 mr-4 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[150px]">
          <button
            onClick={() => {/* TODO: Duplicate node */}}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            Duplicate
          </button>
          <button
            onClick={() => {/* TODO: Open settings */}}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            Settings
          </button>
          <hr className="my-1 border-gray-200" />
          <button
            onClick={() => {
              removeNode(data.id);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      )}

      {/* Live Preview */}
      {showPreview && data.nodeSpec.uiMeta.preview?.enabled && (
        <LivePreview
          node={data}
          isVisible={showPreview}
          onToggle={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};