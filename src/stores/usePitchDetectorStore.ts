/**
 * Pitch Detector Store
 *
 * Zustand store for managing pitch detector state with mode-specific smoothing
 */

import { create } from 'zustand';
import {
  PitchResult,
  PitchDetectorState,
  PitchDetectorConfig,
  DEFAULT_PITCH_DETECTOR_CONFIG,
} from '../types/pitchDetector';
import { InstrumentTuning, PitchDetectorMode } from '../types/guitarTuning';
import { PitchDetector } from '../audio';
import { PitchSmoother, SmoothingMode } from '../utils/pitchSmoothing';

interface PitchDetectorStore {
  // State
  state: PitchDetectorState;
  currentPitch: PitchResult | null;
  smoothedPitch: PitchResult | null;
  pitchHistory: PitchResult[];
  errorMessage: string | null;

  // Smoothing state
  smoothingMode: SmoothingMode;
  currentTuning: InstrumentTuning | null;

  // Configuration
  config: PitchDetectorConfig;

  // Actions
  startListening: () => Promise<void>;
  stopListening: () => void;
  updateConfig: (config: Partial<PitchDetectorConfig>) => void;
  setA4Frequency: (frequency: number) => void;
  setSmoothingMode: (mode: SmoothingMode) => void;
  setCurrentTuning: (tuning: InstrumentTuning | null) => void;
  reset: () => void;

  // Internal actions (called by PitchDetector callbacks)
  _onPitchDetected: (result: PitchResult) => void;
  _onError: (error: string) => void;
  _onStateChange: (state: PitchDetectorState) => void;
}

const HISTORY_SIZE = 5; // Keep last N pitch results

// Singleton smoother instance - kept outside store for performance
const pitchSmoother = new PitchSmoother('voice');

export const usePitchDetectorStore = create<PitchDetectorStore>((set, get) => ({
  // Initial state
  state: 'idle',
  currentPitch: null,
  smoothedPitch: null,
  pitchHistory: [],
  errorMessage: null,
  smoothingMode: 'voice',
  currentTuning: null,
  config: { ...DEFAULT_PITCH_DETECTOR_CONFIG },

  // Start listening for pitch
  startListening: async () => {
    const store = get();

    // Apply current config to detector and smoother
    PitchDetector.setConfig(store.config);
    pitchSmoother.setA4Frequency(store.config.a4Frequency);
    pitchSmoother.reset();

    try {
      await PitchDetector.startListening(
        store._onPitchDetected,
        store._onError,
        store._onStateChange
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to start listening';
      set({ state: 'error', errorMessage });
    }
  },

  // Stop listening
  stopListening: () => {
    PitchDetector.stopListening();
    pitchSmoother.reset();
    set({
      state: 'idle',
      currentPitch: null,
      smoothedPitch: null,
      pitchHistory: [],
    });
  },

  // Update configuration
  updateConfig: (newConfig) => {
    const updatedConfig = { ...get().config, ...newConfig };
    set({ config: updatedConfig });
    PitchDetector.setConfig(updatedConfig);
    if (newConfig.a4Frequency) {
      pitchSmoother.setA4Frequency(newConfig.a4Frequency);
    }
  },

  // Set A4 reference frequency
  setA4Frequency: (frequency) => {
    const updatedConfig = { ...get().config, a4Frequency: frequency };
    set({ config: updatedConfig });
    PitchDetector.setA4Frequency(frequency);
    pitchSmoother.setA4Frequency(frequency);
  },

  // Set smoothing mode (voice or instrument)
  setSmoothingMode: (mode) => {
    set({ smoothingMode: mode });
    pitchSmoother.setMode(mode);
  },

  // Set current tuning for instrument mode hysteresis
  setCurrentTuning: (tuning) => {
    set({ currentTuning: tuning });
  },

  // Reset to initial state
  reset: () => {
    PitchDetector.stopListening();
    pitchSmoother.reset();
    set({
      state: 'idle',
      currentPitch: null,
      smoothedPitch: null,
      pitchHistory: [],
      errorMessage: null,
    });
  },

  // Internal: Handle pitch detection result
  _onPitchDetected: (result) => {
    const { pitchHistory, currentTuning } = get();

    // Apply smoothing based on current mode
    const smoothedResult = pitchSmoother.process(result, currentTuning ?? undefined);

    // Add to history and keep last N results
    const newHistory = [...pitchHistory, result].slice(-HISTORY_SIZE);

    set({
      currentPitch: result,
      smoothedPitch: smoothedResult,
      pitchHistory: newHistory,
    });
  },

  // Internal: Handle error
  _onError: (error) => {
    set({
      state: 'error',
      errorMessage: error,
    });
  },

  // Internal: Handle state change
  _onStateChange: (newState) => {
    set({ state: newState });

    // Clear error message when leaving error state
    if (newState !== 'error') {
      set({ errorMessage: null });
    }
  },
}));

/**
 * Get the locked string number from the smoother (for instrument mode)
 */
export function getLockedStringNumber(): number | null {
  return pitchSmoother.getLockedStringNumber();
}
