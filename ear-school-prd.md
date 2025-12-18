# Ear School PRD
## Scale Scholar — Structured Curriculum Module

**Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Draft

---

## Overview

Ear School is Scale Scholar's guided curriculum module — a 4-week structured program that takes users from basic pitch awareness through rhythm identification. Unlike the free-practice exercises elsewhere in Scale Scholar, Ear School provides a sequential learning path with clear progression, assessments, and mastery gates.

**Position within Scale Scholar:**
- **Ear School** — Structured curriculum (this document)
- **Voice School** — Vocal training exercises (separate PRD)
- **Music Theory** — Conceptual learning (separate PRD)

---

## Target User

Musicians between casual and serious who want structured ear training guidance rather than open-ended practice. Users who benefit from knowing "what to learn next" and want measurable progress through a defined curriculum.

---

## Design Principles

1. **Sequential but not gated** — Curriculum has a recommended order, but users can start anywhere
2. **Ear-first** — Every interaction prioritizes listening; visual elements support, never replace, audio
3. **Assessment-driven** — Each lesson ends with a scored assessment that determines mastery
4. **Minimal friction** — No hand signs, no movement instructions, no classroom artifacts — just the ear training core

---

## Musical Coverage

Ear training benefits from variety. Practicing only in C major trains pattern recognition, not true pitch relationship awareness. Ear School uses a broad musical palette:

### Keys

**Major keys used:** C, G, D, F, B♭, E♭, A  
**Minor keys used:** A minor, E minor, D minor, G minor

Key selection per exercise is randomized from the appropriate pool, with the reference scale/chord always establishing the current key before questions.

### Key Distribution by Week

| Week | Key Approach |
|------|--------------|
| Week 1 | Primarily C major and G major (fewer accidentals for beginners) |
| Week 2 | Intervals from roots in C, G, D, F (interval quality is key-agnostic, but varied roots prevent pitch memorization) |
| Week 3 | All major keys; introduces A minor and E minor for scale comparison |
| Week 4 | Rhythm exercises use varied keys; integration exercises pull from full key pool |

### Interval Roots

Interval exercises vary the starting pitch to prevent users from memorizing absolute pitches:
- Root notes span C3 to C5 range
- Both ascending and descending intervals
- Harmonic intervals (notes together) in later lessons

### Why This Matters

A user who can identify a perfect 5th starting on C but not on F♯ hasn't truly internalized the interval — they've memorized a specific sound. Varied keys build transferable skills.

---

## Curriculum Structure

### Week 1: Basic Solfège & Pitch Awareness

**Learning Goal:** Recognize and identify Do-Re-Mi (scale degrees 1-2-3) by ear in various keys

**Lesson 1.1: Finding Do (Home Base)**
- Concept: Do as the tonal center / "home" note
- Exercise type: **Identify the tonic**
- User hears a short melodic phrase, must tap which note is Do
- Phrases end on Do, Re, or Mi — user identifies which is "home"
- Keys: C major and G major
- 10 questions, 70% to pass

**Lesson 1.2: Do-Re-Mi Recognition**
- Concept: First three scale degrees as a unit
- Exercise type: **Scale degree identification**
- User hears reference scale, then single note — identifies as 1, 2, or 3
- Keys: C major, G major, F major
- 10 questions, 70% to pass

**Lesson 1.3: Do-Re-Mi Patterns**
- Concept: Recognizing melodic patterns within the trichord
- Exercise type: **Pattern matching**
- User hears a 3-note pattern (e.g., 3-2-1, 1-2-3, 2-1-2), selects from 4 options
- Patterns displayed as numbers: `[3-2-1]` `[1-2-3]` `[2-3-2]` `[1-3-1]`
- Keys: C major, G major, F major, D major
- 10 questions, 70% to pass

**Week 1 Assessment:**
- 15 questions mixing all three lesson types
- Keys randomized from Week 1 pool
- 80% for "Week Completed" bonus XP
- Displays accuracy breakdown by lesson type

---

### Week 2: Perfect Intervals

**Learning Goal:** Identify perfect unison, perfect 5th, and octave by ear from any root

