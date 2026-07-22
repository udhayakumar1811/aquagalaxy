import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// COMPONENTS IMPORT
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

// STYLES IMPORT
import "./Product.css";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Old: fetch(`http://localhost:5000/api/products/${id}`)
// New:
fetch(`http://127.0.0.1:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "100px", textAlign: "center" }}>
          <h2>Loading Product Details...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "100px", textAlign: "center" }}>
          <h2>Product Not Found!</h2>
          <Link to="/shop" className="back-link">← Back to Shop</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <section className="details-section">
        <div className="details-wrapper">
          
          <div className="image-container">
            <img src={`http://localhost:5000/${product.image}`} alt={product.name} />
          </div>

          <div className="info-container">
            <span className="category-tag">Aquarium Collection</span>
            <h1 className="product-name">{product.name}</h1>
            <h2 className="details-price">₹{product.price}</h2>
            
            <hr className="separator" />
            
            <p className="description">
              Available Quantity: {product.qnt ?? 0} items
            </p>
            
            <button className="cart-btn">Add To Cart</button>
            
            <br />
            <Link to="/shop" className="back-link">
              ← Back to Shop Page
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default Product;