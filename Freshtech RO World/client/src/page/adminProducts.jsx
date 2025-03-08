import React, { useEffect, useState } from "react";
import Table from "../components/tableComponent";
import { fetchProducts } from "../API/products";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetchProducts('GET', 'http://localhost:3000/api/v1.0/products');
                setProducts(response.data.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (product) => {
        alert(`Edit product: ${product.name}`);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter((product) => product.id !== id));
        }
    };

    const columns = [
        { key: "name", label: "Product Name" },
        { key: "price", label: "Price" },
        { key: "stock", label: "Stock Status" },
    ];

    return (
        <div>
            <Table columns={columns} data={products} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

export default AdminProducts;