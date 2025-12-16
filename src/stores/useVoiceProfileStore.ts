/**
 * Voice Profile Store
 *
 * Zustand store for managing voice range profile assessment and state.
 */

import { create } from 'zustand';
import {
  VoiceRangeProfile,
  VoiceAnalysisResult,
  VRPAssessmentStep,
  DEFAULT_VOICE_THRESHOLDS,
} from '../types/voiceAnalyzer';
import {
  saveVoiceProfile,
  loadVoiceProfile,
  hasVoiceProfile,
  deleteVoiceProfile,
} from '../services/voiceProfileService';
import { VoiceAnalyzer } from '../audio';
import { midiToNoteName } from '../utils/music';
import { useSettingsStore } from './useSettingsStore';

interface VoiceProfileState {
  // Profile state
  profile: VoiceRangeProfile | null;
  hasProfile: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Assessment state
  isAssessing: boolean;
  assessmentStep: VRPAssessmentStep;

  // Temporary assessment data
  detectedLowest: number | null;
  detectedHighest: number | null;
  detectedComfortLow: number | null;
  detectedComfortHigh: number | null;
  detectedSoftest: number | null;
  detectedLoudest: number | null;

  // Real-time tracking during assessment
  currentPitch: number | null;     // MIDI
  currentAmplitude: number | null; // dB
  isListening: boolean;
  errorMessage: string | null;

  // Actions
  initialize: () => Promise<void>;
  loadProfile: () => Promise<void>;

  // Assessment actions
  startAssessment: () => void;
  setAssessmentStep: (step: VRPAssessmentStep) => void;
  startListening: () => Promise<void>;
  stopListening: () => void;

  // Assessment confirmations
  confirmLowest: () => void;
  confirmHighest: () => void;
  confirmComfortableLow: () => void;
  confirmComfortableHigh: () => void;

  // Save and finalize
  saveProfile: () => Promise<void>;
  resetAssessment: () => void;
  deleteProfile: () => Promise<void>;

  // Helpers
  getProfileSummary: () => string | null;
  getRangeOctaves: () => number;
  getComfortableRangeOctaves: () => number;
}

const INITIAL_ASSESSMENT_STATE = {
  isAssessing: false,
  assessmentStep: 'intro' as VRPAssessmentStep,
  detectedLowest: null,
  detectedHighest: null,
  detectedComfortLow: null,
  detectedComfortHigh: null,
  detectedSoftest: null,
  detectedLoudest: null,
  currentPitch: null,
  currentAmplitude: null,
  isListening: false,
  errorMessage: null,
};

