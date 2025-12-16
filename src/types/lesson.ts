/**
 * Lesson Type Definitions
 *
 * Types for Music School lessons, blocks, and tracks.
 */

/**
 * Track identifiers for Music School
 */
export type TrackId = 'foundations' | 'intervals' | 'scales-keys' | 'chords';

/**
 * Track definition with metadata
 */
export interface Track {
  id: TrackId;
  title: string;
  description: string;
  color: string;
  icon: string;
  levelCount: number;
}

/**
 * Block types for interactive lesson content
 */
export type BlockType =
  | 'text-audio'
  | 'audio-quiz'
  | 'visual-quiz'
  | 'drag-drop'
  | 'tap-build'
  | 'sorting'
  | 'fill-blank';

/**
 * Text-Audio Block: Educational content with optional audio playback
 * Not graded - just informational
 */
export interface TextAudioContent {
  text: string;
  audioType?: 'note' | 'interval' | 'chord' | 'scale';
  audioData?: {
    notes?: number[]; // MIDI notes
    chordType?: string;
    scaleType?: string;
    rootNote?: number;
    noteDuration?: number; // Duration for each note in seconds (for tempo control)
    velocity?: number; // Velocity/volume from 0.0 to 1.0 (for dynamics)
  };
}

/**
 * Audio Quiz Block: Play audio, select correct answer
 */
export interface AudioQuizContent {
  question: string;
  audioType: 'note' | 'interval' | 'chord' | 'scale';
  audioData: {
    notes?: number[];
    chordType?: string;
    scaleType?: string;
    rootNote?: number;
    noteDuration?: number; // Duration for each note in seconds (for tempo control)
    velocity?: number; // Velocity/volume from 0.0 to 1.0 (for dynamics)
  };
  options: string[];
  correctIndex: number;
  explanation?: string;
}

/**
 * Visual Quiz Block: Show notation/diagram, select correct answer
 */
export interface VisualQuizContent {
  question: string;
  visualType: 'staff' | 'keyboard' | 'diagram';
  visualData: {
    notes?: number[]; // For staff/keyboard display
    clef?: 'treble' | 'bass';
    keySignature?: string;
    imageUrl?: string; // For custom diagrams
  };
  options: string[];
  correctIndex: number;
  explanation?: string;
}

/**
 * Drag-Drop Block: Drag items to correct target zones
 */
export interface DragDropContent {
  instruction: string;
  items: {
    id: string;
    label: string;
    correctZone: string;
  }[];
  zones: {
    id: string;
    label: string;
  }[];
  explanation?: string;
}

/**
 * Tap-Build Block: Build answer by tapping piano keys or selecting notes
 */
export interface TapBuildContent {
  instruction: string;
  targetType: 'notes' | 'interval' | 'chord' | 'scale';
  expectedNotes: number[]; // MIDI notes in order
  startNote?: number; // Starting note for keyboard display
  endNote?: number; // Ending note for keyboard display
  showLabels?: boolean;
  playReference?: boolean; // Play target audio first?
  explanation?: string;
}

/**
 * Sorting Block: Arrange items in correct order
 */
export interface SortingContent {
  instruction: string;
  items: {
    id: string;
    label: string;
    correctPosition: number;
  }[];
  explanation?: string;
}

/**
 * Fill-Blank Block: Complete text by selecting correct options for blanks
 */
export interface FillBlankContent {
  textWithBlanks: string; // Use {{0}}, {{1}}, etc. for blanks
  blanks: {
    options: string[];
    correctIndex: number;
  }[];
  explanation?: string;
}

/**
 * Union type for all block content types
 */
export type BlockContent =
  | { type: 'text-audio'; data: TextAudioContent }
  | { type: 'audio-quiz'; data: AudioQuizContent }
  | { type: 'visual-quiz'; data: VisualQuizContent }
  | { type: 'drag-drop'; data: DragDropContent }
  | { type: 'tap-build'; data: TapBuildContent }
  | { type: 'sorting'; data: SortingContent }
  | { type: 'fill-blank'; data: FillBlankContent };

/**
 * Lesson block - individual interactive element within a lesson
 */
export interface LessonBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
}

/**
 * Unlock definition for cross-module integration
 */
export interface UnlockDef {
  type: 'intervals' | 'scale-degrees' | 'chords';
  item: string;
}

/**
 * Lesson definition
 */
export interface Lesson {
  id: string;
  trackId: TrackId;
  levelIndex: number;
  lessonIndex: number;
  title: string;
  description: string;
  blocks: LessonBlock[];
  xpReward: number;
  unlocks?: UnlockDef[];
}

/**
 * Lesson progress state (from database)
 */
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  blocksCompleted: number;
  firstCompletedAt?: Date;
  lastAccessedAt?: Date;
}

/**
 * Block attempt result
 */
export interface BlockAttempt {
  blockId: string;
  correct: boolean;
  attempts: number;
  firstTry: boolean;
}

/**
 * Lesson session state
 */
export type LessonState =
  | 'ready'
  | 'playing'
  | 'answering'
  | 'feedback'
  | 'complete';

/**
 * Track definitions
 */
export const TRACKS: Track[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    description: 'Music basics: notes, rhythm, and reading fundamentals',
    color: '#4CAF50',
    icon: 'book',
    levelCount: 3,
  },
  {
    id: 'intervals',
    title: 'Intervals',
    description: 'Learn to identify and build intervals between notes',
    color: '#2196F3',
    icon: 'trending-up',
    levelCount: 3,
  },
  {
    id: 'scales-keys',
    title: 'Scales & Keys',
    description: 'Major and minor scales, key signatures, and modes',
    color: '#9C27B0',
    icon: 'layers',
    levelCount: 3,
  },
  {
    id: 'chords',
    title: 'Chords',
    description: 'Build and identify triads, seventh chords, and progressions',
    color: '#FF9800',
    icon: 'grid',
    levelCount: 3,
  },
];

/**
 * Get track by ID
 */
export function getTrackById(trackId: TrackId): Track | undefined {
  return TRACKS.find((t) => t.id === trackId);
}

/**
 * Check if a block type requires grading
 */
export function isGradedBlock(type: BlockType): boolean {
  return type !== 'text-audio';
}
