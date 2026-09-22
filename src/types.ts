export type SeverityLevel = 'Low' | 'Medium' | 'High';

export interface DarkPatternDetection {
  patternType: string;
  confidence: number;
  flaggedElement: string;
  quoteOrVisualClue: string;
  deceptiveTactic: string;
  ethicalAlternative: string;
}

export interface AuditResult {
  darkPatternScore: number;
  severity: SeverityLevel;
  error?: string;
  patternsDetected: DarkPatternDetection[];
  auditTimestamp?: string;
  analyzedModel?: string;
  executionTimeMs?: number;
}

export interface BenchmarkSample {
  id: string;
  title: string;
  category: string;
  expectedPatterns: string[];
  description: string;
  dataUrl: string;
}
