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
  ChordQuality,
  ALL_CHORD_QUALITIES,
  STARTER_CHORD_QUALITIES,
} from '../utils/music';
import { useXPStore } from './useXPStore';

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

interface ChordProgress {
  stats: ExerciseStats;
  itemStats: ItemStats[];
  unlockedQualities: ChordQuality[];
}

interface ProgressState {
  // Interval trainer progress
  intervalProgress: IntervalProgress;

  // Scale degree trainer progress
  scaleDegreeProgress: ScaleDegreeProgress;

  // Chord quality trainer progress
  chordProgress: ChordProgress;

  // Loading state
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  refreshIntervalProgress: () => Promise<void>;
  refreshScaleDegreeProgress: () => Promise<void>;
  refreshChordProgress: () => Promise<void>;

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

  // Record chord quality attempts
  recordChordAttempt: (
    quality: ChordQuality,
    correct: boolean,
    responseTimeMs?: number
  ) => Promise<void>;

  // Record chord quality session
  recordChordSession: (
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

  // Check if chord quality is unlocked
  isChordQualityUnlocked: (quality: ChordQuality) => boolean;

  // Get unlocked chord qualities
  getUnlockedChordQualities: () => ChordQuality[];
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

const DEFAULT_CHORD_PROGRESS: ChordProgress = {
  stats: {
    totalAttempts: 0,
    correctAttempts: 0,
    accuracy: 0,
    recentAccuracy: 0,
    streak: 0,
  },
  itemStats: [],
  unlockedQualities: [...STARTER_CHORD_QUALITIES],
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  intervalProgress: DEFAULT_INTERVAL_PROGRESS,
  scaleDegreeProgress: DEFAULT_SCALE_DEGREE_PROGRESS,
  chordProgress: DEFAULT_CHORD_PROGRESS,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });
    try {
      await Promise.all([
        get().refreshIntervalProgress(),
        get().refreshScaleDegreeProgress(),
        get().refreshChordProgress(),
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

  refreshChordProgress: async () => {
    try {
      const [stats, itemStats, unlockedItems] = await Promise.all([
        getExerciseStats('chords'),
        getAllItemStats('chords'),
        getUnlockedItems('chords'),
      ]);

      const unlockedQualities =
        unlockedItems.length > 0
          ? (unlockedItems as ChordQuality[])
          : [...STARTER_CHORD_QUALITIES];

      set({
        chordProgress: {
          stats,
          itemStats,
          unlockedQualities,
        },
      });
    } catch (error) {
      console.error('Failed to refresh chord progress:', error);
    }
  },

  recordIntervalAttempt: async (
    interval: Interval,
    correct: boolean,
    responseTimeMs?: number
  ) => {
    try {
      await saveAttempt('intervals', interval.toString(), correct, responseTimeMs);
      if (correct) {
        await useXPStore.getState().awardEarSchoolCorrect();
      }
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

      // Award session completion XP
      await useXPStore.getState().awardEarSchoolSession();

      const allIntervalIds = ALL_INTERVALS.map((i) => i.toString());
      const starterIds = STARTER_INTERVALS.map((i) => i.toString());

      const newUnlocks = await checkAndProcessUnlocks(
        'intervals',
        allIntervalIds,
        starterIds
      );

      // Award XP for each new unlock
      for (const unlock of newUnlocks) {
        await useXPStore.getState().awardNewUnlock(`Interval: ${unlock}`);
      }

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
      if (correct) {
        await useXPStore.getState().awardEarSchoolCorrect();
      }
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

      // Award session completion XP
      await useXPStore.getState().awardEarSchoolSession();

      const allDegreeIds = ALL_SCALE_DEGREES.map((d) => d.toString());
      const starterIds = STARTER_SCALE_DEGREES.map((d) => d.toString());

      const newUnlocks = await checkAndProcessUnlocks(
        'scale-degrees',
        allDegreeIds,
        starterIds
      );

      // Award XP for each new unlock
      for (const unlock of newUnlocks) {
        await useXPStore.getState().awardNewUnlock(`Scale Degree: ${unlock}`);
      }

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

  recordChordAttempt: async (
    quality: ChordQuality,
    correct: boolean,
    responseTimeMs?: number
  ) => {
    try {
      await saveAttempt('chords', quality, correct, responseTimeMs);
      if (correct) {
        await useXPStore.getState().awardEarSchoolCorrect();
      }
    } catch (error) {
      console.error('Failed to record chord attempt:', error);
    }
  },

  recordChordSession: async (
    totalQuestions: number,
    correctAnswers: number
  ): Promise<string[]> => {
    try {
      await saveSession('chords', totalQuestions, correctAnswers);

      // Award session completion XP
      await useXPStore.getState().awardEarSchoolSession();

      const allQualityIds = ALL_CHORD_QUALITIES;
      const starterIds = STARTER_CHORD_QUALITIES;

      const newUnlocks = await checkAndProcessUnlocks(
        'chords',
        allQualityIds,
        starterIds
      );

      // Award XP for each new unlock
      for (const unlock of newUnlocks) {
        await useXPStore.getState().awardNewUnlock(`Chord: ${unlock}`);
      }

      await get().refreshChordProgress();

      return newUnlocks;
    } catch (error) {
      console.error('Failed to record chord session:', error);
      return [];
    }
  },

  isChordQualityUnlocked: (quality: ChordQuality): boolean => {
    return get().chordProgress.unlockedQualities.includes(quality);
  },

  getUnlockedChordQualities: (): ChordQuality[] => {
    return get().chordProgress.unlockedQualities;
  },
}));
