/**
 * Music theory utilities for Scale Scholar
 */

// Standard A4 reference frequency (can be adjusted in settings)
export const DEFAULT_A4_FREQUENCY = 440;

// MIDI note number for A4
const A4_MIDI = 69;

// Middle C MIDI note number
export const MIDDLE_C = 60;

/**
 * Interval definitions in semitones
 */
export enum Interval {
  UNISON = 0,
  MINOR_SECOND = 1,
  MAJOR_SECOND = 2,
  MINOR_THIRD = 3,
  MAJOR_THIRD = 4,
  PERFECT_FOURTH = 5,
  TRITONE = 6,
  PERFECT_FIFTH = 7,
  MINOR_SIXTH = 8,
  MAJOR_SIXTH = 9,
  MINOR_SEVENTH = 10,
  MAJOR_SEVENTH = 11,
  OCTAVE = 12,
}

/**
 * Short interval names for display
 */
export const INTERVAL_SHORT_NAMES: Record<Interval, string> = {
  [Interval.UNISON]: 'P1',
  [Interval.MINOR_SECOND]: 'm2',
  [Interval.MAJOR_SECOND]: 'M2',
  [Interval.MINOR_THIRD]: 'm3',
  [Interval.MAJOR_THIRD]: 'M3',
  [Interval.PERFECT_FOURTH]: 'P4',
  [Interval.TRITONE]: 'TT',
  [Interval.PERFECT_FIFTH]: 'P5',
  [Interval.MINOR_SIXTH]: 'm6',
  [Interval.MAJOR_SIXTH]: 'M6',
  [Interval.MINOR_SEVENTH]: 'm7',
  [Interval.MAJOR_SEVENTH]: 'M7',
  [Interval.OCTAVE]: 'P8',
};

/**
 * Full interval names
 */
export const INTERVAL_FULL_NAMES: Record<Interval, string> = {
  [Interval.UNISON]: 'Unison',
  [Interval.MINOR_SECOND]: 'Minor 2nd',
  [Interval.MAJOR_SECOND]: 'Major 2nd',
  [Interval.MINOR_THIRD]: 'Minor 3rd',
  [Interval.MAJOR_THIRD]: 'Major 3rd',
  [Interval.PERFECT_FOURTH]: 'Perfect 4th',
  [Interval.TRITONE]: 'Tritone',
  [Interval.PERFECT_FIFTH]: 'Perfect 5th',
  [Interval.MINOR_SIXTH]: 'Minor 6th',
  [Interval.MAJOR_SIXTH]: 'Major 6th',
  [Interval.MINOR_SEVENTH]: 'Minor 7th',
  [Interval.MAJOR_SEVENTH]: 'Major 7th',
  [Interval.OCTAVE]: 'Octave',
};

/**
 * Starter intervals for beginners (unlocked by default)
 */
export const STARTER_INTERVALS: Interval[] = [
  Interval.MINOR_THIRD,
  Interval.MAJOR_THIRD,
  Interval.PERFECT_FOURTH,
  Interval.PERFECT_FIFTH,
];

/**
 * All trainable intervals in unlock order
 */
export const ALL_INTERVALS: Interval[] = [
  // Starter intervals
  Interval.MINOR_THIRD,
  Interval.MAJOR_THIRD,
  Interval.PERFECT_FOURTH,
  Interval.PERFECT_FIFTH,
  // Unlockable intervals
  Interval.MINOR_SECOND,
  Interval.MAJOR_SECOND,
  Interval.TRITONE,
  Interval.MINOR_SIXTH,
  Interval.MAJOR_SIXTH,
  Interval.MINOR_SEVENTH,
  Interval.MAJOR_SEVENTH,
  Interval.OCTAVE,
];

/**
 * All intervals that can be unlocked
 */
