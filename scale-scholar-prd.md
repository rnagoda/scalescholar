# Scale Scholar — Product Requirements Document

## Overview

**Product Name:** Scale Scholar  
**Version:** 1.0 (MVP)  
**Platform:** iOS and Android (React Native)  
**Target Release:** TBD

### Vision Statement

Scale Scholar is a mobile ear training app that helps musicians develop the ability to recognize intervals, scale degrees, and chord qualities through focused, progressive exercises with immediate feedback.

### Target Users

- **Primary:** Intermediate musicians (1-5 years experience) who want to improve their ear
- **Secondary:** Music students supplementing formal education
- **Tertiary:** Hobbyist musicians and self-learners

Users are motivated, willing to practice regularly, and value clear progress indicators. They likely have some music theory knowledge but want to internalize it aurally.

---

## MVP Scope

### Core Exercises

The MVP includes three exercise modules:

#### 1. Interval Trainer

**Purpose:** Teach users to recognize the distance between two notes.

**Functionality:**
- Plays two notes in sequence (ascending, descending, or harmonic/simultaneous)
- User selects the interval from multiple-choice options
- Immediate feedback with option to replay

**Intervals (progressive unlock):**
- **Starter set:** Perfect 5th (P5), Perfect 4th (P4), Major 3rd (M3), Minor 3rd (m3)
- **Unlockable:** Minor 2nd (m2), Major 2nd (M2), Tritone, Minor 6th (m6), Major 6th (M6), Minor 7th (m7), Major 7th (M7), Octave (P8)

**Modes:**
- Ascending only (beginner)
- Descending only
- Mixed ascending/descending
- Harmonic (both notes together)

**Difficulty progression:**
- Fewer intervals → more intervals
- Ascending only → mixed directions
- Melodic → harmonic

---

#### 2. Scale Degree Trainer (Functional Ear Training)

**Purpose:** Teach users to identify notes by their position within a key.

**Functionality:**
- Establishes key context (plays tonic chord or full scale)
- Plays a single target note
- User identifies which scale degree was played
- Immediate feedback with option to replay context + note

**Scale Degrees:**
- **Starter set:** 1 (Do), 3 (Mi), 5 (Sol)
- **Unlockable:** 2 (Re), 4 (Fa), 6 (La), 7 (Ti)

**Display options (user setting):**
- Numbers: 1, 2, 3, 4, 5, 6, 7
- Solfège: Do, Re, Mi, Fa, Sol, La, Ti

**Context options:**
- Tonic triad only (I chord)
- Full ascending scale
- I-IV-V-I progression

**Key selection:**
- Default: C Major
- User setting: Any major key
- Future: Minor keys, modes

---

#### 3. Chord Quality Trainer

**Purpose:** Teach users to identify chord types by their characteristic sound/color.

**Functionality:**
- Plays a chord (root position)
- User identifies the chord quality from options
- Immediate feedback with option to replay

**Chord types:**
- **Starter set:** Major, Minor
- **Unlockable:** Diminished, Augmented

**Future expansion (post-MVP):**
- 7th chords (Maj7, Min7, Dom7, etc.)
- Inversions
- Extended chords

---

### Exercise Flow (All Modules)

```
INTERVALS                                    [ CLOSE ]
──────────────────────────────────────────────────────
                      5 / 10

                ┌───────────────┐
                │               │
                │      ▶        │
                │               │
                └───────────────┘
                  [ REPLAY ]

  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
  │   P4   │  │   P5   │  │   M3   │  │   m3   │
  └────────┘  └────────┘  └────────┘  └────────┘
```

**States:**
1. **Ready** — Play button prominent, answers dimmed
2. **Listening** — Audio playing, subtle visual pulse
3. **Answering** — Answer buttons active
4. **Feedback** — Correct (green) or incorrect (coral + show correct answer)
5. **Transition** — Brief pause, then next question

---

### Progress & Statistics

**Per-exercise tracking:**
- Total attempts
- Correct answers
- Accuracy percentage
- Current streak
- Best streak

**Unlock system:**
- New intervals/degrees/chords unlock at 80% accuracy threshold
- Minimum 20 attempts before unlock evaluation

**Session summary:**
- Displayed after completing exercise set (default: 10 questions)
- Shows accuracy, time, improvement vs. previous session

---

### Settings

| Setting | Options | Default |
|---------|---------|---------|
| **Instrument Sound** | Piano, Pure Tone (sine wave) | Piano |
| **Scale Degree Labels** | Numbers (1-7), Solfège (Do-Ti) | Numbers |
| **Reference Key** | C, C#, D, D#, E, F, F#, G, G#, A, A#, B | C |
| **Reference Pitch** | A = 432Hz, 440Hz, 442Hz | 440Hz |
| **Questions per Session** | 5, 10, 15, 20 | 10 |
| **Auto-play Next** | On/Off | Off |
| **Haptic Feedback** | On/Off | On |

---

## User Interface

### Design Direction

