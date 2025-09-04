/**
 * @fileoverview Border Radius System
 * @agentic_contract iOS-style border radius values
 * Safe for AI to modify: add new radius values, create radius utilities
 * Requires review: changes to core radius scale
 */

/**
 * Border Radius Scale
 * Following iOS design patterns for rounded corners
 */
export const BorderRadius = {
  none: 0,
  sm: 4,     // Small radius for subtle rounding
  md: 8,     // Medium radius for buttons and inputs
  lg: 12,    // Large radius for cards and modals
  xl: 16,    // Extra large radius for prominent elements
  xxl: 24,   // Very large radius for special cases
  round: 999, // Fully rounded (circular)
} as const;

/**
 * Component-specific border radius
 * @agentic_pattern These values are safe for AI to reference
 */
export const ComponentBorderRadius = {
  // Button radius
  button: {
    primary: BorderRadius.md,
    secondary: BorderRadius.sm,
    fab: BorderRadius.round,
  },
  
  // Card radius
  card: {
    default: BorderRadius.lg,
    small: BorderRadius.md,
    large: BorderRadius.xl,
  },
  
  // Input radius
  input: {
    default: BorderRadius.md,
    search: BorderRadius.lg,
  },
  
  // Modal radius
  modal: {
    default: BorderRadius.xl,
    sheet: BorderRadius.lg,
  },
  
  // Avatar radius
  avatar: {
    square: BorderRadius.sm,
    rounded: BorderRadius.md,
    circle: BorderRadius.round,
  },
  
  // Badge radius
  badge: {
    default: BorderRadius.sm,
    pill: BorderRadius.round,
  },
} as const;

/**
 * iOS-specific border radius values
 * Based on iOS Human Interface Guidelines
 */
export const iOSBorderRadius = {
  // iOS system button radius
  systemButton: 8,
  
  // iOS table view cell radius
  tableViewCell: 10,
  
  // iOS alert radius
  alert: 14,
  
  // iOS sheet radius
  sheet: 16,
  
  // iOS tab bar radius (when floating)
  tabBar: 16,
} as const;

/**
 * Border radius utility functions
 * @agentic_pattern These functions are safe for AI to extend
 */
export const BorderRadiusUtils = {
  /**
   * Create consistent border radius styles
   * @agentic_safe This function is safe for AI to use
   */
  createRadius: (radius: keyof typeof BorderRadius) => ({
    borderRadius: BorderRadius[radius],
  }),

  /**
   * Create individual corner radius
   * @agentic_safe This function is safe for AI to use
   */
  createCornerRadius: (
    topLeft?: keyof typeof BorderRadius,
    topRight?: keyof typeof BorderRadius,
    bottomLeft?: keyof typeof BorderRadius,
    bottomRight?: keyof typeof BorderRadius,
  ) => ({
    borderTopLeftRadius: topLeft ? BorderRadius[topLeft] : undefined,
    borderTopRightRadius: topRight ? BorderRadius[topRight] : undefined,
    borderBottomLeftRadius: bottomLeft ? BorderRadius[bottomLeft] : undefined,
    borderBottomRightRadius: bottomRight ? BorderRadius[bottomRight] : undefined,
  }),

  /**
   * Create responsive border radius based on screen size
   * @agentic_safe This function is safe for AI to extend
   */
  getResponsiveRadius: (baseRadius: keyof typeof BorderRadius, screenWidth: number) => {
    // Adjust radius for larger screens
    const multiplier = screenWidth > 768 ? 1.2 : 1;
    return BorderRadius[baseRadius] * multiplier;
  },

  /**
   * Get appropriate radius for component size
   * @agentic_safe This function is safe for AI to call
   */
  getProportionalRadius: (componentSize: 'small' | 'medium' | 'large') => {
    switch (componentSize) {
      case 'small': return BorderRadius.sm;
      case 'large': return BorderRadius.lg;
      default: return BorderRadius.md;
    }
  },
};