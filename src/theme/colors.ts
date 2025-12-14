/**
 * Scale Scholar Color Palette
 *
 * Retro terminal aesthetic with dark backgrounds and accent colors.
 */

export const colors = {
  // Backgrounds
  background: '#121212',
  cardBackground: '#1C1C1E',
  cardBorder: '#2C2C2E',

  // Text
  textPrimary: '#E5E5E7',
  textSecondary: '#8E8E93',
  textMuted: '#636366',

  // Accents
  accentGreen: '#32D74B',
  accentPink: '#FF6B6B',
  accentBlue: '#0A84FF',

  // Progress bar
  progressTrack: '#2C2C2E',
  progressFill: '#32D74B',

  // Borders & dividers
  divider: '#2C2C2E',
  border: '#3A3A3C',

  // Transparent variants
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorKey = keyof typeof colors;
export type Color = (typeof colors)[ColorKey];
