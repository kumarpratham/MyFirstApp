
export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function getWinner(board) {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return {
        player: board[a],
        combination,
      };
    }
  }

  return null;
}

export function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

export function getAvailableMoves(board) {
  return board
    .map((cell, index) => cell === null ? index : null)
    .filter(index => index !== null);
}

// Minimax algorithm
function minimax(board, isMaximizing) {
  const result = getWinner(board);

  if (result?.player === 'O') return 10;
  if (result?.player === 'X') return -10;
  if (isBoardFull(board)) return 0;

  const moves = getAvailableMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (const move of moves) {
      board[move] = 'O';

      const score = minimax(board, false);

      board[move] = null;

      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (const move of moves) {
    board[move] = 'X';

    const score = minimax(board, true);

    board[move] = null;

    bestScore = Math.min(bestScore, score);
  }

  return bestScore;
}

// Find the best move for computer (O)
export function getBestMove(board) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (const move of getAvailableMoves(board)) {
    board[move] = 'O';

    const score = minimax(board, false);

    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
