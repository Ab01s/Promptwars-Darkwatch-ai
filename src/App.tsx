import { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { LeftColumnUpload } from './components/LeftColumnUpload';
import { DigitalNutritionLabel } from './components/DigitalNutritionLabel';
import { MethodologyModal } from './components/MethodologyModal';
import { AuditResult } from './types';
import { DEMO_SUITES } from './utils/benchmarkSamples';
import { CompressionResult, compressScreenshot } from './utils/imageCompressor';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const initialDemo = DEMO_SUITES[0];

  const [currentImage, setCurrentImage] = useState<string | null>(initialDemo.dataUrl);
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(initialDemo.id);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(initialDemo.mockResult);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<'ready' | 'analyzing' | 'error'>('ready');

  // Initialize initial demo compression metrics
  useEffect(() => {
    compressScreenshot(initialDemo.dataUrl).then((comp) => {
      setCompressionInfo(comp);
    });
  }, []);

  // Jury-Proof Demo Handler: instant loading of realistic mock audit results so the demo never hangs!
  const handleSelectDemo = useCallback((demoId: string) => {
    const demo = DEMO_SUITES.find((d) => d.id === demoId);
    if (!demo) return;

    setSelectedDemoId(demo.id);
    setCurrentImage(demo.dataUrl);
    setAuditResult(demo.mockResult);
    setIsDemoMode(true);
    setErrorMessage(null);
    setSystemStatus('ready');

    compressScreenshot(demo.dataUrl).then((comp) => {
      setCompressionInfo(comp);
    });
  }, []);

  // When user uploads or pastes their own screenshot
  const handleImageSelected = useCallback(
    (dataUrl: string, sampleId?: string, comp?: CompressionResult) => {
      setCurrentImage(dataUrl);
      setSelectedDemoId(sampleId || null);
      setCompressionInfo(comp || null);
      setAuditResult(null);
      setIsDemoMode(false);
      setErrorMessage(null);
      setSystemStatus('ready');
    },
    []
  );

  const handleClear = useCallback(() => {
    setCurrentImage(null);
    setSelectedDemoId(null);
    setCompressionInfo(null);
    setAuditResult(null);
    setIsDemoMode(false);
    setErrorMessage(null);
    setSystemStatus('ready');
  }, []);

  // Real live Gemini Multimodal API execution
  const handleRunLiveAudit = async () => {
    if (!currentImage) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setSystemStatus('analyzing');

    try {
      // Use compressed image if available to guarantee fast, sub-second upload
      const imagePayload = compressionInfo ? compressionInfo.dataUrl : currentImage;
      const mime = imagePayload.startsWith('data:image/svg+xml')
        ? 'image/svg+xml'
        : imagePayload.startsWith('data:image/webp')
        ? 'image/webp'
        : 'image/jpeg';

      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imagePayload,
          mimeType: mime,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Audit analysis request failed');
      }

      setAuditResult(payload.data);
      setIsDemoMode(false);
      setSystemStatus('ready');
    } catch (err: any) {
      console.error('Audit execution error:', err);
      setErrorMessage(
        err.message || 'An error occurred while executing the live forensic audit.'
      );
      setSystemStatus('error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Instant demo reload if user wants instant facts
  const handleLoadInstantDemo = useCallback(() => {
    if (!selectedDemoId) return;
    const demo = DEMO_SUITES.find((d) => d.id === selectedDemoId);
    if (demo) {
      setAuditResult(demo.mockResult);
      setIsDemoMode(true);
      setErrorMessage(null);
      setSystemStatus('ready');
    }
  }, [selectedDemoId]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#060911] text-slate-100 overflow-hidden select-none">
      {/* Sleek Dark Header with 3 Jury-Proof Demo Buttons */}
      <Header
        onSelectDemo={handleSelectDemo}
        selectedDemoId={selectedDemoId}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        systemStatus={systemStatus}
      />

      {/* Main Two-Column Viewport: strictly fit 1080p screen without outer scrolling */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-4 overflow-hidden flex flex-col min-h-0">
        {/* Error Notification Banner if any */}
        {errorMessage && (
          <div
            id="error-banner"
            className="mb-3 px-4 py-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-3 flex-shrink-0 animate-in fade-in"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="px-2 py-0.5 rounded bg-rose-900/60 hover:bg-rose-800 text-[11px] font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Two-Column Grid: Left Upload & Canvas Compressor, Right Digital Nutrition Label */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
          {/* Left Column: Staging, Dropzone & Canvas Compressor */}
          <div className="lg:col-span-5 h-full min-h-0">
            <LeftColumnUpload
              currentImage={currentImage}
              selectedSampleId={selectedDemoId}
              onImageSelected={handleImageSelected}
              onClear={handleClear}
              onRunAudit={handleRunLiveAudit}
              isAnalyzing={isAnalyzing}
              compressionInfo={compressionInfo}
              onLoadInstantDemo={handleLoadInstantDemo}
            />
          </div>

          {/* Right Column: Digital Nutrition Label & Deception Threat Index */}
          <div className="lg:col-span-7 h-full min-h-0">
            <DigitalNutritionLabel
              auditResult={auditResult}
              isAnalyzing={isAnalyzing}
              onRunLiveAudit={handleRunLiveAudit}
              isDemoMode={isDemoMode}
            />
          </div>
        </div>
      </main>

      {/* Methodology & Taxonomy Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}
