/**
 * XP Store
 *
 * Zustand store for app-wide XP tracking and level progression.
 */

import { create } from 'zustand';
import {
  XPSource,
  XPState,
  XP_AMOUNTS,
  getLevelFromXP,
  getLevelProgress,
  getXPToNextLevel,
} from '../types/xp';
import {
  awardXP as awardXPToDb,
  getTotalXP,
  getXPState as getXPStateFromDb,
  getTodayXP,
} from '../services/xpService';

interface XPStoreState extends XPState {
  // Today's XP for daily tracking
  todayXP: number;

  // Loading state
  isLoading: boolean;
  isInitialized: boolean;

  // Last XP gain for animation/display
  lastXPGain: number | null;

  // Actions
  initialize: () => Promise<void>;
  refreshXP: () => Promise<void>;

  // Award XP from various sources
  addXP: (source: XPSource, amount: number, details?: string) => Promise<void>;

  // Convenience methods for common XP awards
  awardEarSchoolCorrect: () => Promise<void>;
  awardEarSchoolSession: () => Promise<void>;
  awardLessonBlockCorrect: (isFirstTry: boolean) => Promise<void>;
  awardLessonComplete: (lessonId: string) => Promise<void>;
  awardNewUnlock: (itemDescription: string) => Promise<void>;
  awardVoiceExerciseCorrect: () => Promise<void>;
  awardVoiceSessionComplete: () => Promise<void>;

  // Clear last XP gain (after animation)
  clearLastXPGain: () => void;
}

const DEFAULT_XP_STATE: XPState = {
  totalXP: 0,
  currentLevel: 1,
  levelTitle: 'Beginner',
  levelProgress: 0,
  xpToNextLevel: 100,
};

export const useXPStore = create<XPStoreState>((set, get) => ({
  ...DEFAULT_XP_STATE,
  todayXP: 0,
  isLoading: false,
  isInitialized: false,
  lastXPGain: null,

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });
    try {
      const [xpState, todayXP] = await Promise.all([
        getXPStateFromDb(),
        getTodayXP(),
      ]);

      set({
        ...xpState,
        todayXP,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize XP store:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshXP: async () => {
    try {
      const [xpState, todayXP] = await Promise.all([
        getXPStateFromDb(),
        getTodayXP(),
      ]);

      set({
        ...xpState,
        todayXP,
      });
    } catch (error) {
      console.error('Failed to refresh XP:', error);
    }
  },

  addXP: async (source: XPSource, amount: number, details?: string) => {
    try {
      await awardXPToDb(source, amount, details);

      // Update local state optimistically
      const currentTotal = get().totalXP;
      const newTotal = currentTotal + amount;
      const level = getLevelFromXP(newTotal);

      set({
        totalXP: newTotal,
        currentLevel: level.level,
        levelTitle: level.title,
        levelProgress: getLevelProgress(newTotal),
        xpToNextLevel: getXPToNextLevel(newTotal),
        todayXP: get().todayXP + amount,
        lastXPGain: amount,
      });
    } catch (error) {
      console.error('Failed to add XP:', error);
    }
  },

  awardEarSchoolCorrect: async () => {
    await get().addXP('ear-school', XP_AMOUNTS.EAR_SCHOOL_CORRECT);
  },

  awardEarSchoolSession: async () => {
    await get().addXP('ear-school', XP_AMOUNTS.EAR_SCHOOL_SESSION_COMPLETE);
  },

  awardLessonBlockCorrect: async (isFirstTry: boolean) => {
    const amount = isFirstTry
      ? XP_AMOUNTS.LESSON_BLOCK_CORRECT_FIRST
      : XP_AMOUNTS.LESSON_BLOCK_CORRECT_RETRY;
    await get().addXP('music-school', amount);
  },

  awardLessonComplete: async (lessonId: string) => {
    await get().addXP(
      'music-school',
      XP_AMOUNTS.LESSON_COMPLETE,
      JSON.stringify({ lessonId })
    );
  },

  awardNewUnlock: async (itemDescription: string) => {
    await get().addXP(
      'ear-school',
      XP_AMOUNTS.NEW_UNLOCK,
      JSON.stringify({ item: itemDescription })
    );
  },

  awardVoiceExerciseCorrect: async () => {
    await get().addXP('voice-school', XP_AMOUNTS.VOICE_EXERCISE_CORRECT);
  },

  awardVoiceSessionComplete: async () => {
    await get().addXP('voice-school', XP_AMOUNTS.VOICE_SESSION_COMPLETE);
  },

  clearLastXPGain: () => {
    set({ lastXPGain: null });
  },
}));
