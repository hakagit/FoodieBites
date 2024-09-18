import React from "react";
import { useLocation } from "react-router-dom";
import "./OrderConfirmation.css"; // Ensure to import the CSS file for styles

const OrderConfirmation = () => {
  const location = useLocation();
  const message = location.state?.message || "No order information available.";
  const orderedItems = location.state?.orderedItems || []; // Get the ordered items passed from Payment.js

  // Function to compute total amount
  const computeTotal = (items) => {
    return items
      .reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      )
      .toFixed(2);
  };

  const totalAmount = computeTotal(orderedItems); // Compute total amount

  return (
    <div className="order-confirmation">
      <div className="confirmation-card">
        <h1>🎉 Hold Tight!</h1>
        <p>{message}</p>

        <h3>Your Order Details:</h3>
        {orderedItems.length > 0 ? (
          <ul className="order-list">
            {orderedItems.map((item, index) => (
              <li key={index} className="order-item">
                <span>
                  {item.quantity} x {item.name} - {item.price}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items ordered.</p>
        )}

        <h3>Total: ${totalAmount}</h3>
        <button onClick={() => (window.location.href = "/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
