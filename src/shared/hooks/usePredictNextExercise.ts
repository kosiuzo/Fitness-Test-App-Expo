/**
 * @fileoverview Predict Next Exercise Hook
 * @agentic_contract Hook to predict logical next exercises based on current workout
 * Safe for AI to modify: improve prediction algorithm, add ML integration
 * Requires review: major algorithm changes
 */

import { useState, useEffect } from 'react';
import { ExerciseRepository } from '@/shared/services/ExerciseRepository';
import { Exercise } from '@/shared/types/database';
import { WorkoutSession } from '@/shared/types/workout-session';

interface UsePredictNextExerciseReturn {
  predictedExercises: Exercise[];
  loading: boolean;
  error: string | null;
}

/**
 * @hook usePredictNextExercise
 * @agentic_pattern Hook for intelligent exercise predictions
 * AI can extend this with more sophisticated algorithms
 */
export const usePredictNextExercise = (
  currentWorkout: Partial<WorkoutSession> | null,
  limit: number = 3
): UsePredictNextExerciseReturn => {
  const [predictedExercises, setPredictedExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Predict next exercises based on workout composition
   * @agentic_pattern Intelligent prediction with muscle group balancing
   */
  const predictExercises = async (): Promise<void> => {
    if (!currentWorkout?.exercises) {
      setPredictedExercises([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Analyze current workout composition
      const currentMuscleGroups = new Set<string>();
      const exerciseIds = new Set<number>();

      for (const workoutExercise of currentWorkout.exercises) {
        exerciseIds.add(workoutExercise.exercise.id);
        
        try {
          const muscleGroups = JSON.parse(workoutExercise.exercise.muscle_groups);
          muscleGroups.forEach((group: string) => currentMuscleGroups.add(group));
        } catch {
          // Handle invalid JSON gracefully
        }
      }

      // Get all exercises
      const allExercises = await ExerciseRepository.findAll();
      
      // Filter out already added exercises
      const availableExercises = allExercises.filter(ex => !exerciseIds.has(ex.id));

      // Score exercises based on complementary muscle groups
      const scoredExercises = availableExercises.map(exercise => {
        let score = 0;
        
        try {
          const exerciseMuscleGroups = JSON.parse(exercise.muscle_groups);
          
          // Prediction logic based on workout balance
          if (currentWorkout.exercises.length === 0) {
            // First exercise - prioritize compound movements
            if (isCompoundMovement(exercise.name)) {
              score += 10;
            }
          } else {
            // Balance muscle groups
            score += getBalanceScore(exerciseMuscleGroups, currentMuscleGroups);
            
            // Encourage common workout patterns
            score += getWorkoutPatternScore(exercise, currentWorkout.exercises);
          }
          
          // Boost popular exercises
          if (isPopularExercise(exercise.name)) {
            score += 2;
          }
          
        } catch {
          // Handle invalid JSON gracefully
          score = 1;
        }

        return { exercise, score };
      });

      // Sort by score and return top predictions
      const topPredictions = scoredExercises
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.exercise);

      setPredictedExercises(topPredictions);
    } catch (err) {
      setError(`Failed to predict exercises: ${err}`);
      setPredictedExercises([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if exercise is a compound movement
   * @agentic_safe This function is safe for AI to extend
   */
  const isCompoundMovement = (exerciseName: string): boolean => {
    const compoundKeywords = [
      'squat', 'deadlift', 'bench press', 'pull-up', 'chin-up',
      'overhead press', 'row', 'dip', 'push-up'
    ];
    
    return compoundKeywords.some(keyword => 
      exerciseName.toLowerCase().includes(keyword)
    );
  };

  /**
   * Calculate balance score for muscle group distribution
   * @agentic_pattern Scoring algorithm for workout balance
   */
  const getBalanceScore = (
    exerciseMuscleGroups: string[], 
    currentMuscleGroups: Set<string>
  ): number => {
    let score = 0;
    
    // Encourage complementary muscle groups
    const complementaryPairs = [
      ['Chest', 'Back'],
      ['Biceps', 'Triceps'],
      ['Quadriceps', 'Hamstrings'],
      ['Shoulders', 'Back'],
    ];

    for (const [muscle1, muscle2] of complementaryPairs) {
      if (currentMuscleGroups.has(muscle1) && exerciseMuscleGroups.includes(muscle2)) {
        score += 5;
      }
      if (currentMuscleGroups.has(muscle2) && exerciseMuscleGroups.includes(muscle1)) {
        score += 5;
      }
    }

    // Slightly penalize already targeted muscle groups to encourage variety
    for (const muscleGroup of exerciseMuscleGroups) {
      if (currentMuscleGroups.has(muscleGroup)) {
        score -= 1;
      }
    }

    return score;
  };

  /**
   * Score based on common workout patterns
   * @agentic_safe This function is safe for AI to extend
   */
  const getWorkoutPatternScore = (
    exercise: Exercise, 
    currentExercises: any[]
  ): number => {
    let score = 0;
    
    // If last exercise was upper body, suggest lower body
    if (currentExercises.length > 0) {
      const lastExercise = currentExercises[currentExercises.length - 1];
      try {
        const lastMuscleGroups = JSON.parse(lastExercise.exercise.muscle_groups);
        const currentMuscleGroups = JSON.parse(exercise.muscle_groups);
        
        const upperBodyGroups = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'];
        const lowerBodyGroups = ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'];
        
        const lastWasUpper = lastMuscleGroups.some((mg: string) => upperBodyGroups.includes(mg));
        const currentIsLower = currentMuscleGroups.some((mg: string) => lowerBodyGroups.includes(mg));
        
        const lastWasLower = lastMuscleGroups.some((mg: string) => lowerBodyGroups.includes(mg));
        const currentIsUpper = currentMuscleGroups.some((mg: string) => upperBodyGroups.includes(mg));
        
        if ((lastWasUpper && currentIsLower) || (lastWasLower && currentIsUpper)) {
          score += 3;
        }
      } catch {
        // Handle gracefully
      }
    }
    
    return score;
  };

  /**
   * Check if exercise is commonly used
   * @agentic_safe This function is safe for AI to extend
   */
  const isPopularExercise = (exerciseName: string): boolean => {
    const popularExercises = [
      'Push-up', 'Pull-up', 'Squat', 'Bench Press', 'Deadlift',
      'Overhead Press', 'Barbell Row', 'Dumbbell Curl', 'Tricep Dip'
    ];
    
    return popularExercises.includes(exerciseName);
  };

  // Predict exercises when workout changes
  useEffect(() => {
    predictExercises();
  }, [currentWorkout?.exercises?.length, limit]);

  return {
    predictedExercises,
    loading,
    error,
  };
};