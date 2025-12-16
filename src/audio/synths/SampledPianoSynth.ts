import {
  AudioContext,
  AudioBuffer,
  AudioBufferSourceNode,
  GainNode,
  decodeAudioData,
} from 'react-native-audio-api';
import { Asset } from 'expo-asset';
import { Synthesizer } from '../../types/audio';

/**
 * Sample definition mapping MIDI notes to asset requires
 * Salamander samples are at minor 3rd intervals (every 3 semitones)
 */
interface SampleDef {
  midiNote: number;
  asset: number; // require() returns a number (asset ID) in React Native
}

// Available samples from Salamander Grand Piano
// Covers C3 (48) to C6 (84) at minor 3rd intervals
// Using require() for proper React Native asset bundling
const SAMPLES: SampleDef[] = [
  { midiNote: 48, asset: require('../../../assets/audio/piano/C3.mp3') },
  { midiNote: 51, asset: require('../../../assets/audio/piano/Ds3.mp3') },
  { midiNote: 54, asset: require('../../../assets/audio/piano/Fs3.mp3') },
  { midiNote: 57, asset: require('../../../assets/audio/piano/A3.mp3') },
  { midiNote: 60, asset: require('../../../assets/audio/piano/C4.mp3') },
  { midiNote: 63, asset: require('../../../assets/audio/piano/Ds4.mp3') },
  { midiNote: 66, asset: require('../../../assets/audio/piano/Fs4.mp3') },
  { midiNote: 69, asset: require('../../../assets/audio/piano/A4.mp3') },
  { midiNote: 72, asset: require('../../../assets/audio/piano/C5.mp3') },
  { midiNote: 75, asset: require('../../../assets/audio/piano/Ds5.mp3') },
  { midiNote: 78, asset: require('../../../assets/audio/piano/Fs5.mp3') },
  { midiNote: 81, asset: require('../../../assets/audio/piano/A5.mp3') },
  { midiNote: 84, asset: require('../../../assets/audio/piano/C6.mp3') },
];

// Get sorted MIDI notes for nearest sample lookup
const SAMPLE_MIDI_NOTES = SAMPLES.map((s) => s.midiNote).sort((a, b) => a - b);

/**
 * Sampled Piano Synthesizer using Salamander Grand Piano samples
 * Uses pitch shifting (max 1.5 semitones) to cover all notes
 */
export class SampledPianoSynth implements Synthesizer {
  private audioContext: AudioContext | null = null;
  private sampleBuffers: Map<number, AudioBuffer> = new Map();
  private activeNodes: { source: AudioBufferSourceNode; gain: GainNode }[] = [];
  private isInitialized = false;
  private isLoading = false;
  private loadPromise: Promise<boolean> | null = null;

  /**
   * Initialize audio context and load samples
   */
  private async initialize(): Promise<boolean> {
    // If already loading, wait for that to complete
    if (this.loadPromise) {
      return this.loadPromise;
    }

    if (this.isInitialized && this.audioContext?.state === 'running') {
      return true;
    }

    // Handle suspended context
    if (this.audioContext?.state === 'suspended') {
      try {
        await this.audioContext.resume();
        return true;
      } catch (error) {
        console.warn('Failed to resume audio context, recreating:', error);
        this.audioContext = null;
        this.isInitialized = false;
      }
    }

    // Create new context and load samples
    this.loadPromise = this.loadSamples();
    const result = await this.loadPromise;
    this.loadPromise = null;
    return result;
  }

  /**
   * Load all piano samples into memory
   */
  private async loadSamples(): Promise<boolean> {
    if (this.isLoading) return false;
    this.isLoading = true;

    try {
      this.audioContext = new AudioContext();

      // Load all samples in parallel using Expo Asset system
      const loadPromises = SAMPLES.map(async (sample) => {
        try {
          // Create Asset from the require() reference
          const asset = Asset.fromModule(sample.asset);

          // Download the asset to local storage if needed
          await asset.downloadAsync();

          if (!asset.localUri) {
            throw new Error('Asset localUri not available');
          }

          // Decode the audio file
          const buffer = await decodeAudioData(asset.localUri);
          this.sampleBuffers.set(sample.midiNote, buffer);
        } catch (error) {
          console.warn(`Failed to load sample for MIDI ${sample.midiNote}:`, error);
        }
      });

      await Promise.all(loadPromises);

      this.isInitialized = this.sampleBuffers.size > 0;
      this.isLoading = false;

      if (this.isInitialized) {
        console.log(`Loaded ${this.sampleBuffers.size} piano samples`);
      } else {
        console.error('No piano samples loaded');
      }

      return this.isInitialized;
    } catch (error) {
      console.error('Failed to initialize sampled piano:', error);
      this.isLoading = false;
      return false;
    }
  }

