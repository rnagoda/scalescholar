/**
 * Ear School Curriculum
 *
 * 4-week structured curriculum for ear training.
 * Week 1: Basic Solfege & Pitch Awareness
 * Week 2: Perfect Intervals
 * Week 3: Major Scale Construction
 * Week 4: Simple Rhythms
 */

import {
  EarSchoolCurriculum,
  EarSchoolWeekDef,
  EarSchoolLessonDef,
  EarSchoolQuestion,
  EarSchoolAnswerOption,
  KEY_POOLS,
} from '../../types/ear-school';

// ============================================================================
// Question Generators (Placeholder - will be fully implemented in Phase 2)
// ============================================================================

/**
 * Generate a unique ID for a question
 */
const generateQuestionId = (): string => {
  return `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Pick a random item from an array
 */
const pickRandom = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Shuffle an array (Fisher-Yates)
 */
const shuffle = <T>(arr: readonly T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Placeholder question generator for scale degree identification
 */
const generateScaleDegreeQuestion = (
  keyPool: readonly string[],
  degrees: readonly number[],
  _previousQuestion?: EarSchoolQuestion
): EarSchoolQuestion => {
  const key = pickRandom(keyPool);
  const targetDegree = pickRandom(degrees);

  const options: EarSchoolAnswerOption[] = shuffle(
    degrees.map((d) => ({
      id: `degree-${d}`,
      label: d.toString(),
      value: d.toString(),
    }))
  );

  return {
    id: generateQuestionId(),
    type: 'scale-degree-id',
    prompt: 'What scale degree is this?',
    key,
    audioParams: {
      key,
      scaleDegrees: [targetDegree],
      playContext: true,
    },
    options,
    correctAnswerId: `degree-${targetDegree}`,
    hint: 'Listen to the reference scale first, then identify the note.',
  };
};

/**
 * Placeholder question generator for interval identification
 */
const generateIntervalQuestion = (
  keyPool: readonly string[],
  intervals: readonly { semitones: number; name: string }[],
  _previousQuestion?: EarSchoolQuestion
): EarSchoolQuestion => {
  const key = pickRandom(keyPool);
  const targetInterval = pickRandom(intervals);

  const options: EarSchoolAnswerOption[] = shuffle(
    intervals.map((i) => ({
      id: `interval-${i.semitones}`,
      label: i.name,
      value: i.semitones.toString(),
    }))
  );

  return {
    id: generateQuestionId(),
    type: 'interval-id',
    prompt: 'What interval is this?',
    key,
    audioParams: {
      key,
      interval: targetInterval.semitones,
      direction: 'ascending',
    },
    options,
    correctAnswerId: `interval-${targetInterval.semitones}`,
    hint: 'Perfect 5th sounds like "Twinkle Twinkle Little Star".',
  };
};

/**
 * Placeholder question generator for same/different
 */
const generateSameDifferentQuestion = (
  _keyPool: readonly string[],
  _previousQuestion?: EarSchoolQuestion
): EarSchoolQuestion => {
  const isSame = Math.random() > 0.5;

  const options: EarSchoolAnswerOption[] = [
    { id: 'same', label: 'Same', value: 'same' },
    { id: 'different', label: 'Different', value: 'different' },
  ];

  return {
    id: generateQuestionId(),
    type: 'same-different',
    prompt: 'Are these two notes the same pitch?',
    key: 'C major', // Not relevant for this exercise
    audioParams: {
      rootMidi: 60 + Math.floor(Math.random() * 12),
      interval: isSame ? 0 : pickRandom([1, 2, 3, 4, 5]),
    },
    options,
    correctAnswerId: isSame ? 'same' : 'different',
  };
};

// ============================================================================
// Week 1: Basic Solfege & Pitch Awareness
// ============================================================================

const week1Lessons: EarSchoolLessonDef[] = [
  {
    id: 'ear-school-1.1',
    weekId: 'ear-school-week-1',
    weekNumber: 1,
    lessonNumber: 1,
    title: 'Finding Do',
    subtitle: 'Identify the tonal center',
    concept: 'Do as the tonal center / "home" note',
    exerciseType: 'identify-tonic',
    keyPool: ['C major', 'G major'],
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateScaleDegreeQuestion(keyPool, [1, 2, 3], prev),
  },
  {
    id: 'ear-school-1.2',
    weekId: 'ear-school-week-1',
    weekNumber: 1,
    lessonNumber: 2,
    title: 'Do-Re-Mi Recognition',
    subtitle: 'Identify scale degrees 1, 2, 3',
    concept: 'First three scale degrees as a unit',
    exerciseType: 'scale-degree-id',
    keyPool: ['C major', 'G major', 'F major'],
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateScaleDegreeQuestion(keyPool, [1, 2, 3], prev),
  },
  {
    id: 'ear-school-1.3',
    weekId: 'ear-school-week-1',
    weekNumber: 1,
    lessonNumber: 3,
    title: 'Do-Re-Mi Patterns',
    subtitle: 'Match 3-note melodic patterns',
    concept: 'Recognizing melodic patterns within the trichord',
    exerciseType: 'pattern-match',
    keyPool: KEY_POOLS.WEEK_1,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateScaleDegreeQuestion(keyPool, [1, 2, 3], prev),
  },
];

const week1Assessment: EarSchoolLessonDef = {
  id: 'ear-school-1-assessment',
  weekId: 'ear-school-week-1',
  weekNumber: 1,
  lessonNumber: 4,
  title: 'Week 1 Assessment',
  subtitle: 'Test your solfege skills',
  concept: 'Assessment covering all Week 1 concepts',
  exerciseType: 'scale-degree-id',
  keyPool: KEY_POOLS.WEEK_1,
  questionCount: 15,
  passThreshold: 80,
  isAssessment: true,
  generateQuestion: (keyPool, prev) =>
    generateScaleDegreeQuestion(keyPool, [1, 2, 3], prev),
};

const week1: EarSchoolWeekDef = {
  id: 'ear-school-week-1',
  number: 1,
  title: 'Basic Solfege & Pitch Awareness',
  description: 'Recognize and identify Do-Re-Mi (scale degrees 1-2-3) by ear in various keys',
  lessons: week1Lessons,
  assessment: week1Assessment,
};

// ============================================================================
// Week 2: Perfect Intervals
// ============================================================================

const PERFECT_INTERVALS = [
  { semitones: 0, name: 'Unison' },
  { semitones: 7, name: 'P5' },
  { semitones: 12, name: 'Octave' },
];

const week2Lessons: EarSchoolLessonDef[] = [
  {
    id: 'ear-school-2.1',
    weekId: 'ear-school-week-2',
    weekNumber: 2,
    lessonNumber: 1,
    title: 'Unison vs. Different',
    subtitle: 'Same pitch recognition',
    concept: 'Same pitch recognition',
    exerciseType: 'same-different',
    keyPool: KEY_POOLS.WEEK_2,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: generateSameDifferentQuestion,
  },
  {
    id: 'ear-school-2.2',
    weekId: 'ear-school-week-2',
    weekNumber: 2,
    lessonNumber: 2,
    title: 'Perfect 5th (Do-Sol)',
    subtitle: 'The stable, open sound of P5',
    concept: 'The stable, open sound of P5',
    exerciseType: 'interval-id',
    keyPool: KEY_POOLS.WEEK_2,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateIntervalQuestion(keyPool, PERFECT_INTERVALS, prev),
  },
  {
    id: 'ear-school-2.3',
    weekId: 'ear-school-week-2',
    weekNumber: 2,
    lessonNumber: 3,
    title: 'Perfect Interval Discrimination',
    subtitle: 'Distinguish all three perfect intervals',
    concept: 'Distinguishing all three perfect intervals in any direction',
    exerciseType: 'interval-id',
    keyPool: KEY_POOLS.WEEK_2,
    questionCount: 15,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateIntervalQuestion(keyPool, PERFECT_INTERVALS, prev),
  },
];

const week2Assessment: EarSchoolLessonDef = {
  id: 'ear-school-2-assessment',
  weekId: 'ear-school-week-2',
  weekNumber: 2,
  lessonNumber: 4,
  title: 'Week 2 Assessment',
  subtitle: 'Test your interval skills',
  concept: 'Assessment covering all perfect intervals',
  exerciseType: 'interval-id',
  keyPool: KEY_POOLS.WEEK_2,
  questionCount: 15,
  passThreshold: 80,
  isAssessment: true,
  generateQuestion: (keyPool, prev) =>
    generateIntervalQuestion(keyPool, PERFECT_INTERVALS, prev),
};

const week2: EarSchoolWeekDef = {
  id: 'ear-school-week-2',
  number: 2,
  title: 'Perfect Intervals',
  description: 'Identify perfect unison, perfect 5th, and octave by ear from any root',
  lessons: week2Lessons,
  assessment: week2Assessment,
};

// ============================================================================
// Week 3: Major Scale Construction
// ============================================================================

const week3Lessons: EarSchoolLessonDef[] = [
  {
    id: 'ear-school-3.1',
    weekId: 'ear-school-week-3',
    weekNumber: 3,
    lessonNumber: 1,
    title: 'Upper Tetrachord',
    subtitle: 'Sol-La-Ti-Do (degrees 5-6-7-8)',
    concept: 'Extending beyond Do-Re-Mi to complete the scale',
    exerciseType: 'scale-degree-id',
    keyPool: ['C major', 'G major', 'D major', 'F major', 'Bb major'],
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateScaleDegreeQuestion(keyPool, [5, 6, 7, 1], prev),
  },
  {
    id: 'ear-school-3.2',
    weekId: 'ear-school-week-3',
    weekNumber: 3,
    lessonNumber: 2,
    title: 'Full Scale Degrees',
    subtitle: 'All seven degrees in context',
    concept: 'All seven degrees in context',
    exerciseType: 'scale-degree-id',
    keyPool: KEY_POOLS.WEEK_3_MAJOR,
    questionCount: 15,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateScaleDegreeQuestion(keyPool, [1, 2, 3, 4, 5, 6, 7], prev),
  },
  {
    id: 'ear-school-3.3',
    weekId: 'ear-school-week-3',
    weekNumber: 3,
    lessonNumber: 3,
    title: 'Whole Step vs. Half Step',
    subtitle: 'The building blocks of scales',
    concept: 'The building blocks of scales',
    exerciseType: 'step-type',
    keyPool: KEY_POOLS.WEEK_3_MAJOR,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateIntervalQuestion(
        keyPool,
        [
          { semitones: 1, name: 'Half Step' },
          { semitones: 2, name: 'Whole Step' },
        ],
        prev
      ),
  },
  {
    id: 'ear-school-3.4',
    weekId: 'ear-school-week-3',
    weekNumber: 3,
    lessonNumber: 4,
    title: 'Major vs. Minor',
    subtitle: 'Scale quality identification',
    concept: 'Hearing the difference between major and natural minor',
    exerciseType: 'scale-quality',
    keyPool: [...KEY_POOLS.WEEK_3_MAJOR.slice(0, 4), ...KEY_POOLS.WEEK_3_MINOR],
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev): EarSchoolQuestion => {
      const isMajor = Math.random() > 0.5;
      const scaleType: 'major' | 'minor' = isMajor ? 'major' : 'minor';
      const options: EarSchoolAnswerOption[] = [
        { id: 'major', label: 'Major', value: 'major' },
        { id: 'minor', label: 'Minor', value: 'minor' },
      ];
      return {
        id: generateQuestionId(),
        type: 'scale-quality',
        prompt: 'Is this scale major or minor?',
        key: pickRandom(keyPool),
        audioParams: {
          scaleType,
        },
        options,
        correctAnswerId: scaleType,
      };
    },
  },
];

const week3Assessment: EarSchoolLessonDef = {
  id: 'ear-school-3-assessment',
  weekId: 'ear-school-week-3',
  weekNumber: 3,
  lessonNumber: 5,
  title: 'Week 3 Assessment',
  subtitle: 'Test your scale construction skills',
  concept: 'Assessment covering scale degrees and major/minor recognition',
  exerciseType: 'scale-degree-id',
  keyPool: KEY_POOLS.WEEK_3_MAJOR,
  questionCount: 20,
  passThreshold: 80,
  isAssessment: true,
  generateQuestion: (keyPool, prev) =>
    generateScaleDegreeQuestion(keyPool, [1, 2, 3, 4, 5, 6, 7], prev),
};

const week3: EarSchoolWeekDef = {
  id: 'ear-school-week-3',
  number: 3,
  title: 'Major Scale Construction',
  description:
    'Recognize all seven scale degrees in any major key and understand whole/half step patterns',
  lessons: week3Lessons,
  assessment: week3Assessment,
};

// ============================================================================
// Week 4: Simple Rhythms (Placeholder - will be expanded in Phase 5)
// ============================================================================

const week4Lessons: EarSchoolLessonDef[] = [
  {
    id: 'ear-school-4.1',
    weekId: 'ear-school-week-4',
    weekNumber: 4,
    lessonNumber: 1,
    title: 'Quarter Note Pulse',
    subtitle: 'Steady beat as rhythmic foundation',
    concept: 'Steady beat as rhythmic foundation',
    exerciseType: 'pulse-count',
    keyPool: KEY_POOLS.WEEK_4,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, _prev) => {
      const beats = pickRandom([2, 3, 4, 5]);
      return {
        id: generateQuestionId(),
        type: 'pulse-count',
        prompt: 'How many beats do you hear?',
        key: pickRandom(keyPool),
        audioParams: {
          rhythmPattern: 'q '.repeat(beats).trim(),
          bpm: 60,
        },
        options: [2, 3, 4, 5].map((b) => ({
          id: `beats-${b}`,
          label: b.toString(),
          value: b.toString(),
        })),
        correctAnswerId: `beats-${beats}`,
      };
    },
  },
  {
    id: 'ear-school-4.2',
    weekId: 'ear-school-week-4',
    weekNumber: 4,
    lessonNumber: 2,
    title: 'Half Notes and Whole Notes',
    subtitle: 'Notes that span multiple beats',
    concept: 'Notes that span multiple beats',
    exerciseType: 'note-value',
    keyPool: KEY_POOLS.WEEK_4,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, _prev) => {
      const beats = pickRandom([1, 2, 4]);
      const beatNames: Record<number, string> = { 1: '1 beat', 2: '2 beats', 4: '4 beats' };
      return {
        id: generateQuestionId(),
        type: 'note-value',
        prompt: 'How long is this note?',
        key: pickRandom(keyPool),
        audioParams: {
          noteDuration: beats,
          bpm: 60,
        },
        options: [1, 2, 4].map((b) => ({
          id: `duration-${b}`,
          label: beatNames[b],
          value: b.toString(),
        })),
        correctAnswerId: `duration-${beats}`,
      };
    },
  },
  {
    id: 'ear-school-4.3',
    weekId: 'ear-school-week-4',
    weekNumber: 4,
    lessonNumber: 3,
    title: 'Simple Rhythm Patterns',
    subtitle: 'Combining note values into patterns',
    concept: 'Combining note values into patterns',
    exerciseType: 'rhythm-pattern',
    keyPool: KEY_POOLS.WEEK_4,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, _prev) => {
      const patterns = ['q q q q', 'h q q', 'q q h', 'w'];
      const patternLabels: Record<string, string> = {
        'q q q q': '♩ ♩ ♩ ♩',
        'h q q': '𝅗𝅥 ♩ ♩',
        'q q h': '♩ ♩ 𝅗𝅥',
        w: '𝅝',
      };
      const pattern = pickRandom(patterns);
      return {
        id: generateQuestionId(),
        type: 'rhythm-pattern',
        prompt: 'Which rhythm pattern do you hear?',
        key: pickRandom(keyPool),
        audioParams: {
          rhythmPattern: pattern,
          bpm: 60,
        },
        options: shuffle(
          patterns.map((p) => ({
            id: `pattern-${p.replace(/ /g, '-')}`,
            label: patternLabels[p],
            value: p,
          }))
        ),
        correctAnswerId: `pattern-${pattern.replace(/ /g, '-')}`,
      };
    },
  },
  {
    id: 'ear-school-4.4',
    weekId: 'ear-school-week-4',
    weekNumber: 4,
    lessonNumber: 4,
    title: 'Rhythm + Pitch Integration',
    subtitle: 'Hearing rhythm in melodic context',
    concept: 'Hearing rhythm in melodic context',
    exerciseType: 'pitch-rhythm',
    keyPool: KEY_POOLS.WEEK_4,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateScaleDegreeQuestion(keyPool, [1, 2, 3, 4, 5], prev),
  },
];

const week4Assessment: EarSchoolLessonDef = {
  id: 'ear-school-4-assessment',
  weekId: 'ear-school-week-4',
  weekNumber: 4,
  lessonNumber: 5,
  title: 'Week 4 Assessment (Final)',
  subtitle: 'Complete ear training assessment',
  concept: 'Assessment covering all rhythm concepts and integration',
  exerciseType: 'rhythm-pattern',
  keyPool: KEY_POOLS.WEEK_4,
  questionCount: 20,
  passThreshold: 80,
  isAssessment: true,
  generateQuestion: (keyPool, _prev) => {
    const patterns = ['q q q q', 'h q q', 'q q h', 'w'];
    const patternLabels: Record<string, string> = {
      'q q q q': '♩ ♩ ♩ ♩',
      'h q q': '𝅗𝅥 ♩ ♩',
      'q q h': '♩ ♩ 𝅗𝅥',
      w: '𝅝',
    };
    const pattern = pickRandom(patterns);
    return {
      id: generateQuestionId(),
      type: 'rhythm-pattern',
      prompt: 'Which rhythm pattern do you hear?',
      key: pickRandom(keyPool),
      audioParams: {
        rhythmPattern: pattern,
        bpm: 60,
      },
      options: shuffle(
        patterns.map((p) => ({
          id: `pattern-${p.replace(/ /g, '-')}`,
          label: patternLabels[p],
          value: p,
        }))
      ),
      correctAnswerId: `pattern-${pattern.replace(/ /g, '-')}`,
    };
  },
};

const week4: EarSchoolWeekDef = {
  id: 'ear-school-week-4',
  number: 4,
  title: 'Simple Rhythms',
  description: 'Identify basic note values and simple rhythmic patterns',
  lessons: week4Lessons,
  assessment: week4Assessment,
};

// ============================================================================
// Full Curriculum
// ============================================================================

export const EAR_SCHOOL_CURRICULUM: EarSchoolCurriculum = {
  weeks: [week1, week2, week3, week4],
};

/**
 * Get a week by ID
 */
export const getWeekById = (weekId: string): EarSchoolWeekDef | undefined => {
  return EAR_SCHOOL_CURRICULUM.weeks.find((w) => w.id === weekId);
};

/**
 * Get a lesson by ID
 */
export const getLessonById = (lessonId: string): EarSchoolLessonDef | undefined => {
  for (const week of EAR_SCHOOL_CURRICULUM.weeks) {
    const lesson = week.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
    if (week.assessment.id === lessonId) return week.assessment;
  }
  return undefined;
};

/**
 * Get all lessons for a week (including assessment)
 */
export const getWeekLessons = (weekId: string): EarSchoolLessonDef[] => {
  const week = getWeekById(weekId);
  if (!week) return [];
  return [...week.lessons, week.assessment];
};

/**
 * Get the total number of lessons (excluding assessments)
 */
export const getTotalLessonCount = (): number => {
  return EAR_SCHOOL_CURRICULUM.weeks.reduce((sum, week) => sum + week.lessons.length, 0);
};
