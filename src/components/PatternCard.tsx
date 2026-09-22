import React from 'react';
import { DarkPatternDetection } from '../types';
import { AlertTriangle, ShieldCheck, Search, Quote, Sparkles } from 'lucide-react';

interface PatternCardProps {
  pattern: DarkPatternDetection;
  index: number;
}

export const PatternCard: React.FC<PatternCardProps> = ({ pattern, index }) => {
  const confidencePercent = Math.round(pattern.confidence <= 1 ? pattern.confidence * 100 : pattern.confidence);

  return (
    <div
      id={`pattern-card-${index}`}
      className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-colors shadow-sm"
    >
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-white tracking-wide">
            {pattern.patternType}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Confidence:</span>
          <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                confidencePercent >= 85
                  ? 'bg-rose-500'
                  : confidencePercent >= 60
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-semibold text-slate-300">
            {confidencePercent}%
          </span>
        </div>
      </div>

      {/* Flagged Element & Visual Clue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-1">
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span>Flagged UI Element</span>
          </div>
          <p className="text-slate-200 font-mono text-[13px]">
            {pattern.flaggedElement}
          </p>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-1">
            <Quote className="w-3.5 h-3.5 text-amber-400" />
            <span>Microcopy / Visual Clue</span>
          </div>
          <p className="text-amber-200/90 font-mono text-[12px] italic break-words">
            "{pattern.quoteOrVisualClue}"
          </p>
        </div>
      </div>

      {/* Deceptive Tactic Breakdown */}
      <div className="bg-rose-950/20 border border-rose-900/30 p-3.5 rounded-lg">
        <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-xs mb-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Deceptive Tactic Forensic Analysis</span>
        </div>
        <p className="text-xs leading-relaxed text-rose-200/80">
          {pattern.deceptiveTactic}
        </p>
      </div>

      {/* Ethical UX Alternative */}
      <div className="bg-emerald-950/20 border border-emerald-900/30 p-3.5 rounded-lg">
        <div className="flex items-center gap-1.5 text-emerald-300 font-semibold text-xs mb-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ethical &amp; Compliant Redesign Solution</span>
        </div>
        <p className="text-xs leading-relaxed text-emerald-200/80">
          {pattern.ethicalAlternative}
        </p>
      </div>
    </div>
  );
};
