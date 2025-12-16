/**
 * Lesson 1.2: Scale Degrees 1-3
 *
 * Introduction to Tonic, Supertonic, and Mediant.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-1-2',
  trackId: 'scales-keys',
  levelIndex: 1,
  lessonIndex: 2,
  title: 'Scale Degrees 1-3',
  description: 'Learn about Tonic, Supertonic, and Mediant - the first three scale degrees.',
  xpReward: 50,
  blocks: [
    {
      id: 'sk1-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Each note in a scale has a number (1-7) and a name. These are called SCALE DEGREES. Let\'s learn the first three!',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-2-tonic',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The 1st degree is the TONIC (Do). It\'s "home base" - the note the scale is named after. Music feels resolved when it returns to the tonic.',
          audioType: 'note',
          audioData: {
            notes: [60], // C (tonic)
          },
        },
      },
    },
    {
      id: 'sk1-2-supertonic',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The 2nd degree is the SUPERTONIC (Re). "Super" means "above" - it\'s the note above the tonic. Listen:',
          audioType: 'scale',
          audioData: {
            notes: [60, 62], // C to D
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-2-mediant',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The 3rd degree is the MEDIANT (Mi). It\'s in the "middle" between the tonic and dominant. It determines if the music sounds major or minor!',
          audioType: 'scale',
          audioData: {
            notes: [60, 64], // C to E
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-2-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Listen. Which scale degree is this? (Hint: It\'s "home base")',
          audioType: 'note',
          audioData: {
            notes: [60],
          },
          options: ['Tonic (1)', 'Supertonic (2)', 'Mediant (3)'],
          correctIndex: 0,
          explanation: 'The tonic is "home base" - the note where music feels resolved.',
        },
      },
    },
    {
      id: 'sk1-2-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'In the pattern Do-Re-Mi, which note is the SUPERTONIC?',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Do (1st note)', 'Re (2nd note)', 'Mi (3rd note)'],
          correctIndex: 1,
          explanation: 'Re is the 2nd degree - the supertonic, above the tonic.',
        },
      },
    },
    {
      id: 'sk1-2-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each scale degree to its name:',
          items: [
            { id: 'do', label: '1st degree (Do)', correctZone: 'tonic' },
            { id: 're', label: '2nd degree (Re)', correctZone: 'supertonic' },
            { id: 'mi', label: '3rd degree (Mi)', correctZone: 'mediant' },
          ],
          zones: [
            { id: 'tonic', label: 'Tonic' },
            { id: 'supertonic', label: 'Supertonic' },
            { id: 'mediant', label: 'Mediant' },
          ],
        },
      },
    },
    {
      id: 'sk1-2-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The first degree of a scale is called the {{0}}.',
          blanks: [
            {
              options: ['tonic', 'supertonic', 'mediant', 'dominant'],
              correctIndex: 0,
            },
          ],
          explanation: 'The first degree of a scale is called the tonic - it\'s "home base".',
        },
      },
    },
  ],
};