export const useVoiceProfileStore = create<VoiceProfileState>((set, get) => ({
  // Initial state
  profile: null,
  hasProfile: false,
  isLoading: false,
  isInitialized: false,
  ...INITIAL_ASSESSMENT_STATE,

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });
    try {
      const exists = await hasVoiceProfile();
      set({ hasProfile: exists });

      if (exists) {
        const profile = await loadVoiceProfile();
        set({ profile });
      }

      set({ isInitialized: true });
    } catch (error) {
      console.error('Failed to initialize voice profile store:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadProfile: async () => {
    set({ isLoading: true });
    try {
      const profile = await loadVoiceProfile();
      set({
        profile,
        hasProfile: profile !== null,
      });
    } catch (error) {
      console.error('Failed to load voice profile:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  startAssessment: () => {
    set({
      isAssessing: true,
      assessmentStep: 'intro',
      detectedLowest: null,
      detectedHighest: null,
      detectedComfortLow: null,
      detectedComfortHigh: null,
      detectedSoftest: null,
      detectedLoudest: null,
      errorMessage: null,
    });
  },

  setAssessmentStep: (step: VRPAssessmentStep) => {
    // Stop listening when changing steps
    const { isListening } = get();
    if (isListening) {
      VoiceAnalyzer.stopListening();
    }

    // Clear detected values when going back to re-do a step
    const clearValues: Partial<VoiceProfileState> = {
      assessmentStep: step,
      isListening: false,
      currentPitch: null,
      currentAmplitude: null,
    };

    // Clear the relevant detected value when going back to that step
    switch (step) {
      case 'lowest':
        clearValues.detectedLowest = null;
        break;
      case 'highest':
        clearValues.detectedHighest = null;
        break;
      case 'comfortable_low':
        clearValues.detectedComfortLow = null;
        break;
      case 'comfortable_high':
        clearValues.detectedComfortHigh = null;
        break;
    }

    set(clearValues);
  },

  startListening: async () => {
    const { assessmentStep, detectedLowest, detectedHighest, detectedSoftest, detectedLoudest } = get();

    // Set listening true immediately before starting
    set({ isListening: true, errorMessage: null });

    // Apply input sensitivity from settings before starting
    const inputSensitivity = useSettingsStore.getState().inputSensitivity;
    VoiceAnalyzer.setInputSensitivity(inputSensitivity);

    try {
      await VoiceAnalyzer.startListening(
        (result: VoiceAnalysisResult) => {
          // Check if we're still supposed to be listening
          // Use VoiceAnalyzer's state as the source of truth
          if (!VoiceAnalyzer.isListening()) return;

          // Get current store state
          const storeState = get();

          // Update current readings
          const currentPitch = result.pitch?.midiNote ?? null;
          const currentAmplitude = result.amplitude.db;

          set({
            currentPitch,
            currentAmplitude,
          });

          // Track extremes based on current step
          // Filter to reasonable human vocal range: C2 (36) to C7 (96)
          const MIN_VOCAL_MIDI = 36; // C2 (~65Hz)
          const MAX_VOCAL_MIDI = 96; // C7 (~2093Hz)
          const isInVocalRange = currentPitch !== null &&
            currentPitch >= MIN_VOCAL_MIDI &&
            currentPitch <= MAX_VOCAL_MIDI;

          if (isInVocalRange && currentAmplitude >= DEFAULT_VOICE_THRESHOLDS.minVoiceDb) {
            switch (storeState.assessmentStep) {
              case 'lowest':
                // Track lowest pitch found (must be lower than current detected)
                if (storeState.detectedLowest === null || currentPitch < storeState.detectedLowest) {
                  set({ detectedLowest: currentPitch });
                }
                break;

              case 'highest':
                // Track highest pitch found (must be higher than current detected)
                if (storeState.detectedHighest === null || currentPitch > storeState.detectedHighest) {
                  set({ detectedHighest: currentPitch });
                }
                break;

              case 'comfortable_low':
                // Track as user sings comfortably low
                set({ detectedComfortLow: currentPitch });
                break;

              case 'comfortable_high':
                // Track as user sings comfortably high
                set({ detectedComfortHigh: currentPitch });
                break;
            }

            // Always track dynamic range
            if (storeState.detectedSoftest === null || currentAmplitude < storeState.detectedSoftest) {
              set({ detectedSoftest: currentAmplitude });
            }
            if (storeState.detectedLoudest === null || currentAmplitude > storeState.detectedLoudest) {
              set({ detectedLoudest: currentAmplitude });
            }
          }
        },
        (error: string) => {
          set({
            errorMessage: error,
            isListening: false,
          });
        },
        (analyzerState) => {
          // Handle error state from analyzer
          if (analyzerState === 'error') {
            set({ isListening: false });
          } else if (analyzerState === 'idle') {
            set({ isListening: false });
          }
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start listening';
      set({ errorMessage, isListening: false });
    }
  },

  stopListening: () => {
    VoiceAnalyzer.stopListening();
    set({
      isListening: false,
      currentPitch: null,
      currentAmplitude: null,
    });
  },

  confirmLowest: () => {
    const { detectedLowest, currentPitch, currentAmplitude } = get();

    // Use current pitch if valid and lower, or use detected lowest
    let lowest = detectedLowest;
    if (
      currentPitch !== null &&
      currentAmplitude !== null &&
      currentAmplitude >= DEFAULT_VOICE_THRESHOLDS.minVoiceDb
    ) {
      if (lowest === null || currentPitch < lowest) {
        lowest = currentPitch;
      }
    }

    set({
      detectedLowest: lowest,
      assessmentStep: 'highest',
      isListening: false,
    });
    VoiceAnalyzer.stopListening();
  },

  confirmHighest: () => {
    const { detectedHighest, currentPitch, currentAmplitude } = get();

    let highest = detectedHighest;
    if (
      currentPitch !== null &&
      currentAmplitude !== null &&
      currentAmplitude >= DEFAULT_VOICE_THRESHOLDS.minVoiceDb
    ) {
      if (highest === null || currentPitch > highest) {
        highest = currentPitch;
      }
    }

    set({
      detectedHighest: highest,
      assessmentStep: 'comfortable_low',
      isListening: false,
    });
    VoiceAnalyzer.stopListening();
  },

  confirmComfortableLow: () => {
    const { detectedComfortLow, currentPitch, detectedLowest } = get();

    // Default to detected lowest + 3 semitones if not set
    const comfortLow = detectedComfortLow ?? currentPitch ?? (detectedLowest ? detectedLowest + 3 : 48);

    set({
      detectedComfortLow: comfortLow,
      assessmentStep: 'comfortable_high',
      isListening: false,
    });
    VoiceAnalyzer.stopListening();
  },

  confirmComfortableHigh: () => {
    const { detectedComfortHigh, currentPitch, detectedHighest } = get();

    // Default to detected highest - 3 semitones if not set
    const comfortHigh = detectedComfortHigh ?? currentPitch ?? (detectedHighest ? detectedHighest - 3 : 72);

    set({
      detectedComfortHigh: comfortHigh,
      assessmentStep: 'results',
      isListening: false,
    });
    VoiceAnalyzer.stopListening();
  },

  saveProfile: async () => {
    const {
      detectedLowest,
      detectedHighest,
      detectedComfortLow,
      detectedComfortHigh,
      detectedSoftest,
      detectedLoudest,
    } = get();

    // Validate we have the required data
    if (
      detectedLowest === null ||
      detectedHighest === null ||
      detectedComfortLow === null ||
      detectedComfortHigh === null
    ) {
      set({ errorMessage: 'Incomplete assessment data' });
      return;
    }

    const profile: VoiceRangeProfile = {
      lowestNote: detectedLowest,
      highestNote: detectedHighest,
      comfortableLow: detectedComfortLow,
      comfortableHigh: detectedComfortHigh,
      dynamicRange: {
        softest: detectedSoftest ?? -50,
        loudest: detectedLoudest ?? -10,
      },
      assessedAt: new Date(),
    };

    set({ isLoading: true });
    try {
      await saveVoiceProfile(profile);
      set({
        ...INITIAL_ASSESSMENT_STATE,
        profile,
        hasProfile: true,
      });
    } catch (error) {
      console.error('Failed to save voice profile:', error);
      set({ errorMessage: 'Failed to save profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  resetAssessment: () => {
    VoiceAnalyzer.stopListening();
    set(INITIAL_ASSESSMENT_STATE);
  },

  deleteProfile: async () => {
    set({ isLoading: true });
    try {
      await deleteVoiceProfile();
      set({
        profile: null,
        hasProfile: false,
      });
    } catch (error) {
      console.error('Failed to delete voice profile:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  getProfileSummary: () => {
    const { profile } = get();
    if (!profile) return null;

    const lowNote = midiToNoteName(profile.lowestNote);
    const highNote = midiToNoteName(profile.highestNote);
    return `${lowNote} - ${highNote}`;
  },

  getRangeOctaves: () => {
    const { profile } = get();
    if (!profile) return 0;

    const semitones = profile.highestNote - profile.lowestNote;
    return Math.round((semitones / 12) * 10) / 10; // One decimal place
  },

  getComfortableRangeOctaves: () => {
    const { profile } = get();
    if (!profile) return 0;

    const semitones = profile.comfortableHigh - profile.comfortableLow;
    return Math.round((semitones / 12) * 10) / 10; // One decimal place
  },
}));
