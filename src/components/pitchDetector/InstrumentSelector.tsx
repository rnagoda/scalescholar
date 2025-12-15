import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { BracketButton } from '../common';
import { Instrument, InstrumentType } from '../../types/guitarTuning';
import { INSTRUMENTS } from '../../utils/instrumentTunings';

interface InstrumentSelectorProps {
  selectedInstrument: InstrumentType;
  onInstrumentChange: (instrumentId: InstrumentType) => void;
}

export const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({
  selectedInstrument,
  onInstrumentChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const currentInstrument = INSTRUMENTS.find((i) => i.id === selectedInstrument) || INSTRUMENTS[0];

  const handleSelect = (instrumentId: InstrumentType) => {
    onInstrumentChange(instrumentId);
    setModalVisible(false);
  };

  return (
    <>
      {/* Instrument Button */}
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.instrumentName}>{currentInstrument.name.toUpperCase()}</Text>
        <Text style={styles.chevron}> ▼</Text>
      </TouchableOpacity>

      {/* Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>SELECT INSTRUMENT</Text>

                <View style={styles.optionsList}>
                  {INSTRUMENTS.map((instrument) => {
                    const isSelected = instrument.id === selectedInstrument;
                    return (
                      <TouchableOpacity
                        key={instrument.id}
                        style={[
                          styles.optionRow,
                          isSelected && styles.optionRowSelected,
                        ]}
                        onPress={() => handleSelect(instrument.id)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}
                        >
                          {instrument.name}
                        </Text>
                        <Text
                          style={[
                            styles.stringCount,
                            isSelected && styles.optionTextSelected,
                          ]}
                        >
                          {instrument.stringCount} strings
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.modalFooter}>
                  <BracketButton
                    label="CANCEL"
                    onPress={() => setModalVisible(false)}
                    color={colors.textSecondary}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  instrumentName: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.accentGreen,
    letterSpacing: 1,
  },
  chevron: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.accentGreen,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.textPrimary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  optionsList: {
    marginBottom: spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  optionRowSelected: {
    backgroundColor: 'rgba(50, 215, 75, 0.15)',
  },
  optionText: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textSecondary,
  },
  optionTextSelected: {
    color: colors.accentGreen,
    fontFamily: fonts.monoBold,
  },
  stringCount: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
  },
  modalFooter: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});
