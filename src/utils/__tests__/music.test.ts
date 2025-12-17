/**
 * Music Utilities Tests
 *
 * Comprehensive tests for all pure music theory functions.
 */

import {
  // Constants
  DEFAULT_A4_FREQUENCY,
  MIDDLE_C,
  Interval,
  INTERVAL_SHORT_NAMES,
  INTERVAL_FULL_NAMES,
  STARTER_INTERVALS,
  ALL_INTERVALS,
  MAJOR_SCALE,
  CHORD_TYPES,
  ChordQuality,
  CHORD_QUALITY_SHORT_NAMES,
  CHORD_QUALITY_FULL_NAMES,
  CHORD_QUALITY_INTERVALS,
  STARTER_CHORD_QUALITIES,
  ALL_CHORD_QUALITIES,
  ScaleDegree,
  SCALE_DEGREE_NUMBERS,
  SCALE_DEGREE_SOLFEGE,
  SCALE_DEGREE_SEMITONES,
  STARTER_SCALE_DEGREES,
  ALL_SCALE_DEGREES,
  // Functions
  midiToFrequency,
  frequencyToMidi,
  frequencyToExactMidi,
  midiToNoteName,
  frequencyToNoteName,
  frequencyToCents,
  getIntervalName,
  randomInterval,
  areIntervalsSimilar,
  generateMajorScale,
  generateChord,
  generateChordFromQuality,
  getChordQualityName,
  randomChordQuality,
  areChordQualitiesSame,
  getScaleDegreeName,
  scaleDegreeToMidi,
  randomScaleDegree,
  areScaleDegreesSimilar,
  generateKeyContext,
} from '../music';

