/**
 * Ear School Type Definitions
 *
 * Types for the structured 4-section Ear School curriculum.
 */

/**
 * Exercise types for Ear School lessons
 */
export type EarSchoolExerciseType =
  | 'identify-tonic' // Section 1: Which note is Do?
  | 'scale-degree-id' // Section 1, 3: Identify scale degree
  | 'pattern-match' // Section 1: Match 3-note pattern
  | 'same-different' // Section 2: Are these notes the same?
  | 'interval-id' // Section 2: Identify interval
  | 'step-type' // Section 3: Whole step or half step?
  | 'scale-quality' // Section 3: Major or minor scale?
  | 'pulse-count' // Section 4: How many beats?
  | 'note-value' // Section 4: Note duration
  | 'rhythm-pattern' // Section 4: Match rhythm pattern
  | 'pitch-rhythm'; // Section 4: Combined identification

/**
 * Answer option for questions
 */
export interface EarSchoolAnswerOption {
  id: string;
  label: string;
  value: string;
}

/**
 * Audio parameters for question playback
 */
export interface EarSchoolAudioParams {
  // Common parameters
  key?: string; // e.g., "C major", "G major"
  rootMidi?: number; // Root note MIDI number

  // For scale degree exercises
  scaleDegrees?: number[]; // Array of scale degrees to play
  playContext?: boolean; // Whether to play key context first

  // For interval exercises
  interval?: number; // Semitones
  direction?: 'ascending' | 'descending' | 'harmonic';

  // For pattern exercises
  pattern?: number[]; // Array of scale degrees in pattern

  // For scale quality exercises
  scaleType?: 'major' | 'minor'; // Scale quality to play

  // For rhythm exercises
  rhythmPattern?: string; // e.g., "q q q q", "h q q", "w"
  bpm?: number;

  // Playback options
  noteDuration?: number; // Duration per note in seconds
  velocity?: number; // Volume 0.0-1.0
}

/**
 * Individual question in a lesson
 */
export interface EarSchoolQuestion {
  id: string;
  type: EarSchoolExerciseType;
  prompt: string; // e.g., "What scale degree is this?"
  key: string; // Current key for this question
  audioParams: EarSchoolAudioParams;
  options: EarSchoolAnswerOption[];
  correctAnswerId: string;
  hint?: string; // Shown in first 5 questions if hints enabled
}

/**
 * Question generator function signature
 */
export type QuestionGenerator = (
  keyPool: readonly string[],
  previousQuestion?: EarSchoolQuestion
) => EarSchoolQuestion;

/**
 * Lesson definition (static content)
 */
export interface EarSchoolLessonDef {
  id: string; // e.g., "ear-school-1.2"
  sectionId: string; // e.g., "ear-school-section-1"
  sectionNumber: number;
  lessonNumber: number;
  title: string; // e.g., "Do-Re-Mi Recognition"
  subtitle: string; // e.g., "Identify scale degrees 1, 2, 3"
  concept: string; // Learning concept description
  exerciseType: EarSchoolExerciseType;
  keyPool: readonly string[]; // Keys to randomize from
  questionCount: number; // 10, 15, or 20
  passThreshold: number; // 70 for lessons, 80 for assessments
  isAssessment: boolean;
  generateQuestion: QuestionGenerator;
}

/**
 * Section definition (static content)
 */
export interface EarSchoolSectionDef {
  id: string; // e.g., "ear-school-section-1"
  number: number; // 1-4
  title: string; // e.g., "Basic Solfege & Pitch Awareness"
  description: string; // Learning goal
  lessons: EarSchoolLessonDef[];
  assessment: EarSchoolLessonDef;
}

/**
 * Curriculum definition (all sections)
 */
export interface EarSchoolCurriculum {
  sections: EarSchoolSectionDef[];
}

/**
 * Lesson progress (from database)
 */
export interface EarSchoolLessonProgress {
  lessonId: string;
  attempts: number;
  bestScore: number; // percentage 0-100
  passed: boolean; // met 70% threshold
  mastered: boolean; // met 80% threshold
  aced: boolean; // met 90% threshold
  challengeMode: boolean;
  firstPassedAt: string | null;
  lastAttemptAt: string | null;
}

/**
 * Section progress (from database)
 */
export interface EarSchoolSectionProgress {
  sectionId: string;
  lessonsPassed: number;
  assessmentScore: number;
  challengeModeActive: boolean;
  completedAt: string | null;
}

/**
 * Adaptive difficulty state (from database)
 */
export interface EarSchoolAdaptiveState {
  enabled: boolean;
  globalChallengeMode: boolean;
  acedStreak: number;
  lastScoreBelow85At: string | null;
}

/**
 * Individual attempt record (for analytics)
 */
