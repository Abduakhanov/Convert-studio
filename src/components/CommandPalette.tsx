import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { Search, Plus, FileText, Image, Music, Film, Brain, Zap } from 'lucide-react';
import { NODE_SPECS } from '../data/nodeSpecs';
import { usePipelineStore } from '../stores/pipelineStore';
import { NodeInstance } from '../types/node-spec';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons = {
  document: FileText,
  image: Image,
  audio: Music,
  video: Film,
  ai: Brain,
  utility: Zap
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const addNode = usePipelineStore(state => state.addNode);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
        <Command className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center border-b border-gray-200 px-4">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <Command.Input
              placeholder="Search nodes or type a command..."
              value={search}
              onValueChange={setSearch}
              className="flex-1 py-4 text-lg bg-transparent border-none outline-none placeholder-gray-400"
            />
          </div>
          
          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-gray-500">
              No nodes found for "{search}"
            </Command.Empty>

            <Command.Group heading="Add Nodes">
              {NODE_SPECS.map((spec) => {
                const IconComponent = categoryIcons[spec.metadata.category] || Plus;
                return (
                  <Command.Item
                    key={spec.id}
                    value={`${spec.metadata.name} ${spec.metadata.description} ${spec.metadata.tags.join(' ')}`}
                    onSelect={() => handleAddNode(spec.id)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: spec.uiMeta.color }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{spec.metadata.name}</div>
                      <div className="text-sm text-gray-500">{spec.metadata.description}</div>
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {spec.metadata.category}
                    </div>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};