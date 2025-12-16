/**
 * Lesson 3.3: Chord Progressions I
 *
 * Introduction to I-IV-V-I progression.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-3-3',
  trackId: 'chords',
  levelIndex: 3,
  lessonIndex: 3,
  title: 'Chord Progressions I',
  description: 'Learn the classic I-IV-V-I progression - the foundation of Western music.',
  xpReward: 50,
  blocks: [
    {
      id: 'c3-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A CHORD PROGRESSION is a sequence of chords. We use Roman numerals to show which scale degree the chord is built on.',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67], // I chord
          },
        },
      },
    },
    {
      id: 'c3-3-numerals',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'In C major: I = C chord, IV = F chord, V = G chord. These three chords can play thousands of songs!',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 65, 69, 72, 0, 67, 71, 74],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c3-3-progression',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The I-IV-V-I progression is the foundation of rock, pop, blues, and country. Listen: C - F - G - C',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 65, 69, 72, 0, 67, 71, 74, 0, 60, 64, 67],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c3-3-tension',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The V chord creates tension that resolves to I. That\'s why songs feel "finished" when they end on the I chord.',
          audioType: 'scale',
          audioData: {
            notes: [67, 71, 74, 0, 60, 64, 67],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c3-3-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'In the key of C, what chord is IV?',
          audioType: 'chord',
          audioData: {
            notes: [65, 69, 72], // F
          },
          options: ['C chord', 'F chord', 'G chord'],
          correctIndex: 1,
          explanation: 'In C major, IV is F (the 4th note of the scale).',
        },
      },
    },
    {
      id: 'c3-3-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Which chord creates the most TENSION in a I-IV-V-I progression?',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 65, 69, 72, 0, 67, 71, 74, 0, 60, 64, 67],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['I (first chord)', 'IV (second chord)', 'V (third chord)'],
          correctIndex: 2,
          explanation: 'The V chord creates the most tension - it strongly wants to resolve to I.',
        },
      },
    },
    {
      id: 'c3-3-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each numeral to its chord in C major:',
          items: [
            { id: 'i', label: 'I', correctZone: 'c' },
            { id: 'iv', label: 'IV', correctZone: 'f' },
            { id: 'v', label: 'V', correctZone: 'g' },
          ],
          zones: [
            { id: 'c', label: 'C chord' },
            { id: 'f', label: 'F chord' },
            { id: 'g', label: 'G chord' },
          ],
        },
      },
    },
    {
      id: 'c3-3-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The V chord creates {{0}} that wants to resolve to I.',
          blanks: [
            {
              options: ['tension', 'resolution', 'harmony', 'melody'],
              correctIndex: 0,
            },
          ],
          explanation: 'The V chord creates tension that wants to resolve to I. The opposite of resolution.',
        },
      },
    },
  ],
};
