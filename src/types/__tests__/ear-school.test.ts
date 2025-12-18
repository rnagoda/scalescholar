/**
 * Ear School Types Tests
 */

import {
  EAR_SCHOOL_XP,
  EAR_SCHOOL_THRESHOLDS,
  CHALLENGE_MODE_CONFIG,
  KEY_POOLS,
  getSectionFromLessonId,
  getLessonNumberFromId,
  isAssessmentLesson,
  calculateXP,
  EarSchoolSessionResult,
} from '../ear-school';

describe('EAR_SCHOOL_XP constants', () => {
  it('should have all XP values defined', () => {
    expect(EAR_SCHOOL_XP.LESSON_PASSED).toBe(50);
    expect(EAR_SCHOOL_XP.LESSON_MASTERED).toBe(75);
    expect(EAR_SCHOOL_XP.LESSON_ACED).toBe(100);
    expect(EAR_SCHOOL_XP.SECTION_COMPLETED).toBe(200);
    expect(EAR_SCHOOL_XP.CHALLENGE_MULTIPLIER).toBe(1.5);
    expect(EAR_SCHOOL_XP.REPEAT_MULTIPLIER).toBe(0.25);
    expect(EAR_SCHOOL_XP.GRADUATE_ACHIEVEMENT).toBe(500);
  });

  it('should have increasing XP for better scores', () => {
    expect(EAR_SCHOOL_XP.LESSON_PASSED).toBeLessThan(EAR_SCHOOL_XP.LESSON_MASTERED);
    expect(EAR_SCHOOL_XP.LESSON_MASTERED).toBeLessThan(EAR_SCHOOL_XP.LESSON_ACED);
  });
});

describe('EAR_SCHOOL_THRESHOLDS constants', () => {
  it('should have all thresholds defined', () => {
    expect(EAR_SCHOOL_THRESHOLDS.PASS).toBe(70);
    expect(EAR_SCHOOL_THRESHOLDS.MASTERED).toBe(80);
    expect(EAR_SCHOOL_THRESHOLDS.ACED).toBe(90);
    expect(EAR_SCHOOL_THRESHOLDS.CHALLENGE_TRIGGER).toBe(90);
    expect(EAR_SCHOOL_THRESHOLDS.CHALLENGE_RESET).toBe(85);
  });

  it('should have increasing thresholds', () => {
    expect(EAR_SCHOOL_THRESHOLDS.PASS).toBeLessThan(EAR_SCHOOL_THRESHOLDS.MASTERED);
    expect(EAR_SCHOOL_THRESHOLDS.MASTERED).toBeLessThan(EAR_SCHOOL_THRESHOLDS.ACED);
  });
});

describe('CHALLENGE_MODE_CONFIG', () => {
  it('should have timer values defined', () => {
    expect(CHALLENGE_MODE_CONFIG.PITCH_TIMER_SECONDS).toBe(10);
    expect(CHALLENGE_MODE_CONFIG.RHYTHM_TIMER_SECONDS).toBe(15);
  });

  it('should have extra questions defined', () => {
    expect(CHALLENGE_MODE_CONFIG.EXTRA_QUESTIONS).toBe(5);
  });

  it('should have hints disabled in challenge mode', () => {
    expect(CHALLENGE_MODE_CONFIG.HINTS_DISABLED).toBe(true);
  });
});

describe('KEY_POOLS', () => {
  it('should have section-specific key pools', () => {
    expect(KEY_POOLS.SECTION_1).toBeDefined();
    expect(KEY_POOLS.SECTION_2).toBeDefined();
    expect(KEY_POOLS.SECTION_3_MAJOR).toBeDefined();
    expect(KEY_POOLS.SECTION_3_MINOR).toBeDefined();
    expect(KEY_POOLS.SECTION_4).toBeDefined();
  });

  it('should have all major keys pool', () => {
    expect(KEY_POOLS.ALL_MAJOR).toBeDefined();
    expect(KEY_POOLS.ALL_MAJOR.length).toBe(12); // All 12 major keys
  });

  it('should have correct number of keys per section', () => {
    expect(KEY_POOLS.SECTION_1.length).toBe(4);
    expect(KEY_POOLS.SECTION_2.length).toBe(4);
    expect(KEY_POOLS.SECTION_3_MAJOR.length).toBe(8);
    expect(KEY_POOLS.SECTION_3_MINOR.length).toBe(4);
    expect(KEY_POOLS.SECTION_4.length).toBe(6);
  });
});

