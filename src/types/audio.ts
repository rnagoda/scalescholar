/**
 * Audio-related type definitions
 */

/**
 * ADSR Envelope parameters
 */
export interface ADSREnvelope {
  attack: number; // seconds
  decay: number; // seconds
  sustain: number; // 0-1 level
  release: number; // seconds
}

/**
 * Common synthesizer interface
 * All synth implementations must follow this contract
 */
export interface Synthesizer {
  /**
   * Play a single note at the given frequency
   * @param frequency - Frequency in Hz
   * @param duration - Duration in seconds
   */
  playNote(frequency: number, duration: number): Promise<void>;

  /**
   * Play multiple notes simultaneously (chord)
   * @param frequencies - Array of frequencies in Hz
   * @param duration - Duration in seconds
   */
  playChord(frequencies: number[], duration: number): Promise<void>;

  /**
   * Stop all currently playing sounds
   */
  stop(): void;

  /**
   * Clean up resources
   */
  dispose(): void;
}

/**
 * Audio engine configuration
 */
export interface AudioEngineConfig {
  a4Frequency: number;
  defaultDuration: number;
  envelope: ADSREnvelope;
}

/**
 * Available synth types
 */
export type SynthType = 'sine' | 'piano';
