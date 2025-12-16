/**
 * Lesson 3.2: Minor Seventh
 *
 * Introduction to the minor seventh interval (10 half steps).
 */

import { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'intervals-3-2',
  trackId: 'intervals',
  levelIndex: 3,
  lessonIndex: 2,
  title: 'Minor Seventh',
  description: 'Learn the bluesy, jazzy sound of the minor seventh.',
  xpReward: 50,
  blocks: [
    {
      id: 'i3-2-intro',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'A MINOR SEVENTH (m7) spans 10 half steps. It has a bluesy, slightly unresolved quality that\'s essential to jazz and blues.',
          audioType: 'interval',
          audioData: {
            notes: [60, 70], // C to Bb
          },
        },
      },
    },
    {
      id: 'i3-2-sound',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: 'The minor seventh is the sound of dominant 7th chords - that classic blues/jazz sound. It wants to resolve but has a cool, laid-back feel.',
          audioType: 'interval',
          audioData: {
            notes: [60, 70],
          },
        },
      },
    },
    {
      id: 'i3-2-reference',
      type: 'text-audio',
      content: {
        type: 'text-audio',
        data: {
          text: '"There\'s a Place for Us" from West Side Story begins with a minor seventh. It\'s also in the Star Trek theme.',
          audioType: 'interval',
          audioData: {
            notes: [60, 70],
          },
        },
      },
    },
    {
      id: 'i3-2-quiz1',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MAJOR SIXTH or MINOR SEVENTH?',
          audioType: 'interval',
          audioData: {
            notes: [62, 72], // D to C - minor seventh
          },
          options: ['Major 6th (9 semitones)', 'Minor 7th (10 semitones)'],
          correctIndex: 1,
          explanation: 'This is a minor seventh - that bluesy, jazzy interval.',
        },
      },
    },
    {
      id: 'i3-2-quiz2',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'Is this a MAJOR SIXTH or MINOR SEVENTH?',
          audioType: 'interval',
          audioData: {
            notes: [65, 74], // F to D - major sixth
          },
          options: ['Major 6th (9 semitones)', 'Minor 7th (10 semitones)'],
          correctIndex: 0,
          explanation: 'This is a major sixth - brighter and more resolved.',
        },
      },
    },
    {
      id: 'i3-2-quiz3',
      type: 'audio-quiz',
      content: {
        type: 'audio-quiz',
        data: {
          question: 'What interval is this?',
          audioType: 'interval',
          audioData: {
            notes: [67, 77], // G to F - minor seventh
          },
          options: ['Minor 6th', 'Major 6th', 'Minor 7th'],
          correctIndex: 2,
          explanation: 'This is a minor seventh - 10 half steps, that jazzy sound.',
        },
      },
    },
    {
      id: 'i3-2-fill',
      type: 'fill-blank',
      content: {
        type: 'fill-blank',
        data: {
          textWithBlanks: 'The minor seventh is common in {{0}} and blues music.',
          blanks: [
            {
              options: ['jazz', 'rock', 'classical', 'country'],
              correctIndex: 0,
            },
          ],
          explanation: 'The minor seventh is common in jazz and blues music.',
        },
      },
    },
  ],
};
