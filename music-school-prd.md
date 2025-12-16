# Scale Scholar — Music School PRD

## Overview

Music School is the educational pillar of Scale Scholar, providing interactive microlearning lessons that teach music theory concepts. It functions as a standalone learning system while also reinforcing the skills tested in ear training exercises.

### Relationship to Ear Training

| Component | Purpose |
|-----------|---------|
| **Music School** | "Learn what it is and why" — conceptual understanding |
| **Ear Training** | "Recognize it when you hear it" — applied skill |

Both contribute to a unified progress system. Users can engage with either independently, but mastery comes from combining both.

---

## Curriculum Structure

### Learning Tracks

Music School organizes content into thematic tracks. Each track contains multiple levels, and each level contains multiple lessons.

```
TRACK: INTERVALS
├── Level 1: Introduction to Intervals
│   ├── Lesson 1.1: What is an interval?
│   ├── Lesson 1.2: Counting half steps
│   ├── Lesson 1.3: Interval qualities (major, minor, perfect)
│   └── Lesson 1.4: Level 1 Review
├── Level 2: Perfect Intervals
│   ├── Lesson 2.1: Unison and octave
│   ├── Lesson 2.2: Perfect fourth
│   ├── Lesson 2.3: Perfect fifth
│   └── Lesson 2.4: Level 2 Review
└── Level 3: Major & Minor Intervals
    ├── Lesson 3.1: Major and minor seconds
    ├── Lesson 3.2: Major and minor thirds
    ├── Lesson 3.3: Major and minor sixths
    ├── Lesson 3.4: Major and minor sevenths
    └── Lesson 3.5: Level 3 Review
```

### MVP Tracks

| Track | Levels | Est. Lessons | Supports Exercise |
|-------|--------|--------------|-------------------|
| **Foundations** | 3 | 12-15 | All |
| **Intervals** | 3 | 12-15 | Interval Trainer |
| **Scales & Keys** | 3 | 12-15 | Scale Degree Trainer |
| **Chords** | 3 | 12-15 | Chord Quality Trainer |

**Total MVP scope:** ~50-60 microlearning lessons

### Track Details

#### Track 1: Foundations
Core concepts every musician needs before diving into specifics.

| Level | Topics |
|-------|--------|
| 1 | Pitch basics, the musical alphabet (A-G), octaves |
| 2 | The piano keyboard as visual reference, half steps and whole steps |
| 3 | Introduction to notation (treble clef, note placement), ledger lines |

#### Track 2: Intervals
Understanding the distance between notes.

| Level | Topics |
|-------|--------|
| 1 | What intervals are, counting half steps, interval number vs. quality |
| 2 | Perfect intervals (unison, P4, P5, octave), why "perfect"? |
| 3 | Major/minor intervals (2nds, 3rds, 6ths, 7ths), the tritone |

#### Track 3: Scales & Keys
Understanding scales, keys, and scale degrees.

| Level | Topics |
|-------|--------|
| 1 | What is a scale?, the major scale formula (W-W-H-W-W-W-H) |
| 2 | Scale degrees (1-7), tonic/dominant/leading tone functions |
| 3 | Key signatures, the circle of fifths (introduction), relative major/minor |

#### Track 4: Chords
Building and understanding harmony.

| Level | Topics |
|-------|--------|
| 1 | What is a chord?, triads, chord construction (stacked thirds) |
| 2 | Major, minor, diminished, augmented triads |
| 3 | Seventh chords (maj7, min7, dom7, dim7), chord symbols |

---

## Lesson Structure

### Lesson Format

Each lesson follows a consistent structure optimized for microlearning (2-3 minutes):

```
┌─────────────────────────────────────────────────────┐
│  LESSON 2.3: PERFECT FIFTH                          │
│  Intervals > Level 2                    3 of 4      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Content Block — see types below]                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│              [ CONTINUE ]  or  [ CHECK ]            │
└─────────────────────────────────────────────────────┘
```

### Content Block Types

Lessons are composed of sequential content blocks. A typical 2-3 minute lesson contains 4-7 blocks.

#### 1. Text + Audio Block
Explanatory text with optional audio example.

```
PERFECT FIFTH
──────────────────────────────────────────────────────

The perfect fifth spans 7 half steps. It's one of the
most consonant intervals — stable and open-sounding.

        ┌───────────────┐
        │      ▶        │  "Hear a perfect fifth"
        └───────────────┘

The perfect fifth is the foundation of power chords
in rock music and the first overtone in the harmonic
series.

                    [ CONTINUE ]
```

