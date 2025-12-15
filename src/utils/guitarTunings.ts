/**
 * Guitar Tuning Definitions
 *
 * Contains all supported guitar tunings with MIDI note mappings.
 * Strings are ordered low to high (6, 5, 4, 3, 2, 1).
 */

import { GuitarTuning, GuitarString } from '../types/guitarTuning';
import { midiToFrequency, midiToNoteName } from './music';

/**
 * Create a guitar string from MIDI note
 */
function createString(stringNumber: number, midiNote: number): GuitarString {
  return {
    stringNumber,
    midiNote,
    noteName: midiToNoteName(midiNote),
    frequency: midiToFrequency(midiNote),
  };
}

/**
 * Create a tuning from MIDI notes (low to high: strings 6, 5, 4, 3, 2, 1)
 */
function createTuning(
  id: string,
  name: string,
  shortName: string,
  midiNotes: [number, number, number, number, number, number]
): GuitarTuning {
  return {
    id,
    name,
    shortName,
    // Create strings array: index 0 = string 6 (low), index 5 = string 1 (high)
    strings: midiNotes.map((midi, index) => createString(6 - index, midi)),
  };
}

// MIDI Notes Reference:
// C2=36, D2=38, E2=40, F2=41, F#2=42, G2=43, G#2=44, A2=45, A#2=46, B2=47
// C3=48, C#3=49, D3=50, D#3=51, E3=52, F3=53, F#3=54, G3=55
// G#3=56, A3=57, A#3=58, B3=59, C4=60, C#4=61, D4=62, D#4=63, E4=64

/**
 * All supported guitar tunings
 */
export const GUITAR_TUNINGS: GuitarTuning[] = [
  // Standard Tuning: E A D G B E
  createTuning('standard', 'Standard', 'STD', [40, 45, 50, 55, 59, 64]),

  // Drop D: D A D G B E
  createTuning('drop-d', 'Drop D', 'DROP D', [38, 45, 50, 55, 59, 64]),

  // Drop C: C G C F A D
  createTuning('drop-c', 'Drop C', 'DROP C', [36, 43, 48, 53, 57, 62]),

  // Half-step down (Eb): Eb Ab Db Gb Bb Eb
  createTuning('half-step-down', 'Half-Step Down', 'Eb STD', [39, 44, 49, 54, 58, 63]),

  // Full-step down (D): D G C F A D
  createTuning('full-step-down', 'Full-Step Down', 'D STD', [38, 43, 48, 53, 57, 62]),

  // Open G: D G D G B D
  createTuning('open-g', 'Open G', 'OPEN G', [38, 43, 50, 55, 59, 62]),

  // Open D: D A D F# A D
  createTuning('open-d', 'Open D', 'OPEN D', [38, 45, 50, 54, 57, 62]),

  // DADGAD: D A D G A D
  createTuning('dadgad', 'DADGAD', 'DADGAD', [38, 45, 50, 55, 57, 62]),
];

/**
 * Default tuning ID
 */
export const DEFAULT_TUNING_ID = 'standard';

/**
 * Get tuning by ID
 */
export function getTuningById(id: string): GuitarTuning | undefined {
  return GUITAR_TUNINGS.find((t) => t.id === id);
}

/**
 * Get the default tuning
 */
export function getDefaultTuning(): GuitarTuning {
  return GUITAR_TUNINGS.find((t) => t.id === DEFAULT_TUNING_ID) || GUITAR_TUNINGS[0];
}

/**
 * Get the next tuning in the list (wraps around)
 */
export function getNextTuning(currentId: string): GuitarTuning {
  const currentIndex = GUITAR_TUNINGS.findIndex((t) => t.id === currentId);
  const nextIndex = (currentIndex + 1) % GUITAR_TUNINGS.length;
  return GUITAR_TUNINGS[nextIndex];
}

/**
 * Get the previous tuning in the list (wraps around)
 */
export function getPreviousTuning(currentId: string): GuitarTuning {
  const currentIndex = GUITAR_TUNINGS.findIndex((t) => t.id === currentId);
  const prevIndex = (currentIndex - 1 + GUITAR_TUNINGS.length) % GUITAR_TUNINGS.length;
  return GUITAR_TUNINGS[prevIndex];
}
