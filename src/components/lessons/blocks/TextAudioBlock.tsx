/**
 * Text-Audio Block Component
 *
 * Displays educational text content with optional audio playback.
 * Not graded - used for teaching concepts.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../../theme';
import { TextAudioContent } from '../../../types/lesson';
import { PlayButton } from '../../exercises';
import { AudioEngine } from '../../../audio';
import { BracketButton } from '../../common';

interface TextAudioBlockProps {
  content: TextAudioContent;
  onContinue: () => void;
}

export const TextAudioBlock: React.FC<TextAudioBlockProps> = ({
  content,
  onContinue,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const hasAudio = content.audioType && content.audioData;

  const handlePlay = useCallback(async () => {
    if (!content.audioData) return;

    setIsPlaying(true);

    try {
      const { notes, chordType, scaleType, rootNote, noteDuration, velocity } = content.audioData;
      // Default duration is 0.4s, can be overridden for tempo control
      const duration = noteDuration ?? 0.4;

      switch (content.audioType) {
        case 'note':
          if (notes && notes.length > 0) {
            // Single notes default to 1.0s for better audibility
            await AudioEngine.playMidiNote(notes[0], noteDuration ?? 1.0, velocity);
          }
          break;

        case 'interval':
          if (notes && notes.length >= 2) {
            // Calculate interval and play melodically
            const interval = notes[1] - notes[0];
            const ascending = interval >= 0;
            await AudioEngine.playInterval(notes[0], Math.abs(interval), ascending, true, velocity);
          }
          break;

        case 'chord':
          if (notes && notes.length >= 3) {
            await AudioEngine.playChordMidi(notes, 1.5, velocity);
          }
          break;

        case 'scale':
          if (notes && notes.length > 0) {
            // For scale, notes array contains the MIDI notes directly
            // Convert to intervals from first note for playScale
            const rootMidi = notes[0];
            const intervals = notes.map(n => n - rootMidi);
            await AudioEngine.playScale(rootMidi, intervals, duration, velocity);
          }
          break;
      }

      setHasPlayed(true);
    } catch (error) {
      console.error('Failed to play audio:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [content]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{content.text}</Text>
      </View>

      {hasAudio && (
        <View style={styles.audioContainer}>
          <PlayButton
            onPress={handlePlay}
            isPlaying={isPlaying}
            label="LISTEN"
          />
        </View>
      )}

      <View style={styles.continueContainer}>
        <BracketButton
          label="CONTINUE"
          onPress={onContinue}
          color={colors.accentGreen}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 26,
    textAlign: 'center',
  },
  audioContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  continueContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
