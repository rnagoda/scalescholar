/**
 * Voice Trainer Store
 *
 * Zustand store for managing voice training exercise sessions.
 */

import { create } from 'zustand';
import {
  VoiceExerciseType,
  VoiceExerciseState,
  VoiceExerciseQuestion,
  VoiceExerciseResult,
  VoiceAnalysisResult,
  DEFAULT_VOICE_THRESHOLDS,
} from '../types/voiceAnalyzer';
import { VoiceAnalyzer, calculatePitchAccuracy, isPitchOnTarget } from '../audio';
import { AudioEngine } from '../audio';
import { midiToFrequency } from '../utils/music';
import { saveVoiceAttempt, saveVoiceSession } from '../services/voiceProfileService';

interface VoiceTrainerState {
  // Session configuration
  exerciseType: VoiceExerciseType;
  questionsPerSession: number;

  // Exercise state
  state: VoiceExerciseState;
  currentQuestion: VoiceExerciseQuestion | null;
  questionIndex: number;

  // Target tracking
  targetNote: number | null;        // MIDI
  targetFrequency: number | null;   // Hz

  // Real-time detection
  currentPitch: number | null;      // MIDI
  currentFrequency: number | null;  // Hz
  currentAmplitude: number | null;  // dB
  currentAccuracy: number;          // 0-100
  isOnTarget: boolean;
  timeOnTarget: number;             // ms

  // For scales
  scaleNotes: number[];
  currentScaleIndex: number;

  // Session results
  sessionResults: VoiceExerciseResult[];
  sessionStartTime: number | null;

  // Actions
  startSession: (type: VoiceExerciseType, config?: {
    questionsPerSession?: number;
    availableNotes?: number[];
  }) => void;
  playReference: () => Promise<void>;
  startListening: () => Promise<void>;
  stopListening: () => void;
  submitResult: () => void;
  nextQuestion: () => void;
  completeSession: () => Promise<void>;
  resetSession: () => void;

  // Getters
  getProgress: () => { current: number; total: number };
  getScore: () => { correct: number; total: number };
}

// Default note range (middle C to G5) - will be overridden by voice profile
const DEFAULT_NOTE_RANGE = { min: 60, max: 79 };

// Time required on target to count as success (ms)
const TIME_ON_TARGET_THRESHOLD = 1000;

// Accuracy threshold to count as correct
const ACCURACY_THRESHOLD = 70;

// Timer for tracking time on target
let timeOnTargetTimer: ReturnType<typeof setInterval> | null = null;
let timeOnTargetStart: number | null = null;

