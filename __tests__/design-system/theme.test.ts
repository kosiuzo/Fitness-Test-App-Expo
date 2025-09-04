import { Colors, Typography, Spacing, BorderRadius } from '@/shared/design';

describe('Design System', () => {
  describe('Colors', () => {
    it('should have iOS-style color palette', () => {
      expect(Colors.primary).toBe('#007AFF');
      expect(Colors.success).toBe('#34C759');
      expect(Colors.warning).toBe('#FF9500');
      expect(Colors.error).toBe('#FF3B30');
    });

    it('should have proper background colors', () => {
      expect(Colors.background.light).toBe('#FFFFFF');
      expect(Colors.background.dark).toBe('#000000');
      expect(Colors.background.secondary).toBe('#F2F2F7');
    });

    it('should have iOS system grays', () => {
      expect(Colors.gray.primary).toBe('#8E8E93');
      expect(Colors.gray.secondary).toBe('#AEAEB2');
      expect(Colors.gray.tertiary).toBe('#C7C7CC');
    });
  });

  describe('Typography', () => {
    it('should have iOS-style font weights', () => {
      expect(Typography.fontWeight.regular).toBe('400');
      expect(Typography.fontWeight.medium).toBe('500');
      expect(Typography.fontWeight.semibold).toBe('600');
      expect(Typography.fontWeight.bold).toBe('700');
    });

    it('should have proper font sizes', () => {
      expect(Typography.fontSize.largeTitle).toBe(34);
      expect(Typography.fontSize.title1).toBe(28);
      expect(Typography.fontSize.title2).toBe(22);
      expect(Typography.fontSize.title3).toBe(20);
      expect(Typography.fontSize.headline).toBe(17);
      expect(Typography.fontSize.body).toBe(17);
      expect(Typography.fontSize.callout).toBe(16);
      expect(Typography.fontSize.subheadline).toBe(15);
      expect(Typography.fontSize.footnote).toBe(13);
      expect(Typography.fontSize.caption1).toBe(12);
      expect(Typography.fontSize.caption2).toBe(11);
    });
  });

  describe('Spacing', () => {
    it('should have consistent spacing scale', () => {
      expect(Spacing.xs).toBe(4);
      expect(Spacing.sm).toBe(8);
      expect(Spacing.md).toBe(16);
      expect(Spacing.lg).toBe(24);
      expect(Spacing.xl).toBe(32);
      expect(Spacing.xxl).toBe(48);
    });
  });

  describe('Border Radius', () => {
    it('should have iOS-style border radius values', () => {
      expect(BorderRadius.sm).toBe(4);
      expect(BorderRadius.md).toBe(8);
      expect(BorderRadius.lg).toBe(12);
      expect(BorderRadius.xl).toBe(16);
      expect(BorderRadius.round).toBe(999);
    });
  });
});