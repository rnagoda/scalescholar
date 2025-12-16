/**
 * Lesson 2.4: Key of D Major
 *
 * Introduction to the key of D major (2 sharps: F#, C#).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-2-4',
  trackId: 'scales-keys',
  levelIndex: 2,
  lessonIndex: 4,
  title: 'Key of D Major',
  description: 'Learn about D major - the key with two sharps (F# and C#).',
  xpReward: 50,
  blocks: [
    {
      id: 'sk2-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The KEY OF D MAJOR has TWO sharps: F# and C#. This bright key is very popular for guitar and violin music.',
          audioType: 'scale',
          audioData: {
            notes: [62, 64, 66, 67, 69, 71, 73, 74], // D major scale
            scaleType: 'major',
            rootNote: 62,
          },
        },
      },
    },
    {
      id: 'sk2-4-sharps',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'In D major, every F becomes F# AND every C becomes C#. Listen carefully for both sharps in the scale:',
          audioType: 'scale',
          audioData: {
            notes: [62, 64, 66, 67, 69, 71, 73, 74],
            scaleType: 'major',
            rootNote: 62,
          },
        },
      },
    },
    {
      id: 'sk2-4-order',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Sharps are always added in a specific order: F#, C#, G#, D#... So if a key has 2 sharps, they\'re always F# and C#.',
          audioType: 'scale',
          audioData: {
            notes: [62, 64, 66, 67, 69, 71, 73, 74],
            scaleType: 'major',
            rootNote: 62,
          },
        },
      },
    },
    {
      id: 'sk2-4-quiz1',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'How many sharps are in the key of D major?',
          visualType: 'staff',
          visualData: {
            keySignature: 'D',
          },
          options: ['One (1)', 'Two (2)', 'Three (3)'],
          correctIndex: 1,
          explanation: 'D major has exactly two sharps: F# and C#.',
        },
      },
    },
    {
      id: 'sk2-4-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Which TWO notes are sharped in D major?',
          audioType: 'scale',
          audioData: {
            notes: [62, 64, 66, 67, 69, 71, 73, 74],
            scaleType: 'major',
            rootNote: 62,
          },
          options: ['F# and G#', 'F# and C#', 'C# and G#'],
          correctIndex: 1,
          explanation: 'D major has F# (from G major) plus C# - that\'s two sharps total.',
        },
      },
    },
    {
      id: 'sk2-4-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put these keys in order by NUMBER OF SHARPS (fewest to most):',
          items: [
            { id: 'd', label: 'D Major (2#)', correctPosition: 2 },
            { id: 'g', label: 'G Major (1#)', correctPosition: 1 },
            { id: 'c', label: 'C Major (0)', correctPosition: 0 },
          ],
          explanation: 'C (0) → G (1#) → D (2#) - each new sharp key adds one more sharp.',
        },
      },
    },
    {
      id: 'sk2-4-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each key to its number of sharps:',
          items: [
            { id: 'c', label: 'C Major', correctZone: 'zero' },
            { id: 'g', label: 'G Major', correctZone: 'one' },
            { id: 'd', label: 'D Major', correctZone: 'two' },
          ],
          zones: [
            { id: 'zero', label: '0 sharps' },
            { id: 'one', label: '1 sharp' },
            { id: 'two', label: '2 sharps' },
          ],
        },
      },
    },
  ],
};
