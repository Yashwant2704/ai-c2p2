import React, { useState, useEffect } from "react";
import { getBestMove } from "../AIPlayer";
import "../styles/GameBoard.css";

// Function to determine the winner of the trick
const determineWinner = (playerCard, aiCard) => {
  const rankOrder = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 11, "Q": 12, "K": 13, "A": 14
  };

  if (rankOrder[playerCard.rank] > rankOrder[aiCard.rank]) {
    return "Player";
  } else if (rankOrder[playerCard.rank] < rankOrder[aiCard.rank]) {
    return "AI";
  } else {
    return "Draw";
  }
};

// Function to generate a deck of 52 cards
const generateDeck = () => {
  const suits = ["♠️", "♥️", "♦️", "♣️"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  let deck = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ rank, suit });
    }
  }

  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

const GameBoard = () => {
  const [deck, setDeck] = useState(generateDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [aiHand, setAiHand] = useState([]);
  const [currentTrick, setCurrentTrick] = useState({ player: null, ai: null });
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const [winningCard, setWinningCard] = useState(null);
  const [tricksPlayed, setTricksPlayed] = useState(0);

  useEffect(() => {
    setPlayerHand(deck.slice(0, 13)); // First 13 cards to player
    setAiHand(deck.slice(13, 26)); // Next 13 cards to AI
  }, [deck]);

  const handlePlayerMove = (card) => {
    if (gameOver || currentTrick.player) return; // Prevent clicking when round is ongoing or game over

    setCurrentTrick((prev) => ({ ...prev, player: card }));
    setPlayerHand((prev) => prev.filter((c) => c !== card));

    setTimeout(() => {
      let aiMove = getBestMove(aiHand, card);
      setCurrentTrick((prev) => ({ ...prev, ai: aiMove }));
      setAiHand((prev) => prev.filter((c) => c !== aiMove));

      setTimeout(() => {
        const trickWinner = determineWinner(card, aiMove);
        setWinningCard(trickWinner === "Player" ? card : aiMove);

        setScore((prev) => {
          const newScore = { ...prev };
          if (trickWinner !== "Draw") {
            newScore[trickWinner.toLowerCase()] += 1;
          }

          const totalTricks = tricksPlayed + 1;
          setTricksPlayed(totalTricks);

          if (totalTricks === 13) {
            setGameOver(true);
            setWinner(newScore.player > newScore.ai ? "🎉 You Win! 🎉" : "😢 AI Wins! 😢");
          }

          return newScore;
        });

        setTimeout(() => {
          setWinningCard(null);
          setCurrentTrick({ player: null, ai: null });
        }, 1200);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="game-container">
      <h1>🃏 Bridge AI Game</h1>

      <div className="scoreboard">
        <p>👤 Player Score: {score.player}</p>
        <p>🤖 AI Score: {score.ai}</p>
      </div>

      {gameOver ? (
        <div className="game-over">
          <h2>{winner}</h2>
          <button onClick={() => window.location.reload()}>🔄 Play Again</button>
        </div>
      ) : (
        <div className="game-board">
          {/* AI's Hidden Hand */}
          <div className="ai-hand">
            <h3>🤖 AI Hand</h3>
            <div className="cards">
              {aiHand.map((_, index) => (
                <div key={index} className="card back-card no-hover"></div>
              ))}
            </div>
          </div>

          {/* Center: Player and AI Selected Cards */}
          <div className="current-trick">
            <div className={`card fade-in ${winningCard === currentTrick.player ? "winning-card" : ""}`}>
              {currentTrick.player ? `${currentTrick.player.rank} ${currentTrick.player.suit}` : ""}
            </div>
            <div className={`card fade-in ${winningCard === currentTrick.ai ? "winning-card" : ""}`}>
              {currentTrick.ai ? `${currentTrick.ai.rank} ${currentTrick.ai.suit}` : ""}
            </div>
          </div>

          {/* Player Hand */}
          <div className="player-hand">
            <h3>👤 Your Hand</h3>
            <div className="cards">
              {playerHand.map((card, index) => (
                <div
                  key={index}
                  className={`card ${currentTrick.player === card ? "selected" : ""} ${winningCard === card ? "winning-card" : ""}`}
                  onClick={() => handlePlayerMove(card)}
                >
                  <span className="rank">{card.rank}</span>
                  <span className="suit">{card.suit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
