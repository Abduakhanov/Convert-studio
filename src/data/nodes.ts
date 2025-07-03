import { ConversionNode } from '../types';

export const conversionNodes: ConversionNode[] = [
  // Input nodes
  {
    id: 'file-input',
    type: 'input',
    name: 'File Input',
    description: 'Upload files to start conversion',
    icon: 'Upload',
    category: 'file',
    color: 'bg-blue-500',
  },
  
  // Document converters
  {
    id: 'pdf-to-docx',
    type: 'converter',
    name: 'PDF → DOCX',
    description: 'Convert PDF to Word document',
    icon: 'FileText',
    inputMime: 'application/pdf',
    outputMime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'document',
    color: 'bg-green-500',
    parameters: [
      {
        name: 'quality',
        type: 'select',
        default: 'high',
        options: ['low', 'medium', 'high']
      }
    ]
  },
  {
    id: 'docx-to-pdf',
    type: 'converter',
    name: 'DOCX → PDF',
    description: 'Convert Word document to PDF',
    icon: 'FileText',
    inputMime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    outputMime: 'application/pdf',
    category: 'document',
    color: 'bg-green-500',
  },
  
  // Image converters
  {
    id: 'image-resize',
    type: 'converter',
    name: 'Resize Image',
    description: 'Resize and optimize images',
    icon: 'Image',
    inputMime: 'image/*',
    outputMime: 'image/*',
    category: 'image',
    color: 'bg-purple-500',
    parameters: [
      {
        name: 'width',
        type: 'number',
        default: 1920,
        min: 1,
        max: 4096
      },
      {
        name: 'height',
        type: 'number',
        default: 1080,
        min: 1,
        max: 4096
      },
      {
        name: 'quality',
        type: 'number',
        default: 90,
        min: 1,
        max: 100
      }
    ]
  },
  {
    id: 'image-format',
    type: 'converter',
    name: 'Convert Format',
    description: 'Change image format',
    icon: 'Image',
    inputMime: 'image/*',
    outputMime: 'image/*',
    category: 'image',
    color: 'bg-purple-500',
    parameters: [
      {
        name: 'format',
        type: 'select',
        default: 'png',
        options: ['png', 'jpg', 'webp', 'gif', 'bmp']
      }
    ]
  },
  
  // Audio converters
  {
    id: 'audio-convert',
    type: 'converter',
    name: 'Audio Convert',
    description: 'Convert audio formats',
    icon: 'Music',
    inputMime: 'audio/*',
    outputMime: 'audio/*',
    category: 'audio',
    color: 'bg-orange-500',
    parameters: [
      {
        name: 'format',
        type: 'select',
        default: 'mp3',
        options: ['mp3', 'wav', 'flac', 'ogg']
      },
      {
        name: 'bitrate',
        type: 'select',
        default: '320',
        options: ['128', '192', '256', '320']
      }
    ]
  },
  
  // Video converters
  {
    id: 'video-convert',
    type: 'converter',
    name: 'Video Convert',
    description: 'Convert video formats',
    icon: 'Video',
    inputMime: 'video/*',
    outputMime: 'video/*',
    category: 'video',
    color: 'bg-red-500',
    parameters: [
      {
        name: 'format',
        type: 'select',
        default: 'mp4',
        options: ['mp4', 'webm', 'avi', 'mov']
      },
      {
        name: 'quality',
        type: 'select',
        default: '1080p',
        options: ['480p', '720p', '1080p', '4K']
      }
    ]
  },
  
  // AI nodes
  {
    id: 'ai-summarize',
    type: 'ai',
    name: 'AI Summarize',
    description: 'Generate text summary using AI',
    icon: 'Brain',
    inputMime: 'text/*',
    outputMime: 'text/plain',
    category: 'ai',
    color: 'bg-cyan-500',
    parameters: [
      {
        name: 'length',
        type: 'select',
        default: 'medium',
        options: ['short', 'medium', 'long']
      },
      {
        name: 'language',
        type: 'select',
        default: 'en',
        options: ['en', 'ru', 'es', 'fr', 'de']
      }
    ]
  },
  {
    id: 'ai-translate',
    type: 'ai',
    name: 'AI Translate',
    description: 'Translate text using AI',
    icon: 'Languages',
    inputMime: 'text/*',
    outputMime: 'text/plain',
    category: 'ai',
    color: 'bg-cyan-500',
    parameters: [
      {
        name: 'targetLanguage',
        type: 'select',
        default: 'en',
        options: ['en', 'ru', 'es', 'fr', 'de', 'zh', 'ja']
      }
    ]
  },
  {
    id: 'ai-tts',
    type: 'ai',
    name: 'Text-to-Speech',
    description: 'Convert text to speech',
    icon: 'Volume2',
    inputMime: 'text/*',
    outputMime: 'audio/mp3',
    category: 'ai',
    color: 'bg-cyan-500',
    parameters: [
      {
        name: 'voice',
        type: 'select',
        default: 'natural',
        options: ['natural', 'robotic', 'female', 'male']
      },
      {
        name: 'speed',
        type: 'number',
        default: 1.0,
        min: 0.5,
        max: 2.0
      }
    ]
  },
  
  // Output nodes
  {
    id: 'file-output',
    type: 'output',
    name: 'Download',
    description: 'Download converted files',
    icon: 'Download',
    category: 'file',
    color: 'bg-gray-500',
  },
];