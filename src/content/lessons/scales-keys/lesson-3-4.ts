/**
 * Lesson 3.4: Harmonic Minor
 *
 * Introduction to the harmonic minor scale (raised 7th).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-3-4',
  trackId: 'scales-keys',
  levelIndex: 3,
  lessonIndex: 4,
  title: 'Harmonic Minor',
  description: 'Learn the exotic harmonic minor scale with its raised 7th degree.',
  xpReward: 75,
  blocks: [
    {
      id: 'sk3-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The HARMONIC MINOR scale has an exotic, dramatic sound. It\'s created by raising the 7th degree of the natural minor scale.',
          audioType: 'scale',
          audioData: {
            notes: [69, 71, 72, 74, 76, 77, 80, 81], // A harmonic minor
            scaleType: 'minor',
            rootNote: 69,
          },
        },
      },
    },
    {
      id: 'sk3-4-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Compare natural minor (flat 7th) to harmonic minor (raised 7th). First natural, then harmonic:',
          audioType: 'scale',
          audioData: {
            notes: [69, 71, 72, 74, 76, 77, 79, 81, 0, 69, 71, 72, 74, 76, 77, 80, 81],
            scaleType: 'minor',
            rootNote: 69,
          },
        },
      },
    },
    {
      id: 'sk3-4-gap',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The raised 7th creates a gap of 3 half steps between the 6th and 7th notes. This gives harmonic minor its exotic, Eastern sound.',
          audioType: 'scale',
          audioData: {
            notes: [77, 80, 81], // Ab to G# to A - the distinctive interval
            scaleType: 'minor',
            rootNote: 69,
          },
        },
      },
    },
    {
      id: 'sk3-4-leading',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The raised 7th becomes a leading tone, just like in major! It pulls strongly up to the tonic. That\'s why it\'s used in harmony.',
          audioType: 'scale',
          audioData: {
            notes: [80, 81], // G# to A
            scaleType: 'minor',
            rootNote: 69,
          },
        },
      },
    },
    {
      id: 'sk3-4-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What makes harmonic minor different from natural minor?',
          audioType: 'scale',
          audioData: {
            notes: [69, 71, 72, 74, 76, 77, 80, 81],
            scaleType: 'minor',
            rootNote: 69,
          },
          options: ['Lowered 3rd', 'Raised 7th', 'Raised 5th'],
          correctIndex: 1,
          explanation: 'Harmonic minor raises the 7th degree, creating a leading tone.',
        },
      },
    },
    {
      id: 'sk3-4-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this NATURAL minor or HARMONIC minor?',
          audioType: 'scale',
          audioData: {
            notes: [64, 66, 67, 69, 71, 72, 75, 76], // E harmonic minor
            scaleType: 'minor',
            rootNote: 64,
          },
          options: ['Natural minor', 'Harmonic minor'],
          correctIndex: 1,
          explanation: 'This is harmonic minor - you can hear the exotic raised 7th.',
        },
      },
    },
    {
      id: 'sk3-4-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this NATURAL minor or HARMONIC minor?',
          audioType: 'scale',
          audioData: {
            notes: [64, 66, 67, 69, 71, 72, 74, 76], // E natural minor
            scaleType: 'minor',
            rootNote: 64,
          },
          options: ['Natural minor', 'Harmonic minor'],
          correctIndex: 0,
          explanation: 'This is natural minor - the 7th is not raised.',
        },
      },
    },
    {
      id: 'sk3-4-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'Harmonic minor raises the {{0}} degree to create a leading tone.',
          blanks: [
            {
              options: ['7th', '6th', '5th', '3rd'],
              correctIndex: 0,
            },
          ],
          explanation: 'Harmonic minor raises the 7th degree to create a leading tone that pulls strongly to the tonic.',
        },
      },
    },
  ],
};
