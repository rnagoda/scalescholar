/**
 * Lesson 2.2: Tritone
 *
 * Introduction to the tritone interval (6 half steps).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-2-2',
  trackId: 'intervals',
  levelIndex: 2,
  lessonIndex: 2,
  title: 'Tritone',
  description: 'Learn the unstable, dissonant tritone - the "devil\'s interval."',
  xpReward: 50,
  blocks: [
    {
      id: 'i2-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The TRITONE spans exactly 6 half steps - half an octave. It sounds unstable and tense. In medieval times, it was called the "devil in music"!',
          audioType: 'interval',
          audioData: {
            notes: [60, 66], // C to F#
          },
        },
      },
    },
    {
      id: 'i2-2-sound',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The tritone creates tension that wants to resolve. It\'s used in suspense movies and jazz. Listen to its uneasy sound:',
          audioType: 'interval',
          audioData: {
            notes: [60, 66],
          },
        },
      },
    },
    {
      id: 'i2-2-name',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'It\'s called a "tritone" because it spans 3 whole tones (3 × 2 = 6 half steps). It can also be called an augmented fourth or diminished fifth.',
          audioType: 'interval',
          audioData: {
            notes: [60, 66],
          },
        },
      },
    },
    {
      id: 'i2-2-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this interval. Does it sound STABLE or UNSTABLE?',
          audioType: 'interval',
          audioData: {
            notes: [62, 68], // D to G# - tritone
          },
          options: ['Stable and peaceful', 'Unstable and tense'],
          correctIndex: 1,
          explanation: 'The tritone is the most unstable interval - it creates maximum tension.',
        },
      },
    },
    {
      id: 'i2-2-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a PERFECT FOURTH or a TRITONE?',
          audioType: 'interval',
          audioData: {
            notes: [65, 71], // F to B - tritone
          },
          options: ['Perfect 4th (5 semitones, stable)', 'Tritone (6 semitones, unstable)'],
          correctIndex: 1,
          explanation: 'This is a tritone - you can hear its characteristic tension.',
        },
      },
    },
    {
      id: 'i2-2-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a PERFECT FOURTH or a TRITONE?',
          audioType: 'interval',
          audioData: {
            notes: [60, 65], // C to F - perfect fourth
          },
          options: ['Perfect 4th (5 semitones, stable)', 'Tritone (6 semitones, unstable)'],
          correctIndex: 0,
          explanation: 'This is a perfect fourth - more stable and open sounding.',
        },
      },
    },
    {
      id: 'i2-2-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'A tritone spans {{0}} half steps (exactly half an octave).',
          blanks: [
            {
              options: ['5', '6', '7', '8'],
              correctIndex: 1,
            },
          ],
          explanation: 'A tritone spans 6 half steps - exactly half an octave.',
        },
      },
    },
  ],
};
