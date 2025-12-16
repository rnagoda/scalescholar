# CLAUDE.md — Scale Scholar

## Project Overview

Scale Scholar is a React Native mobile app for iOS and Android that helps musicians train their ear to recognize intervals, scale degrees, and chord qualities. The app uses piano-like synthesized tones and provides immediate feedback through progressive, gamified exercises.

**Target users:** Intermediate musicians wanting to improve their ear training skills.

**Design philosophy:** Minimal, clean, retro terminal aesthetic. Think command-line meets music education. Function over flash, but with personality.

---

## Design System

The visual design is inspired by retro terminal interfaces—dark backgrounds, monospace typography, and bracketed button labels. This creates a distinctive, focused aesthetic that feels both nostalgic and modern.

### Color Palette

```typescript
// theme/colors.ts
export const colors = {
  // Backgrounds
  background: '#121212',        // Main app background
  cardBackground: '#1C1C1E',    // Card/surface background
  cardBorder: '#2C2C2E',        // Subtle card borders
  
  // Text
  textPrimary: '#E5E5E7',       // Primary text (off-white)
  textSecondary: '#8E8E93',     // Secondary/muted text
  textMuted: '#636366',         // Very muted (labels, hints)
  
  // Accents
  accentGreen: '#32D74B',       // Success, correct answers, positive values
  accentPink: '#FF6B6B',        // Attention, incorrect answers, due items
  accentBlue: '#0A84FF',        // Links, interactive elements (use sparingly)
  
  // Progress bar
  progressTrack: '#2C2C2E',     // Empty progress bar
  progressFill: '#32D74B',      // Filled progress bar
  
  // Borders & dividers
  divider: '#2C2C2E',           // Horizontal dividers
  border: '#3A3A3C',            // Input borders, card borders
};
```

### Typography

Use Space Mono throughout for the retro terminal aesthetic. Space Mono is a free Google Font with excellent readability and personality.

**Font setup:** Download Space Mono (Regular 400, Bold 700) from Google Fonts and add to the project's assets.

```typescript
// theme/typography.ts

export const fonts = {
  mono: 'SpaceMono-Regular',
  monoBold: 'SpaceMono-Bold',
};

export const typography = {
  // Screen titles - "INTERVALS", "PROGRESS"
  screenTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 20,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: colors.textPrimary,
  },
  
  // Card titles - "Interval Trainer"
  cardTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  
  // Section headers - "PAYCHECKS", "OTHER INCOME"
  sectionHeader: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    color: colors.textMuted,
  },
  
  // Body text
  body: {
    fontFamily: fonts.mono,
    fontSize: 15,
    color: colors.textPrimary,
  },
  
  // Secondary/label text
  label: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  
  // Large display numbers (scores, stats)
  displayLarge: {
    fontFamily: fonts.monoBold,
    fontSize: 48,
    color: colors.accentGreen,
  },
  
  // Footer/version text
  footer: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center' as const,
  },
};
```

### Spacing Scale

```typescript
// theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};
```

### Signature Component: Bracketed Buttons

The distinctive `[ ACTION ]` button style is key to the retro aesthetic.

```typescript
// Example usage:
<BracketButton label="PLAY" onPress={handlePlay} />
<BracketButton label="SETTINGS" onPress={openSettings} />
<BracketButton label="+ " onPress={handleAdd} />  // For icon-style

// Renders as: [ PLAY ]  [ SETTINGS ]  [ + ]
```

```typescript
// components/common/BracketButton.tsx
const BracketButton: React.FC<Props> = ({ label, onPress, color = colors.textPrimary }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <Text style={[styles.bracket, { color }]}>[ </Text>
    <Text style={[styles.label, { color }]}>{label}</Text>
    <Text style={[styles.bracket, { color }]}> ]</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  bracket: {
    fontFamily: fonts.mono,
    fontSize: 15,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
```

### Card Component

```typescript
// components/common/Card.tsx
const Card: React.FC<Props> = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
});
```

