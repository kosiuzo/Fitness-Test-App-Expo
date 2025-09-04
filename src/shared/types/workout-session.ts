/**
 * @fileoverview Workout Session Types
 * @agentic_contract Type definitions for workout session management
 * Safe for AI to modify: add new session states, extend existing types
 * Requires review: changes to core session structure
 */

import { Exercise, Workout } from './database';

export interface WorkoutSet {
  id?: number;
  setNumber: number;
  reps?: number;
  weight?: number; // in kg
  duration?: number; // in seconds
  distance?: number; // in meters
  rir?: number; // reps in reserve
  rpe?: number; // rate of perceived exertion (1-10)
  notes?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface WorkoutExerciseSession {
  id?: number;
  exercise: Exercise;
  orderIndex: number;
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  targetDuration?: number;
  restDuration?: number; // in seconds
  notes?: string;
  sets: WorkoutSet[];
  restStartTime?: string;
  lastSetCompletedAt?: string;
  createdAt: string;
}

export interface WorkoutSession extends Omit<Workout, 'id'> {
  id?: number;
  exercises: WorkoutExerciseSession[];
  currentExerciseIndex?: number;
  currentSetNumber?: number;
  totalDuration?: number; // calculated in real-time
  isAutoSaving: boolean;
  lastSavedAt?: string;
  
  // Session metadata
  sessionStartTime: string;
  pausedTime?: number; // accumulated paused time in seconds
  isPaused: boolean;
}

export interface AddExerciseOptions {
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  targetDuration?: number;
  restDuration?: number;
  notes?: string;
}

export interface CompleteSetData {
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  rir?: number;
  rpe?: number;
  notes?: string;
}

export interface WorkoutSessionStats {
  totalDuration: number; // in seconds
  totalSets: number;
  completedSets: number;
  totalReps: number;
  totalWeight: number; // in kg
  exerciseCount: number;
  averageRestTime: number; // in seconds
}

export interface UseWorkoutSessionReturn {
  // State
  session: WorkoutSession | null;
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  duration: number; // current workout duration in seconds
  isResting: boolean;
  currentRest: {
    exerciseIndex: number;
    timeRemaining: number; // in seconds
  } | null;

  // Actions
  startWorkout: (templateId?: number) => Promise<void>;
  addExercise: (exerciseId: number, options?: AddExerciseOptions) => Promise<void>;
  removeExercise: (exerciseIndex: number) => Promise<void>;
  reorderExercises: (fromIndex: number, toIndex: number) => void;
  
  // Set management
  completeSet: (exerciseIndex: number, setData: CompleteSetData) => Promise<void>;
  undoSet: (exerciseIndex: number, setIndex: number) => Promise<void>;
  startRest: (exerciseIndex: number) => void;
  skipRest: () => void;
  
  // Workout control
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  completeWorkout: (notes?: string) => Promise<void>;
  cancelWorkout: () => Promise<void>;
  
  // Recovery and persistence
  recoverWorkout: () => Promise<void>;
  saveWorkout: () => Promise<void>;
  
  // Utilities
  getStats: () => WorkoutSessionStats;
  getExerciseProgress: (exerciseIndex: number) => {
    completedSets: number;
    totalSets: number;
    progressPercentage: number;
  };
  getWorkoutProgress: () => {
    completedSets: number;
    totalSets: number;
    progressPercentage: number;
  };
}