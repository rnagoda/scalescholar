/**
 * PitchDetector Module
 *
 * Singleton class for real-time pitch detection from microphone input.
 * Uses react-native-audio-api AudioRecorder for native microphone access
 * and a custom YIN pitch detection algorithm implementation.
 */

import { AudioRecorder } from 'react-native-audio-api';
import { Platform, PermissionsAndroid } from 'react-native';
import {
  PitchResult,
  PitchDetectorConfig,
  PitchDetectorState,
  PitchDetectedCallback,
  PitchDetectorErrorCallback,
  PitchDetectorStateCallback,
  DEFAULT_PITCH_DETECTOR_CONFIG,
} from '../types/pitchDetector';
import {
  frequencyToMidi,
  frequencyToNoteName,
  frequencyToCents,
} from '../utils/music';

/**
 * YIN Pitch Detection Algorithm
 *
 * Implementation based on the paper:
 * "YIN, a fundamental frequency estimator for speech and music"
 * by Alain de Cheveigné and Hideki Kawahara
 *
 * @param audioData - Float32Array of audio samples
 * @param sampleRate - Sample rate of the audio
 * @param threshold - Probability threshold (default: 0.15)
 * @returns Detected frequency in Hz, or null if no pitch detected
 */
function detectPitchYIN(
  audioData: Float32Array,
  sampleRate: number,
  threshold: number = 0.15
): number | null {
  const bufferSize = audioData.length;
  const halfBufferSize = Math.floor(bufferSize / 2);

  // Step 1: Calculate the difference function
  const difference = new Float32Array(halfBufferSize);
  for (let tau = 0; tau < halfBufferSize; tau++) {
    let sum = 0;
    for (let i = 0; i < halfBufferSize; i++) {
      const delta = audioData[i] - audioData[i + tau];
      sum += delta * delta;
    }
    difference[tau] = sum;
  }

  // Step 2: Calculate the cumulative mean normalized difference function (CMNDF)
  const cmndf = new Float32Array(halfBufferSize);
  cmndf[0] = 1;
  let runningSum = 0;

  for (let tau = 1; tau < halfBufferSize; tau++) {
    runningSum += difference[tau];
    cmndf[tau] = difference[tau] / (runningSum / tau);
  }

  // Step 3: Find the first tau that gives a minimum below threshold
  let tauEstimate = -1;
  for (let tau = 2; tau < halfBufferSize; tau++) {
    if (cmndf[tau] < threshold) {
      // Find the local minimum
      while (tau + 1 < halfBufferSize && cmndf[tau + 1] < cmndf[tau]) {
        tau++;
      }
      tauEstimate = tau;
      break;
    }
  }

  // No pitch found
  if (tauEstimate === -1) {
    return null;
  }

  // Step 4: Parabolic interpolation for better precision
  let betterTau: number;
  if (tauEstimate > 0 && tauEstimate < halfBufferSize - 1) {
    const s0 = cmndf[tauEstimate - 1];
    const s1 = cmndf[tauEstimate];
    const s2 = cmndf[tauEstimate + 1];

    // Parabolic interpolation
    const adjustment = (s2 - s0) / (2 * (2 * s1 - s2 - s0));
    if (Math.abs(adjustment) < 1) {
      betterTau = tauEstimate + adjustment;
    } else {
      betterTau = tauEstimate;
    }
  } else {
    betterTau = tauEstimate;
  }

  // Convert tau to frequency
  const frequency = sampleRate / betterTau;

  return frequency;
}

class PitchDetectorClass {
  private static instance: PitchDetectorClass | null = null;

  private recorder: AudioRecorder | null = null;

  private config: PitchDetectorConfig = { ...DEFAULT_PITCH_DETECTOR_CONFIG };
  private state: PitchDetectorState = 'idle';

  private onPitchDetected: PitchDetectedCallback | null = null;
  private onError: PitchDetectorErrorCallback | null = null;
  private onStateChange: PitchDetectorStateCallback | null = null;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): PitchDetectorClass {
    if (!PitchDetectorClass.instance) {
      PitchDetectorClass.instance = new PitchDetectorClass();
    }
    return PitchDetectorClass.instance;
  }

  /**
   * Get current state
   */
  public getState(): PitchDetectorState {
    return this.state;
  }

  /**
   * Update configuration
   */
  public setConfig(config: Partial<PitchDetectorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): PitchDetectorConfig {
    return { ...this.config };
  }

  /**
   * Set A4 reference frequency
   */
  public setA4Frequency(frequency: number): void {
    this.config.a4Frequency = frequency;
  }

  /**
   * Start listening for pitch
   */
  public async startListening(
    onPitchDetected: PitchDetectedCallback,
    onError?: PitchDetectorErrorCallback,
    onStateChange?: PitchDetectorStateCallback
  ): Promise<void> {
    if (this.state === 'listening') {
      return;
    }

    this.onPitchDetected = onPitchDetected;
    this.onError = onError || null;
    this.onStateChange = onStateChange || null;

    this.setState('requesting');

    try {
      // Request microphone permission on Android
      // iOS handles permission automatically when AudioRecorder starts
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Scale Scholar needs microphone access to detect pitch.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error('Microphone permission not granted');
        }
      }

      // Create audio recorder
      this.recorder = new AudioRecorder({
        sampleRate: this.config.sampleRate,
        bufferLengthInSamples: this.config.bufferSize,
      });

      // Set up audio callback
      this.recorder.onAudioReady((event) => {
        if (this.state !== 'listening') {
          return;
        }

        // Get raw audio data from buffer
        const audioData = event.buffer.getChannelData(0);

        // Detect pitch using YIN algorithm
        const frequency = detectPitchYIN(audioData, this.config.sampleRate);

        // If pitch detected and within valid range, create result
        if (
          frequency !== null &&
          frequency >= this.config.minFrequency &&
          frequency <= this.config.maxFrequency
        ) {
          const result = this.createPitchResult(frequency);
          this.onPitchDetected?.(result);
        }
      });

      // Start recording
      this.recorder.start();
      this.setState('listening');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to start pitch detection';
      this.setState('error');
      this.onError?.(errorMessage);
    }
  }

  /**
   * Stop listening
   */
  public stopListening(): void {
    // Update state immediately for responsive UI
    this.setState('idle');

    // Cleanup recorder asynchronously to avoid blocking UI
    if (this.recorder) {
      const recorderToCleanup = this.recorder;
      this.recorder = null;

      // Run cleanup in next tick to not block UI
      setTimeout(() => {
        try {
          recorderToCleanup.stop();
          recorderToCleanup.disconnect();
        } catch {
          // Ignore cleanup errors
        }
      }, 0);
    }
  }

  /**
   * Check if currently listening
   */
  public isListening(): boolean {
    return this.state === 'listening';
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    this.stopListening();
    this.onPitchDetected = null;
    this.onError = null;
    this.onStateChange = null;
  }

  /**
   * Set state and notify callback
   */
  private setState(newState: PitchDetectorState): void {
    this.state = newState;
    this.onStateChange?.(newState);
  }

  /**
   * Create PitchResult from detected frequency
   */
  private createPitchResult(frequency: number): PitchResult {
    return {
      frequency,
      midiNote: frequencyToMidi(frequency, this.config.a4Frequency),
      noteName: frequencyToNoteName(frequency, this.config.a4Frequency),
      cents: frequencyToCents(frequency, this.config.a4Frequency),
      timestamp: Date.now(),
    };
  }
}

/**
 * Singleton instance export
 */
export const PitchDetector = PitchDetectorClass.getInstance();
