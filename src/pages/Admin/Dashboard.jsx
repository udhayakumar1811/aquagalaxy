import React, { useState, useEffect } from "react";
import { API_URL, getImageUrl } from "../../config";
import { 
  FaTachometerAlt, 
  FaBoxOpen, 
  FaTags, 
  FaShoppingCart, 
  FaUsers, 
  FaCog, 
  FaSignOutAlt 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Category Form State
  const [catName, setCatName] = useState("");
  const [catImage, setCatImage] = useState("");

  // Product Form State
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodQnt, setProdQnt] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodDesc, setProdDesc] = useState("");

  const fetchData = async () => {
    try {
      const [resCat, resProd] = await Promise.all([
        fetch(`${API_URL}/api/category`),
        fetch(`${API_URL}/api/products`),
      ]);
      const catData = await resCat.json();
      const prodData = await resProd.json();

      setCategories(catData);
      setProducts(prodData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ADD CATEGORY
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName, image: catImage, isCategory: true }),
      });

      if (res.ok) {
        setMessage("✅ Category Created Successfully!");
        setCatName("");
        setCatImage("");
        fetchData();
      }
    } catch (err) {
      setMessage("❌ Error adding category");
    }
  };

  // ADD PRODUCT
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: prodCategory,
          name: prodName,
          price: Number(prodPrice),
          qnt: Number(prodQnt),
          image: prodImage,
          desc: prodDesc,
        }),
      });

      if (res.ok) {
        setMessage("✅ Product Added Successfully!");
        setProdName("");
        setProdCategory("");
        setProdPrice("");
        setProdQnt("");
        setProdImage("");
        setProdDesc("");
        fetchData();
      }
    } catch (err) {
      setMessage("❌ Error adding product");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">Aquafy Admin</div>
        <ul className="sidebar-menu">
          <li
            className={`sidebar-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FaTachometerAlt /> Dashboard
          </li>
          <li
            className={`sidebar-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <FaBoxOpen /> Products
          </li>
          <li
            className={`sidebar-item ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <FaTags /> Categories
          </li>
          <li className="sidebar-item" onClick={() => alert("Orders feature coming soon!")}>
            <FaShoppingCart /> Orders
          </li>
          <li className="sidebar-item" onClick={() => alert("Customers feature coming soon!")}>
            <FaUsers /> Customers
          </li>
          <li className="sidebar-item" onClick={() => alert("Settings feature coming soon!")}>
            <FaCog /> Settings
          </li>
          <li className="sidebar-item logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </aside>

      {/* MAIN DASHBOARD PANEL */}
      <main className="admin-main-content">
        <div className="dashboard-header">
          <h1>Dashboard Overview</h1>
        </div>

        {/* TOP ANALYTICS STATS CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{products.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Categories</div>
            <div className="stat-value">{categories.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">340</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Revenue</div>
            <div className="stat-value" style={{ color: "#22c55e" }}>₹1,25,000</div>
          </div>
        </div>

        {message && (
          <div style={{ padding: "12px", background: "#dcfce7", color: "#166534", borderRadius: "8px", marginBottom: "20px" }}>
            {message}
          </div>
        )}

        {/* TAB 1: OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="panel-card">
            <h2>Recent Activity & Inventory Summary</h2>
            <p style={{ color: "#64748b" }}>
              Welcome back Admin! Select <strong>Categories</strong> or <strong>Products</strong> from the sidebar to manage store inventory.
            </p>
          </div>
        )}

        {/* TAB 2: CATEGORIES TAB */}
        {activeTab === "categories" && (
          <div>
            <div className="panel-card">
              <h2>Add New Category</h2>
              <form onSubmit={handleAddCategory}>
                <div className="form-grid-2">
                  <div className="admin-input-group">
                    <label>Category Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Betta Fish"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      required
                      placeholder="https://..."
                      value={catImage}
                      onChange={(e) => setCatImage(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="submit-btn">Add Category</button>
              </form>
            </div>

            <div className="panel-card">
              <h2>Existing Categories ({categories.length})</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Category Name</th>
                    <th>Total Products Count</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <img src={getImageUrl(c.image)} alt={c.name} width="45" height="45" style={{ objectFit: "cover", borderRadius: "6px" }} />
                      </td>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.count || 0} Items</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            <div className="panel-card">
              <h2>Add New Product</h2>
              <form onSubmit={handleAddProduct}>
                <div className="form-grid-2">
                  <div className="admin-input-group">
                    <label>Select Category</label>
                    <select
                      required
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-input-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Halfmoon King Betta"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="admin-input-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="350"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      required
                      placeholder="10"
                      value={prodQnt}
                      onChange={(e) => setProdQnt(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-input-group">
                  <label>Product Image URL</label>
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                  />
                </div>

                <div className="admin-input-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    placeholder="Short product specs..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">Add Product</button>
              </form>
            </div>

            <div className="panel-card">
              <h2>All Products ({products.length})</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img src={getImageUrl(p.image)} alt={p.name} width="45" height="45" style={{ objectFit: "cover", borderRadius: "6px" }} />
                      </td>
                      <td><strong>{p.name}</strong></td>
                      <td>₹{p.price}</td>
                      <td>{p.qnt}</td>
                      <td>{p.category_id?.name || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;