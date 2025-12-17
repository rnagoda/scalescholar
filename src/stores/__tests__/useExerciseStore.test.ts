/**
 * Exercise Store Tests
 *
 * Tests for the interval exercise session management store.
 */

import { useExerciseStore } from '../useExerciseStore';
import { Interval, STARTER_INTERVALS } from '../../utils/music';

describe('useExerciseStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useExerciseStore.getState().resetSession();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useExerciseStore.getState();

      expect(state.state).toBe('ready');
      expect(state.currentQuestion).toBeNull();
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.answers).toEqual([]);
      expect(state.sessionResults).toBeNull();
      expect(state.sessionStartTime).toBeNull();
    });

    it('should have default config', () => {
      const { config } = useExerciseStore.getState();

      expect(config.questionCount).toBe(10);
      expect(config.availableIntervals).toEqual(STARTER_INTERVALS);
      expect(config.ascending).toBe(true);
      expect(config.descending).toBe(false);
      expect(config.melodic).toBe(true);
      expect(config.harmonic).toBe(false);
      expect(config.minMidi).toBe(48);
      expect(config.maxMidi).toBe(72);
    });
  });

  describe('startSession', () => {
    it('should start a new session with default config', () => {
      useExerciseStore.getState().startSession();
      const state = useExerciseStore.getState();

      expect(state.state).toBe('ready');
      expect(state.currentQuestion).not.toBeNull();
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.answers).toEqual([]);
      expect(state.sessionStartTime).not.toBeNull();
    });

    it('should generate a valid first question', () => {
      useExerciseStore.getState().startSession();
      const { currentQuestion, config } = useExerciseStore.getState();

      expect(currentQuestion).not.toBeNull();
      expect(currentQuestion!.id).toBeDefined();
      expect(config.availableIntervals).toContain(currentQuestion!.interval);
      expect(currentQuestion!.rootMidi).toBeGreaterThanOrEqual(config.minMidi);
      expect(currentQuestion!.rootMidi).toBeLessThanOrEqual(config.maxMidi);
    });

    it('should accept custom config overrides', () => {
      useExerciseStore.getState().startSession({
        questionCount: 5,
        descending: true,
        harmonic: true,
      });

      const { config } = useExerciseStore.getState();

      expect(config.questionCount).toBe(5);
      expect(config.descending).toBe(true);
      expect(config.harmonic).toBe(true);
      // Non-overridden values should remain default
      expect(config.ascending).toBe(true);
    });

    it('should accept custom available intervals', () => {
      const customIntervals = [Interval.PERFECT_FIFTH, Interval.OCTAVE];
      useExerciseStore.getState().startSession({
        availableIntervals: customIntervals,
      });

      const { currentQuestion } = useExerciseStore.getState();
      expect(customIntervals).toContain(currentQuestion!.interval);
    });
  });

  describe('state transitions', () => {
    beforeEach(() => {
      useExerciseStore.getState().startSession();
    });

    it('should transition to playing state', () => {
      useExerciseStore.getState().setPlaying();
      expect(useExerciseStore.getState().state).toBe('playing');
    });

    it('should transition to answering state', () => {
      useExerciseStore.getState().setAnswering();
      expect(useExerciseStore.getState().state).toBe('answering');
    });
  });

  describe('submitAnswer', () => {
    beforeEach(() => {
      useExerciseStore.getState().startSession({
        availableIntervals: [Interval.PERFECT_FIFTH],
      });
    });

    it('should return true for correct answer', () => {
      const { currentQuestion } = useExerciseStore.getState();
      const result = useExerciseStore.getState().submitAnswer(currentQuestion!.interval);

      expect(result).toBe(true);
    });

    it('should return false for incorrect answer', () => {
      const { currentQuestion } = useExerciseStore.getState();
      const wrongInterval =
        currentQuestion!.interval === Interval.PERFECT_FIFTH
          ? Interval.PERFECT_FOURTH
          : Interval.PERFECT_FIFTH;

      const result = useExerciseStore.getState().submitAnswer(wrongInterval);

      expect(result).toBe(false);
    });

    it('should add answer to answers array', () => {
      const { currentQuestion } = useExerciseStore.getState();
      useExerciseStore.getState().submitAnswer(currentQuestion!.interval);

      const { answers } = useExerciseStore.getState();
      expect(answers).toHaveLength(1);
      expect(answers[0].questionId).toBe(currentQuestion!.id);
      expect(answers[0].correct).toBe(true);
    });

    it('should transition to feedback state', () => {
      const { currentQuestion } = useExerciseStore.getState();
      useExerciseStore.getState().submitAnswer(currentQuestion!.interval);

      expect(useExerciseStore.getState().state).toBe('feedback');
    });

    it('should record answer timestamp', () => {
      const before = Date.now();
      const { currentQuestion } = useExerciseStore.getState();
      useExerciseStore.getState().submitAnswer(currentQuestion!.interval);
      const after = Date.now();

      const { answers } = useExerciseStore.getState();
      expect(answers[0].answeredAt).toBeGreaterThanOrEqual(before);
      expect(answers[0].answeredAt).toBeLessThanOrEqual(after);
    });

    it('should return false if no current question', () => {
      useExerciseStore.getState().resetSession();
      const result = useExerciseStore.getState().submitAnswer(Interval.PERFECT_FIFTH);
      expect(result).toBe(false);
    });
  });

  describe('nextQuestion', () => {
    beforeEach(() => {
      useExerciseStore.getState().startSession({ questionCount: 3 });
    });

    it('should advance to next question', () => {
      const firstQuestion = useExerciseStore.getState().currentQuestion;
      useExerciseStore.getState().submitAnswer(firstQuestion!.interval);
      useExerciseStore.getState().nextQuestion();

      const state = useExerciseStore.getState();
      expect(state.currentQuestionIndex).toBe(1);
      expect(state.currentQuestion!.id).not.toBe(firstQuestion!.id);
      expect(state.state).toBe('ready');
    });

    it('should end session after last question', () => {
      // Answer all 3 questions
      for (let i = 0; i < 3; i++) {
        const { currentQuestion } = useExerciseStore.getState();
        useExerciseStore.getState().submitAnswer(currentQuestion!.interval);
        useExerciseStore.getState().nextQuestion();
      }

      const state = useExerciseStore.getState();
      expect(state.state).toBe('complete');
      expect(state.sessionResults).not.toBeNull();
    });
  });

  describe('endSession', () => {
    beforeEach(() => {
      useExerciseStore.getState().startSession({ questionCount: 3 });
    });

    it('should create session results', () => {
      // Answer 2 correct, 1 wrong
      const { currentQuestion: q1 } = useExerciseStore.getState();
      useExerciseStore.getState().submitAnswer(q1!.interval);
      useExerciseStore.getState().nextQuestion();

      const { currentQuestion: q2 } = useExerciseStore.getState();
      useExerciseStore.getState().submitAnswer(q2!.interval);
      useExerciseStore.getState().nextQuestion();

      // Intentionally wrong answer
      useExerciseStore.getState().submitAnswer(Interval.UNISON);
      useExerciseStore.getState().endSession();

      const { sessionResults } = useExerciseStore.getState();
      expect(sessionResults).not.toBeNull();
      expect(sessionResults!.totalQuestions).toBe(3);
      expect(sessionResults!.correctAnswers).toBe(2);
      expect(sessionResults!.answers).toHaveLength(3);
    });

    it('should set state to complete', () => {
      useExerciseStore.getState().endSession();
      expect(useExerciseStore.getState().state).toBe('complete');
    });

    it('should record completion timestamp', () => {
      const before = Date.now();
      useExerciseStore.getState().endSession();
      const after = Date.now();

      const { sessionResults } = useExerciseStore.getState();
      expect(sessionResults!.completedAt).toBeGreaterThanOrEqual(before);
      expect(sessionResults!.completedAt).toBeLessThanOrEqual(after);
    });
  });

  describe('resetSession', () => {
    it('should reset all state to initial values', () => {
      // Set up some state
      useExerciseStore.getState().startSession();
      useExerciseStore.getState().submitAnswer(Interval.PERFECT_FIFTH);
      useExerciseStore.getState().endSession();

      // Reset
      useExerciseStore.getState().resetSession();

      const state = useExerciseStore.getState();
      expect(state.state).toBe('ready');
      expect(state.currentQuestion).toBeNull();
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.answers).toEqual([]);
      expect(state.sessionResults).toBeNull();
      expect(state.sessionStartTime).toBeNull();
    });
  });

  describe('getProgress', () => {
    it('should return correct progress', () => {
      useExerciseStore.getState().startSession({ questionCount: 10 });

      let progress = useExerciseStore.getState().getProgress();
      expect(progress.current).toBe(1);
      expect(progress.total).toBe(10);

      // Advance a few questions
      for (let i = 0; i < 3; i++) {
        const { currentQuestion } = useExerciseStore.getState();
        useExerciseStore.getState().submitAnswer(currentQuestion!.interval);
        useExerciseStore.getState().nextQuestion();
      }

      progress = useExerciseStore.getState().getProgress();
      expect(progress.current).toBe(4);
      expect(progress.total).toBe(10);
    });
  });

  describe('getScore', () => {
    beforeEach(() => {
      useExerciseStore.getState().startSession({ questionCount: 5 });
    });

    it('should return 0 when no answers', () => {
      const score = useExerciseStore.getState().getScore();
      expect(score.correct).toBe(0);
      expect(score.total).toBe(0);
      expect(score.percentage).toBe(0);
    });

    it('should calculate correct percentage', () => {
      // Answer 2 correct, 1 wrong
      const { currentQuestion: q1 } = useExerciseStore.getState();
      useExerciseStore.getState().submitAnswer(q1!.interval);
      useExerciseStore.getState().nextQuestion();

      const { currentQuestion: q2 } = useExerciseStore.getState();
      useExerciseStore.getState().submitAnswer(q2!.interval);
      useExerciseStore.getState().nextQuestion();

      // Wrong answer
      useExerciseStore.getState().submitAnswer(Interval.UNISON);

      const score = useExerciseStore.getState().getScore();
      expect(score.correct).toBe(2);
      expect(score.total).toBe(3);
      expect(score.percentage).toBe(67); // Math.round(2/3 * 100)
    });

    it('should return 100% for all correct', () => {
      const { currentQuestion } = useExerciseStore.getState();
      useExerciseStore.getState().submitAnswer(currentQuestion!.interval);

      const score = useExerciseStore.getState().getScore();
      expect(score.percentage).toBe(100);
    });
  });

  describe('question generation', () => {
    it('should generate questions with ascending direction only when configured', () => {
      useExerciseStore.getState().startSession({
        ascending: true,
        descending: false,
        questionCount: 20,
      });

      // Check multiple questions
      for (let i = 0; i < 10; i++) {
        const { currentQuestion } = useExerciseStore.getState();
        expect(currentQuestion!.ascending).toBe(true);
        useExerciseStore.getState().submitAnswer(currentQuestion!.interval);
        useExerciseStore.getState().nextQuestion();
      }
    });

    it('should generate questions with descending direction only when configured', () => {
      useExerciseStore.getState().startSession({
        ascending: false,
        descending: true,
        questionCount: 20,
      });

      for (let i = 0; i < 10; i++) {
        const { currentQuestion } = useExerciseStore.getState();
        expect(currentQuestion!.ascending).toBe(false);
        useExerciseStore.getState().submitAnswer(currentQuestion!.interval);
        useExerciseStore.getState().nextQuestion();
      }
    });

    it('should generate questions with melodic playback only when configured', () => {
      useExerciseStore.getState().startSession({
        melodic: true,
        harmonic: false,
        questionCount: 20,
      });

      for (let i = 0; i < 10; i++) {
        const { currentQuestion } = useExerciseStore.getState();
        expect(currentQuestion!.melodic).toBe(true);
        useExerciseStore.getState().submitAnswer(currentQuestion!.interval);
        useExerciseStore.getState().nextQuestion();
      }
    });

    it('should generate questions with harmonic playback only when configured', () => {
      useExerciseStore.getState().startSession({
        melodic: false,
        harmonic: true,
        questionCount: 20,
      });

      for (let i = 0; i < 10; i++) {
        const { currentQuestion } = useExerciseStore.getState();
        expect(currentQuestion!.melodic).toBe(false);
        useExerciseStore.getState().submitAnswer(currentQuestion!.interval);
        useExerciseStore.getState().nextQuestion();
      }
    });

    it('should keep root note within MIDI range', () => {
      useExerciseStore.getState().startSession({
        minMidi: 50,
        maxMidi: 60,
        questionCount: 50,
      });

      for (let i = 0; i < 20; i++) {
        const { currentQuestion, config } = useExerciseStore.getState();
        expect(currentQuestion!.rootMidi).toBeGreaterThanOrEqual(config.minMidi);
        expect(currentQuestion!.rootMidi).toBeLessThanOrEqual(config.maxMidi);
        useExerciseStore.getState().submitAnswer(currentQuestion!.interval);
        useExerciseStore.getState().nextQuestion();
      }
    });
  });
});
