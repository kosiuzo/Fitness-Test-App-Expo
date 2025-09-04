import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { GestureSetLogger } from '@/shared/components/GestureSetLogger';

describe('Gesture Controls', () => {
  const mockOnCompleteSet = jest.fn();
  const mockOnStartRest = jest.fn();
  const mockOnUndo = jest.fn();
  const mockOnNextSet = jest.fn();

  const mockCurrentSet = {
    setNumber: 1,
    reps: 10,
    weight: 50,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const mockExercise = {
    id: 1,
    name: 'Push-up',
    targetSets: 3,
    targetReps: 10,
    sets: [mockCurrentSet],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete set with tap and hold', async () => {
    const { getByTestId } = render(
      <GestureSetLogger
        exercise={mockExercise}
        currentSetIndex={0}
        onCompleteSet={mockOnCompleteSet}
        onStartRest={mockOnStartRest}
        onUndo={mockOnUndo}
        onNextSet={mockOnNextSet}
      />
    );

    const setItem = getByTestId('current-set');
    
    await act(async () => {
      fireEvent(setItem, 'onLongPress');
    });

    expect(mockOnCompleteSet).toHaveBeenCalled();
  });

  it('should start rest timer with double tap', async () => {
    const { getByTestId } = render(
      <GestureSetLogger
        exercise={mockExercise}
        currentSetIndex={0}
        onCompleteSet={mockOnCompleteSet}
        onStartRest={mockOnStartRest}
        onUndo={mockOnUndo}
        onNextSet={mockOnNextSet}
      />
    );

    const setItem = getByTestId('current-set');
    
    // Simulate double tap
    fireEvent.press(setItem);
    fireEvent.press(setItem);

    expect(mockOnStartRest).toHaveBeenCalled();
  });

  it('should provide haptic feedback on interactions', async () => {
    const mockHaptics = {
      impact: jest.fn(),
      success: jest.fn(),
    };

    // Mock expo-haptics
    jest.doMock('expo-haptics', () => mockHaptics);

    const { getByTestId } = render(
      <GestureSetLogger
        exercise={mockExercise}
        currentSetIndex={0}
        onCompleteSet={mockOnCompleteSet}
        onStartRest={mockOnStartRest}
        onUndo={mockOnUndo}
        onNextSet={mockOnNextSet}
      />
    );

    const setItem = getByTestId('current-set');
    
    await act(async () => {
      fireEvent(setItem, 'onLongPress');
    });

    // Should provide haptic feedback on completion
    expect(mockHaptics.success).toHaveBeenCalled();
  });

  it('should show visual feedback during gestures', async () => {
    const { getByTestId } = render(
      <GestureSetLogger
        exercise={mockExercise}
        currentSetIndex={0}
        onCompleteSet={mockOnCompleteSet}
        onStartRest={mockOnStartRest}
        onUndo={mockOnUndo}
        onNextSet={mockOnNextSet}
      />
    );

    const setItem = getByTestId('current-set');
    
    // Start long press
    fireEvent(setItem, 'onPressIn');
    
    // Should show visual feedback
    expect(getByTestId('gesture-feedback')).toBeTruthy();
  });

  it('should support swipe gestures for navigation', () => {
    const { getByTestId } = render(
      <GestureSetLogger
        exercise={mockExercise}
        currentSetIndex={0}
        onCompleteSet={mockOnCompleteSet}
        onStartRest={mockOnStartRest}
        onUndo={mockOnUndo}
        onNextSet={mockOnNextSet}
      />
    );

    const gestureArea = getByTestId('gesture-area');
    
    // Simulate swipe left (undo)
    fireEvent(gestureArea, 'onSwipeLeft');
    expect(mockOnUndo).toHaveBeenCalled();
    
    // Simulate swipe right (next set)
    fireEvent(gestureArea, 'onSwipeRight');
    expect(mockOnNextSet).toHaveBeenCalled();
  });

  it('should be accessible for one-handed operation', () => {
    const { getByTestId } = render(
      <GestureSetLogger
        exercise={mockExercise}
        currentSetIndex={0}
        onCompleteSet={mockOnCompleteSet}
        onStartRest={mockOnStartRest}
        onUndo={mockOnUndo}
        onNextSet={mockOnNextSet}
      />
    );

    // All interactive elements should be within thumb reach
    const setItem = getByTestId('current-set');
    expect(setItem.props.accessibilityLabel).toBeTruthy();
    expect(setItem.props.accessible).toBe(true);
  });

  it('should show gesture hints for new users', () => {
    const { getByText } = render(
      <GestureSetLogger
        exercise={mockExercise}
        currentSetIndex={0}
        onCompleteSet={mockOnCompleteSet}
        onStartRest={mockOnStartRest}
        onUndo={mockOnUndo}
        onNextSet={mockOnNextSet}
        showHints={true}
      />
    );

    expect(getByText(/Hold to complete/i)).toBeTruthy();
    expect(getByText(/Double tap for rest/i)).toBeTruthy();
    expect(getByText(/Swipe to navigate/i)).toBeTruthy();
  });

  it('should handle rapid taps gracefully', async () => {
    const { getByTestId } = render(
      <GestureSetLogger
        exercise={mockExercise}
        currentSetIndex={0}
        onCompleteSet={mockOnCompleteSet}
        onStartRest={mockOnStartRest}
        onUndo={mockOnUndo}
        onNextSet={mockOnNextSet}
      />
    );

    const setItem = getByTestId('current-set');
    
    // Rapid taps should not trigger multiple actions
    fireEvent.press(setItem);
    fireEvent.press(setItem);
    fireEvent.press(setItem);
    fireEvent.press(setItem);

    // Should only trigger double tap once
    expect(mockOnStartRest).toHaveBeenCalledTimes(1);
  });
});