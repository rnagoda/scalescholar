/**
 * Pitch Detector Type Definitions
 */

import { DEFAULT_A4_FREQUENCY } from '../utils/music';

/**
 * Result of a pitch detection
 */
export interface PitchResult {
  /** Detected frequency in Hz */
  frequency: number;
  /** Nearest MIDI note number */
  midiNote: number;
  /** Note name (e.g., "A4", "C#5") */
  noteName: string;
  /** Cents deviation from nearest note (-50 to +50) */
  cents: number;
  /** Timestamp of detection */
  timestamp: number;
}

/**
 * Pitch detector state
 */
export type PitchDetectorState = 'idle' | 'requesting' | 'listening' | 'error';

/**
 * Configuration for pitch detection
 */
export interface PitchDetectorConfig {
  /** Sample rate in Hz */
  sampleRate: number;
  /** Buffer size in samples */
  bufferSize: number;
  /** Minimum detectable frequency in Hz */
  minFrequency: number;
  /** Maximum detectable frequency in Hz */
  maxFrequency: number;
  /** A4 reference frequency */
  a4Frequency: number;
}

/**
 * Default configuration
 */
export const DEFAULT_PITCH_DETECTOR_CONFIG: PitchDetectorConfig = {
  sampleRate: 44100,
  bufferSize: 4096,
  minFrequency: 65, // C2
  maxFrequency: 1047, // C6
  a4Frequency: DEFAULT_A4_FREQUENCY,
};

/**
 * Callback types
 */
export type PitchDetectedCallback = (result: PitchResult) => void;
export type PitchDetectorErrorCallback = (error: string) => void;
export type PitchDetectorStateCallback = (state: PitchDetectorState) => void;
