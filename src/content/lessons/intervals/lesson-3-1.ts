/**
 * Lesson 3.1: Major Sixth
 *
 * Introduction to the major sixth interval (9 half steps).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-3-1',
  trackId: 'intervals',
  levelIndex: 3,
  lessonIndex: 1,
  title: 'Major Sixth',
  description: 'Learn the bright, memorable sound of the major sixth.',
  xpReward: 50,
  blocks: [
    {
      id: 'i3-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A MAJOR SIXTH (M6) spans 9 half steps. It has a bright, optimistic quality that\'s very memorable.',
          audioType: 'interval',
          audioData: {
            notes: [60, 69], // C to A
          },
        },
      },
    },
    {
      id: 'i3-1-reference',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The NBC chimes use a major sixth! It\'s also the beginning of "My Bonnie Lies Over the Ocean." Very distinctive.',
          audioType: 'interval',
          audioData: {
            notes: [60, 69],
          },
        },
      },
    },
    {
      id: 'i3-1-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Compare the minor sixth (dark, 8 semitones) to the major sixth (bright, 9 semitones):',
          audioType: 'scale',
          audioData: {
            notes: [60, 68, 0, 60, 69],
          },
        },
      },
    },
    {
      id: 'i3-1-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MINOR SIXTH or MAJOR SIXTH?',
          audioType: 'interval',
          audioData: {
            notes: [62, 71], // D to B - major sixth
          },
          options: ['Minor 6th (8 semitones, dark)', 'Major 6th (9 semitones, bright)'],
          correctIndex: 1,
          explanation: 'This is a major sixth - that bright, memorable sound.',
        },
      },
    },
    {
      id: 'i3-1-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MINOR SIXTH or MAJOR SIXTH?',
          audioType: 'interval',
          audioData: {
            notes: [64, 72], // E to C - minor sixth
          },
          options: ['Minor 6th (8 semitones, dark)', 'Major 6th (9 semitones, bright)'],
          correctIndex: 0,
          explanation: 'This is a minor sixth - darker and more tense.',
        },
      },
    },
    {
      id: 'i3-1-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Think of the NBC chimes. What interval is this?',
          audioType: 'interval',
          audioData: {
            notes: [65, 74], // F to D - major sixth
          },
          options: ['Perfect 5th', 'Minor 6th', 'Major 6th'],
          correctIndex: 2,
          explanation: 'This is a major sixth - like the NBC chimes.',
        },
      },
    },
    {
      id: 'i3-1-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'A major sixth spans {{0}} half steps.',
          blanks: [
            {
              options: ['7', '8', '9', '10'],
              correctIndex: 2,
            },
          ],
          explanation: 'A major sixth spans 9 half steps.',
        },
      },
    },
  ],
};
