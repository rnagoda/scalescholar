# Scale Scholar Roadmap

This document tracks the development progress of Scale Scholar, a mobile ear training app for musicians.

---

## Completed: v0.1.0 — Foundation

Project setup, design system, and core infrastructure.

- [x] Initialize repository and documentation
- [x] Create PRD and CLAUDE.md development guidelines
- [x] Initialize Expo project with TypeScript template
- [x] Configure TypeScript strict mode
- [x] Set up project structure (Expo Router `app/` + `src/` directories)
- [x] Install and configure dependencies
  - [x] Expo Router (file-based navigation)
  - [x] Zustand
  - [x] @react-native-async-storage/async-storage
  - [x] expo-sqlite
  - [x] expo-av (audio)
  - [x] expo-font
- [x] Set up Space Mono font with expo-font
- [x] Implement theme system (colors, typography, spacing)
- [x] Build common components
  - [x] BracketButton
  - [x] Card
  - [x] ScreenHeader
  - [x] Divider
  - [x] ProgressBar
  - [x] LabelValue
  - [x] SectionHeader
  - [x] AppFooter
- [x] Set up navigation structure (tabs + stack with Expo Router)
- [x] Create placeholder screens

---

## Completed: v0.2.0 — Audio Engine & Interval Trainer

Core audio synthesis and the first complete exercise module.

### Audio Engine

- [x] AudioEngine singleton with lazy initialization
- [x] Synthesizer interface definition
- [x] SineSynth implementation (pure tones)
- [x] PianoSynth implementation (piano-like tones)
- [x] ADSR envelope for click-free playback
- [x] Music theory utilities (`src/utils/music.ts`)
  - [x] MIDI to frequency conversion
  - [x] Interval calculations

### Interval Trainer

- [x] Exercise state machine (Ready → Playing → Answering → Feedback)
- [x] Question generator with constraints
- [x] PlayButton component
- [x] AnswerButton component
- [x] Exercise screen UI
- [x] Feedback display (correct/incorrect)
- [x] Session completion screen
- [x] Starter intervals: P5, P4, M3, m3

---

## Completed: v0.3.0 — Progress System & Unlocks

Track user progress and enable progressive difficulty.

- [x] SQLite database schema (`src/services/database.ts`)
- [x] Progress service (save/load attempt history)
- [x] useProgressStore (Zustand)
- [x] Per-exercise statistics calculation
- [x] Unlock logic (80% accuracy, 20+ attempts)
- [x] Progress screen UI with interval breakdown
- [x] Interval unlocks: m2, M2, Tritone, m6, M6, m7, M7, P8
- [x] Interval modes infrastructure (descending, mixed, harmonic)
  - Note: Mode selection UI will be added in v0.6.0 Settings

---

## Completed: v0.4.0 — Scale Degree Trainer

Second exercise module for functional ear training.

- [x] Key context playback (tonic triad, scale, I-IV-V-I cadence)
- [x] Scale degree question generator with similarity avoidance
- [x] Numbers vs. Solfege display option (infrastructure ready)
- [x] Scale Degree exercise screen with full state machine
- [x] Starter degrees: 1 (Do), 3 (Mi), 5 (Sol)
- [x] Unlockable degrees: 2 (Re), 4 (Fa), 6 (La), 7 (Ti)
- [x] Progress tracking integration (accuracy, streak, unlocks)
- [x] Home screen integration with scale degree stats

---

## Completed: v0.5.0 — Chord Quality Trainer

Third exercise module for chord recognition.

- [x] Chord playback (simultaneous notes via AudioEngine)
- [x] Chord quality question generator with same-quality avoidance
- [x] Chord Quality exercise screen with full state machine
- [x] Starter chords: Major, Minor
- [x] Unlockable chords: Diminished, Augmented
- [x] Progress tracking integration (accuracy, streak, unlocks)
- [x] Home screen integration with chord quality stats

---

## Current: v0.6.0 — Settings & Polish

