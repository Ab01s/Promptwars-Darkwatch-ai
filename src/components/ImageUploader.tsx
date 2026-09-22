import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Check, RefreshCw, Layers, ShieldAlert, ArrowRight } from 'lucide-react';
import { BenchmarkSample } from '../types';
import { BENCHMARK_SAMPLES } from '../utils/benchmarkSamples';

interface ImageUploaderProps {
  currentImage: string | null;
  selectedSampleId: string | null;
  onImageSelected: (dataUrl: string, sampleId?: string) => void;
  onClear: () => void;
  onRunAudit: () => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  selectedSampleId,
  onImageSelected,
  onClear,
  onRunAudit,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Global paste handler
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
                  onImageSelected(event.target.result as string);
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
  }, [onImageSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelected(event.target.result as string);
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
          onImageSelected(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="image-uploader-section" className="space-y-6">
      {/* Benchmark Presets Selector */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs uppercase tracking-wider font-bold text-slate-300">
              Benchmark UI Evaluation Suites
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Click to load curated test cases
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {BENCHMARK_SAMPLES.map((sample: any) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                id={`sample-btn-${sample.id}`}
                onClick={() => onImageSelected(sample.dataUrl, sample.id)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 truncate">
                    {sample.category}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                </div>
                <h4 className="text-xs font-semibold text-slate-200 truncate mb-1">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dropzone / Staging Canvas */}
      {!currentImage ? (
        <div
          id="dropzone-box"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center transition-all ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-950/20 scale-[1.005]'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            Upload UI Screenshot for Forensic Audit
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-4">
            Drag &amp; drop any web, desktop, or mobile interface screenshot, or paste directly from clipboard (<kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">Cmd+V</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">Ctrl+V</kbd>).
          </p>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow">
              Select Image File
            </span>
            <span className="text-[11px] text-slate-500 font-mono">PNG, JPG, WebP, SVG</span>
          </div>
        </div>
      ) : (
        /* Staged Image Inspector View */
        <div id="staged-preview-container" className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-lg">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-2 text-xs">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-white">Staged UI Screenshot</span>
              {selectedSampleId && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {selectedSampleId}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                id="replace-image-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
              >
                Change Image
              </button>
              <button
                id="clear-image-btn"
                onClick={onClear}
                disabled={isAnalyzing}
                className="px-2.5 py-1 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-md border border-rose-500/20 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="relative p-4 bg-slate-950/60 flex items-center justify-center max-h-[480px] overflow-hidden">
            <img
              src={currentImage}
              alt="UI Screenshot to audit"
              className="max-h-[440px] w-auto max-w-full rounded-lg object-contain border border-slate-800 shadow-md"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 text-indigo-400 animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-white">Performing Forensic Multimodal Audit</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Scrutinizing visual hierarchy, microcopy &amp; inferred states...
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Enforcing: </span>
              Visual Hierarchy, Microcopy Audit, and State Inference per Principal UX Ethics Taxonomy.
            </div>

            <button
              id="execute-audit-btn"
              onClick={onRunAudit}
              disabled={isAnalyzing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Forensic Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
