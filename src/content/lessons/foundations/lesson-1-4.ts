/**
 * Lesson 1.4: Playing Notes
 *
 * Interactive lesson using the piano keyboard to play notes.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-1-4',
  trackId: 'foundations',
  levelIndex: 1,
  lessonIndex: 4,
  title: 'Playing Notes',
  description: 'Practice finding and playing notes on the keyboard.',
  xpReward: 75,
  blocks: [
    {
      id: 'f1-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Now let\'s practice finding notes on a keyboard! The white keys play the natural notes (A, B, C, D, E, F, G). The black keys play sharps and flats.',
        },
      },
    },
    {
      id: 'f1-4-middle-c',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Middle C is the C closest to the center of the piano. It\'s located to the left of a group of two black keys. Listen:',
          audioType: 'note',
          audioData: {
            notes: [60], // Middle C
          },
        },
      },
    },
    {
      id: 'f1-4-tap1',
      type: 'tap-build',
      content: {
        type: 'tap-build',
        data: {
          instruction: 'Find and tap Middle C on the keyboard:',
          targetType: 'notes',
          expectedNotes: [60],
          startNote: 57, // A3
          endNote: 65, // F4
          showLabels: true,
          playReference: true,
          explanation: 'Middle C (C4) is the foundation note for reading music!',
        },
      },
    },
    {
      id: 'f1-4-tap2',
      type: 'tap-build',
      content: {
        type: 'tap-build',
        data: {
          instruction: 'Now find the note E (two white keys to the right of C):',
          targetType: 'notes',
          expectedNotes: [64],
          startNote: 57,
          endNote: 67,
          showLabels: true,
          playReference: true,
          explanation: 'E is two steps above C. The notes C-D-E are the first three notes of a scale.',
        },
      },
    },
    {
      id: 'f1-4-tap3',
      type: 'tap-build',
      content: {
        type: 'tap-build',
        data: {
          instruction: 'Find the note G (four steps above C):',
          targetType: 'notes',
          expectedNotes: [67],
          startNote: 57,
          endNote: 70,
          showLabels: true,
          playReference: true,
          explanation: 'G is four steps above C: C → D → E → F → G',
        },
      },
    },
    {
      id: 'f1-4-interval-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'When we play two notes together or in sequence, the distance between them is called an INTERVAL. Let\'s practice finding two notes:',
        },
      },
    },
    {
      id: 'f1-4-tap4',
      type: 'tap-build',
      content: {
        type: 'tap-build',
        data: {
          instruction: 'Tap both C and E to build an interval:',
          targetType: 'interval',
          expectedNotes: [60, 64],
          startNote: 57,
          endNote: 67,
          showLabels: true,
          playReference: true,
          explanation: 'C to E is called a "Major Third" - it\'s a bright, happy interval!',
        },
      },
    },
    {
      id: 'f1-4-tap5',
      type: 'tap-build',
      content: {
        type: 'tap-build',
        data: {
          instruction: 'Now tap C, E, and G together - this is a chord!',
          targetType: 'chord',
          expectedNotes: [60, 64, 67],
          startNote: 57,
          endNote: 70,
          showLabels: true,
          playReference: true,
          explanation: 'C, E, and G together form a C Major chord - the most fundamental chord in music!',
        },
      },
    },
  ],
};
