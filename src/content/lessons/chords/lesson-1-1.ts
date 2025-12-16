/**
 * Lesson 1.1: What is a Chord?
 *
 * Introduction to chords - 3 or more notes played together.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-1-1',
  trackId: 'chords',
  levelIndex: 1,
  lessonIndex: 1,
  title: 'What is a Chord?',
  description: 'Learn what chords are and how they\'re built from multiple notes.',
  xpReward: 50,
  blocks: [
    {
      id: 'c1-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A CHORD is 3 or more notes played together at the same time. Chords create harmony - the rich, full sound that accompanies melodies.',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67], // C major chord
          },
        },
      },
    },
    {
      id: 'c1-1-triad',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The most basic chord is a TRIAD - exactly 3 notes. Triads are built by stacking thirds (every other note in a scale).',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67],
          },
        },
      },
    },
    {
      id: 'c1-1-parts',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Every triad has three parts: the ROOT (bottom note), the THIRD (middle note), and the FIFTH (top note). Listen to each:',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c1-1-together',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Now hear them played together as a chord:',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67],
          },
        },
      },
    },
    {
      id: 'c1-1-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'How many notes are in a TRIAD?',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67],
          },
          options: ['2 notes', '3 notes', '4 notes'],
          correctIndex: 1,
          explanation: 'A triad has exactly 3 notes: root, third, and fifth.',
        },
      },
    },
    {
      id: 'c1-1-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Are these notes played one at a time (melody) or together (chord)?',
          audioType: 'chord',
          audioData: {
            notes: [62, 66, 69], // D major chord
          },
          options: ['One at a time (melody)', 'Together (chord)'],
          correctIndex: 1,
          explanation: 'These notes are played together, making a chord.',
        },
      },
    },
    {
      id: 'c1-1-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each part of a triad:',
          items: [
            { id: 'root', label: 'Root', correctZone: 'bottom' },
            { id: 'third', label: 'Third', correctZone: 'middle' },
            { id: 'fifth', label: 'Fifth', correctZone: 'top' },
          ],
          zones: [
            { id: 'bottom', label: 'Bottom note (1st)' },
            { id: 'middle', label: 'Middle note (3rd)' },
            { id: 'top', label: 'Top note (5th)' },
          ],
        },
      },
    },
    {
      id: 'c1-1-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'A chord with exactly 3 notes is called a {{0}}.',
          blanks: [
            {
              options: ['triad', 'chord', 'note', 'interval'],
              correctIndex: 0,
            },
          ],
          explanation: 'A chord with exactly 3 notes is called a triad. Tri = three.',
        },
      },
    },
  ],
};
