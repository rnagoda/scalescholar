/**
 * Pitch Smoothing Tests
 *
 * Tests for pitch smoothing utilities.
 */

import {
  medianFilter,
  exponentialMovingAverage,
  PitchSmoother,
  DEFAULT_SMOOTHING_CONFIG,
} from '../pitchSmoothing';

describe('Pitch Smoothing Utilities', () => {
  describe('medianFilter', () => {
    it('should return 0 for empty array', () => {
      expect(medianFilter([])).toBe(0);
    });

    it('should return the single value for array of length 1', () => {
      expect(medianFilter([42])).toBe(42);
      expect(medianFilter([100])).toBe(100);
    });

    it('should return median for odd-length array', () => {
      expect(medianFilter([1, 2, 3])).toBe(2);
      expect(medianFilter([1, 3, 5, 7, 9])).toBe(5);
      expect(medianFilter([5, 1, 9, 3, 7])).toBe(5); // Unsorted input
    });

    it('should return average of middle values for even-length array', () => {
      expect(medianFilter([1, 2, 3, 4])).toBe(2.5);
      expect(medianFilter([1, 2])).toBe(1.5);
      expect(medianFilter([10, 20, 30, 40])).toBe(25);
    });

    it('should not modify original array', () => {
      const original = [3, 1, 2];
      medianFilter(original);
      expect(original).toEqual([3, 1, 2]);
    });

    it('should handle duplicate values', () => {
      expect(medianFilter([5, 5, 5])).toBe(5);
      expect(medianFilter([1, 5, 5])).toBe(5);
    });

    it('should handle negative values', () => {
      expect(medianFilter([-5, 0, 5])).toBe(0);
      expect(medianFilter([-10, -5, -1])).toBe(-5);
    });

    it('should handle decimal values', () => {
      expect(medianFilter([1.5, 2.5, 3.5])).toBe(2.5);
      expect(medianFilter([1.1, 2.2])).toBeCloseTo(1.65, 10);
    });
  });

  describe('exponentialMovingAverage', () => {
    it('should return current value when previous is null', () => {
      expect(exponentialMovingAverage(100, null, 0.5)).toBe(100);
      expect(exponentialMovingAverage(42, null, 0.3)).toBe(42);
    });

    it('should calculate EMA correctly', () => {
      // alpha * current + (1 - alpha) * previous
      // 0.5 * 100 + 0.5 * 50 = 75
      expect(exponentialMovingAverage(100, 50, 0.5)).toBe(75);

      // 0.3 * 100 + 0.7 * 50 = 30 + 35 = 65
      expect(exponentialMovingAverage(100, 50, 0.3)).toBe(65);
    });

    it('should weight current value more with higher alpha', () => {
      const current = 100;
      const previous = 50;

      const lowAlpha = exponentialMovingAverage(current, previous, 0.1);
      const highAlpha = exponentialMovingAverage(current, previous, 0.9);

      expect(highAlpha).toBeGreaterThan(lowAlpha);
      expect(highAlpha).toBeCloseTo(95, 0); // 0.9 * 100 + 0.1 * 50 = 95
      expect(lowAlpha).toBeCloseTo(55, 0); // 0.1 * 100 + 0.9 * 50 = 55
    });

    it('should handle alpha of 1 (no smoothing)', () => {
      expect(exponentialMovingAverage(100, 50, 1)).toBe(100);
    });

    it('should handle alpha of 0 (full smoothing)', () => {
      expect(exponentialMovingAverage(100, 50, 0)).toBe(50);
    });
  });

  describe('DEFAULT_SMOOTHING_CONFIG', () => {
    it('should have expected default values', () => {
      expect(DEFAULT_SMOOTHING_CONFIG.medianWindowSize).toBe(3);
      expect(DEFAULT_SMOOTHING_CONFIG.emaAlpha).toBe(0.35);
      expect(DEFAULT_SMOOTHING_CONFIG.hysteresisThreshold).toBe(25);
    });
  });

  describe('PitchSmoother', () => {
    describe('constructor', () => {
      it('should create with default mode and config', () => {
        const smoother = new PitchSmoother();
        expect(smoother.getMode()).toBe('voice');
      });

      it('should accept custom mode', () => {
        const smoother = new PitchSmoother('instrument');
        expect(smoother.getMode()).toBe('instrument');
      });

      it('should accept partial config', () => {
        const smoother = new PitchSmoother('voice', { emaAlpha: 0.5 });
        expect(smoother.getMode()).toBe('voice');
      });
    });

    describe('setMode', () => {
      it('should change mode', () => {
        const smoother = new PitchSmoother('voice');
        expect(smoother.getMode()).toBe('voice');

        smoother.setMode('instrument');
        expect(smoother.getMode()).toBe('instrument');
      });

      it('should reset state when mode changes', () => {
        const smoother = new PitchSmoother('instrument');

        // Process some data
        smoother.process({ frequency: 440, midiNote: 69, noteName: 'A4', cents: 0, timestamp: 0 });

        // Check locked string before mode change
        // (may or may not be set depending on tuning)

        smoother.setMode('voice');
        expect(smoother.getLockedStringNumber()).toBeNull();
      });

      it('should not reset if mode is the same', () => {
        const smoother = new PitchSmoother('voice');
        smoother.setMode('voice'); // Same mode
        expect(smoother.getMode()).toBe('voice');
      });
    });

    describe('reset', () => {
      it('should clear all state', () => {
        const smoother = new PitchSmoother('voice');

        // Process some data
        smoother.process({ frequency: 440, midiNote: 69, noteName: 'A4', cents: 0, timestamp: 0 });
        smoother.process({ frequency: 441, midiNote: 69, noteName: 'A4', cents: 4, timestamp: 100 });

        smoother.reset();

        expect(smoother.getLockedStringNumber()).toBeNull();
      });
    });

    describe('process', () => {
      it('should return a valid PitchResult', () => {
        const smoother = new PitchSmoother('voice');
        const input = {
          frequency: 440,
          midiNote: 69,
          noteName: 'A4',
          cents: 0,
          timestamp: 1000,
        };

        const result = smoother.process(input);

        expect(result.frequency).toBeDefined();
        expect(result.midiNote).toBeDefined();
        expect(result.noteName).toBeDefined();
        expect(result.cents).toBeDefined();
        expect(result.timestamp).toBe(1000);
      });

      it('should smooth frequency over multiple samples', () => {
        const smoother = new PitchSmoother('voice');

        // Feed in varying frequencies
        smoother.process({ frequency: 430, midiNote: 69, noteName: 'A4', cents: -39, timestamp: 0 });
        smoother.process({ frequency: 440, midiNote: 69, noteName: 'A4', cents: 0, timestamp: 100 });
        const result = smoother.process({ frequency: 450, midiNote: 69, noteName: 'A4', cents: 39, timestamp: 200 });

        // The smoothed frequency should be between the extremes
        expect(result.frequency).toBeGreaterThan(430);
        expect(result.frequency).toBeLessThan(450);
      });
    });

    describe('getLockedStringNumber', () => {
      it('should return null initially', () => {
        const smoother = new PitchSmoother('instrument');
        expect(smoother.getLockedStringNumber()).toBeNull();
      });
    });

    describe('getMode', () => {
      it('should return current mode', () => {
        const voiceSmoother = new PitchSmoother('voice');
        expect(voiceSmoother.getMode()).toBe('voice');

        const instrumentSmoother = new PitchSmoother('instrument');
        expect(instrumentSmoother.getMode()).toBe('instrument');
      });
    });
  });
});
