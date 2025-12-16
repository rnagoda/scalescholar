/**
 * Lesson 2.2: Note Values
 *
 * Introduction to whole, half, and quarter notes and their durations.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-2-2',
  trackId: 'foundations',
  levelIndex: 2,
  lessonIndex: 2,
  title: 'Note Values',
  description: 'Learn how whole, half, and quarter notes have different durations.',
  xpReward: 50,
  blocks: [
    {
      id: 'f2-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Notes can be held for different lengths of time. A WHOLE NOTE is held the longest - it lasts for 4 beats. Listen:',
          audioType: 'note',
          audioData: {
            notes: [60],
          },
        },
      },
    },
    {
      id: 'f2-2-half',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A HALF NOTE lasts for 2 beats - half as long as a whole note. Here are two half notes filling the same time as one whole note:',
          audioType: 'scale',
          audioData: {
            notes: [60, 62],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f2-2-quarter',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A QUARTER NOTE lasts for 1 beat. Four quarter notes fill the same time as one whole note. Listen:',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f2-2-visual',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'Which note value lasts the LONGEST?',
          visualType: 'diagram',
          visualData: {
            imageUrl: 'note-values',
          },
          options: ['Quarter Note (1 beat)', 'Half Note (2 beats)', 'Whole Note (4 beats)'],
          correctIndex: 2,
          explanation: 'The whole note lasts 4 beats, making it the longest of these note values.',
        },
      },
    },
    {
      id: 'f2-2-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'How many quarter notes fit in the time of one whole note?',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['2 quarter notes', '3 quarter notes', '4 quarter notes'],
          correctIndex: 2,
          explanation: 'Four quarter notes equal one whole note. Each quarter note is 1 beat, and a whole note is 4 beats.',
        },
      },
    },
    {
      id: 'f2-2-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put these notes in order from SHORTEST to LONGEST duration:',
          items: [
            { id: 'quarter', label: 'Quarter Note', correctPosition: 0 },
            { id: 'whole', label: 'Whole Note', correctPosition: 2 },
            { id: 'half', label: 'Half Note', correctPosition: 1 },
          ],
          explanation: 'Quarter (1 beat) < Half (2 beats) < Whole (4 beats)',
        },
      },
    },
    {
      id: 'f2-2-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'A whole note lasts for {{0}} beats.',
          blanks: [
            {
              options: ['4', '2', '1', '8'],
              correctIndex: 0,
            },
          ],
          explanation: 'A whole note lasts for 4 beats - the longest basic note value.',
        },
      },
    },
  ],
};
