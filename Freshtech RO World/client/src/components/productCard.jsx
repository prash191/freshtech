import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/productCard.css";
import { BACKEND_ENDPOINT } from "../constant";

const ProductCard = ({ product }) => {
  console.log(BACKEND_ENDPOINT);
  return (
    <div className="product-card">
      {/* Product Image */}
      <Link to={`/product/${product.id}`}>
        <img src={`${BACKEND_ENDPOINT}/img/products/${product.imageCover}`} alt={product.name} className="product-image" />
      </Link>

      {/* Product Details */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        {/* Price and Discount */}
        <div className="product-price">
          {product.discount ? (
            <>
              <span className="discounted-price">₹{(product.price - (product.price * product.discount / 100)).toFixed(2)}</span>
              <span className="original-price">₹{product.price}</span>
              <span className="discount-tag">{product.discount}% OFF</span>
            </>
          ) : (
            <span className="final-price">₹{product.price}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
