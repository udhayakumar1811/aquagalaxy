import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { API_URL, getImageUrl } from "../../config";
import { CartContext } from "../../context/CartContext"; 
import { FaStar } from "react-icons/fa"; 
import "./Product.css";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useContext(CartContext); 

  // Form States
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewErr, setReviewErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [qty, setQty] = useState(1);
  const [cartMsg, setCartMsg] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  const fetchProductDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      setProduct(data);
      setReviews(data.reviews || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  // Submit Review to Database via Backend API (requires login)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewErr("");

    if (!comment.trim()) {
      setReviewErr("Please write a comment.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setReviewErr("Please log in to write a review.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: Number(rating), comment }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviewMsg("✅ Review submitted successfully!");
        setComment("");
        setRating(5);
        fetchProductDetails(); // Refresh product data to get updated reviews
      } else {
        setReviewErr(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewErr("Error submitting review");
    } finally {
      setSubmitting(false);
      setTimeout(() => { setReviewMsg(""); setReviewErr(""); }, 3000);
    }
  };

  if (loading) {
    return (
      <>
        <div style={{ padding: "100px", textAlign: "center" }}>
          <h2>Loading Product...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <div style={{ padding: "100px", textAlign: "center" }}>
          <h2>Product Not Found!</h2>
          <Link to="/shop" className="back-link">← Back to Shop Page</Link>
        </div>
        <Footer />
      </>
    );
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 5.0;

  return (
    <>
      <section className="details-section">
        <div className="details-wrapper">
          <div className="image-container">
            <img src={getImageUrl(product.image)} alt={product.name} />
          </div>

          <div className="info-container">
            <span className="category-tag">
              {product.category_id?.name || "Aquarium Collection"}
            </span>
            <h1 className="product-name">{product.name}</h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "10px 0" }}>
              <div style={{ color: "#f59e0b", display: "flex" }}>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < Math.round(avgRating) ? "#f59e0b" : "#cbd5e1"} />
                ))}
              </div>
              <span style={{ fontWeight: "600", fontSize: "14px", color: "#475569" }}>
                {avgRating} ({reviews.length} reviews)
              </span>
            </div>

            <h2 className="details-price">₹{product.price}</h2>
            <hr className="separator" />
            <p className="description">{product.desc || "No description available."}</p>

            {product.qnt > 0 ? (
              <p style={{ marginTop: "10px", color: product.qnt <= 5 ? "#dc2626" : "#666", fontWeight: product.qnt <= 5 ? "700" : "400" }}>
                {product.qnt <= 5 ? `⚠️ Only ${product.qnt} left in stock!` : `Available Stock: ${product.qnt} items`}
              </p>
            ) : (
              <p style={{ marginTop: "10px", color: "#dc2626", fontWeight: "700" }}>
                ❌ Out of Stock
              </p>
            )}

            {cartMsg && (
              <div style={{ background: "#e0f2fe", color: "#0369a1", padding: "8px 12px", borderRadius: "6px", margin: "10px 0", fontSize: "14px", fontWeight: "600" }}>
                {cartMsg}
              </div>
            )}

            {product.qnt > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "15px 0" }}>
                <label style={{ fontWeight: "600", color: "#475569" }}>Quantity:</label>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    style={{ padding: "6px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: "16px" }}
                  >
                    −
                  </button>
                  <span style={{ padding: "0 14px", fontWeight: "600" }}>{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.qnt, q + 1))}
                    style={{ padding: "6px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: "16px" }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              className="cart-btn"
              disabled={product.qnt <= 0}
              onClick={() => {
                const result = addToCart(product, qty);
                setCartMsg(result.message);
                setTimeout(() => setCartMsg(""), 3000);
              }}
              style={product.qnt <= 0 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              {product.qnt <= 0 ? "Out of Stock" : "Add To Cart"}
            </button>
            <br />
            <Link to="/shop" className="back-link">
              ← Back to Shop Page
            </Link>
          </div>
        </div>

        {/* REVIEWS & RATINGS SECTION */}
        <div style={{ maxWidth: "1100px", margin: "60px auto 0", padding: "0 20px" }}>
          <h2 style={{ fontSize: "24px", color: "#0f172a", marginBottom: "20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>
            Customer Reviews ({reviews.length})
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>
            
            {/* Reviews List */}
            <div>
              {reviews.length === 0 ? (
                <p style={{ color: "#64748b" }}>No reviews yet. Be the first to review this product!</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {reviews.map((rev, index) => (
                    <div key={index} style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <strong>{rev.name}</strong>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <div style={{ display: "flex", color: "#f59e0b", marginBottom: "8px" }}>
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={13} color={i < rev.rating ? "#f59e0b" : "#cbd5e1"} />
                        ))}
                      </div>
                      <p style={{ margin: 0, color: "#334155", fontSize: "14px" }}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div style={{ background: "#ffffff", padding: "25px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color: "#0f172a" }}>Write a Review</h3>
              
              {reviewMsg && (
                <div style={{ background: "#dcfce7", color: "#166534", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px", fontWeight: "600" }}>
                  {reviewMsg}
                </div>
              )}
              {reviewErr && (
                <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px", fontWeight: "600" }}>
                  {reviewErr}
                </div>
              )}

              {!isLoggedIn ? (
                <p style={{ color: "#64748b", fontSize: "14px" }}>
                  Please <Link to="/login" style={{ color: "#0284c7", fontWeight: "700" }}>log in</Link> to write a review.
                </p>
              ) : (
              <form onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Rating</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", background: "white" }}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value="3">⭐⭐⭐ (3 - Good)</option>
                    <option value="2">⭐⭐ (2 - Fair)</option>
                    <option value="1">⭐ (1 - Poor)</option>
                  </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Your Comment</label>
                  <textarea 
                    rows="3" 
                    placeholder="Write your experience with this product..."
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    required
                    style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none" }}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{ background: "#0284c7", color: "white", border: "none", padding: "12px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", width: "100%" }}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
              )}
            </div>

          </div>
        </div>

      </section>
      <Footer />
    </>
  );
}

export default Product;