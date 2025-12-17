/**
 * XP System Tests
 *
 * Tests for XP level calculation and progression functions.
 */

import {
  XP_LEVELS,
  XP_AMOUNTS,
  getLevelFromXP,
  getLevelProgress,
  getXPToNextLevel,
} from '../xp';

describe('XP System', () => {
  // ==========================================
  // LEVEL FROM XP TESTS
  // ==========================================

  describe('getLevelFromXP', () => {
    it('should return level 1 for 0 XP', () => {
      const level = getLevelFromXP(0);
      expect(level.level).toBe(1);
      expect(level.title).toBe('Beginner');
    });

    it('should return level 1 for XP below threshold', () => {
      const level = getLevelFromXP(100);
      expect(level.level).toBe(1);
      expect(level.minXP).toBe(0);
      expect(level.maxXP).toBe(250);
    });

    it('should return level 2 at 250 XP', () => {
      const level = getLevelFromXP(250);
      expect(level.level).toBe(2);
      expect(level.title).toBe('Beginner');
    });

    it('should return level 3 at 600 XP', () => {
      const level = getLevelFromXP(600);
      expect(level.level).toBe(3);
      expect(level.title).toBe('Beginner');
    });

    it('should return level 4 (Intermediate) at 1100 XP', () => {
      const level = getLevelFromXP(1100);
      expect(level.level).toBe(4);
      expect(level.title).toBe('Intermediate');
    });

    it('should return level 7 (Advanced) at 3800 XP', () => {
      const level = getLevelFromXP(3800);
      expect(level.level).toBe(7);
      expect(level.title).toBe('Advanced');
    });

    it('should return level 10 (Scholar) at 9500 XP', () => {
      const level = getLevelFromXP(9500);
      expect(level.level).toBe(10);
      expect(level.title).toBe('Scholar');
      expect(level.maxXP).toBe(Infinity);
    });

    it('should return level 10 for very high XP', () => {
      const level = getLevelFromXP(100000);
      expect(level.level).toBe(10);
      expect(level.title).toBe('Scholar');
    });

    it('should return level 1 for negative XP', () => {
      const level = getLevelFromXP(-100);
      expect(level.level).toBe(1);
    });

    it('should handle edge cases at level boundaries', () => {
      // Just below level 2
      expect(getLevelFromXP(249).level).toBe(1);
      // Exactly at level 2
      expect(getLevelFromXP(250).level).toBe(2);
      // Just above level 2 threshold
      expect(getLevelFromXP(251).level).toBe(2);
    });
  });

  // ==========================================
  // LEVEL PROGRESS TESTS
  // ==========================================

  describe('getLevelProgress', () => {
    it('should return 0 at the start of level 1', () => {
      const progress = getLevelProgress(0);
      expect(progress).toBe(0);
    });

    it('should return 0.5 halfway through level 1', () => {
      // Level 1: 0-250 (250 XP range)
      const progress = getLevelProgress(125);
      expect(progress).toBeCloseTo(0.5, 2);
    });

    it('should return approximately 1 at the end of level 1', () => {
      // Just before level 2
      const progress = getLevelProgress(249);
      expect(progress).toBeCloseTo(0.996, 2);
    });

    it('should return 0 at the start of level 2', () => {
      const progress = getLevelProgress(250);
      expect(progress).toBe(0);
    });

    it('should calculate progress correctly for level 2', () => {
      // Level 2: 250-600 (350 XP range)
      // At 425 XP: (425-250) / (600-250) = 175/350 = 0.5
      const progress = getLevelProgress(425);
      expect(progress).toBeCloseTo(0.5, 2);
    });

    it('should return 1 for max level (Scholar)', () => {
      const progress = getLevelProgress(9500);
      expect(progress).toBe(1);
    });

    it('should return 1 for XP beyond max level', () => {
      const progress = getLevelProgress(100000);
      expect(progress).toBe(1);
    });

    it('should cap progress at 1', () => {
      // This shouldn't happen in practice, but test the boundary
      const progress = getLevelProgress(249);
      expect(progress).toBeLessThanOrEqual(1);
    });
  });

  // ==========================================
  // XP TO NEXT LEVEL TESTS
  // ==========================================

  describe('getXPToNextLevel', () => {
    it('should return 250 for 0 XP (need to reach level 2)', () => {
      const xpNeeded = getXPToNextLevel(0);
      expect(xpNeeded).toBe(250);
    });

    it('should return remaining XP to next level', () => {
      // At 100 XP, need 150 more to reach 250 (level 2)
      const xpNeeded = getXPToNextLevel(100);
      expect(xpNeeded).toBe(150);
    });

    it('should return correct XP needed from start of level 2', () => {
      // At 250 XP (level 2), need 350 to reach 600 (level 3)
      const xpNeeded = getXPToNextLevel(250);
      expect(xpNeeded).toBe(350);
    });

    it('should return 0 for max level', () => {
      const xpNeeded = getXPToNextLevel(9500);
      expect(xpNeeded).toBe(0);
    });

    it('should return 0 for XP beyond max level', () => {
      const xpNeeded = getXPToNextLevel(100000);
      expect(xpNeeded).toBe(0);
    });

    it('should return 1 when 1 XP away from next level', () => {
      const xpNeeded = getXPToNextLevel(249);
      expect(xpNeeded).toBe(1);
    });
  });

  // ==========================================
  // XP AMOUNTS CONSTANTS TESTS
  // ==========================================

  describe('XP_AMOUNTS constants', () => {
    it('should have correct Ear School XP values', () => {
      expect(XP_AMOUNTS.EAR_SCHOOL_CORRECT).toBe(10);
      expect(XP_AMOUNTS.EAR_SCHOOL_SESSION_COMPLETE).toBe(25);
    });

    it('should have correct Music School XP values', () => {
      expect(XP_AMOUNTS.LESSON_BLOCK_CORRECT_FIRST).toBe(15);
      expect(XP_AMOUNTS.LESSON_BLOCK_CORRECT_RETRY).toBe(5);
      expect(XP_AMOUNTS.LESSON_COMPLETE).toBe(50);
      expect(XP_AMOUNTS.LEVEL_COMPLETE_BONUS).toBe(100);
      expect(XP_AMOUNTS.TRACK_COMPLETE_BONUS).toBe(250);
    });

    it('should have correct Voice School XP values', () => {
      expect(XP_AMOUNTS.VOICE_EXERCISE_CORRECT).toBe(10);
      expect(XP_AMOUNTS.VOICE_SESSION_COMPLETE).toBe(25);
    });

    it('should have correct bonus XP values', () => {
      expect(XP_AMOUNTS.NEW_UNLOCK).toBe(100);
      expect(XP_AMOUNTS.DAILY_STREAK).toBe(20);
    });
  });

  // ==========================================
  // XP LEVELS STRUCTURE TESTS
  // ==========================================

  describe('XP_LEVELS structure', () => {
    it('should have 10 levels', () => {
      expect(XP_LEVELS).toHaveLength(10);
    });

    it('should have consecutive level numbers', () => {
      for (let i = 0; i < XP_LEVELS.length; i++) {
        expect(XP_LEVELS[i].level).toBe(i + 1);
      }
    });

    it('should have non-overlapping XP ranges', () => {
      for (let i = 1; i < XP_LEVELS.length; i++) {
        expect(XP_LEVELS[i].minXP).toBe(XP_LEVELS[i - 1].maxXP);
      }
    });

    it('should have increasing XP thresholds', () => {
      for (let i = 1; i < XP_LEVELS.length; i++) {
        expect(XP_LEVELS[i].minXP).toBeGreaterThan(XP_LEVELS[i - 1].minXP);
      }
    });

    it('should start at 0 XP for level 1', () => {
      expect(XP_LEVELS[0].minXP).toBe(0);
    });

    it('should have Infinity maxXP for final level', () => {
      expect(XP_LEVELS[XP_LEVELS.length - 1].maxXP).toBe(Infinity);
    });

    it('should have Beginner title for levels 1-3', () => {
      expect(XP_LEVELS[0].title).toBe('Beginner');
      expect(XP_LEVELS[1].title).toBe('Beginner');
      expect(XP_LEVELS[2].title).toBe('Beginner');
    });

    it('should have Intermediate title for levels 4-6', () => {
      expect(XP_LEVELS[3].title).toBe('Intermediate');
      expect(XP_LEVELS[4].title).toBe('Intermediate');
      expect(XP_LEVELS[5].title).toBe('Intermediate');
    });

    it('should have Advanced title for levels 7-9', () => {
      expect(XP_LEVELS[6].title).toBe('Advanced');
      expect(XP_LEVELS[7].title).toBe('Advanced');
      expect(XP_LEVELS[8].title).toBe('Advanced');
    });

    it('should have Scholar title for level 10', () => {
      expect(XP_LEVELS[9].title).toBe('Scholar');
    });
  });

  // ==========================================
  // INTEGRATION SCENARIOS
  // ==========================================

  describe('Integration scenarios', () => {
    it('should track progress through multiple lesson completions', () => {
      // Simulate completing lessons and earning XP
      let totalXP = 0;

      // Complete first lesson (~120 XP)
      totalXP += XP_AMOUNTS.LESSON_COMPLETE; // 50
      totalXP += XP_AMOUNTS.LESSON_BLOCK_CORRECT_FIRST * 4; // 60
      totalXP += XP_AMOUNTS.EAR_SCHOOL_CORRECT; // 10

      expect(getLevelFromXP(totalXP).level).toBe(1);
      expect(getXPToNextLevel(totalXP)).toBe(250 - totalXP);

      // Complete second lesson
      totalXP += XP_AMOUNTS.LESSON_COMPLETE;
      totalXP += XP_AMOUNTS.LESSON_BLOCK_CORRECT_FIRST * 4;

      expect(getLevelFromXP(totalXP).level).toBe(1);

      // Complete third lesson - should reach level 2
      totalXP += XP_AMOUNTS.LESSON_COMPLETE;
      totalXP += XP_AMOUNTS.LESSON_BLOCK_CORRECT_FIRST * 4;

      expect(totalXP).toBeGreaterThanOrEqual(250);
      expect(getLevelFromXP(totalXP).level).toBe(2);
    });

    it('should correctly calculate remaining XP after leveling up', () => {
      // Start at level 1 with 200 XP
      let totalXP = 200;
      expect(getLevelFromXP(totalXP).level).toBe(1);
      expect(getXPToNextLevel(totalXP)).toBe(50);

      // Gain 100 XP (now 300, should be level 2)
      totalXP += 100;
      expect(getLevelFromXP(totalXP).level).toBe(2);
      expect(getXPToNextLevel(totalXP)).toBe(600 - 300); // 300
    });
  });
});
