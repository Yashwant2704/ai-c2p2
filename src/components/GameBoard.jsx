import React, { useState, useEffect } from "react";
import { getBestMove } from "../AIPlayer";
import "../styles/GameBoard.css";

// Function to determine the winner of the trick
const determineWinner = (playerCard, aiCard) => {
  const rankOrder = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 11, "Q": 12, "K": 13, "A": 14
  };

  const ledSuit = aiCard ? aiCard.suit : playerCard.suit;

  const playerFollowsSuit = playerCard.suit === ledSuit;
  const aiFollowsSuit = aiCard.suit === ledSuit;

  // Both follow suit → compare ranks
  if (playerFollowsSuit && aiFollowsSuit) {
    return rankOrder[playerCard.rank] > rankOrder[aiCard.rank] ? "Player" : "AI";
  }

  // Only player follows suit
  if (playerFollowsSuit) return "Player";

  // Only AI follows suit
  if (aiFollowsSuit) return "AI";

  // Neither follow suit (shouldn't happen, fallback)
  return "Draw";
};


// Function to generate a shuffled deck
const generateDeck = () => {
  const suits = ["♠️", "♥️", "♦️", "♣️"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck = suits.flatMap(suit => ranks.map(rank => ({ rank, suit })));

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
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
  const [nextPlayer, setNextPlayer] = useState("Player");

  // Deal hands
  useEffect(() => {
    setPlayerHand(deck.slice(0, 13));
    setAiHand(deck.slice(13, 26));
  }, [deck]);

  // AI plays first if it won previous round
  useEffect(() => {
    if (
      !gameOver &&
      nextPlayer === "AI" &&
      !currentTrick.ai &&
      !currentTrick.player &&
      aiHand.length > 0
    ) {
      setTimeout(() => {
        const aiCard = getBestMove(aiHand, null);
        setCurrentTrick(prev => ({ ...prev, ai: aiCard }));
        setAiHand(prev => prev.filter(card => card !== aiCard));
      }, 1000);
    }
  }, [nextPlayer, currentTrick, aiHand, gameOver]);

  // Player plays
  const handlePlayerMove = (card) => {
    if (
      gameOver ||
      currentTrick.player ||
      (nextPlayer === "AI" && !currentTrick.ai)
    ) return;
  
    const aiCard = currentTrick.ai;
  
    // 🛑 ENFORCE PLAYER FOLLOWS SUIT
    if (aiCard) {
      const sameSuitCards = playerHand.filter(c => c.suit === aiCard.suit);
      const isFollowingSuit = card.suit === aiCard.suit;
  
      if (sameSuitCards.length > 0 && !isFollowingSuit) {
        alert(`You must follow suit: ${aiCard.suit}`);
        return;
      }
    }
  
    setCurrentTrick(prev => ({ ...prev, player: card }));
    setPlayerHand(prev => prev.filter(c => c !== card));
  
    setTimeout(() => {
      const aiMove = aiCard || getBestMove(aiHand, card);
      if (!aiCard) {
        setCurrentTrick(prev => ({ ...prev, ai: aiMove }));
        setAiHand(prev => prev.filter(c => c !== aiMove));
      }
  
      setTimeout(() => {
        const trickWinner = determineWinner(card, aiCard || aiMove);
        setWinningCard(trickWinner === "Player" ? card : (aiCard || aiMove));
  
        setScore(prev => {
          const newScore = { ...prev };
          if (trickWinner !== "Draw") {
            newScore[trickWinner.toLowerCase()] += 1;
          }
  
          if (newScore.player + newScore.ai === 13) {
            setGameOver(true);
            setWinner(newScore.player > newScore.ai ? "🎉 You Win! 🎉" : "😢 AI Wins! 😢");
          }
  
          return newScore;
        });
  
        setTimeout(() => {
          setWinningCard(null);
          setCurrentTrick({ player: null, ai: null });
          setNextPlayer(trickWinner);
        }, 1000);
      }, 1000);
    }, 1000);
  };
  

  return (
    <div className="game-container">
      <h1>🃏 Bridge AI Game 🃏</h1>

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
              {aiHand.map((_, i) => (
                <div key={i} className="card back-card no-hover"></div>
              ))}
            </div>
          </div>

          {/* Current Trick */}
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
              {playerHand.map((card, i) => (
                <div
                  key={i}
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
