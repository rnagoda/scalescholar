/**
 * Lesson 3.3: Articulation
 *
 * Introduction to staccato and legato.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-3-3',
  trackId: 'foundations',
  levelIndex: 3,
  lessonIndex: 3,
  title: 'Articulation',
  description: 'Learn how notes can be played smooth (legato) or detached (staccato).',
  xpReward: 50,
  blocks: [
    {
      id: 'f3-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'ARTICULATION describes HOW notes are played - smooth and connected, or short and detached. It adds character and expression to music.',
          audioType: 'note',
          audioData: {
            notes: [60],
          },
        },
      },
    },
    {
      id: 'f3-3-legato',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'LEGATO means smooth and connected. Notes flow into each other like singing. Listen to this legato phrase:',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f3-3-staccato',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'STACCATO means short and detached. Each note is separated by a small silence, like bouncing. Listen:',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f3-3-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Same notes, different articulations create completely different feelings! Legato feels flowing, while staccato feels bouncy and playful.',
          audioType: 'note',
          audioData: {
            notes: [60],
          },
        },
      },
    },
    {
      id: 'f3-3-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this phrase. Is it LEGATO or STACCATO?',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 72],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Legato (smooth)', 'Staccato (detached)'],
          correctIndex: 1,
          explanation: 'This is staccato - the notes are short and separated.',
        },
      },
    },
    {
      id: 'f3-3-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this phrase. Is it LEGATO or STACCATO?',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 72],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Legato (smooth)', 'Staccato (detached)'],
          correctIndex: 0,
          explanation: 'This is legato - the notes flow smoothly into each other.',
        },
      },
    },
    {
      id: 'f3-3-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each articulation to its description:',
          items: [
            { id: 'legato', label: 'Legato', correctZone: 'zone-1' },
            { id: 'staccato', label: 'Staccato', correctZone: 'zone-2' },
          ],
          zones: [
            { id: 'zone-1', label: 'Smooth and connected' },
            { id: 'zone-2', label: 'Short and detached' },
          ],
        },
      },
    },
    {
      id: 'f3-3-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'When notes are played smooth and connected, it\'s called {{0}}.',
          blanks: [
            {
              options: ['legato', 'staccato', 'forte', 'piano'],
              correctIndex: 0,
            },
          ],
          explanation: 'When notes are played smooth and connected, it\'s called legato (Italian for "tied together").',
        },
      },
    },
  ],
};
