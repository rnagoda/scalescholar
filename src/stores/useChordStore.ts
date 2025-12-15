import { create } from 'zustand';
import {
  ChordQuality,
  STARTER_CHORD_QUALITIES,
  randomChordQuality,
  areChordQualitiesSame,
  randomMidiNote,
} from '../utils/music';

export type ChordExerciseState =
  | 'ready'
  | 'playing'
  | 'answering'
  | 'feedback'
  | 'complete';

export interface ChordQuestion {
  id: string;
  rootMidi: number;
  chordQuality: ChordQuality;
}

export interface ChordAnswer {
  questionId: string;
  selectedQuality: ChordQuality;
  correct: boolean;
  answeredAt: number;
}

export interface ChordConfig {
  questionCount: number;
  availableQualities: ChordQuality[];
  minRootMidi: number;
  maxRootMidi: number;
}

export interface ChordSessionResults {
  totalQuestions: number;
  correctAnswers: number;
  answers: ChordAnswer[];
  startedAt: number;
  completedAt: number;
}

interface ChordStore {
  // State
  state: ChordExerciseState;
  currentQuestion: ChordQuestion | null;
  currentQuestionIndex: number;
  answers: ChordAnswer[];
  config: ChordConfig;
  sessionResults: ChordSessionResults | null;
  sessionStartTime: number | null;

  // Actions
  startSession: (config?: Partial<ChordConfig>) => void;
  generateQuestion: () => void;
  setPlaying: () => void;
  setAnswering: () => void;
  submitAnswer: (quality: ChordQuality) => boolean;
  nextQuestion: () => void;
  endSession: () => void;
  resetSession: () => void;

  // Computed
  getProgress: () => { current: number; total: number };
  getScore: () => { correct: number; total: number; percentage: number };
}

const DEFAULT_CONFIG: ChordConfig = {
  questionCount: 10,
  availableQualities: STARTER_CHORD_QUALITIES,
  minRootMidi: 48, // C3
  maxRootMidi: 60, // C4
};

function generateId(): string {
  return `chord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createQuestion(
  config: ChordConfig,
  previousQuestion: ChordQuestion | null
): ChordQuestion {
  let quality: ChordQuality;
  let attempts = 0;
  const maxAttempts = 10;

  // Try to avoid consecutive same qualities
  do {
    quality = randomChordQuality(config.availableQualities);
    attempts++;
  } while (
    previousQuestion &&
    areChordQualitiesSame(quality, previousQuestion.chordQuality) &&
    attempts < maxAttempts
  );

  // Random root within range
  const rootMidi = randomMidiNote(config.minRootMidi, config.maxRootMidi);

  return {
    id: generateId(),
    rootMidi,
    chordQuality: quality,
  };
}

export const useChordStore = create<ChordStore>((set, get) => ({
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

  submitAnswer: (selectedQuality) => {
    const { currentQuestion, answers } = get();
    if (!currentQuestion) return false;

    const correct = selectedQuality === currentQuestion.chordQuality;
    const answer: ChordAnswer = {
      questionId: currentQuestion.id,
      selectedQuality,
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

    const results: ChordSessionResults = {
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
