import React, { useState, useEffect, useContext } from "react";
import { getImageUrl } from "../../config";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { getWishlist, setWishlist as saveWishlist } from "../../utils/wishlist";
import Footer from "../../components/Footer/Footer";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [message, setMessage] = useState("");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    setWishlistItems(getWishlist());
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlistItems.filter((item) => (item._id || item.id) !== id);
    setWishlistItems(updated);
    saveWishlist(updated);
  };

  return (
    <>
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", minHeight: "60vh" }}>
      <h1 style={{ textAlign: "center", color: "#0b1c3f", marginBottom: "30px", fontWeight: "800" }}>Your Wishlist</h1>

      {message && (
        <div style={{
          position: "fixed", bottom: "20px", right: "20px", background: "#0b1c3f", color: "#fff",
          padding: "12px 20px", borderRadius: "8px", zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontWeight: "600"
        }}>
          {message}
        </div>
      )}

      {wishlistItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "20px" }}>
            You haven't saved any items yet. Browse the shop and tap the heart icon on a product to save it here.
          </p>
          <Link to="/shop" style={{
            background: "#0284c7", color: "#fff", padding: "10px 25px", borderRadius: "8px", textDecoration: "none", fontWeight: "600"
          }}>
            Browse Shop
          </Link>
        </div>
      ) : (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "25px", justifyContent: "center"
        }}>
          {wishlistItems.map((item) => {
            const itemId = item._id || item.id;
            return (
              <div key={itemId} style={{
                background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", position: "relative"
              }}>
                <button 
                  onClick={() => removeFromWishlist(itemId)}
                  style={{
                    position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.6)", color: "#fff",
                    border: "none", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2
                  }}
                  title="Remove"
                >
                  <FaTrash size={12} />
                </button>

                <div style={{ width: "100%", height: "220px", background: "#f1f5f9", overflow: "hidden" }}>
                  <img src={getImageUrl(item.image)} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div style={{ padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: "0 0 5px 0" }}>{item.name}</h3>
                    <span style={{ fontSize: "18px", fontWeight: "800", color: "#ff6b00" }}>₹{item.price}</span>
                  </div>

                  <button 
                    onClick={() => {
                      const result = addToCart(item);
                      setMessage(result.success ? "🛒 Added to Cart Successfully!" : result.message);
                      setTimeout(() => setMessage(""), 2500);
                    }}
                    disabled={item.qnt === 0}
                    style={{
                      background: item.qnt === 0 ? "#94a3b8" : "#0b1c3f", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px",
                      cursor: item.qnt === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px"
                    }}
                  >
                    <FaShoppingCart /> {item.qnt === 0 ? "Out of Stock" : "Buy"}
                  </button>
                </div>
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

export default Wishlist;