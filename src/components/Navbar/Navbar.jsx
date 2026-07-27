import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

function Navbar() {
  const { cart } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Dropdown-க்கு வெளியே எங்க கிளிக் பண்ணினாலும் Close ஆகும்
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    navigate("/login");
    window.location.reload();
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
            {cart && cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </NavLink>

          {/* 🎯 PROFILE DROPDOWN WRAPPER */}
          <div className="profile-wrapper" ref={dropdownRef}>
            <button
              className="profile-icon-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              title="Profile"
            >
              <FaUser />
            </button>

            {showDropdown && (
              <div className="profile-dropdown">
                {user ? (
                  <>
                    <div className="dropdown-user-info">
                      Hi, {user?.name ? user.name.split(" ")[0] : "User"}
                    </div>
                    <hr />
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-btn"
                    >
                      <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;