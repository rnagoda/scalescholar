/**
 * Lesson 1.1: The Major Scale
 *
 * Introduction to the major scale pattern (W-W-H-W-W-W-H).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-1-1',
  trackId: 'scales-keys',
  levelIndex: 1,
  lessonIndex: 1,
  title: 'The Major Scale',
  description: 'Learn the whole-step half-step pattern that creates major scales.',
  xpReward: 50,
  blocks: [
    {
      id: 'sk1-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A SCALE is a series of notes in order from low to high (or high to low). The MAJOR SCALE is the most common scale in Western music.',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 69, 71, 72], // C major scale
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-1-pattern',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The major scale follows a specific pattern of WHOLE steps (W) and HALF steps (H): W-W-H-W-W-W-H. This pattern always creates that bright, happy major sound.',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 69, 71, 72],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-1-dore',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'You might know this as "Do-Re-Mi-Fa-Sol-La-Ti-Do." These syllables help us sing and remember the scale degrees.',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 69, 71, 72],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-1-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'How many notes are in a major scale (including the repeat at the top)?',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 69, 71, 72],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['5 notes', '7 notes', '8 notes'],
          correctIndex: 2,
          explanation: 'A major scale has 8 notes: 7 unique notes plus the octave (repeat of the first note).',
        },
      },
    },
    {
      id: 'sk1-1-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Does the major scale sound HAPPY or SAD?',
          audioType: 'scale',
          audioData: {
            notes: [62, 64, 66, 67, 69, 71, 73, 74], // D major
            scaleType: 'major',
            rootNote: 62,
          },
          options: ['Happy/bright', 'Sad/dark'],
          correctIndex: 0,
          explanation: 'The major scale has a bright, happy quality. It\'s the foundation for cheerful music.',
        },
      },
    },
    {
      id: 'sk1-1-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The major scale pattern is W-W-H-W-W-W-{{0}}.',
          blanks: [
            {
              options: ['H', 'W', 'G', 'F'],
              correctIndex: 0,
            },
          ],
          explanation: 'The last step in the major scale pattern is H (half step).',
        },
      },
    },
    {
      id: 'sk1-1-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put the solfege syllables in order (lowest to highest):',
          items: [
            { id: 'mi', label: 'Mi', correctPosition: 2 },
            { id: 'do', label: 'Do', correctPosition: 0 },
            { id: 'sol', label: 'Sol', correctPosition: 3 },
            { id: 're', label: 'Re', correctPosition: 1 },
          ],
          explanation: 'Do (1) - Re (2) - Mi (3) - Sol (5)',
        },
      },
    },
  ],
};
