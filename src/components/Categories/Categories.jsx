import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, getImageUrl } from "../../config";
import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/category`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?category=${categoryId}`);
  };

  return (
    <section className="categories">
      <div className="section-title-wrap">
        <span className="title-bg">Categories</span>
        <h2 className="title-main">Categories</h2>
      </div>

      <div className="container">
        {loading ? (
          <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
            Loading Categories...
          </p>
        ) : categories.length === 0 ? (
          <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
            No categories available in database.
          </p>
        ) : (
          categories.map((cat) => (
            <div
              className="category-card"
              key={cat._id}
              onClick={() => handleCategoryClick(cat._id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-header-text">
                <h3>{cat.name}</h3>
                <span className="item-count">{cat.count || 0} Items</span>
              </div>
              <div className="category-img-wrapper">
                {/* 👈 Dynamic Render Image URL */}
                <img src={getImageUrl(cat.image)} alt={cat.name} />
              </div>
              <button className="category-btn">
                <span className="btn-text">Shop Now </span>→
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Categories;