/**
 * Lesson 1.3: Minor Triads
 *
 * Introduction to minor triads (root, m3, P5).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-1-3',
  trackId: 'chords',
  levelIndex: 1,
  lessonIndex: 3,
  title: 'Minor Triads',
  description: 'Learn the sad, dark sound of minor chords.',
  xpReward: 50,
  blocks: [
    {
      id: 'c1-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A MINOR TRIAD has a sad, dark sound. It\'s built with a root, a MINOR third (3 half steps), and a perfect fifth (7 half steps).',
          audioType: 'chord',
          audioData: {
            notes: [60, 63, 67], // C minor
          },
        },
      },
    },
    {
      id: 'c1-3-difference',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The only difference from major is the third! Minor third = sad. Major third = happy. The fifth stays the same.',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 60, 63, 67], // C major then C minor
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c1-3-formula',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The minor triad formula is: Root + Minor 3rd + Perfect 5th. In numbers: 0 + 3 + 7 half steps.',
          audioType: 'chord',
          audioData: {
            notes: [60, 63, 67],
          },
        },
      },
    },
    {
      id: 'c1-3-examples',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Here are some minor triads. A minor, D minor, E minor:',
          audioType: 'scale',
          audioData: {
            notes: [69, 72, 76, 0, 62, 65, 69, 0, 64, 67, 71],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c1-3-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Does this minor chord sound HAPPY or SAD?',
          audioType: 'chord',
          audioData: {
            notes: [62, 65, 69], // D minor
          },
          options: ['Happy/bright', 'Sad/dark'],
          correctIndex: 1,
          explanation: 'Minor chords have that characteristic sad, dark quality.',
        },
      },
    },
    {
      id: 'c1-3-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this chord MAJOR or MINOR?',
          audioType: 'chord',
          audioData: {
            notes: [64, 68, 71], // E major
          },
          options: ['Major (happy)', 'Minor (sad)'],
          correctIndex: 0,
          explanation: 'This is a major chord - you can hear the bright, happy quality.',
        },
      },
    },
    {
      id: 'c1-3-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this chord MAJOR or MINOR?',
          audioType: 'chord',
          audioData: {
            notes: [64, 67, 71], // E minor
          },
          options: ['Major (happy)', 'Minor (sad)'],
          correctIndex: 1,
          explanation: 'This is a minor chord - you can hear the sad, dark quality.',
        },
      },
    },
    {
      id: 'c1-3-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each chord type to its third:',
          items: [
            { id: 'major', label: 'Major triad', correctZone: 'major3' },
            { id: 'minor', label: 'Minor triad', correctZone: 'minor3' },
          ],
          zones: [
            { id: 'major3', label: 'Major 3rd (4 semitones)' },
            { id: 'minor3', label: 'Minor 3rd (3 semitones)' },
          ],
        },
      },
    },
  ],
};
