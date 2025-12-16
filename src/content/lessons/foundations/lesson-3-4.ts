/**
 * Lesson 3.4: Putting It Together
 *
 * Review and integration of all foundations concepts.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-3-4',
  trackId: 'foundations',
  levelIndex: 3,
  lessonIndex: 4,
  title: 'Putting It Together',
  description: 'Review everything you\'ve learned about music fundamentals.',
  xpReward: 75,
  blocks: [
    {
      id: 'f3-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Congratulations! You\'ve learned the fundamentals of music. Let\'s review everything: pitch, rhythm, dynamics, tempo, and articulation.',
          audioType: 'note',
          audioData: {
            notes: [60, 64, 67],
          },
        },
      },
    },
    {
      id: 'f3-4-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to these two notes. Which direction does the pitch move?',
          audioType: 'interval',
          audioData: {
            notes: [55, 67],
          },
          options: ['Going DOWN', 'Going UP', 'Same pitch'],
          correctIndex: 1,
          explanation: 'The pitch moved UP - from a lower note to a higher note.',
        },
      },
    },
    {
      id: 'f3-4-quiz2',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'Which note value lasts the shortest?',
          visualType: 'diagram',
          visualData: {
            imageUrl: 'note-values',
          },
          options: ['Whole note', 'Half note', 'Quarter note'],
          correctIndex: 2,
          explanation: 'A quarter note lasts 1 beat - the shortest of these three.',
        },
      },
    },
    {
      id: 'f3-4-quiz3',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'What does "f" (forte) mean?',
          visualType: 'diagram',
          visualData: {
            imageUrl: 'dynamics',
          },
          options: ['Fast', 'Loud', 'Soft'],
          correctIndex: 1,
          explanation: 'Forte (f) means loud.',
        },
      },
    },
    {
      id: 'f3-4-quiz4',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this tempo. Is it fast (allegro) or slow (adagio)?',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 72, 67, 64, 60],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Adagio (slow)', 'Allegro (fast)'],
          correctIndex: 1,
          explanation: 'This energetic tempo is allegro (fast).',
        },
      },
    },
    {
      id: 'f3-4-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put these dynamics in order from SOFTEST to LOUDEST:',
          items: [
            { id: 'mf', label: 'mf (mezzo-forte)', correctPosition: 1 },
            { id: 'p', label: 'p (piano)', correctPosition: 0 },
            { id: 'f', label: 'f (forte)', correctPosition: 2 },
          ],
          explanation: 'piano (soft) < mezzo-forte (medium loud) < forte (loud)',
        },
      },
    },
    {
      id: 'f3-4-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each term to its meaning:',
          items: [
            { id: 'tempo', label: 'Tempo', correctZone: 'zone-1' },
            { id: 'dynamics', label: 'Dynamics', correctZone: 'zone-2' },
            { id: 'articulation', label: 'Articulation', correctZone: 'zone-3' },
            { id: 'rest', label: 'Rest', correctZone: 'zone-4' },
          ],
          zones: [
            { id: 'zone-1', label: 'Speed of the beat' },
            { id: 'zone-2', label: 'Loud or soft' },
            { id: 'zone-3', label: 'How notes are played' },
            { id: 'zone-4', label: 'Silence in music' },
          ],
        },
      },
    },
    {
      id: 'f3-4-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The Italian term for "walking pace" tempo is {{0}}.',
          blanks: [
            {
              options: ['andante', 'allegro', 'adagio', 'forte'],
              correctIndex: 0,
            },
          ],
          explanation: 'The Italian term for "walking pace" tempo is andante - between slow and fast.',
        },
      },
    },
  ],
};
