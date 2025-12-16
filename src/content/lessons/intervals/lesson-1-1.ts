/**
 * Lesson 1.1: What is an Interval?
 *
 * Introduction to intervals - the distance between notes.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-1-1',
  trackId: 'intervals',
  levelIndex: 1,
  lessonIndex: 1,
  title: 'What is an Interval?',
  description: 'Learn about intervals - the musical distance between two notes.',
  xpReward: 50,
  blocks: [
    {
      id: 'i1-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'An INTERVAL is the distance between two notes. When you hear two notes, whether together or one after another, you\'re hearing an interval.',
          audioType: 'interval',
          audioData: {
            notes: [60, 64], // C to E
          },
        },
      },
    },
    {
      id: 'i1-1-measure',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'We measure intervals in HALF STEPS (also called semitones). A half step is the smallest distance between two notes on a piano - like C to C#.',
          audioType: 'interval',
          audioData: {
            notes: [60, 61], // C to C# - half step
          },
        },
      },
    },
    {
      id: 'i1-1-minor2',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'This smallest interval (1 half step) is called a MINOR SECOND. It sounds tense and close. Listen:',
          audioType: 'interval',
          audioData: {
            notes: [60, 61], // Minor second
          },
        },
      },
    },
    {
      id: 'i1-1-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this interval. Are the notes close together or far apart?',
          audioType: 'interval',
          audioData: {
            notes: [60, 61], // Minor second
          },
          options: ['Very close together', 'Far apart'],
          correctIndex: 0,
          explanation: 'This is a minor second - the smallest interval. The notes are very close together.',
        },
      },
    },
    {
      id: 'i1-1-wider',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Larger intervals have notes that are farther apart. Listen to this wider interval:',
          audioType: 'interval',
          audioData: {
            notes: [60, 67], // Perfect fifth
          },
        },
      },
    },
    {
      id: 'i1-1-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to these two intervals. Which one is WIDER (notes farther apart)?',
          audioType: 'interval',
          audioData: {
            notes: [60, 61], // Minor second (narrow)
          },
          options: ['First interval (narrow)', 'Second interval (wide)'],
          correctIndex: 1,
          explanation: 'The second interval is wider - the notes are farther apart.',
        },
      },
    },
    {
      id: 'i1-1-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The distance between two notes is called an {{0}}.',
          blanks: [
            {
              options: ['interval', 'note', 'pitch', 'chord'],
              correctIndex: 0,
            },
          ],
          explanation: 'The distance between two notes is called an interval.',
        },
      },
    },
    {
      id: 'i1-1-fill2',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'Intervals are measured in {{0}} steps.',
          blanks: [
            {
              options: ['half', 'whole', 'big', 'small'],
              correctIndex: 0,
            },
          ],
          explanation: 'Intervals are measured in half steps (semitones).',
        },
      },
    },
  ],
};
