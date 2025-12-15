/**
 * Instrument Tuning Definitions
 *
 * Contains all supported instrument tunings with MIDI note mappings.
 * Strings are ordered low to high.
 */

import {
  Instrument,
  InstrumentType,
  InstrumentTuning,
  InstrumentString,
} from '../types/guitarTuning';
import { midiToFrequency, midiToNoteName } from './music';

/**
 * All supported instruments
 */
export const INSTRUMENTS: Instrument[] = [
  { id: 'guitar', name: 'Guitar', stringCount: 6 },
  { id: 'violin', name: 'Violin', stringCount: 4 },
  { id: 'ukulele', name: 'Ukulele', stringCount: 4 },
  { id: 'banjo', name: 'Banjo', stringCount: 5 },
  { id: 'mandolin', name: 'Mandolin', stringCount: 4 },
];

/**
 * Create a string from MIDI note
 */
function createString(stringNumber: number, midiNote: number): InstrumentString {
  return {
    stringNumber,
    midiNote,
    noteName: midiToNoteName(midiNote),
    frequency: midiToFrequency(midiNote),
  };
}

/**
 * Create a tuning from MIDI notes (low to high)
 */
function createTuning(
  id: string,
  instrumentId: InstrumentType,
  name: string,
  shortName: string,
  midiNotes: number[]
): InstrumentTuning {
  const stringCount = midiNotes.length;
  return {
    id,
    instrumentId,
    name,
    shortName,
    // Create strings: index 0 = lowest string (highest string number)
    strings: midiNotes.map((midi, index) => createString(stringCount - index, midi)),
  };
}

// ============================================
// GUITAR TUNINGS (6 strings)
// ============================================
// MIDI: E2=40, A2=45, D3=50, G3=55, B3=59, E4=64

const GUITAR_TUNINGS: InstrumentTuning[] = [
  createTuning('guitar-standard', 'guitar', 'Standard', 'STD', [40, 45, 50, 55, 59, 64]),
  createTuning('guitar-drop-d', 'guitar', 'Drop D', 'DROP D', [38, 45, 50, 55, 59, 64]),
  createTuning('guitar-drop-c', 'guitar', 'Drop C', 'DROP C', [36, 43, 48, 53, 57, 62]),
  createTuning('guitar-half-step', 'guitar', 'Half-Step Down', 'Eb STD', [39, 44, 49, 54, 58, 63]),
  createTuning('guitar-full-step', 'guitar', 'Full-Step Down', 'D STD', [38, 43, 48, 53, 57, 62]),
  createTuning('guitar-open-g', 'guitar', 'Open G', 'OPEN G', [38, 43, 50, 55, 59, 62]),
  createTuning('guitar-open-d', 'guitar', 'Open D', 'OPEN D', [38, 45, 50, 54, 57, 62]),
  createTuning('guitar-dadgad', 'guitar', 'DADGAD', 'DADGAD', [38, 45, 50, 55, 57, 62]),
];

// ============================================
// VIOLIN TUNINGS (4 strings)
// ============================================
// Standard: G3=55, D4=62, A4=69, E5=76

const VIOLIN_TUNINGS: InstrumentTuning[] = [
  createTuning('violin-standard', 'violin', 'Standard', 'STD', [55, 62, 69, 76]),
  createTuning('violin-baroque', 'violin', 'Baroque (A=415)', 'BAROQUE', [54, 61, 68, 75]),
];

// ============================================
// UKULELE TUNINGS (4 strings)
// ============================================
// Standard GCEA (re-entrant): G4=67, C4=60, E4=64, A4=69
// Note: Standard ukulele has high G (re-entrant tuning)

const UKULELE_TUNINGS: InstrumentTuning[] = [
  createTuning('ukulele-standard', 'ukulele', 'Standard (GCEA)', 'STD', [67, 60, 64, 69]),
  createTuning('ukulele-low-g', 'ukulele', 'Low G', 'LOW G', [55, 60, 64, 69]),
  createTuning('ukulele-baritone', 'ukulele', 'Baritone (DGBE)', 'BARI', [50, 55, 59, 64]),
  createTuning('ukulele-d-tuning', 'ukulele', 'D Tuning (ADF#B)', 'D TUN', [69, 62, 66, 71]),
];

// ============================================
// BANJO TUNINGS (5 strings)
// ============================================
// Open G: G4=67 (5th/drone), D3=50, G3=55, B3=59, D4=62
// Note: 5th string is the short drone string (high G)

