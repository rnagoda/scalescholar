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
