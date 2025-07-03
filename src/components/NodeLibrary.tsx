import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { NODE_SPECS } from '../data/nodeSpecs';
import { usePipelineStore } from '../stores/pipelineStore';
import { NodeInstance } from '../types/node-spec';
import * as LucideIcons from 'lucide-react';

const categoryLabels = {
  document: 'Document',
  image: 'Image',
  audio: 'Audio', 
  video: 'Video',
  ai: 'AI Processing',
  utility: 'Utilities'
};

export const NodeLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['document', 'image', 'ai'])
  );
  const addNode = usePipelineStore(state => state.addNode);

  const filteredSpecs = NODE_SPECS.filter(spec =>
    spec.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spec.metadata.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spec.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedSpecs = filteredSpecs.reduce((acc, spec) => {
    const category = spec.metadata.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(spec);
    return acc;
  }, {} as Record<string, typeof NODE_SPECS>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddNode = (nodeSpecId: string) => {
    const nodeSpec = NODE_SPECS.find(spec => spec.id === nodeSpecId);
    if (!nodeSpec) return;

    const newNode: NodeInstance = {
      id: crypto.randomUUID(),
      nodeSpec,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      parameters: nodeSpec.parameters.reduce((acc, param) => {
        acc[param.id] = param.defaultValue;
        return acc;
      }, {} as Record<string, any>),
      status: 'idle'
    };

    addNode(newNode);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Node Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedSpecs).map(([category, specs]) => (
          <div key={category} className="space-y-2">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="font-medium text-gray-700 capitalize">
                {categoryLabels[category as keyof typeof categoryLabels] || category}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {specs.length}
                </span>
                {expandedCategories.has(category) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>

            {expandedCategories.has(category) && (
              <div className="space-y-1 ml-2">
                {specs.map((spec) => {
                  const IconComponent = (LucideIcons as any)[spec.uiMeta.icon] || LucideIcons.Box;
                  
                  return (
                    <div
                      key={spec.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({
                          type: 'node',
                          nodeSpecId: spec.id
                        }));
                      }}
                      onClick={() => handleAddNode(spec.id)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all group"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: spec.uiMeta.color }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                          {spec.metadata.name}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-2">
                          {spec.metadata.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {Object.keys(groupedSpecs).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No nodes found</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};