import { Audio } from 'expo-av';
import { Synthesizer, ADSREnvelope } from '../../types/audio';

const DEFAULT_ENVELOPE: ADSREnvelope = {
  attack: 0.01,
  decay: 0.1,
  sustain: 0.7,
  release: 0.2,
};

/**
 * Simple sine wave synthesizer using Web Audio API
 * Falls back gracefully on platforms without Web Audio support
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
   * Initialize audio context (must be called after user interaction)
   */
  private async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Request audio focus on mobile
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Check for Web Audio API support
      if (typeof AudioContext !== 'undefined') {
        this.audioContext = new AudioContext();
        this.isInitialized = true;
        return true;
      } else if (typeof (window as any).webkitAudioContext !== 'undefined') {
        this.audioContext = new (window as any).webkitAudioContext();
        this.isInitialized = true;
        return true;
      }

      console.warn('Web Audio API not available');
      return false;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }

  /**
   * Resume audio context if suspended (required after user interaction)
   */
  private async ensureContextRunning(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
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
    gain.setValueAtTime(sustain, releaseStart);

    // Release: ramp to 0
    gain.linearRampToValueAtTime(0, startTime + duration);
  }

  async playNote(frequency: number, duration: number): Promise<void> {
    const initialized = await this.initialize();
    if (!initialized || !this.audioContext) {
      console.warn('Audio not available, skipping playback');
      return;
    }

    await this.ensureContextRunning();

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

    // Clean up after note ends
    oscillator.onended = () => {
      const oscIndex = this.activeOscillators.indexOf(oscillator);
      if (oscIndex > -1) this.activeOscillators.splice(oscIndex, 1);
      const gainIndex = this.activeGains.indexOf(gainNode);
      if (gainIndex > -1) this.activeGains.splice(gainIndex, 1);
      oscillator.disconnect();
      gainNode.disconnect();
    };

    // Return promise that resolves when note is done
    return new Promise((resolve) => {
      setTimeout(resolve, duration * 1000);
    });
  }

  async playChord(frequencies: number[], duration: number): Promise<void> {
    const initialized = await this.initialize();
    if (!initialized || !this.audioContext) {
      console.warn('Audio not available, skipping playback');
      return;
    }

    await this.ensureContextRunning();

    // Play all notes simultaneously
    const promises = frequencies.map((freq) => {
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

      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
        chordGain.disconnect();
      };

      return new Promise<void>((resolve) => {
        setTimeout(resolve, duration * 1000);
      });
    });

    await Promise.all(promises);
  }

  stop(): void {
    const now = this.audioContext?.currentTime ?? 0;

    // Quick fade out to avoid clicks
    this.activeGains.forEach((gain) => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);
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
