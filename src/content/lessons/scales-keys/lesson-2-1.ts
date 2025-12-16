/**
 * Lesson 2.1: Key of C Major
 *
 * Introduction to the key of C major (no sharps or flats).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-2-1',
  trackId: 'scales-keys',
  levelIndex: 2,
  lessonIndex: 1,
  title: 'Key of C Major',
  description: 'Learn about C major - the simplest key with no sharps or flats.',
  xpReward: 50,
  blocks: [
    {
      id: 'sk2-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A KEY tells us which notes to use in a piece of music. The KEY OF C MAJOR uses only the white keys on a piano - no sharps or flats!',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 69, 71, 72],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk2-1-signature',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A KEY SIGNATURE appears at the beginning of sheet music and tells you which sharps or flats to use. C major has no sharps or flats in its key signature.',
          audioType: 'note',
          audioData: {
            notes: [60],
          },
        },
      },
    },
    {
      id: 'sk2-1-tonic',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'In the key of C major, C is the tonic - home base. The scale starts and ends on C. Listen to how the scale resolves to C:',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 69, 71, 72, 71, 69, 67, 65, 64, 62, 60],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk2-1-quiz1',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'How many sharps or flats are in the key of C major?',
          visualType: 'staff',
          visualData: {
            keySignature: 'C',
          },
          options: ['1 sharp', '1 flat', 'None (0)'],
          correctIndex: 2,
          explanation: 'C major has no sharps or flats - that\'s what makes it the simplest key!',
        },
      },
    },
    {
      id: 'sk2-1-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What note is the TONIC (home) in the key of C major?',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 69, 71, 72],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['A', 'B', 'C'],
          correctIndex: 2,
          explanation: 'In C major, C is the tonic - the first and last note of the scale.',
        },
      },
    },
    {
      id: 'sk2-1-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The key of C major has {{0}} sharps or flats.',
          blanks: [
            {
              options: ['no', 'one', 'two', 'three'],
              correctIndex: 0,
            },
          ],
          explanation: 'The key of C major has no sharps or flats - that\'s what makes it the simplest key!',
        },
      },
    },
    {
      id: 'sk2-1-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match the key signature facts:',
          items: [
            { id: 'key', label: 'Key of C Major', correctZone: 'no-acc' },
            { id: 'tonic', label: 'Tonic of C Major', correctZone: 'note-c' },
          ],
          zones: [
            { id: 'no-acc', label: 'No sharps or flats' },
            { id: 'note-c', label: 'The note C' },
          ],
        },
      },
    },
  ],
};
