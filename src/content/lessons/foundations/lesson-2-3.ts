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
          text: 'Silence is just as important as sound in music! A REST is a symbol that tells you to be silent for a certain duration. Listen to this pattern with a gap (silence) in the middle:',
          audioType: 'scale',
          audioData: {
            notes: [60, 60, 60, 60], // Pattern with space between
            scaleType: 'major',
            rootNote: 60,
            noteDuration: 0.6, // Moderate tempo to hear gaps
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
          // No audio - this is explanatory text
        },
      },
    },
    {
      id: 'f2-3-quarter-rest',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Listen to this pattern with notes and silences. Try clapping along - clap on the notes, stay silent on the rests:',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65],
            scaleType: 'major',
            rootNote: 60,
            noteDuration: 0.6,
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
          question: 'What is the symbol that tells you to be SILENT?',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64],
            scaleType: 'major',
            rootNote: 60,
            noteDuration: 0.6,
          },
          options: ['A note', 'A rest', 'A beat'],
          correctIndex: 1,
          explanation: 'A rest is the symbol that tells you to be silent for a certain duration.',
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
          question: 'A quarter rest lasts for how many beats?',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65],
            scaleType: 'major',
            rootNote: 60,
            noteDuration: 0.5,
          },
          options: ['1 beat', '2 beats', '4 beats'],
          correctIndex: 0,
          explanation: 'A quarter rest lasts for 1 beat - the same duration as a quarter note.',
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
