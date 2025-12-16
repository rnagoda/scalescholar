/**
 * Lesson 2.2: Key of G Major
 *
 * Introduction to the key of G major (1 sharp: F#).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-2-2',
  trackId: 'scales-keys',
  levelIndex: 2,
  lessonIndex: 2,
  title: 'Key of G Major',
  description: 'Learn about G major - the key with one sharp (F#).',
  xpReward: 50,
  blocks: [
    {
      id: 'sk2-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The KEY OF G MAJOR has one sharp in its key signature: F#. Every F in this key is played as F-sharp.',
          audioType: 'scale',
          audioData: {
            notes: [67, 69, 71, 72, 74, 76, 78, 79], // G major scale
            scaleType: 'major',
            rootNote: 67,
          },
        },
      },
    },
    {
      id: 'sk2-2-fsharp',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Notice the F# in the G major scale. Without it, the scale would have the wrong pattern of whole and half steps. Listen for the F#:',
          audioType: 'scale',
          audioData: {
            notes: [67, 69, 71, 72, 74, 76, 78, 79],
            scaleType: 'major',
            rootNote: 67,
          },
        },
      },
    },
    {
      id: 'sk2-2-pattern',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The W-W-H-W-W-W-H pattern still applies! G to A (W), A to B (W), B to C (H), C to D (W), D to E (W), E to F# (W), F# to G (H).',
          audioType: 'scale',
          audioData: {
            notes: [67, 69, 71, 72, 74, 76, 78, 79],
            scaleType: 'major',
            rootNote: 67,
          },
        },
      },
    },
    {
      id: 'sk2-2-quiz1',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'How many sharps are in the key of G major?',
          visualType: 'staff',
          visualData: {
            keySignature: 'G',
          },
          options: ['None (0)', 'One (1)', 'Two (2)'],
          correctIndex: 1,
          explanation: 'G major has exactly one sharp: F#.',
        },
      },
    },
    {
      id: 'sk2-2-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Which note is SHARPED in the key of G major?',
          audioType: 'scale',
          audioData: {
            notes: [67, 69, 71, 72, 74, 76, 78, 79],
            scaleType: 'major',
            rootNote: 67,
          },
          options: ['C#', 'F#', 'G#'],
          correctIndex: 1,
          explanation: 'In G major, F is always played as F# (F-sharp).',
        },
      },
    },
    {
      id: 'sk2-2-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What is the TONIC (home note) in G major?',
          audioType: 'scale',
          audioData: {
            notes: [79, 78, 76, 74, 72, 71, 69, 67],
            scaleType: 'major',
            rootNote: 67,
          },
          options: ['C', 'F', 'G'],
          correctIndex: 2,
          explanation: 'In G major, G is the tonic - the note the scale starts and ends on.',
        },
      },
    },
    {
      id: 'sk2-2-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The key of G major has one sharp: {{0}}.',
          blanks: [
            {
              options: ['F#', 'C#', 'G#', 'D#'],
              correctIndex: 0,
            },
          ],
          explanation: 'The key of G major has one sharp: F# (F-sharp).',
        },
      },
    },
  ],
};
