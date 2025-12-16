/**
 * Lesson 3.1: Natural Minor Scale
 *
 * Introduction to the natural minor scale and relative minor concept.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-3-1',
  trackId: 'scales-keys',
  levelIndex: 3,
  lessonIndex: 1,
  title: 'Natural Minor Scale',
  description: 'Learn the sad, dark sound of the natural minor scale.',
  xpReward: 50,
  blocks: [
    {
      id: 'sk3-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The NATURAL MINOR SCALE has a sad, dark quality - the opposite of the bright major scale. It uses a different pattern of whole and half steps.',
          audioType: 'scale',
          audioData: {
            notes: [69, 71, 72, 74, 76, 77, 79, 81], // A natural minor
            scaleType: 'minor',
            rootNote: 69,
          },
        },
      },
    },
    {
      id: 'sk3-1-pattern',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The natural minor pattern is: W-H-W-W-H-W-W. Compare this to major (W-W-H-W-W-W-H). The half steps are in different places!',
          audioType: 'scale',
          audioData: {
            notes: [69, 71, 72, 74, 76, 77, 79, 81],
            scaleType: 'minor',
            rootNote: 69,
          },
        },
      },
    },
    {
      id: 'sk3-1-relative',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Every major key has a RELATIVE MINOR that shares the same key signature. The relative minor starts on the 6th degree of the major scale.',
          audioType: 'note',
          audioData: {
            notes: [69], // A is 6th of C major
          },
        },
      },
    },
    {
      id: 'sk3-1-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Listen to C major, then its relative minor (A minor). Same notes, different starting point, completely different mood!',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 0, 69, 71, 72, 74, 76],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk3-1-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Does this natural minor scale sound HAPPY or SAD?',
          audioType: 'scale',
          audioData: {
            notes: [64, 66, 67, 69, 71, 72, 74, 76], // E minor
            scaleType: 'minor',
            rootNote: 64,
          },
          options: ['Happy/bright', 'Sad/dark'],
          correctIndex: 1,
          explanation: 'The natural minor scale has that characteristic sad, dark quality.',
        },
      },
    },
    {
      id: 'sk3-1-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MAJOR or MINOR scale?',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 69, 71, 72],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Major (happy)', 'Minor (sad)'],
          correctIndex: 0,
          explanation: 'This is a major scale - you can hear its bright, happy quality.',
        },
      },
    },
    {
      id: 'sk3-1-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The natural minor scale pattern is W-H-W-W-H-W-{{0}}.',
          blanks: [
            {
              options: ['W', 'H', 'G', 'F'],
              correctIndex: 0,
            },
          ],
          explanation: 'The natural minor scale pattern ends with W (whole step): W-H-W-W-H-W-W.',
        },
      },
    },
    {
      id: 'sk3-1-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each scale to its quality:',
          items: [
            { id: 'major', label: 'Major Scale', correctZone: 'bright' },
            { id: 'minor', label: 'Natural Minor Scale', correctZone: 'dark' },
          ],
          zones: [
            { id: 'bright', label: 'Bright/happy' },
            { id: 'dark', label: 'Dark/sad' },
          ],
        },
      },
    },
  ],
};
