/**
 * PitchDetector Module
 *
 * Singleton class for real-time pitch detection from microphone input.
 * Uses react-native-audio-api AudioRecorder for native microphone access
 * and a custom YIN pitch detection algorithm implementation.
 */

import { AudioRecorder, AudioManager } from 'react-native-audio-api';
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
 * Uses a fixed analysis window size for consistent performance.
 * Window of 1024 samples at 44100Hz can detect down to ~43Hz (below C2).
 */

// Fixed window size for consistent, fast processing
const YIN_WINDOW_SIZE = 1024;

// Pre-allocate buffers to avoid GC during audio processing
let differenceBuffer: Float32Array | null = null;
let cmndfBuffer: Float32Array | null = null;

function ensureBuffers(): void {
  if (!differenceBuffer || differenceBuffer.length !== YIN_WINDOW_SIZE) {
    differenceBuffer = new Float32Array(YIN_WINDOW_SIZE);
    cmndfBuffer = new Float32Array(YIN_WINDOW_SIZE);
  }
}

function detectPitchYIN(
  audioData: Float32Array,
  sampleRate: number,
  threshold: number = 0.15
): number | null {
  ensureBuffers();
  const difference = differenceBuffer!;
  const cmndf = cmndfBuffer!;

  // Use fixed window size, but ensure we have enough data
  const windowSize = Math.min(YIN_WINDOW_SIZE, Math.floor(audioData.length / 2));
  if (windowSize < 64) return null; // Not enough data

  // Step 1: Calculate the difference function
  difference[0] = 0;
  for (let tau = 1; tau < windowSize; tau++) {
    let sum = 0;
    for (let i = 0; i < windowSize; i++) {
      const delta = audioData[i] - audioData[i + tau];
      sum += delta * delta;
    }
    difference[tau] = sum;
  }

  // Step 2: Calculate the cumulative mean normalized difference function (CMNDF)
  cmndf[0] = 1;
  let runningSum = 0;

  for (let tau = 1; tau < windowSize; tau++) {
    runningSum += difference[tau];
    cmndf[tau] = difference[tau] / (runningSum / tau);
  }

  // Step 3: Find the first tau that gives a minimum below threshold
  let tauEstimate = -1;
  for (let tau = 2; tau < windowSize; tau++) {
    if (cmndf[tau] < threshold) {
      // Find the local minimum
      while (tau + 1 < windowSize && cmndf[tau + 1] < cmndf[tau]) {
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
  if (tauEstimate > 0 && tauEstimate < windowSize - 1) {
    const s0 = cmndf[tauEstimate - 1];
    const s1 = cmndf[tauEstimate];
    const s2 = cmndf[tauEstimate + 1];

    // Parabolic interpolation
    const denominator = 2 * (2 * s1 - s2 - s0);
    if (denominator !== 0) {
      const adjustment = (s2 - s0) / denominator;
      if (Math.abs(adjustment) < 1) {
        betterTau = tauEstimate + adjustment;
      } else {
        betterTau = tauEstimate;
      }
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

  // Session tracking for immediate callback rejection
  private sessionId: number = 0;

  // Decoupled processing: store latest buffer and process on timer
  private latestAudioData: Float32Array | null = null;
  private processingTimer: ReturnType<typeof setInterval> | null = null;
  private static readonly PROCESS_INTERVAL_MS = 50; // Process 20 times per second

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
      // Platform-specific setup
      if (Platform.OS === 'android') {
        // Request microphone permission on Android
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
      } else if (Platform.OS === 'ios') {
        // iOS requires audio session to be configured for recording
        AudioManager.setAudioSessionOptions({
          iosCategory: 'playAndRecord',
          iosMode: 'measurement', // Best for pitch detection
          iosOptions: ['defaultToSpeaker', 'allowBluetooth'],
        });
      }

      // Increment session ID to invalidate any stale callbacks
      const currentSession = ++this.sessionId;
      this.latestAudioData = null;

      // Create audio recorder - buffer needs to be 2x YIN window size minimum
      // Using 2048 samples = ~46ms at 44100Hz, which balances latency vs detection
      this.recorder = new AudioRecorder({
        sampleRate: this.config.sampleRate,
        bufferLengthInSamples: 2048,
      });

      // Audio callback: just store the latest buffer (fast, non-blocking)
      this.recorder.onAudioReady((event) => {
        // Immediately reject if session changed (stopped)
        if (currentSession !== this.sessionId) {
          return;
        }
        // Just store the latest audio data - overwrites previous
        this.latestAudioData = event.buffer.getChannelData(0);
      });

      // Processing timer: runs independently at fixed rate
      this.processingTimer = setInterval(() => {
        // Check if still valid session
        if (currentSession !== this.sessionId) {
          return;
        }

        // Skip if no audio data yet
        const audioData = this.latestAudioData;
        if (!audioData) {
          return;
        }

        // Clear the buffer so we don't reprocess same data
        this.latestAudioData = null;

        // Detect pitch using YIN algorithm
        const frequency = detectPitchYIN(audioData, this.config.sampleRate);

        // Check session again after processing
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
      }, PitchDetectorClass.PROCESS_INTERVAL_MS);

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

    // Clear audio buffer
    this.latestAudioData = null;

    // Stop processing timer
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
    }

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