### Layout Patterns

**Header with bracketed actions:**
```
SCREEN TITLE                    [ + ]  [ CLOSE ]
─────────────────────────────────────────────────
```

**Label-value rows (left/right aligned):**
```
Total:                                       $0
Current Streak:                               5
```

**Progress bar:**
```
[████████░░░░░░░░░░░░░░░░░░░░░░]  45%
```

### Component Library Checklist

Build these reusable components first:

- [ ] `BracketButton` — The signature `[ ACTION ]` button
- [ ] `Card` — Container with border and padding
- [ ] `ScreenHeader` — Title + optional bracket buttons
- [ ] `Divider` — Thin horizontal line
- [ ] `ProgressBar` — Simple rectangular progress
- [ ] `LabelValue` — Left label, right-aligned value
- [ ] `SectionHeader` — ALL CAPS muted section title
- [ ] `AnswerButton` — For exercise multiple choice options
- [ ] `PlayButton` — Large, prominent play/replay button
- [ ] `AppFooter` — Version and branding footer

### App Footer

Include a subtle footer on main screens (Home, Progress, Settings) with version and branding:

```typescript
// components/common/AppFooter.tsx
const AppFooter: React.FC = () => (
  <View style={styles.footer}>
    <Text style={typography.footer}>
      v{version}  -  engineered by nagodasoft
    </Text>
  </View>
);
```

Example output: `v1.0.0  -  engineered by nagodasoft`

### Visual Examples for Scale Scholar

**Home Screen:**
```
SCALE SCHOLAR                        [ SETTINGS ]
─────────────────────────────────────────────────

┌─────────────────────────────────────────────┐
│  Interval Trainer                           │
│                                             │
│  Accuracy:                             72%  │
│  Current Streak:                         5  │
│                                             │
│  [████████████░░░░░░░░░]  4/12 unlocked    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Scale Degree Trainer                       │
│                                             │
│  Accuracy:                             --   │
│  Current Streak:                         0  │
│                                             │
│  [██████░░░░░░░░░░░░░░░]  3/7 unlocked     │
└─────────────────────────────────────────────┘
```

**Exercise Screen:**
```
INTERVALS                             [ CLOSE ]
─────────────────────────────────────────────────
                    5 / 10

             ┌─────────────────┐
             │                 │
             │       ▶         │
             │                 │
             └─────────────────┘
               [ REPLAY ]

┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│   m3    │  │   M3    │  │   P4    │  │   P5    │
└─────────┘  └─────────┘  └─────────┘  └─────────┘
```

**Feedback State (Correct):**
```
             ┌─────────────────┐
             │    ✓ P5         │
             │   Correct!      │
             └─────────────────┘
               [ NEXT ]
```

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | React Native with Expo | Expo managed workflow for faster development |
| Audio | react-native-audio-api | Web Audio API for React Native, supports synthesis and recording |
| Navigation | Expo Router | File-based routing built on React Navigation |
| State | Zustand | Keep stores small and focused |
| Storage | AsyncStorage | Settings, simple preferences |
| Database | expo-sqlite | Exercise history, statistics |
| Testing | Jest + React Native Testing Library | Unit + component tests |
| Language | TypeScript | Strict mode enabled |

## Project Structure

