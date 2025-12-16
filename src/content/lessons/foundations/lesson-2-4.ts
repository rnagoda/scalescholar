/**
 * Lesson 2.4: Time Signatures
 *
 * Introduction to 4/4 and 3/4 time signatures.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-2-4',
  trackId: 'foundations',
  levelIndex: 2,
  lessonIndex: 4,
  title: 'Time Signatures',
  description: 'Learn how time signatures organize beats into measures.',
  xpReward: 50,
  blocks: [
    {
      id: 'f2-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Music is organized into groups of beats called MEASURES. A TIME SIGNATURE tells you how many beats are in each measure. Let\'s explore the most common ones!',
          audioType: 'note',
          audioData: {
            notes: [60],
          },
        },
      },
    },
    {
      id: 'f2-4-four-four',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: '4/4 time has 4 beats per measure. It\'s the most common time signature - you hear it in rock, pop, and jazz. Count along: 1-2-3-4, 1-2-3-4...',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 60, 62, 64, 65],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f2-4-three-four',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: '3/4 time has 3 beats per measure. It\'s the time signature of waltzes! Count along: 1-2-3, 1-2-3...',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 60, 64, 67],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f2-4-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this pattern. How many beats are in each measure?',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 60, 62, 64, 65],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['3 beats (3/4 time)', '4 beats (4/4 time)'],
          correctIndex: 1,
          explanation: 'This is 4/4 time - you can count 1-2-3-4 in each measure.',
        },
      },
    },
    {
      id: 'f2-4-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this waltz pattern. How many beats per measure?',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 64, 60, 64, 64],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['3 beats (3/4 time)', '4 beats (4/4 time)'],
          correctIndex: 0,
          explanation: 'This is 3/4 time (waltz time) - you can count 1-2-3 in each measure.',
        },
      },
    },
    {
      id: 'f2-4-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each time signature to its description:',
          items: [
            { id: 'four-four', label: '4/4 time', correctZone: 'zone-1' },
            { id: 'three-four', label: '3/4 time', correctZone: 'zone-2' },
          ],
          zones: [
            { id: 'zone-1', label: '4 beats per measure' },
            { id: 'zone-2', label: '3 beats per measure (waltz)' },
          ],
        },
      },
    },
    {
      id: 'f2-4-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'A group of beats in music is called a {{0}}.',
          blanks: [
            {
              options: ['measure', 'beat', 'note', 'rest'],
              correctIndex: 0,
            },
          ],
          explanation: 'A group of beats in music is called a measure (also called a bar).',
        },
      },
    },
  ],
};
