import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { API_URL, getImageUrl } from "../../config";
import "./Dashboard.css";

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const [message, setMessage] = useState("");

  // Fetch Categories & Products Data
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
      console.error("Error fetching admin data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. ADD CATEGORY HANDLER
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
        setMessage("✅ Category added successfully!");
        setCatName("");
        setCatImage("");
        fetchData(); // Refresh list
      } else {
        setMessage("❌ Failed to add category");
      }
    } catch (err) {
      setMessage("❌ Error connecting to server");
    }
  };

  // 2. ADD PRODUCT HANDLER
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
        setMessage("✅ Product added successfully!");
        setProdName("");
        setProdCategory("");
        setProdPrice("");
        setProdQnt("");
        setProdImage("");
        setProdDesc("");
        fetchData(); // Refresh list
      } else {
        setMessage("❌ Failed to add product");
      }
    } catch (err) {
      setMessage("❌ Error connecting to server");
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard 🛠️</h1>

        {message && <div className="admin-alert">{message}</div>}

        <div className="admin-grid">
          {/* FORM 1: ADD CATEGORY */}
          <div className="admin-card">
            <h2>Add New Category</h2>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Betta Fish, Live Feed"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Category Image URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                />
              </div>

              <button type="submit" className="admin-btn">
                Add Category
              </button>
            </form>
          </div>

          {/* FORM 2: ADD PRODUCT */}
          <div className="admin-card">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Select Category</label>
                <select
                  required
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Halfmoon King Betta"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="350"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={prodQnt}
                    onChange={(e) => setProdQnt(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Short description of the product..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="admin-btn">
                Add Product
              </button>
            </form>
          </div>
        </div>

        {/* RECENT ADDED ITEMS LIST */}
        <div className="admin-table-section">
          <h2>Existing Products List ({products.length})</h2>
          {loading ? (
            <p>Loading items...</p>
          ) : (
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
                      <img src={getImageUrl(p.image)} alt={p.name} width="50" height="50" style={{ objectFit: "cover", borderRadius: "4px" }} />
                    </td>
                    <td>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{p.qnt}</td>
                    <td>{p.category_id?.name || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;