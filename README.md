# Scale Scholar

A mobile ear training app for iOS and Android that helps musicians develop the ability to recognize intervals, scale degrees, and chord qualities through interactive lessons and exercises.

## Overview

Scale Scholar provides focused, progressive exercises with immediate feedback to help musicians internalize music theory concepts aurally. Whether you're a music student, hobbyist, or self-learner, Scale Scholar helps you build a stronger musical ear.

### Features

#### Music School — Structured Learning
- **48 lessons** across 4 tracks: Foundations, Intervals, Scales & Keys, and Chords
- **7 block types**: text-audio, audio-quiz, visual-quiz, fill-blank, drag-drop, tap-build, sorting
- **Cross-track unlocks**: Lessons unlock content in Ear School trainers
- **XP system** with leveling (Beginner → Intermediate → Advanced → Scholar)

#### Ear School — Practice Trainers
- **Interval Trainer** — Learn to recognize the distance between two notes (ascending, descending, and harmonic)
- **Scale Degree Trainer** — Identify notes by their position within a key (functional ear training)
- **Chord Quality Trainer** — Distinguish between major, minor, diminished, and augmented chords

#### Voice School — Pitch Training
- **Pitch Detector** — Real-time pitch detection with visual feedback for tuning practice

#### Core Features
- **Progressive Unlocks** — Start with basics, unlock more content as you improve
- **Progress Tracking** — Monitor accuracy, streaks, XP, and level progression
- **Sampled Piano** — Salamander Grand Piano samples for realistic sound
- **Customizable Settings** — Adjust instrument, reference pitch, session length, and more

### Design

Scale Scholar features a distinctive retro terminal aesthetic — dark backgrounds, monospace typography (Space Mono), and signature `[ BRACKETED ]` buttons. Function over flash, but with personality.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native with Expo |
| Audio | react-native-audio-api (Web Audio API for React Native) |
| Navigation | Expo Router |
| State | Zustand |
| Storage | AsyncStorage + expo-sqlite |
| Language | TypeScript (strict mode) |

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your device (for testing on physical devices)
- Xcode (iOS simulator, macOS only)
- Android Studio (Android emulator, optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/rnagoda/scalescholar.git
cd scalescholar

# Install dependencies
npm install
```

### Running the App

```bash
# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Scan QR code with Expo Go app to run on physical device
```

### Development Commands

```bash
# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

## Project Structure

```
app/                        # Expo Router file-based routing
├── (tabs)/                 # Tab navigator group
│   ├── _layout.tsx         # Tab layout configuration
│   ├── index.tsx           # Home screen
│   ├── progress.tsx        # Progress screen
│   └── settings.tsx        # Settings screen
├── exercise/               # Exercise screens (stack)
│   ├── music-school/       # Music School lesson screens
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
├── content/
│   └── lessons/            # 48 lesson definitions across 4 tracks
│       ├── foundations/    # Track 1: Pitch, rhythm, expression
│       ├── intervals/      # Track 2: All 12 intervals
│       ├── scales-keys/    # Track 3: Major/minor scales and keys
│       └── chords/         # Track 4: Triads and 7th chords
├── audio/                  # Audio engine and synthesizers
│   └── synths/             # SineSynth, PianoSynth, SampledPianoSynth
├── stores/                 # Zustand state management
├── services/               # Database, business logic
├── utils/                  # Helper functions, music theory
├── types/                  # TypeScript definitions
└── theme/                  # Colors, typography, spacing
```

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** — Development guidelines, architecture decisions, code style
- **[ROADMAP.md](./ROADMAP.md)** — Project milestones and progress tracking
- **[scale-scholar-prd.md](./scale-scholar-prd.md)** — Product requirements document

## Contributing

1. **Never commit directly to `main`** — All work happens on feature branches
2. Follow branch naming: `feature/`, `fix/`, `refactor/`, `docs/`, `chore/`
3. Write clear, atomic commits using conventional commit format
4. Ensure TypeScript compiles and tests pass before submitting PR
5. Update documentation as needed (README, ROADMAP, CLAUDE.md)

See [CLAUDE.md](./CLAUDE.md) for detailed coding guidelines and SOLID principles.

## License

TBD

---

engineered by nagodasoft
