# Convert-Studio

🚀 **Visual pipeline builder for file conversions** - drag-and-drop interface for creating powerful file processing workflows.

![Convert-Studio](https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

- **Visual Pipeline Builder** - Drag-and-drop nodes with React Flow
- **Quick Converter** - Simple file conversion interface
- **Real-time Validation** - MIME type compatibility checking
- **Live Preview** - See results as you build
- **Undo/Redo** - Full history management with Ctrl+Z/Y
- **Command Palette** - Quick access with Ctrl+K
- **PWA Support** - Works offline with cached WASM modules
- **Hot Keys** - Keyboard shortcuts for power users

## 🎯 Supported Conversions

### Documents
- PDF ↔ DOCX (LibreOffice)
- DOCX → PDF
- CSV → XLSX
- PPTX → PDF

### Images
- PNG ↔ JPEG
- PNG → WebP
- JPEG → PNG/WebP
- JPEG → TXT (OCR)

### Audio/Video
- WAV → MP3 (FFmpeg)
- MP4 → GIF
- GIF → MP4

### AI Processing
- Text summarization (GPT/Claude/Ollama)
- Language translation
- Text-to-Speech synthesis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.11+ (for backend)
- Docker (optional)

### Frontend Only (Demo Mode)

```bash
# Clone the repository
git clone https://github.com/Abduakhanov/Convert-studio.git
cd Convert-studio

# Install dependencies
npm install

# Start development server
npm run dev

# Open demo converter
open http://localhost:5173?demo
```

### Full Stack Setup

```bash
# 1. Start frontend
npm install
npm run dev

# 2. Start backend (in another terminal)
cd api
pip install -r requirements.txt
python convert.py

# 3. Access application
# Full app: http://localhost:5173
# Quick converter: http://localhost:5173?demo
# API docs: http://localhost:8000/docs
```

### Docker Setup

```bash
# Build and run all services
docker-compose up --build

# Access at http://localhost
```

## 🎮 Usage

### Quick Converter Mode
1. Visit `http://localhost:5173?demo`
2. Drag & drop a file or click to browse
3. Select conversion type
4. Click "Конвертировать"
5. Download the result

### Full Pipeline Builder
1. Visit `http://localhost:5173`
2. **Add Nodes** - Drag from the library or use Ctrl+K
3. **Connect Nodes** - Drag between compatible ports
4. **Configure** - Set parameters in each node
5. **Execute** - Press Ctrl+Enter or click Execute

### Keyboard Shortcuts
- `Ctrl+K` - Open command palette
- `Ctrl+Z` - Undo
- `Ctrl+Shift+Z` - Redo
- `Ctrl+S` - Save pipeline
- `Ctrl+N` - New pipeline
- `Ctrl+Enter` - Execute pipeline
- `Delete` - Remove selected nodes/connections
- `Escape` - Clear selection

## 🏗️ Architecture

```
Frontend (React + React Flow)
    ↓ HTTP/WebSocket
API Gateway (FastAPI)
    ↓ subprocess
Conversion Tools (LibreOffice, FFmpeg, ImageMagick)
    ↓ filesystem
Temporary Storage
```

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── MiniConverter.tsx    # Simple conversion UI
│   ├── PipelineCanvas.tsx   # Visual pipeline builder
│   └── ...
├── stores/             # Zustand state management
├── types/              # TypeScript definitions
├── data/               # Node specifications
└── utils/              # Helper functions

api/
├── convert.py          # FastAPI backend
├── requirements.txt    # Python dependencies
└── Dockerfile         # Container setup
```

### Backend API

The backend provides a simple REST API:

```python
# Convert a file
POST /api/convert
Content-Type: multipart/form-data

file: <uploaded_file>
converter: "pdf2docx"  # converter type
```

Available converters:
- `pdf2docx`, `docx2pdf`, `pptx2pdf`
- `png2jpeg`, `png2webp`, `jpeg2png`
- `wav2mp3`, `mp4clip2gif`, `gif2mp4`
- `csv2xlsx`, `pdf2txt`, `jpeg2txt`

### Adding New Converters

1. **Backend**: Add to `CONVERTERS` dict in `api/convert.py`
```python
"my_converter": {
    "command": "my_tool {input} {output}",
    "output_ext": "new_format",
    "requires": ["my_tool"]
}
```

2. **Frontend**: Add to `CONVERTERS` in `MiniConverter.tsx`
```typescript
"input/mime": [
  { label: "Input → Output", type: "my_converter", ext: "new_format" }
]
```

### System Dependencies

The backend requires these tools:
```bash
# Ubuntu/Debian
apt-get install libreoffice imagemagick ffmpeg webp poppler-utils tesseract-ocr

# macOS
brew install libreoffice imagemagick ffmpeg webp poppler tesseract

# Check installation
curl http://localhost:8000/converters
```

### Running Tests
```bash
# Frontend tests
npm run test
npm run test:e2e

# Backend tests
cd api
python -m pytest

# Integration tests
npm run test:integration
```

## 🚀 Deployment

### Netlify (Frontend Only)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

### Full Stack (Docker)
```bash
# Production build
docker-compose -f docker-compose.prod.yml up --build

# Or deploy to cloud
# - Frontend: Netlify/Vercel
# - Backend: Railway/Render/DigitalOcean
```

### Environment Variables
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8000

# Backend
PYTHONUNBUFFERED=1
MAX_FILE_SIZE=100MB
CONVERSION_TIMEOUT=60
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure accessibility (A11y) compliance
- Test both demo and full modes

## 📝 API Documentation

### Endpoints

- `GET /` - API info and available converters
- `GET /converters` - List all converters with requirements
- `POST /convert` - Convert uploaded file
- `GET /health` - Health check

### Example Usage

```bash
# Convert PDF to DOCX
curl -X POST http://localhost:8000/convert \
  -F "file=@document.pdf" \
  -F "converter=pdf2docx" \
  --output document.docx

# List available converters
curl http://localhost:8000/converters
```

## 🔧 Troubleshooting

### Common Issues

1. **"Converter not found"**
   - Check if required tools are installed
   - Run `curl http://localhost:8000/converters`

2. **"Conversion timeout"**
   - Large files may exceed 60s limit
   - Increase `CONVERSION_TIMEOUT` environment variable

3. **"Permission denied"**
   - Ensure temp directory is writable
   - Check Docker volume permissions

4. **Frontend not connecting to API**
   - Verify API is running on port 8000
   - Check CORS settings in `convert.py`

### Debug Mode

```bash
# Backend with debug logging
cd api
python convert.py --log-level debug

# Frontend with API proxy
npm run dev -- --host
```

## 📞 Support

- 📧 Email: support@convert-studio.dev
- 💬 Discord: [Join our community](https://discord.gg/convert-studio)
- 🐛 Issues: [GitHub Issues](https://github.com/Abduakhanov/Convert-studio/issues)
- 📖 Docs: [Documentation](https://docs.convert-studio.dev)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) - Node-based UI framework
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [LibreOffice](https://www.libreoffice.org/) - Document conversion
- [FFmpeg](https://ffmpeg.org/) - Media processing
- [ImageMagick](https://imagemagick.org/) - Image manipulation

---

**Made with ❤️ by the Convert-Studio team**