**Lesson 2.1: Unison vs. Different**
- Concept: Same pitch recognition
- Exercise type: **Same or different**
- User hears two notes (melodic), identifies if they're the same pitch or different
- Roots varied across C3-C5 range
- 10 questions, 70% to pass

**Lesson 2.2: Perfect 5th (Do-Sol)**
- Concept: The stable, open sound of P5
- Exercise type: **Interval identification**
- User hears an interval, identifies as unison, 5th, or octave
- Intervals played melodically (ascending), roots varied (C, D, E, F, G, A, B)
- Reference: "Twinkle Twinkle" opening interval displayed as hint (first 5 questions only)
- 10 questions, 70% to pass

**Lesson 2.3: Perfect Interval Discrimination**
- Concept: Distinguishing all three perfect intervals in any direction
- Exercise type: **Three-way identification**
- User hears interval, selects: `[Unison]` `[Perfect 5th]` `[Octave]`
- Mix of ascending and descending melodic intervals
- Roots span full range; includes enharmonic roots (F♯/G♭)
- 15 questions, 70% to pass

**Week 2 Assessment:**
- 15 questions covering all perfect intervals
- Roots fully randomized, both ascending and descending
- 80% for "Week Completed" bonus XP
- Displays accuracy breakdown: Unison / P5 / Octave

---

### Week 3: Major Scale Construction

**Learning Goal:** Recognize all seven scale degrees in any major key and understand whole/half step patterns

**Lesson 3.1: The Upper Tetrachord (Sol-La-Ti-Do)**
- Concept: Extending beyond Do-Re-Mi to complete the scale
- Exercise type: **Scale degree identification**
- After reference scale, user identifies single notes as 5, 6, 7, or 8(1)
- Keys: C, G, D, F, B♭ major
- 10 questions, 70% to pass

**Lesson 3.2: Full Scale Degree Recognition**
- Concept: All seven degrees in context
- Exercise type: **Scale degree identification (expanded)**
- User hears reference scale, then single note — identifies 1 through 7
- Answer buttons: `[1]` `[2]` `[3]` `[4]` `[5]` `[6]` `[7]`
- Keys: All major keys (C, G, D, A, E, F, B♭, E♭)
- 15 questions, 70% to pass

**Lesson 3.3: Whole Step vs. Half Step**
- Concept: The building blocks of scales
- Exercise type: **Interval quality identification**
- User hears two adjacent notes, identifies as whole step or half step
- No key context — raw interval discrimination from varied roots
- 10 questions, 70% to pass

**Lesson 3.4: Major vs. Minor Scale Recognition**
- Concept: Hearing the difference between major and natural minor
- Exercise type: **Scale quality identification**
- User hears a complete scale, identifies as major or minor
- Major keys: C, G, D, F | Minor keys: A, E, D, G
- Introduces the parallel and relative minor concept
- 10 questions, 70% to pass

**Week 3 Assessment:**
- 20 questions mixing scale degrees, intervals, and major/minor identification
- Full key variety
- 80% for "Week Completed" bonus XP
- Displays accuracy breakdown by lesson type

---

### Week 4: Simple Rhythms

**Learning Goal:** Identify basic note values and simple rhythmic patterns

**Lesson 4.1: Quarter Note Pulse**
- Concept: Steady beat as rhythmic foundation
- Exercise type: **Pulse identification**
- User hears a melodic phrase, selects how many beats (quarter notes) it contains
- Options: `[2]` `[3]` `[4]` `[5]`
- All phrases use only quarter notes initially
- Keys: Varied (C, G, D, F major)
- 10 questions, 70% to pass

**Lesson 4.2: Half Notes and Whole Notes**
- Concept: Notes that span multiple beats
- Exercise type: **Note value identification**
- User hears a single held note with audible pulse underneath
- Identifies duration: `[1 beat]` `[2 beats]` `[4 beats]`
- Single pitch (no key context needed)
- 10 questions, 70% to pass

**Lesson 4.3: Simple Rhythm Patterns**
- Concept: Combining note values into patterns
- Exercise type: **Pattern matching (rhythm)**
- User hears a 4-beat rhythm pattern
- Selects matching notation from 4 visual options
- Notation displayed as: `♩ ♩ ♩ ♩` or `𝅗𝅥 ♩ ♩` or `𝅝` etc.
- Single repeated pitch to isolate rhythm
- 10 questions, 70% to pass

