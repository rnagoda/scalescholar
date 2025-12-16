/**
 * Lesson 1.4: Major Third
 *
 * Introduction to the major third interval (4 half steps).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-1-4',
  trackId: 'intervals',
  levelIndex: 1,
  lessonIndex: 4,
  title: 'Major Third',
  description: 'Learn the bright, happy sound of the major third interval.',
  xpReward: 50,
  blocks: [
    {
      id: 'i1-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A MAJOR THIRD (M3) spans 4 half steps. It sounds bright, happy, and sweet. It\'s the interval that makes major chords sound cheerful.',
          audioType: 'interval',
          audioData: {
            notes: [60, 64], // C to E
          },
        },
      },
    },
    {
      id: 'i1-4-sound',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Think of "Kumbaya" or "When the Saints Go Marching In" - they start with a major third. It\'s an optimistic, uplifting sound.',
          audioType: 'interval',
          audioData: {
            notes: [60, 64],
          },
        },
      },
    },
    {
      id: 'i1-4-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Compare the minor third (sad) to the major third (happy). First minor third, then major third:',
          audioType: 'scale',
          audioData: {
            notes: [60, 63, 0, 60, 64],
          },
        },
      },
    },
    {
      id: 'i1-4-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Does this interval sound HAPPY or SAD?',
          audioType: 'interval',
          audioData: {
            notes: [65, 69], // F to A - major third
          },
          options: ['Happy/bright (major 3rd)', 'Sad/dark (minor 3rd)'],
          correctIndex: 0,
          explanation: 'This is a major third - you can hear its bright, happy quality.',
        },
      },
    },
    {
      id: 'i1-4-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MINOR third or MAJOR third?',
          audioType: 'interval',
          audioData: {
            notes: [62, 65], // D to F - minor third
          },
          options: ['Minor 3rd (3 semitones, sad)', 'Major 3rd (4 semitones, happy)'],
          correctIndex: 0,
          explanation: 'This is a minor third - notice its darker, more melancholy sound.',
        },
      },
    },
    {
      id: 'i1-4-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MINOR third or MAJOR third?',
          audioType: 'interval',
          audioData: {
            notes: [67, 71], // G to B - major third
          },
          options: ['Minor 3rd (3 semitones, sad)', 'Major 3rd (4 semitones, happy)'],
          correctIndex: 1,
          explanation: 'This is a major third - bright and cheerful sounding.',
        },
      },
    },
    {
      id: 'i1-4-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put these intervals in order from SMALLEST to LARGEST:',
          items: [
            { id: 'M3', label: 'Major 3rd', correctPosition: 2 },
            { id: 'm2', label: 'Minor 2nd', correctPosition: 0 },
            { id: 'm3', label: 'Minor 3rd', correctPosition: 1 },
          ],
          explanation: 'Minor 2nd (1) < Minor 3rd (3) < Major 3rd (4) semitones',
        },
      },
    },
    {
      id: 'i1-4-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each third to its quality:',
          items: [
            { id: 'm3', label: 'Minor 3rd (3 semitones)', correctZone: 'sad' },
            { id: 'M3', label: 'Major 3rd (4 semitones)', correctZone: 'happy' },
          ],
          zones: [
            { id: 'sad', label: 'Sad/dark sound' },
            { id: 'happy', label: 'Happy/bright sound' },
          ],
          explanation: 'Minor 3rd = sad/dark, Major 3rd = happy/bright',
        },
      },
    },
  ],
};
