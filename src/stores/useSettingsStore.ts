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

  // Voice training settings
  inputSensitivity: number; // Microphone gain multiplier (0.5 - 2.0)

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
  setInputSensitivity: (sensitivity: number) => void;
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
  inputSensitivity: 1.0,
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

/**
 * Valid input sensitivity range (microphone gain)
 */
export const MIN_INPUT_SENSITIVITY = 0.5;
export const MAX_INPUT_SENSITIVITY = 2.0;
export const INPUT_SENSITIVITY_STEP = 0.1;

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

      setInputSensitivity: (sensitivity) => {
        const clampedSensitivity = Math.max(
          MIN_INPUT_SENSITIVITY,
          Math.min(MAX_INPUT_SENSITIVITY, sensitivity)
        );
        set({ inputSensitivity: clampedSensitivity });
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
        inputSensitivity: state.inputSensitivity,
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
