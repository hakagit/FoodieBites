import React, { useEffect, useState } from "react";
import Dishes from "./Dishes"; // Import the Dishes component
import "./Categories.css";
import Card from "./Card";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // New state for visibility

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/category/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        setCategories(responseData.data);

        // Set visibility to true after categories are fetched
        setIsVisible(true);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setIsVisible(false); // Hide the grid when going back
  };

  // Define images and descriptions for each category
  const categoryDetails = {
    pizza: {
      image:
        "https://www.allrecipes.com/thmb/0xH8n2D4cC97t7mcC7eT2SDZ0aE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/6776_Pizza-Dough_ddmfs_2x1_1725-fdaa76496da045b3bdaadcec6d4c5398.jpg",
      description: "In crust we trust! 🍕",
    },
    pasta: {
      image:
        "https://img.taste.com.au/Vbq1y6HE/taste/2019/07/easy-pasta-bake-151447-2.jpg",
      description: "A world of flavors in every bite! 🍝",
    },
    burgers: {
      image:
        "https://luma-delikatessen.ch/cdn-cgi/image/w=3420,f=webp,q=80/https://storage.googleapis.com/luma-du-shop-production/original_images/LUMA-rezept-crispy-chicken-burger-007.jpg",
      description: "our abc’s — always be cheesin’ 🍔",
    },
  };

  return (
    <div className="categories-container">
      {selectedCategoryId ? (
        <Dishes
          categoryId={selectedCategoryId}
          onBack={handleBackToCategories}
        />
      ) : (
        <div className={`categories-grid ${isVisible ? "visible" : ""}`}>
          {categories.map((category) => (
            <Card
              key={category.id}
              onClick={() => handleSelectCategory(category.id)}
              title={category.name}
              description={
                categoryDetails[category.name.toLowerCase()].description
              }
              image={categoryDetails[category.name.toLowerCase()].image}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
