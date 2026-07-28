import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import { Link, useLocation } from "react-router-dom";
import { API_URL, getImageUrl } from "../../config";
import "./shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/api/products`);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        if (selectedCategory) {
          const filteredProducts = data.filter((item) => {
            const catId = item.category_id?._id || item.category_id;
            return catId === selectedCategory;
          });

          setProducts(filteredProducts);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <>
      <div className="shop-container">
        <h1 className="shop-title">
          {selectedCategory ? "Filtered Products" : "All Products"}
        </h1>

        {selectedCategory && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Link
              to="/shop"
              style={{
                color: "#ff6b00",
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              Show All Products
            </Link>
          </div>
        )}

        {loading && (
          <h2 style={{ textAlign: "center", margin: "40px 0" }}>
            Loading Products...
          </h2>
        )}

        {error && (
          <h2 style={{ textAlign: "center", color: "red", margin: "40px 0" }}>
            {error}
          </h2>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: "center", margin: "50px 0" }}>
            <h2>No products found for this category!</h2>
            <p style={{ marginTop: "10px" }}>
              Try selecting another category or view all products.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  loading="lazy"
                />

                <h3>{product.name}</h3>

                <p className="product-price">₹{product.price}</p>

                <Link
                  to={`/shop/${product._id}`}
                  className="view-btn"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Shop;