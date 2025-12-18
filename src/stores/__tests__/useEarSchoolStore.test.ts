/**
 * Ear School Store Tests
 *
 * Tests for useEarSchoolStore state management.
 * Note: Database operations are mocked.
 */

import { useEarSchoolStore } from '../useEarSchoolStore';
import { EarSchoolLessonDef, EarSchoolQuestion } from '../../types/ear-school';

// Mock the ear school service
jest.mock('../../services/earSchoolService', () => ({
  getLessonProgress: jest.fn().mockResolvedValue(null),
  getAllLessonProgress: jest.fn().mockResolvedValue([]),
  saveLessonResult: jest.fn().mockResolvedValue(undefined),
  getSectionProgress: jest.fn().mockResolvedValue(null),
  getAllSectionProgress: jest.fn().mockResolvedValue([]),
  updateSectionProgress: jest.fn().mockResolvedValue(undefined),
  getAdaptiveState: jest.fn().mockResolvedValue({
    enabled: true,
    globalChallengeMode: false,
    acedStreak: 0,
    lastScoreBelow85At: null,
  }),
  updateAdaptiveState: jest.fn().mockResolvedValue(undefined),
  setAdaptiveEnabled: jest.fn().mockResolvedValue(undefined),
  saveAttempt: jest.fn().mockResolvedValue(undefined),
  getOverallProgress: jest.fn().mockResolvedValue({
    lessonsPassed: 0,
    totalLessons: 14,
    sectionsCompleted: 0,
    totalSections: 4,
    completionPercentage: 0,
    nextLessonId: 'ear-school-1.1',
  }),
  setLessonChallengeMode: jest.fn().mockResolvedValue(undefined),
}));

// Mock useXPStore
jest.mock('../useXPStore', () => ({
  useXPStore: {
    getState: () => ({
      awardEarSchoolLesson: jest.fn(),
    }),
  },
}));

// Create a mock lesson for testing
const createMockLesson = (id: string = 'ear-school-1.1'): EarSchoolLessonDef => ({
  id,
  sectionId: 'ear-school-section-1',
  sectionNumber: 1,
  lessonNumber: 1,
  title: 'Test Lesson',
  subtitle: 'Test subtitle',
  concept: 'Test concept',
  exerciseType: 'scale-degree-id',
  keyPool: ['C major', 'G major'],
  questionCount: 3,
  passThreshold: 70,
  isAssessment: false,
  generateQuestion: (): EarSchoolQuestion => ({
    id: `q-${Date.now()}`,
    type: 'scale-degree-id',
    prompt: 'What scale degree is this?',
    key: 'C major',
    audioParams: { key: 'C major', scaleDegrees: [1], playContext: true },
    options: [
      { id: 'degree-1', label: '1', value: '1' },
      { id: 'degree-2', label: '2', value: '2' },
      { id: 'degree-3', label: '3', value: '3' },
    ],
    correctAnswerId: 'degree-1',
  }),
});

