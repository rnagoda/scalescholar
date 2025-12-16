/**
 * Lesson 3.2: Minor 7th Chord
 *
 * Introduction to the minor 7th chord (adds m7 to minor triad).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-3-2',
  trackId: 'chords',
  levelIndex: 3,
  lessonIndex: 2,
  title: 'Minor 7th Chord',
  description: 'Learn the smooth, mellow sound of the minor 7th chord.',
  xpReward: 50,
  blocks: [
    {
      id: 'c3-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The MINOR 7TH chord (m7) adds a minor 7th interval to a minor triad. It\'s smooth, mellow, and essential to jazz.',
          audioType: 'chord',
          audioData: {
            notes: [60, 63, 67, 70], // Cm7
          },
        },
      },
    },
    {
      id: 'c3-2-build',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'It\'s built: Root + Minor 3rd + Perfect 5th + Minor 7th. Both the 3rd AND 7th are minor - that\'s what gives it its soft character.',
          audioType: 'chord',
          audioData: {
            notes: [60, 63, 67, 70],
          },
        },
      },
    },
    {
      id: 'c3-2-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Compare plain minor triad to minor 7th. The 7th adds smoothness:',
          audioType: 'scale',
          audioData: {
            notes: [60, 63, 67, 0, 60, 63, 67, 70],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c3-2-jazz',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Minor 7th chords are everywhere in jazz, R&B, and neo-soul. They often appear as the "ii" chord in jazz progressions.',
          audioType: 'chord',
          audioData: {
            notes: [62, 65, 69, 72], // Dm7
          },
        },
      },
    },
    {
      id: 'c3-2-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What type of triad is the foundation of a minor 7th chord?',
          audioType: 'chord',
          audioData: {
            notes: [64, 67, 71, 74], // Em7
          },
          options: ['Major triad', 'Minor triad', 'Diminished triad'],
          correctIndex: 1,
          explanation: 'A minor 7th chord is built on a minor triad.',
        },
      },
    },
    {
      id: 'c3-2-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MINOR 7th or MAJOR 7th chord?',
          audioType: 'chord',
          audioData: {
            notes: [69, 72, 76, 79], // Am7
          },
          options: ['Minor 7th (mellow)', 'Major 7th (dreamy)'],
          correctIndex: 0,
          explanation: 'This is a minor 7th chord - you can hear the minor triad foundation.',
        },
      },
    },
    {
      id: 'c3-2-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this chord MAJOR 7th, MINOR 7th, or DOMINANT 7th?',
          audioType: 'chord',
          audioData: {
            notes: [65, 69, 72, 76], // Fmaj7
          },
          options: ['Major 7th', 'Minor 7th', 'Dominant 7th'],
          correctIndex: 0,
          explanation: 'This is a major 7th chord - major triad with major 7th.',
        },
      },
    },
    {
      id: 'c3-2-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Match these 7th chord symbols to their full names:',
          items: [
            { id: 'c7', label: 'C7', correctPosition: 0 },
            { id: 'cmaj7', label: 'Cmaj7', correctPosition: 2 },
            { id: 'cm7', label: 'Cm7', correctPosition: 1 },
          ],
          explanation: 'C7 = dominant 7th, Cm7 = minor 7th, Cmaj7 = major 7th',
        },
      },
    },
  ],
};
