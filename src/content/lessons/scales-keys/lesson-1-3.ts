/**
 * Lesson 1.3: Scale Degrees 4-5
 *
 * Introduction to Subdominant and Dominant.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-1-3',
  trackId: 'scales-keys',
  levelIndex: 1,
  lessonIndex: 3,
  title: 'Scale Degrees 4-5',
  description: 'Learn about Subdominant and Dominant - the pillars of harmony.',
  xpReward: 50,
  blocks: [
    {
      id: 'sk1-3-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The 4th and 5th scale degrees are incredibly important in music. They\'re the foundation of most chord progressions!',
          audioType: 'scale',
          audioData: {
            notes: [60, 65, 67],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-3-subdominant',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The 4th degree is the SUBDOMINANT (Fa). "Sub" means "below" - it\'s as far below the tonic as the dominant is above. Listen:',
          audioType: 'note',
          audioData: {
            notes: [65], // F
          },
        },
      },
    },
    {
      id: 'sk1-3-dominant',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The 5th degree is the DOMINANT (Sol). It\'s the second most important note after the tonic. It creates tension that wants to resolve home.',
          audioType: 'scale',
          audioData: {
            notes: [67, 60], // G to C (V to I resolution)
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-3-tension',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Listen to how the dominant (Sol) wants to resolve to the tonic (Do). This tension and resolution is the heart of Western music!',
          audioType: 'scale',
          audioData: {
            notes: [67, 60],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-3-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Which scale degree creates the most tension and wants to resolve?',
          audioType: 'scale',
          audioData: {
            notes: [67, 60],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Subdominant (4)', 'Dominant (5)', 'Tonic (1)'],
          correctIndex: 1,
          explanation: 'The dominant (5) creates tension that pulls strongly back to the tonic.',
        },
      },
    },
    {
      id: 'sk1-3-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'In Do-Re-Mi-Fa-Sol, which note is the SUBDOMINANT?',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Mi (3rd)', 'Fa (4th)', 'Sol (5th)'],
          correctIndex: 1,
          explanation: 'Fa is the 4th degree - the subdominant.',
        },
      },
    },
    {
      id: 'sk1-3-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each scale degree to its name:',
          items: [
            { id: 'fa', label: '4th degree (Fa)', correctZone: 'subdominant' },
            { id: 'sol', label: '5th degree (Sol)', correctZone: 'dominant' },
          ],
          zones: [
            { id: 'subdominant', label: 'Subdominant' },
            { id: 'dominant', label: 'Dominant' },
          ],
        },
      },
    },
    {
      id: 'sk1-3-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The fifth degree is called the {{0}} because it dominates the harmony.',
          blanks: [
            {
              options: ['dominant', 'subdominant', 'tonic', 'mediant'],
              correctIndex: 0,
            },
          ],
          explanation: 'The fifth degree is called the dominant because it dominates the harmony - it\'s the most important note after the tonic.',
        },
      },
    },
  ],
};
