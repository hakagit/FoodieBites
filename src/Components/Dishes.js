import React, { useEffect, useState } from "react";
import "./Dishes.css"; // Import the CSS file
import Card from "./Card"; // Import the Card component

const Dishes = ({ categoryId, onBack }) => {
  const [dishes, setDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState({});

  useEffect(() => {
    const fetchDishes = async () => {
      if (!categoryId) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/category/${categoryId}/dish`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }

        const responseData = await response.json();
        console.log("Fetched dishes data:", responseData); // Check the structure
        setDishes(responseData);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    fetchDishes();
  }, [categoryId]);

  const toggleSelectDish = (dishId) => {
    setSelectedDishes((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (newSelected[dishId]) {
        delete newSelected[dishId]; // Deselect if already selected
      } else {
        newSelected[dishId] = 1; // Select with a default quantity of 1
      }
      return newSelected;
    });
  };

  const changeQuantity = (dishId, change) => {
    setSelectedDishes((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (newSelected[dishId]) {
        const newQuantity = newSelected[dishId] + change;
        if (newQuantity > 0) {
          newSelected[dishId] = newQuantity; // Update quantity
        } else {
          delete newSelected[dishId]; // Remove if quantity is 0
        }
      }
      return newSelected;
    });
  };

  const handlePlaceOrder = async () => {
    if (Object.keys(selectedDishes).length === 0) {
      alert("Please select at least one dish to place an order.");
      return;
    }

    // Create the order data with dish IDs only
    const orderData = {
      dishIds: Object.keys(selectedDishes).map((dishId) => parseInt(dishId)),
      quantities: Object.values(selectedDishes), // Include quantities if required elsewhere
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/order/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData), // Send the order data with dishIds
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error placing order: ${errorText}`);
      }

      const orderResponse = await response.json();
      const orderId = orderResponse.order_id; // Assuming the order ID is returned

      console.log(orderId);
      setSelectedDishes({});
      window.location.href = `/payment/${orderId}`;
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="dishes-container">
      <h2 className="dishes-h2">Available Dishes</h2>
      <div className="dishes-grid">
        {dishes.length > 0 ? (
          dishes.map((dish) => {
            const imageUrl = dish.image
              ? `http://127.0.0.1:8000/storage/${dish.image}`
              : "http://example.com/path/to/placeholder-image.jpg"; // Add your placeholder image

            console.log(`Image URL for ${dish.name}:`, imageUrl); // Log updated image URL

            return (
              <Card
                key={dish.id}
                title={dish.name}
                description={`$${parseFloat(dish.price).toFixed(2)}`}
                image={imageUrl} // Use constructed image URL
                onClick={() => toggleSelectDish(dish.id)}
              />
            );
          })
        ) : (
          <p>No dishes available in this category.</p>
        )}
      </div>
      <div className="order-controls">
        {Object.keys(selectedDishes).length > 0 && (
          <div className="quantity-controls">
            {Object.keys(selectedDishes).map((dishId) => {
              const dish = dishes.find((d) => d.id === parseInt(dishId));
              const dishName = dish ? dish.name : "Unknown Dish";

              return (
                <div key={dishId} className="quantity-item">
                  <span>{`${dishName} Qty: ${selectedDishes[dishId]}`}</span>
                  <button
                    onClick={() => changeQuantity(dishId, -1)}
                    disabled={selectedDishes[dishId] <= 1}
                  >
                    -
                  </button>
                  <button onClick={() => changeQuantity(dishId, 1)}>+</button>
                </div>
              );
            })}
          </div>
        )}
        <button onClick={handlePlaceOrder} className="btn-order">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Dishes; // Ensure this is present
