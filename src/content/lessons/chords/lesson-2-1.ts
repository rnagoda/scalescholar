/**
 * Lesson 2.1: Augmented Triads
 *
 * Introduction to augmented triads (root, M3, aug5).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-2-1',
  trackId: 'chords',
  levelIndex: 2,
  lessonIndex: 1,
  title: 'Augmented Triads',
  description: 'Learn the bright, tense sound of augmented chords.',
  xpReward: 50,
  blocks: [
    {
      id: 'c2-1-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'An AUGMENTED TRIAD has a bright but unstable sound. It\'s built with a root, a major third (4 half steps), and an AUGMENTED fifth (8 half steps).',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 68], // C augmented
          },
        },
      },
    },
    {
      id: 'c2-1-raised',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The augmented fifth is raised one half step from a perfect fifth. This stretches the chord and creates tension.',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 60, 64, 68], // C major then C augmented
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c2-1-sound',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Augmented chords sound dreamy and mysterious. They\'re used for tension and in sci-fi/fantasy music.',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 68],
          },
        },
      },
    },
    {
      id: 'c2-1-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Compared to major, the augmented chord\'s fifth is:',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 60, 64, 68],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Lowered', 'The same', 'Raised'],
          correctIndex: 2,
          explanation: 'The augmented fifth is raised one half step from the perfect fifth.',
        },
      },
    },
    {
      id: 'c2-1-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What type of chord is this?',
          audioType: 'chord',
          audioData: {
            notes: [62, 66, 70], // D augmented
          },
          options: ['Major', 'Minor', 'Augmented'],
          correctIndex: 2,
          explanation: 'This is an augmented chord - bright but with that stretched, tense quality.',
        },
      },
    },
    {
      id: 'c2-1-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What type of chord is this?',
          audioType: 'chord',
          audioData: {
            notes: [64, 67, 71], // E minor
          },
          options: ['Minor', 'Augmented', 'Diminished'],
          correctIndex: 0,
          explanation: 'This is a minor chord - sad but stable, not stretched like augmented.',
        },
      },
    },
    {
      id: 'c2-1-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each chord type to its fifth:',
          items: [
            { id: 'diminished', label: 'Diminished', correctZone: 'dim5' },
            { id: 'majmin', label: 'Major/Minor', correctZone: 'perf5' },
            { id: 'augmented', label: 'Augmented', correctZone: 'aug5' },
          ],
          zones: [
            { id: 'dim5', label: 'Diminished 5th (6 semitones)' },
            { id: 'perf5', label: 'Perfect 5th (7 semitones)' },
            { id: 'aug5', label: 'Augmented 5th (8 semitones)' },
          ],
        },
      },
    },
  ],
};
