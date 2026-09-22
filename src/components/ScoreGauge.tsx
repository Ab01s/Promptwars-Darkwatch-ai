import React from 'react';
import { SeverityLevel } from '../types';

interface ScoreGaugeProps {
  score: number;
  severity: SeverityLevel;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, severity }) => {
  // Radius and circumference for SVG circle
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#10b981'; // Green
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let ratingText = 'Low Risk · High Ethical Integrity';

  if (severity === 'High' || score >= 60) {
    color = '#ef4444'; // Red
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    ratingText = 'High Risk · Deceptive Design Detected';
  } else if (severity === 'Medium' || score >= 25) {
    color = '#f59e0b'; // Amber
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    ratingText = 'Moderate Risk · Questionable Friction';
  }

  return (
    <div id="score-gauge-card" className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-slate-900/80 border border-slate-800">
      <div className="relative flex items-center justify-center">
        <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="text-slate-800"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tracking-tight text-white">{score}</span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Risk Score</span>
        </div>
      </div>

      <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Severity Classification:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeBg}`}>
            {severity} Severity
          </span>
        </div>
        <p className="text-sm font-medium text-slate-200">{ratingText}</p>
        <p className="text-xs text-slate-400 max-w-sm">
          Aggregated deception index based on cognitive load manipulation, covert microcopy, and non-transparent state inference.
        </p>
      </div>
    </div>
  );
};