#### 2. Audio Quiz Block
Listen and answer a question.

```
LISTEN AND IDENTIFY
──────────────────────────────────────────────────────

        ┌───────────────┐
        │      ▶        │
        └───────────────┘
          [ REPLAY ]

Which interval did you hear?

    [ Perfect Fourth ]    [ Perfect Fifth ]

    [ Major Third ]       [ Minor Third ]
```

#### 3. Visual Quiz Block
Identify something shown visually (notation, keyboard diagram).

```
IDENTIFY THE INTERVAL
──────────────────────────────────────────────────────

        ┌─────────────────────────────┐
        │     𝄞                       │
        │        ●                    │
        │                 ●           │
        │     ───────────────────     │
        └─────────────────────────────┘

What interval is shown?

    [ Major 3rd ]    [ Perfect 4th ]

    [ Perfect 5th ]  [ Major 6th ]
```

#### 4. Drag-and-Drop Block
Construct something by dragging elements.

```
BUILD THE C MAJOR TRIAD
──────────────────────────────────────────────────────

Drag notes to the staff to build a C major triad:

        ┌─────────────────────────────┐
        │     𝄞                       │
        │                             │
        │        [ drop zone ]        │
        │     ───────────────────     │
        └─────────────────────────────┘

Available notes:
  ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐
  │ C │  │ D │  │ E │  │ F │  │ G │
  └───┘  └───┘  └───┘  └───┘  └───┘

                    [ CHECK ]
```

#### 5. Tap/Build Block
Tap keys on a keyboard or buttons in sequence.

```
PLAY THE INTERVAL
──────────────────────────────────────────────────────

Tap the piano keys to play a Perfect Fifth starting
from C:

  ┌──┬─┬──┬─┬──┬──┬─┬──┬─┬──┬─┬──┐
  │  │█│  │█│  │  │█│  │█│  │█│  │
  │  │█│  │█│  │  │█│  │█│  │█│  │
  │  └┬┘  └┬┘  │  └┬┘  └┬┘  └┬┘  │
  │ C │ D │ E │ F │ G │ A │ B │ C │
  └───┴───┴───┴───┴───┴───┴───┴───┘

Selected: C, _

                    [ CHECK ]
```

#### 6. Sorting/Ordering Block
Arrange items in correct order.

```
ORDER THE SCALE DEGREES
──────────────────────────────────────────────────────

Drag to arrange these scale degree names from lowest
to highest (1 to 7):

  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │  Dominant  │  │   Tonic    │  │  Mediant   │
  └────────────┘  └────────────┘  └────────────┘

  ┌────────────┐  ┌────────────┐
  │ Supertonic │  │Subdominant │
  └────────────┘  └────────────┘

                    [ CHECK ]
```

#### 7. Fill-in-the-Blank Block
Complete a statement or formula.

```
COMPLETE THE FORMULA
──────────────────────────────────────────────────────

The major scale formula is:

  W - W - [ _ ] - W - W - [ _ ] - H

Tap to fill in the blanks:

    [ W ]    [ H ]

                    [ CHECK ]
```

---

## Lesson Flow & Feedback

### Immediate Feedback

All interactive blocks provide immediate feedback:

**Correct answer:**
```
──────────────────────────────────────────────────────
  ✓ CORRECT

  The perfect fifth (C to G) spans exactly 7 half
  steps.

                    [ CONTINUE ]
```

**Incorrect answer:**
```
──────────────────────────────────────────────────────
  ✗ NOT QUITE

  That's a perfect fourth (5 half steps).
  The perfect fifth is 7 half steps — one more
  whole step.

        ┌───────────────┐
        │      ▶        │  "Hear the difference"
        └───────────────┘

              [ TRY AGAIN ]    [ CONTINUE ]
```

### Lesson Completion

```
LESSON COMPLETE
──────────────────────────────────────────────────────

  PERFECT FIFTH                              ✓

  Accuracy: 4/5 correct (80%)
  
  ─────────────────────────────────────────

  You've completed Level 2: Perfect Intervals!
  
  + 50 XP earned
  
  🎵 NEW UNLOCK: Interval Trainer now includes
     Perfect Fifth exercises

        [ NEXT LESSON ]    [ BACK TO TRACK ]
```

---

## Navigation & UI

### Music School Home

