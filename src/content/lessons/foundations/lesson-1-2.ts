/**
 * Lesson 1.2: Musical Notes
 *
 * Introduction to the musical alphabet and note names.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-1-2',
  trackId: 'foundations',
  levelIndex: 1,
  lessonIndex: 2,
  title: 'Musical Notes',
  description: 'Learn the names of musical notes: A, B, C, D, E, F, G.',
  xpReward: 50,
  blocks: [
    {
      id: 'f1-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'In music, we name pitches using letters: A, B, C, D, E, F, and G. After G, we start over at A. This is called the musical alphabet.',
        },
      },
    },
    {
      id: 'f1-2-c',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Let\'s start with the note C - it\'s often called "Middle C" because it\'s in the middle of the piano. Listen:',
          audioType: 'note',
          audioData: {
            notes: [60], // Middle C
          },
        },
      },
    },
    {
      id: 'f1-2-scale-up',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Here are all the notes going up from C: C, D, E, F, G, A, B, and back to C. This pattern is called a scale:',
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
      id: 'f1-2-fill1',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The musical alphabet uses {{0}} letters: A, B, C, D, E, F, and {{1}}.',
          blanks: [
            {
              options: ['5', '6', '7', '8'],
              correctIndex: 2,
            },
            {
              options: ['H', 'G', 'Z', 'X'],
              correctIndex: 1,
            },
          ],
          explanation: 'The musical alphabet has 7 letters: A through G. After G, we start over at A.',
        },
      },
    },
    {
      id: 'f1-2-sorting1',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put these notes in order from lowest to highest, starting with C:',
          items: [
            { id: 'e', label: 'E', correctPosition: 2 },
            { id: 'c', label: 'C', correctPosition: 0 },
            { id: 'g', label: 'G', correctPosition: 4 },
            { id: 'd', label: 'D', correctPosition: 1 },
            { id: 'f', label: 'F', correctPosition: 3 },
          ],
          explanation: 'Starting from C, the order is: C, D, E, F, G. Each step up the alphabet is one note higher.',
        },
      },
    },
    {
      id: 'f1-2-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this note. What is its name?',
          audioType: 'note',
          audioData: {
            notes: [64], // E4
          },
          options: ['C', 'D', 'E', 'F'],
          correctIndex: 2,
          explanation: 'This is the note E. It\'s two steps above C in the musical alphabet.',
        },
      },
    },
    {
      id: 'f1-2-fill2',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'After the note G comes the note {{0}}. The pattern then {{1}}.',
          blanks: [
            {
              options: ['H', 'A', 'B', 'C'],
              correctIndex: 1,
            },
            {
              options: ['stops', 'repeats', 'reverses', 'jumps'],
              correctIndex: 1,
            },
          ],
          explanation: 'After G comes A, and the pattern repeats. This cycle continues across the entire range of musical pitches.',
        },
      },
    },
  ],
};
