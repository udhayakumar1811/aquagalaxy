import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { API_URL, getImageUrl } from "../../config";
import "./Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setAllProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const trimmedQuery = query.trim().toLowerCase();
  const results = trimmedQuery
    ? allProducts.filter((p) => p.name?.toLowerCase().includes(trimmedQuery))
    : [];

  return (
    <>
      <div className="search-page">
        <h1 className="section-title">Search Products</h1>

        <div className="search-bar-wrap">
          <FaSearch className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search for fish, plants, food, accessories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {loading && <p className="search-status-msg">Loading products...</p>}
        {error && <p className="search-status-msg search-error">{error}</p>}

        {!loading && !error && trimmedQuery && results.length === 0 && (
          <p className="search-status-msg">
            No products found matching "{query}".
          </p>
        )}

        {!loading && !error && !trimmedQuery && (
          <p className="search-status-msg">
            Start typing to search our full product catalog.
          </p>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="search-results-grid">
            {results.map((product) => (
              <Link
                key={product._id}
                to={`/shop/${product._id}`}
                className="search-result-card"
              >
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  loading="lazy"
                />
                <h3>{product.name}</h3>
                <p className="search-result-price">₹{product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Search;
