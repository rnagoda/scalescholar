/**
 * Lesson 2.4: Dominant 7th
 *
 * Introduction to the dominant 7th chord (adds m7 to major).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-2-4',
  trackId: 'chords',
  levelIndex: 2,
  lessonIndex: 4,
  title: 'Dominant 7th',
  description: 'Learn the bluesy dominant 7th chord - the foundation of blues and jazz.',
  xpReward: 50,
  blocks: [
    {
      id: 'c2-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The DOMINANT 7TH (or just "7") chord adds a fourth note to a major triad - the minor 7th interval (10 half steps from root).',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67, 70], // C7
          },
        },
      },
    },
    {
      id: 'c2-4-build',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'It\'s built: Root + Major 3rd + Perfect 5th + Minor 7th. Notice it\'s a MAJOR chord with a MINOR 7th - that\'s what creates the tension!',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67, 70],
          },
        },
      },
    },
    {
      id: 'c2-4-blues',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The dominant 7th is THE sound of blues and early jazz. It has drive and wants to resolve - usually down a fifth.',
          audioType: 'scale',
          audioData: {
            notes: [67, 71, 74, 77, 0, 60, 64, 67], // G7 to C
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c2-4-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Compare a major triad to a dominant 7th. First C major, then C7:',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 60, 64, 67, 70],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c2-4-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'How many notes are in a dominant 7th chord?',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67, 70],
          },
          options: ['3 notes', '4 notes', '5 notes'],
          correctIndex: 1,
          explanation: 'A 7th chord has 4 notes: root, 3rd, 5th, and 7th.',
        },
      },
    },
    {
      id: 'c2-4-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a simple major triad or a dominant 7th chord?',
          audioType: 'chord',
          audioData: {
            notes: [62, 66, 69, 72], // D7
          },
          options: ['Major triad (3 notes)', 'Dominant 7th (4 notes)'],
          correctIndex: 1,
          explanation: 'This is a dominant 7th chord - you can hear that extra bluesy 7th note.',
        },
      },
    },
    {
      id: 'c2-4-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What type of 7th is added to a dominant 7th chord?',
          audioType: 'chord',
          audioData: {
            notes: [67, 71, 74, 77], // G7
          },
          options: ['Major 7th', 'Minor 7th'],
          correctIndex: 1,
          explanation: 'A dominant 7th chord has a minor 7th (10 semitones from root) added to a major triad.',
        },
      },
    },
    {
      id: 'c2-4-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The dominant 7th chord is essential to {{0}} music.',
          blanks: [
            {
              options: ['blues', 'classical', 'folk', 'electronic'],
              correctIndex: 0,
            },
          ],
          explanation: 'The dominant 7th chord is essential to blues music. A style that uses bent notes and 12-bar forms.',
        },
      },
    },
  ],
};
