import { getDatabase } from './database';
import { queryCache, CACHE_KEYS } from './queryCache';

export type ExerciseType = 'intervals' | 'scale-degrees' | 'chords';

export interface AttemptRecord {
  id: number;
  exerciseType: ExerciseType;
  questionType: string;
  correct: boolean;
  responseTimeMs?: number;
  createdAt: string;
}

export interface SessionRecord {
  id: number;
  exerciseType: ExerciseType;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
}

export interface ExerciseStats {
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  recentAccuracy: number; // Last 20 attempts
  streak: number;
}

export interface ItemStats {
  itemId: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
}

/**
 * Save an individual attempt
 */
export const saveAttempt = async (
  exerciseType: ExerciseType,
  questionType: string,
  correct: boolean,
  responseTimeMs?: number
): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO exercise_attempts (exercise_type, question_type, correct, response_time_ms)
     VALUES (?, ?, ?, ?)`,
    exerciseType,
    questionType,
    correct ? 1 : 0,
    responseTimeMs ?? null
  );

  // Invalidate exercise stats cache for this exercise type
  queryCache.invalidate(CACHE_KEYS.EXERCISE_STATS, [exerciseType]);
};

/**
 * Save a completed session
 */
export const saveSession = async (
  exerciseType: ExerciseType,
  totalQuestions: number,
  correctAnswers: number
): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO sessions (exercise_type, total_questions, correct_answers)
     VALUES (?, ?, ?)`,
    exerciseType,
    totalQuestions,
    correctAnswers
  );
};

/**
 * Get overall stats for an exercise type
 * Consolidated into a single query for better performance
 * Results are cached for 30 seconds
 */
export const getExerciseStats = async (
  exerciseType: ExerciseType
): Promise<ExerciseStats> => {
  return queryCache.getOrFetch(
    CACHE_KEYS.EXERCISE_STATS,
    async () => {
      const db = await getDatabase();

      // Single query with CTEs for all stats
      const result = await db.getFirstAsync<{
        total_attempts: number;
        correct_attempts: number;
        recent_total: number;
        recent_correct: number;
      }>(
        `WITH
          all_stats AS (
            SELECT
              COUNT(*) as total_attempts,
              COALESCE(SUM(correct), 0) as correct_attempts
            FROM exercise_attempts
            WHERE exercise_type = ?
          ),
          recent_stats AS (
            SELECT
              COUNT(*) as recent_total,
              COALESCE(SUM(correct), 0) as recent_correct
            FROM (
              SELECT correct FROM exercise_attempts
              WHERE exercise_type = ?
              ORDER BY created_at DESC
              LIMIT 20
            )
          )
        SELECT
          all_stats.total_attempts,
          all_stats.correct_attempts,
          recent_stats.recent_total,
          recent_stats.recent_correct
        FROM all_stats, recent_stats`,
        exerciseType,
        exerciseType
      );

      const totalAttempts = result?.total_attempts ?? 0;
      const correctAttempts = result?.correct_attempts ?? 0;
      const recentTotal = result?.recent_total ?? 0;
      const recentCorrect = result?.recent_correct ?? 0;

      // Calculate current streak (still separate - streak requires ordered iteration)
      const streak = await calculateStreak(exerciseType);

      return {
        totalAttempts,
        correctAttempts,
        accuracy: totalAttempts > 0 ? correctAttempts / totalAttempts : 0,
        recentAccuracy: recentTotal > 0 ? recentCorrect / recentTotal : 0,
        streak,
      };
    },
    [exerciseType]
  );
};

/**
 * Get stats for a specific item (interval, scale degree, chord)
 */
export const getItemStats = async (
  exerciseType: ExerciseType,
  questionType: string
): Promise<ItemStats> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{
    total: number;
    correct: number;
  }>(
    `SELECT COUNT(*) as total, SUM(correct) as correct
     FROM exercise_attempts
     WHERE exercise_type = ? AND question_type = ?`,
    exerciseType,
    questionType
  );

  const totalAttempts = result?.total ?? 0;
  const correctAttempts = result?.correct ?? 0;

  return {
    itemId: questionType,
    totalAttempts,
    correctAttempts,
    accuracy: totalAttempts > 0 ? correctAttempts / totalAttempts : 0,
  };
};

/**
 * Get stats for all items of an exercise type
 */
export const getAllItemStats = async (
  exerciseType: ExerciseType
): Promise<ItemStats[]> => {
  const db = await getDatabase();

  const results = await db.getAllAsync<{
    question_type: string;
    total: number;
    correct: number;
  }>(
    `SELECT question_type, COUNT(*) as total, SUM(correct) as correct
     FROM exercise_attempts
     WHERE exercise_type = ?
     GROUP BY question_type`,
    exerciseType
  );

  return results.map((row) => ({
    itemId: row.question_type,
    totalAttempts: row.total,
    correctAttempts: row.correct,
    accuracy: row.total > 0 ? row.correct / row.total : 0,
  }));
};

/**
 * Calculate current streak of correct answers
 */
