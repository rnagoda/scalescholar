/**
 * Pitch Detector Store
 *
 * Zustand store for managing pitch detector state
 */

import { create } from 'zustand';
import {
  PitchResult,
  PitchDetectorState,
  PitchDetectorConfig,
  DEFAULT_PITCH_DETECTOR_CONFIG,
} from '../types/pitchDetector';
import { PitchDetector } from '../audio';

interface PitchDetectorStore {
  // State
  state: PitchDetectorState;
  currentPitch: PitchResult | null;
  pitchHistory: PitchResult[];
  errorMessage: string | null;

  // Configuration
  config: PitchDetectorConfig;

  // Actions
  startListening: () => Promise<void>;
  stopListening: () => void;
  updateConfig: (config: Partial<PitchDetectorConfig>) => void;
  setA4Frequency: (frequency: number) => void;
  reset: () => void;

  // Internal actions (called by PitchDetector callbacks)
  _onPitchDetected: (result: PitchResult) => void;
  _onError: (error: string) => void;
  _onStateChange: (state: PitchDetectorState) => void;
}

const HISTORY_SIZE = 5; // Keep last N pitch results for smoothing

export const usePitchDetectorStore = create<PitchDetectorStore>((set, get) => ({
  // Initial state
  state: 'idle',
  currentPitch: null,
  pitchHistory: [],
  errorMessage: null,
  config: { ...DEFAULT_PITCH_DETECTOR_CONFIG },

  // Start listening for pitch
  startListening: async () => {
    const store = get();

    // Apply current config to detector
    PitchDetector.setConfig(store.config);

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
    set({
      state: 'idle',
      currentPitch: null,
      pitchHistory: [],
    });
  },

  // Update configuration
  updateConfig: (newConfig) => {
    const updatedConfig = { ...get().config, ...newConfig };
    set({ config: updatedConfig });
    PitchDetector.setConfig(updatedConfig);
  },

  // Set A4 reference frequency
  setA4Frequency: (frequency) => {
    const updatedConfig = { ...get().config, a4Frequency: frequency };
    set({ config: updatedConfig });
    PitchDetector.setA4Frequency(frequency);
  },

  // Reset to initial state
  reset: () => {
    PitchDetector.stopListening();
    set({
      state: 'idle',
      currentPitch: null,
      pitchHistory: [],
      errorMessage: null,
    });
  },

  // Internal: Handle pitch detection result
  _onPitchDetected: (result) => {
    const { pitchHistory } = get();

    // Add to history and keep last N results
    const newHistory = [...pitchHistory, result].slice(-HISTORY_SIZE);

    set({
      currentPitch: result,
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
