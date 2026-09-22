import React, { useState } from 'react';
import { Copy, Check, Download, FileCode } from 'lucide-react';
import { AuditResult } from '../types';

interface JsonViewerProps {
  auditResult: AuditResult;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ auditResult }) => {
  const [copied, setCopied] = useState(false);

  // Exact raw JSON representation according to responseSchema
  const rawSchemaPayload = {
    darkPatternScore: auditResult.darkPatternScore,
    severity: auditResult.severity,
    ...(auditResult.error ? { error: auditResult.error } : {}),
    patternsDetected: auditResult.patternsDetected.map((p) => ({
      patternType: p.patternType,
      confidence: p.confidence,
      flaggedElement: p.flaggedElement,
      quoteOrVisualClue: p.quoteOrVisualClue,
      deceptiveTactic: p.deceptiveTactic,
      ethicalAlternative: p.ethicalAlternative,
    })),
  };

  const jsonString = JSON.stringify(rawSchemaPayload, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ux-ethics-audit-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="json-viewer-container" className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 font-mono">
            Compliance Audit Raw Schema Output
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="copy-json-button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Copy exact JSON payload"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <button
            id="download-json-button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Download JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto max-h-96">
        <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