export const useVoiceTrainerStore = create<VoiceTrainerState>((set, get) => ({
  // Initial state
  exerciseType: 'note_match',
  questionsPerSession: 10,
  state: 'ready',
  currentQuestion: null,
  questionIndex: 0,
  targetNote: null,
  targetFrequency: null,
  currentPitch: null,
  currentFrequency: null,
  currentAmplitude: null,
  currentAccuracy: 0,
  isOnTarget: false,
  timeOnTarget: 0,
  scaleNotes: [],
  currentScaleIndex: 0,
  sessionResults: [],
  sessionStartTime: null,

  startSession: (type, config = {}) => {
    const questionsPerSession = config.questionsPerSession ?? 10;

    // Generate first question
    const availableNotes = config.availableNotes ?? [];
    const question = generateQuestion(type, availableNotes);

    set({
      exerciseType: type,
      questionsPerSession,
      state: 'ready',
      currentQuestion: question,
      questionIndex: 0,
      targetNote: question.targetNote,
      targetFrequency: midiToFrequency(question.targetNote),
      currentPitch: null,
      currentFrequency: null,
      currentAmplitude: null,
      currentAccuracy: 0,
      isOnTarget: false,
      timeOnTarget: 0,
      scaleNotes: question.scaleNotes ?? [],
      currentScaleIndex: 0,
      sessionResults: [],
      sessionStartTime: Date.now(),
    });
  },

  playReference: async () => {
    const { targetNote, targetFrequency, state } = get();
    if (targetFrequency === null || state === 'playing') return;

    set({ state: 'playing' });

    try {
      // Play reference tone for 1.5 seconds
      await AudioEngine.playMidiNote(targetNote ?? 60, 1.5);
    } catch (error) {
      console.error('Failed to play reference:', error);
    }

    set({ state: 'ready' });
  },

  startListening: async () => {
    const { targetFrequency } = get();
    if (targetFrequency === null) return;

    // Reset tracking
    set({
      state: 'listening',
      currentAccuracy: 0,
      isOnTarget: false,
      timeOnTarget: 0,
    });
    timeOnTargetStart = null;

    // Start time tracking timer
    timeOnTargetTimer = setInterval(() => {
      const state = get();
      if (!state.isOnTarget || timeOnTargetStart === null) return;

      const elapsed = Date.now() - timeOnTargetStart;
      set({ timeOnTarget: elapsed });

      // Auto-submit if held long enough
      if (elapsed >= TIME_ON_TARGET_THRESHOLD) {
        get().submitResult();
      }
    }, 50);

    try {
      await VoiceAnalyzer.startListening(
        (result: VoiceAnalysisResult) => {
          // Use VoiceAnalyzer's state as the source of truth
          if (!VoiceAnalyzer.isListening()) return;

          const state = get();
          const { targetFrequency: target } = state;
          if (target === null) return;

          // Update current readings
          const pitch = result.pitch?.midiNote ?? null;
          const frequency = result.pitch?.frequency ?? null;
          const amplitude = result.amplitude.db;

          // Calculate accuracy if we have pitch
          let accuracy = 0;
          let onTarget = false;

          if (frequency !== null && amplitude >= DEFAULT_VOICE_THRESHOLDS.minVoiceDb) {
            accuracy = calculatePitchAccuracy(target, frequency);
            onTarget = isPitchOnTarget(target, frequency);
          }

          // Track time on target
          if (onTarget && timeOnTargetStart === null) {
            timeOnTargetStart = Date.now();
          } else if (!onTarget) {
            timeOnTargetStart = null;
          }

          set({
            currentPitch: pitch,
            currentFrequency: frequency,
            currentAmplitude: amplitude,
            currentAccuracy: accuracy,
            isOnTarget: onTarget,
          });
        },
        (error) => {
          console.error('Voice analyzer error:', error);
          set({ state: 'ready' });
        },
        (analyzerState) => {
          if (analyzerState === 'error') {
            set({ state: 'ready' });
          }
        }
      );
    } catch (error) {
      console.error('Failed to start listening:', error);
      set({ state: 'ready' });
    }
  },

  stopListening: () => {
    VoiceAnalyzer.stopListening();

    if (timeOnTargetTimer) {
      clearInterval(timeOnTargetTimer);
      timeOnTargetTimer = null;
    }
    timeOnTargetStart = null;

    set({
      state: 'ready',
      currentPitch: null,
      currentFrequency: null,
      currentAmplitude: null,
    });
  },

  submitResult: () => {
    const {
      currentQuestion,
      currentAccuracy,
      timeOnTarget,
      sessionResults,
    } = get();

    // Stop listening
    VoiceAnalyzer.stopListening();
    if (timeOnTargetTimer) {
      clearInterval(timeOnTargetTimer);
      timeOnTargetTimer = null;
    }

    if (!currentQuestion) return;

    // Determine success
    const success = currentAccuracy >= ACCURACY_THRESHOLD && timeOnTarget >= TIME_ON_TARGET_THRESHOLD;

    // Create result
    const result: VoiceExerciseResult = {
      question: currentQuestion,
      accuracy: currentAccuracy,
      timeOnTarget,
      volumeConsistency: 100, // TODO: implement volume tracking
      success,
      timestamp: Date.now(),
    };

    // Save attempt to database
    saveVoiceAttempt(result).catch((error) => {
      console.error('Failed to save voice attempt:', error);
    });

    set({
      state: 'feedback',
      sessionResults: [...sessionResults, result],
    });
  },

  nextQuestion: () => {
    const {
      questionIndex,
      questionsPerSession,
      exerciseType,
      sessionResults,
    } = get();

    const nextIndex = questionIndex + 1;

    // Check if session is complete
    if (nextIndex >= questionsPerSession) {
      set({ state: 'complete' });
      return;
    }

    // Generate next question using the comfortable range from recent results
    // For simplicity, using default range for now
    const question = generateQuestion(exerciseType, []);

    set({
      state: 'ready',
      currentQuestion: question,
      questionIndex: nextIndex,
      targetNote: question.targetNote,
      targetFrequency: midiToFrequency(question.targetNote),
      currentPitch: null,
      currentFrequency: null,
      currentAmplitude: null,
      currentAccuracy: 0,
      isOnTarget: false,
      timeOnTarget: 0,
      scaleNotes: question.scaleNotes ?? [],
      currentScaleIndex: 0,
    });
  },

  completeSession: async () => {
    const { exerciseType, sessionResults, questionsPerSession, sessionStartTime } = get();

    const correctCount = sessionResults.filter((r) => r.success).length;
    const averageAccuracy =
      sessionResults.reduce((sum, r) => sum + r.accuracy, 0) / sessionResults.length;
    const durationSeconds = sessionStartTime
      ? Math.round((Date.now() - sessionStartTime) / 1000)
      : 0;

    try {
      await saveVoiceSession({
        exerciseType,
        questionsCount: questionsPerSession,
        correctCount,
        averageAccuracy,
        durationSeconds,
        completedAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to save voice session:', error);
    }
  },

  resetSession: () => {
    VoiceAnalyzer.stopListening();

    if (timeOnTargetTimer) {
      clearInterval(timeOnTargetTimer);
      timeOnTargetTimer = null;
    }

    set({
      state: 'ready',
      currentQuestion: null,
      questionIndex: 0,
      targetNote: null,
      targetFrequency: null,
      currentPitch: null,
      currentFrequency: null,
      currentAmplitude: null,
      currentAccuracy: 0,
      isOnTarget: false,
      timeOnTarget: 0,
      scaleNotes: [],
      currentScaleIndex: 0,
      sessionResults: [],
      sessionStartTime: null,
    });
  },

  getProgress: () => {
    const { questionIndex, questionsPerSession } = get();
    return { current: questionIndex + 1, total: questionsPerSession };
  },

  getScore: () => {
    const { sessionResults } = get();
    const correct = sessionResults.filter((r) => r.success).length;
    return { correct, total: sessionResults.length };
  },
}));

/**
 * Generate a random question based on exercise type
 */
function generateQuestion(
  type: VoiceExerciseType,
  availableNotes: number[]
): VoiceExerciseQuestion {
  // Use available notes or default range
  const notes =
    availableNotes.length > 0
      ? availableNotes
      : Array.from(
          { length: DEFAULT_NOTE_RANGE.max - DEFAULT_NOTE_RANGE.min + 1 },
          (_, i) => DEFAULT_NOTE_RANGE.min + i
        );

  switch (type) {
    case 'note_match': {
      const targetNote = notes[Math.floor(Math.random() * notes.length)];
      return {
        type: 'note_match',
        targetNote,
      };
    }

    case 'scale': {
      // Generate a major scale starting from a random note in lower range
      const lowerNotes = notes.filter((n) => n <= notes[Math.floor(notes.length / 2)]);
      const rootNote = lowerNotes[Math.floor(Math.random() * lowerNotes.length)];
      const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11, 12];
      const scaleNotes = majorScaleIntervals.map((i) => rootNote + i);

      return {
        type: 'scale',
        targetNote: scaleNotes[0],
        scaleNotes,
      };
    }

    case 'glide': {
      // Pick two notes at least a third apart
      const startNote = notes[Math.floor(Math.random() * (notes.length - 4))];
      const endNote = startNote + 3 + Math.floor(Math.random() * 5); // 3-7 semitones apart

      return {
        type: 'glide',
        targetNote: startNote,
        endNote,
      };
    }

    case 'sustain': {
      const targetNote = notes[Math.floor(Math.random() * notes.length)];
      return {
        type: 'sustain',
        targetNote,
        duration: 3000, // 3 seconds
      };
    }

    default:
      return {
        type: 'note_match',
        targetNote: 60, // Middle C fallback
      };
  }
}
