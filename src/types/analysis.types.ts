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
  jointMetrics: JointMetrics;
}

export interface JointMetrics {
  shoulderStress: number;
  elbowLoad: number;
  wristLoad: number;
  spineAngle: number;
  kneeStability: number;
  hipRotation: number;
  radarData: string;
  temporalErrorData: string;
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
