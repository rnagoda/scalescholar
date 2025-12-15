/**
 * Pitch Smoothing Utilities
 *
 * Provides mode-specific smoothing algorithms to reduce pitch display jitter:
 * - VOICE mode: Median filtering + Exponential Moving Average (EMA)
 * - INSTRUMENT mode: Median filtering + Note hysteresis
 */

import { PitchResult } from '../types/pitchDetector';
import { InstrumentTuning } from '../types/guitarTuning';
import {
  frequencyToMidi,
  frequencyToNoteName,
  frequencyToCents,
  DEFAULT_A4_FREQUENCY,
} from './music';

/**
 * Smoothing mode type
 */
export type SmoothingMode = 'voice' | 'instrument';

/**
 * Configuration for pitch smoothing
 */
export interface SmoothingConfig {
  /** Number of samples for median filter */
  medianWindowSize: number;
  /** Alpha value for EMA (0-1, higher = more responsive) */
  emaAlpha: number;
  /** Cents threshold before switching strings in instrument mode */
  hysteresisThreshold: number;
}

/**
 * Default smoothing configuration
 */
export const DEFAULT_SMOOTHING_CONFIG: SmoothingConfig = {
  medianWindowSize: 3,
  emaAlpha: 0.35,
  hysteresisThreshold: 25,
};

/**
 * Calculate median of an array of numbers
 */
export function medianFilter(values: number[]): number {
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculate exponential moving average
 */
export function exponentialMovingAverage(
  current: number,
  previous: number | null,
  alpha: number
): number {
  if (previous === null) return current;
  return alpha * current + (1 - alpha) * previous;
}

/**
 * PitchSmoother class
 *
 * Handles mode-specific pitch smoothing to reduce jitter in the display.
 */
export class PitchSmoother {
  private mode: SmoothingMode;
  private config: SmoothingConfig;
  private a4Frequency: number;

  // For median filtering
  private recentFrequencies: number[] = [];

  // For EMA smoothing (voice mode)
  private smoothedFrequency: number | null = null;

  // For hysteresis (instrument mode)
  private lockedStringNumber: number | null = null;
  private lockedStringFrequency: number | null = null;

  constructor(
    mode: SmoothingMode = 'voice',
    config: Partial<SmoothingConfig> = {},
    a4Frequency: number = DEFAULT_A4_FREQUENCY
  ) {
    this.mode = mode;
    this.config = { ...DEFAULT_SMOOTHING_CONFIG, ...config };
    this.a4Frequency = a4Frequency;
  }

  /**
   * Set the smoothing mode
   */
  setMode(mode: SmoothingMode): void {
    if (this.mode !== mode) {
      this.mode = mode;
      this.reset();
    }
  }

  /**
   * Set the A4 reference frequency
   */
  setA4Frequency(frequency: number): void {
    this.a4Frequency = frequency;
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<SmoothingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Reset all smoothing state
   */
  reset(): void {
    this.recentFrequencies = [];
    this.smoothedFrequency = null;
    this.lockedStringNumber = null;
    this.lockedStringFrequency = null;
  }

  /**
   * Process a raw pitch result and return a smoothed result
   *
   * @param raw - The raw pitch result from the detector
   * @param tuning - Optional tuning for instrument mode hysteresis
   * @returns Smoothed pitch result
   */
  process(raw: PitchResult, tuning?: InstrumentTuning): PitchResult {
    // Step 1: Add to recent frequencies for median filter
    this.recentFrequencies.push(raw.frequency);
    if (this.recentFrequencies.length > this.config.medianWindowSize) {
      this.recentFrequencies.shift();
    }

    // Step 2: Apply median filter
    const medianFrequency = medianFilter(this.recentFrequencies);

    // Step 3: Apply mode-specific smoothing
    let smoothedFrequency: number;

    if (this.mode === 'voice') {
      // Voice mode: Apply EMA smoothing
      smoothedFrequency = exponentialMovingAverage(
        medianFrequency,
        this.smoothedFrequency,
        this.config.emaAlpha
      );
      this.smoothedFrequency = smoothedFrequency;
    } else {
      // Instrument mode: Apply hysteresis
      smoothedFrequency = this.applyHysteresis(medianFrequency, tuning);
    }

    // Step 4: Create smoothed result
    return this.createPitchResult(smoothedFrequency, raw.timestamp);
  }

  /**
   * Apply hysteresis for instrument mode
   * Locks onto a string and only switches when moving significantly away
   */
  private applyHysteresis(frequency: number, tuning?: InstrumentTuning): number {
    // If no tuning provided, just use EMA as fallback
    if (!tuning) {
      this.smoothedFrequency = exponentialMovingAverage(
        frequency,
        this.smoothedFrequency,
        this.config.emaAlpha
      );
      return this.smoothedFrequency;
    }

    // Find the closest string to current frequency
    const closestString = this.findClosestString(frequency, tuning);
    if (!closestString) {
      return frequency;
    }

    // If we don't have a locked string, lock to the closest one
    if (this.lockedStringNumber === null) {
      this.lockedStringNumber = closestString.stringNumber;
      this.lockedStringFrequency = closestString.frequency;
      return frequency;
    }

    // Calculate cents from the locked string's target frequency
    const centsFromLocked = this.calculateCents(frequency, this.lockedStringFrequency!);

    // If we've moved more than the threshold, switch to the new closest string
    if (Math.abs(centsFromLocked) > this.config.hysteresisThreshold) {
      this.lockedStringNumber = closestString.stringNumber;
      this.lockedStringFrequency = closestString.frequency;
    }

    // Return the actual frequency (display will show deviation from locked string)
    return frequency;
  }

  /**
   * Find the closest string in the tuning to a given frequency
   */
  private findClosestString(
    frequency: number,
    tuning: InstrumentTuning
  ): { stringNumber: number; frequency: number } | null {
    let closestString = null;
    let minDistance = Infinity;

    for (const string of tuning.strings) {
      // Calculate distance in cents
      const cents = Math.abs(this.calculateCents(frequency, string.frequency));
      if (cents < minDistance) {
        minDistance = cents;
        closestString = {
          stringNumber: string.stringNumber,
          frequency: string.frequency,
        };
      }
    }

    return closestString;
  }

  /**
   * Calculate cents difference between two frequencies
   */
  private calculateCents(frequency: number, reference: number): number {
    return 1200 * Math.log2(frequency / reference);
  }

  /**
   * Create a PitchResult from a smoothed frequency
   */
  private createPitchResult(frequency: number, timestamp: number): PitchResult {
    return {
      frequency,
      midiNote: frequencyToMidi(frequency, this.a4Frequency),
      noteName: frequencyToNoteName(frequency, this.a4Frequency),
      cents: frequencyToCents(frequency, this.a4Frequency),
      timestamp,
    };
  }

  /**
   * Get the currently locked string number (instrument mode only)
   */
  getLockedStringNumber(): number | null {
    return this.lockedStringNumber;
  }

  /**
   * Get the current smoothing mode
   */
  getMode(): SmoothingMode {
    return this.mode;
  }
}
