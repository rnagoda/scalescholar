/**
 * String Detection Tests
 *
 * Tests for guitar/instrument string detection utilities.
 */

import {
  getAccuracyLevel,
  getTuningDirection,
} from '../stringDetection';

describe('String Detection Utilities', () => {
  describe('getAccuracyLevel', () => {
    it('should return "perfect" for cents within 5', () => {
      expect(getAccuracyLevel(0)).toBe('perfect');
      expect(getAccuracyLevel(5)).toBe('perfect');
      expect(getAccuracyLevel(-5)).toBe('perfect');
      expect(getAccuracyLevel(3)).toBe('perfect');
      expect(getAccuracyLevel(-3)).toBe('perfect');
    });

    it('should return "close" for cents between 6 and 15', () => {
      expect(getAccuracyLevel(6)).toBe('close');
      expect(getAccuracyLevel(15)).toBe('close');
      expect(getAccuracyLevel(-6)).toBe('close');
      expect(getAccuracyLevel(-15)).toBe('close');
      expect(getAccuracyLevel(10)).toBe('close');
    });

    it('should return "off" for cents beyond 15', () => {
      expect(getAccuracyLevel(16)).toBe('off');
      expect(getAccuracyLevel(-16)).toBe('off');
      expect(getAccuracyLevel(50)).toBe('off');
      expect(getAccuracyLevel(-50)).toBe('off');
      expect(getAccuracyLevel(100)).toBe('off');
    });

    it('should handle boundary values correctly', () => {
      // Exactly 5 is perfect
      expect(getAccuracyLevel(5)).toBe('perfect');
      expect(getAccuracyLevel(-5)).toBe('perfect');

      // Exactly 6 is close
      expect(getAccuracyLevel(6)).toBe('close');

      // Exactly 15 is close
      expect(getAccuracyLevel(15)).toBe('close');

      // Exactly 16 is off
      expect(getAccuracyLevel(16)).toBe('off');
    });
  });

  describe('getTuningDirection', () => {
    it('should return "in-tune" for cents within 5', () => {
      expect(getTuningDirection(0)).toBe('in-tune');
      expect(getTuningDirection(5)).toBe('in-tune');
      expect(getTuningDirection(-5)).toBe('in-tune');
      expect(getTuningDirection(3)).toBe('in-tune');
      expect(getTuningDirection(-3)).toBe('in-tune');
    });

    it('should return "flat" for negative cents beyond 5', () => {
      expect(getTuningDirection(-6)).toBe('flat');
      expect(getTuningDirection(-10)).toBe('flat');
      expect(getTuningDirection(-50)).toBe('flat');
    });

    it('should return "sharp" for positive cents beyond 5', () => {
      expect(getTuningDirection(6)).toBe('sharp');
      expect(getTuningDirection(10)).toBe('sharp');
      expect(getTuningDirection(50)).toBe('sharp');
    });

    it('should handle boundary values correctly', () => {
      // At 5, still in-tune
      expect(getTuningDirection(5)).toBe('in-tune');
      expect(getTuningDirection(-5)).toBe('in-tune');

      // At 6, sharp
      expect(getTuningDirection(6)).toBe('sharp');

      // At -6, flat
      expect(getTuningDirection(-6)).toBe('flat');
    });

    it('should handle edge cases', () => {
      expect(getTuningDirection(0)).toBe('in-tune');
      expect(getTuningDirection(1)).toBe('in-tune');
      expect(getTuningDirection(-1)).toBe('in-tune');
    });
  });
});
