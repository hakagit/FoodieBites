import React from "react";
import "./Menu.css";
import Categories from "../Components/Categories";
import ImageGallery from "./ImageGallery";

export const Order = () => {
  return (
    <section className="menu" id="menu">
      <div className="menu-content">
        <h1>
          Foodies <span>Gallery</span>
        </h1>
      </div>

      {/* Add the ImageGallery component here */}
      <div className="gallery-container">
        <ImageGallery />
      </div>
    </section>
  );
};
