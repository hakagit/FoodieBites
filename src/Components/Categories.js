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
        console.log("Fetched categories:", responseData.data); // Log the fetched categories

        setCategories(responseData.data);
        setIsVisible(true); // Set visibility to true after categories are fetched
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
              id={`category-${category.id}`} // Unique ID for accessibility
              onClick={() => handleSelectCategory(category.id)}
              title={category.name}
              image={`http://127.0.0.1:8000/storage/${category.image}`} // Updated path for images
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
