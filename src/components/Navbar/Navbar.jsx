import { useState } from "react";
import "./Navbar.css";
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">

        <div className="logo">
          <h2>Aquafy</h2>
        </div>

        {/* Dynamic open class driven by toggle state */}
        <ul className={`menu ${isMenuOpen ? "open" : ""}`}>
          <li><a href="#" onClick={() => setIsMenuOpen(false)}>Home</a></li>
          <li><a href="#" onClick={() => setIsMenuOpen(false)}>Shop</a></li>
          <li><a href="#" onClick={() => setIsMenuOpen(false)}>Categories</a></li>
          <li><a href="#" onClick={() => setIsMenuOpen(false)}>Blog</a></li>
          <li><a href="#" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
        </ul>

        <div className="nav-right">
          <div className="icons">
            <FaSearch />
            <FaHeart />
            <FaShoppingCart />
            <FaUser />
          </div>

          {/* Hamburger Icon Switcher Button */}
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;