  /**
   * Find the nearest sample for a given MIDI note
   * Returns the sample MIDI note and the semitone offset needed
   */
  private findNearestSample(targetMidi: number): {
    sampleMidi: number;
    semitoneOffset: number;
  } {
    // Binary search for closest sample
    let closest = SAMPLE_MIDI_NOTES[0];
    let minDistance = Math.abs(targetMidi - closest);

    for (const sampleMidi of SAMPLE_MIDI_NOTES) {
      const distance = Math.abs(targetMidi - sampleMidi);
      if (distance < minDistance) {
        minDistance = distance;
        closest = sampleMidi;
      }
      // Early exit if we've passed the target (samples are sorted)
      if (sampleMidi > targetMidi && distance > minDistance) {
        break;
      }
    }

    return {
      sampleMidi: closest,
      semitoneOffset: targetMidi - closest,
    };
  }

  /**
   * Convert semitone offset to playback rate
   * playbackRate = 2^(semitones/12)
   */
  private semitoneToPlaybackRate(semitones: number): number {
    return Math.pow(2, semitones / 12);
  }

  /**
   * Play a single note
   * @param frequency - Frequency in Hz (converted to MIDI internally)
   * @param duration - Duration in seconds
   * @param velocity - Velocity 0.0-1.0 (default 0.7)
   */
  async playNote(
    frequency: number,
    duration: number,
    velocity: number = 0.7
  ): Promise<void> {
    const initialized = await this.initialize();
    if (!initialized || !this.audioContext) {
      console.warn('Sampled piano not available, skipping playback');
      return;
    }

    // Convert frequency to MIDI note
    const midiNote = Math.round(12 * Math.log2(frequency / 440) + 69);

    // Find nearest sample and calculate pitch shift
    const { sampleMidi, semitoneOffset } = this.findNearestSample(midiNote);
    const buffer = this.sampleBuffers.get(sampleMidi);

    if (!buffer) {
      console.warn(`No sample buffer for MIDI ${sampleMidi}`);
      return;
    }

    const clampedVelocity = Math.max(0, Math.min(1, velocity));
    const startTime = this.audioContext.currentTime;

    // Create source node
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;

    // Apply pitch shift via playbackRate
    const playbackRate = this.semitoneToPlaybackRate(semitoneOffset);
    source.playbackRate.setValueAtTime(playbackRate, startTime);

    // Create gain node for velocity and envelope
    const gainNode = this.audioContext.createGain();

    // Apply velocity - use exponential curve for more natural dynamics
    const velocityGain = 0.3 + clampedVelocity * 0.7; // Range 0.3-1.0
    gainNode.gain.setValueAtTime(velocityGain, startTime);

    // Apply release envelope
    const releaseStart = startTime + duration - 0.1;
    if (releaseStart > startTime) {
      gainNode.gain.setValueAtTime(velocityGain, releaseStart);
      gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);
    }

    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Start playback
    source.start(startTime);
    source.stop(startTime + duration);

    // Track active nodes for cleanup
    this.activeNodes.push({ source, gain: gainNode });

    // Clean up after playback
    return new Promise((resolve) => {
      setTimeout(() => {
        this.cleanupNode(source, gainNode);
        resolve();
      }, duration * 1000);
    });
  }

  /**
   * Play multiple notes simultaneously (chord)
   */
  async playChord(
    frequencies: number[],
    duration: number,
    velocity: number = 0.7
  ): Promise<void> {
    const initialized = await this.initialize();
    if (!initialized || !this.audioContext) {
      console.warn('Sampled piano not available, skipping playback');
      return;
    }

    // Reduce velocity for chords to prevent clipping
    const chordVelocity = velocity / Math.sqrt(frequencies.length);

    // Play all notes simultaneously
    await Promise.all(
      frequencies.map((freq) => this.playNote(freq, duration, chordVelocity))
    );
  }

  /**
   * Clean up a finished node
   */
  private cleanupNode(
    source: AudioBufferSourceNode,
    gain: GainNode
  ): void {
    const index = this.activeNodes.findIndex((n) => n.source === source);
    if (index !== -1) {
      this.activeNodes.splice(index, 1);
    }
  }

  /**
   * Stop all playing sounds
   */
  stop(): void {
    for (const { source } of this.activeNodes) {
      try {
        source.stop();
      } catch {
        // Already stopped
      }
    }
    this.activeNodes = [];
  }

  /**
   * Force reinitialize (useful after audio route changes)
   */
  async reinitialize(): Promise<boolean> {
    this.dispose();
    return this.initialize();
  }

  /**
   * Clean up all resources
   */
  dispose(): void {
    this.stop();
    this.sampleBuffers.clear();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isInitialized = false;
    this.isLoading = false;
    this.loadPromise = null;
  }
}
