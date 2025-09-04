/**
 * @fileoverview iOS-style Color Palette
 * @agentic_contract Design system colors following iOS Human Interface Guidelines
 * Safe for AI to modify: add new color variants, extend existing color families
 * Requires review: changes to core brand colors, accessibility color adjustments
 */

export const Colors = {
  // iOS System Colors
  primary: '#007AFF', // iOS System Blue
  success: '#34C759', // iOS System Green
  warning: '#FF9500', // iOS System Orange
  error: '#FF3B30',   // iOS System Red
  purple: '#AF52DE',  // iOS System Purple
  pink: '#FF2D92',    // iOS System Pink
  indigo: '#5856D6',  // iOS System Indigo
  teal: '#5AC8FA',    // iOS System Teal
  cyan: '#50E3C2',    // iOS System Cyan
  mint: '#00C7BE',    // iOS System Mint

  // Background Colors
  background: {
    light: '#FFFFFF',
    dark: '#000000',
    secondary: '#F2F2F7',    // iOS System Background Secondary
    tertiary: '#FFFFFF',     // iOS System Background Tertiary
    grouped: '#F2F2F7',      // iOS System Grouped Background
    groupedSecondary: '#FFFFFF', // iOS System Grouped Background Secondary
  },

  // iOS System Grays
  gray: {
    primary: '#8E8E93',     // iOS System Gray
    secondary: '#AEAEB2',   // iOS System Gray 2
    tertiary: '#C7C7CC',    // iOS System Gray 3
    quaternary: '#D1D1D6',  // iOS System Gray 4
    quinary: '#E5E5EA',     // iOS System Gray 5
    senary: '#F2F2F7',      // iOS System Gray 6
  },

  // Text Colors
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#3C3C4399',   // 60% opacity
    quaternary: '#3C3C4366', // 40% opacity
    placeholder: '#3C3C434D', // 30% opacity
    inverse: '#FFFFFF',
  },

  // Label Colors (following iOS semantic colors)
  label: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#3C3C4399',
    quaternary: '#3C3C4366',
  },

  // Fill Colors
  fill: {
    primary: '#78788033',    // 20% opacity
    secondary: '#78788029',  // 16% opacity
    tertiary: '#7676801F',   // 12% opacity
    quaternary: '#74748014', // 8% opacity
  },

  // Separator Colors
  separator: {
    default: '#3C3C4349',    // 29% opacity
    opaque: '#C6C6C8',
  },

  // Overlay Colors
  overlay: {
    light: '#00000066',      // 40% black
    dark: '#FFFFFF66',       // 40% white
  },

  // Utility Colors
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

/**
 * Color utility functions for dynamic theming
 * @agentic_pattern These functions are safe for AI to extend
 */
export const ColorUtils = {
  /**
   * Add opacity to any color
   * @param color - Hex color string
   * @param opacity - Opacity value between 0 and 1
   */
  withOpacity: (color: string, opacity: number): string => {
    const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return `${color}${opacityHex}`;
  },

  /**
   * Get appropriate text color based on background
   * @param backgroundColor - Background color to check
   */
  getContrastText: (backgroundColor: string): string => {
    // Simple contrast check - in production, you might want a more sophisticated algorithm
    const isLight = backgroundColor === Colors.background.light || 
                   backgroundColor === Colors.background.secondary ||
                   backgroundColor === Colors.white;
    return isLight ? Colors.text.primary : Colors.text.inverse;
  },

  /**
   * Get semantic color variants
   * @agentic_safe This function is safe for AI to call and extend
   */
  getSemanticColors: () => ({
    info: Colors.primary,
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
  }),
};