import React from "react";
import "./Menu.css";
import Categories from "../Components/Categories";

export const Menu = () => {
  return (
    <section className="menu" id="menu">
      <div className="menu-content">
        <h1>
          Foodies <span>Corner</span>
        </h1>
        <p>We can't wait to serve you!</p>
      </div>
      <div className="categories-container">
        <Categories />
      </div>
    </section>
  );
};
