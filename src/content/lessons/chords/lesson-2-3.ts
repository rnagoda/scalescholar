/**
 * Lesson 2.3: Chord Inversions
 *
 * Introduction to root position, 1st, and 2nd inversions.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-2-3',
  trackId: 'chords',
  levelIndex: 2,
  lessonIndex: 3,
  title: 'Chord Inversions',
  description: 'Learn how rearranging chord notes creates different voicings.',
  xpReward: 50,
  blocks: [
    {
      id: 'c2-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'An INVERSION is when you change which note is on the bottom of a chord. Same notes, different arrangement, different sound!',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67], // C major root position
          },
        },
      },
    },
    {
      id: 'c2-3-root',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'ROOT POSITION has the root on the bottom. This is the most stable, grounded sound. C-E-G:',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67], // Root position
          },
        },
      },
    },
    {
      id: 'c2-3-first',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'FIRST INVERSION puts the third on the bottom. The chord sounds lighter, brighter. E-G-C:',
          audioType: 'chord',
          audioData: {
            notes: [64, 67, 72], // 1st inversion
          },
        },
      },
    },
    {
      id: 'c2-3-second',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'SECOND INVERSION puts the fifth on the bottom. It sounds less stable, often used for passing chords. G-C-E:',
          audioType: 'chord',
          audioData: {
            notes: [67, 72, 76], // 2nd inversion
          },
        },
      },
    },
    {
      id: 'c2-3-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Hear all three inversions of C major: root position, 1st inversion, 2nd inversion:',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 64, 67, 72, 0, 67, 72, 76],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c2-3-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'In FIRST inversion, which note is on the bottom?',
          audioType: 'chord',
          audioData: {
            notes: [64, 67, 72],
          },
          options: ['The root', 'The third', 'The fifth'],
          correctIndex: 1,
          explanation: 'First inversion has the third on the bottom.',
        },
      },
    },
    {
      id: 'c2-3-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Which inversion sounds most STABLE and GROUNDED?',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 64, 67, 72, 0, 67, 72, 76],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Root position (first played)', '1st inversion (second played)', '2nd inversion (third played)'],
          correctIndex: 0,
          explanation: 'Root position with the root on bottom is the most stable.',
        },
      },
    },
    {
      id: 'c2-3-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each inversion to its bass note:',
          items: [
            { id: 'root', label: 'Root position', correctZone: 'rootbass' },
            { id: 'first', label: '1st inversion', correctZone: 'thirdbass' },
            { id: 'second', label: '2nd inversion', correctZone: 'fifthbass' },
          ],
          zones: [
            { id: 'rootbass', label: 'Root on bottom' },
            { id: 'thirdbass', label: 'Third on bottom' },
            { id: 'fifthbass', label: 'Fifth on bottom' },
          ],
        },
      },
    },
  ],
};
