import { create } from 'zustand';
import {
  ExerciseState,
  IntervalQuestion,
  IntervalAnswer,
  ExerciseConfig,
  SessionResults,
} from '../types/exercise';
import {
  Interval,
  STARTER_INTERVALS,
  randomInterval,
  randomMidiNote,
  areIntervalsSimilar,
} from '../utils/music';

interface ExerciseStore {
  // State
  state: ExerciseState;
  currentQuestion: IntervalQuestion | null;
  currentQuestionIndex: number;
  answers: IntervalAnswer[];
  config: ExerciseConfig;
  sessionResults: SessionResults | null;
  sessionStartTime: number | null;

  // Actions
  startSession: (config?: Partial<ExerciseConfig>) => void;
  generateQuestion: () => void;
  setPlaying: () => void;
  setAnswering: () => void;
  submitAnswer: (interval: Interval) => boolean;
  nextQuestion: () => void;
  endSession: () => void;
  resetSession: () => void;

  // Computed
  getProgress: () => { current: number; total: number };
  getScore: () => { correct: number; total: number; percentage: number };
}

const DEFAULT_CONFIG: ExerciseConfig = {
  questionCount: 10,
  availableIntervals: STARTER_INTERVALS,
  ascending: true,
  descending: false,
  melodic: true,
  harmonic: false,
  minMidi: 48, // C3
  maxMidi: 72, // C5
};

/**
 * Generate a unique ID for questions
 */
function generateId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a question that avoids being too similar to the previous one
 */
function createQuestion(
  config: ExerciseConfig,
  previousQuestion: IntervalQuestion | null
): IntervalQuestion {
  let interval: Interval;
  let attempts = 0;
  const maxAttempts = 10;

  // Try to avoid consecutive similar intervals
  do {
    interval = randomInterval(config.availableIntervals);
    attempts++;
  } while (
    previousQuestion &&
    areIntervalsSimilar(interval, previousQuestion.interval) &&
    attempts < maxAttempts
  );

  // Determine direction
  let ascending = true;
  if (config.ascending && config.descending) {
    ascending = Math.random() > 0.5;
  } else if (config.descending) {
    ascending = false;
  }

  // Determine melodic vs harmonic
  let melodic = true;
  if (config.melodic && config.harmonic) {
    melodic = Math.random() > 0.5;
  } else if (config.harmonic) {
    melodic = false;
  }

  // Generate root note, ensuring the interval stays within range
  const maxRoot = ascending
    ? config.maxMidi - interval
    : config.maxMidi;
  const minRoot = ascending
    ? config.minMidi
    : config.minMidi + interval;

  const rootMidi = randomMidiNote(
    Math.max(config.minMidi, minRoot),
    Math.min(config.maxMidi, maxRoot)
  );

  return {
    id: generateId(),
    rootMidi,
    interval,
    ascending,
    melodic,
  };
}

export const useExerciseStore = create<ExerciseStore>((set, get) => ({
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

  setPlaying: () => {
    set({ state: 'playing' });
  },

  setAnswering: () => {
    set({ state: 'answering' });
  },

  submitAnswer: (selectedInterval) => {
    const { currentQuestion, answers } = get();
    if (!currentQuestion) return false;

    const correct = selectedInterval === currentQuestion.interval;
    const answer: IntervalAnswer = {
      questionId: currentQuestion.id,
      selectedInterval,
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
      // End session
      get().endSession();
    } else {
      // Generate next question
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

    const results: SessionResults = {
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
