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

  private async initialize(): Promise<boolean> {
    // If we have a context, check its state
    if (this.audioContext) {
      const state = this.audioContext.state;

      if (state === 'running') {
        return true;
      }

      if (state === 'suspended') {
        try {
          await this.audioContext.resume();
          return true;
        } catch (error) {
          console.warn('Failed to resume audio context, recreating:', error);
          // Fall through to recreate
        }
      }

      // State is 'closed' or resume failed - need to recreate
      this.audioContext = null;
      this.isInitialized = false;
    }

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
   * Force reinitialize audio context (useful after Bluetooth/audio route changes)
   */
  async reinitialize(): Promise<boolean> {
    this.dispose();
    return this.initialize();
  }

  /**
   * Apply ADSR envelope to a gain node
   * Velocity affects attack time (higher velocity = faster attack for more percussive sound)
   */
  private applyEnvelope(
    gainNode: GainNode,
    startTime: number,
    duration: number,
    velocity: number = 0.7
  ): void {
    const { attack, decay, sustain, release } = this.envelope;
    const gain = gainNode.gain;

    // Faster attack for higher velocities (more percussive piano strike)
    const velocityAttack = attack * (1.5 - velocity * 0.5);

    gain.setValueAtTime(0, startTime);
    gain.linearRampToValueAtTime(1, startTime + velocityAttack);
    gain.linearRampToValueAtTime(sustain, startTime + velocityAttack + decay);

    const releaseStart = startTime + duration - release;
    gain.setValueAtTime(sustain, Math.max(releaseStart, startTime + velocityAttack + decay));
    gain.linearRampToValueAtTime(0.001, startTime + duration);
  }

  async playNote(frequency: number, duration: number, velocity: number = 0.7): Promise<void> {
    const initialized = await this.initialize();
    if (!initialized || !this.audioContext) {
      console.warn('Audio not available, skipping playback');
      return;
    }

    // Clamp velocity to valid range
    const clampedVelocity = Math.max(0, Math.min(1, velocity));

    const startTime = this.audioContext.currentTime;
    const masterGain = this.audioContext.createGain();
    // Apply velocity to overall volume (base 0.3 * velocity)
    masterGain.gain.setValueAtTime(0.4 * clampedVelocity, startTime);
    masterGain.connect(this.audioContext.destination);
    this.activeGains.push(masterGain);

    // Higher velocity = more upper harmonics (brighter sound)
    const harmonicsToUse = clampedVelocity > 0.5
      ? this.harmonics
      : this.harmonics.slice(0, 4); // Fewer harmonics for softer sounds

    // Create oscillators for each harmonic
    harmonicsToUse.forEach(([freqMultiplier, amplitude]) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(
        frequency * freqMultiplier,
        startTime
      );

      // Individual harmonic volume - boost higher harmonics for louder velocities
      const harmonicBoost = freqMultiplier > 2 ? (clampedVelocity * 0.5) : 1;
      gainNode.gain.setValueAtTime(amplitude * harmonicBoost, startTime);

      oscillator.connect(gainNode);
      gainNode.connect(masterGain);

      this.applyEnvelope(gainNode, startTime, duration, clampedVelocity);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      this.activeOscillators.push(oscillator);
      this.activeGains.push(gainNode);
    });

    return new Promise((resolve) => {
      setTimeout(resolve, duration * 1000);
    });
  }

  async playChord(frequencies: number[], duration: number, velocity: number = 0.7): Promise<void> {
    const initialized = await this.initialize();
    if (!initialized || !this.audioContext) {
      console.warn('Audio not available, skipping playback');
      return;
    }

    // Clamp velocity to valid range
    const clampedVelocity = Math.max(0, Math.min(1, velocity));

    const startTime = this.audioContext.currentTime;
    const masterGain = this.audioContext.createGain();
    // Reduce volume for chords, apply velocity
    masterGain.gain.setValueAtTime((0.3 * clampedVelocity) / frequencies.length, startTime);
    masterGain.connect(this.audioContext.destination);
    this.activeGains.push(masterGain);

    // Higher velocity = more upper harmonics (brighter sound)
    const harmonicsToUse = clampedVelocity > 0.5
      ? this.harmonics
      : this.harmonics.slice(0, 4);

    frequencies.forEach((frequency) => {
      harmonicsToUse.forEach(([freqMultiplier, amplitude]) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(
          frequency * freqMultiplier,
          startTime
        );

        const harmonicBoost = freqMultiplier > 2 ? (clampedVelocity * 0.5) : 1;
        gainNode.gain.setValueAtTime(amplitude * harmonicBoost, startTime);

        oscillator.connect(gainNode);
        gainNode.connect(masterGain);

        this.applyEnvelope(gainNode, startTime, duration, clampedVelocity);

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
