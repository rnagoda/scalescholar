import { create } from 'zustand';
import {
  ScaleDegree,
  KeyContextType,
  STARTER_SCALE_DEGREES,
  randomScaleDegree,
  areScaleDegreesSimilar,
  randomMidiNote,
} from '../utils/music';

export type ScaleDegreeExerciseState =
  | 'ready'
  | 'playing_context'
  | 'playing_degree'
  | 'answering'
  | 'feedback'
  | 'complete';

export interface ScaleDegreeQuestion {
  id: string;
  keyRootMidi: number;
  scaleDegree: ScaleDegree;
  octaveOffset: number;
  contextType: KeyContextType;
}

export interface ScaleDegreeAnswer {
  questionId: string;
  selectedDegree: ScaleDegree;
  correct: boolean;
  answeredAt: number;
}

export interface ScaleDegreeConfig {
  questionCount: number;
  availableDegrees: ScaleDegree[];
  contextType: KeyContextType;
  useSolfege: boolean;
  minKeyMidi: number;
  maxKeyMidi: number;
}

export interface ScaleDegreeSessionResults {
  totalQuestions: number;
  correctAnswers: number;
  answers: ScaleDegreeAnswer[];
  startedAt: number;
  completedAt: number;
}

interface ScaleDegreeStore {
  // State
  state: ScaleDegreeExerciseState;
  currentQuestion: ScaleDegreeQuestion | null;
  currentQuestionIndex: number;
  answers: ScaleDegreeAnswer[];
  config: ScaleDegreeConfig;
  sessionResults: ScaleDegreeSessionResults | null;
  sessionStartTime: number | null;

  // Actions
  startSession: (config?: Partial<ScaleDegreeConfig>) => void;
  generateQuestion: () => void;
  setPlayingContext: () => void;
  setPlayingDegree: () => void;
  setAnswering: () => void;
  submitAnswer: (degree: ScaleDegree) => boolean;
  nextQuestion: () => void;
  endSession: () => void;
  resetSession: () => void;

  // Computed
  getProgress: () => { current: number; total: number };
  getScore: () => { correct: number; total: number; percentage: number };
}

const DEFAULT_CONFIG: ScaleDegreeConfig = {
  questionCount: 10,
  availableDegrees: STARTER_SCALE_DEGREES,
  contextType: 'triad',
  useSolfege: false,
  minKeyMidi: 48, // C3
  maxKeyMidi: 60, // C4
};

function generateId(): string {
  return `sd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createQuestion(
  config: ScaleDegreeConfig,
  previousQuestion: ScaleDegreeQuestion | null
): ScaleDegreeQuestion {
  let degree: ScaleDegree;
  let attempts = 0;
  const maxAttempts = 10;

  // Try to avoid consecutive similar degrees
  do {
    degree = randomScaleDegree(config.availableDegrees);
    attempts++;
  } while (
    previousQuestion &&
    areScaleDegreesSimilar(degree, previousQuestion.scaleDegree) &&
    attempts < maxAttempts
  );

  // Random key within range
  const keyRootMidi = randomMidiNote(config.minKeyMidi, config.maxKeyMidi);

  // Determine octave offset (keep within playable range)
  // For now, always play in the same octave as the key
  const octaveOffset = 0;

  return {
    id: generateId(),
    keyRootMidi,
    scaleDegree: degree,
    octaveOffset,
    contextType: config.contextType,
  };
}

export const useScaleDegreeStore = create<ScaleDegreeStore>((set, get) => ({
  // Initial state
  state: 'ready',
  currentQuestion: null,
  currentQuestionIndex: 0,
  answers: [],
  config: DEFAULT_CONFIG,
  sessionResults: null,
  sessionStartTime: null,

  // Actions
  startSession: (configOverrides) => {
    const config = { ...DEFAULT_CONFIG, ...configOverrides };
    const firstQuestion = createQuestion(config, null);

    set({
      state: 'ready',
      currentQuestion: firstQuestion,
      currentQuestionIndex: 0,
      answers: [],
      config,
      sessionResults: null,
      sessionStartTime: Date.now(),
    });
  },

  generateQuestion: () => {
    const { config, currentQuestion } = get();
    const newQuestion = createQuestion(config, currentQuestion);

    set({
      currentQuestion: newQuestion,
      state: 'ready',
    });
  },

  setPlayingContext: () => {
    set({ state: 'playing_context' });
  },

  setPlayingDegree: () => {
    set({ state: 'playing_degree' });
  },

  setAnswering: () => {
    set({ state: 'answering' });
  },

  submitAnswer: (selectedDegree) => {
    const { currentQuestion, answers } = get();
    if (!currentQuestion) return false;

    const correct = selectedDegree === currentQuestion.scaleDegree;
    const answer: ScaleDegreeAnswer = {
      questionId: currentQuestion.id,
      selectedDegree,
      correct,
      answeredAt: Date.now(),
    };

    set({
      answers: [...answers, answer],
      state: 'feedback',
    });

    return correct;
  },

  nextQuestion: () => {
    const { currentQuestionIndex, config, currentQuestion } = get();
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= config.questionCount) {
      get().endSession();
    } else {
      const nextQuestion = createQuestion(config, currentQuestion);
      set({
        currentQuestionIndex: nextIndex,
        currentQuestion: nextQuestion,
        state: 'ready',
      });
    }
  },

  endSession: () => {
    const { answers, config, sessionStartTime } = get();
    const correctCount = answers.filter((a) => a.correct).length;

    const results: ScaleDegreeSessionResults = {
      totalQuestions: config.questionCount,
      correctAnswers: correctCount,
      answers,
      startedAt: sessionStartTime ?? Date.now(),
      completedAt: Date.now(),
    };

    set({
      state: 'complete',
      sessionResults: results,
    });
  },

  resetSession: () => {
    set({
      state: 'ready',
      currentQuestion: null,
      currentQuestionIndex: 0,
      answers: [],
      sessionResults: null,
      sessionStartTime: null,
    });
  },

  // Computed
  getProgress: () => {
    const { currentQuestionIndex, config } = get();
    return {
      current: currentQuestionIndex + 1,
      total: config.questionCount,
    };
  },

  getScore: () => {
    const { answers } = get();
    const correct = answers.filter((a) => a.correct).length;
    const total = answers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { correct, total, percentage };
  },
}));
