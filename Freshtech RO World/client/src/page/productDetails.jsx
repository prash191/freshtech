import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/productDetail.css";
import { ANUAL_MAINTAINANCE_INFO, BACKEND_ENDPOINT, PHONE } from "../constant";
import { BACKEND_API_ENDPOINT } from "../constant";
import ImageCarousel from "../components/imageCarousel";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const ProductDetails = () => {
    const [pincode, setPincode] = useState("");
    const [deliveryStatus, setDeliveryStatus] = useState(null);
    const { id } = useParams(); // Get product ID from URL
    const [product, setProduct] = useState(null);

    const checkDelivery = () => {
        setDeliveryStatus(Math.random() > 0.5 ? "Available" : "Not Available");
    };

    useEffect(() => {
        // Fetch product details from backend (Replace with actual API call)
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_API_ENDPOINT}/products/${id}`
                ); // Update with actual API URL
                const res = await response.json();
                setProduct(res.data);
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
        <div className="product-container">
            {/* Product Images & Info */}
            <div className="product-main">
                {/* Left - Image Carousel */}
                <div className="product-images">
                    <ImageCarousel images={product.images} />
                </div>

                {/* Right - Product Info */}
                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price-details">₹{product.price}</p>

                    {/* Pincode Delivery Check */}
                    <div className="delivery-check">
                        <input
                            type="text"
                            placeholder="Enter Pincode"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="pincode-input"
                        />
                        <button
                            onClick={checkDelivery}
                            className="check-button"
                        >
                            Check
                        </button>
                    </div>
                    {deliveryStatus && (
                        <p
                            className={`delivery-status ${
                                deliveryStatus === "Available"
                                    ? "available"
                                    : "not-available"
                            }`}
                        >
                            {deliveryStatus}
                        </p>
                    )}
                    <BookNow />
                </div>
            </div>

            {/* Key Features */}
            <div className="section">
                <h2>Key Features</h2>
                <ul className="features-list">
                    {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            </div>

            {/* Specifications Table */}
            <div className="section">
                <h2>Specifications</h2>
                <div className="specifications">
                    <Features keys="Stages" values={product.stage} />
                    <Features
                        keys="Installation"
                        values={product.installation}
                    />
                    <Features keys="Color" values={product.color} />
                    <Features keys="Storage" values={product.storage} />
                    <Features keys="Power" values={product.power} />
                    <Features
                        keys="Guarantee"
                        values={Math.floor(product.guarantee / 12)}
                    />
                </div>
            </div>

            {/* About Our Annual Maintenance Services */}
            <div className="section">
                <h2>Annual Maintenance Services</h2>
                <p>{ANUAL_MAINTAINANCE_INFO}</p>
            </div>

            {/* Reviews */}
            <div className="section">
                <h2>Customer Reviews</h2>
                {product.reviews && product.reviews.length > 0 ? (
                    <div className="reviews">
                        {product.reviews.map((review, index) => (
                            <div key={index} className="review-card">
                                <span className="review-rating">
                                    ⭐ {review.rating} / 5
                                </span>
                                <p className="review-comment">
                                    {review.comment}
                                </p>
                                <p className="review-user">- {review.user}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>

            {/* Similar Products */}
            {product.similarProducts && product.similarProducts.length > 0 && (
                <div className="section">
                    <h2>Similar Products</h2>
                    <div className="similar-products">
                        {product.similarProducts.map((sp, index) => (
                            <div key={index} className="similar-product-card">
                                <img
                                    src={sp.image}
                                    alt={sp.name}
                                    className="similar-product-image"
                                />
                                <h3 className="similar-product-name">
                                    {sp.name}
                                </h3>
                                <p className="similar-product-price">
                                    ₹{sp.price}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

function Features({ keys, values }) {
    return (
        <div key={keys} className="spec-category">
            <div className="spec-items">
                <div key={keys} className="spec-row">
                    <span className="spec-key">{keys}</span>
                    <span className="spec-value">{values}</span>
                </div>
            </div>
        </div>
    );
}

function BookNow() {
    return (
        <div className="book-now-container">

            {/* Call Now Button */}
            <a href={`tel:${PHONE}`} className="book-now-button call">
                <FaPhoneAlt className="icon" /> Book Now on Call
            </a>

            {/* WhatsApp Chat Button */}
            <a
                href={`https://wa.me/+91${PHONE}?text=I'm%20interested%20in%20your%20product!`}
                target="_blank"
                rel="noopener noreferrer"
                className="book-now-button whatsapp"
            >
                <FaWhatsapp className="icon" /> Chat Now on WhatsApp
            </a>
        </div>
    );
}

export default ProductDetails;
