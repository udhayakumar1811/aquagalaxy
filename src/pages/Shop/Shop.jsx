import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import { Link, useLocation } from "react-router-dom";
import { API_URL, getImageUrl } from "../../config";
import { FaHeart } from "react-icons/fa"; // 👈 Wishlist Heart Icon
import { getWishlist, setWishlist as saveWishlist } from "../../utils/wishlist";
import './Shop.css'

function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // 👈 For sorting and displaying
  const [sortOption, setSortOption] = useState("default"); // 👈 Sorting State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]); // 👈 Wishlist State
  const [message, setMessage] = useState(""); // 👈 Notification Message

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

        let initialProducts = data;
        if (selectedCategory) {
          initialProducts = data.filter((item) => {
            const catId = item.category_id?._id || item.category_id;
            return catId === selectedCategory;
          });
        }

        setProducts(initialProducts);
        setFilteredProducts(initialProducts);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // 👈 Load wishlist from localStorage on mount
    setWishlist(getWishlist());
  }, [selectedCategory]);

  // 👈 Price Sorting Handler
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedList = [...products];

    if (option === "low-to-high") {
      sortedList.sort((a, b) => a.price - b.price);
    } else if (option === "high-to-low") {
      sortedList.sort((a, b) => b.price - a.price);
    } else if (option === "name-az") {
      sortedList.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(sortedList);
  };

  // 👈 Toggle Wishlist Handler
  const toggleWishlist = (product) => {
    let updatedWishlist = [...wishlist];
    const productId = product._id || product.id;
    const exists = updatedWishlist.some((item) => (item._id || item.id) === productId);

    if (exists) {
      updatedWishlist = updatedWishlist.filter((item) => (item._id || item.id) !== productId);
      showNotification("❌ Removed from Wishlist");
    } else {
      updatedWishlist.push(product);
      showNotification("❤️ Added to Wishlist Successfully!");
    }

    setWishlist(updatedWishlist);
    saveWishlist(updatedWishlist);
  };

  // 👈 Notification Toast Helper
  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <>
      <div className="shop-container">
        
        {/* Header and Sorting Controls */}
        <div className="shop-header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", marginBottom: "25px" }}>
          <h1 className="shop-title" style={{ margin: 0 }}>
            {selectedCategory ? "Filtered Products" : "All Products"}
          </h1>

          {/* 👈 Price Sorting Dropdown */}
          <div className="sort-dropdown-container">
            <select 
              value={sortOption} 
              onChange={handleSortChange}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                color: "#334155",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="default">Sort by: Featured</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Floating Notification Toast */}
        {message && (
          <div style={{
            position: "fixed", bottom: "20px", right: "20px", background: "#0b1c3f", color: "#fff",
            padding: "12px 20px", borderRadius: "8px", zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontWeight: "600"
          }}>
            {message}
          </div>
        )}

        {selectedCategory && (
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <Link
              to="/shop"
              style={{
                color: "#ff6b00",
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              ← Show All Products
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

        {!loading && !error && filteredProducts.length === 0 && (
          <div style={{ textAlign: "center", margin: "50px 0" }}>
            <h2>No products found!</h2>
            <p style={{ marginTop: "10px" }}>
              Try selecting another category or view all products.
            </p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const productId = product._id || product.id;
              const isWishlisted = wishlist.some((w) => (w._id || w.id) === productId);

              return (
                <div key={productId} className="product-card" style={{ position: "relative" }}>
                  
                  {/* Wishlist Heart Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "#ffffff",
                      border: "none",
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      color: isWishlisted ? "#ef4444" : "#cbd5e1",
                      zIndex: 2,
                      transition: "color 0.2s, transform 0.2s"
                    }}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <FaHeart size={16} />
                  </button>

                  <div style={{ width: "100%", height: "220px", overflow: "hidden", borderRadius: "8px", position: "relative" }}>
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: product.qnt <= 0 ? 0.5 : 1 }}
                    />
                    {product.qnt <= 0 && (
                      <span style={{
                        position: "absolute", top: "10px", left: "10px", background: "#dc2626", color: "#fff",
                        fontSize: "11px", fontWeight: "700", padding: "4px 8px", borderRadius: "4px"
                      }}>
                        OUT OF STOCK
                      </span>
                    )}
                  </div>

                  <h3>{product.name}</h3>

                  <p className="product-price">₹{product.price}</p>

                  <Link
                    to={`/shop/${product._id}`}
                    className="view-btn"
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Shop;