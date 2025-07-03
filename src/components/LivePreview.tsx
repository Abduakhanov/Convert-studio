import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Download, Loader2 } from 'lucide-react';
import { NodeInstance } from '../types/node-spec';

interface LivePreviewProps {
  node: NodeInstance;
  isVisible: boolean;
  onToggle: () => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ node, isVisible, onToggle }) => {
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && node.outputs && node.nodeSpec.uiMeta.preview?.enabled) {
      loadPreview();
    }
  }, [isVisible, node.outputs]);

  const loadPreview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate preview loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock preview data based on node type
      if (node.nodeSpec.metadata.category === 'image') {
        setPreviewData({
          type: 'image',
          url: 'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=400',
          size: '1024x768',
          format: 'JPEG'
        });
      } else if (node.nodeSpec.metadata.category === 'document') {
        setPreviewData({
          type: 'document',
          pages: 5,
          size: '2.3 MB',
          format: 'PDF'
        });
      } else if (node.nodeSpec.metadata.category === 'ai') {
        setPreviewData({
          type: 'text',
          content: 'This is a sample AI-generated summary of the input document. The content has been processed and condensed to highlight the key points and main ideas.',
          wordCount: 156,
          language: 'English'
        });
      }
    } catch (err) {
      setError('Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  const renderPreviewContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading preview...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-8 text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={loadPreview}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    if (!previewData) {
      return (
        <div className="py-8 text-center text-gray-500">
          No preview available
        </div>
      );
    }

    switch (previewData.type) {
      case 'image':
        return (
          <div className="space-y-3">
            <img 
              src={previewData.url} 
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="text-sm text-gray-600 space-y-1">
              <div>Size: {previewData.size}</div>
              <div>Format: {previewData.format}</div>
            </div>
          </div>
        );
      
      case 'document':
        return (
          <div className="space-y-3">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-400 mb-2">📄</div>
              <div className="text-sm text-gray-600">Document Preview</div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Pages: {previewData.pages}</div>
              <div>Size: {previewData.size}</div>
              <div>Format: {previewData.format}</div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed">
              {previewData.content}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Words: {previewData.wordCount}</div>
              <div>Language: {previewData.language}</div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-900">Live Preview</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {/* TODO: Implement download */}}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Close preview"
          >
            <EyeOff className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="p-3">
        {renderPreviewContent()}
      </div>
    </div>
  );
};