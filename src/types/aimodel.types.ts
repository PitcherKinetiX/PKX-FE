export type ModelTrainingStatus = 'NOT_TRAINED' | 'NOT_STARTED' | 'TRAINING' | 'READY' | 'FAILED';

export interface ModelStatusResponse {
  hasCustomModel: boolean;
  currentModelType: 'USER_SPECIFIC' | 'GENERAL';
  trainingStatus: ModelTrainingStatus;
  modelAccuracy: number | null;
  trainingSampleCount: number;
  lastTrainedAt: string | null;
  nextTrainingAvailable: string | null;
  canTrain: boolean;
  cannotTrainReason: string | null;
  trainingProgress: number;
}

export interface TrainResponse {
  trainingJobId: string;
  status: 'TRAINING';
  sampleCount: number;
  estimatedCompletionTime: string;
  message: string;
}
