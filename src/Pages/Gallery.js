import React from "react";
import "./Gallery.css";
import ImageGallery from "./ImageGallery";
export const Gallery = () => {
  return (
    <section className="gallery" id="gallery">
      {/* Add the ImageGallery component here */}
      <div className="gallery-container">
        <ImageGallery />
      </div>
    </section>
  );
};