```
app/                        # Expo Router file-based routing
├── (tabs)/                 # Tab navigator group
│   ├── _layout.tsx         # Tab layout configuration
│   ├── index.tsx           # Home screen (default tab)
│   ├── progress.tsx        # Progress screen
│   └── settings.tsx        # Settings screen
├── exercise/               # Exercise screens (stack)
│   ├── music-school/       # Music School lesson player
│   ├── intervals.tsx       # Interval trainer
│   ├── scale-degrees.tsx   # Scale degree trainer
│   ├── chords.tsx          # Chord quality trainer
│   └── pitch-detector.tsx  # Pitch detector tool
├── _layout.tsx             # Root layout
└── +not-found.tsx          # 404 screen
src/
├── components/
│   ├── common/             # Reusable UI (BracketButton, Card, etc.)
│   ├── exercises/          # Ear School exercise components
│   └── lessons/            # Music School lesson components
│       ├── blocks/         # Block type components (audio-quiz, etc.)
│       └── shared/         # Shared components (PianoKeyboard, etc.)
├── content/
│   └── lessons/            # 48 lesson content files
│       ├── foundations/    # Track 1: Pitch, rhythm, expression
│       ├── intervals/      # Track 2: All 12 intervals
│       ├── scales-keys/    # Track 3: Major/minor scales and keys
│       └── chords/         # Track 4: Triads and 7th chords
├── audio/                  # Audio engine and synthesis
│   ├── AudioEngine.ts      # Main audio controller
│   └── synths/             # Instrument synthesizers
│       ├── SineSynth.ts
│       ├── PianoSynth.ts
│       └── SampledPianoSynth.ts
├── stores/                 # Zustand stores
│   ├── useSettingsStore.ts
│   ├── useProgressStore.ts
│   ├── useLessonStore.ts
│   └── useXPStore.ts
├── services/               # Database, business logic
│   ├── database.ts
│   ├── lessonService.ts
│   └── xpService.ts
├── utils/                  # Helper functions
│   └── music.ts            # Music theory utilities
├── types/                  # TypeScript type definitions
└── theme/                  # Colors, typography, spacing
```

## Important Design Decisions

### No UI Sound Effects (MVP)

Correct/incorrect feedback is **visual only** — no chimes or sound effects. This avoids interfering with the user's ear training focus. Sound effects may be added as a user preference post-MVP.

### Font: Space Mono

The app uses Space Mono (Google Fonts, free) for all text. This gives the retro terminal aesthetic more personality than system monospace fonts.

---

## Key Architecture Decisions

### Audio Engine

The audio engine is the core of the app. Key principles:

1. **Singleton pattern** — One AudioEngine instance manages all audio context
2. **Instrument abstraction** — Synths implement a common interface for swappability
3. **Lazy initialization** — Audio context created on first user interaction (required by browsers/mobile)
4. **Clean envelope** — All notes use ADSR envelope to prevent clicks/pops

```typescript
// Example interface for synthesizers
interface Synthesizer {
  playNote(frequency: number, duration: number): void;
  playChord(frequencies: number[], duration: number): void;
  stop(): void;
}
```

### Music Theory Utilities

Keep music calculations in `src/utils/music.ts`:

```typescript
// Core functions needed:
midiToFrequency(midiNote: number, a4Freq?: number): number
noteNameToMidi(noteName: string): number
getIntervalName(semitones: number): string
getScaleDegreeName(degree: number, useSolfege: boolean): string
generateMajorScale(rootMidi: number): number[]
```

### State Management

Use separate Zustand stores for different concerns:

- **useSettingsStore** — User preferences (persisted to AsyncStorage)
- **useProgressStore** — Unlocks, streaks, stats (persisted to SQLite)
- **useExerciseStore** — Current exercise session state (ephemeral)

### Exercise Flow State Machine

Each exercise follows this state pattern:

```
READY → PLAYING → ANSWERING → FEEDBACK → READY (next question)
                                      → COMPLETE (session done)
```

Implement as a simple state machine or useReducer, not scattered useState calls.

## Code Style Guidelines

### TypeScript

- Strict mode enabled, no `any` unless absolutely necessary
- Prefer interfaces over types for object shapes
- Use enums for fixed sets (intervals, chord types, etc.)
- Explicit return types on functions

### React Components

- Functional components only
- Custom hooks for reusable logic (prefix with `use`)
- Keep components focused — if it's over 150 lines, consider splitting
- Colocate styles with components using StyleSheet.create()

### Naming Conventions

