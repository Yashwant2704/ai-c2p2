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
    if (!playerCard) {
      return minimax(aiHand, 3, true, -Infinity, Infinity); // If AI starts, use Minimax
    }
  
    const sameSuitCards = aiHand.filter(card => card.suit === playerCard.suit);
  
    if (sameSuitCards.length > 0) {
      // AI has a matching suit
      const winningCards = sameSuitCards.filter(card => rankValue[card.rank] > rankValue[playerCard.rank]);
  
      if (winningCards.length > 0) {
        // Play the **lowest** card that still wins
        return winningCards.reduce((best, card) => (rankValue[card.rank] < rankValue[best.rank] ? card : best));
      }
  
      // No winning cards, play the highest in the same suit (reduce player's options)
      return sameSuitCards.reduce((worst, card) => (rankValue[card.rank] > rankValue[worst.rank] ? card : worst));
    }
  
    // AI doesn't have the same suit → discard highest non-winning card
    return aiHand.reduce((best, card) => (rankValue[card.rank] > rankValue[best.rank] ? card : best));
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
  