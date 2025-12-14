/**
 * Scale Scholar Spacing Scale
 *
 * Consistent spacing throughout the app.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingKey];

/**
 * Border radius values
 */
export const borderRadius = {
  subtle: 4,
  standard: 8,
  prominent: 12,
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;
export type BorderRadiusValue = (typeof borderRadius)[BorderRadiusKey];
