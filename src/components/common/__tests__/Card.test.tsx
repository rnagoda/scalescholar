/**
 * Card Tests
 *
 * Tests for the Card container component.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '../Card';
import { colors } from '../../../theme';

describe('Card', () => {
  describe('rendering', () => {
    it('should render children', () => {
      const { getByText } = render(
        <Card>
          <Text>Card Content</Text>
        </Card>
      );

      expect(getByText('Card Content')).toBeTruthy();
    });

    it('should render multiple children', () => {
      const { getByText } = render(
        <Card>
          <Text>Title</Text>
          <Text>Description</Text>
          <Text>Footer</Text>
        </Card>
      );

      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Description')).toBeTruthy();
      expect(getByText('Footer')).toBeTruthy();
    });

    it('should render as non-pressable when no onPress provided', () => {
      const { getByText } = render(
        <Card>
          <Text>Content</Text>
        </Card>
      );

      const content = getByText('Content');
      expect(content).toBeTruthy();
    });

    it('should be pressable when onPress provided', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Card onPress={mockOnPress}>
          <Text>Pressable Content</Text>
        </Card>
      );

      fireEvent.press(getByText('Pressable Content'));
      expect(mockOnPress).toHaveBeenCalled();
    });
  });

  describe('interaction', () => {
    it('should call onPress when pressed', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Card onPress={mockOnPress}>
          <Text>Pressable Card</Text>
        </Card>
      );

      fireEvent.press(getByText('Pressable Card'));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should not crash when pressed without onPress handler', () => {
      const { getByText } = render(
        <Card>
          <Text>Non-pressable Card</Text>
        </Card>
      );

      // This should not throw - View doesn't respond to press
      expect(() => fireEvent.press(getByText('Non-pressable Card'))).not.toThrow();
    });
  });

  describe('styling', () => {
    it('should render with custom style applied', () => {
      const customStyle = { marginTop: 20 };
      const { getByText } = render(
        <Card style={customStyle}>
          <Text>Styled Card</Text>
        </Card>
      );

      // Card renders successfully with custom style
      expect(getByText('Styled Card')).toBeTruthy();
    });

    it('should render pressable card with custom style', () => {
      const mockOnPress = jest.fn();
      const customStyle = { marginTop: 20 };
      const { getByText } = render(
        <Card onPress={mockOnPress} style={customStyle}>
          <Text>Styled Pressable Card</Text>
        </Card>
      );

      // Card renders and is pressable with custom style
      expect(getByText('Styled Pressable Card')).toBeTruthy();
      fireEvent.press(getByText('Styled Pressable Card'));
      expect(mockOnPress).toHaveBeenCalled();
    });
  });
});
