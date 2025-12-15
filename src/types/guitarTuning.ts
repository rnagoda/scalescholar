/**
 * Guitar Tuning Type Definitions
 */

/**
 * Represents a single guitar string with its target note
 */
export interface GuitarString {
  /** String number (1 = high E, 6 = low E in standard) */
  stringNumber: number;
  /** MIDI note number for the target pitch */
  midiNote: number;
  /** Note name (e.g., "E2", "A2") */
  noteName: string;
  /** Frequency in Hz (at A4=440) */
  frequency: number;
}

/**
 * Represents a complete guitar tuning
 */
export interface GuitarTuning {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Short name for compact display */
  shortName: string;
  /** Array of 6 strings, index 0 = string 6 (low), index 5 = string 1 (high) */
  strings: GuitarString[];
}

/**
 * Pitch detector mode
 */
export type PitchDetectorMode = 'free' | 'guitar';

/**
 * Result of string detection
 */
export interface StringDetectionResult {
  /** Detected string (1-6, or null if out of range) */
  stringNumber: number | null;
  /** Target string data */
  targetString: GuitarString | null;
  /** Cents deviation from target string (-50 to +50) */
  centsFromTarget: number;
  /** Whether the pitch is in the valid range for this tuning */
  isInRange: boolean;
}
