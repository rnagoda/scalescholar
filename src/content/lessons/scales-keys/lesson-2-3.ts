/**
 * Lesson 2.3: Key of F Major
 *
 * Introduction to the key of F major (1 flat: Bb).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-2-3',
  trackId: 'scales-keys',
  levelIndex: 2,
  lessonIndex: 3,
  title: 'Key of F Major',
  description: 'Learn about F major - the key with one flat (Bb).',
  xpReward: 50,
  blocks: [
    {
      id: 'sk2-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The KEY OF F MAJOR has one FLAT in its key signature: Bb (B-flat). Every B in this key is played as B-flat.',
          audioType: 'scale',
          audioData: {
            notes: [65, 67, 69, 70, 72, 74, 76, 77], // F major scale
            scaleType: 'major',
            rootNote: 65,
          },
        },
      },
    },
    {
      id: 'sk2-3-flat',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A FLAT (♭) lowers a note by one half step. So B-flat is one half step lower than B. Listen to the Bb in the F major scale:',
          audioType: 'scale',
          audioData: {
            notes: [65, 67, 69, 70, 72, 74, 76, 77],
            scaleType: 'major',
            rootNote: 65,
          },
        },
      },
    },
    {
      id: 'sk2-3-pattern',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The pattern is still W-W-H-W-W-W-H. Without the Bb, the scale would have A to B (whole step) instead of A to Bb (half step).',
          audioType: 'scale',
          audioData: {
            notes: [65, 67, 69, 70, 72, 74, 76, 77],
            scaleType: 'major',
            rootNote: 65,
          },
        },
      },
    },
    {
      id: 'sk2-3-quiz1',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'How many flats are in the key of F major?',
          visualType: 'staff',
          visualData: {
            keySignature: 'F',
          },
          options: ['None (0)', 'One (1)', 'Two (2)'],
          correctIndex: 1,
          explanation: 'F major has exactly one flat: Bb.',
        },
      },
    },
    {
      id: 'sk2-3-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Which note is FLATTED in the key of F major?',
          audioType: 'scale',
          audioData: {
            notes: [65, 67, 69, 70, 72, 74, 76, 77],
            scaleType: 'major',
            rootNote: 65,
          },
          options: ['A♭', 'B♭', 'E♭'],
          correctIndex: 1,
          explanation: 'In F major, B is always played as B♭ (B-flat).',
        },
      },
    },
    {
      id: 'sk2-3-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Does a FLAT raise or lower a note?',
          audioType: 'interval',
          audioData: {
            notes: [71, 70], // B to Bb
          },
          options: ['Raises it', 'Lowers it', 'No change'],
          correctIndex: 1,
          explanation: 'A flat (♭) lowers a note by one half step.',
        },
      },
    },
    {
      id: 'sk2-3-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each key to its accidentals:',
          items: [
            { id: 'c', label: 'C Major', correctZone: 'none' },
            { id: 'g', label: 'G Major', correctZone: 'fsharp' },
            { id: 'f', label: 'F Major', correctZone: 'bflat' },
          ],
          zones: [
            { id: 'none', label: 'No sharps or flats' },
            { id: 'fsharp', label: 'One sharp (F#)' },
            { id: 'bflat', label: 'One flat (Bb)' },
          ],
        },
      },
    },
  ],
};
