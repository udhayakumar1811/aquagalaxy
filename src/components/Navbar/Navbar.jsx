import { useContext, useState, useEffect, useRef, useCallback } from "react";
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
  FaMoon,
  FaSun,
  FaBoxOpen,
} from "react-icons/fa";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { ThemeContext } from "../../context/ThemeContext";
import { getWishlist, WISHLIST_UPDATED_EVENT } from "../../utils/wishlist";
import { ADMIN_TIER_ROLES } from "../../constants/roles";
import { getAuthUser, clearAuthSession } from "../../utils/auth";
import udhayaLogo from "../../assets/udhaya-logo.png";

function Navbar() {
  const { cart, totalItems } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => getAuthUser());

  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(() => getWishlist().length);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Sync user state from localStorage
  const syncUserState = useCallback(() => {
    setUser(getAuthUser());
  }, []);

  // Sync user state on storage events, custom auth events, and route changes
  useEffect(() => {
    const handleStorage = () => {
      syncUserState();
    };

    const updateWishlistCount = () => {
      setWishlistCount(getWishlist().length);
    };

    updateWishlistCount();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("auth-changed", handleStorage);
    window.addEventListener(WISHLIST_UPDATED_EVENT, updateWishlistCount);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("auth-changed", handleStorage);
      window.removeEventListener(WISHLIST_UPDATED_EVENT, updateWishlistCount);
    };
  }, [syncUserState]);

  // Update user state and auto-close drawers/menus on route change
  useEffect(() => {
    syncUserState();
    setShowDropdown(false);
    setMenuOpen(false);
  }, [location.pathname, syncUserState]);

  // Handle click outside desktop profile dropdown
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

  // Handle Escape key to close mobile drawer and desktop dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setShowDropdown(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Auto-close mobile drawer if window resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const handleLogout = () => {
    setShowDropdown(false);
    setMenuOpen(false);
    clearAuthSession(true);
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchQuery("");
      setMenuOpen(false);
    }
  };

  // Safe total item count in cart
  const cartCount =
    typeof totalItems === "number"
      ? totalItems
      : Array.isArray(cart)
      ? cart.reduce(
          (total, item) =>
            total + (Number(item?.quantity || item?.qty) || 1),
          0
        )
      : 0;

  // Do not mount consumer store Navbar on /admin — admin has dedicated sidebar
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <nav
        className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#08213b]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#12375c] transition-colors shadow-xs"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Brand Logo & Title */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group select-none"
          >
            <img
              src={udhayaLogo}
              alt="UDHAYA AQUATICS Logo"
              className="h-9 sm:h-11 w-auto object-contain rounded-lg p-0.5 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-lg font-extrabold text-[#0077b6] dark:text-sky-400 tracking-tight leading-tight group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                UDHAYA AQUATICS
              </span>
              <span className="hidden sm:inline-block text-[10px] text-slate-400 font-medium tracking-wide">
                Aquarium &amp; Pet Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-7 lg:gap-9 list-none m-0 p-0">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `relative py-1 text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#0077b6] dark:text-sky-400 font-bold after:w-full"
                      : "text-slate-700 dark:text-slate-200 hover:text-[#0077b6] dark:hover:text-sky-400 after:w-0 hover:after:w-full"
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#0077b6] dark:after:bg-sky-400 after:rounded-full after:transition-all after:duration-300`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `relative py-1 text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#0077b6] dark:text-sky-400 font-bold after:w-full"
                      : "text-slate-700 dark:text-slate-200 hover:text-[#0077b6] dark:hover:text-sky-400 after:w-0 hover:after:w-full"
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#0077b6] dark:after:bg-sky-400 after:rounded-full after:transition-all after:duration-300`
                }
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `relative py-1 text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#0077b6] dark:text-sky-400 font-bold after:w-full"
                      : "text-slate-700 dark:text-slate-200 hover:text-[#0077b6] dark:hover:text-sky-400 after:w-0 hover:after:w-full"
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#0077b6] dark:after:bg-sky-400 after:rounded-full after:transition-all after:duration-300`
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `relative py-1 text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#0077b6] dark:text-sky-400 font-bold after:w-full"
                      : "text-slate-700 dark:text-slate-200 hover:text-[#0077b6] dark:hover:text-sky-400 after:w-0 hover:after:w-full"
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#0077b6] dark:after:bg-sky-400 after:rounded-full after:transition-all after:duration-300`
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Dark/Light Mode Toggle (Desktop only - available in mobile drawer) */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              aria-label="Toggle dark mode"
              type="button"
            >
              {theme === "light" ? (
                <FaMoon size={15} />
              ) : (
                <FaSun size={15} className="text-amber-400" />
              )}
            </button>

            {/* Search (Mobile & Desktop) */}
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `p-2 rounded-full transition-all hover:scale-105 ${
                  isActive
                    ? "text-[#0077b6] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
              title="Search Catalog"
              aria-label="Search Catalog"
            >
              <FaSearch size={16} />
            </NavLink>

            {/* Wishlist Link with Badge (Desktop only - available in mobile drawer) */}
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `hidden md:flex relative p-2 rounded-full transition-all hover:scale-105 ${
                  isActive
                    ? "text-red-500 bg-red-50 dark:bg-red-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
              title="Wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <FaHeart size={15} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#ff4d2d] text-white text-[10px] font-extrabold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center leading-none shadow-xs">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </NavLink>

            {/* Cart Link with Badge (Mobile & Desktop) */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative p-2 rounded-full transition-all hover:scale-105 ${
                  isActive
                    ? "text-[#0077b6] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
              title="Shopping Cart"
              aria-label={`Cart (${cartCount} items)`}
            >
              <FaShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#ff4d2d] text-white text-[10px] font-extrabold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center leading-none shadow-xs animate-in zoom-in">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </NavLink>

            {/* Desktop User Profile Dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                className={`p-2 rounded-full transition-all cursor-pointer hover:scale-105 ${
                  showDropdown
                    ? "text-[#0077b6] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40"
                    : "text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                onClick={() => setShowDropdown((prev) => !prev)}
                title="Account Menu"
                aria-label="Account Menu"
                aria-expanded={showDropdown}
                type="button"
              >
                <FaUser size={15} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 transition-all duration-200">
                  {user ? (
                    <>
                      {/* User Header Summary */}
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user?.name || "Customer"}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {user?.email || user?.mobile || ""}
                        </div>
                        <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/40">
                          {ADMIN_TIER_ROLES.includes(user?.role)
                            ? "Administrator"
                            : "Customer"}
                        </span>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {ADMIN_TIER_ROLES.includes(user?.role) && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            <FaUserShield className="text-sky-500" /> Admin Panel
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <FaUser className="text-sky-500" /> My Profile
                        </Link>

                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <FaBoxOpen className="text-sky-500" /> My Orders
                        </Link>
                      </div>

                      <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </>
                  ) : (
                    <div className="py-1">
                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FaUser className="text-sky-500 text-xs" /> Login
                      </Link>
                      <Link
                        to="/signup"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span>Create Account</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              onClick={() => setMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              aria-expanded={menuOpen}
              type="button"
            >
              <FaBars size={17} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 w-76 max-w-[85vw] bg-white dark:bg-[#08213b] z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden border-l border-slate-200 dark:border-[#12375c] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-[#12375c]">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src={udhayaLogo}
              alt="UDHAYA AQUATICS"
              className="h-9 w-auto object-contain rounded-md bg-white p-0.5"
            />
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-[#0077b6] dark:text-sky-400 leading-tight">
                UDHAYA AQUATICS
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Aquarium &amp; Pet Studio
              </span>
            </div>
          </Link>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation menu"
            type="button"
          >
            <FaTimes />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Mobile Search */}
          <form onSubmit={handleMobileSearch} className="relative mb-2">
            <input
              type="text"
              placeholder="Search fish, tanks, food..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none border border-transparent focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800/90 transition-all placeholder:text-slate-400"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          </form>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          <nav className="flex flex-col space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <FaHome className="text-sky-500" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <FaStore className="text-sky-500" />
              <span>Shop Products</span>
            </NavLink>
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <FaHeart className="text-red-500" />
                <span>Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="bg-[#ff4d2d] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <FaShoppingCart className="text-sky-500" />
                <span>Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-[#ff4d2d] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <FaInfoCircle className="text-sky-500" />
              <span>About Us</span>
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <FaEnvelope className="text-sky-500" />
              <span>Contact Us</span>
            </NavLink>
          </nav>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

          {/* User Account / Admin Section */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Account
          </div>
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs">
                  <FaUser />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {user?.name || "Customer"}
                  </div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold truncate">
                    {ADMIN_TIER_ROLES.includes(user?.role)
                      ? "Administrator"
                      : "Customer"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                {ADMIN_TIER_ROLES.includes(user?.role) && (
                  <NavLink
                    to="/admin"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUserShield className="text-sky-500" />
                    <span>Admin Panel</span>
                  </NavLink>
                )}

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <FaUser className="text-sky-500" />
                  <span>My Profile</span>
                </NavLink>

                <NavLink
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaBoxOpen className="text-sky-500" />
                  <span>My Orders</span>
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/login"
                className="text-center py-2.5 px-3 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 shadow-xs transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-center py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Bottom Footer with Theme Toggle */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === "light" ? (
              <>
                <FaMoon className="text-sky-500" />
                <span>Switch to Dark Mode</span>
              </>
            ) : (
              <>
                <FaSun className="text-amber-400" />
                <span>Switch to Light Mode</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Navbar;

