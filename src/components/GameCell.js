
import React from 'react';

import {
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';

import { COLORS } from '../constants/theme';

export default function GameCell({
  value,
  onPress,
  isWinning,
  disabled,
}) {
  const markColor =
    value === 'X' ? COLORS.x : COLORS.o;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.cell,
        isWinning && styles.winningCell,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.mark,
          { color: markColor },
        ]}
      >
        {value || ''}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: '31.5%',
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2.7%',
  },

  winningCell: {
    backgroundColor: '#203C3A',
    borderColor: COLORS.success,
    borderWidth: 2,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },

  mark: {
    fontSize: 46,
    fontWeight: '900',
  },
});
