
import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { COLORS } from '../constants/theme';

export default function ScoreCard({
  label,
  symbol,
  score,
  active,
}) {
  const color =
    symbol === 'X' ? COLORS.x : COLORS.o;

  return (
    <View
      style={[
        styles.card,
        active && { borderColor: color },
      ]}
    >
      <Text style={styles.label}>{label}</Text>

      <Text style={[styles.symbol, { color }]}>
        {symbol}
      </Text>

      <Text style={styles.score}>{score}</Text>

      <Text style={styles.points}>POINTS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
    letterSpacing: 1,
  },

  symbol: {
    fontSize: 27,
    fontWeight: '900',
    marginTop: 5,
  },

  score: {
    fontSize: 27,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 3,
  },

  points: {
    color: COLORS.muted,
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 3,
  },
});
