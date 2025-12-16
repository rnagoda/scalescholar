/**
 * DraggableItem Component
 *
 * A draggable item for drag-and-drop interactions.
 * Uses react-native-gesture-handler and react-native-reanimated.
 */

import React from 'react';
import { StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { colors, fonts, spacing } from '../../../theme';

interface Position {
  x: number;
  y: number;
}

interface DraggableItemProps {
  id: string;
  label: string;
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string, position: Position) => void;
  onDrop?: (id: string, dropZoneId: string | null) => void;
  disabled?: boolean;
  style?: ViewStyle;
  isPlaced?: boolean;
  placedInZone?: string | null;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  label,
  onDragStart,
  onDragEnd,
  disabled = false,
  style,
  isPlaced = false,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
      scale.value = withSpring(1.1);
      zIndex.value = 100;
      if (onDragStart) {
        runOnJS(onDragStart)(id);
      }
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      zIndex.value = 0;
      if (onDragEnd) {
        runOnJS(onDragEnd)(id, {
          x: translateX.value,
          y: translateY.value,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.container,
          isPlaced && styles.placed,
          disabled && styles.disabled,
          style,
          animatedStyle,
        ]}
      >
        <Text style={[styles.label, isPlaced && styles.placedLabel]}>
          {label}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.accentBlue,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placed: {
    borderColor: colors.accentGreen,
    backgroundColor: colors.accentGreen + '20',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
  },
  placedLabel: {
    color: colors.accentGreen,
  },
});
