"""
Simple FastAPI backend for file conversion
Usage: python api/convert.py
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
import subprocess
import shutil
from pathlib import Path
import mimetypes

app = FastAPI(title="Convert-Studio API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conversion plugins mapping
CONVERTERS = {
    "pdf2docx": {
        "command": "soffice --headless --convert-to docx {input} --outdir {outdir}",
        "output_ext": "docx",
        "requires": ["libreoffice"]
    },
    "docx2pdf": {
        "command": "soffice --headless --convert-to pdf {input} --outdir {outdir}",
        "output_ext": "pdf", 
        "requires": ["libreoffice"]
    },
    "png2jpeg": {
        "command": "convert {input} -quality 85 {output}",
        "output_ext": "jpg",
        "requires": ["imagemagick"]
    },
    "png2webp": {
        "command": "cwebp -q 80 {input} -o {output}",
        "output_ext": "webp",
        "requires": ["libwebp"]
    },
    "jpeg2png": {
        "command": "convert {input} {output}",
        "output_ext": "png",
        "requires": ["imagemagick"]
    },
    "wav2mp3": {
        "command": "ffmpeg -i {input} -codec:a libmp3lame -q:a 2 {output}",
        "output_ext": "mp3",
        "requires": ["ffmpeg"]
    },
    "mp4clip2gif": {
        "command": "ffmpeg -ss 0 -t 10 -i {input} -vf scale=480:-1 {output}",
        "output_ext": "gif",
        "requires": ["ffmpeg"]
    },
    "gif2mp4": {
        "command": "ffmpeg -i {input} -movflags faststart -pix_fmt yuv420p {output}",
        "output_ext": "mp4",
        "requires": ["ffmpeg"]
    },
    "csv2xlsx": {
        "command": "python -c \"import pandas as pd; pd.read_csv('{input}').to_excel('{output}', index=False)\"",
        "output_ext": "xlsx",
        "requires": ["python", "pandas"]
    },
    "pdf2txt": {
        "command": "pdftotext {input} {output}",
        "output_ext": "txt",
        "requires": ["poppler-utils"]
    },
    "jpeg2txt": {
        "command": "tesseract {input} {output_base} -l eng",
        "output_ext": "txt",
        "requires": ["tesseract"]
    }
}

def check_dependencies():
    """Check if required tools are installed"""
    missing = []
    tools = {
        "soffice": "LibreOffice",
        "convert": "ImageMagick", 
        "ffmpeg": "FFmpeg",
        "cwebp": "WebP tools",
        "pdftotext": "Poppler utils",
        "tesseract": "Tesseract OCR"
    }
    
    for tool, name in tools.items():
        if not shutil.which(tool):
            missing.append(f"{name} ({tool})")
    
    if missing:
        print(f"⚠️  Missing tools: {', '.join(missing)}")
        print("📦 Install with: apt-get install libreoffice imagemagick ffmpeg webp poppler-utils tesseract-ocr")
    else:
        print("✅ All conversion tools are available")

@app.on_event("startup")
async def startup_event():
    check_dependencies()

@app.get("/")
async def root():
    return {
        "message": "Convert-Studio API",
        "version": "1.0.0",
        "available_converters": list(CONVERTERS.keys())
    }

@app.get("/converters")
async def list_converters():
    """List all available converters"""
    return {
        "converters": {
            name: {
                "output_format": config["output_ext"],
                "requirements": config["requires"]
            }
            for name, config in CONVERTERS.items()
        }
    }

@app.post("/convert")
async def convert_file(
    file: UploadFile = File(...),
    converter: str = Form(...)
):
    """Convert uploaded file using specified converter"""
    
    if converter not in CONVERTERS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unknown converter: {converter}. Available: {list(CONVERTERS.keys())}"
        )
    
    config = CONVERTERS[converter]
    
    # Create temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # Save uploaded file
        input_file = temp_path / file.filename
        with open(input_file, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Prepare output file
        base_name = input_file.stem
        output_file = temp_path / f"{base_name}.{config['output_ext']}"
        
        # Build command
        command = config["command"].format(
            input=str(input_file),
            output=str(output_file),
            outdir=str(temp_path),
            output_base=str(temp_path / base_name)  # For tesseract
        )
        
        try:
            # Execute conversion
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=60  # 1 minute timeout
            )
            
            if result.returncode != 0:
                raise HTTPException(
                    status_code=500,
                    detail=f"Conversion failed: {result.stderr}"
                )
            
            # Check if output file exists
            if not output_file.exists():
                # Some tools create files with different naming
                possible_outputs = list(temp_path.glob(f"{base_name}.*"))
                if possible_outputs:
                    output_file = possible_outputs[0]
                else:
                    raise HTTPException(
                        status_code=500,
                        detail="Conversion completed but output file not found"
                    )
            
            # Return converted file
            return FileResponse(
                path=str(output_file),
                filename=f"{base_name}.{config['output_ext']}",
                media_type=mimetypes.guess_type(str(output_file))[0]
            )
            
        except subprocess.TimeoutExpired:
            raise HTTPException(
                status_code=408,
                detail="Conversion timeout (60s limit exceeded)"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Conversion error: {str(e)}"
            )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": "2025-01-27T12:00:00Z"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Convert-Studio API...")
    print("📖 API docs: http://localhost:8000/docs")
    print("🔧 Health check: http://localhost:8000/health")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)