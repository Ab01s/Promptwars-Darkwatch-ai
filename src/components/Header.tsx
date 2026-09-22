import React from 'react';
import { ShieldCheck, BookOpen, Plane, Ban, AlertCircle, Sparkles } from 'lucide-react';
import { DEMO_SUITES } from '../utils/benchmarkSamples';

interface HeaderProps {
  onSelectDemo: (demoId: string) => void;
  selectedDemoId: string | null;
  onOpenMethodology: () => void;
  systemStatus: 'ready' | 'analyzing' | 'error';
}

export const Header: React.FC<HeaderProps> = ({
  onSelectDemo,
  selectedDemoId,
  onOpenMethodology,
  systemStatus,
}) => {
  return (
    <header
      id="main-app-header"
      className="border-b border-slate-800/90 bg-[#060911]/90 backdrop-blur-md sticky top-0 z-40 flex-shrink-0"
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-white font-mono">
                UX ETHICS AUDITOR
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Threat Inspector
              </span>
            </div>
          </div>
        </div>

        {/* 3 Jury-Proof Fast Demo Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <span className="hidden xl:inline text-[11px] font-bold font-mono text-slate-400 mr-1 uppercase">
            Jury Demos:
          </span>

          {DEMO_SUITES.map((demo) => {
            const isSelected = selectedDemoId === demo.id;
            const icon =
              demo.id === 'flight-booking' ? (
                <Plane className="w-3.5 h-3.5" />
              ) : demo.id === 'saas-cancellation' ? (
                <Ban className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              );

            return (
              <button
                key={demo.id}
                id={`demo-btn-${demo.id}`}
                onClick={() => onSelectDemo(demo.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700/80'
                }`}
                title={demo.description}
              >
                {icon}
                <span>{demo.title}</span>
              </button>
            );
          })}
        </div>

        {/* Status & Guidelines */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  systemStatus === 'analyzing' ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  systemStatus === 'analyzing' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
            </span>
            <span className="hidden lg:inline">
              {systemStatus === 'analyzing' ? 'Auditing...' : 'Gemini 1.5 Pro / Flash'}
            </span>
          </div>

          <button
            id="open-methodology-btn"
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Taxonomy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
