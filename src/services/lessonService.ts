/**
 * Lesson Service
 *
 * Database operations for Music School lesson progress tracking.
 */

import { getDatabase } from './database';
import {
  Lesson,
  LessonProgress,
  BlockAttempt,
  TrackId,
  UnlockDef,
} from '../types/lesson';
import { useXPStore } from '../stores/useXPStore';
import { XP_AMOUNTS } from '../types/xp';
import { unlockItem } from './progressService';
import { getLessonUnlocks } from '../content/unlockMappings';

/**
 * Get lesson progress by lesson ID
 */
export const getLessonProgress = async (
  lessonId: string
): Promise<LessonProgress | null> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{
    lesson_id: string;
    completed: number;
    blocks_completed: number;
    first_completed_at: string | null;
    last_accessed_at: string | null;
  }>(
    `SELECT * FROM lesson_progress WHERE lesson_id = ?`,
    lessonId
  );

  if (!result) return null;

  return {
    lessonId: result.lesson_id,
    completed: result.completed === 1,
    blocksCompleted: result.blocks_completed,
    firstCompletedAt: result.first_completed_at
      ? new Date(result.first_completed_at)
      : undefined,
    lastAccessedAt: result.last_accessed_at
      ? new Date(result.last_accessed_at)
      : undefined,
  };
};

/**
 * Get all lesson progress for a track
 */
export const getTrackProgress = async (
  trackId: TrackId
): Promise<LessonProgress[]> => {
  const db = await getDatabase();

  const results = await db.getAllAsync<{
    lesson_id: string;
    completed: number;
    blocks_completed: number;
    first_completed_at: string | null;
    last_accessed_at: string | null;
  }>(
    `SELECT * FROM lesson_progress WHERE lesson_id LIKE ?`,
    `${trackId}-%`
  );

  return results.map((row) => ({
    lessonId: row.lesson_id,
    completed: row.completed === 1,
    blocksCompleted: row.blocks_completed,
    firstCompletedAt: row.first_completed_at
      ? new Date(row.first_completed_at)
      : undefined,
    lastAccessedAt: row.last_accessed_at
      ? new Date(row.last_accessed_at)
      : undefined,
  }));
};

/**
 * Get count of completed lessons for a track
 */
export const getCompletedLessonCount = async (
  trackId: TrackId
): Promise<number> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM lesson_progress
     WHERE lesson_id LIKE ? AND completed = 1`,
    `${trackId}-%`
  );

  return result?.count ?? 0;
};

/**
 * Update lesson progress (create or update)
 */
export const updateLessonProgress = async (
  lessonId: string,
  blocksCompleted: number
): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO lesson_progress (lesson_id, blocks_completed, last_accessed_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(lesson_id) DO UPDATE SET
       blocks_completed = MAX(blocks_completed, ?),
       last_accessed_at = CURRENT_TIMESTAMP`,
    lessonId,
    blocksCompleted,
    blocksCompleted
  );
};

/**
 * Mark a lesson as complete
 */
export const markLessonComplete = async (
  lessonId: string,
  totalBlocks: number
): Promise<string[]> => {
  const db = await getDatabase();

  // Check if already completed
  const existing = await getLessonProgress(lessonId);
  const isFirstCompletion = !existing?.completed;

  await db.runAsync(
    `INSERT INTO lesson_progress (lesson_id, completed, blocks_completed, first_completed_at, last_accessed_at)
     VALUES (?, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(lesson_id) DO UPDATE SET
       completed = 1,
       blocks_completed = ?,
       first_completed_at = COALESCE(first_completed_at, CURRENT_TIMESTAMP),
       last_accessed_at = CURRENT_TIMESTAMP`,
    lessonId,
    totalBlocks,
    totalBlocks
  );

  // Process unlocks and award XP only on first completion
  const newUnlocks: string[] = [];
  if (isFirstCompletion) {
    await useXPStore.getState().awardLessonComplete(lessonId);

    // Process cross-unlocks
    const unlocks = getLessonUnlocks(lessonId);
    for (const unlock of unlocks) {
      await unlockItem(unlock.type, unlock.item);
      newUnlocks.push(`${unlock.type}:${unlock.item}`);

      // Award XP for each unlock
      await useXPStore.getState().awardNewUnlock(
        `${unlock.type}: ${unlock.item}`
      );
    }
  }

  return newUnlocks;
};

