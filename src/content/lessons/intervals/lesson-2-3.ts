/**
 * Lesson 2.3: Perfect Fifth
 *
 * Introduction to the perfect fifth interval (7 half steps).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-2-3',
  trackId: 'intervals',
  levelIndex: 2,
  lessonIndex: 3,
  title: 'Perfect Fifth',
  description: 'Learn the powerful, stable perfect fifth - the power chord interval.',
  xpReward: 50,
  blocks: [
    {
      id: 'i2-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A PERFECT FIFTH (P5) spans 7 half steps. It\'s one of the most stable and powerful intervals. It\'s the foundation of power chords in rock music!',
          audioType: 'interval',
          audioData: {
            notes: [60, 67], // C to G
          },
        },
      },
    },
    {
      id: 'i2-3-reference',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: '"Twinkle Twinkle Little Star" starts with a perfect fifth. It\'s also the opening of the Star Wars theme. Listen:',
          audioType: 'interval',
          audioData: {
            notes: [60, 67],
          },
        },
      },
    },
    {
      id: 'i2-3-power',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'When played together, the perfect fifth creates a power chord - strong and bold without being major or minor:',
          audioType: 'chord',
          audioData: {
            notes: [48, 55], // Power chord - C and G together
          },
        },
      },
    },
    {
      id: 'i2-3-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a TRITONE or PERFECT FIFTH?',
          audioType: 'interval',
          audioData: {
            notes: [62, 69], // D to A - perfect fifth
          },
          options: ['Tritone (6 semitones, unstable)', 'Perfect 5th (7 semitones, stable)'],
          correctIndex: 1,
          explanation: 'This is a perfect fifth - strong and stable.',
        },
      },
    },
    {
      id: 'i2-3-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What interval is this?',
          audioType: 'interval',
          audioData: {
            notes: [65, 72], // F to C - perfect fifth
          },
          options: ['Perfect 4th', 'Tritone', 'Perfect 5th'],
          correctIndex: 2,
          explanation: 'This is a perfect fifth - that open, powerful sound.',
        },
      },
    },
    {
      id: 'i2-3-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Think of "Twinkle Twinkle Little Star." What interval is this?',
          audioType: 'interval',
          audioData: {
            notes: [67, 74], // G to D - perfect fifth
          },
          options: ['Perfect 4th', 'Tritone', 'Perfect 5th'],
          correctIndex: 2,
          explanation: 'This is a perfect fifth - like "Twinkle Twinkle."',
        },
      },
    },
    {
      id: 'i2-3-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put these intervals in order from SMALLEST to LARGEST:',
          items: [
            { id: 'P5', label: 'Perfect 5th', correctPosition: 2 },
            { id: 'TT', label: 'Tritone', correctPosition: 1 },
            { id: 'P4', label: 'Perfect 4th', correctPosition: 0 },
          ],
          explanation: 'P4 (5) < Tritone (6) < P5 (7) half steps',
        },
      },
    },
  ],
};
