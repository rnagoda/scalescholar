import { Interval } from '../utils/music';

/**
 * Exercise state machine states
 */
export type ExerciseState =
  | 'ready'      // Waiting to start or between questions
  | 'playing'    // Audio is playing
  | 'answering'  // Waiting for user answer
  | 'feedback'   // Showing correct/incorrect feedback
  | 'complete';  // Session finished

/**
 * A single question in an interval exercise
 */
export interface IntervalQuestion {
  id: string;
  rootMidi: number;
  interval: Interval;
  ascending: boolean;
  melodic: boolean;
}

/**
 * User's answer to a question
 */
export interface IntervalAnswer {
  questionId: string;
  selectedInterval: Interval;
  correct: boolean;
  answeredAt: number;
}

/**
 * Exercise session configuration
 */
export interface ExerciseConfig {
  questionCount: number;
  availableIntervals: Interval[];
  ascending: boolean;
  descending: boolean;
  melodic: boolean;
  harmonic: boolean;
  minMidi: number;
  maxMidi: number;
}

/**
 * Exercise session results
 */
export interface SessionResults {
  totalQuestions: number;
  correctAnswers: number;
  answers: IntervalAnswer[];
  startedAt: number;
  completedAt: number;
}
