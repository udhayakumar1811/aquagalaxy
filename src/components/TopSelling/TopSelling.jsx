import React, { useState, useEffect } from "react";
import { API_URL, getImageUrl } from "../../config";
import { FaHeart, FaSearch, FaShoppingCart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./TopProducts.css";

function TopProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // 1. Fetch Products & Categories from Backend API
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/category`),
        ]);

        const prodData = await resProd.json();
        const catData = await resCat.json();

        setProducts(Array.isArray(prodData) ? prodData : []);
        setCategories(Array.isArray(catData) ? catData : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching top products:", err);
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  // 2. Filter Logic based on Category Click
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "All") return true;

    // Check category by object or string ID / Name
    const catName = p.category_id?.name || "";
    const catId = String(p.category_id?._id || p.category_id?.id || p.category_id);

    return (
      catName.toLowerCase() === selectedCategory.toLowerCase() ||
      catId === selectedCategory
    );
  });

  return (
    <section className="top-products-section">
      <div className="container">
        <h2 className="section-title">Top Selling Products</h2>

        {/* Dynamic Category Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id || cat.id}
              className={`filter-btn ${
                selectedCategory === cat.name || selectedCategory === (cat._id || cat.id)
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-text">Loading Products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products-text">No products found in this category.</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.slice(0, 6).map((product) => (
              <div key={product._id || product.id} className="product-card">
                <div className="product-img-wrapper">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="product-img"
                  />
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price}</p>

                  <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="star-icon" />
                    ))}
                  </div>

                  <div className="product-actions">
                    <button className="icon-btn" title="Add to Wishlist">
                      <FaHeart />
                    </button>
                    <button className="icon-btn" title="Quick View">
                      <FaSearch />
                    </button>
                    <button className="icon-btn" title="Add to Cart">
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="see-more-wrapper">
          <Link to="/shop" className="see-more-btn">
            See More →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TopProducts;