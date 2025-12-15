import { create } from 'zustand';
import {
  ExerciseType,
  ExerciseStats,
  ItemStats,
  getExerciseStats,
  getAllItemStats,
  getUnlockedItems,
  saveAttempt,
  saveSession,
  checkAndProcessUnlocks,
} from '../services/progressService';
import {
  Interval,
  ALL_INTERVALS,
  STARTER_INTERVALS,
} from '../utils/music';

interface IntervalProgress {
  stats: ExerciseStats;
  itemStats: ItemStats[];
  unlockedIntervals: Interval[];
}

interface ProgressState {
  // Interval trainer progress
  intervalProgress: IntervalProgress;

  // Loading state
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  refreshIntervalProgress: () => Promise<void>;

  // Record attempts
  recordIntervalAttempt: (
    interval: Interval,
    correct: boolean,
    responseTimeMs?: number
  ) => Promise<void>;

  // Record completed session
  recordIntervalSession: (
    totalQuestions: number,
    correctAnswers: number
  ) => Promise<string[]>; // Returns new unlocks

  // Check if interval is unlocked
  isIntervalUnlocked: (interval: Interval) => boolean;

  // Get unlocked intervals
  getUnlockedIntervals: () => Interval[];
}

const DEFAULT_INTERVAL_PROGRESS: IntervalProgress = {
  stats: {
    totalAttempts: 0,
    correctAttempts: 0,
    accuracy: 0,
    recentAccuracy: 0,
    streak: 0,
  },
  itemStats: [],
  unlockedIntervals: [...STARTER_INTERVALS],
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  intervalProgress: DEFAULT_INTERVAL_PROGRESS,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });
    try {
      await get().refreshIntervalProgress();
      set({ isInitialized: true });
    } catch (error) {
      console.error('Failed to initialize progress store:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshIntervalProgress: async () => {
    try {
      const [stats, itemStats, unlockedItems] = await Promise.all([
        getExerciseStats('intervals'),
        getAllItemStats('intervals'),
        getUnlockedItems('intervals'),
      ]);

      // Convert unlocked item IDs to Interval enum values
      // If nothing unlocked yet, use starter intervals
      const unlockedIntervals =
        unlockedItems.length > 0
          ? (unlockedItems.map((id) => parseInt(id, 10)) as Interval[])
          : [...STARTER_INTERVALS];

      set({
        intervalProgress: {
          stats,
          itemStats,
          unlockedIntervals,
        },
      });
    } catch (error) {
      console.error('Failed to refresh interval progress:', error);
    }
  },

  recordIntervalAttempt: async (
    interval: Interval,
    correct: boolean,
    responseTimeMs?: number
  ) => {
    try {
      await saveAttempt('intervals', interval.toString(), correct, responseTimeMs);
    } catch (error) {
      console.error('Failed to record interval attempt:', error);
    }
  },

  recordIntervalSession: async (
    totalQuestions: number,
    correctAnswers: number
  ): Promise<string[]> => {
    try {
      await saveSession('intervals', totalQuestions, correctAnswers);

      // Check for new unlocks
      const allIntervalIds = ALL_INTERVALS.map((i) => i.toString());
      const starterIds = STARTER_INTERVALS.map((i) => i.toString());

      const newUnlocks = await checkAndProcessUnlocks(
        'intervals',
        allIntervalIds,
        starterIds
      );

      // Refresh progress data
      await get().refreshIntervalProgress();

      return newUnlocks;
    } catch (error) {
      console.error('Failed to record interval session:', error);
      return [];
    }
  },

  isIntervalUnlocked: (interval: Interval): boolean => {
    return get().intervalProgress.unlockedIntervals.includes(interval);
  },

  getUnlockedIntervals: (): Interval[] => {
    return get().intervalProgress.unlockedIntervals;
  },
}));
