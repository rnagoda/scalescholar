import React, { useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { AnswerButton } from './AnswerButton';
import { spacing } from '../../theme';

type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect';

interface AnswerOption<T> {
  value: T;
  label: string;
}

interface AnswerGridProps<T> {
  options: AnswerOption<T>[];
  onSelect: (value: T) => void;
  getState: (value: T) => AnswerState;
  disabled?: boolean;
  /** Force specific column count. If not set, auto-calculates based on container width */
  columns?: number;
}

export function AnswerGrid<T>({
  options,
  onSelect,
  getState,
  disabled = false,
  columns: forcedColumns,
}: AnswerGridProps<T>) {
  // Measure actual container width instead of using screen width
  // This handles modals on iPad which don't take full screen
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  // Auto-calculate columns based on container width if not forced
  // iPhone: ~375-430px = 2 columns
  // iPad modal: ~600-700px = 4 columns (but cap at options length if fewer)
  // Android phones: ~360-420px = 2 columns
  const getColumnsForWidth = (width: number): number => {
    if (width >= 500) {
      // Wide container - use 4 columns, but cap at option count
      return Math.min(4, options.length);
    }
    // Narrow container - 2 columns
    return 2;
  };

  const columns = forcedColumns ?? getColumnsForWidth(containerWidth);

  // Split options into rows
  const rows: AnswerOption<T>[][] = [];
  for (let i = 0; i < options.length; i += columns) {
    rows.push(options.slice(i, i + columns));
  }

  // Don't render buttons until we have measured the container
  if (containerWidth === 0) {
    return <View style={styles.container} onLayout={handleLayout} />;
  }

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((option, colIndex) => (
            <AnswerButton
              key={`${rowIndex}-${colIndex}`}
              label={option.label}
              onPress={() => onSelect(option.value)}
              state={getState(option.value)}
              disabled={disabled}
              columns={columns}
              containerWidth={containerWidth}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
