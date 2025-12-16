/**
 * Lesson 3.2: Tempo Markings
 *
 * Introduction to tempo terms - allegro, andante, adagio.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-3-2',
  trackId: 'foundations',
  levelIndex: 3,
  lessonIndex: 2,
  title: 'Tempo Markings',
  description: 'Learn Italian tempo terms that tell musicians how fast to play.',
  xpReward: 50,
  blocks: [
    {
      id: 'f3-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Musicians use Italian words to describe tempo (speed). These words appear at the beginning of a piece to tell you how fast to play.',
          audioType: 'note',
          audioData: {
            notes: [60],
          },
        },
      },
    },
    {
      id: 'f3-2-adagio',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'ADAGIO means slow and leisurely. It creates a calm, peaceful mood. Listen to this adagio tempo:',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 64, 60],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f3-2-andante',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'ANDANTE means "walking pace" - a moderate, comfortable tempo. Listen:',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 64, 60],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f3-2-allegro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'ALLEGRO means fast and lively. It creates an energetic, exciting mood. Listen:',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 64, 60, 64, 67, 72],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f3-2-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this music. What tempo marking fits best?',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 69, 71, 72],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Adagio (slow)', 'Andante (walking)', 'Allegro (fast)'],
          correctIndex: 2,
          explanation: 'This fast, energetic tempo is allegro.',
        },
      },
    },
    {
      id: 'f3-2-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this music. What tempo marking fits best?',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 60],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Adagio (slow)', 'Andante (walking)', 'Allegro (fast)'],
          correctIndex: 0,
          explanation: 'This slow, leisurely tempo is adagio.',
        },
      },
    },
    {
      id: 'f3-2-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put these tempo markings in order from SLOWEST to FASTEST:',
          items: [
            { id: 'allegro', label: 'Allegro', correctPosition: 2 },
            { id: 'adagio', label: 'Adagio', correctPosition: 0 },
            { id: 'andante', label: 'Andante', correctPosition: 1 },
          ],
          explanation: 'Adagio (slow) < Andante (walking) < Allegro (fast)',
        },
      },
    },
    {
      id: 'f3-2-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each tempo marking to its meaning:',
          items: [
            { id: 'adagio', label: 'Adagio', correctZone: 'zone-1' },
            { id: 'andante', label: 'Andante', correctZone: 'zone-2' },
            { id: 'allegro', label: 'Allegro', correctZone: 'zone-3' },
          ],
          zones: [
            { id: 'zone-1', label: 'Slow and leisurely' },
            { id: 'zone-2', label: 'Walking pace' },
            { id: 'zone-3', label: 'Fast and lively' },
          ],
        },
      },
    },
  ],
};
