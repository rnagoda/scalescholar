import { Audio } from 'expo-av';
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
  private activeNodes: AudioNode[] = [];
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
    if (this.isInitialized) return true;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

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

  private async ensureContextRunning(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
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
    gain.exponentialRampToValueAtTime(
      Math.max(sustain, 0.001),
      startTime + attack + decay
    );

    const releaseStart = startTime + duration - release;
    gain.setValueAtTime(sustain, releaseStart);
    gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  }

  async playNote(frequency: number, duration: number): Promise<void> {
    const initialized = await this.initialize();
    if (!initialized || !this.audioContext) {
      console.warn('Audio not available, skipping playback');
      return;
    }

    await this.ensureContextRunning();

    const startTime = this.audioContext.currentTime;
    const masterGain = this.audioContext.createGain();
    masterGain.gain.setValueAtTime(0.3, startTime); // Overall volume
    masterGain.connect(this.audioContext.destination);
    this.activeNodes.push(masterGain);

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

      this.activeNodes.push(oscillator, gainNode);

      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    });

    // Clean up master gain after all notes end
    setTimeout(() => {
      masterGain.disconnect();
      this.activeNodes = this.activeNodes.filter((n) => n !== masterGain);
    }, duration * 1000 + 100);

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

    const startTime = this.audioContext.currentTime;
    const masterGain = this.audioContext.createGain();
    // Reduce volume for chords
    masterGain.gain.setValueAtTime(0.25 / frequencies.length, startTime);
    masterGain.connect(this.audioContext.destination);
    this.activeNodes.push(masterGain);

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

        this.activeNodes.push(oscillator, gainNode);

        oscillator.onended = () => {
          oscillator.disconnect();
          gainNode.disconnect();
        };
      });
    });

    setTimeout(() => {
      masterGain.disconnect();
    }, duration * 1000 + 100);

    return new Promise((resolve) => {
      setTimeout(resolve, duration * 1000);
    });
  }

  stop(): void {
    this.activeNodes.forEach((node) => {
      try {
        if (node instanceof OscillatorNode) {
          node.stop();
        }
        node.disconnect();
      } catch {
        // Already stopped/disconnected
      }
    });
    this.activeNodes = [];
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
