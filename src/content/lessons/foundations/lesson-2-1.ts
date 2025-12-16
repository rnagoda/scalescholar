/**
 * Lesson 2.1: The Beat
 *
 * Introduction to steady pulse and tempo concepts.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-2-1',
  trackId: 'foundations',
  levelIndex: 2,
  lessonIndex: 1,
  title: 'The Beat',
  description: 'Learn about steady pulse and how tempo affects the speed of music.',
  xpReward: 50,
  blocks: [
    {
      id: 'f2-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Music has a BEAT - a steady pulse like a heartbeat. When you tap your foot to a song, you\'re following the beat. Listen to these steady beats:',
          audioType: 'scale',
          audioData: {
            notes: [60, 60, 60, 60], // Four steady C notes
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f2-1-tempo-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'TEMPO is how fast or slow the beat goes. A slow tempo feels relaxed. Listen to this slow beat:',
          audioType: 'scale',
          audioData: {
            notes: [60, 60, 60, 60],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f2-1-fast-tempo',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A fast tempo feels energetic and exciting. Listen to this fast beat:',
          audioType: 'scale',
          audioData: {
            notes: [60, 60, 60, 60, 60, 60, 60, 60],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f2-1-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this beat. Is the tempo FAST or SLOW?',
          audioType: 'scale',
          audioData: {
            notes: [60, 60, 60, 60, 60, 60],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Slow tempo', 'Fast tempo'],
          correctIndex: 1,
          explanation: 'This is a fast tempo. The beats come quickly, one after another.',
        },
      },
    },
    {
      id: 'f2-1-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this beat. Is the tempo FAST or SLOW?',
          audioType: 'scale',
          audioData: {
            notes: [60, 60, 60, 60],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Slow tempo', 'Fast tempo'],
          correctIndex: 0,
          explanation: 'This is a slow tempo. There\'s plenty of time between each beat.',
        },
      },
    },
    {
      id: 'f2-1-fill1',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The steady pulse in music is called the {{0}}.',
          blanks: [
            {
              options: ['beat', 'tempo', 'rhythm', 'melody'],
              correctIndex: 0,
            },
          ],
          explanation: 'The steady pulse in music is called the beat, like a heartbeat.',
        },
      },
    },
    {
      id: 'f2-1-fill2',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The speed of the beat is called {{0}}.',
          blanks: [
            {
              options: ['tempo', 'beat', 'pitch', 'volume'],
              correctIndex: 0,
            },
          ],
          explanation: 'The speed of the beat is called tempo - it can be fast or slow.',
        },
      },
    },
  ],
};
