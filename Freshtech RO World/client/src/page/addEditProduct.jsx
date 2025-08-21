import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getProductById } from "../actions/products";

const AddEditProduct = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    color: "",
    power: 0,
    storage: 0,
    stage: 1,
    guarantee: 12,
    installation: "Free",
    features: [],
    ratingsAverage: 0,
    ratingsQuantity: 0,
    imageCover: "",
    images: [],
  });
  

  useEffect(() => {
    if (mode === "edit" && id) {
        fetchProductById(id);
    }
  }, [mode, id]);

  const fetchProductById = async (id) => {
    const res = await getProductById(
        'GET',
        `http://localhost:3000/api/v1.0/products/${id}`
    )

    if(res.status === 200) {
        const productData = res.data.data;

        console.log("PRODUCT DATA => " , productData);

        const updatedProduct = {
            ...product
        }

        if(typeof updatedProduct.installation !== string) {
            updatedProduct.installation = 'Free';
        }

        for(const key in productData) {
            updatedProduct[key] = productData[key]; 
        }
        setProduct(updatedProduct);
    }

  }

  const handleSubmit = async (formData) => {
    if (mode === "edit") {
        if (!formData.get("imageCover")) {
            formData.delete("imageCover");
        }

        if (!formData.getAll("images").length) {
            formData.delete("images");
        }

        const response = await createProduct(
            "PATCH",
            `http://localhost:3000/api/v1.0/products/${id}`,
            {},
            formData
        );

        if(response?.status === 200) {
            navigate('/admin/products');
        }
        console.log(response);
    } else {
        const response = await createProduct(
            "POST",
            "http://localhost:3000/api/v1.0/products",
            {},
            formData
        );
        console.log(response);
        if(response?.status === 201) {
            navigate('/admin/products');
        }
    }
};


  return (
    <div>
      <h2 className="form__heading">{mode === "edit" ? "Edit Product" : "Add New Product"}</h2>
        <ProductForm product={product} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddEditProduct;


const ProductForm = ({
    product = {},
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        price: product.price || 0,
        color: product.color || "",
        power: product.power || 0,
        storage: product.storage || 0,
        stage: product.stage || 1,
        guarantee: product.guarantee || 12,
        installation: product.installation || "Free",
        imageCover: null,
        images: [],
    });
    const [features, setFeatures] = useState(product.features || []);
    const [newFeature, setNewFeature] = useState("");

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
    
        if (type === "file") {
            if (name === "images") {
                setFormData((prev) => ({
                    ...prev,
                    [name]: files,
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: files[0],
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
    
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "images") {
                if (value && value.length > 0) {
                    for (let i = 0; i < value.length; i++) {
                        form.append("images", value[i]);
                    }
                }
            } else if (key === "imageCover") {
                if (value) {
                    form.append("imageCover", value);
                }
            } else {
                form.append(key, value);
            }
        });
    
        features.forEach((feature) => form.append("features", feature));
        onSubmit(form);
    };    

    const handleFeatureAdd = () => {
        if (newFeature.trim()) {
            setFeatures([...features, newFeature.trim()]);
            setNewFeature("");
        }
        console.log("features " ,features);
    };

    const handleFeatureRemove = (index) => {
        const updated = [...features];
        updated.splice(index, 1);
        setFeatures(updated);
    };

    useEffect(() => {
        setFormData({
            name: product.name || "",
            slug: product.slug || "",
            description: product.description || "",
            price: product.price || 0,
            color: product.color || "",
            power: product.power || 0,
            storage: product.storage || 0,
            stage: product.stage || 1,
            guarantee: product.guarantee || 12,
            installation: product.installation || "Free",
            imageCover: null,
            images: [],
        });
        setFeatures(product.features || []);
    }, [product]);

    return (
        <div className="product-view__form-container">
            <form
                className="form form-product-data"
                onSubmit={handleFormSubmit}
                encType="multipart/form-data"
            >
                <div className="form__group">
                    <label className="form__label">Product Name</label>
                    <input
                        name="name"
                        className="form__input"
                        type="text"
                        defaultValue={product.name || ""}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form__group">
                    <label className="form__label">Slug</label>
                    <input
                        name="slug"
                        className="form__input"
                        type="text"
                        defaultValue={product.slug || ""}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form__group">
                    <label className="form__label">Description</label>
                    <textarea
                        name="description"
                        className="form__input"
                        defaultValue={product.description || ""}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form__group">
                    <label className="form__label">Price</label>
                    <input
                        name="price"
                        className="form__input"
                        type="number"
                        defaultValue={product.price || ""}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form__group">
                    <label className="form__label">Color</label>
                    <input
                        name="color"
                        className="form__input"
                        type="text"
                        defaultValue={product.color || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form__group">
                    <label className="form__label">Power (W)</label>
                    <input
                        name="power"
                        className="form__input"
                        type="number"
                        defaultValue={product.power || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form__group">
                    <label className="form__label">Storage (L)</label>
                    <input
                        name="storage"
                        className="form__input"
                        type="number"
                        defaultValue={product.storage || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form__group">
                    <label className="form__label">Stage</label>
                    <input
                        name="stage"
                        className="form__input"
                        type="number"
                        defaultValue={product.stage || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form__group">
                    <label className="form__label">Guarantee (Months)</label>
                    <input
                        name="guarantee"
                        className="form__input"
                        type="number"
                        defaultValue={product.guarantee || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form__group">
                    <label className="form__label">Installation</label>
                    <select
                        name="installation"
                        className="form__input"
                        onChange={handleInputChange}
                        defaultValue={product.installation || "Free"}
                    >
                        <option value="Free">Free</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>

                {/* Features */}
                <div className="form__group">
                    <label className="form__label">Features</label>
                    <div className="feature-input-wrapper">
                        <input
                            type="text"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            className="form__input"
                            placeholder="Add feature (e.g., RO)"
                        />
                        <button
                            type="button"
                            className="btn btn--small btn--green"
                            style={{
                                marginTop: '5px'
                            }}
                            onClick={handleFeatureAdd}
                        >
                            Add
                        </button>
                    </div>
                    <ul style={{
                        listStyle: 'none',
                        display: 'flex',
                        gap: 10,
                    }}>
                        {features.map((f, i) => (
                            <li key={i} style={{
                                color:'black',
                                background: '#f2f2f2',
                                listStyle: 'none',
                                display: 'inline-block',
                                padding: '10px',
                                borderRadius: 10,
                                fontWeight: '600'
                            }}>
                                {f}
                                <button
                                    type="button"
                                    onClick={() => handleFeatureRemove(i)}
                                    style={{ color: "red", marginLeft: '10px', padding: 0 }}
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Image Upload */}
                <div className="form__group">
                    <label className="form__label">Cover Image</label>
                    <input
                        type="file"
                        name="imageCover"
                        className="form__input"
                        accept="image/*"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form__group">
                    <label className="form__label">Additional Images</label>
                    <input
                        type="file"
                        name="images"
                        className="form__input"
                        multiple
                        accept="image/*"
                        onChange={handleInputChange}
                    />
                </div>

                {/* Submit */}
                <div className="form__group right">
                    <button className="btn btn--small btn--green">
                        {product._id ? "Update Product" : "Add Product"}
                    </button>
                </div>
            </form>
        </div>
    );
};

