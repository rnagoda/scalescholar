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
 * YIN Pitch Detection Algorithm (Optimized)
 *
 * Implementation based on the paper:
 * "YIN, a fundamental frequency estimator for speech and music"
 * by Alain de Cheveigné and Hideki Kawahara
 *
 * Optimized to reduce computation by:
 * - Using a smaller analysis window
 * - Early exit when pitch is found
 */
function detectPitchYIN(
  audioData: Float32Array,
  sampleRate: number,
  threshold: number = 0.15
): number | null {
  // Use smaller window for faster processing
  const maxLag = Math.min(Math.floor(audioData.length / 2), 1024);

  // Step 1 & 2 combined: Calculate difference and CMNDF on the fly
  let runningSum = 0;

  for (let tau = 1; tau < maxLag; tau++) {
    // Calculate difference for this tau
    let sum = 0;
    for (let i = 0; i < maxLag; i++) {
      const delta = audioData[i] - audioData[i + tau];
      sum += delta * delta;
    }

    runningSum += sum;
    const cmndf = sum / (runningSum / tau);

    // Step 3: Check threshold and find local minimum
    if (tau > 1 && cmndf < threshold) {
      // Look ahead for local minimum
      let minTau = tau;
      let minCmndf = cmndf;

      for (let t = tau + 1; t < Math.min(tau + 10, maxLag); t++) {
        let nextSum = 0;
        for (let i = 0; i < maxLag; i++) {
          const delta = audioData[i] - audioData[i + t];
          nextSum += delta * delta;
        }
        runningSum += nextSum;
        const nextCmndf = nextSum / (runningSum / t);

        if (nextCmndf < minCmndf) {
          minCmndf = nextCmndf;
          minTau = t;
        } else {
          break; // Found local minimum
        }
      }

      // Convert tau to frequency
      return sampleRate / minTau;
    }
  }

  return null;
}

class PitchDetectorClass {
  private static instance: PitchDetectorClass | null = null;

  private recorder: AudioRecorder | null = null;

  private config: PitchDetectorConfig = { ...DEFAULT_PITCH_DETECTOR_CONFIG };
  private state: PitchDetectorState = 'idle';

  // Session tracking for immediate callback rejection
  private sessionId: number = 0;

  // Throttling - only process if not already processing
  private isProcessing: boolean = false;

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

      // Increment session ID to invalidate any stale callbacks
      const currentSession = ++this.sessionId;
      this.isProcessing = false;

      // Create audio recorder with smaller buffer for lower latency
      this.recorder = new AudioRecorder({
        sampleRate: this.config.sampleRate,
        bufferLengthInSamples: 2048, // Smaller buffer = lower latency
      });

      // Set up audio callback
      this.recorder.onAudioReady((event) => {
        // Immediately reject if session changed (stopped)
        if (currentSession !== this.sessionId) {
          return;
        }

        // Skip if already processing (drop frames to prevent backlog)
        if (this.isProcessing) {
          return;
        }

        // Double-check state
        if (this.state !== 'listening') {
          return;
        }

        this.isProcessing = true;

        try {
          // Get raw audio data from buffer
          const audioData = event.buffer.getChannelData(0);

          // Detect pitch using YIN algorithm
          const frequency = detectPitchYIN(audioData, this.config.sampleRate);

          // Check session again after processing (might have stopped during)
          if (currentSession !== this.sessionId) {
            return;
          }

          // If pitch detected and within valid range, create result
          if (
            frequency !== null &&
            frequency >= this.config.minFrequency &&
            frequency <= this.config.maxFrequency
          ) {
            const result = this.createPitchResult(frequency);
            this.onPitchDetected?.(result);
          }
        } finally {
          this.isProcessing = false;
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
    // Increment session ID FIRST to immediately invalidate all callbacks
    this.sessionId++;

    // Update state immediately for responsive UI
    this.setState('idle');

    // Reset processing flag
    this.isProcessing = false;

    // Cleanup recorder
    if (this.recorder) {
      const recorderToCleanup = this.recorder;
      this.recorder = null;

      // Stop synchronously for immediate effect
      try {
        recorderToCleanup.stop();
        recorderToCleanup.disconnect();
      } catch {
        // Ignore cleanup errors
      }
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
