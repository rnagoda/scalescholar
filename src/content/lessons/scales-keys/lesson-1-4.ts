/**
 * Lesson 1.4: Scale Degrees 6-7
 *
 * Introduction to Submediant and Leading Tone.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'scales-keys-1-4',
  trackId: 'scales-keys',
  levelIndex: 1,
  lessonIndex: 4,
  title: 'Scale Degrees 6-7',
  description: 'Learn about Submediant and Leading Tone - completing the scale.',
  xpReward: 50,
  blocks: [
    {
      id: 'sk1-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Let\'s complete our tour of the scale degrees with the 6th and 7th notes. These complete the major scale!',
          audioType: 'scale',
          audioData: {
            notes: [60, 62, 64, 65, 67, 69, 71, 72],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-4-submediant',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The 6th degree is the SUBMEDIANT (La). Just as the mediant is between tonic and dominant, the submediant is below the tonic in the other direction.',
          audioType: 'note',
          audioData: {
            notes: [69], // A
          },
        },
      },
    },
    {
      id: 'sk1-4-leading',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The 7th degree is the LEADING TONE (Ti). It\'s only a half step below the tonic and "leads" strongly upward to resolve home. Listen:',
          audioType: 'scale',
          audioData: {
            notes: [71, 72], // B to C
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-4-pull',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Feel how the leading tone REALLY wants to go up to the tonic. That pull is why it\'s called the "leading" tone - it leads you home!',
          audioType: 'scale',
          audioData: {
            notes: [71, 72],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'sk1-4-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'The leading tone is how far from the tonic?',
          audioType: 'scale',
          audioData: {
            notes: [71, 72],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['A whole step below', 'A half step below', 'A half step above'],
          correctIndex: 1,
          explanation: 'The leading tone is just a half step below the tonic - that\'s why it pulls so strongly!',
        },
      },
    },
    {
      id: 'sk1-4-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Why is the 7th degree called the "leading tone"?',
          audioType: 'scale',
          audioData: {
            notes: [69, 71, 72],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['It\'s the loudest note', 'It leads strongly to the tonic', 'It\'s the first note learned'],
          correctIndex: 1,
          explanation: 'The leading tone "leads" us home to the tonic with its strong pull upward.',
        },
      },
    },
    {
      id: 'sk1-4-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each scale degree to its name:',
          items: [
            { id: 'la', label: '6th degree (La)', correctZone: 'submediant' },
            { id: 'ti', label: '7th degree (Ti)', correctZone: 'leading' },
          ],
          zones: [
            { id: 'submediant', label: 'Submediant' },
            { id: 'leading', label: 'Leading Tone' },
          ],
        },
      },
    },
    {
      id: 'sk1-4-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put all 7 scale degree names in order (1 to 7):',
          items: [
            { id: 'dominant', label: 'Dominant', correctPosition: 2 },
            { id: 'mediant', label: 'Mediant', correctPosition: 1 },
            { id: 'tonic', label: 'Tonic', correctPosition: 0 },
            { id: 'leading', label: 'Leading Tone', correctPosition: 3 },
          ],
          explanation: 'Tonic (1), Mediant (3), Dominant (5), Leading Tone (7)',
        },
      },
    },
  ],
};
