/**
 * Lesson 1.3: Minor Third
 *
 * Introduction to the minor third interval (3 half steps).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-1-3',
  trackId: 'intervals',
  levelIndex: 1,
  lessonIndex: 3,
  title: 'Minor Third',
  description: 'Learn the sad, dark sound of the minor third interval.',
  xpReward: 50,
  blocks: [
    {
      id: 'i1-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A MINOR THIRD (m3) spans 3 half steps. It has a distinctive sad, dark quality. It\'s the interval that makes minor chords sound melancholy.',
          audioType: 'interval',
          audioData: {
            notes: [60, 63], // C to Eb
          },
        },
      },
    },
    {
      id: 'i1-3-sound',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Think of songs that start with a sad feeling. Many begin with a minor third. The first two notes of "Greensleeves" form a minor third.',
          audioType: 'interval',
          audioData: {
            notes: [60, 63],
          },
        },
      },
    },
    {
      id: 'i1-3-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Compare the minor third to the intervals you know. First a major second (2 semitones), then a minor third (3 semitones):',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 0, 60, 63],
          },
        },
      },
    },
    {
      id: 'i1-3-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen to this interval. Is it a MAJOR SECOND or MINOR THIRD?',
          audioType: 'interval',
          audioData: {
            notes: [64, 67], // E to G - minor third
          },
          options: ['Major 2nd (2 semitones)', 'Minor 3rd (3 semitones)'],
          correctIndex: 1,
          explanation: 'This is a minor third. You can hear its wider, darker sound compared to a second.',
        },
      },
    },
    {
      id: 'i1-3-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Does this minor third sound happy or sad?',
          audioType: 'interval',
          audioData: {
            notes: [67, 70], // G to Bb
          },
          options: ['Happy/bright', 'Sad/dark'],
          correctIndex: 1,
          explanation: 'The minor third has a sad, melancholy quality. It\'s the foundation of minor chords.',
        },
      },
    },
    {
      id: 'i1-3-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What interval is this?',
          audioType: 'interval',
          audioData: {
            notes: [62, 65], // D to F - minor third
          },
          options: ['Minor 2nd (1 semitone)', 'Major 2nd (2 semitones)', 'Minor 3rd (3 semitones)'],
          correctIndex: 2,
          explanation: 'This is a minor third - 3 semitones with that characteristic sad sound.',
        },
      },
    },
    {
      id: 'i1-3-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'A minor third spans {{0}} half steps.',
          blanks: [
            {
              options: ['2', '3', '4', '5'],
              correctIndex: 1,
            },
          ],
          explanation: 'A minor third spans 3 half steps.',
        },
      },
    },
  ],
};
