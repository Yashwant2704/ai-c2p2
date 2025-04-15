const rankValue = {
    A: 14, K: 13, Q: 12, J: 11,
    "10": 10, "9": 9, "8": 8, "7": 7,
    "6": 6, "5": 5, "4": 4, "3": 3, "2": 2
  };
  
export function minimax(cards, depth, isMaximizing, alpha, beta) {
    if (depth === 0 || cards.length === 0) {
      return evaluateHand(cards); // Base case: Return hand score
    }
  
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestMove = null;
  
    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      let newCards = [...cards.slice(0, i), ...cards.slice(i + 1)];
  
      let score = minimax(newCards, depth - 1, !isMaximizing, alpha, beta);
  
      if (isMaximizing) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = card;
        }
        alpha = Math.max(alpha, bestScore);
      } else {
        if (score < bestScore) {
          bestScore = score;
        }
        beta = Math.min(beta, bestScore);
      }
  
      if (beta <= alpha) break; // Alpha-beta pruning
    }
  
    return depth === 3 ? bestMove : bestScore; // Return best move at top level
  }
  export function getBestMove2(aiHand, playerCard) {
    if (!playerCard) {
      // AI plays first, pick the best card using Minimax
      return minimax(aiHand, 3, true, -Infinity, Infinity);
    }
  
    // Find all cards in the same suit
    const sameSuitCards = aiHand.filter(card => card.suit === playerCard.suit);
  
    if (sameSuitCards.length > 0) {
      // AI has matching suit: Play highest-ranked card
      return sameSuitCards.reduce((best, card) => (rankValue[card.rank] > rankValue[best.rank] ? card : best));
    }
  
    // No matching suit: Play the lowest-ranked card
    return aiHand.reduce((worst, card) => (rankValue[card.rank] < rankValue[worst.rank] ? card : worst));
  }

  export function getBestMove(aiHand, playerCard) {
    const rankValue = {
      A: 14, K: 13, Q: 12, J: 11,
      "10": 10, "9": 9, "8": 8, "7": 7,
      "6": 6, "5": 5, "4": 4, "3": 3, "2": 2
    };
  
    if (!playerCard) {
      // AI starts first — just pick the best card using evaluation (e.g., minimax)
      return aiHand.reduce((best, card) =>
        rankValue[card.rank] > rankValue[best.rank] ? card : best
      );
    }
  
    // Find all cards of the same suit
    const matchingSuit = aiHand.filter(card => card.suit === playerCard.suit);
  
    if (matchingSuit.length > 0) {
      // Follow suit — play lowest winning card if possible, else lowest same-suit card
      const winningOptions = matchingSuit.filter(card =>
        rankValue[card.rank] > rankValue[playerCard.rank]
      );
  
      if (winningOptions.length > 0) {
        // Play lowest winning card
        return winningOptions.reduce((best, card) =>
          rankValue[card.rank] < rankValue[best.rank] ? card : best
        );
      }
  
      // No winning option — play lowest same-suit card
      return matchingSuit.reduce((worst, card) =>
        rankValue[card.rank] < rankValue[worst.rank] ? card : worst
      );
    }
  
    // No matching suit — discard lowest card
    return aiHand.reduce((worst, card) =>
      rankValue[card.rank] < rankValue[worst.rank] ? card : worst
    );
  }
  
  
  
  function evaluateHand(cards) {
    let score = 0;
    cards.forEach((card) => {
      if (card.rank === "A") score += 4;
      if (card.rank === "K") score += 3;
      if (card.rank === "Q") score += 2;
      if (card.rank === "J") score += 1;
    });
    return score;
  }
  