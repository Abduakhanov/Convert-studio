import React from 'react';
import { Node } from 'reactflow';
import { usePipelineStore } from '../stores/pipelineStore';
import { Parameter } from '../types';
import * as Icons from 'lucide-react';

interface PropertyPanelProps {
  node: Node | null;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ node }) => {
  const updateNodeData = usePipelineStore((state) => state.updateNodeData);
  
  if (!node) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Icons.Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select a node to view properties</p>
        </div>
      </div>
    );
  }

  const { data } = node;
  const parameters = data.parameters || [];
  const parameterValues = data.parameters || {};

  const handleParameterChange = (paramName: string, value: any) => {
    updateNodeData(node.id, {
      parameters: {
        ...parameterValues,
        [paramName]: value,
      },
    });
  };

  const renderParameterInput = (param: Parameter) => {
    const currentValue = parameterValues[param.name] ?? param.default;

    switch (param.type) {
      case 'string':
        return (
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handleParameterChange(param.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={currentValue || ''}
            min={param.min}
            max={param.max}
            onChange={(e) => handleParameterChange(param.name, parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        );
      
      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentValue || false}
              onChange={(e) => handleParameterChange(param.name, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">
              {currentValue ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        );
      
      case 'select':
        return (
          <select
            value={currentValue || ''}
            onChange={(e) => handleParameterChange(param.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            {param.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${data.color} text-white flex-shrink-0`}>
            {React.createElement(Icons[data.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>, {
              className: 'w-5 h-5'
            })}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {data.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {data.description}
            </p>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className="flex-1 overflow-y-auto p-6">
        {data.parameters && data.parameters.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Parameters
            </h3>
            
            {data.parameters.map((param: Parameter) => (
              <div key={param.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {param.name.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {renderParameterInput(param)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <Icons.Settings className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No parameters available</p>
          </div>
        )}
      </div>

      {/* Node Info */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Type:</span>
            <span className="font-medium text-gray-900 capitalize">{data.type}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Category:</span>
            <span className="font-medium text-gray-900 capitalize">{data.category}</span>
          </div>
          
          {data.inputMime && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Input:</span>
              <span className="font-medium text-gray-900">{data.inputMime}</span>
            </div>
          )}
          
          {data.outputMime && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Output:</span>
              <span className="font-medium text-gray-900">{data.outputMime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};