import { AppState, AppStateStatus } from 'react-native';
import { Synthesizer, SynthType } from '../types/audio';
import { SineSynth, PianoSynth, SampledPianoSynth } from './synths';
import {
  midiToFrequency,
  DEFAULT_A4_FREQUENCY,
  KeyContextType,
  generateKeyContext,
  scaleDegreeToMidi,
  ScaleDegree,
  ChordQuality,
  generateChordFromQuality,
} from '../utils/music';

/**
 * AudioEngine singleton
 * Manages audio synthesis and provides a unified interface for playing notes
 */
class AudioEngineClass {
  private static instance: AudioEngineClass | null = null;

  private synth: Synthesizer | null = null;
  private synthType: SynthType = 'sampled-piano';
  private a4Frequency: number = DEFAULT_A4_FREQUENCY;
  private defaultNoteDuration: number = 0.8;
  private isInitialized = false;
  private appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;
  private lastAppState: AppStateStatus = 'active';

  private constructor() {
    // Set up AppState listener to handle audio context invalidation
    // when app goes to background/foreground or Bluetooth changes
    this.setupAppStateListener();
  }

  /**
   * Set up AppState listener to reinitialize audio when app returns to foreground
   */
  private setupAppStateListener(): void {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this)
    );
  }

  /**
   * Handle app state changes - reinitialize audio on return to foreground
   */
  private async handleAppStateChange(nextAppState: AppStateStatus): Promise<void> {
    // When coming back from background to active, reinitialize audio
    if (
      this.lastAppState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      this.isInitialized &&
      this.synth
    ) {
      console.log('App returned to foreground, reinitializing audio...');
      try {
        await this.synth.reinitialize();
      } catch (error) {
        console.warn('Failed to reinitialize audio on foreground:', error);
      }
    }
    this.lastAppState = nextAppState;
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
      case 'sampled-piano':
        return new SampledPianoSynth();
      default:
        return new SampledPianoSynth();
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
   * @param midiNote - MIDI note number (60 = middle C)
   * @param duration - Duration in seconds (optional)
   * @param velocity - Velocity/volume from 0.0 to 1.0 (optional, default 0.7)
   */
  async playMidiNote(
    midiNote: number,
    duration?: number,
    velocity?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    const frequency = midiToFrequency(midiNote, this.a4Frequency);
    await this.synth.playNote(frequency, duration ?? this.defaultNoteDuration, velocity);
  }

  /**
   * Play a single note by frequency
   * @param frequency - Frequency in Hz
   * @param duration - Duration in seconds (optional)
   * @param velocity - Velocity/volume from 0.0 to 1.0 (optional, default 0.7)
   */
  async playFrequency(
    frequency: number,
    duration?: number,
    velocity?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    await this.synth.playNote(frequency, duration ?? this.defaultNoteDuration, velocity);
  }

  /**
   * Play an interval (two notes in sequence)
   * @param rootMidi - The root MIDI note
   * @param interval - Interval in semitones
   * @param ascending - Whether to play ascending (true) or descending (false)
   * @param melodic - If true, play sequentially; if false, play harmonically (together)
   * @param velocity - Velocity/volume from 0.0 to 1.0 (optional, default 0.7)
   */
  async playInterval(
    rootMidi: number,
    interval: number,
    ascending: boolean = true,
    melodic: boolean = true,
    velocity?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    const secondMidi = ascending ? rootMidi + interval : rootMidi - interval;
    const rootFreq = midiToFrequency(rootMidi, this.a4Frequency);
    const secondFreq = midiToFrequency(secondMidi, this.a4Frequency);

    if (melodic) {
      // Play notes sequentially
      await this.synth.playNote(rootFreq, this.defaultNoteDuration, velocity);
      // Small gap between notes
      await this.delay(100);
      await this.synth.playNote(secondFreq, this.defaultNoteDuration, velocity);
    } else {
      // Play notes simultaneously (harmonic interval)
      await this.synth.playChord([rootFreq, secondFreq], this.defaultNoteDuration, velocity);
    }
  }

  /**
   * Play a chord by MIDI notes
   * @param midiNotes - Array of MIDI note numbers
   * @param duration - Duration in seconds (optional)
   * @param velocity - Velocity/volume from 0.0 to 1.0 (optional, default 0.7)
   */
  async playChordMidi(
    midiNotes: number[],
    duration?: number,
    velocity?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    const frequencies = midiNotes.map((midi) =>
      midiToFrequency(midi, this.a4Frequency)
    );
    await this.synth.playChord(frequencies, duration ?? this.defaultNoteDuration, velocity);
  }

  /**
   * Play a scale from a root note
   * @param rootMidi - Root MIDI note number
   * @param intervals - Array of intervals in semitones from root
   * @param duration - Duration per note in seconds (optional)
   * @param velocity - Velocity/volume from 0.0 to 1.0 (optional, default 0.7)
   */
  async playScale(
    rootMidi: number,
    intervals: number[],
    duration?: number,
    velocity?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    const noteDuration = duration ?? this.defaultNoteDuration * 0.5;

    for (const interval of intervals) {
      const frequency = midiToFrequency(rootMidi + interval, this.a4Frequency);
      await this.synth.playNote(frequency, noteDuration, velocity);
      await this.delay(noteDuration * 1000 * 0.8);
    }
  }

  /**
   * Play key context to establish tonality
   * @param keyRootMidi - The root MIDI note of the key
   * @param contextType - Type of context (triad, scale, or cadence)
   * @param velocity - Velocity/volume from 0.0 to 1.0 (optional, default 0.7)
   */
  async playKeyContext(
    keyRootMidi: number,
    contextType: KeyContextType = 'triad',
    velocity?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    const contextNotes = generateKeyContext(keyRootMidi, contextType);

    for (const notes of contextNotes) {
      if (contextType === 'scale') {
        // Play scale melodically
        for (const midi of notes) {
          const freq = midiToFrequency(midi, this.a4Frequency);
          await this.synth.playNote(freq, this.defaultNoteDuration * 0.4, velocity);
          await this.delay(this.defaultNoteDuration * 400 * 0.6);
        }
      } else {
        // Play chords
        const frequencies = notes.map((midi) =>
          midiToFrequency(midi, this.a4Frequency)
        );
        await this.synth.playChord(frequencies, this.defaultNoteDuration, velocity);
        await this.delay(this.defaultNoteDuration * 1000 + 100);
      }
    }
  }

  /**
   * Play a scale degree within a key context
   * @param keyRootMidi - The root MIDI note of the key
   * @param degree - The scale degree to play
   * @param octaveOffset - Optional octave offset (0 = same octave as root)
   * @param velocity - Velocity/volume from 0.0 to 1.0 (optional, default 0.7)
   */
  async playScaleDegree(
    keyRootMidi: number,
    degree: ScaleDegree,
    octaveOffset: number = 0,
    velocity?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    const midiNote = scaleDegreeToMidi(degree, keyRootMidi, octaveOffset);
    const frequency = midiToFrequency(midiNote, this.a4Frequency);
    await this.synth.playNote(frequency, this.defaultNoteDuration, velocity);
  }

  /**
   * Play key context followed by a scale degree
   * This is the primary method for scale degree training
   * @param velocity - Velocity/volume from 0.0 to 1.0 (optional, default 0.7)
   */
  async playScaleDegreeWithContext(
    keyRootMidi: number,
    degree: ScaleDegree,
    contextType: KeyContextType = 'triad',
    octaveOffset: number = 0,
    velocity?: number
  ): Promise<void> {
    // Play context first
    await this.playKeyContext(keyRootMidi, contextType, velocity);

    // Brief pause
    await this.delay(300);

    // Play the target scale degree
    await this.playScaleDegree(keyRootMidi, degree, octaveOffset, velocity);
  }

  /**
   * Play a chord by quality
   * @param rootMidi - The root MIDI note of the chord
   * @param quality - The chord quality (Major, Minor, etc.)
   * @param duration - Optional duration in seconds
   * @param velocity - Velocity/volume from 0.0 to 1.0 (optional, default 0.7)
   */
  async playChordQuality(
    rootMidi: number,
    quality: ChordQuality,
    duration?: number,
    velocity?: number
  ): Promise<void> {
    const midiNotes = generateChordFromQuality(rootMidi, quality);
    await this.playChordMidi(midiNotes, duration, velocity);
  }

  /**
   * Play a melodic phrase that ends on a specific scale degree
   * Used for "Finding Do" exercises where user identifies the tonic
   * @param keyRootMidi - The root MIDI note of the key
   * @param endingDegree - The scale degree the phrase ends on (1, 2, or 3)
   * @param velocity - Velocity/volume from 0.0 to 1.0 (optional, default 0.7)
   */
  async playMelodicPhrase(
    keyRootMidi: number,
    endingDegree: 1 | 2 | 3,
    velocity?: number
  ): Promise<void> {
    await this.initialize();
    if (!this.synth) return;

    // Major scale degrees to MIDI offsets
    const scaleOffsets = [0, 2, 4, 5, 7, 9, 11]; // 1, 2, 3, 4, 5, 6, 7

    // Generate phrase length (4-6 notes)
    const phraseLength = 4 + Math.floor(Math.random() * 3); // 4, 5, or 6

    // Build phrase algorithmically:
    // 1. Start on a stable tone (1, 3, or 5)
    // 2. Move by steps or small leaps
    // 3. End on the specified degree
    const phrase: number[] = [];

    // Starting degree options (stable tones)
    const startOptions = [1, 3, 5];
    let currentDegree = startOptions[Math.floor(Math.random() * startOptions.length)];
    phrase.push(currentDegree);

    // Generate middle notes (move by step or small leap)
    for (let i = 1; i < phraseLength - 1; i++) {
      // Allowed moves: -3 to +3 degrees
      const moves = [-2, -1, 1, 2];
      const move = moves[Math.floor(Math.random() * moves.length)];
      let nextDegree = currentDegree + move;

      // Keep within 1-7 range
      if (nextDegree < 1) nextDegree = 1;
      if (nextDegree > 7) nextDegree = 7;

      phrase.push(nextDegree);
      currentDegree = nextDegree;
    }

    // End on the specified degree
    phrase.push(endingDegree);

    // Play the phrase
    const noteDuration = 0.4;
    const noteGap = 350; // ms between notes

    for (const degree of phrase) {
      const midiOffset = scaleOffsets[degree - 1];
      const midiNote = keyRootMidi + midiOffset;
      const frequency = midiToFrequency(midiNote, this.a4Frequency);
      await this.synth.playNote(frequency, noteDuration, velocity);
      await this.delay(noteGap);
    }
  }

  /**
   * Stop all playing sounds
   */
  stop(): void {
    this.synth?.stop();
  }

  /**
   * Force reinitialize audio context
   * Call this if audio playback stops working (e.g., after Bluetooth changes)
   */
  async reinitialize(): Promise<void> {
    if (this.synth) {
      await this.synth.reinitialize();
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    // Remove AppState listener
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
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
