import React from "react";
import "./Order.css";
import Dishes from "../Components/Dishes";
import Categories from "../Components/Categories";
export const Order = () => {
  return (
    <div className="main-container">
      <section id="order">
        <div className="main">
          <h1 className="order-h1">Order Here!</h1>
          <div className="order-box">
            <Categories />
          </div>
        </div>
      </section>
    </div>
  );
};