describe('Music Utilities', () => {
  // ==========================================
  // FREQUENCY/MIDI CONVERSION TESTS
  // ==========================================

  describe('midiToFrequency', () => {
    it('should convert A4 (MIDI 69) to 440 Hz with default A4', () => {
      expect(midiToFrequency(69)).toBeCloseTo(440, 2);
    });

    it('should convert Middle C (MIDI 60) to approximately 261.63 Hz', () => {
      expect(midiToFrequency(60)).toBeCloseTo(261.63, 1);
    });

    it('should convert A3 (MIDI 57) to 220 Hz (one octave below A4)', () => {
      expect(midiToFrequency(57)).toBeCloseTo(220, 2);
    });

    it('should convert A5 (MIDI 81) to 880 Hz (one octave above A4)', () => {
      expect(midiToFrequency(81)).toBeCloseTo(880, 2);
    });

    it('should use custom A4 reference frequency', () => {
      expect(midiToFrequency(69, 442)).toBeCloseTo(442, 2);
    });

    it('should handle low MIDI notes', () => {
      expect(midiToFrequency(21)).toBeCloseTo(27.5, 1); // A0
    });

    it('should handle high MIDI notes', () => {
      expect(midiToFrequency(108)).toBeCloseTo(4186.01, 0); // C8
    });
  });

  describe('frequencyToMidi', () => {
    it('should convert 440 Hz to MIDI 69 (A4)', () => {
      expect(frequencyToMidi(440)).toBe(69);
    });

    it('should convert 261.63 Hz to MIDI 60 (Middle C)', () => {
      expect(frequencyToMidi(261.63)).toBe(60);
    });

    it('should round to nearest MIDI note', () => {
      expect(frequencyToMidi(445)).toBe(69); // Still A4
      expect(frequencyToMidi(435)).toBe(69); // Still A4
    });

    it('should use custom A4 reference frequency', () => {
      expect(frequencyToMidi(442, 442)).toBe(69);
    });

    it('should handle low frequencies', () => {
      expect(frequencyToMidi(27.5)).toBe(21); // A0
    });

    it('should handle high frequencies', () => {
      expect(frequencyToMidi(4186)).toBe(108); // C8
    });
  });

  describe('frequencyToExactMidi', () => {
    it('should return exact MIDI value for A4', () => {
      expect(frequencyToExactMidi(440)).toBeCloseTo(69, 5);
    });

    it('should return non-integer for frequencies between notes', () => {
      const exactMidi = frequencyToExactMidi(445);
      expect(exactMidi).toBeGreaterThan(69);
      expect(exactMidi).toBeLessThan(70);
    });

    it('should use custom A4 reference', () => {
      expect(frequencyToExactMidi(442, 442)).toBeCloseTo(69, 5);
    });
  });

  describe('midiToNoteName', () => {
    it('should convert MIDI 69 to A4', () => {
      expect(midiToNoteName(69)).toBe('A4');
    });

    it('should convert MIDI 60 to C4 (Middle C)', () => {
      expect(midiToNoteName(60)).toBe('C4');
    });

    it('should handle sharps correctly', () => {
      expect(midiToNoteName(61)).toBe('C#4');
      expect(midiToNoteName(70)).toBe('A#4');
    });

    it('should handle different octaves', () => {
      expect(midiToNoteName(48)).toBe('C3');
      expect(midiToNoteName(72)).toBe('C5');
      expect(midiToNoteName(21)).toBe('A0');
    });

    it('should handle lowest MIDI note', () => {
      expect(midiToNoteName(0)).toBe('C-1');
    });
  });

  describe('frequencyToNoteName', () => {
    it('should convert 440 Hz to A4', () => {
      expect(frequencyToNoteName(440)).toBe('A4');
    });

    it('should convert 261.63 Hz to C4', () => {
      expect(frequencyToNoteName(261.63)).toBe('C4');
    });

    it('should use custom A4 reference', () => {
      expect(frequencyToNoteName(442, 442)).toBe('A4');
    });
  });

  describe('frequencyToCents', () => {
    it('should return 0 cents for exactly in-tune note', () => {
      expect(frequencyToCents(440)).toBe(0);
    });

    it('should return positive cents for sharp notes', () => {
      const cents = frequencyToCents(445);
      expect(cents).toBeGreaterThan(0);
      expect(cents).toBeLessThanOrEqual(50);
    });

    it('should return negative cents for flat notes', () => {
      const cents = frequencyToCents(435);
      expect(cents).toBeLessThan(0);
      expect(cents).toBeGreaterThanOrEqual(-50);
    });

    it('should handle quarter tone calculations', () => {
      // A quarter tone sharp from A4 rounds to A#4, so shows as -50 cents from A#
      const quarterToneSharp = 440 * Math.pow(2, 1 / 24);
      const cents = frequencyToCents(quarterToneSharp);
      expect(Math.abs(cents)).toBeCloseTo(50, 0);
    });

    it('should use custom A4 reference', () => {
      expect(frequencyToCents(442, 442)).toBe(0);
    });
  });

  // ==========================================
  // INTERVAL TESTS
  // ==========================================

  describe('getIntervalName', () => {
    it('should return short name by default', () => {
      expect(getIntervalName(0)).toBe('P1');
      expect(getIntervalName(4)).toBe('M3');
      expect(getIntervalName(7)).toBe('P5');
      expect(getIntervalName(12)).toBe('P8');
    });

    it('should return full name when short is false', () => {
      expect(getIntervalName(0, false)).toBe('Unison');
      expect(getIntervalName(4, false)).toBe('Major 3rd');
      expect(getIntervalName(7, false)).toBe('Perfect 5th');
      expect(getIntervalName(12, false)).toBe('Octave');
    });

    it('should handle negative intervals', () => {
      expect(getIntervalName(-7)).toBe('P5');
      expect(getIntervalName(-4, false)).toBe('Major 3rd');
    });

    it('should normalize intervals beyond octave', () => {
      // 19 % 13 = 6, which is the Tritone
      expect(getIntervalName(19)).toBe('TT');
    });
  });

  describe('randomInterval', () => {
    it('should return an interval from the provided array', () => {
      const intervals = [Interval.MINOR_THIRD, Interval.MAJOR_THIRD];
      const result = randomInterval(intervals);
      expect(intervals).toContain(result);
    });

    it('should return different values over multiple calls (probabilistic)', () => {
      const intervals = ALL_INTERVALS;
      const results = new Set<Interval>();

      for (let i = 0; i < 100; i++) {
        results.add(randomInterval(intervals));
      }

      // Should get at least a few different intervals
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('areIntervalsSimilar', () => {
    it('should return true for identical intervals', () => {
      expect(areIntervalsSimilar(Interval.MAJOR_THIRD, Interval.MAJOR_THIRD)).toBe(true);
    });

    it('should return true for adjacent intervals', () => {
      expect(areIntervalsSimilar(Interval.MINOR_THIRD, Interval.MAJOR_THIRD)).toBe(true);
      expect(areIntervalsSimilar(Interval.PERFECT_FOURTH, Interval.PERFECT_FIFTH)).toBe(false); // diff is 2
    });

    it('should return false for non-adjacent intervals', () => {
      expect(areIntervalsSimilar(Interval.MINOR_THIRD, Interval.PERFECT_FIFTH)).toBe(false);
    });
  });

  // ==========================================
  // SCALE TESTS
  // ==========================================

  describe('generateMajorScale', () => {
    it('should generate C major scale from Middle C', () => {
      const scale = generateMajorScale(60);
      expect(scale).toEqual([60, 62, 64, 65, 67, 69, 71]);
    });

    it('should have correct intervals (W-W-H-W-W-W-H)', () => {
      const scale = generateMajorScale(60);
      const intervals = [];
      for (let i = 1; i < scale.length; i++) {
        intervals.push(scale[i] - scale[i - 1]);
      }
      expect(intervals).toEqual([2, 2, 1, 2, 2, 2]); // Last H is to octave
    });

    it('should work with different root notes', () => {
      const gMajor = generateMajorScale(67); // G
      expect(gMajor).toEqual([67, 69, 71, 72, 74, 76, 78]);
    });
  });

  // ==========================================
  // CHORD TESTS
  // ==========================================

  describe('generateChord', () => {
    it('should generate major triad', () => {
      const chord = generateChord(60, 'MAJOR');
      expect(chord).toEqual([60, 64, 67]); // C-E-G
    });

    it('should generate minor triad', () => {
      const chord = generateChord(60, 'MINOR');
      expect(chord).toEqual([60, 63, 67]); // C-Eb-G
    });

    it('should generate diminished triad', () => {
      const chord = generateChord(60, 'DIMINISHED');
      expect(chord).toEqual([60, 63, 66]); // C-Eb-Gb
    });

    it('should generate augmented triad', () => {
      const chord = generateChord(60, 'AUGMENTED');
      expect(chord).toEqual([60, 64, 68]); // C-E-G#
    });
  });

  describe('generateChordFromQuality', () => {
    it('should generate major triad from quality enum', () => {
      const chord = generateChordFromQuality(60, ChordQuality.MAJOR);
      expect(chord).toEqual([60, 64, 67]);
    });

    it('should generate minor triad from quality enum', () => {
      const chord = generateChordFromQuality(60, ChordQuality.MINOR);
      expect(chord).toEqual([60, 63, 67]);
    });

    it('should generate diminished triad from quality enum', () => {
      const chord = generateChordFromQuality(60, ChordQuality.DIMINISHED);
      expect(chord).toEqual([60, 63, 66]);
    });

    it('should generate augmented triad from quality enum', () => {
      const chord = generateChordFromQuality(60, ChordQuality.AUGMENTED);
      expect(chord).toEqual([60, 64, 68]);
    });
  });

  describe('getChordQualityName', () => {
    it('should return short name by default', () => {
      expect(getChordQualityName(ChordQuality.MAJOR)).toBe('Maj');
      expect(getChordQualityName(ChordQuality.MINOR)).toBe('Min');
      expect(getChordQualityName(ChordQuality.DIMINISHED)).toBe('Dim');
      expect(getChordQualityName(ChordQuality.AUGMENTED)).toBe('Aug');
    });

    it('should return full name when short is false', () => {
      expect(getChordQualityName(ChordQuality.MAJOR, false)).toBe('Major');
      expect(getChordQualityName(ChordQuality.MINOR, false)).toBe('Minor');
      expect(getChordQualityName(ChordQuality.DIMINISHED, false)).toBe('Diminished');
      expect(getChordQualityName(ChordQuality.AUGMENTED, false)).toBe('Augmented');
    });
  });

  describe('randomChordQuality', () => {
    it('should return a quality from the provided array', () => {
      const qualities = [ChordQuality.MAJOR, ChordQuality.MINOR];
      const result = randomChordQuality(qualities);
      expect(qualities).toContain(result);
    });
  });

  describe('areChordQualitiesSame', () => {
    it('should return true for identical qualities', () => {
      expect(areChordQualitiesSame(ChordQuality.MAJOR, ChordQuality.MAJOR)).toBe(true);
    });

    it('should return false for different qualities', () => {
      expect(areChordQualitiesSame(ChordQuality.MAJOR, ChordQuality.MINOR)).toBe(false);
    });
  });

  // ==========================================
  // SCALE DEGREE TESTS
  // ==========================================

  describe('getScaleDegreeName', () => {
    it('should return number by default', () => {
      expect(getScaleDegreeName(ScaleDegree.TONIC)).toBe('1');
      expect(getScaleDegreeName(ScaleDegree.DOMINANT)).toBe('5');
    });

    it('should return solfege when useSolfege is true', () => {
      expect(getScaleDegreeName(ScaleDegree.TONIC, true)).toBe('Do');
      expect(getScaleDegreeName(ScaleDegree.DOMINANT, true)).toBe('Sol');
      expect(getScaleDegreeName(ScaleDegree.LEADING_TONE, true)).toBe('Ti');
    });
  });

  describe('scaleDegreeToMidi', () => {
    it('should return correct MIDI for tonic', () => {
      expect(scaleDegreeToMidi(ScaleDegree.TONIC, 60)).toBe(60);
    });

    it('should return correct MIDI for dominant', () => {
      expect(scaleDegreeToMidi(ScaleDegree.DOMINANT, 60)).toBe(67); // G
    });

    it('should handle octave offset', () => {
      expect(scaleDegreeToMidi(ScaleDegree.TONIC, 60, 1)).toBe(72);
      expect(scaleDegreeToMidi(ScaleDegree.TONIC, 60, -1)).toBe(48);
    });

    it('should work with different key roots', () => {
      expect(scaleDegreeToMidi(ScaleDegree.DOMINANT, 67)).toBe(74); // D in G major
    });
  });

  describe('randomScaleDegree', () => {
    it('should return a degree from the provided array', () => {
      const degrees = [ScaleDegree.TONIC, ScaleDegree.DOMINANT];
      const result = randomScaleDegree(degrees);
      expect(degrees).toContain(result);
    });
  });

  describe('areScaleDegreesSimilar', () => {
    it('should return true for identical degrees', () => {
      expect(areScaleDegreesSimilar(ScaleDegree.TONIC, ScaleDegree.TONIC)).toBe(true);
    });

    it('should return true for adjacent degrees', () => {
      expect(areScaleDegreesSimilar(ScaleDegree.TONIC, ScaleDegree.SUPERTONIC)).toBe(true);
    });

    it('should return false for non-adjacent degrees', () => {
      expect(areScaleDegreesSimilar(ScaleDegree.TONIC, ScaleDegree.MEDIANT)).toBe(false);
    });
  });

  // ==========================================
  // KEY CONTEXT TESTS
  // ==========================================

  describe('generateKeyContext', () => {
    it('should generate triad context (single I chord)', () => {
      const context = generateKeyContext(60, 'triad');
      expect(context).toHaveLength(1);
      expect(context[0]).toEqual([60, 64, 67]); // C major triad
    });

    it('should generate scale context (ascending major scale)', () => {
      const context = generateKeyContext(60, 'scale');
      expect(context).toHaveLength(1);
      expect(context[0]).toEqual([60, 62, 64, 65, 67, 69, 71]);
    });

    it('should generate cadence context (I-IV-V-I)', () => {
      const context = generateKeyContext(60, 'cadence');
      expect(context).toHaveLength(4);
      expect(context[0]).toEqual([60, 64, 67]); // C (I)
      expect(context[1]).toEqual([65, 69, 72]); // F (IV)
      expect(context[2]).toEqual([67, 71, 74]); // G (V)
      expect(context[3]).toEqual([60, 64, 67]); // C (I)
    });

    it('should default to triad for unknown context type', () => {
      const context = generateKeyContext(60, 'unknown' as any);
      expect(context).toHaveLength(1);
      expect(context[0]).toEqual([60, 64, 67]);
    });

    it('should work with different key roots', () => {
      const context = generateKeyContext(67, 'triad'); // G major
      expect(context[0]).toEqual([67, 71, 74]); // G-B-D
    });
  });

  // ==========================================
  // CONSTANT VERIFICATION TESTS
  // ==========================================

  describe('Constants', () => {
    it('should have correct DEFAULT_A4_FREQUENCY', () => {
      expect(DEFAULT_A4_FREQUENCY).toBe(440);
    });

    it('should have correct MIDDLE_C', () => {
      expect(MIDDLE_C).toBe(60);
    });

    it('should have correct MAJOR_SCALE intervals', () => {
      expect(MAJOR_SCALE).toEqual([0, 2, 4, 5, 7, 9, 11]);
    });

    it('should have correct CHORD_TYPES', () => {
      expect(CHORD_TYPES.MAJOR).toEqual([0, 4, 7]);
      expect(CHORD_TYPES.MINOR).toEqual([0, 3, 7]);
      expect(CHORD_TYPES.DIMINISHED).toEqual([0, 3, 6]);
      expect(CHORD_TYPES.AUGMENTED).toEqual([0, 4, 8]);
    });

    it('should have correct number of intervals', () => {
      expect(ALL_INTERVALS).toHaveLength(12);
      expect(STARTER_INTERVALS).toHaveLength(4);
    });

    it('should have correct number of chord qualities', () => {
      expect(ALL_CHORD_QUALITIES).toHaveLength(4);
      expect(STARTER_CHORD_QUALITIES).toHaveLength(2);
    });

    it('should have correct number of scale degrees', () => {
      expect(ALL_SCALE_DEGREES).toHaveLength(7);
      expect(STARTER_SCALE_DEGREES).toHaveLength(3);
    });

    it('should have interval names for all intervals', () => {
      for (const interval of ALL_INTERVALS) {
        expect(INTERVAL_SHORT_NAMES[interval]).toBeDefined();
        expect(INTERVAL_FULL_NAMES[interval]).toBeDefined();
      }
    });

    it('should have chord quality names for all qualities', () => {
      for (const quality of ALL_CHORD_QUALITIES) {
        expect(CHORD_QUALITY_SHORT_NAMES[quality]).toBeDefined();
        expect(CHORD_QUALITY_FULL_NAMES[quality]).toBeDefined();
        expect(CHORD_QUALITY_INTERVALS[quality]).toBeDefined();
      }
    });

    it('should have scale degree names for all degrees', () => {
      for (const degree of ALL_SCALE_DEGREES) {
        expect(SCALE_DEGREE_NUMBERS[degree]).toBeDefined();
        expect(SCALE_DEGREE_SOLFEGE[degree]).toBeDefined();
        expect(SCALE_DEGREE_SEMITONES[degree]).toBeDefined();
      }
    });
  });
});
