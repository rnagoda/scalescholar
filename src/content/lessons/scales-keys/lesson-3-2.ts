/**
 * Lesson 3.2: A Minor Scale
 *
 * Introduction to A minor - relative minor of C major.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-3-2',
  trackId: 'scales-keys',
  levelIndex: 3,
  lessonIndex: 2,
  title: 'A Minor Scale',
  description: 'Learn A minor - the relative minor of C major with no sharps or flats.',
  xpReward: 50,
  blocks: [
    {
      id: 'sk3-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A MINOR is the relative minor of C major. Like C major, it has no sharps or flats - it uses only the white keys on a piano!',
          audioType: 'scale',
          audioData: {
            notes: [69, 71, 72, 74, 76, 77, 79, 81], // A minor
            scaleType: 'minor',
            rootNote: 69,
          },
        },
      },
    },
    {
      id: 'sk3-2-relation',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A is the 6th note of C major, so A minor is its relative minor. They share the same key signature but have different tonics (home notes).',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 69], // C D E F G A
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk3-2-tonic',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'In A minor, A is the tonic - home base. The scale starts and ends on A, giving it that melancholy minor sound.',
          audioType: 'scale',
          audioData: {
            notes: [69, 71, 72, 74, 76, 77, 79, 81, 79, 77, 76, 74, 72, 71, 69],
            scaleType: 'minor',
            rootNote: 69,
          },
        },
      },
    },
    {
      id: 'sk3-2-quiz1',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'How many sharps or flats does A minor have?',
          visualType: 'staff',
          visualData: {
            keySignature: 'Am',
          },
          options: ['1 sharp', '1 flat', 'None (0)'],
          correctIndex: 2,
          explanation: 'A minor has no sharps or flats - just like its relative major, C major.',
        },
      },
    },
    {
      id: 'sk3-2-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'A minor is the relative minor of which major key?',
          audioType: 'scale',
          audioData: {
            notes: [69, 71, 72, 74, 76, 77, 79, 81],
            scaleType: 'minor',
            rootNote: 69,
          },
          options: ['G major', 'C major', 'F major'],
          correctIndex: 1,
          explanation: 'A minor is the relative minor of C major - they share the same key signature.',
        },
      },
    },
    {
      id: 'sk3-2-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Which note is the TONIC (home) in A minor?',
          audioType: 'scale',
          audioData: {
            notes: [81, 79, 77, 76, 74, 72, 71, 69],
            scaleType: 'minor',
            rootNote: 69,
          },
          options: ['C', 'A', 'E'],
          correctIndex: 1,
          explanation: 'In A minor, A is the tonic - the note where the scale feels resolved.',
        },
      },
    },
    {
      id: 'sk3-2-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each key to its relative:',
          items: [
            { id: 'cmaj', label: 'C Major', correctZone: 'amin' },
            { id: 'amin-item', label: 'A Minor', correctZone: 'cmaj' },
          ],
          zones: [
            { id: 'amin', label: 'A Minor (relative minor)' },
            { id: 'cmaj', label: 'C Major (relative major)' },
          ],
        },
      },
    },
  ],
};