const BANJO_TUNINGS: InstrumentTuning[] = [
  createTuning('banjo-open-g', 'banjo', 'Open G', 'OPEN G', [67, 50, 55, 59, 62]),
  createTuning('banjo-double-c', 'banjo', 'Double C', 'DBL C', [67, 48, 55, 60, 62]),
  createTuning('banjo-drop-c', 'banjo', 'Drop C', 'DROP C', [67, 48, 55, 59, 62]),
  createTuning('banjo-d-tuning', 'banjo', 'D Tuning', 'D TUN', [69, 50, 54, 57, 62]),
];

// ============================================
// MANDOLIN TUNINGS (4 courses, 8 strings tuned in pairs)
// ============================================
// Standard: G3=55, D4=62, A4=69, E5=76 (same as violin)

const MANDOLIN_TUNINGS: InstrumentTuning[] = [
  createTuning('mandolin-standard', 'mandolin', 'Standard', 'STD', [55, 62, 69, 76]),
  createTuning('mandolin-octave', 'mandolin', 'Octave (GDAE)', 'OCTAVE', [43, 50, 57, 64]),
];

// ============================================
// COMBINED TUNINGS
// ============================================

/**
 * All tunings organized by instrument
 */
export const TUNINGS_BY_INSTRUMENT: Record<InstrumentType, InstrumentTuning[]> = {
  guitar: GUITAR_TUNINGS,
  violin: VIOLIN_TUNINGS,
  ukulele: UKULELE_TUNINGS,
  banjo: BANJO_TUNINGS,
  mandolin: MANDOLIN_TUNINGS,
};

/**
 * All tunings in a flat array
 */
export const ALL_TUNINGS: InstrumentTuning[] = [
  ...GUITAR_TUNINGS,
  ...VIOLIN_TUNINGS,
  ...UKULELE_TUNINGS,
  ...BANJO_TUNINGS,
  ...MANDOLIN_TUNINGS,
];

/**
 * Default tuning IDs per instrument
 */
export const DEFAULT_TUNING_IDS: Record<InstrumentType, string> = {
  guitar: 'guitar-standard',
  violin: 'violin-standard',
  ukulele: 'ukulele-standard',
  banjo: 'banjo-open-g',
  mandolin: 'mandolin-standard',
};

/**
 * Default instrument
 */
export const DEFAULT_INSTRUMENT: InstrumentType = 'guitar';

/**
 * Get instrument by ID
 */
export function getInstrumentById(id: InstrumentType): Instrument {
  return INSTRUMENTS.find((i) => i.id === id) || INSTRUMENTS[0];
}

/**
 * Get tunings for an instrument
 */
export function getTuningsForInstrument(instrumentId: InstrumentType): InstrumentTuning[] {
  return TUNINGS_BY_INSTRUMENT[instrumentId] || [];
}

/**
 * Get tuning by ID
 */
export function getTuningById(id: string): InstrumentTuning | undefined {
  return ALL_TUNINGS.find((t) => t.id === id);
}

/**
 * Get the default tuning for an instrument
 */
export function getDefaultTuning(instrumentId: InstrumentType): InstrumentTuning {
  const tunings = getTuningsForInstrument(instrumentId);
  const defaultId = DEFAULT_TUNING_IDS[instrumentId];
  return tunings.find((t) => t.id === defaultId) || tunings[0];
}

/**
 * Get the next tuning in the list for an instrument (wraps around)
 */
export function getNextTuning(currentId: string, instrumentId: InstrumentType): InstrumentTuning {
  const tunings = getTuningsForInstrument(instrumentId);
  const currentIndex = tunings.findIndex((t) => t.id === currentId);
  const nextIndex = (currentIndex + 1) % tunings.length;
  return tunings[nextIndex];
}

/**
 * Get the previous tuning in the list for an instrument (wraps around)
 */
export function getPreviousTuning(currentId: string, instrumentId: InstrumentType): InstrumentTuning {
  const tunings = getTuningsForInstrument(instrumentId);
  const currentIndex = tunings.findIndex((t) => t.id === currentId);
  const prevIndex = (currentIndex - 1 + tunings.length) % tunings.length;
  return tunings[prevIndex];
}

// Legacy exports for backward compatibility
export { GUITAR_TUNINGS as GUITAR_TUNINGS_LEGACY };
export const DEFAULT_TUNING_ID = 'guitar-standard';
