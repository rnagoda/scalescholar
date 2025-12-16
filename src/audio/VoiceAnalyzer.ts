/**
 * Voice Analyzer Module
 *
 * Extends pitch detection with amplitude (volume) analysis for voice training.
 * Uses the same YIN pitch detection as PitchDetector but adds RMS amplitude
 * calculation for tracking voice dynamics.
 */

import { AudioRecorder, AudioManager } from 'react-native-audio-api';
import { Platform, PermissionsAndroid } from 'react-native';
import {
  VoiceAnalysisResult,
  AmplitudeResult,
  VoiceAnalyzerState,
  VoiceAnalysisCallback,
  DEFAULT_VOICE_THRESHOLDS,
} from '../types/voiceAnalyzer';
import { PitchResult, PitchDetectorConfig, DEFAULT_PITCH_DETECTOR_CONFIG } from '../types/pitchDetector';
import {
  frequencyToMidi,
  frequencyToNoteName,
  frequencyToCents,
} from '../utils/music';

/**
 * YIN Pitch Detection Algorithm (same as PitchDetector)
 */
const YIN_WINDOW_SIZE = 1024;
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

  const windowSize = Math.min(YIN_WINDOW_SIZE, Math.floor(audioData.length / 2));
  if (windowSize < 64) return null;

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

  // Step 2: Calculate CMNDF
  cmndf[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau < windowSize; tau++) {
    runningSum += difference[tau];
    cmndf[tau] = difference[tau] / (runningSum / tau);
  }

  // Step 3: Find first tau below threshold
  let tauEstimate = -1;
  for (let tau = 2; tau < windowSize; tau++) {
    if (cmndf[tau] < threshold) {
      while (tau + 1 < windowSize && cmndf[tau + 1] < cmndf[tau]) {
        tau++;
      }
      tauEstimate = tau;
      break;
    }
  }

  if (tauEstimate === -1) return null;

  // Step 4: Parabolic interpolation
  let betterTau: number;
  if (tauEstimate > 0 && tauEstimate < windowSize - 1) {
    const s0 = cmndf[tauEstimate - 1];
    const s1 = cmndf[tauEstimate];
    const s2 = cmndf[tauEstimate + 1];
    const denominator = 2 * (2 * s1 - s2 - s0);
    if (denominator !== 0) {
      const adjustment = (s2 - s0) / denominator;
      betterTau = Math.abs(adjustment) < 1 ? tauEstimate + adjustment : tauEstimate;
    } else {
      betterTau = tauEstimate;
    }
  } else {
    betterTau = tauEstimate;
  }

  return sampleRate / betterTau;
}

/**
 * Calculate RMS (Root Mean Square) amplitude from audio samples
 * @param buffer Audio sample buffer
 * @returns RMS value (0-1 normalized)
 */
export function calculateRMS(buffer: Float32Array): number {
  if (buffer.length === 0) return 0;

  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}

/**
 * Convert RMS to decibels
 * @param rms RMS value (0-1)
 * @returns Decibel value (typically -60 to 0)
 */
export function rmsToDb(rms: number): number {
  // Clamp to avoid -Infinity
  const clampedRms = Math.max(rms, 0.0001);
  return 20 * Math.log10(clampedRms);
}

/**
 * Calculate peak amplitude from audio samples
 * @param buffer Audio sample buffer
 * @returns Peak value (0-1)
 */
export function calculatePeak(buffer: Float32Array): number {
  if (buffer.length === 0) return 0;

  let peak = 0;
  for (let i = 0; i < buffer.length; i++) {
    const abs = Math.abs(buffer[i]);
    if (abs > peak) peak = abs;
  }
  return peak;
}

/**
 * Calculate amplitude result from audio buffer
 */
function calculateAmplitude(buffer: Float32Array): AmplitudeResult {
  const rms = calculateRMS(buffer);
  return {
    rms,
    db: rmsToDb(rms),
    peak: calculatePeak(buffer),
  };
}

/**
 * Voice Analyzer Singleton Class
 */
class VoiceAnalyzerClass {
  private static instance: VoiceAnalyzerClass | null = null;

  private recorder: AudioRecorder | null = null;
  private config: PitchDetectorConfig = { ...DEFAULT_PITCH_DETECTOR_CONFIG };
  private state: VoiceAnalyzerState = 'idle';
  private sessionId: number = 0;

  // Input sensitivity (software gain multiplier)
  private inputSensitivity: number = 1.0;

  // Decoupled processing
  private latestAudioData: Float32Array | null = null;
  private processingTimer: ReturnType<typeof setInterval> | null = null;
  private static readonly PROCESS_INTERVAL_MS = 50;

  // Callbacks
  private onAnalysis: VoiceAnalysisCallback | null = null;
  private onError: ((error: string) => void) | null = null;
  private onStateChange: ((state: VoiceAnalyzerState) => void) | null = null;

  private constructor() {}

  public static getInstance(): VoiceAnalyzerClass {
    if (!VoiceAnalyzerClass.instance) {
      VoiceAnalyzerClass.instance = new VoiceAnalyzerClass();
    }
    return VoiceAnalyzerClass.instance;
  }

