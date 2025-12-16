/**
 * Audio Quiz Block Component
 *
 * Plays audio and presents multiple choice options.
 * User must listen and select the correct answer.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../../theme';
import { AudioQuizContent } from '../../../types/lesson';
import { PlayButton, AnswerButton } from '../../exercises';
import { AudioEngine } from '../../../audio';
import { BracketButton } from '../../common';

interface AudioQuizBlockProps {
  content: AudioQuizContent;
  onAnswer: (selectedIndex: number) => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
  selectedAnswer: number | null;
  onContinue: () => void;
}

export const AudioQuizBlock: React.FC<AudioQuizBlockProps> = ({
  content,
  onAnswer,
  showFeedback,
  isCorrect,
  selectedAnswer,
  onContinue,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(async () => {
    setIsPlaying(true);

    try {
      const { notes, chordType, scaleType, rootNote } = content.audioData;

      switch (content.audioType) {
        case 'note':
          if (notes && notes.length > 0) {
            await AudioEngine.playMidiNote(notes[0], 1.0);
          }
          break;

        case 'interval':
          if (notes && notes.length >= 2) {
            // Calculate interval and play melodically
            const interval = notes[1] - notes[0];
            const ascending = interval >= 0;
            await AudioEngine.playInterval(notes[0], Math.abs(interval), ascending, true);
          }
          break;

        case 'chord':
          if (notes && notes.length >= 3) {
            await AudioEngine.playChordMidi(notes, 1.5);
          }
          break;

        case 'scale':
          if (notes && notes.length > 0) {
            // For scale, notes array contains the MIDI notes directly
            // Convert to intervals from first note for playScale
            const rootMidi = notes[0];
            const intervals = notes.map(n => n - rootMidi);
            await AudioEngine.playScale(rootMidi, intervals, 0.4);
          }
          break;
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [content]);

  const getAnswerState = (index: number) => {
    if (!showFeedback) {
      return selectedAnswer === index ? 'selected' : 'default';
    }

    if (index === content.correctIndex) {
      return 'correct';
    }

    if (selectedAnswer === index && !isCorrect) {
      return 'incorrect';
    }

    return 'default';
  };

  return (
    <View style={styles.container}>
      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{content.question}</Text>
      </View>

      {/* Play Button */}
      <View style={styles.playContainer}>
        <PlayButton
          onPress={handlePlay}
          isPlaying={isPlaying}
          label="LISTEN"
        />
      </View>

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {content.options.map((option, index) => (
          <View key={index} style={styles.optionWrapper}>
            <AnswerButton
              label={option}
              onPress={() => onAnswer(index)}
              state={getAnswerState(index)}
              disabled={showFeedback}
            />
          </View>
        ))}
      </View>

      {/* Feedback */}
      {showFeedback && (
        <View style={styles.feedbackContainer}>
          <Text style={[
            styles.feedbackText,
            { color: isCorrect ? colors.accentGreen : colors.accentPink }
          ]}>
            {isCorrect ? 'Correct!' : 'Not quite.'}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  questionContainer: {
    marginBottom: spacing.lg,
  },
  question: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    textAlign: 'center',
  },
  playContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  optionWrapper: {
    width: '45%',
    minWidth: 140,
  },
  feedbackContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  feedbackText: {
    fontFamily: fonts.monoBold,
    fontSize: 20,
    marginBottom: spacing.md,
  },
  explanation: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  continueContainer: {
    marginTop: spacing.xl,
  },
});
