import React from "react";
import "./Card.css"; // Make sure you have a separate CSS file for Card styles

const Card = ({ title, description, image, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      {image && <img src={image} alt={title} />}{" "}
      {/* Only show image if it exists */}
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default Card;