export const UNLOCKABLE_INTERVALS: Interval[] = [
  Interval.MINOR_SECOND,
  Interval.MAJOR_SECOND,
  Interval.TRITONE,
  Interval.MINOR_SIXTH,
  Interval.MAJOR_SIXTH,
  Interval.MINOR_SEVENTH,
  Interval.MAJOR_SEVENTH,
  Interval.OCTAVE,
];

/**
 * Convert MIDI note number to frequency in Hz
 * Uses equal temperament tuning
 */
export function midiToFrequency(
  midiNote: number,
  a4Freq: number = DEFAULT_A4_FREQUENCY
): number {
  return a4Freq * Math.pow(2, (midiNote - A4_MIDI) / 12);
}

/**
 * Convert frequency to MIDI note number (rounded)
 */
export function frequencyToMidi(
  frequency: number,
  a4Freq: number = DEFAULT_A4_FREQUENCY
): number {
  return Math.round(12 * Math.log2(frequency / a4Freq) + A4_MIDI);
}

/**
 * Get the interval name from semitones
 */
export function getIntervalName(
  semitones: number,
  short: boolean = true
): string {
  const normalizedSemitones = Math.abs(semitones) % 13;
  const interval = normalizedSemitones as Interval;
  return short
    ? INTERVAL_SHORT_NAMES[interval] || `${semitones}st`
    : INTERVAL_FULL_NAMES[interval] || `${semitones} semitones`;
}

/**
 * Generate a random MIDI note within a range
 */
export function randomMidiNote(minMidi: number, maxMidi: number): number {
  return Math.floor(Math.random() * (maxMidi - minMidi + 1)) + minMidi;
}

/**
 * Generate a random interval from the given set
 */
export function randomInterval(intervals: Interval[]): Interval {
  return intervals[Math.floor(Math.random() * intervals.length)];
}

/**
 * Check if two intervals are the same or similar
 * (for preventing consecutive similar questions)
 */
export function areIntervalsSimilar(a: Interval, b: Interval): boolean {
  return a === b || Math.abs(a - b) <= 1;
}

/**
 * Major scale intervals from root (in semitones)
 */
export const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];

/**
 * Generate major scale MIDI notes from a root
 */
export function generateMajorScale(rootMidi: number): number[] {
  return MAJOR_SCALE.map((interval) => rootMidi + interval);
}

/**
 * Chord types defined by intervals from root
 */
export const CHORD_TYPES = {
  MAJOR: [0, 4, 7],
  MINOR: [0, 3, 7],
  DIMINISHED: [0, 3, 6],
  AUGMENTED: [0, 4, 8],
} as const;

export type ChordType = keyof typeof CHORD_TYPES;

/**
 * Generate chord MIDI notes from a root and type
 */
export function generateChord(rootMidi: number, type: ChordType): number[] {
  return CHORD_TYPES[type].map((interval) => rootMidi + interval);
}

// ============================================
// CHORD QUALITIES (for Chord Quality Trainer)
// ============================================

/**
 * Chord quality enum for the trainer
 */
export enum ChordQuality {
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  DIMINISHED = 'DIMINISHED',
  AUGMENTED = 'AUGMENTED',
}

/**
 * Short chord quality names for display
 */
export const CHORD_QUALITY_SHORT_NAMES: Record<ChordQuality, string> = {
  [ChordQuality.MAJOR]: 'Maj',
  [ChordQuality.MINOR]: 'Min',
  [ChordQuality.DIMINISHED]: 'Dim',
  [ChordQuality.AUGMENTED]: 'Aug',
};

/**
 * Full chord quality names
 */
export const CHORD_QUALITY_FULL_NAMES: Record<ChordQuality, string> = {
  [ChordQuality.MAJOR]: 'Major',
  [ChordQuality.MINOR]: 'Minor',
  [ChordQuality.DIMINISHED]: 'Diminished',
  [ChordQuality.AUGMENTED]: 'Augmented',
};

/**
 * Intervals from root for each chord quality (in semitones)
 */
