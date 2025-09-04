/**
 * @fileoverview Database Service
 * @agentic_contract Core database service with SQLite integration
 * Safe for AI to modify: add new methods, improve queries, extend functionality
 * Requires review: schema changes, performance-critical modifications
 */

import * as SQLite from 'expo-sqlite';
import { AgenticService, ServiceContract } from '@/shared/types/agentic-contracts';
import { TableSchema, DatabaseIndex } from '@/shared/types/database';

const DATABASE_NAME = 'fitness_tracker.db';
const DATABASE_VERSION = 1;

/**
 * @service DatabaseService
 * @agentic_contract Core database operations for the fitness app
 * Safe for AI to modify: add methods, improve queries, extend schema
 */
@AgenticService({
  name: 'DatabaseService',
  description: 'Core database service with SQLite operations',
  methods: [],
  ai_safe: true,
})
export class DatabaseService {
  private static db: SQLite.WebSQLDatabase | null = null;
  private static initialized: boolean = false;

  /**
   * Initialize the database and create tables
   * @agentic_pattern Standard initialization pattern
   */
  public static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.db = SQLite.openDatabase(DATABASE_NAME);
      
      // Enable foreign keys
      await this.executeSql('PRAGMA foreign_keys = ON');
      
      // Create tables
      await this.createTables();
      
      // Create indexes
      await this.createIndexes();
      
      // Insert default data
      await this.insertDefaultData();
      
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize database: ${error}`);
    }
  }

  /**
   * Close the database connection
   * @agentic_safe This method is safe for AI to call
   */
  public static async close(): Promise<void> {
    if (this.db) {
      // SQLite.closeDatabase is not available in expo-sqlite
      // The database will be closed automatically
      this.db = null;
      this.initialized = false;
    }
  }

  /**
   * Reset the database (for testing)
   * @agentic_pattern Standard reset pattern for tests
   */
  public static async reset(): Promise<void> {
    if (this.db) {
      await this.dropTables();
      this.initialized = false;
    }
  }

  /**
   * Execute SQL with parameters
   * @agentic_pattern Standard SQL execution pattern
   */
  public static async executeSql(
    sql: string, 
    params: any[] = []
  ): Promise<SQLite.SQLResultSet> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      this.db!.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            params,
            (_, result) => resolve(result),
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (error) => reject(error)
      );
    });
  }

  /**
   * Get list of tables
   * @agentic_safe This method is safe for AI to call
   */
  public static async getTables(): Promise<string[]> {
    const result = await this.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    return result.rows._array.map(row => row.name);
  }

  /**
   * Get list of indexes
   * @agentic_safe This method is safe for AI to call
   */
  public static async getIndexes(): Promise<string[]> {
    const result = await this.executeSql(
      "SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'"
    );
    return result.rows._array.map(row => row.name);
  }

  /**
   * Get table schema
   * @agentic_safe This method is safe for AI to call
   */
  public static async getTableSchema(tableName: string): Promise<TableSchema[]> {
    const result = await this.executeSql(`PRAGMA table_info(${tableName})`);
    return result.rows._array;
  }

  /**
   * Check if foreign keys are enabled
   * @agentic_safe This method is safe for AI to call
   */
  public static async areForeignKeysEnabled(): Promise<boolean> {
    const result = await this.executeSql('PRAGMA foreign_keys');
    return result.rows._array[0]?.foreign_keys === 1;
  }

  /**
   * Create all database tables
   * @agentic_pattern Table creation following single-user optimization
   */
  private static async createTables(): Promise<void> {
    // Create muscle_groups table
    await this.executeSql(`
      CREATE TABLE IF NOT EXISTS muscle_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL DEFAULT 'primary',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create exercises table (optimized for single user - no user_id)
    await this.executeSql(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        muscle_groups TEXT NOT NULL, -- JSON array
        equipment TEXT, -- JSON array
        instructions TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create workout_templates table
    await this.executeSql(`
      CREATE TABLE IF NOT EXISTS workout_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        estimated_duration INTEGER, -- minutes
        difficulty_level INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create workouts table (optimized for single user - no user_id)
    await this.executeSql(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        notes TEXT,
        started_at TEXT NOT NULL,
        completed_at TEXT,
        status TEXT NOT NULL DEFAULT 'in_progress',
        template_id INTEGER,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (template_id) REFERENCES workout_templates(id) ON DELETE SET NULL
      )
    `);

    // Create workout_exercises table
    await this.executeSql(`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        order_index INTEGER NOT NULL,
        notes TEXT,
        target_sets INTEGER,
        target_reps INTEGER,
        target_weight REAL,
        target_duration INTEGER, -- seconds
        rest_duration INTEGER, -- seconds
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
      )
    `);

    // Create sets table
    await this.executeSql(`
      CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_exercise_id INTEGER NOT NULL,
        set_number INTEGER NOT NULL,
        reps INTEGER,
        weight REAL, -- kg
        duration INTEGER, -- seconds
        distance REAL, -- meters
        rir INTEGER, -- reps in reserve
        rpe INTEGER, -- rate of perceived exertion (1-10)
        notes TEXT,
        completed BOOLEAN NOT NULL DEFAULT 0,
        completed_at TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
      )
    `);

    // Create template_exercises table
    await this.executeSql(`
      CREATE TABLE IF NOT EXISTS template_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        order_index INTEGER NOT NULL,
        target_sets INTEGER NOT NULL,
        target_reps INTEGER,
        target_weight REAL,
        target_duration INTEGER,
        rest_duration INTEGER,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (template_id) REFERENCES workout_templates(id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
      )
    `);
  }

