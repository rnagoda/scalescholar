/**
 * Lesson 2.1: Perfect Fourth
 *
 * Introduction to the perfect fourth interval (5 half steps).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-2-1',
  trackId: 'intervals',
  levelIndex: 2,
  lessonIndex: 1,
  title: 'Perfect Fourth',
  description: 'Learn the stable, suspended sound of the perfect fourth.',
  xpReward: 50,
  blocks: [
    {
      id: 'i2-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A PERFECT FOURTH (P4) spans 5 half steps. It has a pure, open sound that feels suspended - neither happy nor sad.',
          audioType: 'interval',
          audioData: {
            notes: [60, 65], // C to F
          },
        },
      },
    },
    {
      id: 'i2-1-reference',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: '"Here Comes the Bride" starts with a perfect fourth. It\'s also the interval in many horn fanfares. Listen again:',
          audioType: 'interval',
          audioData: {
            notes: [60, 65],
          },
        },
      },
    },
    {
      id: 'i2-1-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Compare the major third (4 semitones) to the perfect fourth (5 semitones):',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 0, 60, 65],
          },
        },
      },
    },
    {
      id: 'i2-1-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MAJOR THIRD or PERFECT FOURTH?',
          audioType: 'interval',
          audioData: {
            notes: [67, 72], // G to C - perfect fourth
          },
          options: ['Major 3rd (4 semitones)', 'Perfect 4th (5 semitones)'],
          correctIndex: 1,
          explanation: 'This is a perfect fourth - that open, suspended sound.',
        },
      },
    },
    {
      id: 'i2-1-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What interval is this?',
          audioType: 'interval',
          audioData: {
            notes: [62, 67], // D to G - perfect fourth
          },
          options: ['Minor 3rd', 'Major 3rd', 'Perfect 4th'],
          correctIndex: 2,
          explanation: 'This is a perfect fourth - 5 half steps with that pure, open quality.',
        },
      },
    },
    {
      id: 'i2-1-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Think of "Here Comes the Bride." What interval is this?',
          audioType: 'interval',
          audioData: {
            notes: [65, 70], // F to Bb - perfect fourth
          },
          options: ['Major 3rd', 'Perfect 4th', 'Perfect 5th'],
          correctIndex: 1,
          explanation: 'This is a perfect fourth - just like "Here Comes the Bride."',
        },
      },
    },
    {
      id: 'i2-1-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'A perfect fourth spans {{0}} half steps.',
          blanks: [
            {
              options: ['4', '5', '6', '7'],
              correctIndex: 1,
            },
          ],
          explanation: 'A perfect fourth spans 5 half steps.',
        },
      },
    },
  ],
};
