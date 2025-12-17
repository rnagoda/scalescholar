/**
 * Voice Profile Service
 *
 * Database operations for voice range profiles and voice training progress.
 */

import { getDatabase } from './database';
import {
  VoiceRangeProfile,
  VoiceExerciseType,
  VoiceExerciseResult,
  VoiceTrainingSession,
  VoiceTrainingStats,
} from '../types/voiceAnalyzer';

/**
 * Save a voice range profile
 * Replaces any existing profile (only one profile per user)
 */
export const saveVoiceProfile = async (
  profile: VoiceRangeProfile
): Promise<void> => {
  const db = await getDatabase();

  // Delete existing profile first (only one profile)
  await db.runAsync('DELETE FROM voice_profile');

  // Insert new profile
  await db.runAsync(
    `INSERT INTO voice_profile
     (lowest_note, highest_note, comfortable_low, comfortable_high, softest_db, loudest_db, assessed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    profile.lowestNote,
    profile.highestNote,
    profile.comfortableLow,
    profile.comfortableHigh,
    profile.dynamicRange.softest,
    profile.dynamicRange.loudest,
    profile.assessedAt.toISOString()
  );
};

/**
 * Load the user's voice profile
 * Returns null if no profile exists
 */
export const loadVoiceProfile = async (): Promise<VoiceRangeProfile | null> => {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{
    lowest_note: number;
    highest_note: number;
    comfortable_low: number;
    comfortable_high: number;
    softest_db: number | null;
    loudest_db: number | null;
    assessed_at: string;
  }>('SELECT * FROM voice_profile ORDER BY id DESC LIMIT 1');

  if (!row) return null;

  return {
    lowestNote: row.lowest_note,
    highestNote: row.highest_note,
    comfortableLow: row.comfortable_low,
    comfortableHigh: row.comfortable_high,
    dynamicRange: {
      softest: row.softest_db ?? -50,
      loudest: row.loudest_db ?? -10,
    },
    assessedAt: new Date(row.assessed_at),
  };
};

/**
 * Check if user has a voice profile
 */
export const hasVoiceProfile = async (): Promise<boolean> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM voice_profile'
  );
  return (result?.count ?? 0) > 0;
};

/**
 * Delete the voice profile
 */
export const deleteVoiceProfile = async (): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM voice_profile');
};

/**
 * Save a voice exercise attempt
 */
export const saveVoiceAttempt = async (
  result: VoiceExerciseResult
): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO voice_exercise_attempts
     (exercise_type, target_note, achieved_accuracy, time_on_target, volume_consistency)
     VALUES (?, ?, ?, ?, ?)`,
    result.question.type,
    result.question.targetNote,
    result.accuracy,
    result.timeOnTarget,
    result.volumeConsistency
  );
};

/**
 * Save a voice training session
 */
export const saveVoiceSession = async (
  session: VoiceTrainingSession
): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO voice_training_sessions
     (exercise_type, questions_count, correct_count, average_accuracy, duration_seconds)
     VALUES (?, ?, ?, ?, ?)`,
    session.exerciseType,
    session.questionsCount,
    session.correctCount,
    session.averageAccuracy,
    session.durationSeconds
  );
};

/**
 * Get voice training stats for a specific exercise type
 */
export const getVoiceExerciseStats = async (
  exerciseType: VoiceExerciseType
): Promise<{
  attempts: number;
  accuracy: number;
  recentAccuracy: number;
}> => {
  const db = await getDatabase();

  // Total stats
  const totalResult = await db.getFirstAsync<{
    count: number;
    avg_accuracy: number | null;
  }>(
    `SELECT COUNT(*) as count, AVG(achieved_accuracy) as avg_accuracy
     FROM voice_exercise_attempts
     WHERE exercise_type = ?`,
    exerciseType
  );

  // Recent stats (last 20)
  const recentResult = await db.getFirstAsync<{
    avg_accuracy: number | null;
  }>(
    `SELECT AVG(achieved_accuracy) as avg_accuracy
     FROM (
       SELECT achieved_accuracy FROM voice_exercise_attempts
       WHERE exercise_type = ?
       ORDER BY created_at DESC
       LIMIT 20
     )`,
    exerciseType
  );

  return {
    attempts: totalResult?.count ?? 0,
    accuracy: totalResult?.avg_accuracy ?? 0,
    recentAccuracy: recentResult?.avg_accuracy ?? 0,
  };
};

/**
 * Get overall voice training stats
 */
export const getVoiceTrainingStats = async (): Promise<VoiceTrainingStats> => {
  const db = await getDatabase();

  // Overall stats
  const overallResult = await db.getFirstAsync<{
    count: number;
    avg_accuracy: number | null;
  }>(
    `SELECT COUNT(*) as count, AVG(achieved_accuracy) as avg_accuracy
     FROM voice_exercise_attempts`
  );

  // Get stats by exercise type
  const exerciseTypes: VoiceExerciseType[] = ['note_match', 'scale', 'glide', 'sustain'];
  const byExerciseType: VoiceTrainingStats['byExerciseType'] = {};

  for (const type of exerciseTypes) {
    const stats = await getVoiceExerciseStats(type);
    if (stats.attempts > 0) {
      byExerciseType[type] = stats;
    }
  }

  // Calculate streak (consecutive successful sessions)
  const sessions = await db.getAllAsync<{ correct_count: number; questions_count: number }>(
    `SELECT correct_count, questions_count FROM voice_training_sessions
     ORDER BY created_at DESC
     LIMIT 20`
  );

  let streak = 0;
  for (const session of sessions) {
    const successRate = session.correct_count / session.questions_count;
    if (successRate >= 0.7) {
      streak++;
    } else {
      break;
    }
  }

  return {
    totalAttempts: overallResult?.count ?? 0,
    averageAccuracy: overallResult?.avg_accuracy ?? 0,
    currentStreak: streak,
    byExerciseType,
  };
};

/**
 * Reset all Voice School progress
 * Deletes voice profile, all attempts, and all sessions
 */
export const resetAllVoiceSchoolProgress = async (): Promise<void> => {
  const db = await getDatabase();

  // Delete voice profile
  await db.runAsync('DELETE FROM voice_profile');

  // Delete all voice exercise attempts
  await db.runAsync('DELETE FROM voice_exercise_attempts');

  // Delete all voice training sessions
  await db.runAsync('DELETE FROM voice_training_sessions');
};

/**
 * Get recent voice training sessions
 */
export const getRecentVoiceSessions = async (
  limit: number = 10
): Promise<VoiceTrainingSession[]> => {
  const db = await getDatabase();

  const results = await db.getAllAsync<{
    exercise_type: string;
    questions_count: number;
    correct_count: number;
    average_accuracy: number;
    duration_seconds: number;
    created_at: string;
  }>(
    `SELECT * FROM voice_training_sessions
     ORDER BY created_at DESC
     LIMIT ?`,
    limit
  );

  return results.map((row) => ({
    exerciseType: row.exercise_type as VoiceExerciseType,
    questionsCount: row.questions_count,
    correctCount: row.correct_count,
    averageAccuracy: row.average_accuracy,
    durationSeconds: row.duration_seconds,
    completedAt: new Date(row.created_at),
  }));
};
