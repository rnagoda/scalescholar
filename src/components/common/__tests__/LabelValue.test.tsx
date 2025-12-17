/**
 * LabelValue Tests
 *
 * Tests for the label-value display component.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { LabelValue } from '../LabelValue';
import { colors } from '../../../theme';

describe('LabelValue', () => {
  describe('rendering', () => {
    it('should render label and string value', () => {
      const { getByText } = render(
        <LabelValue label="Name" value="John" />
      );

      expect(getByText('Name')).toBeTruthy();
      expect(getByText('John')).toBeTruthy();
    });

    it('should render label and number value', () => {
      const { getByText } = render(
        <LabelValue label="Score" value={100} />
      );

      expect(getByText('Score')).toBeTruthy();
      expect(getByText('100')).toBeTruthy();
    });

    it('should render zero value', () => {
      const { getByText } = render(
        <LabelValue label="Count" value={0} />
      );

      expect(getByText('Count')).toBeTruthy();
      expect(getByText('0')).toBeTruthy();
    });

    it('should render empty string value', () => {
      const { getByText } = render(
        <LabelValue label="Empty" value="" />
      );

      expect(getByText('Empty')).toBeTruthy();
      // Empty string value still renders (Text component exists)
    });

    it('should render special characters in value', () => {
      const { getByText } = render(
        <LabelValue label="Status" value="100%" />
      );

      expect(getByText('100%')).toBeTruthy();
    });

    it('should render negative numbers', () => {
      const { getByText } = render(
        <LabelValue label="Difference" value={-50} />
      );

      expect(getByText('-50')).toBeTruthy();
    });

    it('should render decimal numbers', () => {
      const { getByText } = render(
        <LabelValue label="Average" value={3.14} />
      );

      expect(getByText('3.14')).toBeTruthy();
    });
  });

  describe('styling', () => {
    it('should use secondary color for label', () => {
      const { getByText } = render(
        <LabelValue label="Label" value="Value" />
      );

      const label = getByText('Label');
      expect(label.props.style).toEqual(
        expect.objectContaining({ color: colors.textSecondary })
      );
    });

    it('should use default primary color for value', () => {
      const { getByText } = render(
        <LabelValue label="Label" value="Value" />
      );

      const value = getByText('Value');
      expect(value.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: colors.textPrimary }),
        ])
      );
    });

    it('should use custom color for value', () => {
      const customColor = '#FF0000';
      const { getByText } = render(
        <LabelValue label="Label" value="Value" valueColor={customColor} />
      );

      const value = getByText('Value');
      expect(value.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: customColor })])
      );
    });

    it('should apply green color for positive values', () => {
      const { getByText } = render(
        <LabelValue label="Score" value="100%" valueColor={colors.accentGreen} />
      );

      const value = getByText('100%');
      expect(value.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: colors.accentGreen }),
        ])
      );
    });

    it('should apply custom style to container', () => {
      const customStyle = { marginTop: 20 };
      const { UNSAFE_getByType } = render(
        <LabelValue label="Label" value="Value" style={customStyle} />
      );

      const container = UNSAFE_getByType('View' as any);
      expect(container.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)])
      );
    });
  });

  describe('layout', () => {
    it('should have flex row direction', () => {
      const { UNSAFE_getByType } = render(
        <LabelValue label="Label" value="Value" />
      );

      const container = UNSAFE_getByType('View' as any);
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ flexDirection: 'row' }),
        ])
      );
    });

    it('should have space-between justification', () => {
      const { UNSAFE_getByType } = render(
        <LabelValue label="Label" value="Value" />
      );

      const container = UNSAFE_getByType('View' as any);
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ justifyContent: 'space-between' }),
        ])
      );
    });
  });

  describe('use cases', () => {
    it('should display accuracy percentage', () => {
      const { getByText } = render(
        <LabelValue
          label="Accuracy"
          value="85%"
          valueColor={colors.accentGreen}
        />
      );

      expect(getByText('Accuracy')).toBeTruthy();
      expect(getByText('85%')).toBeTruthy();
    });

    it('should display streak count', () => {
      const { getByText } = render(
        <LabelValue label="Current Streak" value={5} />
      );

      expect(getByText('Current Streak')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
    });

    it('should display XP amount', () => {
      const { getByText } = render(
        <LabelValue label="Total XP" value="1,250" />
      );

      expect(getByText('Total XP')).toBeTruthy();
      expect(getByText('1,250')).toBeTruthy();
    });
  });
});
