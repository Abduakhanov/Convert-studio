import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import * as Icons from 'lucide-react';
import { ConversionNode as ConversionNodeType } from '../types';

interface ConversionNodeData extends ConversionNodeType {
  parameters: Record<string, any>;
}

export const ConversionNode: React.FC<NodeProps<ConversionNodeData>> = ({ data, selected }) => {
  const IconComponent = Icons[data.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
  
  return (
    <div className={`bg-white border-2 rounded-xl shadow-lg min-w-[200px] transition-all duration-200 ${
      selected ? 'border-blue-500 shadow-blue-200' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Handles */}
      {data.type !== 'input' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
      )}
      {data.type !== 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
      )}
      
      {/* Node content */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${data.color} text-white flex-shrink-0`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {data.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {data.description}
            </p>
          </div>
        </div>
        
        {/* Parameters indicator */}
        {data.parameters && Object.keys(data.parameters).length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Icons.Settings className="w-3 h-3" />
            <span>{Object.keys(data.parameters).length} parameters</span>
          </div>
        )}
        
        {/* Input/Output types */}
        {data.inputMime && data.outputMime && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {data.inputMime.split('/')[1]}
            </span>
            <Icons.ArrowRight className="w-3 h-3 text-gray-400" />
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {data.outputMime.split('/')[1]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};