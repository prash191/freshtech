import React, { useEffect, useState } from "react";
import ProductCard from "../components/productCard";
import "../assets/css/overview.css";
import { fetchProducts } from "../API/products";

const Overview = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
          let response = await fetchProducts('GET', 'http://localhost:3000/api/v1.0/products');
          console.log(response);
          setProducts(response.data.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
  
      fetchData();
  }, []);

  return (
    <div className="overview-container">
      <h2 className="overview-title">Our Products</h2>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="no-products">No products available</p>
        )}
      </div>
    </div>
  );
};

export default Overview;
