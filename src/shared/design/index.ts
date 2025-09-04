/**
 * @fileoverview Design System Exports
 * @agentic_contract Central export for all design system tokens
 * Safe for AI to modify: add new exports, organize imports
 * Requires review: breaking changes to export structure
 */

// Import all design tokens
import { Colors, ColorUtils } from './colors';
import { Typography, FontFamily, FontWeight, FontSize, LineHeight, LetterSpacing, TypographyUtils } from './typography';
import { Spacing, ComponentSpacing, iOSSpacing, SpacingUtils } from './spacing';
import { BorderRadius, ComponentBorderRadius, iOSBorderRadius, BorderRadiusUtils } from './border-radius';

// Export all design tokens
export { Colors, ColorUtils };
export { Typography, FontFamily, FontWeight, FontSize, LineHeight, LetterSpacing, TypographyUtils };
export { Spacing, ComponentSpacing, iOSSpacing, SpacingUtils };
export { BorderRadius, ComponentBorderRadius, iOSBorderRadius, BorderRadiusUtils };

/**
 * Complete Theme Configuration
 * @agentic_pattern This theme object is safe for AI to reference and extend
 */
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  
  // Component-specific configurations
  components: {
    spacing: ComponentSpacing,
    borderRadius: ComponentBorderRadius,
  },
  
  // Platform-specific values
  ios: {
    spacing: iOSSpacing,
    borderRadius: iOSBorderRadius,
  },
} as const;

/**
 * Theme type for TypeScript support
 * @agentic_safe This type is safe for AI to reference
 */
export type ThemeType = typeof Theme;