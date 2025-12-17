/**
 * ProgressBar Tests
 *
 * Tests for the progress bar component.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressBar } from '../ProgressBar';
import { colors } from '../../../theme';

describe('ProgressBar', () => {
  describe('rendering', () => {
    it('should render track and fill', () => {
      const { UNSAFE_getAllByType } = render(<ProgressBar progress={0.5} />);

      // Should have track (outer) and fill (inner) Views
      const views = UNSAFE_getAllByType('View' as any);
      expect(views.length).toBeGreaterThanOrEqual(2);
    });

    it('should render with 0% progress', () => {
      const { UNSAFE_getAllByType } = render(<ProgressBar progress={0} />);
      const views = UNSAFE_getAllByType('View' as any);

      // Find the fill view (second view)
      const fillView = views[1];
      expect(fillView.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: '0%' })])
      );
    });

    it('should render with 50% progress', () => {
      const { UNSAFE_getAllByType } = render(<ProgressBar progress={0.5} />);
      const views = UNSAFE_getAllByType('View' as any);

      const fillView = views[1];
      expect(fillView.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: '50%' })])
      );
    });

    it('should render with 100% progress', () => {
      const { UNSAFE_getAllByType } = render(<ProgressBar progress={1} />);
      const views = UNSAFE_getAllByType('View' as any);

      const fillView = views[1];
      expect(fillView.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: '100%' })])
      );
    });
  });

  describe('progress clamping', () => {
    it('should clamp negative progress to 0', () => {
      const { UNSAFE_getAllByType } = render(<ProgressBar progress={-0.5} />);
      const views = UNSAFE_getAllByType('View' as any);

      const fillView = views[1];
      expect(fillView.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: '0%' })])
      );
    });

    it('should clamp progress above 1 to 100%', () => {
      const { UNSAFE_getAllByType } = render(<ProgressBar progress={1.5} />);
      const views = UNSAFE_getAllByType('View' as any);

      const fillView = views[1];
      expect(fillView.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: '100%' })])
      );
    });
  });

  describe('colors', () => {
    it('should use default track color', () => {
      const { UNSAFE_getAllByType } = render(<ProgressBar progress={0.5} />);
      const views = UNSAFE_getAllByType('View' as any);

      const trackView = views[0];
      expect(trackView.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: colors.progressTrack }),
        ])
      );
    });

    it('should use default fill color', () => {
      const { UNSAFE_getAllByType } = render(<ProgressBar progress={0.5} />);
      const views = UNSAFE_getAllByType('View' as any);

      const fillView = views[1];
      expect(fillView.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: colors.progressFill }),
        ])
      );
    });

    it('should use custom track color', () => {
      const customColor = '#333333';
      const { UNSAFE_getAllByType } = render(
        <ProgressBar progress={0.5} trackColor={customColor} />
      );
      const views = UNSAFE_getAllByType('View' as any);

      const trackView = views[0];
      expect(trackView.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: customColor }),
        ])
      );
    });

    it('should use custom fill color', () => {
      const customColor = '#00FF00';
      const { UNSAFE_getAllByType } = render(
        <ProgressBar progress={0.5} fillColor={customColor} />
      );
      const views = UNSAFE_getAllByType('View' as any);

      const fillView = views[1];
      expect(fillView.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: customColor }),
        ])
      );
    });
  });

  describe('styling', () => {
    it('should apply custom style to track', () => {
      const customStyle = { marginTop: 10 };
      const { UNSAFE_getAllByType } = render(
        <ProgressBar progress={0.5} style={customStyle} />
      );
      const views = UNSAFE_getAllByType('View' as any);

      const trackView = views[0];
      expect(trackView.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)])
      );
    });
  });

  describe('edge cases', () => {
    it('should handle very small progress values', () => {
      const { UNSAFE_getAllByType } = render(<ProgressBar progress={0.001} />);
      const views = UNSAFE_getAllByType('View' as any);

      const fillView = views[1];
      expect(fillView.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '0.1%' }),
        ])
      );
    });

    it('should handle progress at exact boundaries', () => {
      // Test exactly 0
      const { UNSAFE_getAllByType: getAllAt0 } = render(
        <ProgressBar progress={0} />
      );
      expect(getAllAt0('View' as any)[1].props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: '0%' })])
      );

      // Test exactly 1
      const { UNSAFE_getAllByType: getAllAt1 } = render(
        <ProgressBar progress={1} />
      );
      expect(getAllAt1('View' as any)[1].props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: '100%' })])
      );
    });
  });
});
