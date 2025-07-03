import { NodeSpec } from '../types/node-spec';

export const NODE_SPECS: NodeSpec[] = [
  // File Input Node
  {
    id: 'file-input',
    type: 'input',
    version: '1.0.0',
    metadata: {
      name: 'File Input',
      description: 'Upload and input files into the pipeline',
      category: 'utility',
      tags: ['input', 'upload', 'file']
    },
    inputs: [],
    outputs: [{
      id: 'output',
      name: 'File',
      mimeTypes: ['*/*'],
      required: true,
      multiple: false
    }],
    parameters: [],
    uiMeta: {
      icon: 'Upload',
      color: '#6B7280'
    }
  },

  // Document Conversion Nodes
  {
    id: 'pdf-to-docx',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'PDF → DOCX',
      description: 'Convert PDF documents to Microsoft Word format using LibreOffice',
      category: 'document',
      tags: ['pdf', 'docx', 'office', 'libreoffice', 'document']
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
      name: 'DOCX → PDF',
      description: 'Convert Microsoft Word documents to PDF format',
      category: 'document',
      tags: ['docx', 'pdf', 'office', 'document']
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

  {
    id: 'pptx-to-pdf',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'PPTX → PDF',
      description: 'Convert PowerPoint presentations to PDF format',
      category: 'document',
      tags: ['pptx', 'pdf', 'powerpoint', 'presentation']
    },
    inputs: [{
      id: 'input',
      name: 'PPTX File',
      mimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
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
      icon: 'Presentation',
      color: '#D97706'
    }
  },

  {
    id: 'csv-to-xlsx',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'CSV → XLSX',
      description: 'Convert CSV files to Excel spreadsheet format',
      category: 'document',
      tags: ['csv', 'xlsx', 'excel', 'spreadsheet']
    },
    inputs: [{
      id: 'input',
      name: 'CSV File',
      mimeTypes: ['text/csv'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'XLSX File',
      mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      required: true,
      multiple: false
    }],
    parameters: [{
      id: 'delimiter',
      name: 'CSV Delimiter',
      type: 'select',
      defaultValue: ',',
      required: false,
      validation: {
        options: [
          { value: ',', label: 'Comma (,)' },
          { value: ';', label: 'Semicolon (;)' },
          { value: '\t', label: 'Tab' },
          { value: '|', label: 'Pipe (|)' }
        ]
      }
    }],
    uiMeta: {
      icon: 'Database',
      color: '#059669'
    }
  },

  // Image Processing Nodes
  {
    id: 'png-to-jpeg',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'PNG → JPEG',
      description: 'Convert PNG images to JPEG format with compression',
      category: 'image',
      tags: ['png', 'jpeg', 'jpg', 'image', 'compression']
    },
    inputs: [{
      id: 'input',
      name: 'PNG Image',
      mimeTypes: ['image/png'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'JPEG Image',
      mimeTypes: ['image/jpeg'],
      required: true,
      multiple: false
    }],
    parameters: [{
      id: 'quality',
      name: 'JPEG Quality',
      type: 'range',
      defaultValue: 85,
      required: false,
      validation: { min: 1, max: 100 },
      uiHints: { suffix: '%' }
    }],
    uiMeta: {
      icon: 'Image',
      color: '#7C3AED',
      preview: {
        enabled: true,
        maxSize: 10 * 1024 * 1024,
        supportedTypes: ['image/png']
      }
    }
  },

  {
    id: 'png-to-webp',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'PNG → WebP',
      description: 'Convert PNG images to modern WebP format for better compression',
      category: 'image',
      tags: ['png', 'webp', 'image', 'compression', 'modern']
    },
    inputs: [{
      id: 'input',
      name: 'PNG Image',
      mimeTypes: ['image/png'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'WebP Image',
      mimeTypes: ['image/webp'],
      required: true,
      multiple: false
    }],
    parameters: [{
      id: 'quality',
      name: 'WebP Quality',
      type: 'range',
      defaultValue: 80,
      required: false,
      validation: { min: 1, max: 100 },
      uiHints: { suffix: '%' }
    }],
    uiMeta: {
      icon: 'Image',
      color: '#10B981'
    }
  },

  {
    id: 'jpeg-to-txt-ocr',
    type: 'ai-processor',
    version: '1.0.0',
    metadata: {
      name: 'JPEG → TXT (OCR)',
      description: 'Extract text from JPEG images using OCR technology',
      category: 'ai',
      tags: ['jpeg', 'ocr', 'text', 'extraction', 'tesseract']
    },
    inputs: [{
      id: 'input',
      name: 'JPEG Image',
      mimeTypes: ['image/jpeg', 'image/jpg'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'Extracted Text',
      mimeTypes: ['text/plain'],
      required: true,
      multiple: false
    }],
    parameters: [{
      id: 'language',
      name: 'OCR Language',
      type: 'select',
      defaultValue: 'eng',
      required: false,
      validation: {
        options: [
          { value: 'eng', label: 'English' },
          { value: 'rus', label: 'Russian' },
          { value: 'spa', label: 'Spanish' },
          { value: 'fra', label: 'French' },
          { value: 'deu', label: 'German' }
        ]
      }
    }],
    uiMeta: {
      icon: 'ScanText',
      color: '#F59E0B'
    }
  },

  // Video/Audio Processing Nodes
  {
    id: 'mp4-to-gif',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'MP4 → GIF',
      description: 'Convert MP4 video clips to optimized GIF animations',
      category: 'video',
      tags: ['mp4', 'gif', 'video', 'animation', 'ffmpeg']
    },
    inputs: [{
      id: 'input',
      name: 'MP4 Video',
      mimeTypes: ['video/mp4'],
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
      }
    ],
    uiMeta: {
      icon: 'Film',
      color: '#F97316'
    }
  },

  {
    id: 'gif-to-mp4',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'GIF → MP4',
      description: 'Convert GIF animations to MP4 video format',
      category: 'video',
      tags: ['gif', 'mp4', 'video', 'animation']
    },
    inputs: [{
      id: 'input',
      name: 'GIF Animation',
      mimeTypes: ['image/gif'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'MP4 Video',
      mimeTypes: ['video/mp4'],
      required: true,
      multiple: false
    }],
    parameters: [{
      id: 'quality',
      name: 'Video Quality',
      type: 'select',
      defaultValue: 'medium',
      required: false,
      validation: {
        options: [
          { value: 'low', label: 'Low (Small file)' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High (Large file)' }
        ]
      }
    }],
    uiMeta: {
      icon: 'Film',
      color: '#EF4444'
    }
  },

  {
    id: 'wav-to-mp3',
    type: 'converter',
    version: '1.0.0',
    metadata: {
      name: 'WAV → MP3',
      description: 'Convert WAV audio files to compressed MP3 format',
      category: 'audio',
      tags: ['wav', 'mp3', 'audio', 'compression', 'ffmpeg']
    },
    inputs: [{
      id: 'input',
      name: 'WAV Audio',
      mimeTypes: ['audio/wav'],
      required: true,
      multiple: false
    }],
    outputs: [{
      id: 'output',
      name: 'MP3 Audio',
      mimeTypes: ['audio/mpeg'],
      required: true,
      multiple: false
    }],
    parameters: [{
      id: 'bitrate',
      name: 'MP3 Bitrate',
      type: 'select',
      defaultValue: '192k',
      required: false,
      validation: {
        options: [
          { value: '128k', label: '128 kbps (Small)' },
          { value: '192k', label: '192 kbps (Good)' },
          { value: '256k', label: '256 kbps (High)' },
          { value: '320k', label: '320 kbps (Best)' }
        ]
      }
    }],
    uiMeta: {
      icon: 'Music',
      color: '#10B981'
    }
  }
];