  /**
   * Create database indexes for performance
   * @agentic_pattern Index creation for optimal query performance
   */
  private static async createIndexes(): Promise<void> {
    // Workout indexes
    await this.executeSql('CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(started_at)');
    await this.executeSql('CREATE INDEX IF NOT EXISTS idx_workouts_status ON workouts(status)');
    await this.executeSql('CREATE INDEX IF NOT EXISTS idx_workouts_template ON workouts(template_id)');

    // Exercise indexes
    await this.executeSql('CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name)');
    
    // Workout exercises indexes
    await this.executeSql('CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout ON workout_exercises(workout_id)');
    await this.executeSql('CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise ON workout_exercises(exercise_id)');
    await this.executeSql('CREATE INDEX IF NOT EXISTS idx_workout_exercises_order ON workout_exercises(workout_id, order_index)');

    // Sets indexes
    await this.executeSql('CREATE INDEX IF NOT EXISTS idx_sets_workout_exercise_id ON sets(workout_exercise_id)');
    await this.executeSql('CREATE INDEX IF NOT EXISTS idx_sets_completed ON sets(completed)');
  }

  /**
   * Insert default/seed data
   * @agentic_pattern Default data insertion for app functionality
   */
  private static async insertDefaultData(): Promise<void> {
    // Insert default muscle groups
    const muscleGroups = [
      'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms',
      'Abs', 'Obliques', 'Lower Back', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves'
    ];

    for (const muscleGroup of muscleGroups) {
      await this.executeSql(
        'INSERT OR IGNORE INTO muscle_groups (name, category) VALUES (?, ?)',
        [muscleGroup, 'primary']
      );
    }

    // Insert some basic exercises
    const basicExercises = [
      { name: 'Push-up', muscle_groups: '["Chest", "Shoulders", "Triceps"]', equipment: '[]' },
      { name: 'Pull-up', muscle_groups: '["Back", "Biceps"]', equipment: '["Pull-up Bar"]' },
      { name: 'Squat', muscle_groups: '["Quadriceps", "Glutes", "Hamstrings"]', equipment: '[]' },
      { name: 'Bench Press', muscle_groups: '["Chest", "Shoulders", "Triceps"]', equipment: '["Barbell", "Bench"]' },
      { name: 'Deadlift', muscle_groups: '["Back", "Hamstrings", "Glutes"]', equipment: '["Barbell"]' },
    ];

    for (const exercise of basicExercises) {
      await this.executeSql(
        'INSERT OR IGNORE INTO exercises (name, muscle_groups, equipment) VALUES (?, ?, ?)',
        [exercise.name, exercise.muscle_groups, exercise.equipment]
      );
    }
  }

  /**
   * Drop all tables (for testing)
   * @agentic_pattern Table cleanup for tests
   */
  private static async dropTables(): Promise<void> {
    const tables = ['sets', 'template_exercises', 'workout_exercises', 'workouts', 
                   'workout_templates', 'exercises', 'muscle_groups'];
    
    for (const table of tables) {
      await this.executeSql(`DROP TABLE IF EXISTS ${table}`);
    }
  }
}