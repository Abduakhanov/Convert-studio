import { NodeSpec } from '../types/node-spec';

export const NODE_SPECS: NodeSpec[] = [
  // Document Conversion Nodes
  {
    id: 'pdf-to-docx',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'PDF to DOCX',
      description: 'Convert PDF documents to Microsoft Word format using LibreOffice',
      category: 'document',
      tags: ['pdf', 'docx', 'office', 'libreoffice']
    },
    inputs: [{
      id: 'input',
      name: 'PDF File',
      mimeTypes: ['application/pdf'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'DOCX File',
      mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      required: true,
      multiple: false
    }],
    parameters: [{
      id: 'quality',
      name: 'Conversion Quality',
      type: 'select',
      defaultValue: 'high',
      required: false,
      validation: {
        options: [
          { value: 'low', label: 'Low (Fast)' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High (Slow)' }
        ]
      },
      description: 'Quality vs speed tradeoff'
    }],
    uiMeta: {
      icon: 'FileText',
      color: '#DC2626',
      preview: {
        enabled: true,
        maxSize: 50 * 1024 * 1024,
        supportedTypes: ['application/pdf']
      }
    }
  },

  {
    id: 'docx-to-pdf',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'DOCX to PDF',
      description: 'Convert Microsoft Word documents to PDF format',
      category: 'document',
      tags: ['docx', 'pdf', 'office']
    },
    inputs: [{
      id: 'input',
      name: 'DOCX File',
      mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'PDF File',
      mimeTypes: ['application/pdf'],
      required: true,
      multiple: false
    }],
    parameters: [],
    uiMeta: {
      icon: 'FileText',
      color: '#2563EB'
    }
  },

  // Image Processing Nodes
  {
    id: 'image-resize',
    type: 'processor',
    version: '1.0.0',
    metadata: {
      name: 'Resize Image',
      description: 'Resize images using ImageMagick with various algorithms',
      category: 'image',
      tags: ['resize', 'scale', 'imagemagick']
    },
    inputs: [{
      id: 'input',
      name: 'Image',
      mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'Resized Image',
      mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      required: true,
      multiple: false
    }],
    parameters: [
      {
        id: 'width',
        name: 'Width',
        type: 'number',
        defaultValue: 800,
        required: true,
        validation: { min: 1, max: 8192 },
        uiHints: { suffix: 'px' }
      },
      {
        id: 'height',
        name: 'Height',
        type: 'number',
        defaultValue: 600,
        required: true,
        validation: { min: 1, max: 8192 },
        uiHints: { suffix: 'px' }
      },
      {
        id: 'maintain_aspect',
        name: 'Maintain Aspect Ratio',
        type: 'boolean',
        defaultValue: true,
        required: false
      }
    ],
    uiMeta: {
      icon: 'Image',
      color: '#059669',
      preview: {
        enabled: true,
        maxSize: 10 * 1024 * 1024,
        supportedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      }
    }
  },

  {
    id: 'image-format-convert',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'Convert Image Format',
      description: 'Convert between different image formats',
      category: 'image',
      tags: ['convert', 'format', 'jpeg', 'png', 'webp']
    },
    inputs: [{
      id: 'input',
      name: 'Image',
      mimeTypes: ['image/*'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'Converted Image',
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      required: true,
      multiple: false
    }],
    parameters: [{
      id: 'format',
      name: 'Output Format',
      type: 'select',
      defaultValue: 'jpeg',
      required: true,
      validation: {
        options: [
          { value: 'jpeg', label: 'JPEG' },
          { value: 'png', label: 'PNG' },
          { value: 'webp', label: 'WebP' },
          { value: 'gif', label: 'GIF' }
        ]
      }
    }],
    uiMeta: {
      icon: 'Image',
      color: '#7C3AED'
    }
  },

  // AI Processing Nodes
  {
    id: 'ai-summarize',
    type: 'ai-processor',
    version: '1.0.0',
    metadata: {
      name: 'AI Summarize',
      description: 'Generate intelligent summaries using large language models',
      category: 'ai',
      tags: ['ai', 'summarize', 'llm', 'text']
    },
    inputs: [{
      id: 'input',
      name: 'Text Document',
      mimeTypes: ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'Summary',
      mimeTypes: ['text/plain'],
      required: true,
      multiple: false
    }],
    parameters: [
      {
        id: 'model',
        name: 'AI Model',
        type: 'select',
        defaultValue: 'gpt-3.5-turbo',
        required: true,
        validation: {
          options: [
            { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
            { value: 'gpt-4', label: 'GPT-4' },
            { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
            { value: 'ollama-llama2', label: 'Llama 2 (Local)' }
          ]
        }
      },
      {
        id: 'length',
        name: 'Summary Length',
        type: 'select',
        defaultValue: 'medium',
        required: false,
        validation: {
          options: [
            { value: 'short', label: 'Short (1-2 paragraphs)' },
            { value: 'medium', label: 'Medium (3-5 paragraphs)' },
            { value: 'long', label: 'Long (6+ paragraphs)' }
          ]
        }
      },
      {
        id: 'language',
        name: 'Output Language',
        type: 'select',
        defaultValue: 'en',
        required: false,
        validation: {
          options: [
            { value: 'en', label: 'English' },
            { value: 'ru', label: 'Russian' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' }
          ]
        }
      }
    ],
    uiMeta: {
      icon: 'Brain',
      color: '#F59E0B'
    }
  },

  {
    id: 'ai-translate',
    type: 'ai-processor',
    version: '1.0.0',
    metadata: {
      name: 'AI Translate',
      description: 'Translate text using advanced AI models',
      category: 'ai',
      tags: ['ai', 'translate', 'language', 'llm']
    },
    inputs: [{
      id: 'input',
      name: 'Text',
      mimeTypes: ['text/plain'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'Translated Text',
      mimeTypes: ['text/plain'],
      required: true,
      multiple: false
    }],
    parameters: [
      {
        id: 'target_language',
        name: 'Target Language',
        type: 'select',
        defaultValue: 'ru',
        required: true,
        validation: {
          options: [
            { value: 'en', label: 'English' },
            { value: 'ru', label: 'Russian' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
            { value: 'zh', label: 'Chinese' },
            { value: 'ja', label: 'Japanese' }
          ]
        }
      }
    ],
    uiMeta: {
      icon: 'Languages',
      color: '#8B5CF6'
    }
  },

  {
    id: 'text-to-speech',
    type: 'ai-processor',
    version: '1.0.0',
    metadata: {
      name: 'Text to Speech',
      description: 'Convert text to natural-sounding speech',
      category: 'ai',
      tags: ['tts', 'speech', 'audio', 'voice']
    },
    inputs: [{
      id: 'input',
      name: 'Text',
      mimeTypes: ['text/plain'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'Audio',
      mimeTypes: ['audio/mpeg', 'audio/wav'],
      required: true,
      multiple: false
    }],
    parameters: [
      {
        id: 'voice',
        name: 'Voice',
        type: 'select',
        defaultValue: 'alloy',
        required: true,
        validation: {
          options: [
            { value: 'alloy', label: 'Alloy' },
            { value: 'echo', label: 'Echo' },
            { value: 'fable', label: 'Fable' },
            { value: 'onyx', label: 'Onyx' },
            { value: 'nova', label: 'Nova' },
            { value: 'shimmer', label: 'Shimmer' }
          ]
        }
      },
      {
        id: 'speed',
        name: 'Speed',
        type: 'range',
        defaultValue: 1.0,
        required: false,
        validation: { min: 0.25, max: 4.0 },
        uiHints: { step: 0.25 }
      }
    ],
    uiMeta: {
      icon: 'Volume2',
      color: '#EF4444'
    }
  },

  // Audio Processing Nodes
  {
    id: 'audio-convert',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'Convert Audio Format',
      description: 'Convert between different audio formats using FFmpeg',
      category: 'audio',
      tags: ['audio', 'convert', 'ffmpeg', 'mp3', 'wav']
    },
    inputs: [{
      id: 'input',
      name: 'Audio File',
      mimeTypes: ['audio/*'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'Converted Audio',
      mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac'],
      required: true,
      multiple: false
    }],
    parameters: [
      {
        id: 'format',
        name: 'Output Format',
        type: 'select',
        defaultValue: 'mp3',
        required: true,
        validation: {
          options: [
            { value: 'mp3', label: 'MP3' },
            { value: 'wav', label: 'WAV' },
            { value: 'ogg', label: 'OGG' },
            { value: 'aac', label: 'AAC' }
          ]
        }
      },
      {
        id: 'bitrate',
        name: 'Bitrate',
        type: 'select',
        defaultValue: '192k',
        required: false,
        validation: {
          options: [
            { value: '128k', label: '128 kbps' },
            { value: '192k', label: '192 kbps' },
            { value: '256k', label: '256 kbps' },
            { value: '320k', label: '320 kbps' }
          ]
        }
      }
    ],
    uiMeta: {
      icon: 'Music',
      color: '#10B981'
    }
  },

  // Video Processing Nodes
  {
    id: 'video-to-gif',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'Video to GIF',
      description: 'Convert video clips to optimized GIF animations',
      category: 'video',
      tags: ['video', 'gif', 'animation', 'ffmpeg']
    },
    inputs: [{
      id: 'input',
      name: 'Video File',
      mimeTypes: ['video/mp4', 'video/webm', 'video/avi', 'video/mov'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'GIF Animation',
      mimeTypes: ['image/gif'],
      required: true,
      multiple: false
    }],
    parameters: [
      {
        id: 'start_time',
        name: 'Start Time',
        type: 'number',
        defaultValue: 0,
        required: false,
        validation: { min: 0 },
        uiHints: { suffix: 's', placeholder: '0' }
      },
      {
        id: 'duration',
        name: 'Duration',
        type: 'number',
        defaultValue: 5,
        required: false,
        validation: { min: 0.1, max: 30 },
        uiHints: { suffix: 's', step: 0.1 }
      },
      {
        id: 'fps',
        name: 'Frame Rate',
        type: 'number',
        defaultValue: 15,
        required: false,
        validation: { min: 1, max: 30 },
        uiHints: { suffix: 'fps' }
      },
      {
        id: 'width',
        name: 'Width',
        type: 'number',
        defaultValue: 480,
        required: false,
        validation: { min: 100, max: 1920 },
        uiHints: { suffix: 'px' }
      }
    ],
    uiMeta: {
      icon: 'Film',
      color: '#F97316'
    }
  }
];