- **Files:** PascalCase for components (`IntervalTrainer.tsx`), camelCase for utilities (`music.ts`)
- **Components:** PascalCase (`ExerciseCard`)
- **Functions/variables:** camelCase (`calculateFrequency`)
- **Constants:** SCREAMING_SNAKE_CASE (`DEFAULT_A4_FREQUENCY`)
- **Types/Interfaces:** PascalCase with prefix (`IExerciseState`, `TInterval`)

### Styling

- **Always use the design system** — Import from `src/theme/`, never hardcode colors, fonts, or spacing
- StyleSheet.create() for all styles, no inline style objects
- Follow the spacing scale: 4, 8, 12, 16, 24, 32, 48
- Border radius: 4 (subtle), 8 (standard cards), 12 (prominent)
- Use the monospace font family for ALL text — this is essential to the retro aesthetic
- ALL CAPS with letter-spacing for headers and section titles
- Bracketed buttons `[ ACTION ]` for all actions — this is the signature UI element

---

## SOLID Design Principles

Apply SOLID principles throughout the codebase to ensure maintainable, testable, and extensible code.

### Single Responsibility Principle (SRP)

Each class, module, or function should have one reason to change.

- **Components** — A component renders UI; it doesn't fetch data or manage complex business logic
- **Stores** — Each Zustand store manages one domain (settings, progress, exercise state)
- **Services** — Separate database operations from business logic
- **Hooks** — Extract reusable logic into focused custom hooks

```typescript
// Bad: Component doing too much
const ExerciseScreen = () => {
  // Fetches data, manages state, calculates scores, renders UI...
};

// Good: Separated concerns
const ExerciseScreen = () => {
  const { question, submitAnswer } = useExerciseSession();
  const { playInterval } = useAudioPlayer();
  return <ExerciseUI question={question} onAnswer={submitAnswer} onPlay={playInterval} />;
};
```

### Open/Closed Principle (OCP)

Software entities should be open for extension but closed for modification.

- **Synthesizers** — New instrument types implement the `Synthesizer` interface without modifying existing code
- **Exercise types** — Add new trainers by implementing a common exercise interface
- **Question generators** — Extend with new question types without changing the core engine

```typescript
// Adding a new synth doesn't require modifying AudioEngine
class OrganSynth implements Synthesizer {
  playNote(frequency: number, duration: number): void { /* ... */ }
  playChord(frequencies: number[], duration: number): void { /* ... */ }
  stop(): void { /* ... */ }
}
```

### Liskov Substitution Principle (LSP)

Subtypes must be substitutable for their base types without altering correctness.

- All synthesizers must behave consistently when called through the `Synthesizer` interface
- All exercise types must work with the common exercise flow state machine
- Derived components must accept and handle all props their parent type declares

### Interface Segregation Principle (ISP)

Clients should not be forced to depend on interfaces they don't use.

- **Small, focused interfaces** — Don't create monolithic interfaces with methods some implementations don't need
- **Props interfaces** — Components should only require the props they actually use
- **Store slices** — Use Zustand selectors to subscribe only to needed state

```typescript
// Bad: Forcing components to handle unused props
interface ExerciseProps {
  question: Question;
  onAnswer: (answer: string) => void;
  onSkip: () => void;  // Not all exercises support skipping
  onHint: () => void;  // Not all exercises have hints
}

// Good: Compose smaller interfaces
interface BaseExerciseProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

interface SkippableExerciseProps extends BaseExerciseProps {
  onSkip: () => void;
}
```

### Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules; both should depend on abstractions.

- **Audio engine** — Depends on the `Synthesizer` interface, not concrete synth implementations
- **Services** — Accept database interface, not direct SQLite calls (enables testing with mocks)
- **Components** — Receive dependencies via props or hooks, not direct imports of implementations

```typescript
// Bad: Direct dependency on implementation
import { SQLiteDatabase } from 'expo-sqlite';
const saveProgress = (db: SQLiteDatabase, data: Progress) => { /* ... */ };

// Good: Depend on abstraction
interface ProgressRepository {
  save(data: Progress): Promise<void>;
  load(): Promise<Progress>;
}
const saveProgress = (repo: ProgressRepository, data: Progress) => repo.save(data);
```

