/**
 * TapBuildBlock Component
 *
 * Interactive block where users tap piano keys to build
 * intervals, chords, or scales.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TapBuildContent } from '../../../types/lesson';
import { colors, fonts, spacing, typography } from '../../../theme';
import { BracketButton } from '../../common/BracketButton';
import { PianoKeyboard } from '../shared/PianoKeyboard';
import { AudioEngine } from '../../../audio/AudioEngine';

interface TapBuildBlockProps {
  content: TapBuildContent;
  onAnswer: (selectedNotes: number[]) => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
  selectedAnswer: number[] | null;
  onContinue: () => void;
}

export const TapBuildBlock: React.FC<TapBuildBlockProps> = ({
  content,
  onAnswer,
  showFeedback,
  isCorrect,
  selectedAnswer,
  onContinue,
}) => {
  const [selectedNotes, setSelectedNotes] = useState<number[]>(
    selectedAnswer || []
  );
  const [hasPlayedReference, setHasPlayedReference] = useState(false);

  // Default keyboard range if not specified
  const startNote = content.startNote ?? 60; // C4
  const endNote = content.endNote ?? 72; // C5

  const handlePlayReference = useCallback(async () => {
    if (!content.playReference) return;

    try {
      const notes = content.expectedNotes;
      switch (content.targetType) {
        case 'notes':
          // Play each note in sequence
          for (const note of notes) {
            await AudioEngine.playMidiNote(note, 0.5);
            await new Promise((resolve) => setTimeout(resolve, 600));
          }
          break;
        case 'interval':
          if (notes.length >= 2) {
            const interval = notes[1] - notes[0];
            const ascending = interval >= 0;
            await AudioEngine.playInterval(
              notes[0],
              Math.abs(interval),
              ascending,
              true
            );
          }
          break;
        case 'chord':
          if (notes.length >= 2) {
            await AudioEngine.playChordMidi(notes, 1.0);
          }
          break;
        case 'scale':
          // Play scale notes in sequence
          for (const note of notes) {
            await AudioEngine.playMidiNote(note, 0.3);
            await new Promise((resolve) => setTimeout(resolve, 400));
          }
          break;
      }
      setHasPlayedReference(true);
    } catch (error) {
      console.error('Failed to play reference:', error);
    }
  }, [content]);

  const handleNotePress = useCallback(
    (midi: number) => {
      if (showFeedback) return;

      setSelectedNotes((prev) => {
        // If note is already selected, remove it
        if (prev.includes(midi)) {
          return prev.filter((n) => n !== midi);
        }
        // Otherwise add it
        return [...prev, midi];
      });
    },
    [showFeedback]
  );

  const handleClear = useCallback(() => {
    setSelectedNotes([]);
  }, []);

  const handleSubmit = useCallback(() => {
    // Sort notes to match expected format (ascending order)
    const sortedNotes = [...selectedNotes].sort((a, b) => a - b);
    onAnswer(sortedNotes);
  }, [selectedNotes, onAnswer]);

  const handlePlaySelected = useCallback(async () => {
    if (selectedNotes.length === 0) return;

    try {
      if (content.targetType === 'chord' && selectedNotes.length >= 2) {
        // Play as chord
        await AudioEngine.playChordMidi(selectedNotes, 1.0);
      } else {
        // Play notes in sequence
        const sortedNotes = [...selectedNotes].sort((a, b) => a - b);
        for (const note of sortedNotes) {
          await AudioEngine.playMidiNote(note, 0.3);
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
    } catch (error) {
      console.error('Failed to play selected notes:', error);
    }
  }, [selectedNotes, content.targetType]);

  const canAnswer = !showFeedback;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Instruction */}
      <Text style={styles.instruction}>{content.instruction}</Text>

      {/* Play Reference Button */}
      {content.playReference && canAnswer && (
        <View style={styles.referenceContainer}>
          <BracketButton
            label={hasPlayedReference ? 'REPLAY' : 'HEAR IT'}
            onPress={handlePlayReference}
          />
        </View>
      )}

      {/* Piano Keyboard */}
      <View style={styles.keyboardContainer}>
        <PianoKeyboard
          startNote={startNote}
          endNote={endNote}
          selectedNotes={selectedNotes}
          highlightedNotes={showFeedback ? content.expectedNotes : []}
          onNotePress={handleNotePress}
          showLabels={content.showLabels}
          playOnPress={canAnswer}
          disabled={showFeedback}
        />
      </View>

      {/* Selected Notes Display */}
      {canAnswer && (
        <View style={styles.selectedDisplay}>
          <Text style={styles.selectedLabel}>
            Selected: {selectedNotes.length} note
            {selectedNotes.length !== 1 ? 's' : ''}
          </Text>
          {selectedNotes.length > 0 && (
            <View style={styles.selectedActions}>
              <BracketButton label="PLAY" onPress={handlePlaySelected} />
              <BracketButton
                label="CLEAR"
                onPress={handleClear}
                color={colors.textSecondary}
              />
            </View>
          )}
        </View>
      )}

      {/* Submit Button */}
      {canAnswer && (
        <View style={styles.submitContainer}>
          <BracketButton
            label="CHECK"
            onPress={handleSubmit}
            color={
              selectedNotes.length > 0 ? colors.accentGreen : colors.textMuted
            }
          />
        </View>
      )}

      {/* Feedback */}
      {showFeedback && (
        <View style={styles.feedbackContainer}>
          <Text
            style={[
              styles.feedbackText,
              isCorrect ? styles.correctText : styles.incorrectText,
            ]}
          >
            {isCorrect ? 'Correct!' : 'Not quite...'}
          </Text>
          {content.explanation && (
            <Text style={styles.explanation}>{content.explanation}</Text>
          )}
          <View style={styles.continueContainer}>
            <BracketButton
              label="CONTINUE"
              onPress={onContinue}
              color={colors.accentGreen}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  instruction: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  referenceContainer: {
    marginBottom: spacing.lg,
  },
  keyboardContainer: {
    marginVertical: spacing.lg,
  },
  selectedDisplay: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  selectedLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  selectedActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  submitContainer: {
    marginTop: spacing.xl,
  },
  feedbackContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  feedbackText: {
    fontFamily: fonts.monoBold,
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  correctText: {
    color: colors.accentGreen,
  },
  incorrectText: {
    color: colors.accentPink,
  },
  explanation: {
    ...typography.label,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  continueContainer: {
    marginTop: spacing.xl,
  },
});
