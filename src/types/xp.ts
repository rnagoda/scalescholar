/**
 * XP System Type Definitions
 *
 * App-wide experience point tracking for Music School, Ear School, and Voice School.
 */

/**
 * Sources that can award XP
 */
export type XPSource = 'ear-school' | 'music-school' | 'voice-school' | 'streak-bonus';

/**
 * Individual XP award event
 */
export interface XPEvent {
  id?: number;
  source: XPSource;
  amount: number;
  details?: string; // JSON string with context (lesson_id, exercise_type, etc.)
  createdAt: Date;
}

/**
 * Level definition with thresholds
 */
export interface XPLevel {
  level: number;
  minXP: number;
  maxXP: number;
  title: string;
}

/**
 * Current XP state
 */
export interface XPState {
  totalXP: number;
  currentLevel: number;
  levelTitle: string;
  levelProgress: number; // 0-1 progress to next level
  xpToNextLevel: number;
}

/**
 * XP award amounts for various actions
 */
export const XP_AMOUNTS = {
  // Ear School
  EAR_SCHOOL_CORRECT: 10,
  EAR_SCHOOL_SESSION_COMPLETE: 25,

  // Music School
  LESSON_BLOCK_CORRECT_FIRST: 15,
  LESSON_BLOCK_CORRECT_RETRY: 5,
  LESSON_COMPLETE: 50,
  LEVEL_COMPLETE_BONUS: 100,
  TRACK_COMPLETE_BONUS: 250,

  // Voice School
  VOICE_EXERCISE_CORRECT: 10,
  VOICE_SESSION_COMPLETE: 25,

  // Streaks & Bonuses
  NEW_UNLOCK: 100,
  DAILY_STREAK: 20,
} as const;

/**
 * Level thresholds and titles
 * Based on PRD: Beginner (1-3), Intermediate (4-6), Advanced (7-9), Scholar (10+)
 *
 * A typical lesson awards ~100-150 XP (50 completion + 60-90 from blocks).
 * Level progression is designed so each level takes 2-5+ lessons.
 */
export const XP_LEVELS: XPLevel[] = [
  { level: 1, minXP: 0, maxXP: 250, title: 'Beginner' },       // ~2-3 lessons
  { level: 2, minXP: 250, maxXP: 600, title: 'Beginner' },     // ~3-4 lessons
  { level: 3, minXP: 600, maxXP: 1100, title: 'Beginner' },    // ~4-5 lessons
  { level: 4, minXP: 1100, maxXP: 1800, title: 'Intermediate' }, // ~5-6 lessons
  { level: 5, minXP: 1800, maxXP: 2700, title: 'Intermediate' }, // ~6-7 lessons
  { level: 6, minXP: 2700, maxXP: 3800, title: 'Intermediate' }, // ~7-8 lessons
  { level: 7, minXP: 3800, maxXP: 5200, title: 'Advanced' },    // ~8-10 lessons
  { level: 8, minXP: 5200, maxXP: 7000, title: 'Advanced' },    // ~10-12 lessons
  { level: 9, minXP: 7000, maxXP: 9500, title: 'Advanced' },    // ~12-15 lessons
  { level: 10, minXP: 9500, maxXP: Infinity, title: 'Scholar' }, // Mastery!
];

/**
 * Get level info from total XP
 */
export function getLevelFromXP(totalXP: number): XPLevel {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i].minXP) {
      return XP_LEVELS[i];
    }
  }
  return XP_LEVELS[0];
}

/**
 * Calculate progress to next level (0-1)
 */
export function getLevelProgress(totalXP: number): number {
  const currentLevel = getLevelFromXP(totalXP);
  if (currentLevel.maxXP === Infinity) {
    return 1; // Max level reached
  }
  const xpInLevel = totalXP - currentLevel.minXP;
  const xpForLevel = currentLevel.maxXP - currentLevel.minXP;
  return Math.min(1, xpInLevel / xpForLevel);
}

/**
 * Calculate XP needed for next level
 */
export function getXPToNextLevel(totalXP: number): number {
  const currentLevel = getLevelFromXP(totalXP);
  if (currentLevel.maxXP === Infinity) {
    return 0; // Max level reached
  }
  return currentLevel.maxXP - totalXP;
}