### Applying SOLID in Practice

When writing new code or refactoring, ask:

1. **SRP** — Does this module have more than one reason to change?
2. **OCP** — Can I add new behavior without modifying existing code?
3. **LSP** — Can any implementation of this interface be used interchangeably?
4. **ISP** — Am I forcing consumers to depend on things they don't need?
5. **DIP** — Am I depending on concrete implementations instead of abstractions?

---

## Important Patterns

### Audio Playback

Always wrap audio operations in try-catch and ensure cleanup:

```typescript
const playInterval = async (note1: number, note2: number) => {
  try {
    await audioEngine.playNote(note1, 0.8);
    await delay(900); // slight gap between notes
    await audioEngine.playNote(note2, 0.8);
  } catch (error) {
    console.error('Audio playback failed:', error);
    // Handle gracefully — don't crash the app
  }
};
```

### Exercise Question Generation

Randomize within constraints, but prevent:
- Same question twice in a row
- Questions that are too similar consecutively
- Always include the correct answer in options
- Shuffle option order

```typescript
// Good pattern
const generateQuestion = (availableIntervals: Interval[], lastQuestion?: Question): Question => {
  let newQuestion: Question;
  do {
    newQuestion = createRandomQuestion(availableIntervals);
  } while (lastQuestion && isTooSimilar(newQuestion, lastQuestion));
  return newQuestion;
};
```

### Progress Persistence

Debounce writes to database — don't write on every single answer:

```typescript
// Write after session completes, not after each question
const completeSession = async (results: SessionResults) => {
  await progressService.saveSession(results);
  await progressStore.refresh();
};
```

## Things to Avoid

1. **Don't create audio context on app load** — Must be triggered by user interaction

2. **Don't hardcode frequencies** — Always calculate from MIDI numbers using the user's A4 reference

3. **Don't block the UI during audio** — Audio operations should never freeze interactions

4. **Don't store exercise history in AsyncStorage** — Use SQLite for queryable data

5. **Don't skip TypeScript types** — This codebase should be fully typed

6. **Don't use magic numbers** — Define constants for intervals, scale degrees, timing values

7. **Don't eject from Expo** — Stay in managed workflow unless absolutely necessary

---

## Git Workflow

Follow a disciplined git workflow to maintain code quality and project history.

### Branch Strategy

**NEVER push directly to `main`. NEVER.** This includes documentation, small fixes, "quick changes" — everything. All changes to main happen through merged pull requests after testing and review.

All work happens on feature branches:

```bash
# Branch naming conventions
feature/interval-trainer      # New features
fix/audio-click-on-stop       # Bug fixes
refactor/extract-audio-hooks  # Code improvements
docs/update-readme            # Documentation updates
chore/upgrade-dependencies    # Maintenance tasks
```

### Workflow Steps

1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make atomic commits** with clear, descriptive messages:
   ```bash
   # Good commit messages
   git commit -m "Add interval playback to AudioEngine"
   git commit -m "Fix memory leak in synthesizer cleanup"
   git commit -m "Refactor question generator for testability"

   # Bad commit messages
   git commit -m "WIP"
   git commit -m "fixes"
   git commit -m "stuff"
   ```

3. **Push and create a pull request** for review:
   ```bash
   git push -u origin feature/your-feature-name
   # Then create PR via GitHub
   ```

4. **Merge via pull request** after testing and review — this is the ONLY way code gets into main

### Commit Message Format

Use conventional commit style for clarity:

```
<type>: <short summary>

[optional body with more detail]

[optional footer with breaking changes, issue references]
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`

Examples:
```
feat: Add scale degree trainer exercise type

Implements the core exercise flow for identifying scale degrees
within a major scale context. Includes melodic and harmonic modes.

Closes #42
```

```
fix: Prevent audio context creation before user interaction

iOS Safari requires user gesture before AudioContext can be created.
Defer initialization to first play button tap.
```