```
MUSIC SCHOOL                                 [ CLOSE ]
──────────────────────────────────────────────────────

YOUR PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░  Level 4 (68%)

──────────────────────────────────────────────────────

TRACKS

┌────────────────────────────────────────────────────┐
│  FOUNDATIONS                                       │
│  Core concepts for reading and understanding music │
│  ━━━━━━━━━━━━━━━━━━━━ 100%            [ REVIEW ]  │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  INTERVALS                                         │
│  The distance between two notes                    │
│  ━━━━━━━━━━━━━━━━░░░░ 75%           [ CONTINUE ]  │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  SCALES & KEYS                                     │
│  Understanding scales, keys, and tonality          │
│  ━━━━━━━━░░░░░░░░░░░░ 40%           [ CONTINUE ]  │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  CHORDS                                            │
│  Building and recognizing harmony                  │
│  ░░░░░░░░░░░░░░░░░░░░ 0%               [ START ]  │
└────────────────────────────────────────────────────┘
```

### Track View

```
INTERVALS                                    [ BACK ]
──────────────────────────────────────────────────────

Track Progress: 9/12 lessons complete

──────────────────────────────────────────────────────

LEVEL 1: INTRODUCTION                            ✓
All 4 lessons complete
                                          [ REVIEW ]

──────────────────────────────────────────────────────

LEVEL 2: PERFECT INTERVALS                       ✓
All 4 lessons complete
                                          [ REVIEW ]

──────────────────────────────────────────────────────

LEVEL 3: MAJOR & MINOR INTERVALS            1 of 5

  ✓ 3.1  Major and minor seconds
  ○ 3.2  Major and minor thirds          [ START ]
  ○ 3.3  Major and minor sixths
  ○ 3.4  Major and minor sevenths
  ○ 3.5  Level 3 Review

──────────────────────────────────────────────────────
```

---

## Progress & Rewards System

### Unified Progress Model

Progress is tracked across both Music School and Ear Training:

```
┌─────────────────────────────────────────────────────┐
│                   OVERALL PROGRESS                  │
│                                                     │
│    BEGINNER ──●────────────── INTERMEDIATE ─────── │
│              ↑                                      │
│          You are here                               │
│                                                     │
│    Music School:  ━━━━━━━━━━━━░░░░  68%            │
│    Ear Training:  ━━━━━━━━░░░░░░░░  42%            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### XP System

| Action | XP Earned |
|--------|-----------|
| Complete a lesson | 25-50 XP (based on accuracy) |
| Complete a level | 100 XP bonus |
| Complete a track | 250 XP bonus |
| Complete an exercise set (10 questions) | 20-40 XP |
| Daily streak | 10 XP per day |

### Level Thresholds

| Level | Title | XP Required | Unlocks |
|-------|-------|-------------|---------|
| 1-3 | Beginner | 0-500 | Basic lessons and exercises |
| 4-6 | Intermediate | 500-1500 | All intervals, basic chords |
| 7-9 | Advanced | 1500-3500 | 7th chords, all exercises |
| 10+ | Scholar | 3500+ | Bragging rights |

### Milestone Achievements

```
ACHIEVEMENT UNLOCKED
──────────────────────────────────────────────────────

  🎓 INTERVAL APPRENTICE

  Completed all Interval lessons in Music School

  + 100 XP bonus

                      [ NICE ]
```

Sample achievements:
- **First Steps** — Complete your first lesson
- **Perfect Ears** — Score 100% on any exercise set
- **Week Warrior** — 7-day streak
- **Interval Apprentice** — Complete Intervals track
- **Theory Scholar** — Complete all Music School tracks
- **The Whole Package** — Master both Music School and Ear Training

---

## Cross-Feature Integration

### Lesson → Exercise Unlocks

Completing certain lessons unlocks corresponding ear training content:

| Lesson Completed | Unlocks in Ear Training |
|------------------|------------------------|
| Intervals Level 2 | Perfect intervals in trainer |
| Intervals Level 3 | Major/minor intervals in trainer |
| Chords Level 2 | Major/minor/dim/aug in chord trainer |
| Chords Level 3 | 7th chords in chord trainer |

### "Go Practice" Prompts

After completing a lesson, prompt the user to reinforce with ear training:

```
READY TO PRACTICE?
──────────────────────────────────────────────────────

You just learned about perfect fifths. Want to train
your ear to recognize them?

    [ PRACTICE INTERVALS ]    [ MAYBE LATER ]
```

### "Learn More" from Exercises

When users struggle in ear training, suggest relevant lessons:

```
NEED A REFRESHER?
──────────────────────────────────────────────────────

