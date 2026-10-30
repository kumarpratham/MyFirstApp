
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

import GameBoard from './src/components/GameBoard';
import ScoreCard from './src/components/ScoreCard';

import { COLORS } from './src/constants/theme';

import {
  getWinner,
  isBoardFull,
  getBestMove,
} from './src/utils/gameLogic';

const INITIAL_BOARD = Array(9).fill(null);

export default function App() {

  const [board, setBoard] = useState([...INITIAL_BOARD]);

  const [currentPlayer, setCurrentPlayer] = useState('X');

  const [mode, setMode] = useState('computer');

  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    draws: 0,
  });

  const [winner, setWinner] = useState(null);

  const [winningCombination, setWinningCombination] =
    useState(null);

  const [isDraw, setIsDraw] = useState(false);

  const gameFinished = !!winner || isDraw;

  // Reset the current round
  const restartRound = () => {
    setBoard([...INITIAL_BOARD]);
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCombination(null);
    setIsDraw(false);
  };

  // Reset everything
  const resetScores = () => {
    restartRound();

    setScores({
      X: 0,
      O: 0,
      draws: 0,
    });
  };

  // Change game mode
  const changeMode = (newMode) => {
    if (mode === newMode) return;

    setMode(newMode);
    resetScores();
  };

  // Check game result
  const processMove = (nextBoard, player) => {

    setBoard(nextBoard);

    const result = getWinner(nextBoard);

    if (result) {

      setWinner(player);

      setWinningCombination(result.combination);

      setScores(previous => ({
        ...previous,
        [player]: previous[player] + 1,
      }));

      return true;
    }

    if (isBoardFull(nextBoard)) {

      setIsDraw(true);

      setScores(previous => ({
        ...previous,
        draws: previous.draws + 1,
      }));

      return true;
    }

    setCurrentPlayer(player === 'X' ? 'O' : 'X');

    return false;
  };

  // Handle player move
  const handleCellPress = (index) => {

    if (gameFinished || board[index]) return;

    // Human always plays X against computer
    if (mode === 'computer' && currentPlayer !== 'X') {
      return;
    }

    const nextBoard = [...board];

    nextBoard[index] = currentPlayer;

    processMove(nextBoard, currentPlayer);
  };

  // Computer AI
  useEffect(() => {

    if (
      mode !== 'computer' ||
      currentPlayer !== 'O' ||
      gameFinished
    ) {
      return;
    }

    const timer = setTimeout(() => {

      const nextBoard = [...board];

      const bestMove = getBestMove(nextBoard);

      if (bestMove === null) return;

      nextBoard[bestMove] = 'O';

      processMove(nextBoard, 'O');

    }, 500);

    return () => clearTimeout(timer);

  }, [board, currentPlayer, mode, gameFinished]);

  // Status message
  const getStatus = () => {

    if (winner) {
      if (mode === 'computer') {
        return winner === 'X'
          ? 'You Won! 🎉'
          : 'Computer Wins!';
      }

      return `Player ${winner} Wins! 🎉`;
    }

    if (isDraw) {
      return "It's a Draw! 🤝";
    }

    if (mode === 'computer' && currentPlayer === 'O') {
      return 'Computer is thinking...';
    }

    if (mode === 'computer') {
      return 'Your Turn (X)';
    }

    return `Player ${currentPlayer}'s Turn`;
  };

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}

        <View style={styles.header}>

          <Text style={styles.logo}>TIC TAC TOE</Text>

          <Text style={styles.subtitle}>
            THE ULTIMATE STRATEGY GAME
          </Text>

        </View>

        {/* Mode Selection */}

        <View style={styles.modeContainer}>

          <Pressable
            onPress={() => changeMode('computer')}
            style={[
              styles.modeButton,
              mode === 'computer' && styles.activeMode,
            ]}
          >
            <Text
              style={[
                styles.modeText,
                mode === 'computer' && styles.activeModeText,
              ]}
            >
              🤖  VS COMPUTER
            </Text>
          </Pressable>

          <Pressable
            onPress={() => changeMode('friend')}
            style={[
              styles.modeButton,
              mode === 'friend' && styles.activeMode,
            ]}
          >
            <Text
              style={[
                styles.modeText,
                mode === 'friend' && styles.activeModeText,
              ]}
            >
              👥  2 PLAYERS
            </Text>
          </Pressable>

        </View>

        {/* Scoreboard */}

        <View style={styles.scoreboard}>

          <ScoreCard
            label={mode === 'computer' ? 'YOU' : 'PLAYER 1'}
            symbol="X"
            score={scores.X}
            active={!gameFinished && currentPlayer === 'X'}
          />

          <View style={styles.drawCard}>

            <Text style={styles.drawLabel}>DRAWS</Text>

            <Text style={styles.drawScore}>
              {scores.draws}
            </Text>

          </View>

          <ScoreCard
            label={mode === 'computer' ? 'COMPUTER' : 'PLAYER 2'}
            symbol="O"
            score={scores.O}
            active={!gameFinished && currentPlayer === 'O'}
          />

        </View>

        {/* Game Status */}

        <View style={styles.statusCard}>

          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: gameFinished
                  ? COLORS.success
                  : currentPlayer === 'X'
                    ? COLORS.x
                    : COLORS.o,
              },
            ]}
          />

          <Text style={styles.statusText}>
            {getStatus()}
          </Text>

        </View>

        {/* Game Board */}

        <GameBoard
          board={board}
          onCellPress={handleCellPress}
          winningCombination={winningCombination}
          disabled={
            gameFinished ||
            (mode === 'computer' && currentPlayer === 'O')
          }
        />

        {/* Result Message */}

        {gameFinished && (

          <View style={styles.resultCard}>

            <Text style={styles.resultTitle}>
              {winner
                ? '🏆  ROUND COMPLETED'
                : '🤝  WELL PLAYED'}
            </Text>

            <Text style={styles.resultDescription}>
              {winner
                ? `${winner} is the winner of this round!`
                : 'Nobody wins this time. Try again!'}
            </Text>

          </View>

        )}

        {/* Actions */}

        <Pressable
          onPress={restartRound}
          style={({ pressed }) => [
            styles.restartButton,
            pressed && styles.pressed,
          ]}
        >

          <Text style={styles.restartText}>
            ↻   {gameFinished ? 'PLAY AGAIN' : 'RESTART ROUND'}
          </Text>

        </Pressable>

        <Pressable
          onPress={resetScores}
          style={styles.resetButton}
        >

          <Text style={styles.resetText}>
            RESET ALL SCORES
          </Text>

        </Pressable>

        {/* Footer */}

        <Text style={styles.footer}>
          MADE WITH ❤️ USING REACT NATIVE
        </Text>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 30,
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logo: {
    color: COLORS.text,
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: 3,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 8,
  },

  modeContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 5,
    marginBottom: 24,
  },

  modeButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },

  activeMode: {
    backgroundColor: COLORS.primary,
  },

  modeText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
  },

  activeModeText: {
    color: COLORS.white,
  },

  scoreboard: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: 9,
    marginBottom: 24,
  },

  drawCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },

  drawLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '800',
  },

  drawScore: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 9,
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 20,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 10,
    marginRight: 10,
  },

  statusText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },

  resultCard: {
    width: '100%',
    backgroundColor: '#1B2D35',
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.success,
  },

  resultTitle: {
    color: COLORS.success,
    fontSize: 15,
    fontWeight: '900',
  },

  resultDescription: {
    color: COLORS.text,
    fontSize: 13,
    marginTop: 7,
  },

  restartButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 26,
  },

  pressed: {
    opacity: 0.75,
  },

  restartText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },

  resetButton: {
    paddingVertical: 16,
  },

  resetText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  footer: {
    color: COLORS.muted,
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 12,
  },

});
