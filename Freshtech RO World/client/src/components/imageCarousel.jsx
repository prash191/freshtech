import React, { useState, useEffect } from "react";
import "../assets/css/imageCarousel.css";
import { BACKEND_ENDPOINT } from "../constant";

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="carousel">
      {/* Left Arrow */}
      <button className="carousel-btn left" onClick={prevSlide}>
        &#10094;
      </button>

      {/* Image Display */}
      <div className="carousel-images">
        {images.map((img, index) => (
          <img
            key={index}
            src={`${BACKEND_ENDPOINT}/img/products/${img}`}
            alt={`Product ${index + 1}`}
            className={`carousel-image ${index === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Right Arrow */}
      <button className="carousel-btn right" onClick={nextSlide}>
        &#10095;
      </button>

      {/* Dots Navigation */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