**Lesson 4.4: Rhythm + Pitch Integration**
- Concept: Hearing rhythm in melodic context
- Exercise type: **Combined identification**
- User hears a simple melody
- Identifies both the rhythm pattern AND the starting scale degree
- Two-part answer: rhythm selection + scale degree selection
- Keys: Full pool (major and minor)
- 10 questions, 70% to pass

**Week 4 Assessment (Final):**
- 20 questions covering all rhythm concepts
- Includes integration questions combining pitch and rhythm
- Full key variety on melodic questions
- 80% for "Week Completed" bonus XP + "Ear School Graduate" achievement (500 XP)

---

## Exercise Mechanics

### Audio Playback

**Reference tones:**
- All pitch exercises begin with a reference (scale or chord in the current key)
- Key is randomized per question from the lesson's key pool
- User can replay reference at any time via `[↻ Reference]` button
- Question audio replays via `[↻ Replay]` button (unlimited replays)

**Instrument sound:** Piano tone (default) or pure sine wave (user setting)

**Tempo:** 
- Pitch exercises: 90 BPM default
- Rhythm exercises: 60 BPM default (slower for clarity)
- User can adjust in settings (50-120 BPM range)

### Answer Input

**Button layout:**
- 2-4 answer options: horizontal row
- 5-7 answer options: two rows or circular/arc arrangement
- Selected answer highlights immediately, confirms on release

**Feedback:**
- Correct: Green flash + subtle chime + brief "Correct" text
- Incorrect: Red flash + correct answer highlighted + "The answer was [X]"
- No sound effects during exercises (per Scale Scholar design decision)

### Progress Display

**During lesson:**
- Question counter: `3 of 10`
- No running score shown (reduces anxiety)

**After lesson:**
- Score: `8/10 — 80%`
- Pass/fail status with encouraging message
- Option to retry or continue

### Progression Model

**Self-selection:** Users can start any week or lesson at any time. No content is locked. This respects that users arrive with varying experience levels.

**Mastery tracking:** Progress is still tracked per lesson, but gates don't block access.

| Threshold | Result | XP Awarded |
|-----------|--------|------------|
| Below 70% | Lesson not passed — encouraged to retry | 0 XP |
| 70-79% | Lesson passed | 50 XP |
| 80-89% | Lesson mastered | 75 XP |
| 90%+ | Lesson aced | 100 XP |
| Week assessment 80%+ | Week completed | 200 XP bonus |

**Challenge mode bonus:** All XP awards are multiplied by 1.5x when completing a lesson in challenge mode. (e.g., acing a challenge mode lesson = 150 XP instead of 100 XP)

**First-time bonus:** First passing attempt awards full XP. Subsequent attempts award 25% XP (encourages revisiting without farming).

**Curriculum completion:** Finishing all 4 weeks with passing scores unlocks "Ear School Graduate" achievement (500 XP bonus).

### Adaptive Difficulty

When a user consistently performs well, the system increases challenge to maintain engagement and growth.

**Triggers for increased difficulty:**
- Score 90%+ on a lesson → next lesson in that week activates "challenge mode"
- Score 90%+ on a week assessment → all lessons in next week start in challenge mode
- Ace 3 lessons in a row → challenge mode activates globally until a score drops below 85%

**Challenge mode modifications:**

| Aspect | Normal | Challenge Mode |
|--------|--------|----------------|
| Questions per lesson | 10-15 | 15-20 |
| Answer time window | Unlimited | 10 seconds (pitch) / 15 seconds (rhythm) |
| Key variety | Lesson's key pool | Expanded pool (all keys) |
| Interval direction | Per lesson spec | Always mixed (ascending + descending) |
| Hints | First 5 questions | Disabled |
| Pass threshold | 70% | 75% |

**Visual indicator:** Challenge mode shows a `[⚡ Challenge]` badge on the lesson card.

**Opting out:** Users can disable adaptive difficulty in Ear School settings if they prefer consistent difficulty.

