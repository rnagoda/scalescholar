import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SynthType } from '../types/audio';

/**
 * Interval playback mode
 */
export type IntervalDirection = 'ascending' | 'descending' | 'mixed';
export type IntervalPlayback = 'melodic' | 'harmonic';

/**
 * Scale degree label display
 */
export type ScaleDegreeLabelType = 'numbers' | 'solfege';

/**
 * Settings state interface
 */
interface SettingsState {
  // Audio settings
  instrument: SynthType;
  referencePitch: number; // A4 frequency in Hz

  // Exercise settings
  questionsPerSession: number;
  autoPlayNext: boolean;

  // Interval trainer settings
  intervalDirection: IntervalDirection;
  intervalPlayback: IntervalPlayback;

  // Scale degree trainer settings
  scaleDegreeLabels: ScaleDegreeLabelType;

  // Feedback settings
  hapticFeedback: boolean;

  // Actions
  setInstrument: (instrument: SynthType) => void;
  setReferencePitch: (pitch: number) => void;
  setQuestionsPerSession: (count: number) => void;
  setAutoPlayNext: (enabled: boolean) => void;
  setIntervalDirection: (direction: IntervalDirection) => void;
  setIntervalPlayback: (playback: IntervalPlayback) => void;
  setScaleDegreeLabels: (labels: ScaleDegreeLabelType) => void;
  setHapticFeedback: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

/**
 * Default settings values
 */
const DEFAULT_SETTINGS = {
  instrument: 'piano' as SynthType,
  referencePitch: 440,
  questionsPerSession: 10,
  autoPlayNext: false,
  intervalDirection: 'ascending' as IntervalDirection,
  intervalPlayback: 'melodic' as IntervalPlayback,
  scaleDegreeLabels: 'numbers' as ScaleDegreeLabelType,
  hapticFeedback: true,
};

/**
 * Valid reference pitch range (concert pitch variations)
 */
export const MIN_REFERENCE_PITCH = 415; // Baroque pitch
export const MAX_REFERENCE_PITCH = 466; // High pitch
export const REFERENCE_PITCH_STEP = 1;

/**
 * Valid questions per session range
 */
export const MIN_QUESTIONS = 5;
export const MAX_QUESTIONS = 25;
export const QUESTIONS_STEP = 5;

/**
 * Available question count options
 */
export const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 25];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setInstrument: (instrument) => set({ instrument }),

      setReferencePitch: (pitch) => {
        const clampedPitch = Math.max(
          MIN_REFERENCE_PITCH,
          Math.min(MAX_REFERENCE_PITCH, pitch)
        );
        set({ referencePitch: clampedPitch });
      },

      setQuestionsPerSession: (count) => {
        const clampedCount = Math.max(
          MIN_QUESTIONS,
          Math.min(MAX_QUESTIONS, count)
        );
        set({ questionsPerSession: clampedCount });
      },

      setAutoPlayNext: (enabled) => set({ autoPlayNext: enabled }),

      setIntervalDirection: (direction) => set({ intervalDirection: direction }),

      setIntervalPlayback: (playback) => set({ intervalPlayback: playback }),

      setScaleDegreeLabels: (labels) => set({ scaleDegreeLabels: labels }),

      setHapticFeedback: (enabled) => set({ hapticFeedback: enabled }),

      resetToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'scale-scholar-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        instrument: state.instrument,
        referencePitch: state.referencePitch,
        questionsPerSession: state.questionsPerSession,
        autoPlayNext: state.autoPlayNext,
        intervalDirection: state.intervalDirection,
        intervalPlayback: state.intervalPlayback,
        scaleDegreeLabels: state.scaleDegreeLabels,
        hapticFeedback: state.hapticFeedback,
      }),
    }
  )
);
