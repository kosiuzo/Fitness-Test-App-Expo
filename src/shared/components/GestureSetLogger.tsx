/**
 * @fileoverview Gesture-Based Set Logger Component
 * @agentic_contract One-handed gesture control for workout logging
 * Safe for AI to modify: add new gestures, improve feedback, enhance accessibility
 * Requires review: core gesture recognition changes, timing adjustments
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { 
  TapGestureHandler, 
  LongPressGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius } from '@/shared/design';
import { WorkoutSet } from '@/shared/types/workout-session';

const { width: screenWidth } = Dimensions.get('window');

interface WorkoutExerciseData {
  id: number;
  name: string;
  targetSets?: number;
  targetReps?: number;
  sets: WorkoutSet[];
}

interface GestureSetLoggerProps {
  exercise: WorkoutExerciseData;
  currentSetIndex: number;
  onCompleteSet: (setData: { reps?: number; weight?: number }) => void;
  onStartRest: () => void;
  onUndo: () => void;
  onNextSet: () => void;
  showHints?: boolean;
}

/**
 * @component GestureSetLogger
 * @description Gesture-based set logging for one-handed operation
 * @agentic_pattern Gesture recognition with haptic feedback
 */
export const GestureSetLogger: React.FC<GestureSetLoggerProps> = ({
  exercise,
  currentSetIndex,
  onCompleteSet,
  onStartRest,
  onUndo,
  onNextSet,
  showHints = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [showGestureFeedback, setShowGestureFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Animated values for visual feedback
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;

  // Gesture timing constants
  const DOUBLE_TAP_DELAY = 300;
  const LONG_PRESS_DURATION = 800;
  const SWIPE_THRESHOLD = 50;

  const currentSet = exercise.sets[currentSetIndex];
  const isLastSet = currentSetIndex >= (exercise.targetSets || 3) - 1;

  /**
   * Handle tap gesture with double-tap detection
   * @agentic_pattern Double-tap detection for rest timer
   */
  const handleTap = useCallback(async () => {
    const now = Date.now();
    
    if (now - lastTapTime < DOUBLE_TAP_DELAY) {
      // Double tap detected - start rest
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showFeedback('Rest Started', Colors.primary);
      onStartRest();
      setLastTapTime(0);
    } else {
      // Single tap - just record time
      setLastTapTime(now);
    }
  }, [lastTapTime, onStartRest]);

  /**
   * Handle long press for set completion
   * @agentic_pattern Long press with visual feedback
   */
  const handleLongPressStart = useCallback(() => {
    setIsPressed(true);
    setShowGestureFeedback(true);
    setFeedbackText('Hold to Complete');

    // Start visual feedback animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: LONG_PRESS_DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Light haptic feedback on press start
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [scaleAnim, progressAnim, feedbackOpacity]);

  /**
   * Handle successful long press completion
   * @agentic_pattern Set completion with success feedback
   */
  const handleLongPressComplete = useCallback(async () => {
    // Success haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    showFeedback('Set Complete!', Colors.success);
    
    // Complete the set with previous values or defaults
    const setData = {
      reps: currentSet?.reps || exercise.targetReps || 10,
      weight: currentSet?.weight || undefined,
    };
    
    onCompleteSet(setData);
    resetAnimations();
  }, [currentSet, exercise.targetReps, onCompleteSet]);

  /**
   * Handle long press cancellation
   * @agentic_safe This function handles gesture cancellation
   */
  const handleLongPressCancel = useCallback(() => {
    setIsPressed(false);
    resetAnimations();
  }, []);

  /**
   * Reset all animations to initial state
   * @agentic_safe This function resets visual state
   */
  const resetAnimations = useCallback(() => {
    setIsPressed(false);
    setShowGestureFeedback(false);
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(feedbackOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, progressAnim, feedbackOpacity]);

  /**
   * Show temporary feedback message
   * @agentic_safe This function shows user feedback
   */
  const showFeedback = useCallback((text: string, color: string = Colors.primary) => {
    setFeedbackText(text);
    setShowGestureFeedback(true);
    
    Animated.sequence([
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(feedbackOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowGestureFeedback(false);
    });
  }, [feedbackOpacity]);

  /**
   * Pan responder for swipe gestures
   * @agentic_pattern Swipe gesture recognition
   */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 50;
      },
      onPanResponderMove: (_, gestureState) => {
        // Provide visual feedback during swipe
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          const direction = gestureState.dx > 0 ? 'right' : 'left';
          if (direction === 'left') {
            setFeedbackText('← Undo');
          } else {
            setFeedbackText('Next Set →');
          }
          setShowGestureFeedback(true);
          Animated.timing(feedbackOpacity, { toValue: 1, duration: 100, useNativeDriver: true }).start();
        }
      },
      onPanResponderRelease: async (_, gestureState) => {
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          
          if (gestureState.dx < -SWIPE_THRESHOLD) {
            // Swipe left - undo
            onUndo();
            showFeedback('Undone', Colors.warning);
          } else if (gestureState.dx > SWIPE_THRESHOLD) {
            // Swipe right - next set
            onNextSet();
            showFeedback('Next Set', Colors.primary);
          }
        } else {
          // Cancel feedback if swipe wasn't completed
          Animated.timing(feedbackOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
          setShowGestureFeedback(false);
        }
      },
    })
  ).current;

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      resetAnimations();
    };
  }, [resetAnimations]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.gestureArea} testID="gesture-area" {...panResponder.panHandlers}>
        
        {/* Main Set Display */}
        <TapGestureHandler onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            handleTap();
          }
        }}>
          <LongPressGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.BEGAN) {
                handleLongPressStart();
              } else if (nativeEvent.state === State.ACTIVE) {
                handleLongPressComplete();
              } else if (nativeEvent.state === State.CANCELLED || nativeEvent.state === State.FAILED) {
                handleLongPressCancel();
              }
            }}
            minDurationMs={LONG_PRESS_DURATION}
          >
            <Animated.View 
              style={[
                styles.setContainer,
                { transform: [{ scale: scaleAnim }] },
                isPressed && styles.setContainerPressed
              ]}
              testID="current-set"
              accessible={true}
              accessibilityLabel={`Set ${currentSetIndex + 1} of ${exercise.targetSets || 3}. Tap and hold to complete.`}
              accessibilityHint="Double tap to start rest timer, swipe left to undo, swipe right for next set"
            >
              
              {/* Progress Indicator */}
              {isPressed && (
                <Animated.View
                  style={[
                    styles.progressIndicator,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              )}
              
              {/* Set Information */}
              <View style={styles.setInfo}>
                <Text style={styles.setNumber}>
                  Set {currentSetIndex + 1} of {exercise.targetSets || 3}
                </Text>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                
                <View style={styles.setDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Reps</Text>
                    <Text style={styles.detailValue}>
                      {currentSet?.reps || exercise.targetReps || 10}
                    </Text>
                  </View>
                  
                  {currentSet?.weight && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Weight</Text>
                      <Text style={styles.detailValue}>
                        {currentSet.weight}kg
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          </LongPressGestureHandler>
        </TapGestureHandler>

        {/* Gesture Feedback */}
        {showGestureFeedback && (
          <Animated.View 
            style={[styles.feedbackContainer, { opacity: feedbackOpacity }]}
            testID="gesture-feedback"
          >
            <Text style={styles.feedbackText}>{feedbackText}</Text>
          </Animated.View>
        )}

        {/* Gesture Hints */}
        {showHints && (
          <View style={styles.hintsContainer}>
            <Text style={styles.hintText}>• Hold to complete set</Text>
            <Text style={styles.hintText}>• Double tap for rest timer</Text>
            <Text style={styles.hintText}>• Swipe left/right to navigate</Text>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gestureArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  setContainer: {
    width: screenWidth - (Spacing.lg * 2),
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.separator.default,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  setContainerPressed: {
    borderColor: Colors.primary,
    backgroundColor: Colors.fill.primary,
  },
  progressIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: Colors.success,
    opacity: 0.3,
  },
  setInfo: {
    zIndex: 1,
  },
  setNumber: {
    fontSize: Typography.fontSize.caption1,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily.system,
  },
  exerciseName: {
    fontSize: Typography.fontSize.title2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily.system,
  },
  setDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: Typography.fontSize.footnote,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily.system,
  },
  detailValue: {
    fontSize: Typography.fontSize.title1,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily.system,
  },
  feedbackContainer: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    backgroundColor: Colors.overlay.light,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  feedbackText: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    textAlign: 'center',
    fontFamily: Typography.fontFamily.system,
  },
  hintsContainer: {
    position: 'absolute',
    bottom: Spacing.lg,
    alignSelf: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  hintText: {
    fontSize: Typography.fontSize.footnote,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginVertical: 2,
    fontFamily: Typography.fontFamily.system,
  },
});