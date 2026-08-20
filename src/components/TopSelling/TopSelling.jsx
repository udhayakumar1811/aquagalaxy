import React, { useState, useEffect, useContext } from "react";
import { API_URL, getImageUrl } from "../../config";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { getWishlist, setWishlist as saveWishlist } from "../../utils/wishlist";

function TopSelling() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const { addToCart } = useContext(CartContext);

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

    setWishlist(getWishlist());
  }, []);

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

  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "All") return true;
    const catName = p.category_id?.name || "";
    const catId = String(p.category_id?._id || p.category_id?.id || p.category_id);
    return (
      catName.toLowerCase() === selectedCategory.toLowerCase() ||
      catId === selectedCategory
    );
  });

  return (
    <section style={{ padding: "60px 20px", backgroundColor: "#fff6f3", textAlign: "center" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {message && (
          <div style={{
            position: "fixed", bottom: "20px", right: "20px", background: "#0b1c3f", color: "#fff",
            padding: "12px 20px", borderRadius: "8px", zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontWeight: "600"
          }}>
            {message}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>
            Top Selling Products
          </h2>

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedCategory("All")}
              style={{
                backgroundColor: selectedCategory === "All" ? "#ff6b00" : "#ffffff",
                color: selectedCategory === "All" ? "#ffffff" : "#475569",
                border: "1px solid #cbd5e1",
                padding: "8px 20px",
                borderRadius: "20px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              All
            </button>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name || selectedCategory === (cat._id || cat.id);
              return (
                <button
                  key={cat._id || cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  style={{
                    backgroundColor: isActive ? "#ff6b00" : "#ffffff",
                    color: isActive ? "#ffffff" : "#475569",
                    border: "1px solid #cbd5e1",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div style={{ fontSize: "16px", color: "#64748b", padding: "40px 0" }}>Loading Products...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ fontSize: "16px", color: "#64748b", padding: "40px 0" }}>No products found in this category.</div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
            gap: "25px", 
            justifyContent: "center",
            marginBottom: "40px" 
          }}>
            {filteredProducts.slice(0, 8).map((product) => {
              const itemId = product._id || product.id;
              const isWishlisted = wishlist.some((w) => (w._id || w.id) === itemId);

              return (
                <div 
                  key={itemId} 
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    overflow: "hidden",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    position: "relative"
                  }}
                >
                  <button 
                    onClick={() => toggleWishlist(product)}
                    style={{
                      position: "absolute", top: "12px", right: "12px", background: "#ffffff",
                      border: "none", width: "32px", height: "32px", borderRadius: "50%",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)", color: isWishlisted ? "#ef4444" : "#cbd5e1",
                      zIndex: 2, transition: "color 0.2s"
                    }}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <FaHeart size={14} />
                  </button>

                  <div style={{ width: "100%", height: "220px", backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div style={{ padding: "18px", display: "flex", flexDirection: "column", flexGrow: 1, gap: "10px" }}>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>{product.name}</h3>
                      <span style={{ fontSize: "18px", fontWeight: "800", color: "#ff6b00" }}>₹{product.price}</span>
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                      <Link 
                        to={`/shop/${itemId}`} 
                        style={{
                          flex: 1, background: "#0284c7", color: "#fff", textAlign: "center",
                          padding: "8px", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: "600"
                        }}
                      >
                        View Details
                      </Link>
                      <button 
                        onClick={() => {
                          addToCart(product);
                          showNotification("🛒 Added to Cart Successfully!");
                        }}
                        style={{
                          background: "#f1f5f9", border: "none", padding: "8px 12px", borderRadius: "6px",
                          cursor: "pointer", color: "#0b1c3f", display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                        title="Add to Cart"
                      >
                        <FaShoppingCart size={14} />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <Link 
            to="/shop" 
            style={{
              backgroundColor: "#0f172a",
              color: "#ffffff",
              padding: "12px 35px",
              borderRadius: "8px",
              fontWeight: "700",
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            See More →
          </Link>
        </div>

      </div>
    </section>
  );
}

export default TopSelling;