/**
 * PianoKeyboard Component
 *
 * Interactive piano keyboard for Music School lessons.
 * Displays a range of notes and allows tap interaction.
 */

import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { colors, fonts, spacing } from '../../../theme';
import { AudioEngine } from '../../../audio/AudioEngine';

interface PianoKeyboardProps {
  startNote: number; // MIDI note number
  endNote: number; // MIDI note number
  selectedNotes?: number[];
  highlightedNotes?: number[]; // Notes to highlight (e.g., correct answer)
  onNotePress?: (midi: number) => void;
  showLabels?: boolean;
  playOnPress?: boolean;
  disabled?: boolean;
}

// Note names for labels
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Check if a MIDI note is a black key
const isBlackKey = (midi: number): boolean => {
  const noteInOctave = midi % 12;
  return [1, 3, 6, 8, 10].includes(noteInOctave);
};

// Get note name from MIDI number
const getNoteName = (midi: number): string => {
  const noteInOctave = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[noteInOctave]}${octave}`;
};

// Get short note name (without octave)
const getShortNoteName = (midi: number): string => {
  const noteInOctave = midi % 12;
  return NOTE_NAMES[noteInOctave];
};

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  startNote,
  endNote,
  selectedNotes = [],
  highlightedNotes = [],
  onNotePress,
  showLabels = false,
  playOnPress = true,
  disabled = false,
}) => {
  // Generate array of MIDI notes in range
  const notes: number[] = [];
  for (let i = startNote; i <= endNote; i++) {
    notes.push(i);
  }

  // Separate white and black keys
  const whiteKeys = notes.filter((n) => !isBlackKey(n));
  const blackKeys = notes.filter((n) => isBlackKey(n));

  // Calculate key dimensions based on screen width and number of white keys
  const screenWidth = Dimensions.get('window').width;
  const keyboardWidth = screenWidth - spacing.lg * 2;
  const whiteKeyWidth = Math.min(50, keyboardWidth / whiteKeys.length);
  const whiteKeyHeight = whiteKeyWidth * 3.5;
  const blackKeyWidth = whiteKeyWidth * 0.6;
  const blackKeyHeight = whiteKeyHeight * 0.6;

  const handleKeyPress = useCallback(
    async (midi: number) => {
      if (disabled) return;

      if (playOnPress) {
        try {
          await AudioEngine.playMidiNote(midi, 0.5);
        } catch (error) {
          console.error('Failed to play note:', error);
        }
      }

      onNotePress?.(midi);
    },
    [disabled, playOnPress, onNotePress]
  );

  // Get the x position for a black key based on its MIDI number
  const getBlackKeyPosition = (midi: number): number => {
    // Find how many white keys are before this black key
    let whiteKeyCount = 0;
    for (let i = startNote; i < midi; i++) {
      if (!isBlackKey(i)) {
        whiteKeyCount++;
      }
    }
    // Black key position is between the previous and next white keys
    // Offset slightly to the right of the previous white key
    return whiteKeyCount * whiteKeyWidth - blackKeyWidth / 2;
  };

  const isSelected = (midi: number): boolean => selectedNotes.includes(midi);
  const isHighlighted = (midi: number): boolean => highlightedNotes.includes(midi);

  return (
    <View style={[styles.container, { width: whiteKeys.length * whiteKeyWidth }]}>
      {/* White keys */}
      <View style={styles.whiteKeysRow}>
        {whiteKeys.map((midi) => (
          <TouchableOpacity
            key={midi}
            style={[
              styles.whiteKey,
              {
                width: whiteKeyWidth - 2,
                height: whiteKeyHeight,
              },
              isSelected(midi) && styles.whiteKeySelected,
              isHighlighted(midi) && styles.whiteKeyHighlighted,
            ]}
            onPress={() => handleKeyPress(midi)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            {showLabels && (
              <Text
                style={[
                  styles.whiteKeyLabel,
                  isSelected(midi) && styles.selectedLabel,
                ]}
              >
                {getShortNoteName(midi)}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Black keys (positioned absolutely) */}
      {blackKeys.map((midi) => (
        <TouchableOpacity
          key={midi}
          style={[
            styles.blackKey,
            {
              width: blackKeyWidth,
              height: blackKeyHeight,
              left: getBlackKeyPosition(midi),
            },
            isSelected(midi) && styles.blackKeySelected,
            isHighlighted(midi) && styles.blackKeyHighlighted,
          ]}
          onPress={() => handleKeyPress(midi)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          {showLabels && (
            <Text
              style={[
                styles.blackKeyLabel,
                isSelected(midi) && styles.selectedLabel,
              ]}
            >
              {getShortNoteName(midi)}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
  },
  whiteKeysRow: {
    flexDirection: 'row',
  },
  whiteKey: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 4,
    marginHorizontal: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  whiteKeySelected: {
    backgroundColor: colors.accentGreen,
  },
  whiteKeyHighlighted: {
    backgroundColor: colors.accentBlue,
  },
  whiteKeyLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
  },
  blackKey: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.xs,
    zIndex: 1,
  },
  blackKeySelected: {
    backgroundColor: colors.accentGreen,
  },
  blackKeyHighlighted: {
    backgroundColor: colors.accentBlue,
  },
  blackKeyLabel: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.textMuted,
  },
  selectedLabel: {
    color: colors.background,
    fontFamily: fonts.monoBold,
  },
});
