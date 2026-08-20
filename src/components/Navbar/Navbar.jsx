import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaUserShield,
  FaBars,
  FaTimes,
  FaHome,
  FaStore,
  FaInfoCircle,
  FaEnvelope,
} from "react-icons/fa";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { getWishlist, WISHLIST_UPDATED_EVENT } from "../../utils/wishlist";

function Navbar() {
  const { cart } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0); // 👈 Wishlist count state
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Calculate wishlist count from localStorage
    const updateWishlistCount = () => {
      setWishlistCount(getWishlist().length);
    };

    updateWishlistCount();

    // "storage" fires when the wishlist changes in ANOTHER tab.
    // "wishlistUpdated" (dispatched from src/utils/wishlist.js) fires
    // instantly when it changes in THIS tab — no polling needed.
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener(WISHLIST_UPDATED_EVENT, updateWishlistCount);

    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener(WISHLIST_UPDATED_EVENT, updateWishlistCount);
    };
  }, []);

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
    setMenuOpen(false);
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <h2>Aquafy</h2>
          </div>

          <ul className={`menu ${menuOpen ? "menu-open" : ""}`}>
            <li>
              <NavLink to="/" onClick={() => setMenuOpen(false)}>
                <FaHome className="mobile-only-link" /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" onClick={() => setMenuOpen(false)}>
                <FaStore className="mobile-only-link" /> Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={() => setMenuOpen(false)}>
                <FaInfoCircle className="mobile-only-link" /> About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
                <FaEnvelope className="mobile-only-link" /> Contact
              </NavLink>
            </li>

            <div className="mobile-only-link" style={{ width: "100%", marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
              {user ? (
                <>
                  <div style={{ fontWeight: "600", color: "#0099cc", marginBottom: "10px" }}>
                    Hi, {user?.name ? user.name.split(" ")[0] : "User"}
                  </div>
                  {user.role === "admin" && (
                    <NavLink to="/admin" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", color: "#0099cc" }}>
                      <FaUserShield /> Admin Panel
                    </NavLink>
                  )}
                  <NavLink to="/profile" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", color: "#333" }}>
                    <FaUser /> My Profile
                  </NavLink>
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Link to="/login" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "#333", fontWeight: "600", padding: "8px 0" }}>
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: "#0099cc", fontWeight: "600", padding: "8px 0" }}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </ul>

          <div className="icons">
            <NavLink to="/search" className="icon-link">
              <FaSearch />
            </NavLink>

            {/* 👈 Wishlist Link with Badge */}
            <NavLink to="/wishlist" className="icon-link" style={{ position: "relative" }}>
              <FaHeart />
              {wishlistCount > 0 && (
                <span className="cart-badge">{wishlistCount}</span>
              )}
            </NavLink>

            {/* Cart Link with Badge */}
            <NavLink to="/cart" className="icon-link" style={{ position: "relative" }}>
              <FaShoppingCart />
              {cart && cart.length > 0 && (
                <span className="cart-badge">{cart.length}</span>
              )}
            </NavLink>

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
                      
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="dropdown-item"
                          onClick={() => setShowDropdown(false)}
                          style={{ color: "#0099cc", fontWeight: "bold" }}
                        >
                          <FaUserShield style={{ marginRight: "8px" }} /> Admin Panel
                        </Link>
                      )}

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

            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="menu-backdrop" onClick={() => setMenuOpen(false)}></div>
      )}
    </>
  );
}

export default Navbar;