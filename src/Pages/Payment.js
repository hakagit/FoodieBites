import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Payment.css";

const Payment = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dishes, setDishes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/order_item/show/${order_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error fetching order details: ${errorText}`);
        }

        const data = await response.json();
        console.log("Fetched Order Details:", data); // Log the entire response

        // Check if the response is structured as expected
        if (data && data.data) {
          setUserName(data.user_name || "");
          setDishes(data.data || []);

          // Calculate the total amount based on quantities
          const calculatedTotal = data.data.reduce((acc, dish) => {
            console.log(
              `Dish: ${dish.name}, Price: ${dish.price}, Quantity: ${dish.quantity}`
            );
            return acc + parseFloat(dish.price) * dish.quantity; // Ensure correct calculation
          }, 0);
          console.log("Calculated Total Amount:", calculatedTotal);
          setTotalAmount(calculatedTotal);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:8000/api/driver/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error fetching drivers: ${errorText}`);
        }

        const driverData = await response.json();
        console.log("Fetched Drivers:", driverData); // Log the fetched drivers
        if (Array.isArray(driverData.data)) {
          setDrivers(driverData.data);
        } else {
          console.error("Driver data is not an array:", driverData);
        }
      } catch (error) {
        console.error("Error fetching drivers:", error.message);
      }
    };

    fetchOrderDetails();
    fetchDrivers();
  }, [order_id]);

  const handleRemoveDish = (dishId) => {
    const updatedDishes = dishes.filter((dish) => dish.id !== dishId);
    setDishes(updatedDishes);

    const newTotal = updatedDishes.reduce(
      (acc, dish) => acc + parseFloat(dish.price) * dish.quantity,
      0
    );
    setTotalAmount(newTotal); // Update the total amount after removing
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (drivers.length === 0) {
      alert("No drivers available.");
      return;
    }

    const paymentData = {
      order_id,
      card_number: cardNumber,
      total_amount: totalAmount,
      name: userName,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/payment/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error submitting payment: ${errorText}`);
      }

      const result = await response.json();
      console.log("Payment submission result:", result);

      const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
      if (randomDriver) {
        navigate("/order-confirmation", {
          state: {
            message: `Your order is on the way, your driver is ${randomDriver.name}.`,
            orderedItems: dishes, // Pass the ordered dishes here
          },
        });
      } else {
        alert("No drivers available.");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to submit payment.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="payment-container">
      <div className="confirmation-section">
        <h2>Order Confirmation</h2>
        <p>User: {userName}</p>
        <h3>Selected Dishes</h3>
        <ul>
          {dishes.length > 0 ? (
            dishes.map((dish) => (
              <li key={dish.id} className="dish-item">
                {dish.name} - {dish.price} (Quantity: {dish.quantity})
                <button
                  className="remove-button"
                  onClick={() => handleRemoveDish(dish.id)}
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <li>No dishes found for this order.</li>
          )}
        </ul>
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
      </div>
      <div className="payment-section">
        <h2>Payment Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label">Name:</label>
            <p className="user-name">{userName}</p>
          </div>
          <div className="input-group">
            <label htmlFor="cardNumber" className="label">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              placeholder="Enter your card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit Payment</button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
