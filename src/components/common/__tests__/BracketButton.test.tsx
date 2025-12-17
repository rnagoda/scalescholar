/**
 * BracketButton Tests
 *
 * Tests for the signature bracketed button component.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BracketButton } from '../BracketButton';
import { colors } from '../../../theme';

describe('BracketButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe('rendering', () => {
    it('should render label with brackets', () => {
      const { getByText } = render(
        <BracketButton label="TEST" onPress={mockOnPress} />
      );

      expect(getByText('[ ')).toBeTruthy();
      expect(getByText('TEST')).toBeTruthy();
      expect(getByText(' ]')).toBeTruthy();
    });

    it('should render different labels', () => {
      const { getByText, rerender } = render(
        <BracketButton label="PLAY" onPress={mockOnPress} />
      );
      expect(getByText('PLAY')).toBeTruthy();

      rerender(<BracketButton label="SETTINGS" onPress={mockOnPress} />);
      expect(getByText('SETTINGS')).toBeTruthy();
    });

    it('should render single character labels', () => {
      const { getByText } = render(
        <BracketButton label="X" onPress={mockOnPress} />
      );
      expect(getByText('X')).toBeTruthy();
    });

    it('should render special characters', () => {
      const { getByText } = render(
        <BracketButton label="+" onPress={mockOnPress} />
      );
      expect(getByText('+')).toBeTruthy();
    });
  });

  describe('interaction', () => {
    it('should call onPress when pressed', () => {
      const { getByText } = render(
        <BracketButton label="TEST" onPress={mockOnPress} />
      );

      fireEvent.press(getByText('TEST'));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const { getByText } = render(
        <BracketButton label="TEST" onPress={mockOnPress} disabled />
      );

      fireEvent.press(getByText('TEST'));

      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('styling', () => {
    it('should use default text color', () => {
      const { getByText } = render(
        <BracketButton label="TEST" onPress={mockOnPress} />
      );

      const label = getByText('TEST');
      expect(label.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: colors.textPrimary }),
        ])
      );
    });

    it('should use custom color when provided', () => {
      const customColor = '#FF0000';
      const { getByText } = render(
        <BracketButton label="TEST" onPress={mockOnPress} color={customColor} />
      );

      const label = getByText('TEST');
      expect(label.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: customColor })])
      );
    });

    it('should use muted color when disabled', () => {
      const { getByText } = render(
        <BracketButton label="TEST" onPress={mockOnPress} disabled />
      );

      const label = getByText('TEST');
      expect(label.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: colors.textMuted }),
        ])
      );
    });

    it('should apply muted color to brackets when disabled', () => {
      const { getByText } = render(
        <BracketButton label="TEST" onPress={mockOnPress} disabled />
      );

      const openBracket = getByText('[ ');
      expect(openBracket.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: colors.textMuted }),
        ])
      );
    });
  });

  describe('accessibility', () => {
    it('should be pressable', () => {
      const { getByText } = render(
        <BracketButton label="TEST" onPress={mockOnPress} />
      );

      // Should be able to press the label
      const label = getByText('TEST');
      expect(label).toBeTruthy();
      fireEvent.press(label);
      expect(mockOnPress).toHaveBeenCalled();
    });
  });
});
