import React from "react";
import Card from "./Card";
import "../styles/Hand.css";

const Hand = ({ cards, isAI }) => {
  return (
    <div className="hand">
      {cards.map((card, index) => (
        <Card key={index} suit={card.suit} rank={card.rank} hidden={isAI} />
      ))}
    </div>
  );
};

export default Hand;