You've missed several minor 3rd questions. Would you
like to review the lesson on minor intervals?

    [ REVIEW LESSON ]    [ KEEP PRACTICING ]
```

---

## Audio Requirements

### Consistency with Ear Training

Music School uses the same audio engine as ear training exercises:
- Default: Piano-like synthesized tones
- Option: Pure sine waves (via settings)
- Reference pitch: A=440Hz (adjustable in settings)

### Lesson-Specific Audio

| Audio Type | Usage |
|------------|-------|
| Single notes | Demonstrating pitches, keyboard taps |
| Intervals | Melodic (sequential) and harmonic (simultaneous) |
| Scales | Ascending/descending playback |
| Chords | Block chords, arpeggiated option |

All audio examples should have a [ REPLAY ] option.

---

## Content Guidelines

### Writing Style

- **Concise:** Every word earns its place
- **Active voice:** "A perfect fifth spans 7 half steps" not "7 half steps are spanned by a perfect fifth"
- **Practical:** Connect theory to real music when possible
- **Encouraging:** Acknowledge difficulty without condescension

### Example Tone

**Good:**
> The tritone divides the octave exactly in half — 6 half steps up or down. Medieval musicians called it "diabolus in musica" (the devil in music) because of its unstable sound. Today, it's everywhere in jazz and rock.

**Avoid:**
> The tritone is a very important interval that you need to learn. It is sometimes called the devil's interval. Many musicians have used it in their music throughout history.

### Visual Consistency

- Use ASCII keyboard diagrams for piano-based concepts
- Use simple staff notation where needed (treble clef primarily)
- Maintain retro terminal aesthetic from main app
- Highlight/emphasize with `[ brackets ]` not bold/italic

---

## Technical Considerations

### Content Storage

Lesson content should be stored as structured data (JSON), not hardcoded:

```json
{
  "lessonId": "intervals-2-3",
  "title": "Perfect Fifth",
  "track": "intervals",
  "level": 2,
  "order": 3,
  "blocks": [
    {
      "type": "text-audio",
      "text": "The perfect fifth spans 7 half steps...",
      "audio": { "type": "interval", "note1": "C4", "note2": "G4" }
    },
    {
      "type": "audio-quiz",
      "prompt": "Which interval did you hear?",
      "audio": { "type": "interval", "note1": "C4", "note2": "G4" },
      "options": ["Perfect Fourth", "Perfect Fifth", "Major Third", "Minor Third"],
      "correctIndex": 1
    }
  ]
}
```

This allows:
- Easy content updates without code changes
- Potential for future localization
- A/B testing of lesson content
- Analytics on which blocks users struggle with

### State Management

Track per lesson:
- Completion status (not started / in progress / complete)
- Best accuracy score
- Number of attempts
- Time spent

Track per track/level:
- Lessons completed count
- Overall accuracy
- Unlock status

### Performance

- Preload audio for upcoming blocks
- Lazy-load lesson content (don't load all 60 lessons at startup)
- Cache completed lesson data locally

---

## Design Decisions

### Lesson Sequencing & Self-Leveling

Users can skip lessons and self-select their starting point. The app should:
- Allow users to specify where they think they should start (placement quiz optional, not required)
- Never lock users out of earlier content — they can always go back
- Track completion separately from "starting point" — skipped lessons show as incomplete but accessible

```
START HERE?
──────────────────────────────────────────────────────

