/**
 * Settings Store Tests
 *
 * Tests for user preferences and app settings.
 */

import { useSettingsStore } from '../useSettingsStore';
import {
  MIN_REFERENCE_PITCH,
  MAX_REFERENCE_PITCH,
  MIN_QUESTIONS,
  MAX_QUESTIONS,
  MIN_INPUT_SENSITIVITY,
  MAX_INPUT_SENSITIVITY,
  QUESTION_COUNT_OPTIONS,
} from '../useSettingsStore';

describe('useSettingsStore', () => {
  beforeEach(() => {
    // Reset to defaults before each test
    useSettingsStore.getState().resetToDefaults();
  });

  describe('default values', () => {
    it('should have correct default instrument', () => {
      expect(useSettingsStore.getState().instrument).toBe('piano');
    });

    it('should have correct default reference pitch', () => {
      expect(useSettingsStore.getState().referencePitch).toBe(440);
    });

    it('should have correct default input sensitivity', () => {
      expect(useSettingsStore.getState().inputSensitivity).toBe(1.0);
    });

    it('should have correct default questions per session', () => {
      expect(useSettingsStore.getState().questionsPerSession).toBe(10);
    });

    it('should have correct default auto play next', () => {
      expect(useSettingsStore.getState().autoPlayNext).toBe(false);
    });

    it('should have correct default interval direction', () => {
      expect(useSettingsStore.getState().intervalDirection).toBe('ascending');
    });

    it('should have correct default interval playback', () => {
      expect(useSettingsStore.getState().intervalPlayback).toBe('melodic');
    });

    it('should have correct default scale degree labels', () => {
      expect(useSettingsStore.getState().scaleDegreeLabels).toBe('numbers');
    });

    it('should have correct default haptic feedback', () => {
      expect(useSettingsStore.getState().hapticFeedback).toBe(true);
    });
  });

  describe('setInstrument', () => {
    it('should set instrument to piano', () => {
      useSettingsStore.getState().setInstrument('piano');
      expect(useSettingsStore.getState().instrument).toBe('piano');
    });

    it('should set instrument to sine', () => {
      useSettingsStore.getState().setInstrument('sine');
      expect(useSettingsStore.getState().instrument).toBe('sine');
    });
  });

  describe('setReferencePitch', () => {
    it('should set valid reference pitch', () => {
      useSettingsStore.getState().setReferencePitch(442);
      expect(useSettingsStore.getState().referencePitch).toBe(442);
    });

    it('should clamp pitch to minimum', () => {
      useSettingsStore.getState().setReferencePitch(400);
      expect(useSettingsStore.getState().referencePitch).toBe(MIN_REFERENCE_PITCH);
    });

    it('should clamp pitch to maximum', () => {
      useSettingsStore.getState().setReferencePitch(500);
      expect(useSettingsStore.getState().referencePitch).toBe(MAX_REFERENCE_PITCH);
    });

    it('should accept baroque pitch (415 Hz)', () => {
      useSettingsStore.getState().setReferencePitch(415);
      expect(useSettingsStore.getState().referencePitch).toBe(415);
    });

    it('should accept high pitch (466 Hz)', () => {
      useSettingsStore.getState().setReferencePitch(466);
      expect(useSettingsStore.getState().referencePitch).toBe(466);
    });
  });

  describe('setInputSensitivity', () => {
    it('should set valid input sensitivity', () => {
      useSettingsStore.getState().setInputSensitivity(1.5);
      expect(useSettingsStore.getState().inputSensitivity).toBe(1.5);
    });

    it('should clamp sensitivity to minimum', () => {
      useSettingsStore.getState().setInputSensitivity(0.1);
      expect(useSettingsStore.getState().inputSensitivity).toBe(MIN_INPUT_SENSITIVITY);
    });

    it('should clamp sensitivity to maximum', () => {
      useSettingsStore.getState().setInputSensitivity(3.0);
      expect(useSettingsStore.getState().inputSensitivity).toBe(MAX_INPUT_SENSITIVITY);
    });

    it('should accept minimum sensitivity', () => {
      useSettingsStore.getState().setInputSensitivity(MIN_INPUT_SENSITIVITY);
      expect(useSettingsStore.getState().inputSensitivity).toBe(MIN_INPUT_SENSITIVITY);
    });

    it('should accept maximum sensitivity', () => {
      useSettingsStore.getState().setInputSensitivity(MAX_INPUT_SENSITIVITY);
      expect(useSettingsStore.getState().inputSensitivity).toBe(MAX_INPUT_SENSITIVITY);
    });
  });

  describe('setQuestionsPerSession', () => {
    it('should set valid question count', () => {
      useSettingsStore.getState().setQuestionsPerSession(15);
      expect(useSettingsStore.getState().questionsPerSession).toBe(15);
    });

    it('should clamp count to minimum', () => {
      useSettingsStore.getState().setQuestionsPerSession(1);
      expect(useSettingsStore.getState().questionsPerSession).toBe(MIN_QUESTIONS);
    });

    it('should clamp count to maximum', () => {
      useSettingsStore.getState().setQuestionsPerSession(100);
      expect(useSettingsStore.getState().questionsPerSession).toBe(MAX_QUESTIONS);
    });

    it('should accept all valid options', () => {
      for (const count of QUESTION_COUNT_OPTIONS) {
        useSettingsStore.getState().setQuestionsPerSession(count);
        expect(useSettingsStore.getState().questionsPerSession).toBe(count);
      }
    });
  });

  describe('setAutoPlayNext', () => {
    it('should enable auto play next', () => {
      useSettingsStore.getState().setAutoPlayNext(true);
      expect(useSettingsStore.getState().autoPlayNext).toBe(true);
    });

    it('should disable auto play next', () => {
      useSettingsStore.getState().setAutoPlayNext(true);
      useSettingsStore.getState().setAutoPlayNext(false);
      expect(useSettingsStore.getState().autoPlayNext).toBe(false);
    });
  });

  describe('setIntervalDirection', () => {
    it('should set to ascending', () => {
      useSettingsStore.getState().setIntervalDirection('ascending');
      expect(useSettingsStore.getState().intervalDirection).toBe('ascending');
    });

    it('should set to descending', () => {
      useSettingsStore.getState().setIntervalDirection('descending');
      expect(useSettingsStore.getState().intervalDirection).toBe('descending');
    });

    it('should set to mixed', () => {
      useSettingsStore.getState().setIntervalDirection('mixed');
      expect(useSettingsStore.getState().intervalDirection).toBe('mixed');
    });
  });

  describe('setIntervalPlayback', () => {
    it('should set to melodic', () => {
      useSettingsStore.getState().setIntervalPlayback('melodic');
      expect(useSettingsStore.getState().intervalPlayback).toBe('melodic');
    });

    it('should set to harmonic', () => {
      useSettingsStore.getState().setIntervalPlayback('harmonic');
      expect(useSettingsStore.getState().intervalPlayback).toBe('harmonic');
    });
  });

  describe('setScaleDegreeLabels', () => {
    it('should set to numbers', () => {
      useSettingsStore.getState().setScaleDegreeLabels('numbers');
      expect(useSettingsStore.getState().scaleDegreeLabels).toBe('numbers');
    });

    it('should set to solfege', () => {
      useSettingsStore.getState().setScaleDegreeLabels('solfege');
      expect(useSettingsStore.getState().scaleDegreeLabels).toBe('solfege');
    });
  });

  describe('setHapticFeedback', () => {
    it('should enable haptic feedback', () => {
      useSettingsStore.getState().setHapticFeedback(true);
      expect(useSettingsStore.getState().hapticFeedback).toBe(true);
    });

    it('should disable haptic feedback', () => {
      useSettingsStore.getState().setHapticFeedback(false);
      expect(useSettingsStore.getState().hapticFeedback).toBe(false);
    });
  });

  describe('resetToDefaults', () => {
    it('should reset all settings to defaults', () => {
      // Change all settings
      useSettingsStore.getState().setInstrument('sine');
      useSettingsStore.getState().setReferencePitch(442);
      useSettingsStore.getState().setInputSensitivity(1.5);
      useSettingsStore.getState().setQuestionsPerSession(20);
      useSettingsStore.getState().setAutoPlayNext(true);
      useSettingsStore.getState().setIntervalDirection('mixed');
      useSettingsStore.getState().setIntervalPlayback('harmonic');
      useSettingsStore.getState().setScaleDegreeLabels('solfege');
      useSettingsStore.getState().setHapticFeedback(false);

      // Reset
      useSettingsStore.getState().resetToDefaults();

      // Verify all defaults
      const state = useSettingsStore.getState();
      expect(state.instrument).toBe('piano');
      expect(state.referencePitch).toBe(440);
      expect(state.inputSensitivity).toBe(1.0);
      expect(state.questionsPerSession).toBe(10);
      expect(state.autoPlayNext).toBe(false);
      expect(state.intervalDirection).toBe('ascending');
      expect(state.intervalPlayback).toBe('melodic');
      expect(state.scaleDegreeLabels).toBe('numbers');
      expect(state.hapticFeedback).toBe(true);
    });
  });

  describe('constants', () => {
    it('should have valid pitch range', () => {
      expect(MIN_REFERENCE_PITCH).toBe(415);
      expect(MAX_REFERENCE_PITCH).toBe(466);
      expect(MIN_REFERENCE_PITCH).toBeLessThan(MAX_REFERENCE_PITCH);
    });

    it('should have valid question count range', () => {
      expect(MIN_QUESTIONS).toBe(5);
      expect(MAX_QUESTIONS).toBe(25);
      expect(MIN_QUESTIONS).toBeLessThan(MAX_QUESTIONS);
    });

    it('should have valid sensitivity range', () => {
      expect(MIN_INPUT_SENSITIVITY).toBe(0.5);
      expect(MAX_INPUT_SENSITIVITY).toBe(2.0);
      expect(MIN_INPUT_SENSITIVITY).toBeLessThan(MAX_INPUT_SENSITIVITY);
    });

    it('should have valid question count options', () => {
      expect(QUESTION_COUNT_OPTIONS).toEqual([5, 10, 15, 20, 25]);
      for (const count of QUESTION_COUNT_OPTIONS) {
        expect(count).toBeGreaterThanOrEqual(MIN_QUESTIONS);
        expect(count).toBeLessThanOrEqual(MAX_QUESTIONS);
      }
    });
  });
});
