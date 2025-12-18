/**
 * Ear School Service
 *
 * Database operations for Ear School curriculum progress tracking.
 */

import { getDatabase } from './database';
import {
  EarSchoolLessonProgress,
  EarSchoolSectionProgress,
  EarSchoolAdaptiveState,
  EarSchoolAttempt,
  EarSchoolSessionResult,
  EAR_SCHOOL_THRESHOLDS,
  EarSchoolExerciseType,
} from '../types/ear-school';

// ============================================================================
// Lesson Progress
// ============================================================================

/**
 * Get lesson progress by lesson ID
 */
export const getLessonProgress = async (
  lessonId: string
): Promise<EarSchoolLessonProgress | null> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{
    lesson_id: string;
    attempts: number;
    best_score: number;
    passed: number;
    mastered: number;
    aced: number;
    challenge_mode: number;
    first_passed_at: string | null;
    last_attempt_at: string | null;
  }>(`SELECT * FROM ear_school_lessons WHERE lesson_id = ?`, lessonId);

  if (!result) return null;

  return {
    lessonId: result.lesson_id,
    attempts: result.attempts,
    bestScore: result.best_score,
    passed: result.passed === 1,
    mastered: result.mastered === 1,
    aced: result.aced === 1,
    challengeMode: result.challenge_mode === 1,
    firstPassedAt: result.first_passed_at,
    lastAttemptAt: result.last_attempt_at,
  };
};

/**
 * Get all lesson progress for a section
 */
export const getSectionLessonProgress = async (
  sectionId: string
): Promise<EarSchoolLessonProgress[]> => {
  const db = await getDatabase();

  // Extract section number from sectionId (e.g., "ear-school-section-1" -> "ear-school-1")
  const sectionNumber = sectionId.match(/section-(\d+)/)?.[1];
  if (!sectionNumber) return [];

  const results = await db.getAllAsync<{
    lesson_id: string;
    attempts: number;
    best_score: number;
    passed: number;
    mastered: number;
    aced: number;
    challenge_mode: number;
    first_passed_at: string | null;
    last_attempt_at: string | null;
  }>(`SELECT * FROM ear_school_lessons WHERE lesson_id LIKE ?`, `ear-school-${sectionNumber}.%`);

  return results.map((row) => ({
    lessonId: row.lesson_id,
    attempts: row.attempts,
    bestScore: row.best_score,
    passed: row.passed === 1,
    mastered: row.mastered === 1,
    aced: row.aced === 1,
    challengeMode: row.challenge_mode === 1,
    firstPassedAt: row.first_passed_at,
    lastAttemptAt: row.last_attempt_at,
  }));
};

/**
 * Get all lesson progress
 */
export const getAllLessonProgress = async (): Promise<EarSchoolLessonProgress[]> => {
  const db = await getDatabase();

  const results = await db.getAllAsync<{
    lesson_id: string;
    attempts: number;
    best_score: number;
    passed: number;
    mastered: number;
    aced: number;
    challenge_mode: number;
    first_passed_at: string | null;
    last_attempt_at: string | null;
  }>(`SELECT * FROM ear_school_lessons`);

  return results.map((row) => ({
    lessonId: row.lesson_id,
    attempts: row.attempts,
    bestScore: row.best_score,
    passed: row.passed === 1,
    mastered: row.mastered === 1,
    aced: row.aced === 1,
    challengeMode: row.challenge_mode === 1,
    firstPassedAt: row.first_passed_at,
    lastAttemptAt: row.last_attempt_at,
  }));
};

/**
 * Save lesson result after completing a session
 */
export const saveLessonResult = async (
  result: EarSchoolSessionResult
): Promise<EarSchoolLessonProgress> => {
  const db = await getDatabase();

  // Get existing progress
  const existing = await getLessonProgress(result.lessonId);
  const isFirstPass = !existing?.passed && result.passed;

  // Update or insert lesson progress
  await db.runAsync(
    `INSERT INTO ear_school_lessons (
      lesson_id, attempts, best_score, passed, mastered, aced,
      challenge_mode, first_passed_at, last_attempt_at
    )
    VALUES (?, 1, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(lesson_id) DO UPDATE SET
      attempts = attempts + 1,
      best_score = MAX(best_score, ?),
      passed = MAX(passed, ?),
      mastered = MAX(mastered, ?),
      aced = MAX(aced, ?),
      first_passed_at = COALESCE(first_passed_at, CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE NULL END),
      last_attempt_at = CURRENT_TIMESTAMP`,
    result.lessonId,
    result.score,
    result.passed ? 1 : 0,
    result.mastered ? 1 : 0,
    result.aced ? 1 : 0,
    result.challengeMode ? 1 : 0,
    result.passed ? new Date().toISOString() : null,
    // For the UPDATE clause
    result.score,
    result.passed ? 1 : 0,
    result.mastered ? 1 : 0,
    result.aced ? 1 : 0,
    result.passed ? 1 : 0
  );

  // Return updated progress
  const updated = await getLessonProgress(result.lessonId);
  return updated!;
};

/**
 * Set challenge mode for a lesson
 */
