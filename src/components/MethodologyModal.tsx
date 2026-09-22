import React from 'react';
import { X, ShieldAlert, CheckCircle2, BookOpen, AlertOctagon } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="methodology-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Forensic Audit Methodology &amp; Taxonomy Guidelines</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Section 1: Methodology */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-indigo-400 mb-3 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              1. Forensic Triad Methodology
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-white block mb-1">1. Visual Hierarchy</span>
                <p className="text-slate-400">
                  Contrast ratio audits, asymmetrical sizing, muted font colors on opt-out options, and obfuscating optical weight.
                </p>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-white block mb-1">2. Microcopy Audit</span>
                <p className="text-slate-400">
                  Scrutiny of text for guilt-tripping, double-negative phrasing, loss-aversion framing, and deceptive ambiguity.
                </p>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-white block mb-1">3. State Inference</span>
                <p className="text-slate-400">
                  Pre-checked checkboxes, default opt-in states, disguised advertising banners, and labyrinthine multi-screen exit paths.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Taxonomy to Enforce */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-rose-400 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              2. Dark Pattern Taxonomy Enforced
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <strong className="text-rose-300">Confirmshaming:</strong> Guilt-tripping or emotionally manipulative text for opting out (e.g., "No, I hate saving money").
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <strong className="text-rose-300">Fake Scarcity / Urgency:</strong> Fabricated stock counters, countdown clocks, or artificial demand alerts.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <strong className="text-rose-300">Hidden Costs / Drip Pricing:</strong> Unannounced service fees, forced additions, or dynamic surcharges revealed only at checkout.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <strong className="text-rose-300">Sneak into Basket:</strong> Unchecked or pre-selected add-ons automatically bundled into the cart.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <strong className="text-rose-300">Roach Motel:</strong> Complex, obfuscated paths designed to make account cancellation exceedingly difficult.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <strong className="text-rose-300">Disguised Ads:</strong> Advertisements styled indistinguishably from native site navigation or content.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <strong className="text-rose-300">Forced Continuity:</strong> Subscription sign-ups lacking transparent cancellation disclosure or renewal notice.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <strong className="text-rose-300">Trick Questions:</strong> Double negatives or confusing UI switches in consent forms.
              </div>
            </div>
          </div>

          {/* Section 3: Negative Constraints */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              3. Negative Constraints (Do Not Flag)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Transparent, clearly labeled shipping fees or standard statutory sales taxes itemized visibly.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Standard primary vs. secondary button styling that does not use sub-threshold contrast (must be readable).</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Standard promotional banners or newsletter opt-ins that provide a clear, accessible close button.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close Guidelines
          </button>
        </div>
      </div>
    </div>
  );
};
