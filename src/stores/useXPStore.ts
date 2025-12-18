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
  resetAllXP as resetAllXPInDb,
} from '../services/xpService';

// Level-up info for celebration
interface LevelUpInfo {
  previousLevel: number;
  previousTitle: string;
  newLevel: number;
  newTitle: string;
}

interface XPStoreState extends XPState {
  // Today's XP for daily tracking
  todayXP: number;

  // Loading state
  isLoading: boolean;
  isInitialized: boolean;

  // Last XP gain for animation/display
  lastXPGain: number | null;

  // Level-up info for celebration modal
  levelUpInfo: LevelUpInfo | null;

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
  awardEarSchoolLesson: (
    lessonId: string,
    amount: number,
    passed: boolean,
    mastered: boolean,
    aced: boolean
  ) => Promise<void>;

  // Clear last XP gain (after animation)
  clearLastXPGain: () => void;

  // Clear level-up info (after celebration shown)
  clearLevelUpInfo: () => void;

  // Reset all XP (for testing)
  resetAllXP: () => Promise<void>;
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
  levelUpInfo: null,

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

      // Get current state before update
      const previousLevel = get().currentLevel;
      const previousTitle = get().levelTitle;
      const currentTotal = get().totalXP;

      // Calculate new state
      const newTotal = currentTotal + amount;
      const level = getLevelFromXP(newTotal);

      // Check if level-up occurred
      const didLevelUp = level.level > previousLevel;

      set({
        totalXP: newTotal,
        currentLevel: level.level,
        levelTitle: level.title,
        levelProgress: getLevelProgress(newTotal),
        xpToNextLevel: getXPToNextLevel(newTotal),
        todayXP: get().todayXP + amount,
        lastXPGain: amount,
        // Set level-up info if level increased
        levelUpInfo: didLevelUp
          ? {
              previousLevel,
              previousTitle,
              newLevel: level.level,
              newTitle: level.title,
            }
          : get().levelUpInfo, // Keep existing if no level-up
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

  awardEarSchoolLesson: async (
    lessonId: string,
    amount: number,
    passed: boolean,
    mastered: boolean,
    aced: boolean
  ) => {
    const status = aced ? 'aced' : mastered ? 'mastered' : passed ? 'passed' : 'incomplete';
    await get().addXP(
      'ear-school',
      amount,
      JSON.stringify({ lessonId, status })
    );
  },

  clearLastXPGain: () => {
    set({ lastXPGain: null });
  },

  clearLevelUpInfo: () => {
    set({ levelUpInfo: null });
  },

  resetAllXP: async () => {
    try {
      await resetAllXPInDb();
      // Reset to default state
      set({
        ...DEFAULT_XP_STATE,
        todayXP: 0,
        lastXPGain: null,
        levelUpInfo: null,
      });
    } catch (error) {
      console.error('Failed to reset XP:', error);
    }
  },
}));
