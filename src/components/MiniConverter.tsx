import React, { useState, useMemo } from "react";
import { ArrowDownTrayIcon, ArrowPathIcon } from "lucide-react";
import mime from "mime";

/**
 * Map MIME → possible converters the backend supports.
 * "type"  → идентификатор плагина на сервере
 * "ext"   → расширение файла-результата, чтобы сформировать имя при скачивании
 */
const CONVERTERS: Record<string, { label: string; type: string; ext: string }[]> = {
  "application/pdf": [
    { label: "PDF → DOCX", type: "pdf2docx", ext: "docx" },
    { label: "PDF → TXT", type: "pdf2txt", ext: "txt" },
    { label: "PDF → JPG", type: "pdf2jpg", ext: "jpg" }
  ],
  "image/png": [
    { label: "PNG → JPEG", type: "png2jpeg", ext: "jpg" },
    { label: "PNG → WEBP", type: "png2webp", ext: "webp" }
  ],
  "image/jpeg": [
    { label: "JPEG → PNG", type: "jpeg2png", ext: "png" },
    { label: "JPEG → WEBP", type: "jpeg2webp", ext: "webp" },
    { label: "JPEG → TXT (OCR)", type: "jpeg2txt", ext: "txt" }
  ],
  "text/csv": [
    { label: "CSV → XLSX", type: "csv2xlsx", ext: "xlsx" }
  ],
  "audio/wav": [
    { label: "WAV → MP3", type: "wav2mp3", ext: "mp3" }
  ],
  "video/mp4": [
    { label: "MP4 (10s) → GIF", type: "mp4clip2gif", ext: "gif" }
  ],
  "image/gif": [
    { label: "GIF → MP4", type: "gif2mp4", ext: "mp4" }
  ],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    { label: "DOCX → PDF", type: "docx2pdf", ext: "pdf" }
  ],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    { label: "PPTX → PDF", type: "pptx2pdf", ext: "pdf" }
  ]
};

export default function MiniConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mimeType = useMemo(() => {
    if (!file) return null;
    return file.type || mime.getType(file.name) || 'application/octet-stream';
  }, [file]);
  
  const variants = mimeType ? CONVERTERS[mimeType] ?? [] : [];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setSelected(null);
      setBlobUrl(null);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setSelected(null);
      setBlobUrl(null);
      setError(null);
    }
  };

  const convert = async () => {
    if (!file || !selected) return;
    setLoading(true);
    setBlobUrl(null);
    setError(null);

    const form = new FormData();
    form.append("file", file);
    form.append("converter", selected);

    try {
      // For demo purposes, simulate conversion with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call your backend:
      // const res = await fetch("/api/convert", { method: "POST", body: form });
      // if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // const blob = await res.blob();
      
      // For now, create a mock result file
      const mockContent = `Converted file: ${file.name}\nConverter: ${selected}\nTimestamp: ${new Date().toISOString()}`;
      const blob = new Blob([mockContent], { type: 'text/plain' });
      setBlobUrl(URL.createObjectURL(blob));
      
    } catch (err) {
      setError((err as Error).message || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const getFileExtension = () => {
    if (!selected || !mimeType) return 'txt';
    const converter = CONVERTERS[mimeType]?.find(v => v.type === selected);
    return converter?.ext || 'txt';
  };

  const getDownloadFilename = () => {
    if (!file || !selected) return 'converted.txt';
    const baseName = file.name.split('.')[0];
    const ext = getFileExtension();
    return `${baseName}.${ext}`;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-lg mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quick Converter</h1>
        <p className="text-gray-600">Convert files instantly with our simple interface</p>
      </div>

      {/* Upload */}
      <label 
        className="w-full cursor-pointer border-2 border-dashed rounded-xl p-6 text-center text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {file ? (
          <div className="space-y-2">
            <div className="text-lg font-medium text-gray-900">{file.name}</div>
            <div className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB • {mimeType}
            </div>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-2">📁</div>
            Перетащите файл сюда или <span className="underline text-blue-600">выберите</span>
          </>
        )}
        <input type="file" onChange={handleUpload} className="hidden" />
      </label>

      {/* Variants */}
      {file && (
        variants.length ? (
          <div className="w-full space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Выберите тип конвертации:
            </label>
            <select
              value={selected ?? ""}
              onChange={e => setSelected(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>
                Выберите конвертер...
              </option>
              {variants.map(v => (
                <option key={v.type} value={v.type}>{v.label}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm text-center">
              ⚠️ Формат <code className="bg-yellow-100 px-1 rounded">{mimeType}</code> пока не поддерживается
            </p>
            <p className="text-yellow-600 text-xs text-center mt-1">
              Поддерживаемые форматы: PDF, DOCX, PNG, JPEG, CSV, WAV, MP4, GIF
            </p>
          </div>
        )
      )}

      {/* Convert button */}
      {selected && (
        <button
          disabled={loading}
          onClick={convert}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-5 w-5 animate-spin" /> 
              Конвертация...
            </>
          ) : (
            <>
              🔄 Конвертировать
            </>
          )}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Download */}
      {blobUrl && (
        <div className="w-full space-y-3">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm text-center">
              ✅ Конвертация завершена успешно!
            </p>
          </div>
          
          <a
            href={blobUrl}
            download={getDownloadFilename()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <ArrowDownTrayIcon className="h-5 w-5" /> 
            Скачать {getDownloadFilename()}
          </a>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>💡 Это демо-версия. Файлы обрабатываются локально.</p>
        <p>В продакшене будет подключен реальный backend API.</p>
      </div>
    </div>
  );
}