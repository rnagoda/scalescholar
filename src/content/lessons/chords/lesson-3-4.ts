/**
 * Lesson 3.4: Chord Progressions II
 *
 * Introduction to I-V-vi-IV and ii-V-I progressions.
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'chords-3-4',
  trackId: 'chords',
  levelIndex: 3,
  lessonIndex: 4,
  title: 'Chord Progressions II',
  description: 'Learn the most popular chord progressions in modern music.',
  xpReward: 75,
  blocks: [
    {
      id: 'c3-4-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Let\'s learn two more essential progressions: the "pop progression" (I-V-vi-IV) and the jazz standard (ii-V-I).',
          audioType: 'chord',
          audioData: {
            notes: [60, 64, 67],
          },
        },
      },
    },
    {
      id: 'c3-4-pop',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'I-V-vi-IV is the most popular progression in modern pop music. In C: C-G-Am-F. Hundreds of hit songs use it!',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 67, 71, 74, 0, 69, 72, 76, 0, 65, 69, 72],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c3-4-minor',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'Notice the vi chord is MINOR (lowercase numeral). In C major, vi is A minor. This adds emotional depth to the progression.',
          audioType: 'chord',
          audioData: {
            notes: [69, 72, 76], // Am
          },
        },
      },
    },
    {
      id: 'c3-4-jazz',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The ii-V-I is THE most common jazz progression. In C: Dm7-G7-Cmaj7. It creates smooth voice leading.',
          audioType: 'scale',
          audioData: {
            notes: [62, 65, 69, 72, 0, 67, 71, 74, 77, 0, 60, 64, 67, 71],
            scaleType: 'major',
            rootNote: 60,
          },
        },
      },
    },
    {
      id: 'c3-4-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'In I-V-vi-IV, what type of chord is vi?',
          audioType: 'chord',
          audioData: {
            notes: [69, 72, 76], // Am
          },
          options: ['Major', 'Minor', 'Diminished'],
          correctIndex: 1,
          explanation: 'The vi chord is minor - that\'s why we use lowercase "vi".',
        },
      },
    },
    {
      id: 'c3-4-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Which progression is this? C-G-Am-F',
          audioType: 'scale',
          audioData: {
            notes: [60, 64, 67, 0, 67, 71, 74, 0, 69, 72, 76, 0, 65, 69, 72],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['I-IV-V-I', 'I-V-vi-IV', 'ii-V-I'],
          correctIndex: 1,
          explanation: 'This is I-V-vi-IV - the famous "pop progression."',
        },
      },
    },
    {
      id: 'c3-4-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'The ii-V-I progression is most common in which genre?',
          audioType: 'scale',
          audioData: {
            notes: [62, 65, 69, 72, 0, 67, 71, 74, 77, 0, 60, 64, 67, 71],
            scaleType: 'major',
            rootNote: 60,
          },
          options: ['Rock', 'Jazz', 'Country'],
          correctIndex: 1,
          explanation: 'The ii-V-I is the most essential jazz chord progression.',
        },
      },
    },
    {
      id: 'c3-4-drag',
      type: 'drag-drop',
      content: {
        type: 'drag-drop',
        data: {
          instruction: 'Match each progression to its common use:',
          items: [
            { id: 'i-iv-v', label: 'I-IV-V-I', correctZone: 'rock' },
            { id: 'i-v-vi', label: 'I-V-vi-IV', correctZone: 'pop' },
            { id: 'ii-v-i', label: 'ii-V-I', correctZone: 'jazz' },
          ],
          zones: [
            { id: 'rock', label: 'Classic rock and blues' },
            { id: 'pop', label: 'Modern pop hits' },
            { id: 'jazz', label: 'Jazz standards' },
          ],
        },
      },
    },
    {
      id: 'c3-4-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'Lowercase Roman numerals (like vi) indicate {{0}} chords.',
          blanks: [
            {
              options: ['minor', 'major', 'diminished', 'augmented'],
              correctIndex: 0,
            },
          ],
          explanation: 'Lowercase Roman numerals (like vi) indicate minor chords. Sad sounding.',
        },
      },
    },
  ],
};
