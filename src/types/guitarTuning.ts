/**
 * Instrument Tuning Type Definitions
 *
 * Supports multiple stringed instruments: Guitar, Violin, Ukulele, Banjo, Mandolin
 */

/**
 * Supported instrument types
 */
export type InstrumentType = 'guitar' | 'violin' | 'ukulele' | 'banjo' | 'mandolin';

/**
 * Instrument metadata
 */
export interface Instrument {
  id: InstrumentType;
  name: string;
  stringCount: number;
}

/**
 * Represents a single string with its target note
 */
export interface InstrumentString {
  /** String number (1 = highest, increasing = lower) */
  stringNumber: number;
  /** MIDI note number for the target pitch */
  midiNote: number;
  /** Note name (e.g., "E2", "A2") */
  noteName: string;
  /** Frequency in Hz (at A4=440) */
  frequency: number;
}

/**
 * Represents a complete instrument tuning
 */
export interface InstrumentTuning {
  /** Unique identifier */
  id: string;
  /** Instrument type this tuning belongs to */
  instrumentId: InstrumentType;
  /** Display name */
  name: string;
  /** Short name for compact display */
  shortName: string;
  /** Array of strings, index 0 = lowest string, last index = highest string */
  strings: InstrumentString[];
}

/**
 * Pitch detector mode
 */
export type PitchDetectorMode = 'free' | 'instrument';

/**
 * Result of string detection
 */
export interface StringDetectionResult {
  /** Detected string number, or null if out of range */
  stringNumber: number | null;
  /** Target string data */
  targetString: InstrumentString | null;
  /** Cents deviation from target string (-50 to +50) */
  centsFromTarget: number;
  /** Whether the pitch is in the valid range for this tuning */
  isInRange: boolean;
}

// Legacy type aliases for backward compatibility
export type GuitarString = InstrumentString;
export type GuitarTuning = InstrumentTuning;
