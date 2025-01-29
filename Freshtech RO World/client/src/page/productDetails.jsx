import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/productDetail.css";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details from backend (Replace with actual API call)
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${id}`); // Update with actual API URL
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!product) {
    return <p className="loading-text">Loading product details...</p>;
  }

  return (
    <div className="product-details-container">
      {/* Product Image */}
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h2 className="product-title">{product.name}</h2>
        <p className="product-description">{product.description}</p>

        {/* Price and Discount */}
        <div className="product-price">
          {product.discount ? (
            <>
              <span className="discounted-price">
                ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
              </span>
              <span className="original-price">${product.price}</span>
              <span className="discount-tag">{product.discount}% OFF</span>
            </>
          ) : (
            <span className="final-price">${product.price}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetails;