describe('getSectionFromLessonId', () => {
  it('should extract section number from lesson ID', () => {
    expect(getSectionFromLessonId('ear-school-1.1')).toBe(1);
    expect(getSectionFromLessonId('ear-school-2.3')).toBe(2);
    expect(getSectionFromLessonId('ear-school-4.4')).toBe(4);
  });

  it('should handle assessment IDs', () => {
    expect(getSectionFromLessonId('ear-school-1-assessment')).toBe(1);
    expect(getSectionFromLessonId('ear-school-3-assessment')).toBe(3);
  });

  it('should return 0 for invalid IDs', () => {
    expect(getSectionFromLessonId('invalid')).toBe(0);
    expect(getSectionFromLessonId('')).toBe(0);
    expect(getSectionFromLessonId('ear-school-')).toBe(0);
  });
});

describe('getLessonNumberFromId', () => {
  it('should extract lesson number from lesson ID', () => {
    expect(getLessonNumberFromId('ear-school-1.1')).toBe(1);
    expect(getLessonNumberFromId('ear-school-1.3')).toBe(3);
    expect(getLessonNumberFromId('ear-school-4.4')).toBe(4);
  });

  it('should return 0 for assessments', () => {
    expect(getLessonNumberFromId('ear-school-1-assessment')).toBe(0);
    expect(getLessonNumberFromId('ear-school-2-assessment')).toBe(0);
  });

  it('should return 0 for invalid IDs', () => {
    expect(getLessonNumberFromId('invalid')).toBe(0);
    expect(getLessonNumberFromId('')).toBe(0);
  });
});

describe('isAssessmentLesson', () => {
  it('should return true for assessment IDs', () => {
    expect(isAssessmentLesson('ear-school-1-assessment')).toBe(true);
    expect(isAssessmentLesson('ear-school-4-assessment')).toBe(true);
  });

  it('should return false for regular lesson IDs', () => {
    expect(isAssessmentLesson('ear-school-1.1')).toBe(false);
    expect(isAssessmentLesson('ear-school-3.2')).toBe(false);
  });

  it('should return false for invalid IDs', () => {
    expect(isAssessmentLesson('invalid')).toBe(false);
    expect(isAssessmentLesson('')).toBe(false);
  });
});

describe('calculateXP', () => {
  const createResult = (
    overrides: Partial<EarSchoolSessionResult> = {}
  ): EarSchoolSessionResult => ({
    lessonId: 'ear-school-1.1',
    score: 70,
    passed: true,
    mastered: false,
    aced: false,
    totalQuestions: 10,
    correctAnswers: 7,
    challengeMode: false,
    isFirstPass: true,
    xpAwarded: 0,
    ...overrides,
  });

  it('should return 0 for failing scores', () => {
    const result = createResult({ score: 65, passed: false });
    expect(calculateXP(result)).toBe(0);
  });

  it('should return passed XP for passing scores', () => {
    const result = createResult({ score: 70, passed: true });
    expect(calculateXP(result)).toBe(EAR_SCHOOL_XP.LESSON_PASSED);
  });

  it('should return mastered XP for 80%+ scores', () => {
    const result = createResult({ score: 85, passed: true, mastered: true });
    expect(calculateXP(result)).toBe(EAR_SCHOOL_XP.LESSON_MASTERED);
  });

  it('should return aced XP for 90%+ scores', () => {
    const result = createResult({ score: 95, passed: true, mastered: true, aced: true });
    expect(calculateXP(result)).toBe(EAR_SCHOOL_XP.LESSON_ACED);
  });

  it('should apply challenge multiplier', () => {
    const result = createResult({
      score: 95,
      passed: true,
      mastered: true,
      aced: true,
      challengeMode: true,
    });
    expect(calculateXP(result)).toBe(
      Math.floor(EAR_SCHOOL_XP.LESSON_ACED * EAR_SCHOOL_XP.CHALLENGE_MULTIPLIER)
    );
  });

  it('should apply repeat multiplier for subsequent passes', () => {
    const result = createResult({
      score: 70,
      passed: true,
      isFirstPass: false,
    });
    expect(calculateXP(result)).toBe(
      Math.floor(EAR_SCHOOL_XP.LESSON_PASSED * EAR_SCHOOL_XP.REPEAT_MULTIPLIER)
    );
  });

  it('should combine challenge and repeat multipliers', () => {
    const result = createResult({
      score: 95,
      passed: true,
      mastered: true,
      aced: true,
      challengeMode: true,
      isFirstPass: false,
    });
    const expectedXP = Math.floor(
      Math.floor(EAR_SCHOOL_XP.LESSON_ACED * EAR_SCHOOL_XP.CHALLENGE_MULTIPLIER) *
        EAR_SCHOOL_XP.REPEAT_MULTIPLIER
    );
    expect(calculateXP(result)).toBe(expectedXP);
  });
});