export const CHORD_QUALITY_INTERVALS: Record<ChordQuality, readonly number[]> = {
  [ChordQuality.MAJOR]: CHORD_TYPES.MAJOR,
  [ChordQuality.MINOR]: CHORD_TYPES.MINOR,
  [ChordQuality.DIMINISHED]: CHORD_TYPES.DIMINISHED,
  [ChordQuality.AUGMENTED]: CHORD_TYPES.AUGMENTED,
};

/**
 * Starter chord qualities (unlocked by default)
 * Major and Minor - the most common chord types
 */
export const STARTER_CHORD_QUALITIES: ChordQuality[] = [
  ChordQuality.MAJOR,
  ChordQuality.MINOR,
];

/**
 * All chord qualities in unlock order
 */
export const ALL_CHORD_QUALITIES: ChordQuality[] = [
  // Starter qualities
  ChordQuality.MAJOR,
  ChordQuality.MINOR,
  // Unlockable qualities
  ChordQuality.DIMINISHED,
  ChordQuality.AUGMENTED,
];

/**
 * Get chord quality name
 */
export function getChordQualityName(
  quality: ChordQuality,
  short: boolean = true
): string {
  return short
    ? CHORD_QUALITY_SHORT_NAMES[quality]
    : CHORD_QUALITY_FULL_NAMES[quality];
}

/**
 * Generate chord MIDI notes from root and quality
 */
export function generateChordFromQuality(
  rootMidi: number,
  quality: ChordQuality
): number[] {
  return CHORD_QUALITY_INTERVALS[quality].map((interval) => rootMidi + interval);
}

/**
 * Generate a random chord quality from the given set
 */
export function randomChordQuality(qualities: ChordQuality[]): ChordQuality {
  return qualities[Math.floor(Math.random() * qualities.length)];
}

/**
 * Check if two chord qualities are the same
 * (No "similar" concept for chord qualities - they're quite distinct)
 */
export function areChordQualitiesSame(
  a: ChordQuality,
  b: ChordQuality
): boolean {
  return a === b;
}

// ============================================
// SCALE DEGREES
// ============================================

/**
 * Scale degree enum (1-7)
 * Using 1-indexed to match music theory convention
 */
export enum ScaleDegree {
  TONIC = 1,
  SUPERTONIC = 2,
  MEDIANT = 3,
  SUBDOMINANT = 4,
  DOMINANT = 5,
  SUBMEDIANT = 6,
  LEADING_TONE = 7,
}

/**
 * Scale degree number names
 */
export const SCALE_DEGREE_NUMBERS: Record<ScaleDegree, string> = {
  [ScaleDegree.TONIC]: '1',
  [ScaleDegree.SUPERTONIC]: '2',
  [ScaleDegree.MEDIANT]: '3',
  [ScaleDegree.SUBDOMINANT]: '4',
  [ScaleDegree.DOMINANT]: '5',
  [ScaleDegree.SUBMEDIANT]: '6',
  [ScaleDegree.LEADING_TONE]: '7',
};

/**
 * Scale degree solfege names
 */
export const SCALE_DEGREE_SOLFEGE: Record<ScaleDegree, string> = {
  [ScaleDegree.TONIC]: 'Do',
  [ScaleDegree.SUPERTONIC]: 'Re',
  [ScaleDegree.MEDIANT]: 'Mi',
  [ScaleDegree.SUBDOMINANT]: 'Fa',
  [ScaleDegree.DOMINANT]: 'Sol',
  [ScaleDegree.SUBMEDIANT]: 'La',
  [ScaleDegree.LEADING_TONE]: 'Ti',
};

/**
 * Scale degree full names
 */