export interface EarSchoolAttempt {
  lessonId: string;
  questionType: EarSchoolExerciseType;
  key: string;
  correct: boolean;
  responseTimeMs: number;
  createdAt: string;
}

/**
 * Lesson session state machine
 */
export type EarSchoolSessionState =
  | 'ready' // Waiting to play question
  | 'playing' // Audio playing
  | 'answering' // Waiting for user answer
  | 'feedback' // Showing correct/incorrect
  | 'complete'; // Session finished

/**
 * Active session state
 */
export interface EarSchoolSession {
  lessonId: string;
  lesson: EarSchoolLessonDef;
  questions: EarSchoolQuestion[];
  currentIndex: number;
  answers: {
    questionId: string;
    answerId: string;
    correct: boolean;
    responseTimeMs: number;
  }[];
  state: EarSchoolSessionState;
  startedAt: string;
  challengeMode: boolean;
  timerSeconds?: number; // For challenge mode countdown
}

/**
 * Session result (after completion)
 */
export interface EarSchoolSessionResult {
  lessonId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage 0-100
  passed: boolean;
  mastered: boolean;
  aced: boolean;
  xpAwarded: number;
  isFirstPass: boolean;
  challengeMode: boolean;
}

/**
 * XP thresholds per PRD
 */
export const EAR_SCHOOL_XP = {
  LESSON_PASSED: 50, // 70-79%
  LESSON_MASTERED: 75, // 80-89%
  LESSON_ACED: 100, // 90%+
  SECTION_COMPLETED: 200, // Assessment 80%+
  GRADUATE_ACHIEVEMENT: 500, // All 4 sections completed
  CHALLENGE_MULTIPLIER: 1.5,
  REPEAT_MULTIPLIER: 0.25, // Subsequent attempts
} as const;

/**
 * Score thresholds
 */
export const EAR_SCHOOL_THRESHOLDS = {
  PASS: 70,
  MASTERED: 80,
  ACED: 90,
  ASSESSMENT_PASS: 80,
  CHALLENGE_PASS: 75,
  CHALLENGE_TRIGGER: 90, // Score to trigger challenge mode
  CHALLENGE_RESET: 85, // Score below this resets challenge mode
} as const;

/**
 * Challenge mode modifications
 */
export const CHALLENGE_MODE_CONFIG = {
  EXTRA_QUESTIONS: 5, // Add to base question count
  PITCH_TIMER_SECONDS: 10,
  RHYTHM_TIMER_SECONDS: 15,
  HINTS_DISABLED: true,
} as const;

/**
 * Key pools for exercises
 */
export const KEY_POOLS = {
  SECTION_1: ['C major', 'G major', 'F major', 'D major'],
  SECTION_2: ['C major', 'G major', 'D major', 'F major'],
  SECTION_3_MAJOR: ['C major', 'G major', 'D major', 'A major', 'E major', 'F major', 'Bb major', 'Eb major'],
  SECTION_3_MINOR: ['A minor', 'E minor', 'D minor', 'G minor'],
  SECTION_4: ['C major', 'G major', 'D major', 'F major', 'A minor', 'E minor'],
  ALL_MAJOR: [
    'C major',
    'G major',
    'D major',
    'A major',
    'E major',
    'B major',
    'F major',
    'Bb major',
    'Eb major',
    'Ab major',
    'Db major',
    'Gb major',
  ],
} as const;

/**
 * Helper: Get section number from lesson ID
 */
export function getSectionFromLessonId(lessonId: string): number {
  // Format: "ear-school-1.2" -> section 1
  const match = lessonId.match(/ear-school-(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Helper: Get lesson number from lesson ID
 */
export function getLessonNumberFromId(lessonId: string): number {
  // Format: "ear-school-1.2" -> lesson 2
  const match = lessonId.match(/ear-school-\d+\.(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Helper: Check if lesson is an assessment
 */
export function isAssessmentLesson(lessonId: string): boolean {
  return lessonId.includes('-assessment');
}

/**
 * Helper: Calculate XP for a session result
 */
export function calculateXP(result: EarSchoolSessionResult): number {
  let baseXP = 0;

  if (result.aced) {
    baseXP = EAR_SCHOOL_XP.LESSON_ACED;
  } else if (result.mastered) {
    baseXP = EAR_SCHOOL_XP.LESSON_MASTERED;
  } else if (result.passed) {
    baseXP = EAR_SCHOOL_XP.LESSON_PASSED;
  }

  // Apply challenge mode multiplier
  if (result.challengeMode) {
    baseXP = Math.floor(baseXP * EAR_SCHOOL_XP.CHALLENGE_MULTIPLIER);
  }

  // Apply repeat attempt penalty
  if (!result.isFirstPass) {
    baseXP = Math.floor(baseXP * EAR_SCHOOL_XP.REPEAT_MULTIPLIER);
  }

  return baseXP;
}
