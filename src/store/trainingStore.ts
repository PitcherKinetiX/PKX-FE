import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TrainingState {
  isTraining: boolean;
  progress: number;
  startTraining: () => void;
  updateProgress: (progress: number) => void;
  completeTraining: () => void;
  cancelTraining: () => void;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set) => ({
      isTraining: false,
      progress: 0,
      startTraining: () => set({ isTraining: true, progress: 0 }),
      updateProgress: (progress: number) => set({ progress }),
      completeTraining: () => set({ isTraining: false, progress: 100 }),
      cancelTraining: () => set({ isTraining: false, progress: 0 }),
    }),
    {
      name: 'training-storage',
    }
  )
);
