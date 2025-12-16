/**
 * StaffNotation Component
 *
 * SVG-based musical staff notation for displaying notes.
 * Supports treble and bass clef with notes, accidentals, and ledger lines.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Line,
  Circle,
  Ellipse,
  Text as SvgText,
  G,
  Path,
} from 'react-native-svg';
import { colors } from '../../../theme';

interface StaffNotationProps {
  notes: number[]; // MIDI note numbers
  clef?: 'treble' | 'bass';
  width?: number;
  height?: number;
  showNoteNames?: boolean;
  highlightedNotes?: number[];
  noteColor?: string;
}

// Staff configuration
const STAFF_CONFIG = {
  lineSpacing: 12, // Space between staff lines
  noteRadius: 7, // Radius of note heads
  marginLeft: 50, // Space for clef
  marginRight: 20,
  marginTop: 30,
  marginBottom: 30,
};

// Note names for display
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Get note name from MIDI
const getNoteName = (midi: number): string => {
  return NOTE_NAMES[midi % 12];
};

// Calculate staff position (0 = middle line of staff)
// Returns position in half-steps from middle line
const getMidiStaffPosition = (midi: number, clef: 'treble' | 'bass'): number => {
  // Middle line for treble clef is B4 (MIDI 71), for bass clef is D3 (MIDI 50)
  // Staff positions: positive = above middle line, negative = below
  // Each step is one note position on the staff (line or space)

  const noteInOctave = midi % 12;
  const octave = Math.floor(midi / 12) - 1;

  // Map note to staff position within octave (C=0, D=1, E=2, F=3, G=4, A=5, B=6)
  const noteStaffPositions = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]; // C, C#, D, D#, E, F, F#, G, G#, A, A#, B
  const notePosition = noteStaffPositions[noteInOctave];

  // Calculate absolute staff position
  const absolutePosition = octave * 7 + notePosition;

  // Reference positions
  if (clef === 'treble') {
    // Middle line (B4) = octave 4, position 6 = 4*7+6 = 34
    const middleLinePosition = 34;
    return absolutePosition - middleLinePosition;
  } else {
    // Middle line (D3) = octave 3, position 1 = 3*7+1 = 22
    const middleLinePosition = 22;
    return absolutePosition - middleLinePosition;
  }
};

// Check if note has accidental (sharp/flat)
const hasAccidental = (midi: number): 'sharp' | null => {
  const noteInOctave = midi % 12;
  // Sharp notes: C#, D#, F#, G#, A#
  if ([1, 3, 6, 8, 10].includes(noteInOctave)) {
    return 'sharp';
  }
  return null;
};

export const StaffNotation: React.FC<StaffNotationProps> = ({
  notes,
  clef = 'treble',
  width = 280,
  height = 120,
  showNoteNames = false,
  highlightedNotes = [],
  noteColor = colors.textPrimary,
}) => {
  const { lineSpacing, noteRadius, marginLeft, marginRight, marginTop } = STAFF_CONFIG;

  // Calculate staff dimensions
  const staffWidth = width - marginLeft - marginRight;
  const staffHeight = lineSpacing * 4; // 5 lines, 4 spaces
  const middleY = marginTop + staffHeight / 2;

  // Y position for each note
  const getNoteY = (midi: number): number => {
    const position = getMidiStaffPosition(midi, clef);
    // Each position is half a line spacing
    return middleY - position * (lineSpacing / 2);
  };

  // X position for notes (spread evenly)
  const getNoteX = (index: number, total: number): number => {
    if (total === 1) {
      return marginLeft + staffWidth / 2;
    }
    const spacing = staffWidth / (total + 1);
    return marginLeft + spacing * (index + 1);
  };

  // Check if ledger lines are needed
  const needsLedgerLines = (midi: number): number[] => {
    const position = getMidiStaffPosition(midi, clef);
    const ledgerLines: number[] = [];

    // Above staff (position > 2)
    if (position > 2) {
      for (let p = 3; p <= position; p++) {
        if (p % 2 === 1) {
          // Only on odd positions (lines)
          ledgerLines.push(p);
        }
      }
    }
    // Below staff (position < -2)
    if (position < -2) {
      for (let p = -3; p >= position; p--) {
        if (Math.abs(p) % 2 === 1) {
          // Only on odd positions (lines)
          ledgerLines.push(p);
        }
      }
    }

    return ledgerLines;
  };

  // Render treble clef (simplified)
  const renderTrebleClef = () => (
    <G>
      <SvgText
        x={25}
        y={middleY + 30}
        fontSize={60}
        fontFamily="serif"
        fill={colors.textSecondary}
      >
        {'\u{1D11E}'}
      </SvgText>
    </G>
  );

  // Render bass clef (simplified)
  const renderBassClef = () => (
    <G>
      <SvgText
        x={20}
        y={middleY + 15}
        fontSize={45}
        fontFamily="serif"
        fill={colors.textSecondary}
      >
        {'\u{1D122}'}
      </SvgText>
    </G>
  );

  // Render sharp symbol
  const renderSharp = (x: number, y: number) => (
    <SvgText
      x={x - noteRadius - 10}
      y={y + 5}
      fontSize={16}
      fill={noteColor}
      fontFamily="serif"
    >
      #
    </SvgText>
  );

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Staff lines */}
        {[0, 1, 2, 3, 4].map((lineIndex) => {
          const y = marginTop + lineIndex * lineSpacing;
          return (
            <Line
              key={`line-${lineIndex}`}
              x1={marginLeft - 10}
              y1={y}
              x2={width - marginRight}
              y2={y}
              stroke={colors.textMuted}
              strokeWidth={1}
            />
          );
        })}

        {/* Clef */}
        {clef === 'treble' ? renderTrebleClef() : renderBassClef()}

        {/* Notes */}
        {notes.map((midi, index) => {
          const x = getNoteX(index, notes.length);
          const y = getNoteY(midi);
          const isHighlighted = highlightedNotes.includes(midi);
          const accidental = hasAccidental(midi);
          const ledgerLines = needsLedgerLines(midi);

          return (
            <G key={`note-${index}`}>
              {/* Ledger lines */}
              {ledgerLines.map((linePos) => {
                const lineY = middleY - linePos * (lineSpacing / 2);
                return (
                  <Line
                    key={`ledger-${linePos}`}
                    x1={x - noteRadius - 5}
                    y1={lineY}
                    x2={x + noteRadius + 5}
                    y2={lineY}
                    stroke={colors.textMuted}
                    strokeWidth={1}
                  />
                );
              })}

              {/* Accidental */}
              {accidental === 'sharp' && renderSharp(x, y)}

              {/* Note head (ellipse for quarter/half note look) */}
              <Ellipse
                cx={x}
                cy={y}
                rx={noteRadius}
                ry={noteRadius * 0.7}
                fill={isHighlighted ? colors.accentGreen : noteColor}
                stroke={isHighlighted ? colors.accentGreen : noteColor}
                strokeWidth={1}
                rotation={-15}
                origin={`${x}, ${y}`}
              />

              {/* Note name label */}
              {showNoteNames && (
                <SvgText
                  x={x}
                  y={y + noteRadius + 15}
                  fontSize={10}
                  fill={colors.textSecondary}
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {getNoteName(midi)}
                </SvgText>
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