Where would you like to begin?

  [ I'm brand new to music theory ]
      Start from Foundations Level 1

  [ I know the basics ]
      Start from Intervals Level 1

  [ I'm comfortable with intervals and scales ]
      Start from Chords Level 1

  [ Let me browse and choose ]
      Open track selection

You can always go back to earlier lessons anytime.
```

### Review XP System

Completed lessons are replayable and earn XP, but with diminishing returns based on two factors:

**Factor 1: Initial Performance**
| First Attempt Score | Review XP Multiplier |
|---------------------|---------------------|
| < 60% | 0.75x (75% of base) |
| 60-79% | 0.50x (50% of base) |
| 80-89% | 0.30x (30% of base) |
| 90-99% | 0.15x (15% of base) |
| 100% | 0.10x (10% of base) |

**Factor 2: Time Since Last Attempt**
| Time Elapsed | Time Multiplier |
|--------------|-----------------|
| < 1 day | 0.25x |
| 1-3 days | 0.50x |
| 4-7 days | 0.75x |
| 1-2 weeks | 1.0x |
| 2-4 weeks | 1.25x |
| > 1 month | 1.5x |

**Final Review XP = Base XP × Initial Performance Multiplier × Time Multiplier**

Example: A lesson worth 50 XP base, first completed at 85% accuracy, reviewed after 3 weeks:
- 50 × 0.30 (80-89%) × 1.25 (2-4 weeks) = 18.75 → 19 XP

This encourages spaced repetition while preventing XP farming.

### Notation Rendering

Use an existing library first (candidates: VexFlow, ABCjs, or react-native-music-notation if available). Evaluate for:
- Retro aesthetic compatibility (can we style it dark theme + monospace labels?)
- Bundle size
- React Native compatibility
- Simplicity for our use case (we need basic intervals/chords, not full scores)

If no library fits, fall back to custom SVG components for the limited notation we need.

### Keyboard Input

Context-specific keyboards showing only relevant keys for each exercise:

```
For a "play C to G" exercise — show C through G (or C through A for context):

  ┌──┬─┬──┬─┬──┬──┬─┬──┐
  │  │█│  │█│  │  │█│  │
  │  └┬┘  └┬┘  │  └┬┘  │
  │ C │ D │ E │ F │ G │ A │
  └───┴───┴───┴───┴───┴───┘

For chord building — show one octave:

  ┌──┬─┬──┬─┬──┬──┬─┬──┬─┬──┬─┬──┐
  │  │█│  │█│  │  │█│  │█│  │█│  │
  │  └┬┘  └┬┘  │  └┬┘  └┬┘  └┬┘  │
  │ C │ D │ E │ F │ G │ A │ B │ C │
  └───┴───┴───┴───┴───┴───┴───┴───┘
```

Benefits:
- Fits mobile screens better
- Reduces cognitive load
- Prevents confusion from too many options

### Offline Support

**Decision:** Bundle all content with the app.

Rationale:
- Synthesized audio (not samples) keeps size small
- Lesson content is lightweight JSON (~1MB for all lessons)
- Estimated total app size: 30-40MB
- Offline capability is high-value for learning apps
- Simpler architecture accelerates MVP development

Content updates will require app store releases. Post-MVP, if we add recorded instrument samples or expand significantly, we can revisit with a hybrid download approach.

## Open Questions

1. **Accessibility** — How do we handle the visual notation blocks for users with visual impairments? Options include audio descriptions, alternative text-based representations, or marking these as visual-only with audio alternatives.

2. **Placement quiz** — Should we offer an optional diagnostic quiz to recommend a starting point, or is self-selection sufficient for MVP?

3. **Track unlocking** — Should all tracks be available immediately, or should Foundations be completed (or skipped explicitly) before other tracks appear?

---

## Future Expansion (Post-MVP)

| Feature | Description |
|---------|-------------|
| **Advanced Tracks** | Modes, secondary dominants, jazz harmony, rhythm/meter |
| **Instrument Samples** | Real recordings alongside synthesis |
| **Composition Exercises** | Write a melody, harmonize a bass line |
| **Spaced Repetition** | Intelligent review scheduling for completed content |
| **User Notes** | Let users add personal notes to lessons |
| **Bookmarks** | Save lessons for quick reference |

---

## Appendix: Sample Lesson Script

### Lesson: "What is an Interval?" (Foundations-adjacent / Intervals 1.1)

**Block 1: Text**
> Every melody and every chord is built from intervals — the distance between two notes. Learning to recognize intervals is the foundation of ear training.

**Block 2: Text + Audio**
> Listen to these two notes played one after another. The "distance" you hear between them is an interval.
> [Audio: C4 → E4]

**Block 3: Text + Audio**
> Now listen to a different interval. Notice how the distance sounds larger?
> [Audio: C4 → A4]

**Block 4: Text**
> We measure intervals in half steps — the smallest distance on a piano (one key to the very next). We also give intervals names like "major third" or "perfect fifth."

**Block 5: Audio Quiz**
> Which example has a LARGER interval?
> [Audio A: C4 → D4] [Audio B: C4 → G4]
> Answer: B

**Block 6: Text**
> You just heard the difference between a major 2nd (2 half steps) and a perfect 5th (7 half steps). In upcoming lessons, you'll learn to identify each interval by ear.

**Block 7: Completion**
> Lesson complete! Next: Counting Half Steps

---

*Document version: 1.0 (Draft)*
*Last updated: December 2024*
