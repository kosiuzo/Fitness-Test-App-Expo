/**
 * @fileoverview iOS-style Typography System
 * @agentic_contract Typography following iOS Human Interface Guidelines
 * Safe for AI to modify: add new text styles, extend font combinations
 * Requires review: changes to core font families, accessibility font adjustments
 */

import { Platform } from 'react-native';

/**
 * iOS System Font Configuration
 * Uses SF Pro on iOS, equivalent system fonts on other platforms
 */
export const FontFamily = {
  system: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  systemMedium: Platform.select({
    ios: 'System',
    android: 'Roboto_medium',
    default: 'System',
  }),
  systemBold: Platform.select({
    ios: 'System',
    android: 'Roboto_bold',
    default: 'System',
  }),
  monospace: Platform.select({
    ios: 'SF Mono',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

/**
 * iOS Font Weights
 * Following iOS system font weight specifications
 */
export const FontWeight = {
  ultralight: '100',
  thin: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
} as const;

/**
 * iOS Font Sizes
 * Following iOS Dynamic Type size specifications
 */
export const FontSize = {
  largeTitle: 34,   // iOS Large Title
  title1: 28,       // iOS Title 1
  title2: 22,       // iOS Title 2
  title3: 20,       // iOS Title 3
  headline: 17,     // iOS Headline
  body: 17,         // iOS Body
  callout: 16,      // iOS Callout
  subheadline: 15,  // iOS Subheadline
  footnote: 13,     // iOS Footnote
  caption1: 12,     // iOS Caption 1
  caption2: 11,     // iOS Caption 2
} as const;

/**
 * Line Heights
 * Optimized for readability following iOS standards
 */
export const LineHeight = {
  largeTitle: 41,
  title1: 34,
  title2: 28,
  title3: 25,
  headline: 22,
  body: 22,
  callout: 21,
  subheadline: 20,
  footnote: 18,
  caption1: 16,
  caption2: 13,
} as const;

/**
 * Letter Spacing
 * iOS-specific tracking values
 */
export const LetterSpacing = {
  largeTitle: 0.37,
  title1: 0.36,
  title2: 0.35,
  title3: 0.38,
  headline: -0.41,
  body: -0.41,
  callout: -0.31,
  subheadline: -0.24,
  footnote: -0.08,
  caption1: 0,
  caption2: 0.07,
} as const;

/**
 * Complete Typography Configuration
 * @agentic_pattern These text styles are safe for AI to reference and extend
 */
export const Typography = {
  fontFamily: FontFamily,
  fontWeight: FontWeight,
  fontSize: FontSize,
  lineHeight: LineHeight,
  letterSpacing: LetterSpacing,

  // Complete Text Styles
  textStyles: {
    largeTitle: {
      fontFamily: FontFamily.system,
      fontSize: FontSize.largeTitle,
      fontWeight: FontWeight.regular,
      lineHeight: LineHeight.largeTitle,
      letterSpacing: LetterSpacing.largeTitle,
    },
    title1: {
      fontFamily: FontFamily.system,
      fontSize: FontSize.title1,
      fontWeight: FontWeight.regular,
      lineHeight: LineHeight.title1,
      letterSpacing: LetterSpacing.title1,
    },
    title2: {
      fontFamily: FontFamily.system,
      fontSize: FontSize.title2,
      fontWeight: FontWeight.regular,
      lineHeight: LineHeight.title2,
      letterSpacing: LetterSpacing.title2,
    },
    title3: {
      fontFamily: FontFamily.system,
      fontSize: FontSize.title3,
      fontWeight: FontWeight.regular,
      lineHeight: LineHeight.title3,
      letterSpacing: LetterSpacing.title3,
    },
    headline: {
      fontFamily: FontFamily.system,
      fontSize: FontSize.headline,
      fontWeight: FontWeight.semibold,
      lineHeight: LineHeight.headline,
      letterSpacing: LetterSpacing.headline,
    },
    body: {
      fontFamily: FontFamily.system,
      fontSize: FontSize.body,
      fontWeight: FontWeight.regular,
      lineHeight: LineHeight.body,
      letterSpacing: LetterSpacing.body,
    },
    callout: {
      fontFamily: FontFamily.system,
      fontSize: FontSize.callout,
      fontWeight: FontWeight.regular,
      lineHeight: LineHeight.callout,
      letterSpacing: LetterSpacing.callout,
    },
    subheadline: {
      fontFamily: FontFamily.system,
      fontSize: FontSize.subheadline,
      fontWeight: FontWeight.regular,
      lineHeight: LineHeight.subheadline,
      letterSpacing: LetterSpacing.subheadline,
    },
    footnote: {
      fontFamily: FontFamily.system,
      fontSize: FontSize.footnote,
      fontWeight: FontWeight.regular,
      lineHeight: LineHeight.footnote,
      letterSpacing: LetterSpacing.footnote,
    },
    caption1: {
      fontFamily: FontFamily.system,
      fontSize: FontSize.caption1,
      fontWeight: FontWeight.regular,
      lineHeight: LineHeight.caption1,
      letterSpacing: LetterSpacing.caption1,
    },
    caption2: {
      fontFamily: FontFamily.system,
      fontSize: FontSize.caption2,
      fontWeight: FontWeight.regular,
      lineHeight: LineHeight.caption2,
      letterSpacing: LetterSpacing.caption2,
    },
  },
} as const;

/**
 * Typography utility functions
 * @agentic_pattern These functions are safe for AI to extend
 */
export const TypographyUtils = {
  /**
   * Create custom text style based on iOS typography
   * @agentic_safe This function is safe for AI to use and extend
   */
  createTextStyle: (size: keyof typeof FontSize, weight: keyof typeof FontWeight) => ({
    fontFamily: FontFamily.system,
    fontSize: FontSize[size],
    fontWeight: FontWeight[weight],
    lineHeight: LineHeight[size],
    letterSpacing: LetterSpacing[size],
  }),

  /**
   * Get appropriate font weight for emphasis
   * @agentic_safe This function is safe for AI to call
   */
  getEmphasisWeight: (emphasis: 'none' | 'medium' | 'strong') => {
    switch (emphasis) {
      case 'medium': return FontWeight.medium;
      case 'strong': return FontWeight.bold;
      default: return FontWeight.regular;
    }
  },
};