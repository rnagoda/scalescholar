/**
 * Ear School Curriculum
 *
 * 4-section structured curriculum for ear training.
 * Section 1: Basic Solfege & Pitch Awareness
 * Section 2: Perfect Intervals
 * Section 3: Major Scale Construction
 * Section 4: Simple Rhythms
 */

import {
  EarSchoolCurriculum,
  EarSchoolSectionDef,
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
 * Question generator for identify-tonic (Finding Do) exercises
 * Plays a melodic phrase ending on 1, 2, or 3 and asks what note it ended on
 */
const generateIdentifyTonicQuestion = (
  keyPool: readonly string[],
  previousQuestion?: EarSchoolQuestion
): EarSchoolQuestion => {
  const key = pickRandom(keyPool);

  // The phrase will end on one of these degrees
  const endingDegrees: (1 | 2 | 3)[] = [1, 2, 3];

  // Try to avoid repeating the same correct answer
  let availableDegrees = [...endingDegrees];
  if (previousQuestion?.audioParams.endingDegree) {
    const prevDegree = previousQuestion.audioParams.endingDegree as 1 | 2 | 3;
    availableDegrees = availableDegrees.filter((d) => d !== prevDegree);
    if (availableDegrees.length === 0) availableDegrees = [...endingDegrees];
  }

  const endingDegree = pickRandom(availableDegrees);

  // Options are solfege names
  const solfegeNames: Record<number, string> = { 1: 'Do', 2: 'Re', 3: 'Mi' };
  const options: EarSchoolAnswerOption[] = shuffle(
    endingDegrees.map((d) => ({
      id: `solfege-${d}`,
      label: solfegeNames[d],
      value: d.toString(),
    }))
  );

  return {
    id: generateQuestionId(),
    type: 'identify-tonic',
    prompt: 'What note did the phrase end on?',
    key,
    audioParams: {
      key,
      endingDegree,
    },
    options,
    correctAnswerId: `solfege-${endingDegree}`, // Answer matches the actual ending degree
    hint: 'Listen carefully to the last note of the phrase.',
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

/**
 * Question generator for step-type exercises (whole step vs half step)
 * Plays raw interval without key context
 */
const generateStepTypeQuestion = (
  _keyPool: readonly string[],
  _previousQuestion?: EarSchoolQuestion
): EarSchoolQuestion => {
  // Randomly choose whole step (2 semitones) or half step (1 semitone)
  const isWholeStep = Math.random() > 0.5;
  const interval = isWholeStep ? 2 : 1;

  // Random root note in mid-range (C3 to C5)
  const rootMidi = 48 + Math.floor(Math.random() * 24);

  const options: EarSchoolAnswerOption[] = [
    { id: 'half', label: 'Half Step', value: '1' },
    { id: 'whole', label: 'Whole Step', value: '2' },
  ];

  return {
    id: generateQuestionId(),
    type: 'step-type',
    prompt: 'Is this a whole step or half step?',
    key: 'C major', // Not used for playback, just for consistency
    audioParams: {
      rootMidi,
      interval,
    },
    options,
    correctAnswerId: isWholeStep ? 'whole' : 'half',
    hint: 'A half step is the smallest distance between two notes. A whole step is two half steps.',
  };
};

/**
 * Common 3-note patterns using scale degrees 1, 2, 3
 */
const BASIC_PATTERNS: readonly number[][] = [
  [1, 2, 3], // Ascending
  [3, 2, 1], // Descending
  [1, 3, 2], // Skip up, step down
  [2, 1, 3], // Step down, skip up
  [1, 2, 1], // Neighbor
  [3, 2, 3], // Upper neighbor
  [2, 3, 1], // Step up, skip down
  [2, 1, 2], // Lower neighbor
];

/**
 * Format pattern for display (e.g., [1, 2, 3] -> "1-2-3")
 */
const formatPattern = (pattern: readonly number[]): string => pattern.join('-');

/**
 * Question generator for upper tetrachord (degrees 5, 6, 7, 8)
 * Note: Degree 8 is high Do (same as 1, but an octave higher)
 */
const generateUpperTetrachordQuestion = (
  keyPool: readonly string[],
  previousQuestion?: EarSchoolQuestion
): EarSchoolQuestion => {
  const key = pickRandom(keyPool);

  // Degrees for upper tetrachord: 5, 6, 7, 8 (8 = high Do)
  const displayDegrees = [5, 6, 7, 8];
  // Map display degree to actual scale degree for audio (8 -> 1 with octave offset)
  const degreeToAudio: Record<number, { degree: number; octave: number }> = {
    5: { degree: 5, octave: 0 },
    6: { degree: 6, octave: 0 },
    7: { degree: 7, octave: 0 },
    8: { degree: 1, octave: 1 }, // High Do - degree 1, octave +1
  };

  // Try to avoid repeating the same correct answer
  let availableDegrees = [...displayDegrees];
  if (previousQuestion?.audioParams.scaleDegrees) {
    const prevDegree = previousQuestion.audioParams.scaleDegrees[0];
    availableDegrees = availableDegrees.filter((d) => d !== prevDegree);
    if (availableDegrees.length === 0) availableDegrees = [...displayDegrees];
  }

  const targetDisplayDegree = pickRandom(availableDegrees);
  const audioInfo = degreeToAudio[targetDisplayDegree];

  const options: EarSchoolAnswerOption[] = shuffle(
    displayDegrees.map((d) => ({
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
      scaleDegrees: [audioInfo.degree],
      octaveOffset: audioInfo.octave,
      playContext: true,
    },
    options,
    correctAnswerId: `degree-${targetDisplayDegree}`,
    hint: 'Listen for whether the note is in the upper part of the scale (5-6-7-8).',
  };
};

/**
 * Question generator for pattern-match exercises
 */
const generatePatternMatchQuestion = (
  keyPool: readonly string[],
  previousQuestion?: EarSchoolQuestion
): EarSchoolQuestion => {
  const key = pickRandom(keyPool);

  // Pick 4 distinct patterns for options
  let availablePatterns = [...BASIC_PATTERNS];

  // Try to avoid repeating the same correct answer
  if (previousQuestion?.audioParams.pattern) {
    const prevPattern = previousQuestion.audioParams.pattern;
    availablePatterns = availablePatterns.filter(
      (p) => formatPattern(p) !== formatPattern(prevPattern)
    );
  }

  // Select the correct pattern
  const correctPattern = pickRandom(availablePatterns);

  // Get 3 more distractors
  const distractors = shuffle(
    availablePatterns.filter((p) => formatPattern(p) !== formatPattern(correctPattern))
  ).slice(0, 3);

  // Combine and shuffle options
  const allPatterns = shuffle([correctPattern, ...distractors]);

  const options: EarSchoolAnswerOption[] = allPatterns.map((pattern) => {
    const patternStr = formatPattern(pattern);
    return {
      id: `pattern-${patternStr}`,
      label: patternStr,
      value: patternStr,
    };
  });

  return {
    id: generateQuestionId(),
    type: 'pattern-match',
    prompt: 'What pattern did you hear?',
    key,
    audioParams: {
      key,
      pattern: [...correctPattern],
      playContext: true,
    },
    options,
    correctAnswerId: `pattern-${formatPattern(correctPattern)}`,
    hint: 'Listen for whether the melody goes up, down, or returns to the same note.',
  };
};

// ============================================================================
// Section 1: Basic Solfege & Pitch Awareness
// ============================================================================

const section1Lessons: EarSchoolLessonDef[] = [
  {
    id: 'ear-school-1.1',
    sectionId: 'ear-school-section-1',
    sectionNumber: 1,
    lessonNumber: 1,
    title: 'Finding Do',
    subtitle: 'Identify the tonal center',
    concept:
      'Every melody has a "home" note that feels like a resting place. In music, we call this Do (degree 1). You will hear a short phrase and identify which note sounds like home.',
    exerciseType: 'identify-tonic',
    keyPool: ['C major', 'G major'],
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) => generateIdentifyTonicQuestion(keyPool, prev),
  },
  {
    id: 'ear-school-1.2',
    sectionId: 'ear-school-section-1',
    sectionNumber: 1,
    lessonNumber: 2,
    title: 'Do-Re-Mi Recognition',
    subtitle: 'Identify scale degrees 1, 2, 3',
    concept:
      'The first three notes of a scale (Do-Re-Mi or 1-2-3) form the foundation of melody. Listen for where the note sits in relation to the home note.',
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
    sectionId: 'ear-school-section-1',
    sectionNumber: 1,
    lessonNumber: 3,
    title: 'Do-Re-Mi Patterns',
    subtitle: 'Match 3-note melodic patterns',
    concept:
      'Melodies are made of patterns. Listen for which direction the notes move (up, down, or back) and match the pattern you hear.',
    exerciseType: 'pattern-match',
    keyPool: KEY_POOLS.SECTION_1,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) => generatePatternMatchQuestion(keyPool, prev),
  },
];

const section1Assessment: EarSchoolLessonDef = {
  id: 'ear-school-1-assessment',
  sectionId: 'ear-school-section-1',
  sectionNumber: 1,
  lessonNumber: 4,
  title: 'Section 1 Assessment',
  subtitle: 'Test your solfege skills',
  concept: 'Assessment covering all Section 1 concepts',
  exerciseType: 'scale-degree-id',
  keyPool: KEY_POOLS.SECTION_1,
  questionCount: 15,
  passThreshold: 80,
  isAssessment: true,
  generateQuestion: (keyPool, prev) =>
    generateScaleDegreeQuestion(keyPool, [1, 2, 3], prev),
};

const section1: EarSchoolSectionDef = {
  id: 'ear-school-section-1',
  number: 1,
  title: 'Basic Solfege & Pitch Awareness',
  description: 'Recognize and identify Do-Re-Mi (scale degrees 1-2-3) by ear in various keys',
  lessons: section1Lessons,
  assessment: section1Assessment,
};

// ============================================================================
// Section 2: Perfect Intervals
// ============================================================================

const PERFECT_INTERVALS = [
  { semitones: 0, name: 'Unison' },
  { semitones: 7, name: 'P5' },
  { semitones: 12, name: 'Octave' },
];

const section2Lessons: EarSchoolLessonDef[] = [
  {
    id: 'ear-school-2.1',
    sectionId: 'ear-school-section-2',
    sectionNumber: 2,
    lessonNumber: 1,
    title: 'Unison vs. Different',
    subtitle: 'Same pitch recognition',
    concept:
      'The most basic interval question: are two notes the same pitch, or different? This builds your foundation for hearing all intervals.',
    exerciseType: 'same-different',
    keyPool: KEY_POOLS.SECTION_2,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: generateSameDifferentQuestion,
  },
  {
    id: 'ear-school-2.2',
    sectionId: 'ear-school-section-2',
    sectionNumber: 2,
    lessonNumber: 2,
    title: 'Perfect 5th (Do-Sol)',
    subtitle: 'The stable, open sound of P5',
    concept:
      'The Perfect 5th has a wide, stable, open sound. It is the interval at the start of "Twinkle Twinkle Little Star" and "Star Wars".',
    exerciseType: 'interval-id',
    keyPool: KEY_POOLS.SECTION_2,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateIntervalQuestion(keyPool, PERFECT_INTERVALS, prev),
  },
  {
    id: 'ear-school-2.3',
    sectionId: 'ear-school-section-2',
    sectionNumber: 2,
    lessonNumber: 3,
    title: 'Perfect Interval Discrimination',
    subtitle: 'Distinguish all three perfect intervals',
    concept:
      'Now you will hear all three perfect intervals mixed together. Compare: Unison (same note), Perfect 5th (wide and open), Octave (same note, higher).',
    exerciseType: 'interval-id',
    keyPool: KEY_POOLS.SECTION_2,
    questionCount: 15,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateIntervalQuestion(keyPool, PERFECT_INTERVALS, prev),
  },
];

const section2Assessment: EarSchoolLessonDef = {
  id: 'ear-school-2-assessment',
  sectionId: 'ear-school-section-2',
  sectionNumber: 2,
  lessonNumber: 4,
  title: 'Section 2 Assessment',
  subtitle: 'Test your interval skills',
  concept: 'Assessment covering all perfect intervals',
  exerciseType: 'interval-id',
  keyPool: KEY_POOLS.SECTION_2,
  questionCount: 15,
  passThreshold: 80,
  isAssessment: true,
  generateQuestion: (keyPool, prev) =>
    generateIntervalQuestion(keyPool, PERFECT_INTERVALS, prev),
};

const section2: EarSchoolSectionDef = {
  id: 'ear-school-section-2',
  number: 2,
  title: 'Perfect Intervals',
  description: 'Identify perfect unison, perfect 5th, and octave by ear from any root',
  lessons: section2Lessons,
  assessment: section2Assessment,
};

// ============================================================================
// Section 3: Major Scale Construction
// ============================================================================

const section3Lessons: EarSchoolLessonDef[] = [
  {
    id: 'ear-school-3.1',
    sectionId: 'ear-school-section-3',
    sectionNumber: 3,
    lessonNumber: 1,
    title: 'Upper Tetrachord',
    subtitle: 'Sol-La-Ti-Do (degrees 5-6-7-8)',
    concept:
      'Now we extend beyond Do-Re-Mi to the upper half of the scale. The upper tetrachord (Sol-La-Ti-Do) has degrees 5, 6, 7, and 8 (high Do).',
    exerciseType: 'scale-degree-id',
    keyPool: ['C major', 'G major', 'D major', 'F major', 'Bb major'],
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateUpperTetrachordQuestion(keyPool, prev),
  },
  {
    id: 'ear-school-3.2',
    sectionId: 'ear-school-section-3',
    sectionNumber: 3,
    lessonNumber: 2,
    title: 'Full Scale Degrees',
    subtitle: 'All seven degrees in context',
    concept:
      'You now know all seven degrees of the major scale. Each has its own character: 1 (home), 2 (stepping up), 3 (bright), 4 (leaning), 5 (stable), 6 (longing), 7 (urgent).',
    exerciseType: 'scale-degree-id',
    keyPool: KEY_POOLS.SECTION_3_MAJOR,
    questionCount: 15,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateScaleDegreeQuestion(keyPool, [1, 2, 3, 4, 5, 6, 7], prev),
  },
  {
    id: 'ear-school-3.3',
    sectionId: 'ear-school-section-3',
    sectionNumber: 3,
    lessonNumber: 3,
    title: 'Whole Step vs. Half Step',
    subtitle: 'The building blocks of scales',
    concept:
      'Scales are built from whole steps (2 half steps) and half steps (the smallest distance between notes). Listen for the size of the gap between the two notes.',
    exerciseType: 'step-type',
    keyPool: KEY_POOLS.SECTION_3_MAJOR,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) => generateStepTypeQuestion(keyPool, prev),
  },
  {
    id: 'ear-school-3.4',
    sectionId: 'ear-school-section-3',
    sectionNumber: 3,
    lessonNumber: 4,
    title: 'Major vs. Minor',
    subtitle: 'Scale quality identification',
    concept:
      'Major scales sound bright and happy. Minor scales sound dark and sad. Listen to the 3rd and 6th degrees - they are lower in minor.',
    exerciseType: 'scale-quality',
    keyPool: [...KEY_POOLS.SECTION_3_MAJOR.slice(0, 4), ...KEY_POOLS.SECTION_3_MINOR],
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

const section3Assessment: EarSchoolLessonDef = {
  id: 'ear-school-3-assessment',
  sectionId: 'ear-school-section-3',
  sectionNumber: 3,
  lessonNumber: 5,
  title: 'Section 3 Assessment',
  subtitle: 'Test your scale construction skills',
  concept: 'Assessment covering scale degrees and major/minor recognition',
  exerciseType: 'scale-degree-id',
  keyPool: KEY_POOLS.SECTION_3_MAJOR,
  questionCount: 20,
  passThreshold: 80,
  isAssessment: true,
  generateQuestion: (keyPool, prev) =>
    generateScaleDegreeQuestion(keyPool, [1, 2, 3, 4, 5, 6, 7], prev),
};

const section3: EarSchoolSectionDef = {
  id: 'ear-school-section-3',
  number: 3,
  title: 'Major Scale Construction',
  description:
    'Recognize all seven scale degrees in any major key and understand whole/half step patterns',
  lessons: section3Lessons,
  assessment: section3Assessment,
};

// ============================================================================
// Section 4: Simple Rhythms (Placeholder - will be expanded in Phase 5)
// ============================================================================

const section4Lessons: EarSchoolLessonDef[] = [
  {
    id: 'ear-school-4.1',
    sectionId: 'ear-school-section-4',
    sectionNumber: 4,
    lessonNumber: 1,
    title: 'Quarter Note Pulse',
    subtitle: 'Steady beat as rhythmic foundation',
    concept: 'Steady beat as rhythmic foundation',
    exerciseType: 'pulse-count',
    keyPool: KEY_POOLS.SECTION_4,
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
    sectionId: 'ear-school-section-4',
    sectionNumber: 4,
    lessonNumber: 2,
    title: 'Half Notes and Whole Notes',
    subtitle: 'Notes that span multiple beats',
    concept: 'Notes that span multiple beats',
    exerciseType: 'note-value',
    keyPool: KEY_POOLS.SECTION_4,
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
    sectionId: 'ear-school-section-4',
    sectionNumber: 4,
    lessonNumber: 3,
    title: 'Simple Rhythm Patterns',
    subtitle: 'Combining note values into patterns',
    concept: 'Combining note values into patterns',
    exerciseType: 'rhythm-pattern',
    keyPool: KEY_POOLS.SECTION_4,
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
    sectionId: 'ear-school-section-4',
    sectionNumber: 4,
    lessonNumber: 4,
    title: 'Rhythm + Pitch Integration',
    subtitle: 'Hearing rhythm in melodic context',
    concept: 'Hearing rhythm in melodic context',
    exerciseType: 'pitch-rhythm',
    keyPool: KEY_POOLS.SECTION_4,
    questionCount: 10,
    passThreshold: 70,
    isAssessment: false,
    generateQuestion: (keyPool, prev) =>
      generateScaleDegreeQuestion(keyPool, [1, 2, 3, 4, 5], prev),
  },
];

const section4Assessment: EarSchoolLessonDef = {
  id: 'ear-school-4-assessment',
  sectionId: 'ear-school-section-4',
  sectionNumber: 4,
  lessonNumber: 5,
  title: 'Section 4 Assessment (Final)',
  subtitle: 'Complete ear training assessment',
  concept: 'Assessment covering all rhythm concepts and integration',
  exerciseType: 'rhythm-pattern',
  keyPool: KEY_POOLS.SECTION_4,
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

const section4: EarSchoolSectionDef = {
  id: 'ear-school-section-4',
  number: 4,
  title: 'Simple Rhythms',
  description: 'Identify basic note values and simple rhythmic patterns',
  lessons: section4Lessons,
  assessment: section4Assessment,
};

// ============================================================================
// Full Curriculum
// ============================================================================

export const EAR_SCHOOL_CURRICULUM: EarSchoolCurriculum = {
  sections: [section1, section2, section3, section4],
};

/**
 * Get a section by ID
 */
export const getSectionById = (sectionId: string): EarSchoolSectionDef | undefined => {
  return EAR_SCHOOL_CURRICULUM.sections.find((s) => s.id === sectionId);
};

/**
 * Get a lesson by ID
 */
export const getLessonById = (lessonId: string): EarSchoolLessonDef | undefined => {
  for (const section of EAR_SCHOOL_CURRICULUM.sections) {
    const lesson = section.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
    if (section.assessment.id === lessonId) return section.assessment;
  }
  return undefined;
};

/**
 * Get all lessons for a section (including assessment)
 */
export const getSectionLessons = (sectionId: string): EarSchoolLessonDef[] => {
  const section = getSectionById(sectionId);
  if (!section) return [];
  return [...section.lessons, section.assessment];
};

/**
 * Get the total number of lessons (excluding assessments)
 */
export const getTotalLessonCount = (): number => {
  return EAR_SCHOOL_CURRICULUM.sections.reduce((sum, section) => sum + section.lessons.length, 0);
};
