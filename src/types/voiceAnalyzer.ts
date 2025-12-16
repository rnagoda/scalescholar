/**
 * Voice Analyzer Type Definitions
 *
 * Types for voice training features including amplitude detection,
 * voice range profiles, and exercise types.
 */

import { PitchResult } from './pitchDetector';

/**
 * Result of amplitude/volume analysis
 */
export interface AmplitudeResult {
  /** Root Mean Square amplitude (0-1 normalized) */
  rms: number;
  /** Amplitude in decibels (typically -60 to 0) */
  db: number;
  /** Peak amplitude in this buffer (0-1) */
  peak: number;
}

/**
 * Combined voice analysis result (pitch + amplitude)
 */
export interface VoiceAnalysisResult {
  /** Pitch detection result, null if no pitch detected */
  pitch: PitchResult | null;
  /** Amplitude/volume result */
  amplitude: AmplitudeResult;
  /** Timestamp of analysis */
  timestamp: number;
}

/**
 * Voice range profile - stores user's vocal capabilities
 */
export interface VoiceRangeProfile {
  /** Lowest singable MIDI note number */
  lowestNote: number;
  /** Highest singable MIDI note number */
  highestNote: number;
  /** Lower bound of comfortable singing range (MIDI) */
  comfortableLow: number;
  /** Upper bound of comfortable singing range (MIDI) */
  comfortableHigh: number;
  /** Dynamic range capabilities */
  dynamicRange: {
    /** Softest sustainable volume in dB */
    softest: number;
    /** Loudest comfortable volume in dB */
    loudest: number;
  };
  /** When the profile was assessed */
  assessedAt: Date;
}

/**
 * Voice exercise types
 */
export type VoiceExerciseType =
  | 'note_match'  // Hit and hold a single target note
  | 'scale'       // Sing a scale sequence
  | 'glide'       // Smooth pitch transition between notes
  | 'sustain';    // Hold a note steady for duration

/**
 * Scale types for vocal training
 * Ordered roughly by difficulty/complexity
 */
export type VocalScaleType =
  // Beginner scales
  | 'major'              // W-W-H-W-W-W-H - foundational scale
  | 'natural_minor'      // W-H-W-W-H-W-W - relative minor
  | 'major_pentatonic'   // 5 notes, no semitones - beginner-friendly
  | 'minor_pentatonic'   // 5 notes - great for improvisation
  // Intermediate scales
  | 'harmonic_minor'     // Natural minor with raised 7th
  | 'melodic_minor'      // Ascending: raised 6th and 7th
  | 'dorian'             // Minor with raised 6th - jazz/folk
  | 'mixolydian'         // Major with lowered 7th - blues/rock
  // Advanced scales
  | 'phrygian'           // Minor with lowered 2nd - flamenco
  | 'lydian'             // Major with raised 4th - dreamy
  | 'blues'              // 6 notes with blue note - expression
  | 'chromatic';         // All 12 semitones - agility drill

/**
 * Scale intervals from root (in semitones)
 */
