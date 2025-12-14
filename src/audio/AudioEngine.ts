import { Synthesizer, SynthType } from '../types/audio';
import { SineSynth, PianoSynth } from './synths';
import { midiToFrequency, DEFAULT_A4_FREQUENCY } from '../utils/music';

/**
 * AudioEngine singleton
 * Manages audio synthesis and provides a unified interface for playing notes
 */
class AudioEngineClass {
  private static instance: AudioEngineClass | null = null;

  private synth: Synthesizer | null = null;
  private synthType: SynthType = 'piano';
  private a4Frequency: number = DEFAULT_A4_FREQUENCY;
  private defaultNoteDuration: number = 0.8;
  private isInitialized = false;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance
   */
  static getInstance(): AudioEngineClass {
    if (!AudioEngineClass.instance) {
      AudioEngineClass.instance = new AudioEngineClass();
    }
    return AudioEngineClass.instance;
  }

  /**
   * Initialize the audio engine (lazy initialization)
   * Should be called after user interaction to comply with autoplay policies
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.synth = this.createSynth(this.synthType);
    this.isInitialized = true;
  }

  /**
   * Create a synthesizer of the specified type
   */
  private createSynth(type: SynthType): Synthesizer {
    switch (type) {
      case 'sine':
        return new SineSynth();
      case 'piano':
        return new PianoSynth();
      default:
        return new PianoSynth();
    }
  }

  /**
   * Set the synthesizer type
   */
  setSynthType(type: SynthType): void {
    if (type === this.synthType && this.synth) return;

    // Dispose old synth
    this.synth?.dispose();

    this.synthType = type;
    this.synth = this.createSynth(type);
  }

  /**
   * Get the current synth type
   */
  getSynthType(): SynthType {
    return this.synthType;
  }

  /**
   * Set the A4 reference frequency
   */
  setA4Frequency(frequency: number): void {
    this.a4Frequency = frequency;
  }

  /**
   * Get the A4 reference frequency
   */
  getA4Frequency(): number {
    return this.a4Frequency;
  }

  /**
   * Set the default note duration
   */
  setDefaultNoteDuration(duration: number): void {
    this.defaultNoteDuration = duration;
  }

  /**
   * Play a single note by MIDI number
   */
  async playMidiNote(
    midiNote: number,
    duration?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    const frequency = midiToFrequency(midiNote, this.a4Frequency);
    await this.synth.playNote(frequency, duration ?? this.defaultNoteDuration);
  }

  /**
   * Play a single note by frequency
   */
  async playFrequency(
    frequency: number,
    duration?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    await this.synth.playNote(frequency, duration ?? this.defaultNoteDuration);
  }

  /**
   * Play an interval (two notes in sequence)
   * @param rootMidi - The root MIDI note
   * @param interval - Interval in semitones
   * @param ascending - Whether to play ascending (true) or descending (false)
   * @param melodic - If true, play sequentially; if false, play harmonically (together)
   */
  async playInterval(
    rootMidi: number,
    interval: number,
    ascending: boolean = true,
    melodic: boolean = true
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    const secondMidi = ascending ? rootMidi + interval : rootMidi - interval;
    const rootFreq = midiToFrequency(rootMidi, this.a4Frequency);
    const secondFreq = midiToFrequency(secondMidi, this.a4Frequency);

    if (melodic) {
      // Play notes sequentially
      await this.synth.playNote(rootFreq, this.defaultNoteDuration);
      // Small gap between notes
      await this.delay(100);
      await this.synth.playNote(secondFreq, this.defaultNoteDuration);
    } else {
      // Play notes simultaneously (harmonic interval)
      await this.synth.playChord([rootFreq, secondFreq], this.defaultNoteDuration);
    }
  }

  /**
   * Play a chord by MIDI notes
   */
  async playChordMidi(
    midiNotes: number[],
    duration?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    const frequencies = midiNotes.map((midi) =>
      midiToFrequency(midi, this.a4Frequency)
    );
    await this.synth.playChord(frequencies, duration ?? this.defaultNoteDuration);
  }

  /**
   * Play a scale from a root note
   */
  async playScale(
    rootMidi: number,
    intervals: number[],
    duration?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    const noteDuration = duration ?? this.defaultNoteDuration * 0.5;

    for (const interval of intervals) {
      const frequency = midiToFrequency(rootMidi + interval, this.a4Frequency);
      await this.synth.playNote(frequency, noteDuration);
      await this.delay(noteDuration * 1000 * 0.8);
    }
  }

  /**
   * Stop all playing sounds
   */
  stop(): void {
    this.synth?.stop();
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.synth?.dispose();
    this.synth = null;
    this.isInitialized = false;
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const AudioEngine = AudioEngineClass.getInstance();
