import { AudioContext, OscillatorNode, GainNode } from 'react-native-audio-api';
import { Synthesizer, ADSREnvelope } from '../../types/audio';

const PIANO_ENVELOPE: ADSREnvelope = {
  attack: 0.005,
  decay: 0.3,
  sustain: 0.4,
  release: 0.4,
};

/**
 * Piano-like synthesizer using additive synthesis
 * Creates a richer tone by combining multiple harmonics
 */
export class PianoSynth implements Synthesizer {
  private audioContext: AudioContext | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeGains: GainNode[] = [];
  private envelope: ADSREnvelope;
  private isInitialized = false;

  // Harmonic series for piano-like tone
  // Each harmonic has [relative frequency multiplier, relative amplitude]
  private harmonics: [number, number][] = [
    [1, 1.0],      // Fundamental
    [2, 0.5],      // 2nd harmonic
    [3, 0.25],     // 3rd harmonic
    [4, 0.125],    // 4th harmonic
    [5, 0.0625],   // 5th harmonic
    [6, 0.03],     // 6th harmonic
  ];

  constructor(envelope: ADSREnvelope = PIANO_ENVELOPE) {
    this.envelope = envelope;
  }

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

  private applyEnvelope(
    gainNode: GainNode,
    startTime: number,
    duration: number
  ): void {
    const { attack, decay, sustain, release } = this.envelope;
    const gain = gainNode.gain;

    gain.setValueAtTime(0, startTime);
    gain.linearRampToValueAtTime(1, startTime + attack);
    gain.linearRampToValueAtTime(sustain, startTime + attack + decay);

    const releaseStart = startTime + duration - release;
    gain.setValueAtTime(sustain, Math.max(releaseStart, startTime + attack + decay));
    gain.linearRampToValueAtTime(0.001, startTime + duration);
  }

  async playNote(frequency: number, duration: number): Promise<void> {
    const initialized = this.initialize();
    if (!initialized || !this.audioContext) {
      console.warn('Audio not available, skipping playback');
      return;
    }

    const startTime = this.audioContext.currentTime;
    const masterGain = this.audioContext.createGain();
    masterGain.gain.setValueAtTime(0.3, startTime); // Overall volume
    masterGain.connect(this.audioContext.destination);
    this.activeGains.push(masterGain);

    // Create oscillators for each harmonic
    this.harmonics.forEach(([freqMultiplier, amplitude]) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(
        frequency * freqMultiplier,
        startTime
      );

      // Individual harmonic volume
      gainNode.gain.setValueAtTime(amplitude, startTime);

      oscillator.connect(gainNode);
      gainNode.connect(masterGain);

      this.applyEnvelope(gainNode, startTime, duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      this.activeOscillators.push(oscillator);
      this.activeGains.push(gainNode);
    });

    return new Promise((resolve) => {
      setTimeout(resolve, duration * 1000);
    });
  }

  async playChord(frequencies: number[], duration: number): Promise<void> {
    const initialized = this.initialize();
    if (!initialized || !this.audioContext) {
      console.warn('Audio not available, skipping playback');
      return;
    }

    const startTime = this.audioContext.currentTime;
    const masterGain = this.audioContext.createGain();
    // Reduce volume for chords
    masterGain.gain.setValueAtTime(0.25 / frequencies.length, startTime);
    masterGain.connect(this.audioContext.destination);
    this.activeGains.push(masterGain);

    frequencies.forEach((frequency) => {
      this.harmonics.forEach(([freqMultiplier, amplitude]) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(
          frequency * freqMultiplier,
          startTime
        );

        gainNode.gain.setValueAtTime(amplitude, startTime);

        oscillator.connect(gainNode);
        gainNode.connect(masterGain);

        this.applyEnvelope(gainNode, startTime, duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);

        this.activeOscillators.push(oscillator);
        this.activeGains.push(gainNode);
      });
    });

    return new Promise((resolve) => {
      setTimeout(resolve, duration * 1000);
    });
  }

  stop(): void {
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // Already stopped
      }
    });
    this.activeOscillators = [];
    this.activeGains = [];
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
