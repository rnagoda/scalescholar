/**
 * Lesson Store
 *
 * Zustand store for Music School lesson state management.
 * Implements state machine: ready | playing | answering | feedback | complete
 */

import { create } from 'zustand';
import {
  Lesson,
  LessonBlock,
  LessonState,
  BlockAttempt,
  LessonProgress,
  TrackId,
  isGradedBlock,
} from '../types/lesson';
import {
  getLessonProgress,
  getTrackProgress,
  updateLessonProgress,
  markLessonComplete,
  saveBlockAttempt,
  getBlockAttempts,
} from '../services/lessonService';

interface LessonStoreState {
  // Current lesson data
  currentLesson: Lesson | null;
  currentBlockIndex: number;
  lessonState: LessonState;

  // Block results for current session
  blockAttempts: BlockAttempt[];

  // Selected answer for current block (used during answering state)
  selectedAnswer: unknown | null;

  // Feedback state
  isCorrect: boolean | null;
  showExplanation: boolean;

  // Session statistics
  correctCount: number;
  totalGradedBlocks: number;

  // Loading state
  isLoading: boolean;

  // Actions
  startLesson: (lesson: Lesson) => Promise<void>;
  playAudio: () => void;
  selectAnswer: (answer: unknown) => void;
  submitAnswer: () => Promise<void>;
  nextBlock: () => void;
  completeLesson: () => Promise<void>;
  resetLesson: () => void;

  // Helpers
  getCurrentBlock: () => LessonBlock | null;
  canSubmit: () => boolean;
  getProgress: () => number;
}

const INITIAL_STATE = {
  currentLesson: null,
  currentBlockIndex: 0,
  lessonState: 'ready' as LessonState,
  blockAttempts: [],
  selectedAnswer: null,
  isCorrect: null,
  showExplanation: false,
  correctCount: 0,
  totalGradedBlocks: 0,
  isLoading: false,
};

