/**
 * XP Service
 *
 * Database operations for XP tracking across all exercise types.
 */

import { getDatabase } from './database';
import {
  XPSource,
  XPEvent,
  XPState,
  getLevelFromXP,
  getLevelProgress,
  getXPToNextLevel,
} from '../types/xp';

/**
 * Award XP and save to database
 */
export const awardXP = async (
  source: XPSource,
  amount: number,
  details?: string
): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO xp_events (source, amount, details)
     VALUES (?, ?, ?)`,
    source,
    amount,
    details ?? null
  );
};

/**
 * Get total XP across all sources
 */
export const getTotalXP = async (): Promise<number> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(amount), 0) as total FROM xp_events`
  );

  return result?.total ?? 0;
};

/**
 * Get XP by source
 */
export const getXPBySource = async (source: XPSource): Promise<number> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(amount), 0) as total FROM xp_events WHERE source = ?`,
    source
  );

  return result?.total ?? 0;
};

/**
 * Get full XP state with level info
 */
export const getXPState = async (): Promise<XPState> => {
  const totalXP = await getTotalXP();
  const level = getLevelFromXP(totalXP);

  return {
    totalXP,
    currentLevel: level.level,
    levelTitle: level.title,
    levelProgress: getLevelProgress(totalXP),
    xpToNextLevel: getXPToNextLevel(totalXP),
  };
};

/**
 * Get recent XP events
 */
export const getRecentXPEvents = async (limit: number = 10): Promise<XPEvent[]> => {
  const db = await getDatabase();

  const results = await db.getAllAsync<{
    id: number;
    source: string;
    amount: number;
    details: string | null;
    created_at: string;
  }>(
    `SELECT * FROM xp_events
     ORDER BY created_at DESC
     LIMIT ?`,
    limit
  );

  return results.map((row) => ({
    id: row.id,
    source: row.source as XPSource,
    amount: row.amount,
    details: row.details ?? undefined,
    createdAt: new Date(row.created_at),
  }));
};

/**
 * Get XP earned today
 */
export const getTodayXP = async (): Promise<number> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(amount), 0) as total FROM xp_events
     WHERE date(created_at) = date('now')`
  );

  return result?.total ?? 0;
};

/**
 * Get XP breakdown by source
 */
export const getXPBreakdown = async (): Promise<Record<XPSource, number>> => {
  const db = await getDatabase();

  const results = await db.getAllAsync<{ source: string; total: number }>(
    `SELECT source, COALESCE(SUM(amount), 0) as total
     FROM xp_events
     GROUP BY source`
  );

  const breakdown: Record<XPSource, number> = {
    'ear-school': 0,
    'music-school': 0,
    'voice-school': 0,
    'streak-bonus': 0,
  };

  for (const row of results) {
    breakdown[row.source as XPSource] = row.total;
  }

  return breakdown;
};
