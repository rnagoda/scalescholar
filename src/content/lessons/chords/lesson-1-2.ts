/**
 * Lesson 1.2: Major Triads
 *
 * Introduction to major triads (root, M3, P5).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-1-2',
  trackId: 'chords',
  levelIndex: 1,
  lessonIndex: 2,
  title: 'Major Triads',
  description: 'Learn the bright, happy sound of major chords.',
  xpReward: 50,
  blocks: [
    {
      id: 'c1-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A MAJOR TRIAD has a bright, happy sound. It\'s built with a root, a MAJOR third (4 half steps), and a perfect fifth (7 half steps).',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67], // C major
          },
        },
      },
    },
    {
      id: 'c1-2-formula',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The major triad formula is: Root + Major 3rd + Perfect 5th. In numbers: 0 + 4 + 7 half steps from the root.',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67],
          },
        },
      },
    },
    {
      id: 'c1-2-examples',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Here are some major triads. Notice they all share that same happy quality: C major, then F major, then G major:',
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
      id: 'c1-2-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Does this major chord sound HAPPY or SAD?',
          audioType: 'chord',
          audioData: {
            notes: [62, 66, 69], // D major
          },
          options: ['Happy/bright', 'Sad/dark'],
          correctIndex: 0,
          explanation: 'Major chords have a bright, happy quality.',
        },
      },
    },
    {
      id: 'c1-2-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What type of third is in a MAJOR triad?',
          audioType: 'chord',
          audioData: {
            notes: [65, 69, 72], // F major
          },
          options: ['Minor third (3 semitones)', 'Major third (4 semitones)'],
          correctIndex: 1,
          explanation: 'A major triad contains a major third (4 semitones) - that\'s what makes it sound happy!',
        },
      },
    },
    {
      id: 'c1-2-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a major chord?',
          audioType: 'chord',
          audioData: {
            notes: [64, 68, 71], // E major
          },
          options: ['Yes, it\'s major', 'No, it\'s not major'],
          correctIndex: 0,
          explanation: 'Yes! You can hear the bright, happy major quality.',
        },
      },
    },
    {
      id: 'c1-2-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'A major triad is built with root + major third + {{0}} fifth.',
          blanks: [
            {
              options: ['perfect', 'major', 'minor', 'augmented'],
              correctIndex: 0,
            },
          ],
          explanation: 'A major triad is built with root + major third + perfect fifth. Not major or minor.',
        },
      },
    },
    {
      id: 'c1-2-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Build a major triad from the root:',
          items: [
            { id: 'root', label: 'Root', correctZone: 'zero' },
            { id: 'major3', label: 'Major 3rd', correctZone: 'four' },
            { id: 'perfect5', label: 'Perfect 5th', correctZone: 'seven' },
          ],
          zones: [
            { id: 'zero', label: '0 half steps' },
            { id: 'four', label: '4 half steps' },
            { id: 'seven', label: '7 half steps' },
          ],
        },
      },
    },
  ],
};
