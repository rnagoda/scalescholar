/**
 * PitchDetector Module
 *
 * Singleton class for real-time pitch detection from microphone input.
 * Uses react-native-audio-api AudioRecorder for native microphone access
 * and pitchfinder library for YIN pitch detection algorithm.
 */

import { AudioRecorder } from 'react-native-audio-api';
import Pitchfinder from 'pitchfinder';
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

class PitchDetectorClass {
  private static instance: PitchDetectorClass | null = null;

  private recorder: AudioRecorder | null = null;
  private detector: ReturnType<typeof Pitchfinder.YIN> | null = null;

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
      // Initialize YIN detector with current sample rate
      this.detector = Pitchfinder.YIN({
        sampleRate: this.config.sampleRate,
      });

      // Create audio recorder
      this.recorder = new AudioRecorder({
        sampleRate: this.config.sampleRate,
        bufferLengthInSamples: this.config.bufferSize,
      });

      // Set up audio callback
      this.recorder.onAudioReady((event) => {
        if (this.state !== 'listening' || !this.detector) {
          return;
        }

        // Get raw audio data from buffer
        const audioData = event.buffer.getChannelData(0);

        // Detect pitch using YIN algorithm
        const frequency = this.detector(audioData);

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
    if (this.recorder) {
      this.recorder.stop();
      this.recorder.disconnect();
      this.recorder = null;
    }

    this.detector = null;
    this.setState('idle');
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
