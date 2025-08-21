import React, { useEffect, useState } from "react";
import DataTable from "../components/tableComponent";
import { deleteProductById, fetchProducts } from "../actions/products";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetchProducts('GET', 'http://localhost:3000/api/v1.0/products');
                console.log("Products => ", response);
                setProducts(response.data.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (id) => {
        navigate(`/admin/products/edit/${id}`);
    };

    const deleteProduct = async (id) => {
        try {
            const response = await deleteProductById("DELETE", `http://localhost:3000/api/v1.0/products/${id}`);
            console.log("Response => ", response);
        }catch(err) {
            console.log(err);
        }
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter((product) => product.id !== id));
            deleteProduct(id);
        }
    };

    const columns = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Product Name',
        },
        {
            id: 'price',
            numeric: false,
            disablePadding: true,
            label: 'Price',
        },
        {
            id: 'storage',
            numeric: false,
            disablePadding: true,
            label: 'Stock Status',
        }
    ];

    return (
        <>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <h2 style={{color: 'black'}}>All Products</h2>
            <button className="btn" style={{
                height: 'fit-content'
            }} 
            onClick={() => navigate('/admin/products/add')}
            >
                Add Product
            </button>
        </div>
        <DataTable columns={columns} data={products} onEdit={handleEdit} onDelete={handleDelete} />
        </>
    );
};

export default AdminProducts;