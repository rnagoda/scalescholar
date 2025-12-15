import { AudioContext, OscillatorNode, GainNode } from 'react-native-audio-api';
import { Synthesizer, ADSREnvelope } from '../../types/audio';

const DEFAULT_ENVELOPE: ADSREnvelope = {
  attack: 0.01,
  decay: 0.1,
  sustain: 0.7,
  release: 0.2,
};

/**
 * Simple sine wave synthesizer using react-native-audio-api
 * Provides Web Audio API compatible synthesis on iOS and Android
 */
export class SineSynth implements Synthesizer {
  private audioContext: AudioContext | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeGains: GainNode[] = [];
  private envelope: ADSREnvelope;
  private isInitialized = false;

  constructor(envelope: ADSREnvelope = DEFAULT_ENVELOPE) {
    this.envelope = envelope;
  }

  /**
   * Initialize audio context (lazy initialization)
   */
  private initialize(): boolean {
    if (this.isInitialized && this.audioContext) return true;

    try {
      this.audioContext = new AudioContext();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  }

  /**
   * Apply ADSR envelope to a gain node
   */
  private applyEnvelope(
    gainNode: GainNode,
    startTime: number,
    duration: number
  ): void {
    const { attack, decay, sustain, release } = this.envelope;
    const gain = gainNode.gain;

    // Start at 0
    gain.setValueAtTime(0, startTime);

    // Attack: ramp to 1
    gain.linearRampToValueAtTime(1, startTime + attack);

    // Decay: ramp to sustain level
    gain.linearRampToValueAtTime(sustain, startTime + attack + decay);

    // Hold at sustain level until release
    const releaseStart = startTime + duration - release;
    gain.setValueAtTime(sustain, Math.max(releaseStart, startTime + attack + decay));

    // Release: ramp to 0
    gain.linearRampToValueAtTime(0, startTime + duration);
  }

  async playNote(frequency: number, duration: number): Promise<void> {
    const initialized = this.initialize();
    if (!initialized || !this.audioContext) {
      console.warn('Audio not available, skipping playback');
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const startTime = this.audioContext.currentTime;
    this.applyEnvelope(gainNode, startTime, duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    this.activeOscillators.push(oscillator);
    this.activeGains.push(gainNode);

    // Return promise that resolves when note is done
    return new Promise((resolve) => {
      setTimeout(() => {
        // Clean up
        const oscIndex = this.activeOscillators.indexOf(oscillator);
        if (oscIndex > -1) this.activeOscillators.splice(oscIndex, 1);
        const gainIndex = this.activeGains.indexOf(gainNode);
        if (gainIndex > -1) this.activeGains.splice(gainIndex, 1);
        resolve();
      }, duration * 1000);
    });
  }

  async playChord(frequencies: number[], duration: number): Promise<void> {
    const initialized = this.initialize();
    if (!initialized || !this.audioContext) {
      console.warn('Audio not available, skipping playback');
      return;
    }

    // Play all notes simultaneously
    const playPromises = frequencies.map((freq) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);

      // Reduce volume for chords to prevent clipping
      const chordGain = this.audioContext!.createGain();
      chordGain.gain.setValueAtTime(1 / frequencies.length, this.audioContext!.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(chordGain);
      chordGain.connect(this.audioContext!.destination);

      const startTime = this.audioContext!.currentTime;
      this.applyEnvelope(gainNode, startTime, duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      this.activeOscillators.push(oscillator);
      this.activeGains.push(gainNode);

      return new Promise<void>((resolve) => {
        setTimeout(resolve, duration * 1000);
      });
    });

    await Promise.all(playPromises);
  }

  stop(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;

    // Quick fade out to avoid clicks
    this.activeGains.forEach((gain) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
      } catch {
        // Ignore errors
      }
    });

    // Stop oscillators after fade
    setTimeout(() => {
      this.activeOscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch {
          // Already stopped
        }
      });
      this.activeOscillators = [];
      this.activeGains = [];
    }, 50);
  }

  dispose(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isInitialized = false;
  }
}
