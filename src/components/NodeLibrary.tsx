import React, { useState } from 'react';
import { conversionNodes } from '../data/nodes';
import { ConversionNode } from '../types';
import * as Icons from 'lucide-react';

interface NodeLibraryProps {
  onNodeDragStart: (node: ConversionNode) => void;
}

const categories = [
  { id: 'all', name: 'All', icon: 'Grid3X3' },
  { id: 'file', name: 'File', icon: 'File' },
  { id: 'document', name: 'Document', icon: 'FileText' },
  { id: 'image', name: 'Image', icon: 'Image' },
  { id: 'audio', name: 'Audio', icon: 'Music' },
  { id: 'video', name: 'Video', icon: 'Video' },
  { id: 'ai', name: 'AI', icon: 'Brain' },
];

export const NodeLibrary: React.FC<NodeLibraryProps> = ({ onNodeDragStart }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = conversionNodes.filter((node) => {
    const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         node.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (event: React.DragEvent, node: ConversionNode) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    onNodeDragStart(node);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Node Library</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nodes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredNodes.map((node) => {
          const IconComponent = Icons[node.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
          return (
            <div
              key={node.id}
              draggable
              onDragStart={(e) => handleDragStart(e, node)}
              className="group cursor-move bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${node.color} text-white flex-shrink-0`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                    {node.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {node.description}
                  </p>
                  {node.inputMime && node.outputMime && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {node.inputMime.split('/')[1]}
                      </span>
                      <Icons.ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {node.outputMime.split('/')[1]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};