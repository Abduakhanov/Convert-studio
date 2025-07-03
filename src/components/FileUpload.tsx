import React, { useCallback } from 'react';
import { usePipelineStore } from '../stores/pipelineStore';
import { UploadedFile } from '../types';
import * as Icons from 'lucide-react';

export const FileUpload: React.FC = () => {
  const { uploadedFiles, addUploadedFile, removeUploadedFile } = usePipelineStore();

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
      };
      
      addUploadedFile(uploadedFile);
    });
  }, [addUploadedFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Icons.Image;
    if (type.startsWith('video/')) return Icons.Video;
    if (type.startsWith('audio/')) return Icons.Music;
    if (type.includes('pdf')) return Icons.FileText;
    if (type.includes('word') || type.includes('document')) return Icons.FileText;
    return Icons.File;
  };

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">File Upload</h2>
        
        {/* Upload area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors"
        >
          <Icons.Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
          <p className="text-sm text-gray-500">Supports all file types</p>
          
          <input
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          >
            Browse Files
          </label>
        </div>

        {/* Uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file) => {
                const FileIcon = getFileIcon(file.type);
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <FileIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                    <button
                      onClick={() => removeUploadedFile(file.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};