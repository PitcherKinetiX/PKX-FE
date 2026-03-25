export interface ComparisonResponse {
  baseline: AnalysisSummary;
  current: AnalysisSummary;
  improvementSummary: ImprovementSummary;
  coreMetrics: MetricsComparison;
  jointMetrics: Record<string, JointMetricComparison>;
  insights: string[];
}

export interface AnalysisSummary {
  analysisId: number;
  filename: string;
  analysisDate: string;
  riskGrade: 'GOOD' | 'NORMAL' | 'CAUTION' | 'DANGER';
  overallRiskScore: number;
}

export interface ImprovementSummary {
  status: 'IMPROVED' | 'DECLINED' | 'NO_CHANGE';
  improvementPercentage: number;
  message: string;
}

export interface MetricsComparison {
  overallRiskScore: MetricChange;
  consistencyScore: MetricChange;
  medicalRiskScore: MetricChange;
}

export interface MetricChange {
  baselineValue: number;
  currentValue: number;
  change: number;
  changePercentage: number;
  changeDirection: 'IMPROVED' | 'DECLINED' | 'NO_CHANGE';
}

export interface JointMetricComparison {
  jointName: string;
  baselineValue: number;
  currentValue: number;
  change: number;
  changePercentage: number;
  status: 'IMPROVED' | 'DECLINED' | 'NO_CHANGE';
}
