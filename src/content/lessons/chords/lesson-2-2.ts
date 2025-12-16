/**
 * Lesson 2.2: Suspended Chords
 *
 * Introduction to sus2 and sus4 chords.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-2-2',
  trackId: 'chords',
  levelIndex: 2,
  lessonIndex: 2,
  title: 'Suspended Chords',
  description: 'Learn about sus2 and sus4 chords - neither major nor minor.',
  xpReward: 50,
  blocks: [
    {
      id: 'c2-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'SUSPENDED chords (sus) replace the third with another note. Without a third, they\'re neither major nor minor - they\'re ambiguous!',
          audioType: 'chord',
          audioData: {
            notes: [60, 65, 67], // Csus4
          },
        },
      },
    },
    {
      id: 'c2-2-sus4',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A SUS4 chord replaces the third with the fourth. It creates a sense of suspension that wants to resolve down to major.',
          audioType: 'scale',
          audioData: {
            notes: [60, 65, 67, 0, 60, 64, 67], // Csus4 to C major
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c2-2-sus2',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A SUS2 chord replaces the third with the second. It has an open, airy quality.',
          audioType: 'chord',
          audioData: {
            notes: [60, 62, 67], // Csus2
          },
        },
      },
    },
    {
      id: 'c2-2-neither',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Since there\'s no third, sus chords aren\'t happy (major) or sad (minor). They\'re floating, waiting to resolve.',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 67, 0, 60, 65, 67],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c2-2-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What note does a SUS4 chord use instead of the third?',
          audioType: 'chord',
          audioData: {
            notes: [60, 65, 67], // Csus4
          },
          options: ['The second', 'The fourth', 'The sixth'],
          correctIndex: 1,
          explanation: 'Sus4 replaces the third with the fourth.',
        },
      },
    },
    {
      id: 'c2-2-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a SUS2 or SUS4 chord?',
          audioType: 'chord',
          audioData: {
            notes: [62, 64, 69], // Dsus2
          },
          options: ['Sus2', 'Sus4'],
          correctIndex: 0,
          explanation: 'This is a sus2 chord - you can hear the lower second instead of a higher fourth.',
        },
      },
    },
    {
      id: 'c2-2-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Does this suspended chord sound MAJOR, MINOR, or NEITHER?',
          audioType: 'chord',
          audioData: {
            notes: [67, 72, 74], // Gsus4
          },
          options: ['Major (happy)', 'Minor (sad)', 'Neither (ambiguous)'],
          correctIndex: 2,
          explanation: 'Sus chords are neither major nor minor - they\'re ambiguous without a third.',
        },
      },
    },
    {
      id: 'c2-2-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each chord to what replaces the third:',
          items: [
            { id: 'sus2', label: 'Sus2', correctZone: 'second' },
            { id: 'sus4', label: 'Sus4', correctZone: 'fourth' },
          ],
          zones: [
            { id: 'second', label: 'Second (2nd)' },
            { id: 'fourth', label: 'Fourth (4th)' },
          ],
        },
      },
    },
  ],
};
