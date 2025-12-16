/**
 * Lesson 1.1: What is Pitch?
 *
 * Introduction to the concept of pitch - high vs low sounds.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-1-1',
  trackId: 'foundations',
  levelIndex: 1,
  lessonIndex: 1,
  title: 'What is Pitch?',
  description: 'Learn the basics of pitch - how sounds can be high or low.',
  xpReward: 50,
  blocks: [
    {
      id: 'f1-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Pitch describes how high or low a sound is. When you hum a tune, you\'re changing the pitch of your voice. Listen to this low note:',
          audioType: 'note',
          audioData: {
            notes: [48], // C3 - a low note
          },
        },
      },
    },
    {
      id: 'f1-1-high',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Now listen to this high note. Notice how different it sounds from the low note:',
          audioType: 'note',
          audioData: {
            notes: [72], // C5 - a high note
          },
        },
      },
    },
    {
      id: 'f1-1-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this note. Is it a HIGH or LOW pitch?',
          audioType: 'note',
          audioData: {
            notes: [76], // E5 - high note
          },
          options: ['Low', 'High'],
          correctIndex: 1,
          explanation: 'This is a high-pitched note. High notes sound bright and thin.',
        },
      },
    },
    {
      id: 'f1-1-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this note. Is it a HIGH or LOW pitch?',
          audioType: 'note',
          audioData: {
            notes: [43], // G2 - low note
          },
          options: ['Low', 'High'],
          correctIndex: 0,
          explanation: 'This is a low-pitched note. Low notes sound deep and full.',
        },
      },
    },
    {
      id: 'f1-1-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'When two notes are played together or in sequence, we can compare their pitches. The first note here is lower, and the second is higher:',
          audioType: 'interval',
          audioData: {
            notes: [60, 67], // C4 to G4
          },
        },
      },
    },
    {
      id: 'f1-1-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to these two notes. Which direction does the pitch move?',
          audioType: 'interval',
          audioData: {
            notes: [64, 57], // E4 down to A3
          },
          options: ['Going UP (low to high)', 'Going DOWN (high to low)'],
          correctIndex: 1,
          explanation: 'The pitch moved DOWN - from a higher note to a lower note.',
        },
      },
    },
    {
      id: 'f1-1-quiz4',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to these two notes. Which direction does the pitch move?',
          audioType: 'interval',
          audioData: {
            notes: [55, 62], // G3 up to D4
          },
          options: ['Going UP (low to high)', 'Going DOWN (high to low)'],
          correctIndex: 0,
          explanation: 'The pitch moved UP - from a lower note to a higher note.',
        },
      },
    },
  ],
};
