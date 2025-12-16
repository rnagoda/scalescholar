/**
 * Lesson 1.3: Reading the Staff
 *
 * Introduction to the musical staff and treble clef.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-1-3',
  trackId: 'foundations',
  levelIndex: 1,
  lessonIndex: 3,
  title: 'Reading the Staff',
  description: 'Learn to read notes on the musical staff.',
  xpReward: 50,
  blocks: [
    {
      id: 'f1-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Music is written on a set of 5 horizontal lines called the STAFF. Notes are placed on lines or in the spaces between them. Higher notes appear higher on the staff.',
        },
      },
    },
    {
      id: 'f1-3-clef',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The symbol at the beginning of a staff tells us which notes the lines represent. The TREBLE CLEF (also called the G clef) is used for higher-pitched instruments and voices.',
        },
      },
    },
    {
      id: 'f1-3-visual1',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'Look at this note on the staff. Is it on a LINE or in a SPACE?',
          visualType: 'staff',
          visualData: {
            notes: [64], // E4 - on a line
            clef: 'treble',
          },
          options: ['On a line', 'In a space'],
          correctIndex: 0,
          explanation: 'This note (E) sits directly on a line of the staff.',
        },
      },
    },
    {
      id: 'f1-3-lines',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'In treble clef, the notes on the LINES from bottom to top are: E, G, B, D, F. A common way to remember this is "Every Good Boy Does Fine."',
        },
      },
    },
    {
      id: 'f1-3-drag1',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each memory phrase word to its note:',
          items: [
            { id: 'every', label: 'Every', correctZone: 'e' },
            { id: 'good', label: 'Good', correctZone: 'g' },
            { id: 'boy', label: 'Boy', correctZone: 'b' },
            { id: 'does', label: 'Does', correctZone: 'd' },
            { id: 'fine', label: 'Fine', correctZone: 'f' },
          ],
          zones: [
            { id: 'e', label: 'E' },
            { id: 'g', label: 'G' },
            { id: 'b', label: 'B' },
            { id: 'd', label: 'D' },
            { id: 'f', label: 'F' },
          ],
          explanation: 'Every = E, Good = G, Boy = B, Does = D, Fine = F. These are the line notes in treble clef!',
        },
      },
    },
    {
      id: 'f1-3-spaces',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The notes in the SPACES from bottom to top spell FACE: F, A, C, E. Easy to remember!',
        },
      },
    },
    {
      id: 'f1-3-visual2',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'What note is shown on the staff?',
          visualType: 'staff',
          visualData: {
            notes: [65], // F4 - in a space
            clef: 'treble',
          },
          options: ['E', 'F', 'G', 'A'],
          correctIndex: 1,
          explanation: 'This is the note F, the first space note (bottom of FACE).',
        },
      },
    },
    {
      id: 'f1-3-visual3',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'What note is shown on the staff?',
          visualType: 'staff',
          visualData: {
            notes: [71], // B4 - on a line
            clef: 'treble',
          },
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 1,
          explanation: 'This is B - the middle line note. Remember: "Every Good BOY Does Fine."',
        },
      },
    },
  ],
};
