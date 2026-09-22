import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, RefreshCw, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { compressScreenshot, CompressionResult } from '../utils/imageCompressor';

interface LeftColumnUploadProps {
  currentImage: string | null;
  selectedSampleId: string | null;
  onImageSelected: (dataUrl: string, sampleId?: string, compressionInfo?: CompressionResult) => void;
  onClear: () => void;
  onRunAudit: () => void;
  isAnalyzing: boolean;
  compressionInfo: CompressionResult | null;
  onLoadInstantDemo?: () => void;
}

export const LeftColumnUpload: React.FC<LeftColumnUploadProps> = ({
  currentImage,
  selectedSampleId,
  onImageSelected,
  onClear,
  onRunAudit,
  isAnalyzing,
  compressionInfo,
  onLoadInstantDemo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // Process raw file or dataUrl through the client-side canvas compression step
  const processImage = async (dataUrl: string, sampleId?: string) => {
    setIsCompressing(true);
    try {
      const result = await compressScreenshot(dataUrl, 1400, 0.85);
      onImageSelected(result.dataUrl, sampleId, result);
    } catch {
      onImageSelected(dataUrl, sampleId);
    } finally {
      setIsCompressing(false);
    }
  };

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result) {
                  processImage(event.target.result as string);
                }
              };
              reader.readAsDataURL(file);
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      id="left-column-upload"
      className="h-full rounded-2xl bg-[#090d16] border border-slate-800 flex flex-col overflow-hidden shadow-2xl relative"
    >
      {/* Column Header */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Interface Screenshot Staging
            </h2>
            <p className="text-[11px] text-slate-400">
              Drag &amp; drop, paste clipboard, or use demo presets
            </p>
          </div>
        </div>

        {currentImage && (
          <div className="flex items-center gap-2">
            <button
              id="change-screenshot-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing || isCompressing}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            >
              Replace
            </button>
            <button
              id="clear-screenshot-btn"
              onClick={onClear}
              disabled={isAnalyzing || isCompressing}
              className="px-2.5 py-1 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Main Area: Upload Dropzone or Live Image Preview */}
      <div className="flex-1 p-5 flex flex-col overflow-y-auto custom-scrollbar space-y-4">
        {!currentImage ? (
          <div
            id="drag-drop-zone"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 min-h-[300px] cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-8 transition-all ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-950/30 ring-4 ring-indigo-500/20'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Drag &amp; Drop UI Screenshot Here
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
              Upload any checkout modal, subscription page, or mobile screen. Or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">Cmd+V</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">Ctrl+V</kbd> anywhere to paste from clipboard.
            </p>

            <div className="flex items-center gap-2">
              <span className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all">
                Browse Files
              </span>
              <span className="text-[11px] text-slate-500 font-mono">PNG, JPG, WebP, SVG</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-3">
            {/* Live Image Staging Card */}
            <div className="relative flex-1 min-h-[260px] bg-slate-950/80 rounded-xl border border-slate-800/80 p-3 flex items-center justify-center overflow-hidden">
              <img
                src={currentImage}
                alt="UI under audit"
                className="max-h-[380px] w-auto max-w-full rounded-lg object-contain border border-slate-800 shadow-xl"
              />

              {isCompressing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                  <span className="text-xs font-mono text-slate-300">
                    Downscaling &amp; Optimizing on Canvas...
                  </span>
                </div>
              )}
            </div>

            {/* Client-Side Canvas Step Metrics Indicator */}
            {compressionInfo && (
              <div
                id="canvas-compression-badge"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-slate-200 font-bold">Canvas Pre-Scaled: </span>
                    <span className="text-slate-400">
                      {compressionInfo.originalWidth}×{compressionInfo.originalHeight} → {compressionInfo.compressedWidth}×{compressionInfo.compressedHeight}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400">
                    {compressionInfo.compressedSizeKb} KB
                  </span>
                  {compressionInfo.reductionPercentage > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      -{compressionInfo.reductionPercentage}%
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer: Live Audit & Instant Demo */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
        <div className="text-[11px] text-slate-400 font-mono">
          Strict Taxonomy: 8 Deceptive Patterns · Temp: 0.1
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedSampleId && onLoadInstantDemo && (
            <button
              id="instant-demo-btn"
              onClick={onLoadInstantDemo}
              disabled={isAnalyzing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
              title="Instantly load pre-computed audit facts (zero network delay)"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Fast Demo Result</span>
            </button>
          )}

          <button
            id="run-audit-btn"
            onClick={onRunAudit}
            disabled={!currentImage || isAnalyzing || isCompressing}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 transition-all"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Live AI Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
