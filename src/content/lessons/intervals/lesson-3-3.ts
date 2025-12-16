/**
 * Lesson 3.3: Major Seventh
 *
 * Introduction to the major seventh interval (11 half steps).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-3-3',
  trackId: 'intervals',
  levelIndex: 3,
  lessonIndex: 3,
  title: 'Major Seventh',
  description: 'Learn the dreamy, tense sound of the major seventh.',
  xpReward: 50,
  blocks: [
    {
      id: 'i3-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A MAJOR SEVENTH (M7) spans 11 half steps - just one half step short of an octave. It has a distinctive dreamy but tense quality.',
          audioType: 'interval',
          audioData: {
            notes: [60, 71], // C to B
          },
        },
      },
    },
    {
      id: 'i3-3-sound',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The major seventh is used in lush jazz chords and dreamy pop music. When played harmonically, it creates beautiful tension.',
          audioType: 'chord',
          audioData: {
            notes: [60, 71], // C and B together
          },
        },
      },
    },
    {
      id: 'i3-3-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Compare the minor seventh (bluesy, 10 semitones) to the major seventh (dreamy, 11 semitones):',
          audioType: 'scale',
          audioData: {
            notes: [60, 70, 0, 60, 71],
          },
        },
      },
    },
    {
      id: 'i3-3-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MINOR SEVENTH or MAJOR SEVENTH?',
          audioType: 'interval',
          audioData: {
            notes: [62, 73], // D to C# - major seventh
          },
          options: ['Minor 7th (10 semitones)', 'Major 7th (11 semitones)'],
          correctIndex: 1,
          explanation: 'This is a major seventh - that dreamy, slightly tense quality.',
        },
      },
    },
    {
      id: 'i3-3-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MINOR SEVENTH or MAJOR SEVENTH?',
          audioType: 'interval',
          audioData: {
            notes: [65, 75], // F to Eb - minor seventh
          },
          options: ['Minor 7th (10 semitones)', 'Major 7th (11 semitones)'],
          correctIndex: 0,
          explanation: 'This is a minor seventh - that bluesy quality.',
        },
      },
    },
    {
      id: 'i3-3-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What interval is this?',
          audioType: 'interval',
          audioData: {
            notes: [67, 78], // G to F# - major seventh
          },
          options: ['Major 6th', 'Minor 7th', 'Major 7th'],
          correctIndex: 2,
          explanation: 'This is a major seventh - 11 half steps, almost an octave.',
        },
      },
    },
    {
      id: 'i3-3-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'A major seventh is just {{0}} half step short of an octave.',
          blanks: [
            {
              options: ['1', '2', '3', '4'],
              correctIndex: 0,
            },
          ],
          explanation: 'A major seventh is just 1 half step short of an octave.',
        },
      },
    },
  ],
};
