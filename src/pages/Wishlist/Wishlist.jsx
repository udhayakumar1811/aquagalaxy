import React from "react";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import "./Wishlist.css";

function Wishlist() {
  return (
    <>
      <div className="wishlist-page">
        <FaHeart className="wishlist-empty-icon" />
        <h1 className="section-title">Your Wishlist</h1>
        <p className="wishlist-empty-text">
          You haven't saved any items yet. Browse the shop and tap the heart
          icon on a product to save it here.
        </p>
        <Link to="/shop" className="wishlist-shop-btn">
          Browse Shop
        </Link>
      </div>

      <Footer />
    </>
  );
}

export default Wishlist;