---

## Scale Scholar Home Screen Integration

Ear School progress appears on the main Scale Scholar home screen alongside Voice School and Music Theory.

### Home Screen Card

```
┌─────────────────────────────────────┐
│  EAR SCHOOL                         │
│  ┌─────────────────────────────┐    │
│  │  Week 2 of 4                │    │
│  │  ████████░░░░░░░░  47%      │    │
│  │                             │    │
│  │  Next: Lesson 2.3           │    │
│  │  Perfect Interval Discrim.  │    │
│  └─────────────────────────────┘    │
│                        [Continue →] │
└─────────────────────────────────────┘
```

**Card displays:**
- Current week / total weeks
- Overall completion percentage (lessons passed / total lessons)
- Next recommended lesson (first incomplete lesson in sequence)
- Quick-launch button to continue

### XP Display

Ear School XP contributes to the user's total Scale Scholar XP shown in the header/profile area. No separate tracking — it's all one pool.

```
┌─────────────────────────────────────┐
│  SCALE SCHOLAR           1,247 XP   │
├─────────────────────────────────────┤
```

---

## Cross-Module Synergy

Ear School and Music Theory are complementary — one trains recognition, the other builds understanding. Completing content in one module can unlock related content in the other.

### Ear School → Music Theory Unlocks

| Ear School Completion | Unlocks in Music Theory |
|-----------------------|-------------------------|
| Lesson 1.1: Finding Do | "Tonal Center & Key" theory lesson |
| Lesson 2.2: Perfect 5th | "The Circle of Fifths" theory lesson |
| Lesson 3.3: Whole/Half Steps | "Scale Construction" theory lesson |
| Lesson 3.4: Major vs. Minor | "Relative & Parallel Minor" theory lesson |
| Week 4 Assessment | "Rhythm Notation Basics" theory lesson |

### Music Theory → Ear School Unlocks

| Music Theory Completion | Unlocks in Ear School |
|-------------------------|----------------------|
| "Interval Names" theory lesson | Bonus lesson: "All Interval Recognition" (m2-M7) |
| "Chord Construction" theory lesson | Bonus lesson: "Triad Quality by Ear" |
| "Key Signatures" theory lesson | Challenge mode: All 12 major keys unlocked early |

### Implementation Notes

- Unlocks are additive — they grant early access, not exclusive access
- Users who complete the unlocking content see a toast: `"🔓 Unlocked: [Lesson Name] in [Module]"`
- Unlocked content shows a `[🔗]` badge indicating it was unlocked via cross-module progress
- If a user hasn't completed the unlocking content but reaches the lesson naturally, they can still access it

---

## Navigation & UI

### Ear School Home Screen

```
┌─────────────────────────────────────┐
│  [←]          EAR SCHOOL            │
├─────────────────────────────────────┤
│                                     │
│  WEEK 1: Basic Solfège        ●●●○  │
│  ┌─────────────────────────────┐    │
│  │ ✓ Lesson 1.1  Finding Do    │    │
│  │ ✓ Lesson 1.2  Do-Re-Mi      │    │
│  │ ✓ Lesson 1.3  Patterns      │    │
│  │ ○ Assessment                │    │
│  └─────────────────────────────┘    │
│                                     │
│  WEEK 2: Perfect Intervals    ○○○○  │
│  ┌─────────────────────────────┐    │
│  │ ○ Lesson 2.1  Same/Diff     │    │
│  │ ○ Lesson 2.2  Perfect 5th   │    │
│  │ ○ Lesson 2.3  Discrimination│    │
│  │ ○ Assessment                │    │
│  └─────────────────────────────┘    │
│                                     │
│  [Continue: Week 1 Assessment]      │
│                                     │
└─────────────────────────────────────┘

✓ = Passed    ★ = Mastered (80%+)    ○ = Not attempted
All weeks accessible — tap any lesson to begin
```

### Lesson Screen (During Exercise)

```
┌─────────────────────────────────────┐
│  [×]     Lesson 2.2      4 of 10    │
├─────────────────────────────────────┤
│                                     │
│         What interval is this?      │
│                                     │
│              [▶ Play]               │
│                                     │
│         [↻ Reference]               │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌───────┐  │
│  │ Unison  │ │   P5    │ │Octave │  │
│  └─────────┘ └─────────┘ └───────┘  │
│                                     │
└─────────────────────────────────────┘
```

