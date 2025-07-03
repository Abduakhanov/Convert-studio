import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, FileText, Music, Film, Database, Presentation } from 'lucide-react';
import { usePipelineStore } from '../stores/pipelineStore';
import { UploadedFile } from '../types';
import { toast } from 'sonner';
import mime from 'mime';

export const FileUpload: React.FC = () => {
  const { addFileNode, uploadedFiles, removeUploadedFile } = usePipelineStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      // Create uploaded file record
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type || mime.getType(file.name) || 'application/octet-stream',
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
      };
      
      // Add to uploaded files
      addFileNode(uploadedFile);
      
      // Show success toast with suggested conversion
      const suggestions = getSuggestedConversions(uploadedFile.type);
      if (suggestions.length > 0) {
        toast.success(`File uploaded! Suggested: ${suggestions[0]}`, {
          action: {
            label: 'Add Converter',
            onClick: () => {
              // TODO: Auto-add suggested converter node
              toast.info('Auto-converter coming soon!');
            }
          }
        });
      } else {
        toast.success(`${file.name} uploaded successfully`);
      }
    });
  }, [addFileNode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: true,
    maxSize: 100 * 1024 * 1024, // 100MB limit
  });

  const getSuggestedConversions = (mimeType: string): string[] => {
    const suggestions: Record<string, string[]> = {
      'application/pdf': ['PDF → DOCX', 'PDF → TXT (OCR)'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['DOCX → PDF'],
      'image/png': ['PNG → JPEG', 'PNG → WebP'],
      'image/jpeg': ['JPEG → PNG', 'JPEG → WebP', 'JPEG → TXT (OCR)'],
      'image/gif': ['GIF → MP4'],
      'video/mp4': ['MP4 → GIF'],
      'audio/wav': ['WAV → MP3'],
      'text/csv': ['CSV → XLSX'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['PPTX → PDF']
    };
    
    return suggestions[mimeType] || [];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Film;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf') || type.includes('document') || type.includes('presentation')) return FileText;
    if (type.includes('spreadsheet') || type.includes('csv')) return Database;
    if (type.includes('presentation')) return Presentation;
    return File;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-25'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
          isDragActive ? 'text-blue-500' : 'text-gray-400'
        }`} />
        
        {isDragActive ? (
          <div>
            <p className="text-lg font-medium text-blue-600 mb-2">Drop files here!</p>
            <p className="text-sm text-blue-500">Release to add to pipeline</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports PDF, DOCX, images, audio, video and more
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Upload className="w-4 h-4" />
              Choose Files
            </button>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-400">
          Maximum file size: 100MB
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="grid gap-3">
            {uploadedFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              const suggestions = getSuggestedConversions(file.type);
              
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileIcon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>Uploaded {file.uploadedAt.toLocaleTimeString()}</span>
                      {suggestions.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600">
                            Suggested: {suggestions[0]}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {suggestions.length > 0 && (
                      <button
                        onClick={() => {
                          toast.info('Auto-converter coming soon!');
                        }}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Quick Convert
                      </button>
                    )}
                    <button
                      onClick={() => removeUploadedFile(file.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};