  public getState(): VoiceAnalyzerState {
    return this.state;
  }

  public setConfig(config: Partial<PitchDetectorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public getConfig(): PitchDetectorConfig {
    return { ...this.config };
  }

  public setA4Frequency(frequency: number): void {
    this.config.a4Frequency = frequency;
  }

  public setInputSensitivity(sensitivity: number): void {
    // Clamp to valid range (0.5 - 2.0)
    this.inputSensitivity = Math.max(0.5, Math.min(2.0, sensitivity));
  }

  public getInputSensitivity(): number {
    return this.inputSensitivity;
  }

  /**
   * Start listening for voice (pitch + amplitude)
   */
  public async startListening(
    onAnalysis: VoiceAnalysisCallback,
    onError?: (error: string) => void,
    onStateChange?: (state: VoiceAnalyzerState) => void
  ): Promise<void> {
    if (this.state === 'listening') {
      return;
    }

    this.onAnalysis = onAnalysis;
    this.onError = onError || null;
    this.onStateChange = onStateChange || null;

    this.setState('requesting');

    try {
      // Platform-specific setup
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Scale Scholar needs microphone access for voice training.',
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
          iosMode: 'measurement',
          iosOptions: ['defaultToSpeaker', 'allowBluetooth'],
        });
      }

      const currentSession = ++this.sessionId;
      this.latestAudioData = null;

      this.recorder = new AudioRecorder({
        sampleRate: this.config.sampleRate,
        bufferLengthInSamples: 2048,
      });

      this.recorder.onAudioReady((event) => {
        if (currentSession !== this.sessionId) return;
        this.latestAudioData = event.buffer.getChannelData(0);
      });

      // Processing timer
      this.processingTimer = setInterval(() => {
        if (currentSession !== this.sessionId) return;

        const audioData = this.latestAudioData;
        if (!audioData) return;

        this.latestAudioData = null;

        // Apply software gain for amplitude calculation if sensitivity != 1.0
        let amplitudeData = audioData;
        if (this.inputSensitivity !== 1.0) {
          amplitudeData = new Float32Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            amplitudeData[i] = audioData[i] * this.inputSensitivity;
          }
        }

        // Calculate amplitude with gain applied
        const amplitude = calculateAmplitude(amplitudeData);

        // Always attempt pitch detection (threshold check moved to consumers)
        let pitch: PitchResult | null = null;
        const frequency = detectPitchYIN(audioData, this.config.sampleRate);

        if (currentSession !== this.sessionId) return;

        if (
          frequency !== null &&
          frequency >= this.config.minFrequency &&
          frequency <= this.config.maxFrequency
        ) {
          pitch = this.createPitchResult(frequency);
        }

        if (currentSession !== this.sessionId) return;

        // Always emit analysis result (amplitude is always available)
        const result: VoiceAnalysisResult = {
          pitch,
          amplitude,
          timestamp: Date.now(),
        };

        this.onAnalysis?.(result);
      }, VoiceAnalyzerClass.PROCESS_INTERVAL_MS);

      this.recorder.start();
      this.setState('listening');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to start voice analyzer';
      this.setState('error');
      this.onError?.(errorMessage);
    }
  }

  /**
   * Stop listening
   */
  public stopListening(): void {
    this.sessionId++;
    this.setState('idle');
    this.latestAudioData = null;

    if (this.processingTimer) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
    }

    if (this.recorder) {
      const recorderToCleanup = this.recorder;
      this.recorder = null;

      try {
        recorderToCleanup.stop();
        recorderToCleanup.disconnect();
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  public isListening(): boolean {
    return this.state === 'listening';
  }

  public dispose(): void {
    this.stopListening();
    this.onAnalysis = null;
    this.onError = null;
    this.onStateChange = null;
  }

  private setState(newState: VoiceAnalyzerState): void {
    this.state = newState;
    this.onStateChange?.(newState);
  }

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
export const VoiceAnalyzer = VoiceAnalyzerClass.getInstance();

/**
 * Calculate accuracy from detected frequency vs target
 * @param targetFrequency Target frequency in Hz
 * @param detectedFrequency Detected frequency in Hz
 * @returns Accuracy 0-100 (100 = perfect, 0 = 50+ cents off)
 */
export function calculatePitchAccuracy(
  targetFrequency: number,
  detectedFrequency: number
): number {
  const cents = Math.abs(1200 * Math.log2(detectedFrequency / targetFrequency));
  // Perfect = 100, ±50 cents = 0
  return Math.max(0, 100 - cents * 2);
}

/**
 * Check if pitch is within target range
 * @param targetFrequency Target frequency in Hz
 * @param detectedFrequency Detected frequency in Hz
 * @param thresholdCents Cents threshold (default 10)
 * @returns True if within threshold
 */
export function isPitchOnTarget(
  targetFrequency: number,
  detectedFrequency: number,
  thresholdCents: number = DEFAULT_VOICE_THRESHOLDS.onTargetCents
): boolean {
  const cents = Math.abs(1200 * Math.log2(detectedFrequency / targetFrequency));
  return cents <= thresholdCents;
}
