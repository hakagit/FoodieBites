import React, { useEffect, useState } from "react";
import "./Dishes.css"; // Import the CSS file
import Card from "./Card"; // Import the Card component

const Dishes = ({ categoryId, onBack }) => {
  const [dishes, setDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState({});

  // Placeholder image URL
  const placeholderImage = "https://via.placeholder.com/200x150?text=No+Image";

  // Mapping of dish names to image URLs
  const dishImages = {
    "American Burger":
      "https://www.foodrepublic.com/img/gallery/all-american-cheeseburger-recipe/intro-import.jpg",
    "Buffalo Burger":
      "https://www.honestburgers.co.uk/wp-content/uploads/2018/08/buffalo-breast-web-social.jpg",
    "Cheese Burger":
      "https://www.sargento.com/assets/Uploads/Recipe/Image/burger_0.jpg",
    "Honey Mustard Burger":
      "https://png.pngtree.com/thumb_back/fw800/background/20240412/pngtree-honey-mustard-burger-pork-with-cheese-and-honey-mustard-sauce-burger-image_15656162.jpg",
    "Chicken Burger":
      "https://flawlessfood.co.uk/wp-content/uploads/2020/02/blog-200225-Spicy-Chicken-Burger-14686.jpg",
    "Vegi Pizza":
      "https://www.killingthyme.net/wp-content/uploads/2020/09/veggie-deluxe-pizza-5.jpg",
    "Papperoni Pizza":
      "https://www.moulinex-me.com/medias/?context=bWFzdGVyfHJvb3R8MTQzNTExfGltYWdlL2pwZWd8YUdObEwyaG1aQzh4TlRrMk9EWXlOVGM0TmpreE1DNXFjR2N8MmYwYzQ4YTg0MTgzNmVjYTZkMWZkZWZmMDdlMWFlMjRhOGIxMTQ2MTZkNDk4ZDU3ZjlkNDk2MzMzNDA5OWY3OA",
    "Chicken Polo Pizza":
      "https://buy.am/media/image/5c/01/82/Pizza-Con-Pollo-GrillianWBSs4L6UZQhHK.jpg",
    "Shrimp Pizza":
      "https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2021/11/shrimp-pizza.jpg",
    Turkey:
      "https://images.deliveryhero.io/image/hungerstation/menus/product/hsimg-901116?width=1440&quality=75",
    Spaghetti:
      "https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/VZZJ5PUPPQI6ZDO5KIJWTCGSMM.jpg",
    Fettuccine:
      "https://hips.hearstapps.com/del.h-cdn.co/assets/17/36/2048x1152/hd-aspect-1504715566-delish-fettuccine-alfredo.jpg?resize=1200:*",
    Penne:
      "https://www.spicebangla.com/wp-content/uploads/2024/08/Spicy-Pasta-recipe-optimised-scaled.webp",
    Ravioli:
      "https://sanremo.imgix.net/2020/07/San-Remo-Fresh-Pasta-packs12777_Beef-Ravioli-w-Napolitana-Sauce-Basil-1500x999.jpg?auto=format&w=2000",
    Rose: "https://i.ytimg.com/vi/YDHgsOUlpcs/maxresdefault.jpg",
    // Add more dishes and their corresponding image URLs
  };

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
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }

        const responseData = await response.json();
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
          dishes.map((dish) => (
            <Card
              key={dish.id}
              title={dish.name}
              description={`$${parseFloat(dish.price).toFixed(2)}`}
              image={dishImages[dish.name] || placeholderImage} // Use mapped image or placeholder
              onClick={() => toggleSelectDish(dish.id)}
            />
          ))
        ) : (
          <p>No dishes available in this category.</p>
        )}
      </div>
      <div className="order-controls">
        {Object.keys(selectedDishes).length > 0 && (
          <div className="quantity-controls">
            {Object.keys(selectedDishes).map((dishId) => {
              const dish = dishes.find((d) => d.id === parseInt(dishId)); // Find the dish object by ID
              const dishName = dish ? dish.name : "Unknown Dish"; // Get the dish name

              return (
                <div key={dishId} className="quantity-item">
                  <span>{`${dishName} Qty: ${selectedDishes[dishId]}`}</span>{" "}
                  {/* Show dish name */}
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
