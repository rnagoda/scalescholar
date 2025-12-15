// Type declarations for pitchfinder library
declare module 'pitchfinder' {
  export interface YINConfig {
    /** Sample rate of audio (default: 44100) */
    sampleRate?: number;
    /** Probability threshold (default: 0.1) */
    threshold?: number;
  }

  export interface AMDFConfig {
    /** Sample rate of audio (default: 44100) */
    sampleRate?: number;
    /** Minimum frequency to detect (default: 82.41) */
    minFrequency?: number;
    /** Maximum frequency to detect (default: 1000) */
    maxFrequency?: number;
    /** Sensitivity (default: 0.1) */
    sensitivity?: number;
    /** Ratio (default: 5) */
    ratio?: number;
  }

  export interface DynamicWaveletConfig {
    /** Sample rate of audio (default: 44100) */
    sampleRate?: number;
  }

  export interface MacleodConfig {
    /** Sample rate of audio (default: 44100) */
    sampleRate?: number;
    /** Buffer size for pitch detection */
    bufferSize?: number;
    /** Cutoff (default: 0.97) */
    cutoff?: number;
    /** Small cutoff (default: 0.5) */
    smallCutoff?: number;
    /** Lower pitch cutoff (default: 80) */
    lowerPitchCutoff?: number;
  }

  /** Pitch detector function - returns frequency in Hz or null if no pitch detected */
  export type PitchDetector = (audioData: Float32Array) => number | null;

  /** YIN pitch detection algorithm */
  export function YIN(config?: YINConfig): PitchDetector;

  /** AMDF pitch detection algorithm */
  export function AMDF(config?: AMDFConfig): PitchDetector;

  /** Dynamic Wavelet pitch detection algorithm */
  export function DynamicWavelet(config?: DynamicWaveletConfig): PitchDetector;

  /** Macleod pitch detection algorithm */
  export function Macleod(config?: MacleodConfig): PitchDetector;

  /** Available pitch detection algorithms */
  export const frequencies: {
    YIN: typeof YIN;
    AMDF: typeof AMDF;
    DynamicWavelet: typeof DynamicWavelet;
    Macleod: typeof Macleod;
  };

  const Pitchfinder: {
    YIN: typeof YIN;
    AMDF: typeof AMDF;
    DynamicWavelet: typeof DynamicWavelet;
    Macleod: typeof Macleod;
    frequencies: typeof frequencies;
  };

  export default Pitchfinder;
}
