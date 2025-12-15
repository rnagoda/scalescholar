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
  ScaleDegree,
  ALL_SCALE_DEGREES,
  STARTER_SCALE_DEGREES,
} from '../utils/music';

interface IntervalProgress {
  stats: ExerciseStats;
  itemStats: ItemStats[];
  unlockedIntervals: Interval[];
}

interface ScaleDegreeProgress {
  stats: ExerciseStats;
  itemStats: ItemStats[];
  unlockedDegrees: ScaleDegree[];
}

interface ProgressState {
  // Interval trainer progress
  intervalProgress: IntervalProgress;

  // Scale degree trainer progress
  scaleDegreeProgress: ScaleDegreeProgress;

  // Loading state
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  refreshIntervalProgress: () => Promise<void>;
  refreshScaleDegreeProgress: () => Promise<void>;

  // Record interval attempts
  recordIntervalAttempt: (
    interval: Interval,
    correct: boolean,
    responseTimeMs?: number
  ) => Promise<void>;

  // Record interval session
  recordIntervalSession: (
    totalQuestions: number,
    correctAnswers: number
  ) => Promise<string[]>;

  // Record scale degree attempts
  recordScaleDegreeAttempt: (
    degree: ScaleDegree,
    correct: boolean,
    responseTimeMs?: number
  ) => Promise<void>;

  // Record scale degree session
  recordScaleDegreeSession: (
    totalQuestions: number,
    correctAnswers: number
  ) => Promise<string[]>;

  // Check if interval is unlocked
  isIntervalUnlocked: (interval: Interval) => boolean;

  // Get unlocked intervals
  getUnlockedIntervals: () => Interval[];

  // Check if scale degree is unlocked
  isScaleDegreeUnlocked: (degree: ScaleDegree) => boolean;

  // Get unlocked scale degrees
  getUnlockedScaleDegrees: () => ScaleDegree[];
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

const DEFAULT_SCALE_DEGREE_PROGRESS: ScaleDegreeProgress = {
  stats: {
    totalAttempts: 0,
    correctAttempts: 0,
    accuracy: 0,
    recentAccuracy: 0,
    streak: 0,
  },
  itemStats: [],
  unlockedDegrees: [...STARTER_SCALE_DEGREES],
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  intervalProgress: DEFAULT_INTERVAL_PROGRESS,
  scaleDegreeProgress: DEFAULT_SCALE_DEGREE_PROGRESS,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });
    try {
      await Promise.all([
        get().refreshIntervalProgress(),
        get().refreshScaleDegreeProgress(),
      ]);
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

  refreshScaleDegreeProgress: async () => {
    try {
      const [stats, itemStats, unlockedItems] = await Promise.all([
        getExerciseStats('scale-degrees'),
        getAllItemStats('scale-degrees'),
        getUnlockedItems('scale-degrees'),
      ]);

      const unlockedDegrees =
        unlockedItems.length > 0
          ? (unlockedItems.map((id) => parseInt(id, 10)) as ScaleDegree[])
          : [...STARTER_SCALE_DEGREES];

      set({
        scaleDegreeProgress: {
          stats,
          itemStats,
          unlockedDegrees,
        },
      });
    } catch (error) {
      console.error('Failed to refresh scale degree progress:', error);
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

      const allIntervalIds = ALL_INTERVALS.map((i) => i.toString());
      const starterIds = STARTER_INTERVALS.map((i) => i.toString());

      const newUnlocks = await checkAndProcessUnlocks(
        'intervals',
        allIntervalIds,
        starterIds
      );

      await get().refreshIntervalProgress();

      return newUnlocks;
    } catch (error) {
      console.error('Failed to record interval session:', error);
      return [];
    }
  },

  recordScaleDegreeAttempt: async (
    degree: ScaleDegree,
    correct: boolean,
    responseTimeMs?: number
  ) => {
    try {
      await saveAttempt('scale-degrees', degree.toString(), correct, responseTimeMs);
    } catch (error) {
      console.error('Failed to record scale degree attempt:', error);
    }
  },

  recordScaleDegreeSession: async (
    totalQuestions: number,
    correctAnswers: number
  ): Promise<string[]> => {
    try {
      await saveSession('scale-degrees', totalQuestions, correctAnswers);

      const allDegreeIds = ALL_SCALE_DEGREES.map((d) => d.toString());
      const starterIds = STARTER_SCALE_DEGREES.map((d) => d.toString());

      const newUnlocks = await checkAndProcessUnlocks(
        'scale-degrees',
        allDegreeIds,
        starterIds
      );

      await get().refreshScaleDegreeProgress();

      return newUnlocks;
    } catch (error) {
      console.error('Failed to record scale degree session:', error);
      return [];
    }
  },

  isIntervalUnlocked: (interval: Interval): boolean => {
    return get().intervalProgress.unlockedIntervals.includes(interval);
  },

  getUnlockedIntervals: (): Interval[] => {
    return get().intervalProgress.unlockedIntervals;
  },

  isScaleDegreeUnlocked: (degree: ScaleDegree): boolean => {
    return get().scaleDegreeProgress.unlockedDegrees.includes(degree);
  },

  getUnlockedScaleDegrees: (): ScaleDegree[] => {
    return get().scaleDegreeProgress.unlockedDegrees;
  },
}));
