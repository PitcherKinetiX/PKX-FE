export interface AnalysisListItem {
  analysisId: number;
  videoFilename: string;
  videoDurationSeconds: number;
  status: string;
  createdAt: string;
  completedAt: string | null;
  riskGrade?: string;
  overallRiskScore?: number;
}

export interface AnalysisDetail {
  analysisId: number;
  videoFilename: string;
  videoSizeBytes: number;
  videoDurationSeconds: number;
  status: string;
  createdAt: string;
  completedAt: string | null;
  result?: AnalysisResult;
}

export interface AnalysisResult {
  overallRiskScore: number;
  consistencyScore: number;
  medicalRiskScore: number;
  riskGrade: string;
  modelType: string;
  modelAccuracy: number;
  riskSummary: string;
  recommendations: string[];
  criticalZoneDetected: boolean;
  criticalZoneDescription: string | null;
  features: FeatureDetail[];
}

// 13개 생체역학 특징 (angle 8개 + velocity 5개)
export interface FeatureDetail {
  index: number;
  name: string;
  type: 'angle' | 'velocity';
  userError: number;
  generalError: number;
  level: '정상' | '양호' | '주의' | '위험';
  // velocity 타입 전용
  peakValue?: number;
  dangerRatio?: number;
  medicalScore?: number;
}

export interface AnalysisStatus {
  analysisId: number;
  status: string;
  message: string;
  progress: number;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}
