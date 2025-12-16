/**
 * Unlock Mappings
 *
 * Defines which Ear School content is unlocked by completing Music School lessons.
 * When a lesson is completed, its unlocks are processed to grant access to
 * new intervals, scale degrees, or chord types in the Ear School trainers.
 */

import { UnlockDef, TrackId } from '../types/lesson';
import { Interval, ScaleDegree, ChordQuality } from '../utils/music';

/**
 * Map of lesson IDs to unlocks they grant
 */
export const LESSON_UNLOCKS: Record<string, UnlockDef[]> = {
  // Foundations Track - Level 1
  // These lessons introduce basic concepts, minimal unlocks
  'foundations-1-1': [], // What is Pitch - no unlocks yet
  'foundations-1-2': [], // Musical Notes - no unlocks yet
  'foundations-1-3': [], // Reading the Staff - no unlocks yet
  'foundations-1-4': [
    // Playing Notes - introduces C major chord
    { type: 'intervals', item: String(Interval.MAJOR_THIRD) },
  ],

  // Intervals Track - Level 1
  // These would unlock corresponding interval training
  'intervals-1-1': [
    { type: 'intervals', item: String(Interval.MINOR_SECOND) },
  ],
  'intervals-1-2': [
    { type: 'intervals', item: String(Interval.MAJOR_SECOND) },
  ],
  'intervals-1-3': [
    { type: 'intervals', item: String(Interval.MINOR_THIRD) },
  ],
  'intervals-1-4': [
    { type: 'intervals', item: String(Interval.MAJOR_THIRD) },
  ],

  // Intervals Track - Level 2
  'intervals-2-1': [
    { type: 'intervals', item: String(Interval.PERFECT_FOURTH) },
  ],
  'intervals-2-2': [
    { type: 'intervals', item: String(Interval.TRITONE) },
  ],
  'intervals-2-3': [
    { type: 'intervals', item: String(Interval.PERFECT_FIFTH) },
  ],
  'intervals-2-4': [
    { type: 'intervals', item: String(Interval.MINOR_SIXTH) },
  ],

  // Intervals Track - Level 3
  'intervals-3-1': [
    { type: 'intervals', item: String(Interval.MAJOR_SIXTH) },
  ],
  'intervals-3-2': [
    { type: 'intervals', item: String(Interval.MINOR_SEVENTH) },
  ],
  'intervals-3-3': [
    { type: 'intervals', item: String(Interval.MAJOR_SEVENTH) },
  ],
  'intervals-3-4': [
    { type: 'intervals', item: String(Interval.OCTAVE) },
  ],

  // Scales & Keys Track - Level 1
  // These unlock scale degree training
  'scales-keys-1-1': [
    { type: 'scale-degrees', item: String(ScaleDegree.SUPERTONIC) }, // 2
  ],
  'scales-keys-1-2': [
    { type: 'scale-degrees', item: String(ScaleDegree.MEDIANT) }, // 3
  ],
  'scales-keys-1-3': [
    { type: 'scale-degrees', item: String(ScaleDegree.SUBDOMINANT) }, // 4
  ],
  'scales-keys-1-4': [
    { type: 'scale-degrees', item: String(ScaleDegree.DOMINANT) }, // 5
  ],

  // Scales & Keys Track - Level 2
  'scales-keys-2-1': [
    { type: 'scale-degrees', item: String(ScaleDegree.SUBMEDIANT) }, // 6
  ],
  'scales-keys-2-2': [
    { type: 'scale-degrees', item: String(ScaleDegree.LEADING_TONE) }, // 7
  ],

  // Chords Track - Level 1
  // These unlock chord quality training
  'chords-1-1': [], // Intro to chords - major/minor already unlocked
  'chords-1-2': [],
  'chords-1-3': [],
  'chords-1-4': [
    { type: 'chords', item: 'diminished' as ChordQuality },
  ],

  // Chords Track - Level 2
  'chords-2-1': [
    { type: 'chords', item: 'augmented' as ChordQuality },
  ],
  'chords-2-2': [
    { type: 'chords', item: 'sus2' as ChordQuality },
  ],
  'chords-2-3': [
    { type: 'chords', item: 'sus4' as ChordQuality },
  ],
  'chords-2-4': [
    { type: 'chords', item: 'dominant7' as ChordQuality },
  ],

  // Chords Track - Level 3
  'chords-3-1': [
    { type: 'chords', item: 'major7' as ChordQuality },
  ],
  'chords-3-2': [
    { type: 'chords', item: 'minor7' as ChordQuality },
  ],
};

/**
 * Get unlocks for a specific lesson
 */
export function getLessonUnlocks(lessonId: string): UnlockDef[] {
  return LESSON_UNLOCKS[lessonId] || [];
}

/**
 * Get all lessons that unlock a specific item
 */
export function getLessonsForUnlock(
  type: UnlockDef['type'],
  item: string
): string[] {
  const lessons: string[] = [];

  Object.entries(LESSON_UNLOCKS).forEach(([lessonId, unlocks]) => {
    if (unlocks.some((u) => u.type === type && u.item === item)) {
      lessons.push(lessonId);
    }
  });

  return lessons;
}

/**
 * Check if a lesson grants any unlocks
 */
export function hasUnlocks(lessonId: string): boolean {
  const unlocks = LESSON_UNLOCKS[lessonId];
  return unlocks && unlocks.length > 0;
}