export const setLessonChallengeMode = async (
  lessonId: string,
  enabled: boolean
): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO ear_school_lessons (lesson_id, challenge_mode)
     VALUES (?, ?)
     ON CONFLICT(lesson_id) DO UPDATE SET challenge_mode = ?`,
    lessonId,
    enabled ? 1 : 0,
    enabled ? 1 : 0
  );
};

// ============================================================================
// Section Progress
// ============================================================================

/**
 * Get section progress by section ID
 */
export const getSectionProgress = async (
  sectionId: string
): Promise<EarSchoolSectionProgress | null> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{
    section_id: string;
    lessons_passed: number;
    assessment_score: number;
    challenge_mode: number;
    completed_at: string | null;
  }>(`SELECT * FROM ear_school_sections WHERE section_id = ?`, sectionId);

  if (!result) return null;

  return {
    sectionId: result.section_id,
    lessonsPassed: result.lessons_passed,
    assessmentScore: result.assessment_score,
    challengeModeActive: result.challenge_mode === 1,
    completedAt: result.completed_at,
  };
};

/**
 * Get all section progress
 */
export const getAllSectionProgress = async (): Promise<EarSchoolSectionProgress[]> => {
  const db = await getDatabase();

  const results = await db.getAllAsync<{
    section_id: string;
    lessons_passed: number;
    assessment_score: number;
    challenge_mode: number;
    completed_at: string | null;
  }>(`SELECT * FROM ear_school_sections ORDER BY section_id`);

  return results.map((row) => ({
    sectionId: row.section_id,
    lessonsPassed: row.lessons_passed,
    assessmentScore: row.assessment_score,
    challengeModeActive: row.challenge_mode === 1,
    completedAt: row.completed_at,
  }));
};

/**
 * Update section progress
 */
export const updateSectionProgress = async (
  sectionId: string,
  lessonsPassed: number,
  assessmentScore?: number
): Promise<void> => {
  const db = await getDatabase();

  const isComplete =
    assessmentScore !== undefined && assessmentScore >= EAR_SCHOOL_THRESHOLDS.ASSESSMENT_PASS;

  await db.runAsync(
    `INSERT INTO ear_school_sections (section_id, lessons_passed, assessment_score, completed_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(section_id) DO UPDATE SET
       lessons_passed = ?,
       assessment_score = COALESCE(?, assessment_score),
       completed_at = CASE WHEN ? = 1 THEN COALESCE(completed_at, CURRENT_TIMESTAMP) ELSE completed_at END`,
    sectionId,
    lessonsPassed,
    assessmentScore ?? 0,
    isComplete ? new Date().toISOString() : null,
    lessonsPassed,
    assessmentScore ?? null,
    isComplete ? 1 : 0
  );
};

/**
 * Set challenge mode for a section
 */
export const setSectionChallengeMode = async (sectionId: string, enabled: boolean): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO ear_school_sections (section_id, challenge_mode)
     VALUES (?, ?)
     ON CONFLICT(section_id) DO UPDATE SET challenge_mode = ?`,
    sectionId,
    enabled ? 1 : 0,
    enabled ? 1 : 0
  );
};

// ============================================================================
// Adaptive Difficulty
// ============================================================================

/**
 * Get adaptive difficulty state
 */
export const getAdaptiveState = async (): Promise<EarSchoolAdaptiveState> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{
    enabled: number;
    global_challenge_mode: number;
    aced_streak: number;
    last_score_below_85_at: string | null;
  }>(`SELECT * FROM ear_school_adaptive LIMIT 1`);

  if (!result) {
    // Return default state if none exists
    return {
      enabled: true,
      globalChallengeMode: false,
      acedStreak: 0,
      lastScoreBelow85At: null,
    };
  }

  return {
    enabled: result.enabled === 1,
    globalChallengeMode: result.global_challenge_mode === 1,
    acedStreak: result.aced_streak,
    lastScoreBelow85At: result.last_score_below_85_at,
  };
};

/**
 * Update adaptive difficulty state after a session
 */
export const updateAdaptiveState = async (score: number): Promise<EarSchoolAdaptiveState> => {
  const db = await getDatabase();

  const current = await getAdaptiveState();

  let newAcedStreak = current.acedStreak;
  let newGlobalChallengeMode = current.globalChallengeMode;
  let newLastScoreBelow85 = current.lastScoreBelow85At;

  if (score >= EAR_SCHOOL_THRESHOLDS.CHALLENGE_TRIGGER) {
    // Aced! Increment streak
    newAcedStreak += 1;
    // Trigger global challenge mode after 3 aces in a row
    if (newAcedStreak >= 3) {
      newGlobalChallengeMode = true;
    }
  } else if (score < EAR_SCHOOL_THRESHOLDS.CHALLENGE_RESET) {
    // Score below 85% resets challenge mode
    newAcedStreak = 0;
    newGlobalChallengeMode = false;
    newLastScoreBelow85 = new Date().toISOString();
  } else {
    // Score between 85-89% - don't change challenge mode, just reset streak
    newAcedStreak = 0;
  }

  // Ensure at least one row exists
  await db.runAsync(
    `INSERT INTO ear_school_adaptive (id, enabled, global_challenge_mode, aced_streak, last_score_below_85_at)
     VALUES (1, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       global_challenge_mode = ?,
       aced_streak = ?,
       last_score_below_85_at = ?`,
    current.enabled ? 1 : 0,
    newGlobalChallengeMode ? 1 : 0,
    newAcedStreak,
    newLastScoreBelow85,
    newGlobalChallengeMode ? 1 : 0,
    newAcedStreak,
    newLastScoreBelow85
  );

  return {
    enabled: current.enabled,
    globalChallengeMode: newGlobalChallengeMode,
    acedStreak: newAcedStreak,
    lastScoreBelow85At: newLastScoreBelow85,
  };
};