export const SCALE_INTERVALS: Record<VocalScaleType, number[]> = {
  // Beginner
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  natural_minor: [0, 2, 3, 5, 7, 8, 10, 12],
  major_pentatonic: [0, 2, 4, 7, 9, 12],
  minor_pentatonic: [0, 3, 5, 7, 10, 12],
  // Intermediate
  harmonic_minor: [0, 2, 3, 5, 7, 8, 11, 12],
  melodic_minor: [0, 2, 3, 5, 7, 9, 11, 12],
  dorian: [0, 2, 3, 5, 7, 9, 10, 12],
  mixolydian: [0, 2, 4, 5, 7, 9, 10, 12],
  // Advanced
  phrygian: [0, 1, 3, 5, 7, 8, 10, 12],
  lydian: [0, 2, 4, 6, 7, 9, 11, 12],
  blues: [0, 3, 5, 6, 7, 10, 12],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

/**
 * Human-readable scale names
 */
export const SCALE_NAMES: Record<VocalScaleType, string> = {
  major: 'Major',
  natural_minor: 'Natural Minor',
  major_pentatonic: 'Major Pentatonic',
  minor_pentatonic: 'Minor Pentatonic',
  harmonic_minor: 'Harmonic Minor',
  melodic_minor: 'Melodic Minor',
  dorian: 'Dorian',
  mixolydian: 'Mixolydian',
  phrygian: 'Phrygian',
  lydian: 'Lydian',
  blues: 'Blues',
  chromatic: 'Chromatic',
};

/**
 * Scale difficulty levels for progression
 */
export type ScaleDifficulty = 'beginner' | 'intermediate' | 'advanced';

export const SCALE_DIFFICULTY: Record<VocalScaleType, ScaleDifficulty> = {
  major: 'beginner',
  natural_minor: 'beginner',
  major_pentatonic: 'beginner',
  minor_pentatonic: 'beginner',
  harmonic_minor: 'intermediate',
  melodic_minor: 'intermediate',
  dorian: 'intermediate',
  mixolydian: 'intermediate',
  phrygian: 'advanced',
  lydian: 'advanced',
  blues: 'advanced',
  chromatic: 'advanced',
};

/**
 * Scales grouped by difficulty
 */
export const SCALES_BY_DIFFICULTY: Record<ScaleDifficulty, VocalScaleType[]> = {
  beginner: ['major', 'natural_minor', 'major_pentatonic', 'minor_pentatonic'],
  intermediate: ['harmonic_minor', 'melodic_minor', 'dorian', 'mixolydian'],
  advanced: ['phrygian', 'lydian', 'blues', 'chromatic'],
};

/**
 * State of a voice exercise session
 */
export type VoiceExerciseState =
  | 'ready'       // Waiting to start
  | 'playing'     // Playing reference tone
  | 'listening'   // Listening for user's voice
  | 'feedback'    // Showing result feedback
  | 'complete';   // Session finished

/**
 * Voice exercise question/challenge
 */
export interface VoiceExerciseQuestion {
  /** Type of exercise */
  type: VoiceExerciseType;
  /** Target MIDI note (or start note for glide) */
  targetNote: number;
  /** End note for glide exercises */
  endNote?: number;
  /** Notes for scale exercises */
  scaleNotes?: number[];
  /** Scale type for scale exercises */
  scaleType?: VocalScaleType;
  /** Duration to hold note in ms (for sustain) */
  duration?: number;
}

/**
 * Result of a single exercise attempt
 */
export interface VoiceExerciseResult {
  /** The question attempted */
  question: VoiceExerciseQuestion;
  /** Best accuracy achieved (0-100) */
  accuracy: number;
  /** Time spent on target in ms */
  timeOnTarget: number;
  /** Average volume consistency (0-100) */
  volumeConsistency: number;
  /** Whether the attempt was successful */
  success: boolean;
  /** When the attempt was made */
  timestamp: number;
}

/**
 * Voice training session summary
 */
export interface VoiceTrainingSession {
  /** Exercise type for this session */
  exerciseType: VoiceExerciseType;
  /** Total questions in session */
  questionsCount: number;
  /** Successfully completed questions */
  correctCount: number;
  /** Average accuracy across session */
  averageAccuracy: number;
  /** Session duration in seconds */
  durationSeconds: number;
  /** When session completed */
  completedAt: Date;
}

/**
 * Overall voice training statistics
 */
export interface VoiceTrainingStats {
  /** Total exercise attempts */
  totalAttempts: number;
  /** Overall average accuracy */
  averageAccuracy: number;
  /** Current streak of successful sessions */
  currentStreak: number;
  /** Stats per exercise type */
  byExerciseType: {
    [key in VoiceExerciseType]?: {
      attempts: number;
      accuracy: number;
      recentAccuracy: number; // Last 20 attempts
    };
  };
}

/**
 * Voice analyzer state
 */
export type VoiceAnalyzerState = 'idle' | 'requesting' | 'listening' | 'error';

/**
 * Callback for voice analysis results
 */
export type VoiceAnalysisCallback = (result: VoiceAnalysisResult) => void;

/**
 * Thresholds for voice detection
 */
export interface VoiceDetectionThresholds {
  /** Minimum dB level to consider as voiced (-60 to 0) */
  minVoiceDb: number;
  /** Cents deviation considered "on target" */
  onTargetCents: number;
  /** Minimum time on target to count as success (ms) */
  minTimeOnTarget: number;
}

/**
 * Default voice detection thresholds
 */
export const DEFAULT_VOICE_THRESHOLDS: VoiceDetectionThresholds = {
  minVoiceDb: -50,      // More sensitive for varied microphone levels
  onTargetCents: 10,    // Within 10 cents = on target
  minTimeOnTarget: 1000, // 1 second on target
};

/**
 * VRP Assessment step
 */
export type VRPAssessmentStep =
  | 'intro'
  | 'lowest'
  | 'highest'
  | 'comfortable_low'
  | 'comfortable_high'
  | 'results';
