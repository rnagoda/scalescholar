/**
 * Lesson 1.4: Diminished Triads
 *
 * Introduction to diminished triads (root, m3, TT).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-1-4',
  trackId: 'chords',
  levelIndex: 1,
  lessonIndex: 4,
  title: 'Diminished Triads',
  description: 'Learn the tense, unstable sound of diminished chords.',
  xpReward: 50,
  blocks: [
    {
      id: 'c1-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A DIMINISHED TRIAD has a tense, unstable sound. It\'s built with a root, a minor third (3 half steps), and a diminished/tritone fifth (6 half steps).',
          audioType: 'chord',
          audioData: {
            notes: [60, 63, 66], // C diminished
          },
        },
      },
    },
    {
      id: 'c1-4-tritone',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The diminished fifth is also called a tritone - the most unstable interval! This gives the chord its tension.',
          audioType: 'chord',
          audioData: {
            notes: [60, 63, 66],
          },
        },
      },
    },
    {
      id: 'c1-4-compare',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Compare: major (happy), minor (sad), diminished (tense). Same root, different intervals:',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 60, 63, 67, 0, 60, 63, 66],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c1-4-formula',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The diminished formula is: Root + Minor 3rd + Diminished 5th. In numbers: 0 + 3 + 6 half steps.',
          audioType: 'chord',
          audioData: {
            notes: [60, 63, 66],
          },
        },
      },
    },
    {
      id: 'c1-4-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Does this diminished chord sound STABLE or UNSTABLE?',
          audioType: 'chord',
          audioData: {
            notes: [62, 65, 68], // D diminished
          },
          options: ['Stable/resolved', 'Unstable/tense'],
          correctIndex: 1,
          explanation: 'Diminished chords are the most unstable - they create tension that wants to resolve.',
        },
      },
    },
    {
      id: 'c1-4-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What type of chord is this?',
          audioType: 'chord',
          audioData: {
            notes: [64, 67, 70], // E diminished
          },
          options: ['Major', 'Minor', 'Diminished'],
          correctIndex: 2,
          explanation: 'This is a diminished chord - you can hear its characteristic tense, unstable quality.',
        },
      },
    },
    {
      id: 'c1-4-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What type of chord is this?',
          audioType: 'chord',
          audioData: {
            notes: [65, 69, 72], // F major
          },
          options: ['Major', 'Minor', 'Diminished'],
          correctIndex: 0,
          explanation: 'This is a major chord - bright and happy, not tense.',
        },
      },
    },
    {
      id: 'c1-4-sort',
      type: 'sorting',
      content: {
        type: 'sorting',
        data: {
          instruction: 'Put these chord types in order from HAPPIEST to MOST TENSE:',
          items: [
            { id: 'diminished', label: 'Diminished', correctPosition: 2 },
            { id: 'minor', label: 'Minor', correctPosition: 1 },
            { id: 'major', label: 'Major', correctPosition: 0 },
          ],
          explanation: 'Major (happy) → Minor (sad) → Diminished (tense)',
        },
      },
    },
  ],
};
