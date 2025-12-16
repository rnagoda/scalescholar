/**
 * DropZone Component
 *
 * A target zone for drag-and-drop interactions.
 */

import React, { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, LayoutRectangle } from 'react-native';
import { colors, fonts, spacing } from '../../../theme';

interface DropZoneProps {
  id: string;
  label: string;
  isActive?: boolean;
  isCorrect?: boolean | null;
  droppedItem?: string | null;
  onLayout?: (id: string, layout: LayoutRectangle) => void;
}

export interface DropZoneRef {
  getLayout: () => LayoutRectangle | null;
}

export const DropZone = forwardRef<DropZoneRef, DropZoneProps>(
  ({ id, label, isActive = false, isCorrect = null, droppedItem, onLayout }, ref) => {
    const viewRef = useRef<View>(null);
    const layoutRef = useRef<LayoutRectangle | null>(null);

    useImperativeHandle(ref, () => ({
      getLayout: () => layoutRef.current,
    }));

    const handleLayout = useCallback(() => {
      viewRef.current?.measureInWindow((x, y, width, height) => {
        const layout = { x, y, width, height };
        layoutRef.current = layout;
        onLayout?.(id, layout);
      });
    }, [id, onLayout]);

    const getBorderColor = () => {
      if (isCorrect === true) return colors.accentGreen;
      if (isCorrect === false) return colors.accentPink;
      if (isActive) return colors.accentBlue;
      return colors.cardBorder;
    };

    const getBackgroundColor = () => {
      if (isCorrect === true) return colors.accentGreen + '20';
      if (isCorrect === false) return colors.accentPink + '20';
      if (isActive) return colors.accentBlue + '10';
      return colors.cardBackground;
    };

    return (
      <View
        ref={viewRef}
        onLayout={handleLayout}
        style={[
          styles.container,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
          },
        ]}
      >
        <Text style={styles.label}>{label}</Text>
        {droppedItem && (
          <View style={styles.droppedItemContainer}>
            <Text style={styles.droppedItemText}>{droppedItem}</Text>
          </View>
        )}
      </View>
    );
  }
);

DropZone.displayName = 'DropZone';

const styles = StyleSheet.create({
  container: {
    minWidth: 100,
    minHeight: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  droppedItemContainer: {
    marginTop: spacing.xs,
    backgroundColor: colors.accentBlue + '20',
    borderRadius: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  droppedItemText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
