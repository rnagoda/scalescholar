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
 */
export const XP_LEVELS: XPLevel[] = [
  { level: 1, minXP: 0, maxXP: 100, title: 'Beginner' },
  { level: 2, minXP: 100, maxXP: 250, title: 'Beginner' },
  { level: 3, minXP: 250, maxXP: 500, title: 'Beginner' },
  { level: 4, minXP: 500, maxXP: 800, title: 'Intermediate' },
  { level: 5, minXP: 800, maxXP: 1150, title: 'Intermediate' },
  { level: 6, minXP: 1150, maxXP: 1500, title: 'Intermediate' },
  { level: 7, minXP: 1500, maxXP: 2000, title: 'Advanced' },
  { level: 8, minXP: 2000, maxXP: 2600, title: 'Advanced' },
  { level: 9, minXP: 2600, maxXP: 3500, title: 'Advanced' },
  { level: 10, minXP: 3500, maxXP: Infinity, title: 'Scholar' },
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
