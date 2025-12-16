/**
 * Lesson 3.1: Major 7th Chord
 *
 * Introduction to the major 7th chord (adds M7 to major triad).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-3-1',
  trackId: 'chords',
  levelIndex: 3,
  lessonIndex: 1,
  title: 'Major 7th Chord',
  description: 'Learn the dreamy, lush sound of the major 7th chord.',
  xpReward: 50,
  blocks: [
    {
      id: 'c3-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The MAJOR 7TH chord (maj7) adds a major 7th interval (11 half steps) to a major triad. It has a dreamy, sophisticated sound.',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67, 71], // Cmaj7
          },
        },
      },
    },
    {
      id: 'c3-1-difference',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Notice the difference from dominant 7th: Major 7th uses a MAJOR 7th interval, while dominant 7th uses a MINOR 7th.',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 70, 0, 60, 64, 67, 71], // C7 then Cmaj7
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c3-1-sound',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Major 7th chords sound lush and romantic. They\'re used in jazz ballads, R&B, and neo-soul.',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67, 71],
          },
        },
      },
    },
    {
      id: 'c3-1-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What type of 7th is in a MAJOR 7th chord?',
          audioType: 'chord',
          audioData: {
            notes: [65, 69, 72, 76], // Fmaj7
          },
          options: ['Minor 7th (10 semitones)', 'Major 7th (11 semitones)'],
          correctIndex: 1,
          explanation: 'A major 7th chord uses a major 7th interval - 11 semitones from the root.',
        },
      },
    },
    {
      id: 'c3-1-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a DOMINANT 7th or MAJOR 7th chord?',
          audioType: 'chord',
          audioData: {
            notes: [67, 71, 74, 78], // Gmaj7
          },
          options: ['Dominant 7th (bluesy)', 'Major 7th (dreamy)'],
          correctIndex: 1,
          explanation: 'This is a major 7th chord - you can hear its dreamy, sophisticated quality.',
        },
      },
    },
    {
      id: 'c3-1-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a DOMINANT 7th or MAJOR 7th chord?',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67, 70], // C7
          },
          options: ['Dominant 7th (bluesy)', 'Major 7th (dreamy)'],
          correctIndex: 0,
          explanation: 'This is a dominant 7th - it has that bluesy tension.',
        },
      },
    },
    {
      id: 'c3-1-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each 7th chord to its 7th interval:',
          items: [
            { id: 'dom7', label: 'Dominant 7th', correctZone: 'min7' },
            { id: 'maj7', label: 'Major 7th', correctZone: 'maj7' },
          ],
          zones: [
            { id: 'min7', label: 'Minor 7th (10 semitones)' },
            { id: 'maj7', label: 'Major 7th (11 semitones)' },
          ],
        },
      },
    },
  ],
};
