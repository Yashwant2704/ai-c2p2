import React from "react";
import "../styles/Card.css";

const Card = ({ suit, rank, hidden }) => {
  return (
    <div className={`card ${hidden ? "hidden" : ""}`}>
      {!hidden ? `${rank} ${suit}` : "🂠"}
    </div>
  );
};

export default Card;
