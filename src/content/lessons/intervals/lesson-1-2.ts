/**
 * Lesson 1.2: Half Steps & Whole Steps
 *
 * Minor second (m2) vs Major second (M2).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-1-2',
  trackId: 'intervals',
  levelIndex: 1,
  lessonIndex: 2,
  title: 'Half Steps & Whole Steps',
  description: 'Learn to distinguish between minor and major seconds.',
  xpReward: 50,
  blocks: [
    {
      id: 'i1-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The two smallest intervals are the HALF STEP and WHOLE STEP. A half step is 1 semitone, a whole step is 2 semitones.',
          audioType: 'note',
          audioData: {
            notes: [60],
          },
        },
      },
    },
    {
      id: 'i1-2-half',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A MINOR SECOND (m2) is a half step - 1 semitone. It sounds tense and dissonant, like a "clash." Listen:',
          audioType: 'interval',
          audioData: {
            notes: [60, 61], // C to C#
          },
        },
      },
    },
    {
      id: 'i1-2-whole',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A MAJOR SECOND (M2) is a whole step - 2 semitones. It sounds a bit more open than the minor second. Listen:',
          audioType: 'interval',
          audioData: {
            notes: [60, 62], // C to D
          },
        },
      },
    },
    {
      id: 'i1-2-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Compare them side by side. First the half step (minor 2nd), then the whole step (major 2nd):',
          audioType: 'scale',
          audioData: {
            notes: [60, 61, 0, 60, 62],
          },
        },
      },
    },
    {
      id: 'i1-2-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen carefully. Is this a HALF STEP or WHOLE STEP?',
          audioType: 'interval',
          audioData: {
            notes: [64, 65], // E to F - half step
          },
          options: ['Half step (minor 2nd)', 'Whole step (major 2nd)'],
          correctIndex: 0,
          explanation: 'This is a half step (minor second). The notes are as close as possible.',
        },
      },
    },
    {
      id: 'i1-2-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen carefully. Is this a HALF STEP or WHOLE STEP?',
          audioType: 'interval',
          audioData: {
            notes: [67, 69], // G to A - whole step
          },
          options: ['Half step (minor 2nd)', 'Whole step (major 2nd)'],
          correctIndex: 1,
          explanation: 'This is a whole step (major second). It\'s slightly wider than a half step.',
        },
      },
    },
    {
      id: 'i1-2-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this interval a minor second or major second?',
          audioType: 'interval',
          audioData: {
            notes: [62, 63], // D to D# - half step
          },
          options: ['Minor 2nd (half step)', 'Major 2nd (whole step)'],
          correctIndex: 0,
          explanation: 'This is a minor second - you can hear the tight, tense sound of notes very close together.',
        },
      },
    },
    {
      id: 'i1-2-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each interval to its size:',
          items: [
            { id: 'm2', label: 'Minor 2nd', correctZone: 'half' },
            { id: 'M2', label: 'Major 2nd', correctZone: 'whole' },
          ],
          zones: [
            { id: 'half', label: '1 semitone (half step)' },
            { id: 'whole', label: '2 semitones (whole step)' },
          ],
          explanation: 'Minor 2nd = 1 semitone, Major 2nd = 2 semitones',
        },
      },
    },
  ],
};