- **Style:** Retro terminal aesthetic — dark backgrounds, monospace typography, minimal decoration
- **Inspiration:** Command-line interfaces, classic computing, focused utility
- **Color palette:** Near-black background, off-white text, mint green accents for success/positive, coral pink for errors/attention
- **Typography:** Space Mono font throughout (Google Fonts), ALL CAPS headers with letter-spacing
- **Signature element:** Bracketed buttons `[ ACTION ]` — used for all interactive actions
- **Cards:** Subtle borders on dark backgrounds, not filled color differentiation
- **Interactions:** Functional and responsive, no excessive animation
- **Feedback:** Visual only for correct/incorrect — no sound effects (to avoid interfering with ear training)
- **Footer:** Version number and "engineered by nagodasoft" branding on main screens

### Screen Map

```
Scale Scholar
├── Home
│   ├── Interval Trainer [card]
│   ├── Scale Degree Trainer [card]
│   └── Chord Quality Trainer [card]
│
├── Exercise Screen (per trainer)
│   ├── Exercise UI
│   └── Session Complete (modal/screen)
│
├── Progress
│   ├── Overall stats
│   └── Per-exercise breakdown
│
└── Settings
    ├── Sound preferences
    ├── Exercise preferences
    └── About/Credits
```

### Navigation

- Bottom tab bar: Home | Progress | Settings
- Exercise screens: Full-screen with back button

---

## Technical Requirements

### Typography

**Font:** Space Mono (Google Fonts, OFL license)
- Variants needed: Regular (400), Bold (700)
- Must be bundled with the app (not loaded from web)

### Audio Engine

**Synthesis requirements:**
- Generate piano-like tones (additive synthesis or wavetable)
- Generate pure sine waves (fallback/option)
- Play single notes with configurable duration, attack, decay
- Play chords (multiple simultaneous voices)
- Support all 12 chromatic pitches across ~3 octaves (C3 to C6)

**Quality:**
- Sample rate: 44.1kHz minimum
- Low latency: <50ms from trigger to sound
- No audible clicks/pops on note start/stop

**Pitch generation:**
- A4 = 440Hz (configurable)
- Equal temperament tuning
- Frequency calculation: f = 440 × 2^((n-69)/12) where n = MIDI note number

### Data Persistence

**Local storage (AsyncStorage):**
- User settings/preferences
- Current unlock state per exercise

**Database (SQLite):**
- Exercise attempt history (timestamp, exercise type, question, answer, correct/incorrect)
- Session summaries

### Performance Targets

- App launch to interactive: <2 seconds
- Audio playback latency: <50ms
- Smooth 60fps animations
- Offline-first: All features work without network

---

## Future Considerations (Post-MVP)

These features are out of scope for MVP but should be considered in architecture:

1. **Pitch detection** — User sings/plays, app recognizes the note
2. **Melodic dictation** — Multi-note sequences
3. **Chord progressions** — Identify ii-V-I, I-IV-V, etc.
4. **Minor keys and modes** — Expand beyond major
5. **Rhythm training** — Separate module
6. **Spaced repetition** — Optimize review scheduling
7. **User accounts & sync** — Cloud backup, cross-device
8. **Social features** — Leaderboards, challenges
9. **UI sound effects** — Optional chimes for correct/incorrect (user preference)

---

## Success Metrics

**MVP launch criteria:**
- All three exercises functional with core feature set
- Progress tracking operational
- Settings functional
- No critical bugs
- Passes app store review guidelines

**Post-launch metrics to track:**
- Daily/weekly active users
- Session length
- Exercise completion rate
- Progression (unlocks achieved)
- Retention (D1, D7, D30)
- App store ratings

---

## Open Questions

1. Should we include a brief onboarding/tutorial for first-time users?
2. Should exercises have a "practice mode" (no scoring) vs. "test mode" (scored)?
3. How should we handle the transition when a user changes reference key mid-progress?

---

## Appendix: Interval Reference

| Interval | Semitones | Example (from C) |
|----------|-----------|------------------|
| Minor 2nd (m2) | 1 | C → C#/Db |
| Major 2nd (M2) | 2 | C → D |
| Minor 3rd (m3) | 3 | C → D#/Eb |
| Major 3rd (M3) | 4 | C → E |
| Perfect 4th (P4) | 5 | C → F |
| Tritone (TT) | 6 | C → F#/Gb |
| Perfect 5th (P5) | 7 | C → G |
| Minor 6th (m6) | 8 | C → G#/Ab |
| Major 6th (M6) | 9 | C → A |
| Minor 7th (m7) | 10 | C → A#/Bb |
| Major 7th (M7) | 11 | C → B |
| Octave (P8) | 12 | C → C |

## Appendix: Scale Degrees

| Degree | Number | Solfège | Semitones from root |
|--------|--------|---------|---------------------|
| Tonic | 1 | Do | 0 |
| Supertonic | 2 | Re | 2 |
| Mediant | 3 | Mi | 4 |
| Subdominant | 4 | Fa | 5 |
| Dominant | 5 | Sol | 7 |
| Submediant | 6 | La | 9 |
| Leading tone | 7 | Ti | 11 |