/**
 * Toggle adaptive difficulty enabled/disabled
 */
export const setAdaptiveEnabled = async (enabled: boolean): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO ear_school_adaptive (id, enabled)
     VALUES (1, ?)
     ON CONFLICT(id) DO UPDATE SET enabled = ?`,
    enabled ? 1 : 0,
    enabled ? 1 : 0
  );
};

// ============================================================================
// Question Attempts (Analytics)
// ============================================================================

/**
 * Save a question attempt
 */
export const saveAttempt = async (attempt: Omit<EarSchoolAttempt, 'createdAt'>): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO ear_school_attempts (lesson_id, question_type, key, correct, response_time_ms)
     VALUES (?, ?, ?, ?, ?)`,
    attempt.lessonId,
    attempt.questionType,
    attempt.key,
    attempt.correct ? 1 : 0,
    attempt.responseTimeMs
  );
};

/**
 * Get attempt statistics by question type
 */
export const getAttemptStatsByType = async (): Promise<
  Record<EarSchoolExerciseType, { total: number; correct: number; accuracy: number }>
> => {
  const db = await getDatabase();

  const results = await db.getAllAsync<{
    question_type: string;
    total: number;
    correct: number;
  }>(
    `SELECT question_type, COUNT(*) as total, SUM(correct) as correct
     FROM ear_school_attempts
     GROUP BY question_type`
  );

  const stats: Record<string, { total: number; correct: number; accuracy: number }> = {};

  for (const row of results) {
    stats[row.question_type] = {
      total: row.total,
      correct: row.correct,
      accuracy: row.total > 0 ? Math.round((row.correct / row.total) * 100) : 0,
    };
  }

  return stats as Record<
    EarSchoolExerciseType,
    { total: number; correct: number; accuracy: number }
  >;
};

// ============================================================================
// Overall Progress
// ============================================================================

/**
 * Get overall Ear School progress
 */
export const getOverallProgress = async (): Promise<{
  totalLessons: number;
  lessonsPassed: number;
  lessonsAced: number;
  sectionsCompleted: number;
  totalSections: number;
  completionPercentage: number;
  nextLessonId: string | null;
}> => {
  const TOTAL_LESSONS = 15; // 3 + 3 + 4 + 4 lessons (not counting assessments)
  const TOTAL_SECTIONS = 4;

  const lessons = await getAllLessonProgress();
  const sections = await getAllSectionProgress();

  const lessonsPassed = lessons.filter((l) => l.passed && !l.lessonId.includes('assessment')).length;
  const lessonsAced = lessons.filter((l) => l.aced && !l.lessonId.includes('assessment')).length;
  const sectionsCompleted = sections.filter((s) => s.completedAt !== null).length;

  // Calculate completion percentage
  const completionPercentage = Math.round((lessonsPassed / TOTAL_LESSONS) * 100);

  // Find next lesson
  const passedIds = new Set(lessons.filter((l) => l.passed).map((l) => l.lessonId));
  const allLessonIds = [
    'ear-school-1.1',
    'ear-school-1.2',
    'ear-school-1.3',
    'ear-school-1-assessment',
    'ear-school-2.1',
    'ear-school-2.2',
    'ear-school-2.3',
    'ear-school-2-assessment',
    'ear-school-3.1',
    'ear-school-3.2',
    'ear-school-3.3',
    'ear-school-3.4',
    'ear-school-3-assessment',
    'ear-school-4.1',
    'ear-school-4.2',
    'ear-school-4.3',
    'ear-school-4.4',
    'ear-school-4-assessment',
  ];

  const nextLessonId = allLessonIds.find((id) => !passedIds.has(id)) ?? null;

  return {
    totalLessons: TOTAL_LESSONS,
    lessonsPassed,
    lessonsAced,
    sectionsCompleted,
    totalSections: TOTAL_SECTIONS,
    completionPercentage,
    nextLessonId,
  };
};

// ============================================================================
// Reset
// ============================================================================

/**
 * Reset all Ear School progress
 */
export const resetAllEarSchoolProgress = async (): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(`DELETE FROM ear_school_lessons`);
  await db.runAsync(`DELETE FROM ear_school_sections`);
  await db.runAsync(`DELETE FROM ear_school_attempts`);
  await db.runAsync(`DELETE FROM ear_school_adaptive`);
};
