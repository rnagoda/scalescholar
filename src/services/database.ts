import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'scalescholar.db';

let db: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Get or create the database connection
 * Uses promise-based locking to prevent race conditions when multiple
 * callers request the database simultaneously
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  // If initialization is already in progress, wait for it
  if (dbPromise) return dbPromise;

  // Start initialization and store the promise
  dbPromise = (async () => {
    const database = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await initializeSchema(database);
    db = database;
    return database;
  })();

  return dbPromise;
};

/**
 * Initialize database schema
 */
const initializeSchema = async (database: SQLite.SQLiteDatabase): Promise<void> => {
  await database.execAsync(`
    -- Exercise attempts: individual question history
    CREATE TABLE IF NOT EXISTS exercise_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_type TEXT NOT NULL,
      question_type TEXT NOT NULL,
      correct INTEGER NOT NULL,
      response_time_ms INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Create index for efficient queries
    CREATE INDEX IF NOT EXISTS idx_attempts_exercise_type
      ON exercise_attempts(exercise_type);
    CREATE INDEX IF NOT EXISTS idx_attempts_question_type
      ON exercise_attempts(question_type);
    CREATE INDEX IF NOT EXISTS idx_attempts_created_at
      ON exercise_attempts(created_at);

    -- Unlocks: track unlocked content
    CREATE TABLE IF NOT EXISTS unlocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(exercise_type, item_id)
    );

    -- Sessions: track completed exercise sessions
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_type TEXT NOT NULL,
      total_questions INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL,
      completed_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Voice profile: user's vocal range assessment
    CREATE TABLE IF NOT EXISTS voice_profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lowest_note INTEGER NOT NULL,
      highest_note INTEGER NOT NULL,
      comfortable_low INTEGER NOT NULL,
      comfortable_high INTEGER NOT NULL,
      softest_db REAL,
      loudest_db REAL,
      assessed_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Voice exercise attempts
    CREATE TABLE IF NOT EXISTS voice_exercise_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_type TEXT NOT NULL,
      target_note INTEGER,
      achieved_accuracy REAL,
      time_on_target INTEGER,
      volume_consistency REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Create index for voice exercise queries
    CREATE INDEX IF NOT EXISTS idx_voice_attempts_type
      ON voice_exercise_attempts(exercise_type);
    CREATE INDEX IF NOT EXISTS idx_voice_attempts_created
      ON voice_exercise_attempts(created_at);

    -- Voice training sessions
    CREATE TABLE IF NOT EXISTS voice_training_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_type TEXT NOT NULL,
      questions_count INTEGER NOT NULL,
      correct_count INTEGER NOT NULL,
      average_accuracy REAL,
      duration_seconds INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- XP events: track all XP awards
    CREATE TABLE IF NOT EXISTS xp_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      amount INTEGER NOT NULL,
      details TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for XP queries
    CREATE INDEX IF NOT EXISTS idx_xp_events_source
      ON xp_events(source);
    CREATE INDEX IF NOT EXISTS idx_xp_events_created
      ON xp_events(created_at);

    -- Lesson progress: track lesson completion state
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id TEXT NOT NULL UNIQUE,
      completed INTEGER DEFAULT 0,
      blocks_completed INTEGER DEFAULT 0,
      first_completed_at TEXT,
      last_accessed_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Create index for lesson progress queries
    CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id
      ON lesson_progress(lesson_id);

    -- Lesson block attempts: track individual block results
    CREATE TABLE IF NOT EXISTS lesson_block_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id TEXT NOT NULL,
      block_id TEXT NOT NULL,
      correct INTEGER NOT NULL,
      attempts INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for lesson block queries
    CREATE INDEX IF NOT EXISTS idx_lesson_block_attempts_lesson
      ON lesson_block_attempts(lesson_id);
    CREATE INDEX IF NOT EXISTS idx_lesson_block_attempts_block
      ON lesson_block_attempts(block_id);

    -- Ear School lesson progress
    CREATE TABLE IF NOT EXISTS ear_school_lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id TEXT UNIQUE NOT NULL,
      attempts INTEGER DEFAULT 0,
      best_score INTEGER DEFAULT 0,
      passed INTEGER DEFAULT 0,
      mastered INTEGER DEFAULT 0,
      aced INTEGER DEFAULT 0,
      challenge_mode INTEGER DEFAULT 0,
      first_passed_at TEXT,
      last_attempt_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_ear_school_lessons_lesson_id
      ON ear_school_lessons(lesson_id);

    -- Ear School week progress
    CREATE TABLE IF NOT EXISTS ear_school_weeks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      week_id TEXT UNIQUE NOT NULL,
      lessons_passed INTEGER DEFAULT 0,
      assessment_score INTEGER DEFAULT 0,
      challenge_mode INTEGER DEFAULT 0,
      completed_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_ear_school_weeks_week_id
      ON ear_school_weeks(week_id);

    -- Ear School individual question attempts (for analytics)
    CREATE TABLE IF NOT EXISTS ear_school_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id TEXT NOT NULL,
      question_type TEXT,
      key TEXT,
      correct INTEGER,
      response_time_ms INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_ear_school_attempts_lesson
      ON ear_school_attempts(lesson_id);
    CREATE INDEX IF NOT EXISTS idx_ear_school_attempts_created
      ON ear_school_attempts(created_at);

    -- Ear School adaptive difficulty state
    CREATE TABLE IF NOT EXISTS ear_school_adaptive (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enabled INTEGER DEFAULT 1,
      global_challenge_mode INTEGER DEFAULT 0,
      aced_streak INTEGER DEFAULT 0,
      last_score_below_85_at TEXT
    );
  `);
};

/**
 * Close database connection
 */
export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
    dbPromise = null;
  }
};