/**
 * Save a block attempt
 */
export const saveBlockAttempt = async (
  lessonId: string,
  blockId: string,
  correct: boolean
): Promise<BlockAttempt> => {
  const db = await getDatabase();

  // Check for existing attempts on this block
  const existing = await db.getFirstAsync<{ attempts: number; correct: number }>(
    `SELECT attempts, correct FROM lesson_block_attempts
     WHERE lesson_id = ? AND block_id = ?
     ORDER BY created_at DESC LIMIT 1`,
    lessonId,
    blockId
  );

  const attempts = (existing?.attempts ?? 0) + 1;
  const isFirstTry = attempts === 1;

  await db.runAsync(
    `INSERT INTO lesson_block_attempts (lesson_id, block_id, correct, attempts)
     VALUES (?, ?, ?, ?)`,
    lessonId,
    blockId,
    correct ? 1 : 0,
    attempts
  );

  // Award XP for correct answers
  if (correct) {
    await useXPStore.getState().awardLessonBlockCorrect(isFirstTry);
  }

  return {
    blockId,
    correct,
    attempts,
    firstTry: isFirstTry,
  };
};

/**
 * Get block attempts for a lesson
 */
export const getBlockAttempts = async (
  lessonId: string
): Promise<BlockAttempt[]> => {
  const db = await getDatabase();

  // Get the latest attempt for each block
  const results = await db.getAllAsync<{
    block_id: string;
    correct: number;
    attempts: number;
  }>(
    `SELECT block_id, correct, attempts FROM lesson_block_attempts
     WHERE lesson_id = ?
     AND id IN (
       SELECT MAX(id) FROM lesson_block_attempts
       WHERE lesson_id = ?
       GROUP BY block_id
     )`,
    lessonId,
    lessonId
  );

  return results.map((row) => ({
    blockId: row.block_id,
    correct: row.correct === 1,
    attempts: row.attempts,
    firstTry: row.attempts === 1,
  }));
};

/**
 * Check if a specific block was completed correctly
 */
export const isBlockCompleted = async (
  lessonId: string,
  blockId: string
): Promise<boolean> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ correct: number }>(
    `SELECT correct FROM lesson_block_attempts
     WHERE lesson_id = ? AND block_id = ? AND correct = 1
     LIMIT 1`,
    lessonId,
    blockId
  );

  return result !== null;
};

/**
 * Get total lessons completed across all tracks
 */
export const getTotalCompletedLessons = async (): Promise<number> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM lesson_progress WHERE completed = 1`
  );

  return result?.count ?? 0;
};

/**
 * Get lesson completion statistics
 */
export const getLessonStats = async (): Promise<{
  totalCompleted: number;
  totalAttempts: number;
  averageBlocksPerLesson: number;
}> => {
  const db = await getDatabase();

  const completedResult = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM lesson_progress WHERE completed = 1`
  );

  const attemptsResult = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM lesson_block_attempts`
  );

  const avgBlocksResult = await db.getFirstAsync<{ avg: number }>(
    `SELECT AVG(blocks_completed) as avg FROM lesson_progress WHERE completed = 1`
  );

  return {
    totalCompleted: completedResult?.count ?? 0,
    totalAttempts: attemptsResult?.count ?? 0,
    averageBlocksPerLesson: avgBlocksResult?.avg ?? 0,
  };
};

/**
 * Reset all lesson progress (for testing/development)
 */
export const resetAllLessonProgress = async (): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(`DELETE FROM lesson_progress`);
  await db.runAsync(`DELETE FROM lesson_block_attempts`);
};
