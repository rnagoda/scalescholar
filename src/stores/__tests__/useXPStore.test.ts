/**
 * XP Store Tests
 *
 * Tests for XP tracking and level progression.
 */

import { useXPStore } from '../useXPStore';
import { XP_AMOUNTS } from '../../types/xp';

// Mock the xpService
jest.mock('../../services/xpService', () => ({
  awardXP: jest.fn().mockResolvedValue(undefined),
  getTotalXP: jest.fn().mockResolvedValue(0),
  getXPState: jest.fn().mockResolvedValue({
    totalXP: 0,
    currentLevel: 1,
    levelTitle: 'Beginner',
    levelProgress: 0,
    xpToNextLevel: 250,
  }),
  getTodayXP: jest.fn().mockResolvedValue(0),
  resetAllXP: jest.fn().mockResolvedValue(undefined),
}));

describe('useXPStore', () => {
  beforeEach(() => {
    // Reset store state
    useXPStore.setState({
      totalXP: 0,
      currentLevel: 1,
      levelTitle: 'Beginner',
      levelProgress: 0,
      xpToNextLevel: 250,
      todayXP: 0,
      isLoading: false,
      isInitialized: false,
      lastXPGain: null,
      levelUpInfo: null,
    });

    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct default XP state', () => {
      const state = useXPStore.getState();

      expect(state.totalXP).toBe(0);
      expect(state.currentLevel).toBe(1);
      expect(state.levelTitle).toBe('Beginner');
      expect(state.levelProgress).toBe(0);
      expect(state.todayXP).toBe(0);
    });

    it('should have correct loading state', () => {
      const state = useXPStore.getState();

      expect(state.isLoading).toBe(false);
      expect(state.isInitialized).toBe(false);
    });

    it('should have null lastXPGain and levelUpInfo', () => {
      const state = useXPStore.getState();

      expect(state.lastXPGain).toBeNull();
      expect(state.levelUpInfo).toBeNull();
    });
  });

  describe('initialize', () => {
    it('should initialize from database', async () => {
      const xpService = require('../../services/xpService');
      xpService.getXPState.mockResolvedValueOnce({
        totalXP: 500,
        currentLevel: 2,
        levelTitle: 'Beginner',
        levelProgress: 0.71,
        xpToNextLevel: 100,
      });
      xpService.getTodayXP.mockResolvedValueOnce(50);

      await useXPStore.getState().initialize();

      const state = useXPStore.getState();
      expect(state.totalXP).toBe(500);
      expect(state.currentLevel).toBe(2);
      expect(state.todayXP).toBe(50);
      expect(state.isInitialized).toBe(true);
    });

    it('should not reinitialize if already initialized', async () => {
      const xpService = require('../../services/xpService');

      useXPStore.setState({ isInitialized: true });
      await useXPStore.getState().initialize();

      expect(xpService.getXPState).not.toHaveBeenCalled();
    });

    it('should set loading state during initialization', async () => {
      const xpService = require('../../services/xpService');
      let resolvePromise: () => void;
      xpService.getXPState.mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePromise = () =>
            resolve({
              totalXP: 0,
              currentLevel: 1,
              levelTitle: 'Beginner',
              levelProgress: 0,
              xpToNextLevel: 250,
            });
        })
      );
      xpService.getTodayXP.mockResolvedValueOnce(0);

      const initPromise = useXPStore.getState().initialize();

      // Should be loading
      expect(useXPStore.getState().isLoading).toBe(true);

      resolvePromise!();
      await initPromise;

      // Should not be loading after completion
      expect(useXPStore.getState().isLoading).toBe(false);
    });
  });

  describe('addXP', () => {
    it('should add XP and update state', async () => {
      useXPStore.setState({ totalXP: 100 });

      await useXPStore.getState().addXP('ear-school', 50);

      const state = useXPStore.getState();
      expect(state.totalXP).toBe(150);
      expect(state.lastXPGain).toBe(50);
    });

    it('should update today XP', async () => {
      useXPStore.setState({ todayXP: 20 });

      await useXPStore.getState().addXP('music-school', 30);

      expect(useXPStore.getState().todayXP).toBe(50);
    });

    it('should detect level up', async () => {
      // Set state just below level 2 threshold (250)
      useXPStore.setState({
        totalXP: 240,
        currentLevel: 1,
        levelTitle: 'Beginner',
      });

      await useXPStore.getState().addXP('ear-school', 20);

      const state = useXPStore.getState();
      expect(state.currentLevel).toBe(2);
      expect(state.levelUpInfo).not.toBeNull();
      expect(state.levelUpInfo!.previousLevel).toBe(1);
      expect(state.levelUpInfo!.newLevel).toBe(2);
    });

    it('should not set levelUpInfo if no level up', async () => {
      useXPStore.setState({
        totalXP: 100,
        currentLevel: 1,
      });

      await useXPStore.getState().addXP('ear-school', 10);

      expect(useXPStore.getState().levelUpInfo).toBeNull();
    });

    it('should call database awardXP', async () => {
      const xpService = require('../../services/xpService');

      await useXPStore.getState().addXP('ear-school', 25, 'test details');

      expect(xpService.awardXP).toHaveBeenCalledWith('ear-school', 25, 'test details');
    });
  });

  describe('convenience award methods', () => {
    it('should award correct XP for ear school correct', async () => {
      await useXPStore.getState().awardEarSchoolCorrect();

      const state = useXPStore.getState();
      expect(state.totalXP).toBe(XP_AMOUNTS.EAR_SCHOOL_CORRECT);
      expect(state.lastXPGain).toBe(XP_AMOUNTS.EAR_SCHOOL_CORRECT);
    });

    it('should award correct XP for ear school session', async () => {
      await useXPStore.getState().awardEarSchoolSession();

      expect(useXPStore.getState().totalXP).toBe(XP_AMOUNTS.EAR_SCHOOL_SESSION_COMPLETE);
    });

    it('should award correct XP for lesson block first try', async () => {
      await useXPStore.getState().awardLessonBlockCorrect(true);

      expect(useXPStore.getState().totalXP).toBe(XP_AMOUNTS.LESSON_BLOCK_CORRECT_FIRST);
    });

    it('should award correct XP for lesson block retry', async () => {
      await useXPStore.getState().awardLessonBlockCorrect(false);

      expect(useXPStore.getState().totalXP).toBe(XP_AMOUNTS.LESSON_BLOCK_CORRECT_RETRY);
    });

    it('should award correct XP for lesson complete', async () => {
      await useXPStore.getState().awardLessonComplete('test-lesson-1');

      expect(useXPStore.getState().totalXP).toBe(XP_AMOUNTS.LESSON_COMPLETE);
    });

    it('should award correct XP for new unlock', async () => {
      await useXPStore.getState().awardNewUnlock('Perfect 5th');

      expect(useXPStore.getState().totalXP).toBe(XP_AMOUNTS.NEW_UNLOCK);
    });

    it('should award correct XP for voice exercise correct', async () => {
      await useXPStore.getState().awardVoiceExerciseCorrect();

      expect(useXPStore.getState().totalXP).toBe(XP_AMOUNTS.VOICE_EXERCISE_CORRECT);
    });

    it('should award correct XP for voice session complete', async () => {
      await useXPStore.getState().awardVoiceSessionComplete();

      expect(useXPStore.getState().totalXP).toBe(XP_AMOUNTS.VOICE_SESSION_COMPLETE);
    });
  });

  describe('clearLastXPGain', () => {
    it('should clear lastXPGain', () => {
      useXPStore.setState({ lastXPGain: 50 });

      useXPStore.getState().clearLastXPGain();

      expect(useXPStore.getState().lastXPGain).toBeNull();
    });
  });

  describe('clearLevelUpInfo', () => {
    it('should clear levelUpInfo', () => {
      useXPStore.setState({
        levelUpInfo: {
          previousLevel: 1,
          previousTitle: 'Beginner',
          newLevel: 2,
          newTitle: 'Beginner',
        },
      });

      useXPStore.getState().clearLevelUpInfo();

      expect(useXPStore.getState().levelUpInfo).toBeNull();
    });
  });

  describe('resetAllXP', () => {
    it('should reset all XP state', async () => {
      useXPStore.setState({
        totalXP: 1000,
        currentLevel: 5,
        levelTitle: 'Intermediate',
        todayXP: 100,
        lastXPGain: 50,
        levelUpInfo: {
          previousLevel: 4,
          previousTitle: 'Intermediate',
          newLevel: 5,
          newTitle: 'Intermediate',
        },
      });

      await useXPStore.getState().resetAllXP();

      const state = useXPStore.getState();
      expect(state.totalXP).toBe(0);
      expect(state.currentLevel).toBe(1);
      expect(state.levelTitle).toBe('Beginner');
      expect(state.todayXP).toBe(0);
      expect(state.lastXPGain).toBeNull();
      expect(state.levelUpInfo).toBeNull();
    });

    it('should call database resetAllXP', async () => {
      const xpService = require('../../services/xpService');

      await useXPStore.getState().resetAllXP();

      expect(xpService.resetAllXP).toHaveBeenCalled();
    });
  });

  describe('refreshXP', () => {
    it('should refresh XP from database', async () => {
      const xpService = require('../../services/xpService');
      xpService.getXPState.mockResolvedValueOnce({
        totalXP: 750,
        currentLevel: 3,
        levelTitle: 'Beginner',
        levelProgress: 0.3,
        xpToNextLevel: 350,
      });
      xpService.getTodayXP.mockResolvedValueOnce(75);

      await useXPStore.getState().refreshXP();

      const state = useXPStore.getState();
      expect(state.totalXP).toBe(750);
      expect(state.currentLevel).toBe(3);
      expect(state.todayXP).toBe(75);
    });
  });

  describe('XP progression scenarios', () => {
    it('should correctly track XP accumulation', async () => {
      // Simulate a practice session
      await useXPStore.getState().awardEarSchoolCorrect(); // 10
      await useXPStore.getState().awardEarSchoolCorrect(); // 10
      await useXPStore.getState().awardEarSchoolCorrect(); // 10
      await useXPStore.getState().awardEarSchoolSession(); // 25

      expect(useXPStore.getState().totalXP).toBe(55);
    });

    it('should track level progression through multiple awards', async () => {
      // Start at 200 XP
      useXPStore.setState({
        totalXP: 200,
        currentLevel: 1,
        levelTitle: 'Beginner',
      });

      // Award XP that should cause level up at 250
      await useXPStore.getState().awardLessonComplete('lesson-1'); // 50 XP, total = 250

      expect(useXPStore.getState().currentLevel).toBe(2);
      expect(useXPStore.getState().levelUpInfo).not.toBeNull();
    });
  });
});
