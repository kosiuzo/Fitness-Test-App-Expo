import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { QuickExerciseAdd } from '@/shared/components/QuickExerciseAdd';

// Mock services
jest.mock('@/shared/services/ExerciseRepository', () => ({
  ExerciseRepository: {
    findAll: jest.fn(),
    search: jest.fn(),
  },
}));

jest.mock('@/shared/hooks/useRecentExercises', () => ({
  useRecentExercises: jest.fn(() => ({
    recentExercises: [
      { id: 1, name: 'Push-up', muscle_groups: '["Chest"]' },
      { id: 2, name: 'Pull-up', muscle_groups: '["Back"]' },
    ],
    loading: false,
  })),
}));

jest.mock('@/shared/hooks/usePredictNextExercise', () => ({
  usePredictNextExercise: jest.fn(() => ({
    predictedExercises: [
      { id: 3, name: 'Squat', muscle_groups: '["Legs"]' },
    ],
    loading: false,
  })),
}));

describe('QuickExerciseAdd', () => {
  const mockOnAddExercise = jest.fn();
  const mockCurrentWorkout = {
    exercises: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add exercise in under 3 seconds', async () => {
    const startTime = Date.now();
    
    render(
      <QuickExerciseAdd 
        onAddExercise={mockOnAddExercise}
        currentWorkout={mockCurrentWorkout}
      />
    );
    
    const recentExerciseButton = screen.getByTestId('recent-exercise-0');
    fireEvent.press(recentExerciseButton);
    
    await waitFor(() => {
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(3000);
      expect(mockOnAddExercise).toHaveBeenCalledWith(1, expect.any(Object));
    });
  });

  it('should display recent exercises', () => {
    render(
      <QuickExerciseAdd 
        onAddExercise={mockOnAddExercise}
        currentWorkout={mockCurrentWorkout}
      />
    );
    
    expect(screen.getByText('Push-up')).toBeTruthy();
    expect(screen.getByText('Pull-up')).toBeTruthy();
  });

  it('should show predictive suggestions based on current workout', () => {
    render(
      <QuickExerciseAdd 
        onAddExercise={mockOnAddExercise}
        currentWorkout={mockCurrentWorkout}
      />
    );
    
    expect(screen.getByText('Squat')).toBeTruthy();
  });

  it('should support search functionality', async () => {
    const { ExerciseRepository } = require('@/shared/services/ExerciseRepository');
    ExerciseRepository.search.mockResolvedValue([
      { id: 4, name: 'Deadlift', muscle_groups: '["Back", "Legs"]' },
    ]);

    render(
      <QuickExerciseAdd 
        onAddExercise={mockOnAddExercise}
        currentWorkout={mockCurrentWorkout}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search exercises...');
    fireEvent.changeText(searchInput, 'deadlift');
    
    await waitFor(() => {
      expect(screen.getByText('Deadlift')).toBeTruthy();
    });
  });

  it('should show default sets/reps suggestions', () => {
    render(
      <QuickExerciseAdd 
        onAddExercise={mockOnAddExercise}
        currentWorkout={mockCurrentWorkout}
      />
    );
    
    const recentExerciseButton = screen.getByTestId('recent-exercise-0');
    fireEvent.press(recentExerciseButton);
    
    expect(mockOnAddExercise).toHaveBeenCalledWith(1, {
      targetSets: 3,
      targetReps: 10,
      restDuration: 60,
    });
  });

  it('should support quick customization of sets/reps', async () => {
    render(
      <QuickExerciseAdd 
        onAddExercise={mockOnAddExercise}
        currentWorkout={mockCurrentWorkout}
      />
    );
    
    // Long press to open customization
    const recentExerciseButton = screen.getByTestId('recent-exercise-0');
    fireEvent(recentExerciseButton, 'onLongPress');
    
    await waitFor(() => {
      expect(screen.getByTestId('quick-customize-modal')).toBeTruthy();
    });
    
    // Modify sets
    const setsInput = screen.getByTestId('target-sets-input');
    fireEvent.changeText(setsInput, '4');
    
    const confirmButton = screen.getByTestId('confirm-add-button');
    fireEvent.press(confirmButton);
    
    expect(mockOnAddExercise).toHaveBeenCalledWith(1, expect.objectContaining({
      targetSets: 4,
    }));
  });

  it('should group exercises by muscle group for better organization', () => {
    render(
      <QuickExerciseAdd 
        onAddExercise={mockOnAddExercise}
        currentWorkout={mockCurrentWorkout}
      />
    );
    
    // Should show muscle group headers
    expect(screen.getByText('Chest')).toBeTruthy();
    expect(screen.getByText('Back')).toBeTruthy();
  });
});