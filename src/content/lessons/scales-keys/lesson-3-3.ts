/**
 * Lesson 3.3: E Minor Scale
 *
 * Introduction to E minor - relative minor of G major.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-3-3',
  trackId: 'scales-keys',
  levelIndex: 3,
  lessonIndex: 3,
  title: 'E Minor Scale',
  description: 'Learn E minor - the relative minor of G major with one sharp.',
  xpReward: 50,
  blocks: [
    {
      id: 'sk3-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'E MINOR is the relative minor of G major. It has one sharp (F#) - the same as G major. E minor is very popular for guitar music!',
          audioType: 'scale',
          audioData: {
            notes: [64, 66, 67, 69, 71, 72, 74, 76], // E minor
            scaleType: 'minor',
            rootNote: 64,
          },
        },
      },
    },
    {
      id: 'sk3-3-relation',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'E is the 6th note of G major, so E minor is its relative minor. Listen to G major, then E minor - same notes, different home:',
          audioType: 'scale',
          audioData: {
            notes: [67, 69, 71, 72, 74, 76, 0, 64, 66, 67, 69, 71],
            scaleType: 'major',
            rootNote: 67,
          },
        },
      },
    },
    {
      id: 'sk3-3-fsharp',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Notice the F# in the E minor scale. Without it, the pattern wouldn\'t be correct. Listen for the F#:',
          audioType: 'scale',
          audioData: {
            notes: [64, 66, 67, 69, 71, 72, 74, 76],
            scaleType: 'minor',
            rootNote: 64,
          },
        },
      },
    },
    {
      id: 'sk3-3-quiz1',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'How many sharps does E minor have?',
          visualType: 'staff',
          visualData: {
            keySignature: 'Em',
          },
          options: ['None (0)', 'One (1)', 'Two (2)'],
          correctIndex: 1,
          explanation: 'E minor has one sharp (F#) - the same as its relative major, G major.',
        },
      },
    },
    {
      id: 'sk3-3-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'E minor is the relative minor of which major key?',
          audioType: 'scale',
          audioData: {
            notes: [64, 66, 67, 69, 71, 72, 74, 76],
            scaleType: 'minor',
            rootNote: 64,
          },
          options: ['C major', 'G major', 'D major'],
          correctIndex: 1,
          explanation: 'E minor is the relative minor of G major - both have one sharp (F#).',
        },
      },
    },
    {
      id: 'sk3-3-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this scale MAJOR or MINOR?',
          audioType: 'scale',
          audioData: {
            notes: [64, 66, 67, 69, 71, 72, 74, 76],
            scaleType: 'minor',
            rootNote: 64,
          },
          options: ['Major (bright)', 'Minor (dark)'],
          correctIndex: 1,
          explanation: 'This is E minor - you can hear its dark, melancholy quality.',
        },
      },
    },
    {
      id: 'sk3-3-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each minor key to its relative major:',
          items: [
            { id: 'amin', label: 'A minor', correctZone: 'cmaj' },
            { id: 'emin', label: 'E minor', correctZone: 'gmaj' },
          ],
          zones: [
            { id: 'cmaj', label: 'C major' },
            { id: 'gmaj', label: 'G major' },
          ],
        },
      },
    },
  ],
};
