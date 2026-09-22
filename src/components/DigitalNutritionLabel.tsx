import React, { useState } from 'react';
import { AuditResult, DarkPatternDetection } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Quote,
  AlertTriangle,
  FileCode,
  Copy,
  Check,
  Download,
  Flame,
  CheckCircle,
  Clock,
  Cpu,
} from 'lucide-react';

interface DigitalNutritionLabelProps {
  auditResult: AuditResult | null;
  isAnalyzing: boolean;
  onRunLiveAudit?: () => void;
  isDemoMode?: boolean;
}

export const DigitalNutritionLabel: React.FC<DigitalNutritionLabelProps> = ({
  auditResult,
  isAnalyzing,
  onRunLiveAudit,
  isDemoMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  if (isAnalyzing) {
    return (
      <div
        id="digital-nutrition-label-loading"
        className="h-full rounded-2xl bg-[#090d16] border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Generating Digital Nutrition Label...
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Scrutinizing visual hierarchy, linguistic microcopy &amp; inferred states
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span>Multimodal Cognitive Inference Active</span>
        </div>
      </div>
    );
  }

  if (!auditResult) {
    return (
      <div
        id="digital-nutrition-label-empty"
        className="h-full rounded-2xl bg-[#090d16] border border-dashed border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4 text-slate-400"
      >
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white mb-1">
            Digital Nutrition Label Awaiting Input
          </h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Select a <strong>Jury Demo</strong> above or drop a screenshot on the left to compute the Deception Threat Index and generate the compliance breakdown.
          </p>
        </div>
      </div>
    );
  }

  const { darkPatternScore, severity, patternsDetected, error, executionTimeMs, analyzedModel } = auditResult;

  // Severity color mapping: Green (0-25), Amber (26-60), Red (61-100)
  let severityBadgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  let gaugeColor = '#10b981';
  let threatLabel = 'LOW DECEPTION RISK';

  if (severity === 'High' || darkPatternScore >= 61) {
    severityBadgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    gaugeColor = '#f43f5e';
    threatLabel = 'HIGH COERCION RISK';
  } else if (severity === 'Medium' || darkPatternScore >= 26) {
    severityBadgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    gaugeColor = '#f59e0b';
    threatLabel = 'MODERATE FRICTION RISK';
  }

  // Raw JSON format matching exact responseSchema
  const rawSchemaPayload = {
    darkPatternScore,
    severity,
    ...(error ? { error } : {}),
    patternsDetected: patternsDetected.map((p) => ({
      patternType: p.patternType,
      confidence: p.confidence,
      flaggedElement: p.flaggedElement,
      quoteOrVisualClue: p.quoteOrVisualClue,
      deceptiveTactic: p.deceptiveTactic,
      ethicalAlternative: p.ethicalAlternative,
    })),
  };
  const jsonString = JSON.stringify(rawSchemaPayload, null, 2);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-nutrition-audit-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="digital-nutrition-panel"
      className="h-full rounded-2xl bg-[#090d16] border border-slate-800 flex flex-col overflow-hidden shadow-2xl relative"
    >
      {/* Label Header Styled like Official Digital Compliance Standard */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wider uppercase text-white font-mono">
                Digital Nutrition Label
              </h2>
              {isDemoMode && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Fast Demo Loaded
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              UX Ethics &amp; Cognitive Safety Compliance Inspector
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="toggle-raw-json-btn"
            onClick={() => setShowRawJson(!showRawJson)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showRawJson
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{showRawJson ? 'Cards View' : 'Raw JSON'}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {/* Invalid UI Error Notice */}
        {error && (
          <div
            id="not-a-ui-alert"
            className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-sm text-rose-100">Input Validation Alert: {error}</strong>
              <p className="mt-1 text-rose-300/80">
                The uploaded image was classified as a non-software photo or document. As required by audit rule #1, darkPatternScore is 0 and no patterns were flagged.
              </p>
            </div>
          </div>
        )}

        {/* Nutrition Header Facts Box */}
        <div className="bg-slate-950/80 border-2 border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
          <div className="border-b-4 border-slate-700 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black tracking-tight text-white uppercase font-mono">
                Deception Threat Index
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${severityBadgeColor}`}>
                {severity} ({threatLabel})
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Serving Size: 1 Audited User Interface · Reference: Principal UX Ethics Taxonomy
            </div>
          </div>

          {/* Large Gauge & Threat Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Circular Gauge */}
            <div className="sm:col-span-5 flex items-center justify-center py-1">
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r="56"
                    className="text-slate-800"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="56"
                    stroke={gaugeColor}
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 - (darkPatternScore / 100) * (2 * Math.PI * 56)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white font-mono tracking-tight">
                    {darkPatternScore}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    / 100 Threat
                  </span>
                </div>
              </div>
            </div>

            {/* Nutrition Facts Table */}
            <div className="sm:col-span-7 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800 py-1">
                <span className="text-slate-400">Total Patterns Flagged:</span>
                <span className="font-bold text-white">{patternsDetected.length} of max 5</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 py-1">
                <span className="text-slate-400">Severity Level:</span>
                <span className={`font-bold ${severity === 'High' ? 'text-rose-400' : severity === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {severity} (0-25 Low, 26-60 Med, 61-100 High)
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 py-1">
                <span className="text-slate-400">Cognitive Autonomy:</span>
                <span className="font-bold text-slate-200">{100 - darkPatternScore}%</span>
              </div>
              <div className="flex justify-between py-1 text-[11px] text-slate-500">
                <span>Model: {analyzedModel || 'gemini-3.1-pro-preview'}</span>
                <span>{executionTimeMs ? `${executionTimeMs}ms` : 'instant'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle: Raw JSON or Nutrition Cards */}
        {showRawJson ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Raw Schema JSON Output (Enforced Format):</span>
              <div className="flex items-center gap-2">
                <button
                  id="copy-raw-json-btn"
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  id="dl-raw-json-btn"
                  onClick={handleDownloadJson}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
              {jsonString}
            </pre>
          </div>
        ) : (
          /* Itemized Pattern Breakdown Cards */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                Itemized Pattern Breakdown ({patternsDetected.length})
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Sorted by Confidence Descending</span>
            </div>

            {patternsDetected.length === 0 && !error ? (
              <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-200">Ethical Baseline Confirmed</h4>
                <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                  No deceptive patterns, forced states, or manipulative microcopy were detected in this interface.
                </p>
              </div>
            ) : (
              patternsDetected.map((pattern: DarkPatternDetection, idx: number) => {
                const confPercent = Math.round(
                  pattern.confidence <= 1 ? pattern.confidence * 100 : pattern.confidence
                );

                return (
                  <div
                    key={idx}
                    id={`pattern-card-${idx}`}
                    className="rounded-xl bg-slate-950 border border-slate-800/90 p-4 space-y-3.5 hover:border-slate-700 transition-all shadow-md relative overflow-hidden"
                  >
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 via-amber-500 to-transparent" />

                    {/* Header: Pattern Name & Confidence */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-300 text-xs font-bold font-mono flex items-center justify-center border border-rose-500/30">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          {pattern.patternType}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">Confidence:</span>
                        <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full"
                            style={{ width: `${confPercent}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-200">
                          {confPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Flagged Element & Quote/Visual Trigger */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
                          <Search className="w-3 h-3" />
                          <span>Flagged UI Element</span>
                        </div>
                        <p className="text-slate-200 font-mono text-[12px] break-words">
                          {pattern.flaggedElement}
                        </p>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
                          <Quote className="w-3 h-3" />
                          <span>Direct Quote / Visual Trigger</span>
                        </div>
                        <p className="text-amber-200/90 font-mono text-[11px] italic break-words">
                          "{pattern.quoteOrVisualClue}"
                        </p>
                      </div>
                    </div>

                    {/* Why It's Deceptive */}
                    <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-300 font-bold uppercase text-[10px] tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Why It's Deceptive</span>
                      </div>
                      <p className="text-rose-200/90 leading-relaxed text-[12px]">
                        {pattern.deceptiveTactic}
                      </p>
                    </div>

                    {/* Prominent Green Ethical Alternative Badge & Prescription */}
                    <div className="bg-emerald-950/30 border border-emerald-600/50 p-3.5 rounded-lg text-xs space-y-1.5 shadow-[0_0_15px_rgba(16,185,129,0.08)]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1 shadow">
                          <CheckCircle className="w-3 h-3" />
                          <span>Ethical Alternative</span>
                        </span>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          Compliance Redesign Fix
                        </span>
                      </div>
                      <p className="text-emerald-200/90 leading-relaxed text-[12px]">
                        {pattern.ethicalAlternative}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
