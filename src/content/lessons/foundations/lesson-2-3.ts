/**
 * Lesson 2.3: Rests
 *
 * Introduction to musical silence - whole, half, and quarter rests.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'foundations-2-3',
  trackId: 'foundations',
  levelIndex: 2,
  lessonIndex: 3,
  title: 'Rests',
  description: 'Learn about musical silence and how rests work in rhythm.',
  xpReward: 50,
  blocks: [
    {
      id: 'f2-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Silence is just as important as sound in music! A REST is a symbol that tells you to be silent for a certain duration. Listen to this pattern with a rest (silence) in the middle:',
          audioType: 'scale',
          audioData: {
            notes: [60, 0, 60, 60], // 0 represents rest
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f2-3-types',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Just like notes, rests have different lengths. A QUARTER REST is silent for 1 beat. A HALF REST is silent for 2 beats. A WHOLE REST is silent for 4 beats.',
          audioType: 'note',
          audioData: {
            notes: [60],
          },
        },
      },
    },
    {
      id: 'f2-3-quarter-rest',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Listen to this pattern with quarter rests. Each silence lasts 1 beat:',
          audioType: 'scale',
          audioData: {
            notes: [60, 0, 62, 0, 64, 0, 65, 0],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'f2-3-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen carefully. How many rests (silences) do you hear in this pattern?',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 0, 64],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['1 rest', '2 rests', '3 rests'],
          correctIndex: 0,
          explanation: 'There is 1 rest in this pattern - a moment of silence between the notes.',
        },
      },
    },
    {
      id: 'f2-3-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each rest to its duration:',
          items: [
            { id: 'quarter-rest', label: 'Quarter Rest', correctZone: 'zone-1' },
            { id: 'half-rest', label: 'Half Rest', correctZone: 'zone-2' },
            { id: 'whole-rest', label: 'Whole Rest', correctZone: 'zone-3' },
          ],
          zones: [
            { id: 'zone-1', label: '1 beat of silence' },
            { id: 'zone-2', label: '2 beats of silence' },
            { id: 'zone-3', label: '4 beats of silence' },
          ],
        },
      },
    },
    {
      id: 'f2-3-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What does a rest tell you to do?',
          audioType: 'scale',
          audioData: {
            notes: [60, 0, 0, 60],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Play louder', 'Be silent', 'Play faster'],
          correctIndex: 1,
          explanation: 'A rest tells you to be silent. It\'s a planned pause in the music.',
        },
      },
    },
    {
      id: 'f2-3-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'A symbol that tells you to be silent is called a {{0}}.',
          blanks: [
            {
              options: ['rest', 'note', 'beat', 'pause'],
              correctIndex: 0,
            },
          ],
          explanation: 'A symbol that tells you to be silent is called a rest - the opposite of a note.',
        },
      },
    },
  ],
};
