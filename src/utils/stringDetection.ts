/**
 * String Detection Utility
 *
 * Detects which string is being played based on the detected frequency.
 */

import {
  InstrumentTuning,
  InstrumentString,
  StringDetectionResult,
} from '../types/guitarTuning';
import { frequencyToExactMidi, DEFAULT_A4_FREQUENCY } from './music';

/**
 * Tolerance in semitones for string detection.
 * If pitch is more than this many semitones from any string, it's out of range.
 */
const STRING_DETECTION_TOLERANCE = 2.5;

/**
 * Detect which string is being played based on frequency.
 * Returns the closest string within tolerance.
 */
export function detectString(
  frequency: number,
  tuning: InstrumentTuning,
  a4Freq: number = DEFAULT_A4_FREQUENCY
): StringDetectionResult {
  const exactMidi = frequencyToExactMidi(frequency, a4Freq);

  let closestString: InstrumentString | null = null;
  let closestDistance = Infinity;

  // Find the closest string by MIDI distance
  for (const string of tuning.strings) {
    const distance = Math.abs(exactMidi - string.midiNote);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestString = string;
    }
  }

  // Check if within tolerance
  const isInRange = closestDistance <= STRING_DETECTION_TOLERANCE;

  if (!isInRange || !closestString) {
    return {
      stringNumber: null,
      targetString: null,
      centsFromTarget: 0,
      isInRange: false,
    };
  }

  // Calculate cents from target (positive = sharp, negative = flat)
  const centsFromTarget = Math.round((exactMidi - closestString.midiNote) * 100);

  return {
    stringNumber: closestString.stringNumber,
    targetString: closestString,
    centsFromTarget: Math.max(-50, Math.min(50, centsFromTarget)),
    isInRange: true,
  };
}

/**
 * Get accuracy level based on cents deviation
 */
export function getAccuracyLevel(cents: number): 'perfect' | 'close' | 'off' {
  const absCents = Math.abs(cents);
  if (absCents <= 5) return 'perfect';
  if (absCents <= 15) return 'close';
  return 'off';
}

/**
 * Get tuning direction based on cents
 */
export function getTuningDirection(cents: number): 'flat' | 'sharp' | 'in-tune' {
  if (Math.abs(cents) <= 5) return 'in-tune';
  return cents < 0 ? 'flat' : 'sharp';
}
