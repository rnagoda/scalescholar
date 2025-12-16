/**
 * Lesson Content Loader
 *
 * Centralized loader for all Music School lesson content.
 * Lessons are bundled with the app as TypeScript objects.
 */

import { Lesson, TrackId, TRACKS } from '../../types/lesson';

// Import lesson modules
import * as foundationsLessons from './foundations';

/**
 * All lessons indexed by ID for quick lookup
 */
const LESSONS_BY_ID: Record<string, Lesson> = {};

/**
 * Lessons organized by track and level
 */
const LESSONS_BY_TRACK: Record<TrackId, Lesson[]> = {
  foundations: [],
  intervals: [],
  'scales-keys': [],
  chords: [],
};

/**
 * Initialize lesson registry
 */
function initializeLessons() {
  // Register foundations lessons
  Object.values(foundationsLessons).forEach((lesson) => {
    if (lesson && typeof lesson === 'object' && 'id' in lesson) {
      registerLesson(lesson as Lesson);
    }
  });

  // Sort lessons by level and lesson index
  Object.keys(LESSONS_BY_TRACK).forEach((trackId) => {
    LESSONS_BY_TRACK[trackId as TrackId].sort((a, b) => {
      if (a.levelIndex !== b.levelIndex) {
        return a.levelIndex - b.levelIndex;
      }
      return a.lessonIndex - b.lessonIndex;
    });
  });
}

/**
 * Register a lesson in the registry
 */
function registerLesson(lesson: Lesson) {
  LESSONS_BY_ID[lesson.id] = lesson;
  LESSONS_BY_TRACK[lesson.trackId].push(lesson);
}

/**
 * Get a lesson by ID
 */
export function getLessonById(lessonId: string): Lesson | undefined {
  return LESSONS_BY_ID[lessonId];
}

/**
 * Get all lessons for a track
 */
export function getLessonsByTrack(trackId: TrackId): Lesson[] {
  return LESSONS_BY_TRACK[trackId] || [];
}

/**
 * Get lessons for a specific level within a track
 */
export function getLessonsByLevel(trackId: TrackId, levelIndex: number): Lesson[] {
  return getLessonsByTrack(trackId).filter(
    (lesson) => lesson.levelIndex === levelIndex
  );
}

/**
 * Get total lesson count for a track
 */
export function getTrackLessonCount(trackId: TrackId): number {
  return LESSONS_BY_TRACK[trackId].length;
}

/**
 * Get all lessons across all tracks
 */
export function getAllLessons(): Lesson[] {
  return Object.values(LESSONS_BY_ID);
}

/**
 * Get the next lesson in sequence after a given lesson
 */
export function getNextLesson(currentLessonId: string): Lesson | undefined {
  const current = LESSONS_BY_ID[currentLessonId];
  if (!current) return undefined;

  const trackLessons = LESSONS_BY_TRACK[current.trackId];
  const currentIndex = trackLessons.findIndex((l) => l.id === currentLessonId);

  if (currentIndex < 0 || currentIndex >= trackLessons.length - 1) {
    return undefined;
  }

  return trackLessons[currentIndex + 1];
}

/**
 * Get the previous lesson in sequence before a given lesson
 */
export function getPreviousLesson(currentLessonId: string): Lesson | undefined {
  const current = LESSONS_BY_ID[currentLessonId];
  if (!current) return undefined;

  const trackLessons = LESSONS_BY_TRACK[current.trackId];
  const currentIndex = trackLessons.findIndex((l) => l.id === currentLessonId);

  if (currentIndex <= 0) {
    return undefined;
  }

  return trackLessons[currentIndex - 1];
}

/**
 * Check if a lesson is the first in its track
 */
export function isFirstLessonInTrack(lessonId: string): boolean {
  const lesson = LESSONS_BY_ID[lessonId];
  if (!lesson) return false;

  const trackLessons = LESSONS_BY_TRACK[lesson.trackId];
  return trackLessons.length > 0 && trackLessons[0].id === lessonId;
}

/**
 * Check if a lesson is the last in its track
 */
export function isLastLessonInTrack(lessonId: string): boolean {
  const lesson = LESSONS_BY_ID[lessonId];
  if (!lesson) return false;

  const trackLessons = LESSONS_BY_TRACK[lesson.trackId];
  return (
    trackLessons.length > 0 &&
    trackLessons[trackLessons.length - 1].id === lessonId
  );
}

// Initialize on module load
initializeLessons();
