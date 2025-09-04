/**
 * @fileoverview Database Type Definitions
 * @agentic_contract Type definitions for database entities
 * Safe for AI to modify: add new entity types, extend existing types
 * Requires review: changes to core entity structure, database relationships
 */

export interface Exercise {
  id: number;
  name: string;
  muscle_groups: string; // JSON array of muscle group IDs
  equipment: string | null; // JSON array of equipment
  instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface MuscleGroup {
  id: number;
  name: string;
  category: string; // primary, secondary, stabilizer
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: number;
  name: string | null;
  notes: string | null;
  started_at: string;
  completed_at: string | null;
  status: 'in_progress' | 'completed' | 'cancelled';
  template_id: number | null; // Reference to workout template
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: number;
  workout_id: number;
  exercise_id: number;
  order_index: number;
  notes: string | null;
  target_sets: number | null;
  target_reps: number | null;
  target_weight: number | null;
  target_duration: number | null; // in seconds
  rest_duration: number | null; // in seconds
  created_at: string;
  updated_at: string;
}

export interface Set {
  id: number;
  workout_exercise_id: number;
  set_number: number;
  reps: number | null;
  weight: number | null; // in kg
  duration: number | null; // in seconds
  distance: number | null; // in meters
  rir: number | null; // reps in reserve
  rpe: number | null; // rate of perceived exertion (1-10)
  notes: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutTemplate {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  estimated_duration: number | null; // in minutes
  difficulty_level: number; // 1-5
  created_at: string;
  updated_at: string;
}

export interface TemplateExercise {
  id: number;
  template_id: number;
  exercise_id: number;
  order_index: number;
  target_sets: number;
  target_reps: number | null;
  target_weight: number | null;
  target_duration: number | null;
  rest_duration: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Database utility types
export interface TableSchema {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
}

export interface DatabaseIndex {
  name: string;
  unique: number;
  origin: string;
  partial: number;
}

// Input types for database operations
export type CreateExerciseData = Omit<Exercise, 'id' | 'created_at' | 'updated_at'>;
export type UpdateExerciseData = Partial<CreateExerciseData>;

export type CreateWorkoutData = Omit<Workout, 'id' | 'created_at' | 'updated_at'>;
export type UpdateWorkoutData = Partial<CreateWorkoutData>;

export type CreateWorkoutExerciseData = Omit<WorkoutExercise, 'id' | 'created_at' | 'updated_at'>;
export type UpdateWorkoutExerciseData = Partial<CreateWorkoutExerciseData>;

export type CreateSetData = Omit<Set, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSetData = Partial<CreateSetData>;