import { DatabaseService } from '@/database/DatabaseService';

describe('Database Schema', () => {
  beforeEach(async () => {
    // Reset database before each test
    await DatabaseService.reset();
  });

  afterAll(async () => {
    // Clean up after tests
    await DatabaseService.close();
  });

  it('should create all required tables', async () => {
    await DatabaseService.initialize();
    const tables = await DatabaseService.getTables();
    
    expect(tables).toContain('exercises');
    expect(tables).toContain('workouts');
    expect(tables).toContain('workout_exercises');
    expect(tables).toContain('sets');
    expect(tables).toContain('muscle_groups');
    expect(tables).toContain('exercise_muscle_groups');
  });

  it('should create proper indexes for performance', async () => {
    await DatabaseService.initialize();
    const indexes = await DatabaseService.getIndexes();
    
    // Check for critical performance indexes
    expect(indexes).toContain('idx_workouts_date');
    expect(indexes).toContain('idx_sets_workout_exercise_id');
    expect(indexes).toContain('idx_exercises_name');
  });

  it('should enforce foreign key constraints', async () => {
    await DatabaseService.initialize();
    
    // Test that foreign key constraints are enabled
    const foreignKeysEnabled = await DatabaseService.areForeignKeysEnabled();
    expect(foreignKeysEnabled).toBe(true);
  });

  it('should have optimized schema for single user', async () => {
    await DatabaseService.initialize();
    
    // Verify that user_id columns are not present (single-user optimization)
    const exercisesSchema = await DatabaseService.getTableSchema('exercises');
    const workoutsSchema = await DatabaseService.getTableSchema('workouts');
    
    expect(exercisesSchema.find(col => col.name === 'user_id')).toBeUndefined();
    expect(workoutsSchema.find(col => col.name === 'user_id')).toBeUndefined();
  });

  it('should have proper data types and constraints', async () => {
    await DatabaseService.initialize();
    
    const exercisesSchema = await DatabaseService.getTableSchema('exercises');
    const workoutsSchema = await DatabaseService.getTableSchema('workouts');
    
    // Check exercises table structure
    const nameColumn = exercisesSchema.find(col => col.name === 'name');
    expect(nameColumn?.notnull).toBe(1); // NOT NULL constraint
    expect(nameColumn?.pk).toBe(0); // Not primary key
    
    // Check workouts table structure
    const startedAtColumn = workoutsSchema.find(col => col.name === 'started_at');
    expect(startedAtColumn?.notnull).toBe(1); // NOT NULL constraint
  });
});