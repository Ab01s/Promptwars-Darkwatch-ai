import React, { useState } from 'react';
import { AuditResult } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { PatternCard } from './PatternCard';
import { JsonViewer } from './JsonViewer';
import {
  ShieldCheck,
  AlertOctagon,
  FileText,
  Code2,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AuditResultsProps {
  result: AuditResult;
  onReset: () => void;
}

export const AuditResults: React.FC<AuditResultsProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'json' | 'methodology'>('cards');

  const isInvalidUi = Boolean(result.error);
  const isEthicalClean = !isInvalidUi && result.darkPatternScore === 0 && result.patternsDetected.length === 0;

  return (
    <div id="audit-results-container" className="space-y-6 animate-in fade-in duration-300">
      {/* Overview Top Card */}
      <div className="flex flex-col gap-6">
        <ScoreGauge score={result.darkPatternScore} severity={result.severity} />

        {/* Invalid UI Error Banner if applicable */}
        {isInvalidUi && (
          <div
            id="invalid-ui-warning"
            className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 flex items-start gap-3"
          >
            <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-100">Input Validation Notice: {result.error}</h4>
              <p className="text-xs text-rose-300/80 mt-1">
                The forensic inspection engine detected that the uploaded image does not represent a software UI, website, mobile application, or digital checkout interface. As required by Rule 1, darkPatternScore is set to 0 and no patterns are flagged.
              </p>
            </div>
          </div>
        )}

        {/* Ethical Clean UI Banner if applicable */}
        {isEthicalClean && (
          <div
            id="ethical-clean-banner"
            className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-emerald-200 flex items-start gap-3.5"
          >
            <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-100">Ethical Baseline Confirmed — Zero Dark Patterns Detected</h4>
              <p className="text-xs text-emerald-300/80 mt-1 leading-relaxed">
                The audited interface strictly adheres to fair UX ethics principles. All optional add-ons remain opt-in by default, pricing terms and fees are transparently disclosed before checkout, cancelation terms are straightforward, and visual contrast supports unambiguous user agency.
              </p>
            </div>
          </div>
        )}

        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 bg-slate-900/40 px-4 py-2.5 rounded-lg border border-slate-800/80 gap-3 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Inspector: {result.analyzedModel || 'gemini-3.8-flash'}</span>
            </span>
            {result.executionTimeMs && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Latency: {result.executionTimeMs}ms</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">
              {result.patternsDetected.length} Pattern{result.patternsDetected.length === 1 ? '' : 's'} Logged
            </span>
            <span className="text-slate-600">·</span>
            <span>Max 5 Enforced</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            id="tab-btn-cards"
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'cards'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Forensic Findings ({result.patternsDetected.length})</span>
          </button>

          <button
            id="tab-btn-json"
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'json'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Raw JSON Schema</span>
          </button>

          <button
            id="tab-btn-methodology"
            onClick={() => setActiveTab('methodology')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'methodology'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Compliance Reasoning</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'cards' && (
        <div id="findings-cards-panel" className="space-y-4">
          {result.patternsDetected.length > 0 ? (
            result.patternsDetected.map((pattern, index) => (
              <PatternCard key={index} pattern={pattern} index={index} />
            ))
          ) : !isInvalidUi ? (
            <div className="p-8 text-center rounded-xl bg-slate-900/30 border border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-200">No Deceptive Patterns Flagged</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                The interface respected negative constraints and did not deploy manipulative microcopy, obfuscated cancellation, fake urgency, or pre-selected add-ons.
              </p>
            </div>
          ) : null}
        </div>
      )}

      {activeTab === 'json' && (
        <div id="json-panel">
          <JsonViewer auditResult={result} />
        </div>
      )}

      {activeTab === 'methodology' && (
        <div id="methodology-panel" className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4 text-xs">
          <h4 className="font-bold text-sm text-white">Forensic Compliance Reasoning &amp; Triad Audit</h4>
          <p className="text-slate-300 leading-relaxed">
            The audit evaluated the interface across the three canonical axes defined in the Principal UX Ethics Auditor specification:
          </p>
          <div className="space-y-3 mt-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <strong className="text-indigo-300 block mb-1">1. Visual Hierarchy Assessment</strong>
              <p className="text-slate-400">
                Checks whether high optical weight is deliberately reserved for high-revenue or coercive pathways while critical disclosures or opt-out controls are suppressed into sub-WCAG contrast or diminutive font sizes.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <strong className="text-indigo-300 block mb-1">2. Microcopy Audit &amp; Linguistic Forensic</strong>
              <p className="text-slate-400">
                Scrutinizes confirmshaming guilt mechanisms, loss-aversion rhetoric, double-negatives, and urgency prompts for veracity and cognitive manipulation.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <strong className="text-indigo-300 block mb-1">3. State Inference &amp; Friction Audit</strong>
              <p className="text-slate-400">
                Detects whether user intent was unilaterally assumed via pre-checked checkboxes, whether cancellation paths are multi-step labyrinths (Roach Motel), or whether fees were withheld until payment authorization.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
