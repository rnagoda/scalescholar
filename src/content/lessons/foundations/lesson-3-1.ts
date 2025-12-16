/**
 * Lesson 3.1: Dynamics
 *
 * Introduction to loud and soft in music (f, p, mf, mp).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-3-1',
  trackId: 'foundations',
  levelIndex: 3,
  lessonIndex: 1,
  title: 'Dynamics',
  description: 'Learn about musical volume - from soft piano to loud forte.',
  xpReward: 50,
  blocks: [
    {
      id: 'f3-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'DYNAMICS describe how loud or soft music is played. Musicians use Italian words and symbols for dynamics. Let\'s learn the basics!',
        },
      },
    },
    {
      id: 'f3-1-forte',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'FORTE (f) means LOUD. When you see "f" in music, play with strength and power. Listen to this forte passage:',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 72],
            scaleType: 'major',
            rootNote: 60,
            noteDuration: 0.5,
            velocity: 1.0, // Maximum velocity for forte
          },
        },
      },
    },
    {
      id: 'f3-1-piano',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'PIANO (p) means SOFT. When you see "p" in music, play gently and quietly. Listen to this piano passage:',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 72],
            scaleType: 'major',
            rootNote: 60,
            noteDuration: 0.5,
            velocity: 0.25, // Low velocity for piano (soft)
          },
        },
      },
    },
    {
      id: 'f3-1-mezzo',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'MEZZO means "medium." MEZZO-FORTE (mf) is medium loud, and MEZZO-PIANO (mp) is medium soft. Listen to mezzo-forte:',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 72],
            scaleType: 'major',
            rootNote: 60,
            noteDuration: 0.5,
            velocity: 0.6, // Medium velocity for mezzo-forte
          },
        },
      },
    },
    {
      id: 'f3-1-quiz1',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'What does the symbol "f" mean in music?',
          visualType: 'diagram',
          visualData: {
            imageUrl: 'dynamics',
          },
          options: ['Piano (soft)', 'Forte (loud)', 'Fast'],
          correctIndex: 1,
          explanation: 'The letter "f" stands for forte, which means loud in Italian.',
        },
      },
    },
    {
      id: 'f3-1-quiz2',
      type: 'visual-quiz',
      content: {
        type: 'visual-quiz',
        data: {
          question: 'What does the symbol "p" mean in music?',
          visualType: 'diagram',
          visualData: {
            imageUrl: 'dynamics',
          },
          options: ['Piano (soft)', 'Forte (loud)', 'Pause'],
          correctIndex: 0,
          explanation: 'The letter "p" stands for piano, which means soft in Italian.',
        },
      },
    },
    {
      id: 'f3-1-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put these dynamics in order from SOFTEST to LOUDEST:',
          items: [
            { id: 'forte', label: 'forte (f)', correctPosition: 2 },
            { id: 'piano', label: 'piano (p)', correctPosition: 0 },
            { id: 'mezzo-forte', label: 'mezzo-forte (mf)', correctPosition: 1 },
          ],
          explanation: 'piano (soft) < mezzo-forte (medium loud) < forte (loud)',
        },
      },
    },
    {
      id: 'f3-1-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each dynamic marking to its meaning:',
          items: [
            { id: 'forte', label: 'f (forte)', correctZone: 'zone-1' },
            { id: 'piano', label: 'p (piano)', correctZone: 'zone-2' },
            { id: 'mf', label: 'mf (mezzo-forte)', correctZone: 'zone-3' },
            { id: 'mp', label: 'mp (mezzo-piano)', correctZone: 'zone-4' },
          ],
          zones: [
            { id: 'zone-1', label: 'Loud' },
            { id: 'zone-2', label: 'Soft' },
            { id: 'zone-3', label: 'Medium loud' },
            { id: 'zone-4', label: 'Medium soft' },
          ],
        },
      },
    },
  ],
};
