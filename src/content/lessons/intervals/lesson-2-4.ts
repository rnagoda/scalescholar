/**
 * Lesson 2.4: Minor Sixth
 *
 * Introduction to the minor sixth interval (8 half steps).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-2-4',
  trackId: 'intervals',
  levelIndex: 2,
  lessonIndex: 4,
  title: 'Minor Sixth',
  description: 'Learn the bittersweet sound of the minor sixth interval.',
  xpReward: 50,
  blocks: [
    {
      id: 'i2-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A MINOR SIXTH (m6) spans 8 half steps. It has a somewhat dark, mysterious quality - wider than a fifth but still with tension.',
          audioType: 'interval',
          audioData: {
            notes: [60, 68], // C to Ab
          },
        },
      },
    },
    {
      id: 'i2-4-sound',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The minor sixth appears in dramatic film scores and classical music. It creates a sense of yearning or unresolved emotion.',
          audioType: 'interval',
          audioData: {
            notes: [60, 68],
          },
        },
      },
    },
    {
      id: 'i2-4-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Compare the perfect fifth (7 semitones) to the minor sixth (8 semitones):',
          audioType: 'scale',
          audioData: {
            notes: [60, 67, 0, 60, 68],
          },
        },
      },
    },
    {
      id: 'i2-4-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a PERFECT FIFTH or MINOR SIXTH?',
          audioType: 'interval',
          audioData: {
            notes: [64, 72], // E to C - minor sixth
          },
          options: ['Perfect 5th (7 semitones)', 'Minor 6th (8 semitones)'],
          correctIndex: 1,
          explanation: 'This is a minor sixth - slightly wider than a fifth with more tension.',
        },
      },
    },
    {
      id: 'i2-4-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a PERFECT FIFTH or MINOR SIXTH?',
          audioType: 'interval',
          audioData: {
            notes: [62, 69], // D to A - perfect fifth
          },
          options: ['Perfect 5th (7 semitones)', 'Minor 6th (8 semitones)'],
          correctIndex: 0,
          explanation: 'This is a perfect fifth - stable and powerful.',
        },
      },
    },
    {
      id: 'i2-4-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What interval is this?',
          audioType: 'interval',
          audioData: {
            notes: [67, 75], // G to Eb - minor sixth
          },
          options: ['Tritone', 'Perfect 5th', 'Minor 6th'],
          correctIndex: 2,
          explanation: 'This is a minor sixth - 8 half steps with that dark, yearning quality.',
        },
      },
    },
    {
      id: 'i2-4-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each interval to its size:',
          items: [
            { id: 'TT', label: 'Tritone', correctZone: 'six' },
            { id: 'P5', label: 'Perfect 5th', correctZone: 'seven' },
            { id: 'm6', label: 'Minor 6th', correctZone: 'eight' },
          ],
          zones: [
            { id: 'six', label: '6 half steps' },
            { id: 'seven', label: '7 half steps' },
            { id: 'eight', label: '8 half steps' },
          ],
          explanation: 'Tritone = 6, Perfect 5th = 7, Minor 6th = 8 half steps',
        },
      },
    },
  ],
};
