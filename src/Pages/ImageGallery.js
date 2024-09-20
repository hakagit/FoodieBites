import React, { useState } from "react";
import ModalImage from "react-modal-image";

const images = [
  "https://via.placeholder.com/600x400?text=Image+1",
  "https://via.placeholder.com/600x400?text=Image+2",
  "https://via.placeholder.com/600x400?text=Image+3",
  "https://via.placeholder.com/600x400?text=Image+4",
  "https://via.placeholder.com/600x400?text=Image+5",
  "https://via.placeholder.com/600x400?text=Image+6",
];

const ImageGallery = () => {
  return (
    <div className="gallery-container">
      {images.map((url, index) => (
        <div key={index} className="gallery-item">
          <ModalImage
            small={url}
            large={url}
            alt={`Gallery Image ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
