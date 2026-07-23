import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

function Navbar() {
  const { cart } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <h2>Aquafy</h2>
        </div>

        <ul className="menu">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/shop">Shop</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
        </ul>

        <div className="icons">
          <NavLink to="/search" className="icon-link">
            <FaSearch />
          </NavLink>
          <NavLink to="/wishlist" className="icon-link">
            <FaHeart />
          </NavLink>

          <NavLink
            to="/cart"
            className="icon-link"
            style={{ position: "relative" }}
          >
            <FaShoppingCart />
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </NavLink>

          {/* User Logged In Check */}
          {user ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#ff6b00",
                }}
              >
                Hi, {user?.name ? user.name.split(" ")[0] : "User"}
              </span>
              <button
                onClick={handleLogout}
                title="Logout"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#222",
                }}
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="icon-link" title="Login">
              <FaUser />
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
