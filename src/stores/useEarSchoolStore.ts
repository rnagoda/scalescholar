/**
 * Ear School Store
 *
 * Zustand store for Ear School curriculum state management.
 * Handles lesson sessions, progress tracking, and adaptive difficulty.
 */

import { create } from 'zustand';
import {
  EarSchoolLessonDef,
  EarSchoolQuestion,
  EarSchoolSessionState,
  EarSchoolSession,
  EarSchoolSessionResult,
  EarSchoolLessonProgress,
  EarSchoolSectionProgress,
  EarSchoolAdaptiveState,
  EAR_SCHOOL_THRESHOLDS,
  calculateXP,
  CHALLENGE_MODE_CONFIG,
  KEY_POOLS,
} from '../types/ear-school';
import {
  getLessonProgress,
  getAllLessonProgress,
  saveLessonResult,
  getSectionProgress,
  getAllSectionProgress,
  updateSectionProgress,
  getAdaptiveState,
  updateAdaptiveState,
  setAdaptiveEnabled,
  saveAttempt,
  getOverallProgress,
  setLessonChallengeMode,
} from '../services/earSchoolService';
import { useXPStore } from './useXPStore';

interface EarSchoolStoreState {
  // Session state
  session: EarSchoolSession | null;

  // Progress (cached from database)
  lessonProgress: Map<string, EarSchoolLessonProgress>;
  sectionProgress: Map<string, EarSchoolSectionProgress>;
  adaptiveState: EarSchoolAdaptiveState;

  // Overall progress
  overallProgress: {
    lessonsPassed: number;
    totalLessons: number;
    sectionsCompleted: number;
    totalSections: number;
    completionPercentage: number;
    nextLessonId: string | null;
  } | null;

  // Loading state
  isLoading: boolean;

  // Last result (for results screen)
  lastResult: EarSchoolSessionResult | null;

  // Actions - Progress
  loadProgress: () => Promise<void>;
  refreshProgress: () => Promise<void>;

  // Actions - Session
  startLesson: (lesson: EarSchoolLessonDef) => Promise<void>;
  playQuestion: () => void;
  submitAnswer: (answerId: string) => Promise<void>;
  nextQuestion: () => void;
  endSession: () => Promise<EarSchoolSessionResult>;
  cancelSession: () => void;

  // Actions - Adaptive
  toggleAdaptiveDifficulty: (enabled: boolean) => Promise<void>;

  // Helpers
  getCurrentQuestion: () => EarSchoolQuestion | null;
  getSessionProgress: () => { current: number; total: number };
  isLessonPassed: (lessonId: string) => boolean;
  isSectionCompleted: (sectionId: string) => boolean;
  shouldShowChallengeMode: (lessonId: string) => boolean;
}

const INITIAL_STATE = {
  session: null,
  lessonProgress: new Map<string, EarSchoolLessonProgress>(),
  sectionProgress: new Map<string, EarSchoolSectionProgress>(),
  adaptiveState: {
    enabled: true,
    globalChallengeMode: false,
    acedStreak: 0,
    lastScoreBelow85At: null,
  },
  overallProgress: null,
  isLoading: false,
  lastResult: null,
};

