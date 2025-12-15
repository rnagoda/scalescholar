import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, fonts } from '@/src/theme';

interface SettingRowProps {
  label: string;
  value: string;
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * A row displaying a setting label and its current value
 * Tapping cycles through options or opens a picker
 */
export const SettingRow: React.FC<SettingRowProps> = ({
  label,
  value,
  onPress,
  disabled = false,
}) => {
  const content = (
    <View style={styles.container}>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, disabled && styles.valueDisabled]}>
          {value}
        </Text>
        {onPress && !disabled && (
          <Text style={styles.chevron}>{' >'}</Text>
        )}
      </View>
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

interface SettingToggleProps {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

/**
 * A toggle setting row with On/Off display
 */
export const SettingToggle: React.FC<SettingToggleProps> = ({
  label,
  value,
  onToggle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !disabled && onToggle(!value)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
      <Text style={[
        styles.toggleValue,
        value ? styles.toggleOn : styles.toggleOff,
        disabled && styles.valueDisabled,
      ]}>
        {value ? 'On' : 'Off'}
      </Text>
    </TouchableOpacity>
  );
};

interface SettingOptionProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
}

/**
 * A setting row that cycles through options on tap
 */
export function SettingOption<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: SettingOptionProps<T>) {
  const currentIndex = options.findIndex((opt) => opt.value === value);
  const currentLabel = options[currentIndex]?.label ?? value;

  const handlePress = () => {
    if (disabled) return;
    const nextIndex = (currentIndex + 1) % options.length;
    onChange(options[nextIndex].value);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, disabled && styles.valueDisabled]}>
          {currentLabel}
        </Text>
        {!disabled && <Text style={styles.chevron}>{' >'}</Text>}
      </View>
    </TouchableOpacity>
  );
}

interface SettingNumberProps {
  label: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
  suffix?: string;
  disabled?: boolean;
}

/**
 * A setting row for numeric values that cycles through predefined options
 */
export const SettingNumber: React.FC<SettingNumberProps> = ({
  label,
  value,
  options,
  onChange,
  suffix = '',
  disabled = false,
}) => {
  const currentIndex = options.indexOf(value);

  const handlePress = () => {
    if (disabled) return;
    const nextIndex = (currentIndex + 1) % options.length;
    onChange(options[nextIndex]);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, disabled && styles.valueDisabled]}>
          {value}{suffix}
        </Text>
        {!disabled && <Text style={styles.chevron}>{' >'}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  valueDisabled: {
    color: colors.textMuted,
  },
  chevron: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textMuted,
  },
  toggleValue: {
    fontFamily: fonts.mono,
    fontSize: 14,
  },
  toggleOn: {
    color: colors.accentGreen,
  },
  toggleOff: {
    color: colors.textMuted,
  },
});
