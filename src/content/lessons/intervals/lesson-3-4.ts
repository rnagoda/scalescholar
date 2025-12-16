/**
 * Lesson 3.4: Octave
 *
 * Introduction to the octave interval (12 half steps).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-3-4',
  trackId: 'intervals',
  levelIndex: 3,
  lessonIndex: 4,
  title: 'Octave',
  description: 'Learn the perfect octave - the same note at different pitches.',
  xpReward: 75,
  blocks: [
    {
      id: 'i3-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'An OCTAVE (P8) spans 12 half steps - the distance from one note to the same note higher or lower. The notes are so related they share the same letter name!',
          audioType: 'interval',
          audioData: {
            notes: [60, 72], // C to C
          },
        },
      },
    },
    {
      id: 'i3-4-sound',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The octave sounds like the same note, just higher. It\'s the purest interval after unison. "Somewhere Over the Rainbow" starts with an octave.',
          audioType: 'interval',
          audioData: {
            notes: [60, 72],
          },
        },
      },
    },
    {
      id: 'i3-4-harmonic',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'When played together, octaves reinforce each other perfectly. They\'re used to add power and fullness:',
          audioType: 'chord',
          audioData: {
            notes: [48, 60, 72], // Three C's
          },
        },
      },
    },
    {
      id: 'i3-4-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MAJOR SEVENTH or an OCTAVE?',
          audioType: 'interval',
          audioData: {
            notes: [64, 76], // E to E - octave
          },
          options: ['Major 7th (11 semitones)', 'Octave (12 semitones)'],
          correctIndex: 1,
          explanation: 'This is an octave - the notes are the same, just at different pitches.',
        },
      },
    },
    {
      id: 'i3-4-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MAJOR SEVENTH or an OCTAVE?',
          audioType: 'interval',
          audioData: {
            notes: [67, 78], // G to F# - major seventh
          },
          options: ['Major 7th (11 semitones)', 'Octave (12 semitones)'],
          correctIndex: 0,
          explanation: 'This is a major seventh - close to an octave but with that slight tension.',
        },
      },
    },
    {
      id: 'i3-4-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Think of "Somewhere Over the Rainbow." What interval is this?',
          audioType: 'interval',
          audioData: {
            notes: [65, 77], // F to F - octave
          },
          options: ['Minor 7th', 'Major 7th', 'Octave'],
          correctIndex: 2,
          explanation: 'This is an octave - the same note an octave apart.',
        },
      },
    },
    {
      id: 'i3-4-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put ALL the intervals in order from SMALLEST to LARGEST:',
          items: [
            { id: 'P8', label: 'Octave', correctPosition: 3 },
            { id: 'M7', label: 'Major 7th', correctPosition: 2 },
            { id: 'm7', label: 'Minor 7th', correctPosition: 1 },
            { id: 'M6', label: 'Major 6th', correctPosition: 0 },
          ],
          explanation: 'M6 (9) < m7 (10) < M7 (11) < Octave (12)',
        },
      },
    },
    {
      id: 'i3-4-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'An octave spans {{0}} half steps.',
          blanks: [
            {
              options: ['10', '11', '12', '13'],
              correctIndex: 2,
            },
          ],
          explanation: 'An octave spans 12 half steps.',
        },
      },
    },
  ],
};