export const useLessonStore = create<LessonStoreState>((set, get) => ({
  ...INITIAL_STATE,

  startLesson: async (lesson: Lesson) => {
    set({ isLoading: true });

    try {
      // Load any existing progress
      const existingAttempts = await getBlockAttempts(lesson.id);

      // Count graded blocks
      const gradedBlocks = lesson.blocks.filter((b) =>
        isGradedBlock(b.type)
      ).length;

      // Determine starting state based on first block type
      const firstBlock = lesson.blocks[0];
      const initialState: LessonState = firstBlock
        ? isGradedBlock(firstBlock.type)
          ? 'answering'
          : 'playing'
        : 'complete';

      set({
        currentLesson: lesson,
        currentBlockIndex: 0,
        lessonState: initialState,
        blockAttempts: existingAttempts,
        selectedAnswer: null,
        isCorrect: null,
        showExplanation: false,
        correctCount: existingAttempts.filter((a) => a.correct).length,
        totalGradedBlocks: gradedBlocks,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to start lesson:', error);
      set({ isLoading: false });
    }
  },

  playAudio: () => {
    // Transition from playing to answering for text-audio blocks
    const { lessonState } = get();
    if (lessonState === 'playing') {
      set({ lessonState: 'answering' });
    }
  },

  selectAnswer: (answer: unknown) => {
    const { lessonState } = get();
    if (lessonState === 'answering') {
      set({ selectedAnswer: answer });
    }
  },

  submitAnswer: async () => {
    const { currentLesson, currentBlockIndex, selectedAnswer, lessonState } =
      get();

    if (lessonState !== 'answering' || !currentLesson || selectedAnswer === null) {
      return;
    }

    const currentBlock = currentLesson.blocks[currentBlockIndex];
    if (!currentBlock || !isGradedBlock(currentBlock.type)) {
      return;
    }

    // Determine if answer is correct based on block type
    const isCorrect = checkAnswer(currentBlock, selectedAnswer);

    // Save attempt to database
    const attempt = await saveBlockAttempt(
      currentLesson.id,
      currentBlock.id,
      isCorrect
    );

    // Update local state
    set((state) => ({
      lessonState: 'feedback',
      isCorrect,
      blockAttempts: [...state.blockAttempts.filter(a => a.blockId !== currentBlock.id), attempt],
      correctCount: state.correctCount + (isCorrect ? 1 : 0),
    }));

    // Update progress in database
    await updateLessonProgress(
      currentLesson.id,
      currentBlockIndex + 1
    );
  },

  nextBlock: () => {
    const { currentLesson, currentBlockIndex, lessonState } = get();

    if (!currentLesson) return;

    // From feedback state, move to next block or complete
    if (lessonState === 'feedback') {
      const nextIndex = currentBlockIndex + 1;

      if (nextIndex >= currentLesson.blocks.length) {
        // Lesson complete
        set({ lessonState: 'complete' });
      } else {
        // Move to next block
        const nextBlock = currentLesson.blocks[nextIndex];
        const nextState: LessonState = isGradedBlock(nextBlock.type)
          ? 'answering'
          : 'playing';

        set({
          currentBlockIndex: nextIndex,
          lessonState: nextState,
          selectedAnswer: null,
          isCorrect: null,
          showExplanation: false,
        });
      }
    }

    // For text-audio blocks (non-graded), skip directly to next
    if (lessonState === 'playing' || lessonState === 'answering') {
      const currentBlock = currentLesson.blocks[currentBlockIndex];
      if (currentBlock && !isGradedBlock(currentBlock.type)) {
        const nextIndex = currentBlockIndex + 1;

        if (nextIndex >= currentLesson.blocks.length) {
          set({ lessonState: 'complete' });
        } else {
          const nextBlock = currentLesson.blocks[nextIndex];
          const nextState: LessonState = isGradedBlock(nextBlock.type)
            ? 'answering'
            : 'playing';

          set({
            currentBlockIndex: nextIndex,
            lessonState: nextState,
            selectedAnswer: null,
          });
        }
      }
    }
  },

  completeLesson: async () => {
    const { currentLesson } = get();

    if (!currentLesson) return;

    set({ isLoading: true });

    try {
      await markLessonComplete(
        currentLesson.id,
        currentLesson.blocks.length
      );

      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      set({ isLoading: false });
    }
  },

  resetLesson: () => {
    set(INITIAL_STATE);
  },

  getCurrentBlock: () => {
    const { currentLesson, currentBlockIndex } = get();
    if (!currentLesson) return null;
    return currentLesson.blocks[currentBlockIndex] ?? null;
  },

  canSubmit: () => {
    const { lessonState, selectedAnswer } = get();
    return lessonState === 'answering' && selectedAnswer !== null;
  },

  getProgress: () => {
    const { currentLesson, currentBlockIndex } = get();
    if (!currentLesson || currentLesson.blocks.length === 0) return 0;
    return (currentBlockIndex + 1) / currentLesson.blocks.length;
  },
}));

/**
 * Check if the answer is correct based on block type
 */
function checkAnswer(block: LessonBlock, answer: unknown): boolean {
  const content = block.content;

  switch (content.type) {
    case 'audio-quiz':
    case 'visual-quiz':
      return answer === content.data.correctIndex;

    case 'drag-drop': {
      // Answer should be a map of itemId -> zoneId
      const answerMap = answer as Record<string, string>;
      return content.data.items.every(
        (item) => answerMap[item.id] === item.correctZone
      );
    }

    case 'tap-build': {
      // Answer should be an array of MIDI notes
      const answerNotes = answer as number[];
      const expected = content.data.expectedNotes;
      return (
        answerNotes.length === expected.length &&
        answerNotes.every((note, i) => note === expected[i])
      );
    }

    case 'sorting': {
      // Answer should be an array of item IDs in order
      const answerOrder = answer as string[];
      const correctOrder = [...content.data.items]
        .sort((a, b) => a.correctPosition - b.correctPosition)
        .map((item) => item.id);
      return (
        answerOrder.length === correctOrder.length &&
        answerOrder.every((id, i) => id === correctOrder[i])
      );
    }

    case 'fill-blank': {
      // Answer should be an array of selected indices
      const answerIndices = answer as number[];
      return content.data.blanks.every(
        (blank, i) => answerIndices[i] === blank.correctIndex
      );
    }

    default:
      return false;
  }
}
