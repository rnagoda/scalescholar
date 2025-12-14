/**
 * Scale Scholar Type Definitions
 */

// ============================================================================
// Music Theory Types
// ============================================================================

/**
 * Interval in semitones
 */
export enum Interval {
  UNISON = 0,
  MINOR_SECOND = 1,
  MAJOR_SECOND = 2,
  MINOR_THIRD = 3,
  MAJOR_THIRD = 4,
  PERFECT_FOURTH = 5,
  TRITONE = 6,
  PERFECT_FIFTH = 7,
  MINOR_SIXTH = 8,
  MAJOR_SIXTH = 9,
  MINOR_SEVENTH = 10,
  MAJOR_SEVENTH = 11,
  OCTAVE = 12,
}

/**
 * Scale degree (1-7)
 */
export type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Chord quality types
 */
export enum ChordQuality {
  MAJOR = 'major',
  MINOR = 'minor',
  DIMINISHED = 'diminished',
  AUGMENTED = 'augmented',
}

/**
 * Interval playback direction
 */
export enum IntervalDirection {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
  HARMONIC = 'harmonic',
}

// ============================================================================
// Exercise Types
// ============================================================================

/**
 * Exercise type identifier
 */
export enum ExerciseType {
  INTERVAL = 'interval',
  SCALE_DEGREE = 'scaleDegree',
  CHORD_QUALITY = 'chordQuality',
}

/**
 * Exercise state machine states
 */
export enum ExerciseState {
  READY = 'ready',
  PLAYING = 'playing',
  ANSWERING = 'answering',
  FEEDBACK = 'feedback',
  COMPLETE = 'complete',
}

/**
 * Base question interface
 */
export interface IQuestion {
  id: string;
  type: ExerciseType;
}

/**
 * Interval question
 */
export interface IIntervalQuestion extends IQuestion {
  type: ExerciseType.INTERVAL;
  note1: number; // MIDI note number
  note2: number; // MIDI note number
  correctAnswer: Interval;
  direction: IntervalDirection;
  options: Interval[];
}

/**
 * Scale degree question
 */
export interface IScaleDegreeQuestion extends IQuestion {
  type: ExerciseType.SCALE_DEGREE;
  rootNote: number; // MIDI note number
  targetNote: number; // MIDI note number
  correctAnswer: ScaleDegree;
  options: ScaleDegree[];
}

/**
 * Chord quality question
 */
export interface IChordQualityQuestion extends IQuestion {
  type: ExerciseType.CHORD_QUALITY;
  rootNote: number; // MIDI note number
  correctAnswer: ChordQuality;
  options: ChordQuality[];
}

/**
 * Union type for all question types
 */
export type TQuestion = IIntervalQuestion | IScaleDegreeQuestion | IChordQualityQuestion;

/**
 * Answer result
 */
export interface IAnswerResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

/**
 * Exercise session
 */
export interface IExerciseSession {
  id: string;
  type: ExerciseType;
  startTime: number;
  endTime?: number;
  questions: TQuestion[];
  results: IAnswerResult[];
  currentIndex: number;
}

// ============================================================================
// Progress Types
// ============================================================================

/**
 * Per-exercise statistics
 */
export interface IExerciseStats {
  exerciseType: ExerciseType;
  totalAttempts: number;
  correctAnswers: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
  unlockedItems: string[];
}

/**
 * Session summary shown after completing exercise
 */
export interface ISessionSummary {
  sessionId: string;
  exerciseType: ExerciseType;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  duration: number; // in seconds
  streak: number;
}

// ============================================================================
// Settings Types
// ============================================================================

/**
 * Available instrument sounds
 */
export enum InstrumentSound {
  PIANO = 'piano',
  SINE = 'sine',
}

/**
 * Scale degree display format
 */
export enum ScaleDegreeFormat {
  NUMBERS = 'numbers',
  SOLFEGE = 'solfege',
}

/**
 * User settings
 */
export interface ISettings {
  instrumentSound: InstrumentSound;
  scaleDegreeFormat: ScaleDegreeFormat;
  referenceKey: string; // e.g., 'C', 'G', 'F#'
  referencePitch: number; // A4 frequency in Hz (432, 440, 442)
  questionsPerSession: number;
  autoPlayNext: boolean;
  hapticFeedback: boolean;
}

// ============================================================================
// Audio Types
// ============================================================================

/**
 * Synthesizer interface - all synths must implement this
 */
export interface ISynthesizer {
  playNote(frequency: number, duration: number): void;
  playChord(frequencies: number[], duration: number): void;
  stop(): void;
}

/**
 * Audio engine state
 */
export interface IAudioEngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  currentSynth: InstrumentSound;
}

// ============================================================================
// Navigation Types
// ============================================================================

/**
 * Root stack param list
 */
export type RootStackParamList = {
  Main: undefined;
  IntervalTrainer: undefined;
  ScaleDegreeTrainer: undefined;
  ChordQualityTrainer: undefined;
  SessionComplete: { summary: ISessionSummary };
};

/**
 * Bottom tab param list
 */
export type BottomTabParamList = {
  Home: undefined;
  Progress: undefined;
  Settings: undefined;
};
