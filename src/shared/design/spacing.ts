/**
 * @fileoverview Spacing System
 * @agentic_contract Consistent spacing scale for the fitness app
 * Safe for AI to modify: add new spacing values, create spacing utilities
 * Requires review: changes to base spacing scale
 */

/**
 * Base Spacing Scale
 * Using 8px base unit for consistent spacing throughout the app
 */
export const Spacing = {
  xs: 4,     // 0.5 * base
  sm: 8,     // 1 * base
  md: 16,    // 2 * base
  lg: 24,    // 3 * base
  xl: 32,    // 4 * base
  xxl: 48,   // 6 * base
  xxxl: 64,  // 8 * base
} as const;

/**
 * Component-specific spacing
 * @agentic_pattern These spacing values are safe for AI to reference
 */
export const ComponentSpacing = {
  // Screen padding
  screen: {
    horizontal: Spacing.md,
    vertical: Spacing.lg,
  },
  
  // Card spacing
  card: {
    padding: Spacing.md,
    margin: Spacing.sm,
    gap: Spacing.sm,
  },
  
  // List spacing
  list: {
    itemPadding: Spacing.md,
    sectionGap: Spacing.lg,
    itemGap: Spacing.xs,
  },
  
  // Button spacing
  button: {
    padding: {
      vertical: Spacing.sm,
      horizontal: Spacing.md,
    },
    margin: Spacing.xs,
  },
  
  // Input spacing
  input: {
    padding: Spacing.sm,
    margin: Spacing.xs,
  },
  
  // Navigation spacing
  tab: {
    height: 83, // iOS standard tab bar height
    padding: Spacing.xs,
  },
} as const;

/**
 * iOS-specific spacing values
 * Based on iOS Human Interface Guidelines
 */
export const iOSSpacing = {
  // Safe area insets (typical values)
  safeArea: {
    top: 44,      // Status bar + navigation bar
    bottom: 34,   // Home indicator area
    sides: 0,     // No side insets on most devices
  },
  
  // Navigation spacing
  navigation: {
    headerHeight: 44,
    tabBarHeight: 83,
    backButtonPadding: 8,
  },
  
  // Table view spacing
  tableView: {
    cellPadding: 16,
    sectionSpacing: 35,
    headerFooterPadding: 16,
  },
} as const;

/**
 * Spacing utility functions
 * @agentic_pattern These functions are safe for AI to extend
 */
export const SpacingUtils = {
  /**
   * Create consistent margin/padding styles
   * @agentic_safe This function is safe for AI to use
   */
  createSpacing: (vertical?: keyof typeof Spacing, horizontal?: keyof typeof Spacing) => ({
    paddingVertical: vertical ? Spacing[vertical] : undefined,
    paddingHorizontal: horizontal ? Spacing[horizontal] : undefined,
  }),

  /**
   * Create margin styles
   * @agentic_safe This function is safe for AI to use
   */
  createMargin: (vertical?: keyof typeof Spacing, horizontal?: keyof typeof Spacing) => ({
    marginVertical: vertical ? Spacing[vertical] : undefined,
    marginHorizontal: horizontal ? Spacing[horizontal] : undefined,
  }),

  /**
   * Get responsive spacing based on screen size
   * @agentic_safe This function is safe for AI to extend
   */
  getResponsiveSpacing: (baseSpacing: keyof typeof Spacing, screenWidth: number) => {
    // Adjust spacing for larger screens
    const multiplier = screenWidth > 768 ? 1.5 : 1;
    return Spacing[baseSpacing] * multiplier;
  },
};