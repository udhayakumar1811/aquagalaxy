import React, { useContext } from "react";
import "./Navbar.css";
import { FaSearch, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../context/CartContext"; // 👈 Import Context

function Navbar() {
  const { totalItems } = useContext(CartContext); // 👈 Get totalItems

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <h2>Aquafy</h2>
        </div>

        <ul className="menu">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/shop">Shop</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>

        <div className="icons">
          <NavLink to="/search" className="icon-link"><FaSearch /></NavLink>
          <NavLink to="/wishlist" className="icon-link"><FaHeart /></NavLink>
          
          {/* Dynamic Cart Icon with Badge */}
          <NavLink to="/cart" className="icon-link" style={{ position: "relative" }}>
            <FaShoppingCart />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </NavLink>

          <NavLink to="/profile" className="icon-link"><FaUser /></NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;