**Challenge mode variant:**
```
┌─────────────────────────────────────┐
│  [×]  Lesson 2.2 [⚡]    4 of 15    │
├─────────────────────────────────────┤
│                          ⏱️ 0:08    │
│         What interval is this?      │
│                                     │
...
```
- `[⚡]` badge indicates challenge mode
- Timer counts down from 10 seconds (pitch) or 15 seconds (rhythm)
- Question count increased (15-20 instead of 10-15)

### Results Screen

```
┌─────────────────────────────────────┐
│          LESSON COMPLETE            │
├─────────────────────────────────────┤
│                                     │
│              8 / 10                 │
│               80%                   │
│                                     │
│            ✓ PASSED                 │
│                                     │
│   "Nice work! You've mastered       │
│    the perfect 5th interval."       │
│                                     │
│  ┌─────────────┐ ┌───────────────┐  │
│  │   Retry     │ │   Continue    │  │
│  └─────────────┘ └───────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## Data Model

### Lesson Progress

```typescript
interface LessonProgress {
  lessonId: string;           // e.g., "ear-school-1.2"
  attempts: number;           // total attempts
  bestScore: number;          // highest percentage achieved
  passed: boolean;            // met 70% threshold
  mastered: boolean;          // met 80% threshold
  aced: boolean;              // met 90% threshold
  lastAttemptDate: string;    // ISO date
  challengeMode: boolean;     // is challenge mode active for this lesson
}
```

### Week Progress

```typescript
interface WeekProgress {
  weekId: string;             // e.g., "ear-school-week-2"
  lessonsCompleted: number;   // count of passed lessons
  assessmentScore: number;    // percentage on week assessment
  unlocked: boolean;          // can user access this week
  completedDate: string | null;
  challengeModeActive: boolean; // triggered by 90%+ on previous week assessment
}
```

### Adaptive Difficulty State

```typescript
interface AdaptiveDifficultyState {
  enabled: boolean;           // user preference
  globalChallengeMode: boolean; // 3+ aced lessons in a row
  acedStreak: number;         // current streak of 90%+ scores
  lastScoreBelow85: string;   // ISO date of last sub-85% score
}
```

### Cross-Module Unlocks

```typescript
interface ModuleUnlock {
  sourceModule: 'ear-school' | 'music-theory' | 'voice-school';
  sourceLessonId: string;     // lesson that triggered the unlock
  targetModule: 'ear-school' | 'music-theory' | 'voice-school';
  targetLessonId: string;     // lesson that was unlocked
  unlockedAt: string;         // ISO date
  viewed: boolean;            // has user seen the unlock toast
}
```

### Exercise History (for analytics)

```typescript
interface ExerciseAttempt {
  lessonId: string;
  questionType: string;       // e.g., "interval-id", "scale-degree"
  questionData: object;       // what was asked
  key: string;                // e.g., "C major", "A minor"
  userAnswer: string;
  correctAnswer: string;
  correct: boolean;
  responseTimeMs: number;
  timestamp: string;
}
```

### Key Pool Definition

```typescript
interface LessonKeyPool {
  lessonId: string;
  majorKeys: string[];        // e.g., ["C", "G", "D", "F"]
  minorKeys: string[];        // e.g., ["Am", "Em"] — empty for lessons without minor
}
```

---

## Audio Generation Requirements

### Key Support

The audio engine must generate content in any key. Required capabilities:
- Transpose any pattern to any of the 12 major keys
- Generate natural minor scales in A, E, D, G minor (MVP)
- Reference scales/chords in the current key before each question

### New Audio Patterns Needed

1. **Melodic phrases ending on specific degrees** (Week 1)
   - Short 4-6 note phrases in major keys
   - Clearly establish tonic through melodic movement
   - End on 1, 2, or 3
   - Must work in any key from the lesson's key pool

2. **Two-note melodic intervals** (Week 2)
   - Ascending and descending
   - Consistent rhythmic spacing (500ms gap)
   - Root note randomized within C3-C5 range

3. **Whole step / half step pairs** (Week 3)
   - Isolated interval sounds
   - Varied starting pitches (not just white keys)

4. **Major and minor scale playback** (Week 3)
   - Complete ascending scales for identification
   - Support for parallel and relative minor comparisons

5. **Rhythmic patterns with audible pulse** (Week 4)
   - Metronome click or bass note on beats
   - Melodic notes on top following rhythm pattern
   - Rhythm-only exercises use single repeated pitch
   - Integration exercises use varied pitches in current key

---

## Content Generation

Each lesson requires a pool of questions larger than the lesson length to ensure variety on retry. Recommended pool sizes:

| Lesson Length | Question Pool Size |
|---------------|-------------------|
| 10 questions  | 25-30 questions   |
| 15 questions  | 35-40 questions   |
| 20 questions  | 45-50 questions   |

Questions should be generated programmatically where possible (e.g., interval exercises), with hand-crafted content where musical judgment is needed (e.g., melodic phrases).

---

## Settings (Ear School Specific)

These settings appear in a lesson-start screen or Ear School settings:

| Setting | Options | Default |
|---------|---------|---------|
| Reference pitch | A4 = 440Hz / 432Hz / 442Hz | 440Hz |
| Tempo | 50-120 BPM slider | 90 BPM (pitch) / 60 BPM (rhythm) |
| Auto-advance | On / Off | On |
| Show hints | On / Off | On (first 5 questions only) |
| Adaptive difficulty | On / Off | On |

---

## Success Metrics

**Completion:**
- % of users who complete Week 1
- % of users who complete all 4 weeks
- Average attempts per lesson

**Engagement:**
- Lessons completed per session
- Return rate (users who come back after first session)
- Time spent in Ear School vs. free practice

**Learning:**
- Score improvement across attempts
- Time-to-mastery per lesson type
- Which lessons have highest fail rates (indicates difficulty calibration needed)

---

## Open Questions

*All major design questions resolved. Document ready for implementation review.*

---

## Post-MVP Enhancements

1. **Additional weeks** — Extend curriculum to 8+ weeks covering major/minor 3rds, all intervals, chord quality, chord progressions
2. **Modes** — Dorian, Mixolydian, and other modes beyond major/natural minor
3. **Harmonic intervals** — Notes played simultaneously, not just melodically
4. **Dictation exercises** — User notates what they hear (more complex input)
5. **Daily practice mode** — Spaced repetition review of completed material
6. **Streak tracking** — Encourage daily Ear School practice
7. **Compound meters** — 6/8, 9/8, 12/8 time signatures in rhythm exercises
8. **Cross-module bonus lessons** — "All Interval Recognition" and "Triad Quality by Ear" (unlocked via Music Theory progress)

---

## Implementation Priority

**Phase 1: Core Framework**
- Ear School navigation and progress tracking
- Lesson/assessment flow UI
- Basic audio playback for exercises
- Scale Scholar home screen card integration

**Phase 2: Week 1 Content**
- Do-Re-Mi exercises with key variety (C, G, F, D major)
- Pattern matching UI
- Week 1 assessment

**Phase 3: Week 2 Content**
- Interval exercises with varied roots
- Same/different UI variant

**Phase 4: Week 3 Content**
- Full scale degree recognition across all major keys
- Whole/half step exercises
- Major vs. minor scale identification (introduces minor keys)

**Phase 5: Week 4 Content**
- Rhythm pattern audio generation
- Rhythm notation display
- Integrated pitch+rhythm exercises

**Phase 6: Adaptive Difficulty**
- Challenge mode detection logic
- Timed answer UI variant
- Expanded key pools for challenge mode
- Settings toggle

**Phase 7: Polish**
- Progress analytics
- Completion achievements
- XP award animations
- Settings refinement

**Phase 8: Cross-Module Integration**
- Unlock trigger system between Ear School and Music Theory
- Unlock toast notifications
- `[🔗]` badge display for cross-unlocked content
- Bonus lessons (requires Music Theory module to exist)

---

*Document version 1.0 — Ready for implementation review*