export const SCALE_DEGREE_FULL_NAMES: Record<ScaleDegree, string> = {
  [ScaleDegree.TONIC]: 'Tonic',
  [ScaleDegree.SUPERTONIC]: 'Supertonic',
  [ScaleDegree.MEDIANT]: 'Mediant',
  [ScaleDegree.SUBDOMINANT]: 'Subdominant',
  [ScaleDegree.DOMINANT]: 'Dominant',
  [ScaleDegree.SUBMEDIANT]: 'Submediant',
  [ScaleDegree.LEADING_TONE]: 'Leading Tone',
};

/**
 * Semitones from root for each scale degree in major scale
 */
export const SCALE_DEGREE_SEMITONES: Record<ScaleDegree, number> = {
  [ScaleDegree.TONIC]: 0,
  [ScaleDegree.SUPERTONIC]: 2,
  [ScaleDegree.MEDIANT]: 4,
  [ScaleDegree.SUBDOMINANT]: 5,
  [ScaleDegree.DOMINANT]: 7,
  [ScaleDegree.SUBMEDIANT]: 9,
  [ScaleDegree.LEADING_TONE]: 11,
};

/**
 * Starter scale degrees (unlocked by default)
 * 1 (Do), 3 (Mi), 5 (Sol) - the tonic triad
 */
export const STARTER_SCALE_DEGREES: ScaleDegree[] = [
  ScaleDegree.TONIC,
  ScaleDegree.MEDIANT,
  ScaleDegree.DOMINANT,
];

/**
 * All scale degrees in unlock order
 */
export const ALL_SCALE_DEGREES: ScaleDegree[] = [
  // Starter degrees (tonic triad)
  ScaleDegree.TONIC,
  ScaleDegree.MEDIANT,
  ScaleDegree.DOMINANT,
  // Unlockable degrees
  ScaleDegree.SUBDOMINANT,
  ScaleDegree.SUPERTONIC,
  ScaleDegree.SUBMEDIANT,
  ScaleDegree.LEADING_TONE,
];

/**
 * Get scale degree name based on display preference
 */
export function getScaleDegreeName(
  degree: ScaleDegree,
  useSolfege: boolean = false
): string {
  return useSolfege
    ? SCALE_DEGREE_SOLFEGE[degree]
    : SCALE_DEGREE_NUMBERS[degree];
}

/**
 * Get MIDI note for a scale degree given the key root
 */
export function scaleDegreeToMidi(
  degree: ScaleDegree,
  keyRootMidi: number,
  octaveOffset: number = 0
): number {
  return keyRootMidi + SCALE_DEGREE_SEMITONES[degree] + octaveOffset * 12;
}

/**
 * Generate a random scale degree from the given set
 */
export function randomScaleDegree(degrees: ScaleDegree[]): ScaleDegree {
  return degrees[Math.floor(Math.random() * degrees.length)];
}

/**
 * Check if two scale degrees are similar (adjacent)
 */
export function areScaleDegreesSimilar(
  a: ScaleDegree,
  b: ScaleDegree
): boolean {
  return a === b || Math.abs(a - b) === 1;
}

/**
 * Key context types for establishing tonality
 */
export type KeyContextType = 'triad' | 'scale' | 'cadence';

/**
 * Generate MIDI notes for key context
 */
export function generateKeyContext(
  keyRootMidi: number,
  contextType: KeyContextType
): number[][] {
  switch (contextType) {
    case 'triad':
      // I chord (tonic triad)
      return [generateChord(keyRootMidi, 'MAJOR')];

    case 'scale':
      // Ascending major scale
      return [generateMajorScale(keyRootMidi)];

    case 'cadence':
      // I - IV - V - I cadence
      return [
        generateChord(keyRootMidi, 'MAJOR'), // I
        generateChord(keyRootMidi + 5, 'MAJOR'), // IV
        generateChord(keyRootMidi + 7, 'MAJOR'), // V
        generateChord(keyRootMidi, 'MAJOR'), // I
      ];

    default:
      return [generateChord(keyRootMidi, 'MAJOR')];
  }
}
