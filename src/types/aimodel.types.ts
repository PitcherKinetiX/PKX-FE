export interface ModelStatusResponse {
  hasCustomModel: boolean;
  currentModelType: 'USER_SPECIFIC' | 'GENERAL';
  trainingStatus: 'NOT_STARTED' | 'TRAINING' | 'READY' | 'FAILED';
  modelAccuracy: number | null;
  trainingSampleCount: number;
  lastTrainedAt: string | null;
  nextTrainingAvailable: string | null;
  canTrain: boolean;
  cannotTrainReason: string | null;
  trainingProgress: number;
}

export interface TrainRequest {
  analysisIds: number[];
  notes?: string;
}

export interface TrainResponse {
  trainingJobId: string;
  status: 'TRAINING';
  sampleCount: number;
  estimatedCompletionTime: string;
  message: string;
}
