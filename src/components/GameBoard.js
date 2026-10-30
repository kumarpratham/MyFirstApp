
import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import GameCell from './GameCell';
import { COLORS } from '../constants/theme';

export default function GameBoard({
  board,
  onCellPress,
  winningCombination,
  disabled,
}) {
  return (
    <View style={styles.board}>
      {board.map((cell, index) => (
        <GameCell
          key={index}
          value={cell}
          onPress={() => onCellPress(index)}
          isWinning={
            winningCombination?.includes(index) || false
          }
          disabled={disabled || !!cell}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
  },
});