User preferences and final MVP polish.

- [ ] Settings screen UI
- [ ] useSettingsStore with AsyncStorage persistence
- [ ] Instrument sound toggle (Piano/Sine)
- [ ] Interval mode selection (ascending/descending/mixed, melodic/harmonic)
- [ ] Scale degree label preference
- [ ] Reference key selection
- [ ] Reference pitch (A4) adjustment
- [ ] Questions per session setting
- [ ] Auto-play next toggle
- [ ] Haptic feedback toggle
- [ ] About/Credits section

---

## Milestone: v1.0.0 — MVP Release

Final testing and app store submission.

- [ ] End-to-end testing on iOS
- [ ] End-to-end testing on Android
- [ ] Performance optimization
- [ ] Bug fixes and polish
- [ ] App store assets (icons, screenshots)
- [ ] App store submission

---

## Future (Post-MVP)

Ideas for future development, not committed to timeline:

### Near-term possibilities

- Minor keys and modes
- 7th chord types (Maj7, Min7, Dom7)
- Chord inversions
- Practice mode (unscored)
- Onboarding tutorial
- UI sound effects (optional)

### Long-term possibilities

- Pitch detection (sing/play input)
- Melodic dictation (multi-note sequences)
- Chord progression identification
- Rhythm training module
- Spaced repetition algorithm
- User accounts and cloud sync
- Leaderboards and challenges

---

## Changelog

### 2025-12-14 — v0.5.0 Chord Quality Trainer

- Added ChordQuality enum with short/full names and intervals
- Extended AudioEngine with playChordQuality method
- Built useChordStore with exercise state machine
- Extended useProgressStore for chord quality tracking
- Created full chords.tsx exercise screen
- Added question generator with same-quality avoidance
- Integrated unlock system (starter: Major, Minor - unlockable: Dim, Aug)
- Updated home screen to display chord quality progress

### 2025-12-14 — v0.4.0 Scale Degree Trainer

- Added ScaleDegree enum and constants (names, solfege, semitones)
- Implemented key context playback (triad, scale, I-IV-V-I cadence)
- Built useScaleDegreeStore with exercise state machine
- Extended useProgressStore for scale degree tracking
- Created full scale-degrees.tsx exercise screen
- Added question generator with similarity avoidance
- Integrated unlock system for scale degrees
- Updated home screen to display scale degree progress

### 2024-12-14 — v0.3.0 Progress System & Unlocks

- Created SQLite database schema for attempts, sessions, and unlocks
- Built progress service with CRUD operations
- Implemented useProgressStore with Zustand
- Added per-interval statistics tracking
- Built unlock system (80% accuracy, 20+ attempts)
- Created Progress screen with interval breakdown
- Added unlock celebration banner on session complete
- Integrated progress tracking into interval trainer

### 2024-12-14 — v0.2.0 Audio Engine & Interval Trainer

- Built AudioEngine singleton with react-native-audio-api
- Implemented SineSynth and PianoSynth (additive synthesis)
- Added ADSR envelopes for click-free playback
- Created music theory utilities (MIDI, frequencies, intervals)
- Built exercise state machine with Zustand
- Implemented question generator with similarity avoidance
- Created PlayButton and AnswerButton components
- Full interval trainer with feedback and session completion
- Added expo-dev-client for native development builds

### 2024-12-14 — v0.1.0 Foundation Complete

- Initialized Expo project with TypeScript
- Set up project structure with Expo Router
- Installed all dependencies (Zustand, AsyncStorage, SQLite, expo-av)
- Implemented theme system (colors, typography, spacing)
- Built common components (BracketButton, Card, ProgressBar, etc.)
- Created tab navigation (Home, Progress, Settings)
- Added placeholder exercise screens (Intervals, Scale Degrees, Chords)

### 2024-XX-XX — Project Initialized

- Created repository
- Added PRD and CLAUDE.md
- Added ROADMAP.md and README.md
