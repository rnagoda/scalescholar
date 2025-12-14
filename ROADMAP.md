# Scale Scholar Roadmap

This document tracks the development progress of Scale Scholar, a mobile ear training app for musicians.

---

## Current: v0.1.0 — Foundation

Project setup, design system, and core infrastructure.

- [x] Initialize repository and documentation
- [x] Create PRD and CLAUDE.md development guidelines
- [ ] Initialize React Native project (bare workflow)
- [ ] Configure TypeScript strict mode
- [ ] Set up project structure (`src/` directories)
- [ ] Install and configure dependencies
  - [ ] React Navigation
  - [ ] Zustand
  - [ ] AsyncStorage
  - [ ] expo-sqlite
  - [ ] react-native-audio-api
- [ ] Set up Space Mono font
- [ ] Implement theme system (colors, typography, spacing)
- [ ] Build common components
  - [ ] BracketButton
  - [ ] Card
  - [ ] ScreenHeader
  - [ ] Divider
  - [ ] ProgressBar
  - [ ] LabelValue
  - [ ] SectionHeader
  - [ ] AppFooter
- [ ] Set up navigation structure (tabs + stack)
- [ ] Create placeholder screens

---

## Next: v0.2.0 — Audio Engine & Interval Trainer

Core audio synthesis and the first complete exercise module.

### Audio Engine
- [ ] AudioEngine singleton with lazy initialization
- [ ] Synthesizer interface definition
- [ ] SineSynth implementation (pure tones)
- [ ] PianoSynth implementation (piano-like tones)
- [ ] ADSR envelope for click-free playback
- [ ] Music theory utilities (`src/utils/music.ts`)
  - [ ] MIDI to frequency conversion
  - [ ] Note name parsing
  - [ ] Interval calculations

### Interval Trainer
- [ ] Exercise state machine (Ready → Playing → Answering → Feedback)
- [ ] Question generator with constraints
- [ ] PlayButton component
- [ ] AnswerButton component
- [ ] Exercise screen UI
- [ ] Feedback display (correct/incorrect)
- [ ] Session completion screen
- [ ] Starter intervals: P5, P4, M3, m3

---

## Planned: v0.3.0 — Progress System & Unlocks

Track user progress and enable progressive difficulty.

- [ ] SQLite database schema
- [ ] Progress service (save/load attempt history)
- [ ] useProgressStore (Zustand)
- [ ] Per-exercise statistics calculation
- [ ] Unlock logic (80% accuracy, 20+ attempts)
- [ ] Progress screen UI
- [ ] Interval unlocks: m2, M2, Tritone, m6, M6, m7, M7, P8
- [ ] Interval modes: descending, mixed, harmonic

---

## Planned: v0.4.0 — Scale Degree Trainer

Second exercise module for functional ear training.

- [ ] Key context playback (tonic triad, scale, I-IV-V-I)
- [ ] Scale degree question generator
- [ ] Numbers vs. Solfege display option
- [ ] Scale Degree exercise screen
- [ ] Starter degrees: 1 (Do), 3 (Mi), 5 (Sol)
- [ ] Unlockable degrees: 2, 4, 6, 7

---

## Planned: v0.5.0 — Chord Quality Trainer

Third exercise module for chord recognition.

- [ ] Chord playback (simultaneous notes)
- [ ] Chord quality question generator
- [ ] Chord Quality exercise screen
- [ ] Starter chords: Major, Minor
- [ ] Unlockable chords: Diminished, Augmented

---

## Planned: v0.6.0 — Settings & Polish

User preferences and final MVP polish.

- [ ] Settings screen UI
- [ ] useSettingsStore with AsyncStorage persistence
- [ ] Instrument sound toggle (Piano/Sine)
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

### 2024-XX-XX — Project Initialized
- Created repository
- Added PRD and CLAUDE.md
- Added ROADMAP.md and README.md