export const useEarSchoolStore = create<EarSchoolStoreState>((set, get) => ({
  ...INITIAL_STATE,

  // ============================================================================
  // Progress Loading
  // ============================================================================

  loadProgress: async () => {
    set({ isLoading: true });

    try {
      const [lessons, weeks, adaptive, overall] = await Promise.all([
        getAllLessonProgress(),
        getAllSectionProgress(),
        getAdaptiveState(),
        getOverallProgress(),
      ]);

      const lessonMap = new Map<string, EarSchoolLessonProgress>();
      for (const lesson of lessons) {
        lessonMap.set(lesson.lessonId, lesson);
      }

      const weekMap = new Map<string, EarSchoolSectionProgress>();
      for (const week of weeks) {
        weekMap.set(week.sectionId, week);
      }

      set({
        lessonProgress: lessonMap,
        sectionProgress: weekMap,
        adaptiveState: adaptive,
        overallProgress: overall,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load Ear School progress:', error);
      set({ isLoading: false });
    }
  },

  refreshProgress: async () => {
    await get().loadProgress();
  },

  // ============================================================================
  // Session Management
  // ============================================================================

  startLesson: async (lesson: EarSchoolLessonDef) => {
    set({ isLoading: true });

    try {
      // Check if challenge mode should be active
      const { adaptiveState, lessonProgress } = get();
      const existingProgress = lessonProgress.get(lesson.id);

      let challengeMode = false;
      if (adaptiveState.enabled) {
        // Global challenge mode
        if (adaptiveState.globalChallengeMode) {
          challengeMode = true;
        }
        // Lesson-specific challenge mode (from previous 90%+ score)
        else if (existingProgress?.challengeMode) {
          challengeMode = true;
        }
      }

      // Generate questions
      const questionCount = challengeMode
        ? lesson.questionCount + CHALLENGE_MODE_CONFIG.EXTRA_QUESTIONS
        : lesson.questionCount;

      // Use expanded key pool in challenge mode for more variety
      const keyPool = challengeMode ? KEY_POOLS.ALL_MAJOR : lesson.keyPool;

      const questions: EarSchoolQuestion[] = [];
      for (let i = 0; i < questionCount; i++) {
        const prevQuestion = questions[questions.length - 1];
        const question = lesson.generateQuestion(keyPool, prevQuestion);
        questions.push(question);
      }

      const session: EarSchoolSession = {
        lessonId: lesson.id,
        lesson,
        questions,
        currentIndex: 0,
        answers: [],
        state: 'ready',
        startedAt: new Date().toISOString(),
        challengeMode,
        timerSeconds: challengeMode
          ? lesson.exerciseType.includes('rhythm')
            ? CHALLENGE_MODE_CONFIG.RHYTHM_TIMER_SECONDS
            : CHALLENGE_MODE_CONFIG.PITCH_TIMER_SECONDS
          : undefined,
      };

      set({
        session,
        isLoading: false,
        lastResult: null,
      });
    } catch (error) {
      console.error('Failed to start lesson:', error);
      set({ isLoading: false });
    }
  },

  playQuestion: () => {
    const { session } = get();
    if (!session || session.state !== 'ready') return;

    set({
      session: {
        ...session,
        state: 'playing',
      },
    });

    // After audio plays, transition to answering
    // This would normally be called by the audio completion callback
    // For now, we'll transition immediately (audio component handles timing)
  },

  submitAnswer: async (answerId: string) => {
    const { session } = get();
    if (!session || session.state !== 'answering') return;

    const question = session.questions[session.currentIndex];
    const correct = answerId === question.correctAnswerId;
    const responseTimeMs = Date.now() - new Date(session.startedAt).getTime();

    // Save attempt for analytics
    await saveAttempt({
      lessonId: session.lessonId,
      questionType: question.type,
      key: question.key,
      correct,
      responseTimeMs,
    });

    const newAnswer = {
      questionId: question.id,
      answerId,
      correct,
      responseTimeMs,
    };

    set({
      session: {
        ...session,
        answers: [...session.answers, newAnswer],
        state: 'feedback',
      },
    });
  },

  nextQuestion: () => {
    const { session } = get();
    if (!session || session.state !== 'feedback') return;

    const nextIndex = session.currentIndex + 1;

    if (nextIndex >= session.questions.length) {
      // Session complete
      set({
        session: {
          ...session,
          state: 'complete',
        },
      });
    } else {
      // Move to next question
      set({
        session: {
          ...session,
          currentIndex: nextIndex,
          state: 'ready',
        },
      });
    }
  },

  endSession: async () => {
    const { session, lessonProgress } = get();
    if (!session) {
      throw new Error('No active session');
    }

    set({ isLoading: true });

    try {
      // Calculate results
      const correctAnswers = session.answers.filter((a) => a.correct).length;
      const totalQuestions = session.questions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      const passThreshold = session.challengeMode
        ? EAR_SCHOOL_THRESHOLDS.CHALLENGE_PASS
        : session.lesson.passThreshold;

      const passed = score >= passThreshold;
      const mastered = score >= EAR_SCHOOL_THRESHOLDS.MASTERED;
      const aced = score >= EAR_SCHOOL_THRESHOLDS.ACED;

      // Check if this is first pass
      const existingProgress = lessonProgress.get(session.lessonId);
      const isFirstPass = !existingProgress?.passed && passed;

      const result: EarSchoolSessionResult = {
        lessonId: session.lessonId,
        totalQuestions,
        correctAnswers,
        score,
        passed,
        mastered,
        aced,
        xpAwarded: 0, // Will be calculated
        isFirstPass,
        challengeMode: session.challengeMode,
      };

      // Calculate and award XP
      result.xpAwarded = calculateXP(result);

      if (result.xpAwarded > 0) {
        await useXPStore.getState().awardEarSchoolLesson(
          session.lessonId,
          result.xpAwarded,
          result.passed,
          result.mastered,
          result.aced
        );
      }

      // Save to database
      await saveLessonResult(result);

      // Update adaptive difficulty
      const newAdaptiveState = await updateAdaptiveState(score);

      // If aced, set challenge mode for next lesson in the section
      if (aced && newAdaptiveState.enabled) {
        const sectionNum = session.lesson.sectionNumber;
        const lessonNumber = session.lesson.lessonNumber;
        const nextLessonId = `ear-school-${sectionNum}.${lessonNumber + 1}`;
        await setLessonChallengeMode(nextLessonId, true);
      }

      // Update section progress
      const sectionId = session.lesson.sectionId;
      const allLessons = await getAllLessonProgress();
      const sectionLessonsPassed = allLessons.filter(
        (l) => l.passed && l.lessonId.startsWith(`ear-school-${session.lesson.sectionNumber}.`)
      ).length;

      const assessmentScore = session.lesson.isAssessment ? score : undefined;
      await updateSectionProgress(sectionId, sectionLessonsPassed, assessmentScore);

      // Refresh progress
      await get().loadProgress();

      set({
        session: null,
        lastResult: result,
        isLoading: false,
      });

      return result;
    } catch (error) {
      console.error('Failed to end session:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  cancelSession: () => {
    set({
      session: null,
      lastResult: null,
    });
  },

  // ============================================================================
  // Adaptive Difficulty
  // ============================================================================

  toggleAdaptiveDifficulty: async (enabled: boolean) => {
    await setAdaptiveEnabled(enabled);
    set({
      adaptiveState: {
        ...get().adaptiveState,
        enabled,
      },
    });
  },

  // ============================================================================
  // Helpers
  // ============================================================================

  getCurrentQuestion: () => {
    const { session } = get();
    if (!session) return null;
    return session.questions[session.currentIndex] ?? null;
  },

  getSessionProgress: () => {
    const { session } = get();
    if (!session) return { current: 0, total: 0 };
    return {
      current: session.currentIndex + 1,
      total: session.questions.length,
    };
  },

  isLessonPassed: (lessonId: string) => {
    const { lessonProgress } = get();
    return lessonProgress.get(lessonId)?.passed ?? false;
  },

  isSectionCompleted: (sectionId: string) => {
    const { sectionProgress } = get();
    const progress = sectionProgress.get(sectionId);
    return progress !== undefined && progress.completedAt !== null;
  },

  shouldShowChallengeMode: (lessonId: string) => {
    const { adaptiveState, lessonProgress } = get();
    if (!adaptiveState.enabled) return false;
    if (adaptiveState.globalChallengeMode) return true;
    return lessonProgress.get(lessonId)?.challengeMode ?? false;
  },
}));

// Export a hook to transition session state (called by audio components)
export const useEarSchoolSessionTransition = () => {
  const transitionToAnswering = () => {
    // Get current state directly from store to avoid stale closure
    const currentSession = useEarSchoolStore.getState().session;
    if (currentSession?.state === 'playing') {
      useEarSchoolStore.setState({
        session: {
          ...currentSession,
          state: 'answering',
        },
      });
    }
  };

  return { transitionToAnswering };
};