const calculateStreak = async (exerciseType: ExerciseType): Promise<number> => {
  const db = await getDatabase();

  const attempts = await db.getAllAsync<{ correct: number }>(
    `SELECT correct FROM exercise_attempts
     WHERE exercise_type = ?
     ORDER BY created_at DESC
     LIMIT 100`,
    exerciseType
  );

  let streak = 0;
  for (const attempt of attempts) {
    if (attempt.correct) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Check if an item is unlocked
 */
export const isUnlocked = async (
  exerciseType: ExerciseType,
  itemId: string
): Promise<boolean> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM unlocks
     WHERE exercise_type = ? AND item_id = ?`,
    exerciseType,
    itemId
  );

  return (result?.count ?? 0) > 0;
};

/**
 * Get all unlocked items for an exercise type
 */
export const getUnlockedItems = async (
  exerciseType: ExerciseType
): Promise<string[]> => {
  const db = await getDatabase();

  const results = await db.getAllAsync<{ item_id: string }>(
    `SELECT item_id FROM unlocks WHERE exercise_type = ?`,
    exerciseType
  );

  return results.map((row) => row.item_id);
};

/**
 * Unlock an item
 */
export const unlockItem = async (
  exerciseType: ExerciseType,
  itemId: string
): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT OR IGNORE INTO unlocks (exercise_type, item_id)
     VALUES (?, ?)`,
    exerciseType,
    itemId
  );
};

/**
 * Check unlock eligibility and unlock if criteria met
 * Criteria: 80% accuracy with 20+ attempts on currently unlocked items
 * Optimized: batch operations instead of per-item queries
 */
export const checkAndProcessUnlocks = async (
  exerciseType: ExerciseType,
  allItems: string[],
  starterItems: string[]
): Promise<string[]> => {
  const db = await getDatabase();
  const newUnlocks: string[] = [];

  // Batch insert starter items (INSERT OR IGNORE handles duplicates)
  if (starterItems.length > 0) {
    const placeholders = starterItems.map(() => '(?, ?)').join(', ');
    const values = starterItems.flatMap((item) => [exerciseType, item]);
    await db.runAsync(
      `INSERT OR IGNORE INTO unlocks (exercise_type, item_id) VALUES ${placeholders}`,
      ...values
    );
  }

  // Get currently unlocked items
  const unlockedItems = await getUnlockedItems(exerciseType);

  // Get stats for unlocked items only
  if (unlockedItems.length === 0) {
    return newUnlocks;
  }

  const statsResult = await db.getFirstAsync<{
    total: number;
    correct: number;
  }>(
    `SELECT COUNT(*) as total, SUM(correct) as correct
     FROM exercise_attempts
     WHERE exercise_type = ?
     AND question_type IN (${unlockedItems.map(() => '?').join(',')})`,
    exerciseType,
    ...unlockedItems
  );

  const totalAttempts = statsResult?.total ?? 0;
  const correctAttempts = statsResult?.correct ?? 0;
  const accuracy = totalAttempts > 0 ? correctAttempts / totalAttempts : 0;

  // Check if we can unlock the next item
  // Criteria: 20+ attempts and 80%+ accuracy
  if (totalAttempts >= 20 && accuracy >= 0.8) {
    // Find next item to unlock
    for (const item of allItems) {
      if (!unlockedItems.includes(item)) {
        await unlockItem(exerciseType, item);
        newUnlocks.push(item);
        break; // Only unlock one at a time
      }
    }
  }

  return newUnlocks;
};

/**
 * Reset all Ear School progress
 * Deletes all attempts, sessions, and unlocks for intervals, scale-degrees, and chords
 */
export const resetAllEarSchoolProgress = async (): Promise<void> => {
  const db = await getDatabase();
  const exerciseTypes = ['intervals', 'scale-degrees', 'chords'];

  // Delete all attempts for Ear School exercises
  await db.runAsync(
    `DELETE FROM exercise_attempts WHERE exercise_type IN (?, ?, ?)`,
    ...exerciseTypes
  );

  // Delete all sessions for Ear School exercises
  await db.runAsync(
    `DELETE FROM sessions WHERE exercise_type IN (?, ?, ?)`,
    ...exerciseTypes
  );

  // Delete all unlocks for Ear School exercises
  await db.runAsync(
    `DELETE FROM unlocks WHERE exercise_type IN (?, ?, ?)`,
    ...exerciseTypes
  );

  // Invalidate all caches for these exercise types
  for (const exerciseType of exerciseTypes) {
    queryCache.invalidate(CACHE_KEYS.EXERCISE_STATS, [exerciseType]);
  }
};

/**
 * Get recent sessions
 */
export const getRecentSessions = async (
  exerciseType: ExerciseType,
  limit: number = 10
): Promise<SessionRecord[]> => {
  const db = await getDatabase();

  const results = await db.getAllAsync<{
    id: number;
    exercise_type: string;
    total_questions: number;
    correct_answers: number;
    completed_at: string;
  }>(
    `SELECT * FROM sessions
     WHERE exercise_type = ?
     ORDER BY completed_at DESC
     LIMIT ?`,
    exerciseType,
    limit
  );

  return results.map((row) => ({
    id: row.id,
    exerciseType: row.exercise_type as ExerciseType,
    totalQuestions: row.total_questions,
    correctAnswers: row.correct_answers,
    completedAt: row.completed_at,
  }));
};