### Documentation Requirements

Keep documentation current as the project evolves:

- **README.md** — Project overview, setup instructions, and quick start guide
- **CLAUDE.md** — Development guidelines, architecture decisions, and patterns
- **ROADMAP.md** — Current project status, planned features, and priorities

### Roadmap Maintenance

Maintain `ROADMAP.md` at the project root with:

1. **Current milestone** — What we're working on now
2. **Completed milestones** — What's been shipped
3. **Upcoming milestones** — What's planned next
4. **Backlog** — Ideas and future possibilities

Update the roadmap when:
- Starting work on a new feature
- Completing a milestone
- Reprioritizing based on learnings
- Adding new feature ideas

Example structure:
```markdown
# Scale Scholar Roadmap

## Current: v0.1.0 — Foundation
- [x] Project setup and configuration
- [x] Design system implementation
- [ ] Audio engine core
- [ ] Interval trainer MVP

## Next: v0.2.0 — Core Trainers
- [ ] Scale degree trainer
- [ ] Progress tracking
- [ ] Settings screen

## Future
- Chord quality trainer
- Custom practice sessions
- Statistics and insights
```

### Pull Request Checklist

Before requesting review:

- [ ] Code follows style guidelines and SOLID principles
- [ ] TypeScript compiles with no errors
- [ ] Tests pass (if applicable)
- [ ] README updated (if needed)
- [ ] ROADMAP updated (if completing/starting milestone work)
- [ ] No console.log statements left in code
- [ ] No hardcoded values that should be constants

---

## Testing Approach

### Unit Tests (Priority)

- Music utility functions (frequency calculation, interval naming)
- Question generation logic
- Progress calculation

### Component Tests

- Exercise flow state transitions
- Settings persistence
- Correct/incorrect feedback display

### Manual Testing Checklist

- Audio plays correctly on both iOS and Android
- No audio clicks/pops on note start/stop
- Progress persists after app restart
- Settings persist after app restart
- Unlock progression works correctly

## Reference: Music Theory Constants

```typescript
// MIDI note numbers (Middle C = 60)
const MIDDLE_C = 60;

// Intervals in semitones
enum Interval {
  UNISON = 0,
  MINOR_SECOND = 1,
  MAJOR_SECOND = 2,
  MINOR_THIRD = 3,
  MAJOR_THIRD = 4,
  PERFECT_FOURTH = 5,
  TRITONE = 6,
  PERFECT_FIFTH = 7,
  MINOR_SIXTH = 8,
  MAJOR_SIXTH = 9,
  MINOR_SEVENTH = 10,
  MAJOR_SEVENTH = 11,
  OCTAVE = 12,
}

// Chord intervals from root
const CHORD_TYPES = {
  MAJOR: [0, 4, 7],
  MINOR: [0, 3, 7],
  DIMINISHED: [0, 3, 6],
  AUGMENTED: [0, 4, 8],
};

// Major scale intervals from root
const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
```

## Getting Started Commands

```bash
# Install dependencies
npm install

# Start development server (opens Expo DevTools)
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run tests
npm test

# Type check
npm run typecheck
```

### Font Setup (Space Mono)

1. Download Space Mono from Google Fonts: https://fonts.google.com/specimen/Space+Mono
2. Add `SpaceMono-Regular.ttf` and `SpaceMono-Bold.ttf` to `assets/fonts/`
3. Expo automatically loads fonts from `assets/fonts/` — use `expo-font` to load them:
```typescript
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
  'SpaceMono-Bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
});
```

## Questions for Human Review

When implementing features, flag these for human review:

- Any changes to the audio engine architecture
- New dependencies being added
- Changes to the data persistence schema
- Significant UI/UX deviations from the PRD

## Resources

- PRD: `./scale-scholar-prd.md`
- React Native Audio API: https://github.com/software-mansion/react-native-audio-api
- React Navigation: https://reactnavigation.org/docs/getting-started
- Zustand: https://github.com/pmndrs/zustand