describe('useEarSchoolStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useEarSchoolStore.setState({
      session: null,
      lessonProgress: new Map(),
      sectionProgress: new Map(),
      adaptiveState: {
        enabled: true,
        globalChallengeMode: false,
        acedStreak: 0,
        lastScoreBelow85At: null,
      },
      overallProgress: null,
      isLoading: false,
      lastResult: null,
    });
  });

  describe('initial state', () => {
    it('should start with no session', () => {
      const { session } = useEarSchoolStore.getState();
      expect(session).toBeNull();
    });

    it('should start with empty progress maps', () => {
      const { lessonProgress, sectionProgress } = useEarSchoolStore.getState();
      expect(lessonProgress.size).toBe(0);
      expect(sectionProgress.size).toBe(0);
    });

    it('should start with adaptive enabled', () => {
      const { adaptiveState } = useEarSchoolStore.getState();
      expect(adaptiveState.enabled).toBe(true);
      expect(adaptiveState.globalChallengeMode).toBe(false);
    });

    it('should not be loading initially', () => {
      const { isLoading } = useEarSchoolStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('startLesson', () => {
    it('should create a new session', async () => {
      const lesson = createMockLesson();
      await useEarSchoolStore.getState().startLesson(lesson);

      const { session } = useEarSchoolStore.getState();
      expect(session).not.toBeNull();
      expect(session?.lessonId).toBe('ear-school-1.1');
      expect(session?.state).toBe('ready');
    });

    it('should generate questions for the session', async () => {
      const lesson = createMockLesson();
      await useEarSchoolStore.getState().startLesson(lesson);

      const { session } = useEarSchoolStore.getState();
      expect(session?.questions.length).toBe(lesson.questionCount);
    });

    it('should initialize with zero correct answers', async () => {
      const lesson = createMockLesson();
      await useEarSchoolStore.getState().startLesson(lesson);

      const { session } = useEarSchoolStore.getState();
      expect(session?.currentIndex).toBe(0);
      expect(session?.answers.length).toBe(0);
    });
  });

  describe('playQuestion', () => {
    it('should transition state to playing', async () => {
      const lesson = createMockLesson();
      await useEarSchoolStore.getState().startLesson(lesson);

      useEarSchoolStore.getState().playQuestion();

      const { session } = useEarSchoolStore.getState();
      expect(session?.state).toBe('playing');
    });
  });

  describe('cancelSession', () => {
    it('should clear the session', async () => {
      const lesson = createMockLesson();
      await useEarSchoolStore.getState().startLesson(lesson);

      useEarSchoolStore.getState().cancelSession();

      const { session } = useEarSchoolStore.getState();
      expect(session).toBeNull();
    });
  });

  describe('getCurrentQuestion', () => {
    it('should return null when no session', () => {
      const question = useEarSchoolStore.getState().getCurrentQuestion();
      expect(question).toBeNull();
    });

    it('should return current question when session active', async () => {
      const lesson = createMockLesson();
      await useEarSchoolStore.getState().startLesson(lesson);

      const question = useEarSchoolStore.getState().getCurrentQuestion();
      expect(question).not.toBeNull();
      expect(question?.type).toBe('scale-degree-id');
    });
  });

  describe('getSessionProgress', () => {
    it('should return zeros when no session', () => {
      const progress = useEarSchoolStore.getState().getSessionProgress();
      expect(progress.current).toBe(0);
      expect(progress.total).toBe(0);
    });

    it('should return correct progress during session', async () => {
      const lesson = createMockLesson();
      await useEarSchoolStore.getState().startLesson(lesson);

      const progress = useEarSchoolStore.getState().getSessionProgress();
      expect(progress.current).toBe(1); // 1-indexed display
      expect(progress.total).toBe(3);
    });
  });

  describe('isLessonPassed', () => {
    it('should return false for unknown lesson', () => {
      const passed = useEarSchoolStore.getState().isLessonPassed('unknown-id');
      expect(passed).toBe(false);
    });

    it('should return true when lesson is in progress map as passed', () => {
      useEarSchoolStore.setState({
        lessonProgress: new Map([
          ['ear-school-1.1', {
            lessonId: 'ear-school-1.1',
            attempts: 1,
            bestScore: 80,
            passed: true,
            mastered: false,
            aced: false,
            challengeMode: false,
            firstPassedAt: new Date().toISOString(),
            lastAttemptAt: new Date().toISOString(),
          }],
        ]),
      });

      const passed = useEarSchoolStore.getState().isLessonPassed('ear-school-1.1');
      expect(passed).toBe(true);
    });
  });

  describe('isSectionCompleted', () => {
    it('should return false for unknown section', () => {
      const completed = useEarSchoolStore.getState().isSectionCompleted('unknown-id');
      expect(completed).toBe(false);
    });

    it('should return true when section is marked completed', () => {
      useEarSchoolStore.setState({
        sectionProgress: new Map([
          ['ear-school-section-1', {
            sectionId: 'ear-school-section-1',
            lessonsPassed: 4,
            assessmentScore: 85,
            challengeModeActive: false,
            completedAt: new Date().toISOString(),
          }],
        ]),
      });

      const completed = useEarSchoolStore.getState().isSectionCompleted('ear-school-section-1');
      expect(completed).toBe(true);
    });
  });

  describe('shouldShowChallengeMode', () => {
    it('should return false when adaptive is disabled', () => {
      useEarSchoolStore.setState({
        adaptiveState: {
          enabled: false,
          globalChallengeMode: false,
          acedStreak: 0,
          lastScoreBelow85At: null,
        },
      });

      const shouldShow = useEarSchoolStore.getState().shouldShowChallengeMode('ear-school-1.1');
      expect(shouldShow).toBe(false);
    });

    it('should return true when global challenge mode is active', () => {
      useEarSchoolStore.setState({
        adaptiveState: {
          enabled: true,
          globalChallengeMode: true,
          acedStreak: 3,
          lastScoreBelow85At: null,
        },
      });

      const shouldShow = useEarSchoolStore.getState().shouldShowChallengeMode('ear-school-1.1');
      expect(shouldShow).toBe(true);
    });

    it('should return true when lesson has challenge mode flag', () => {
      useEarSchoolStore.setState({
        adaptiveState: {
          enabled: true,
          globalChallengeMode: false,
          acedStreak: 0,
          lastScoreBelow85At: null,
        },
        lessonProgress: new Map([
          ['ear-school-1.2', {
            lessonId: 'ear-school-1.2',
            attempts: 0,
            bestScore: 0,
            passed: false,
            mastered: false,
            aced: false,
            challengeMode: true,
            firstPassedAt: null,
            lastAttemptAt: null,
          }],
        ]),
      });

      const shouldShow = useEarSchoolStore.getState().shouldShowChallengeMode('ear-school-1.2');
      expect(shouldShow).toBe(true);
    });
  });
});
