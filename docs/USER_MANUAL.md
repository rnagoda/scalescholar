# Scale Scholar User Manual

> A comprehensive guide to using Scale Scholar for ear training

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Navigation](#navigation)
3. [Training Modules](#training-modules)
   - [Interval Trainer](#interval-trainer)
   - [Scale Degree Trainer](#scale-degree-trainer)
   - [Chord Quality Trainer](#chord-quality-trainer)
4. [Pitch Detector](#pitch-detector)
   - [Voice Mode](#voice-mode)
   - [Instrument Mode](#instrument-mode)
   - [Supported Instruments & Tunings](#supported-instruments--tunings)
5. [Progress Tracking](#progress-tracking)
6. [Settings](#settings)
7. [Unlock System](#unlock-system)
8. [Tips for Effective Practice](#tips-for-effective-practice)

---

## Getting Started

Scale Scholar is an ear training app designed to help musicians develop their ability to recognize intervals, scale degrees, and chord qualities. The app also includes a pitch detector for voice training and instrument tuning.

### First Launch

When you first open Scale Scholar:
1. You'll see the **Home** screen with training modules
2. Each module shows your current progress
3. Tap **[ TRAIN ]** on any module to begin

### Permissions

The **Pitch Detector** feature requires microphone access. You'll be prompted to grant permission the first time you use it.

---

## Navigation

Scale Scholar uses a bottom tab bar with three main sections:

| Tab | Purpose |
|-----|---------|
| **HOME** | Access all training modules and tools |
| **PROGRESS** | View detailed statistics and unlock progress |
| **SETTINGS** | Configure audio, exercises, and preferences |

---

## Training Modules

### Interval Trainer

**Purpose:** Learn to recognize the distance between two notes by ear.

#### How to Use

1. From the Home screen, tap **[ TRAIN ]** on the Interval Trainer card
2. Press **[ PLAY ]** to hear two notes
3. Select the interval you heard from the answer choices
4. Get immediate feedback:
   - **Green** = Correct
   - **Red** = Incorrect (correct answer shown)
5. Press **[ REPLAY ]** to hear the interval again, or continue to the next question
6. Complete the session to see your summary

#### Available Intervals

**Starter Intervals** (unlocked by default):
- Perfect 4th (P4)
- Perfect 5th (P5)
- Major 3rd (M3)
- Minor 3rd (m3)

**Unlockable Intervals:**
- Minor 2nd (m2)
- Major 2nd (M2)
- Tritone (TT)
- Minor 6th (m6)
- Major 6th (M6)
- Minor 7th (m7)
- Major 7th (M7)
- Octave (P8)

#### Interval Trainer Settings

Access via **Settings > Interval Trainer**:

- **Direction**: Choose how intervals are played
  - *Ascending* - Lower note first, then higher
  - *Descending* - Higher note first, then lower
  - *Mixed* - Random direction each time

- **Playback**: Choose presentation style
  - *Melodic* - Notes played one after another
  - *Harmonic* - Notes played simultaneously

---

### Scale Degree Trainer

**Purpose:** Identify notes by their position within a major key (functional ear training).

#### How to Use

1. Tap **[ TRAIN ]** on the Scale Degree Trainer card
2. Listen to the **key context** (helps establish the tonic)
3. Listen to the **target note**
4. Select which scale degree you heard
5. Get feedback and continue

#### Available Scale Degrees

**Starter Degrees** (unlocked by default):
- 1 (Do) - Tonic
- 3 (Mi) - Mediant
- 5 (Sol) - Dominant

**Unlockable Degrees:**
- 2 (Re) - Supertonic
- 4 (Fa) - Subdominant
- 6 (La) - Submediant
- 7 (Ti) - Leading Tone

#### Scale Degree Settings

Access via **Settings > Scale Degree Trainer**:

- **Labels**: Choose how degrees are displayed
  - *Numbers* - 1, 2, 3, 4, 5, 6, 7
  - *Solfege* - Do, Re, Mi, Fa, Sol, La, Ti

---

### Chord Quality Trainer

**Purpose:** Distinguish between different chord types by their characteristic sound.

#### How to Use

1. Tap **[ TRAIN ]** on the Chord Quality Trainer card
2. Press **[ PLAY ]** to hear a chord
3. Select the chord quality from the options
4. Get feedback and continue

#### Available Chord Types

**Starter Chords** (unlocked by default):
- Major
- Minor

**Unlockable Chords:**
- Diminished
- Augmented

---

## Pitch Detector

The Pitch Detector is a real-time tool for detecting pitch from your microphone. It has two modes optimized for different use cases.

### Accessing the Pitch Detector

1. From the Home screen, find the **Pitch Detector** card
2. Tap **[ OPEN ]** to launch
3. Grant microphone permission if prompted

### Voice Mode

**Best for:** Singers, vocalists, and general pitch training

#### How to Use

1. Select **[ VOICE ]** mode (selected by default)
2. Tap **[ LISTEN ]** to start pitch detection
3. Sing or hum a note
4. The display shows:
   - **Note name** (e.g., A4, C#5)
   - **Frequency** in Hz
   - **Cents meter** showing deviation from the nearest note
5. Tap **[ STOP ]** when finished

#### Understanding the Display

- **Note Name**: The closest musical note to your pitch
- **Frequency**: The exact frequency in Hertz
- **Cents Meter**: Shows how sharp (+) or flat (-) you are
  - Center (0) = perfectly in tune
  - Left (-50) = flat
  - Right (+50) = sharp
  - Green = within 5 cents (in tune)
  - Yellow = within 15 cents (close)
  - Pink = more than 15 cents off

#### Voice Mode Smoothing

Voice mode uses **EMA (Exponential Moving Average) smoothing** to provide a stable display while still tracking pitch changes like vibrato and slides.

---

### Instrument Mode

**Best for:** Tuning guitars, bass, violin, ukulele, banjo, and mandolin

#### How to Use

1. Select **[ INSTRUMENT ]** mode
2. Tap the **instrument name** to open the selection menu
3. Choose your instrument (Guitar, Bass, Violin, etc.)
4. Use **[ < ]** and **[ > ]** to cycle through available tunings
5. Tap **[ LISTEN ]** to start
6. Play a string on your instrument
7. The display shows:
   - **String indicator** - Which string is detected
   - **Tuning direction** - SHARP, FLAT, or IN TUNE
   - **Cents meter** - How far off from the target

#### String Indicator

The string indicator shows all strings for your instrument:
- Numbers indicate string number (1 = highest pitch)
- Letters show the target note for each string
- The **active string** is highlighted in green
- `===` marks show which string is being played

#### Tuning Tips

- **IN TUNE** (green): You're within 5 cents - good to go!
- **SHARP** with up arrow: Loosen the string
- **FLAT** with down arrow: Tighten the string

#### Instrument Mode Smoothing

Instrument mode uses **hysteresis** to lock onto a detected string. This prevents the display from jumping between strings when you're at the boundary between two notes. The detector requires you to move at least 25 cents away before switching to a different string.

---

### Supported Instruments & Tunings

#### Guitar (6 strings)

| Tuning | Notes (low to high) |
|--------|---------------------|
| Standard | E A D G B E |
| Drop D | D A D G B E |
| Drop C | C G C F A D |
| Half-Step Down | Eb Ab Db Gb Bb Eb |
| Full-Step Down | D G C F A D |
| Open G | D G D G B D |
| Open D | D A D F# A D |
| DADGAD | D A D G A D |

#### Bass (4-5 strings)

| Tuning | Notes (low to high) |
|--------|---------------------|
| Standard (4-string) | E A D G |
| 5-String | B E A D G |
| Drop D | D A D G |
| Half-Step Down | Eb Ab Db Gb |
| Full-Step Down | D G C F |

#### Violin (4 strings)

| Tuning | Notes (low to high) |
|--------|---------------------|
| Standard | G D A E |
| Baroque (A=415) | G D A E (lower pitch) |

#### Ukulele (4 strings)

| Tuning | Notes |
|--------|-------|
| Standard (GCEA) | G C E A (re-entrant) |
| Low G | G C E A (linear) |
| Baritone | D G B E |
| D Tuning | A D F# B |

#### Banjo (5 strings)

| Tuning | Notes |
|--------|-------|
| Open G | g D G B D |
| Double C | g C G C D |
| Drop C | g C G B D |
| D Tuning | a D F# A D |

*Note: The 5th string (g/a) is the short drone string*

#### Mandolin (4 courses)

| Tuning | Notes (low to high) |
|--------|---------------------|
| Standard | G D A E |
| Octave | G D A E (one octave lower) |

---

## Progress Tracking

### Home Screen Progress

Each training module card displays:
- **Accuracy**: Your overall percentage
- **Current Streak**: Consecutive correct answers
- **Progress Bar**: Visual indicator of content unlocked
- **Unlock Counter**: e.g., "4/12 unlocked"

### Progress Screen

The Progress tab provides detailed statistics:

**Overall Stats:**
- Total attempts across all exercises
- Current streak

**Interval Breakdown:**
- Overall accuracy
- Recent accuracy (last 20 attempts)
- Detailed table showing each interval's:
  - Name and abbreviation
  - Accuracy percentage
  - Number of attempts
  - Lock status

---

## Settings

Access Settings from the bottom tab bar.

### Audio Settings

| Setting | Options | Default |
|---------|---------|---------|
| Instrument Sound | Piano, Sine Wave | Piano |
| Reference Pitch (A4) | 415, 432, 440, 442, 444, 466 Hz | 440 Hz |

**Instrument Sound:**
- *Piano* - Warm, realistic piano tone
- *Sine Wave* - Pure, clinical tone (easier for beginners)

**Reference Pitch:**
- Standard modern pitch is 440 Hz
- Baroque ensembles often use 415 Hz
- Some orchestras tune to 442 or 444 Hz

### Exercise Settings

| Setting | Options | Default |
|---------|---------|---------|
| Questions per Session | 5, 10, 15, 20 | 10 |
| Auto-play Next | On/Off | Off |

**Auto-play Next:** When enabled, automatically plays the next question after you answer (saves time during practice).

### Feedback Settings

| Setting | Options | Default |
|---------|---------|---------|
| Haptic Feedback | On/Off | On |

**Haptic Feedback:** Vibration when you submit an answer.

### Reset Settings

Tap **[ RESET TO DEFAULTS ]** to restore all settings to their original values.

---

## Unlock System

Scale Scholar uses a progressive unlock system to help you build skills gradually.

### How to Unlock New Content

To unlock the next piece of content in any trainer:
1. Achieve **80% accuracy** on currently unlocked content
2. Complete at least **20 attempts**

### Unlock Order

**Intervals:** m3, M3, P4, P5 → m2 → M2 → TT → m6 → M6 → m7 → M7 → P8

**Scale Degrees:** 1, 3, 5 → 4 → 2 → 6 → 7

**Chord Types:** Major, Minor → Diminished → Augmented

### Visual Indicators

- **Unlocked items**: Full brightness, shows statistics
- **Locked items**: Dimmed with lock icon, no stats shown

---

## Tips for Effective Practice

### General Tips

1. **Practice regularly** - Short daily sessions are more effective than long weekly ones
2. **Start with what you know** - Build confidence before tackling new content
3. **Use headphones** - Better audio quality improves recognition
4. **Practice in a quiet environment** - Especially for the pitch detector

### Interval Training Tips

1. **Associate intervals with songs** - Each interval has famous song examples
2. **Start melodic, then try harmonic** - Melodic intervals are usually easier
3. **Mix ascending and descending** - Real music goes both directions

### Pitch Detector Tips

1. **Warm up your voice** before using Voice mode
2. **Tune one string at a time** in Instrument mode
3. **Let the string ring** - Don't mute it while the detector is analyzing
4. **Start with the thickest string** - Usually easier to detect low frequencies

### Building Consistency

1. Use the **Questions per Session** setting to match your available time
2. Track your **streak** - Try to beat your personal best
3. Review your **Progress** screen to identify weak areas
4. Focus practice on intervals/degrees where your accuracy is lowest

---

## Troubleshooting

### Pitch Detector Not Working

1. **Check microphone permission** - Go to your device settings and ensure Scale Scholar has microphone access
2. **Check for background noise** - The detector works best in quiet environments
3. **Get closer to the mic** - Especially for acoustic instruments

### No Sound from Exercises

1. **Check device volume** - Make sure it's not muted
2. **Check headphone connection** - If using headphones, ensure they're properly connected
3. **Restart the app** - Close and reopen Scale Scholar

### Progress Not Saving

- Progress is saved automatically after each answer
- Ensure you complete exercises rather than force-closing the app

---

## Version History

| Version | Features |
|---------|----------|
| 0.7.0 | Current release |

---

## Credits

**Scale Scholar** is designed and engineered by **nagodasoft**.

Built with:
- React Native
- Expo
- react-native-audio-api

---

*For feedback and support, visit the project repository.*
