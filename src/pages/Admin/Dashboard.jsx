import React, { useState, useEffect } from "react";
import { API_URL, getImageUrl } from "../../config";
import { 
  FaTachometerAlt, 
  FaBoxOpen, 
  FaTags, 
  FaShoppingCart, 
  FaUsers, 
  FaCog, 
  FaSignOutAlt,
  FaEdit,
  FaTrash
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
  const [catImageFile, setCatImageFile] = useState(null);
  const [catUploading, setCatUploading] = useState(false);

  // Product Form State
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodQnt, setProdQnt] = useState("");
  const [prodImageFile, setProdImageFile] = useState(null);
  const [prodDesc, setProdDesc] = useState("");
  const [prodUploading, setProdUploading] = useState(false);

  // Edit Modals State
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

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

  // HELPER: UPLOAD FILE TO BACKEND
  const uploadFileHandler = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data.filePath;
  };

  // 1. ADD CATEGORY
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (!catImageFile) return alert("Please select an image file");

      setCatUploading(true);
      const imagePath = await uploadFileHandler(catImageFile);

      const res = await fetch(`${API_URL}/api/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName, image: imagePath, isCategory: true }),
      });

      if (res.ok) {
        setMessage("✅ Category Created Successfully!");
        setCatName("");
        setCatImageFile(null);
        fetchData();
      }
    } catch (err) {
      setMessage("❌ Error adding category");
    } finally {
      setCatUploading(false);
    }
  };

  // EDIT CATEGORY SUBMIT
  const handleUpdateCategorySubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let imagePath = editingCategory.image;

      if (editingCategory.newFile) {
        imagePath = await uploadFileHandler(editingCategory.newFile);
      }

      const res = await fetch(`${API_URL}/api/category/${editingCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingCategory.name,
          image: imagePath,
          isCategory: true,
        }),
      });

      if (res.ok) {
        setMessage("✏️ Category Updated Successfully!");
        setEditingCategory(null);
        fetchData();
      } else {
        setMessage("❌ Failed to update category");
      }
    } catch (err) {
      setMessage("❌ Error updating category");
    }
  };

  // DELETE CATEGORY
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${API_URL}/api/category/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("🗑️ Category Deleted!");
        fetchData();
      }
    } catch (err) {
      setMessage("❌ Error deleting category");
    }
  };

  // 2. ADD PRODUCT
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (!prodImageFile) return alert("Please select a product image file");

      setProdUploading(true);
      const imagePath = await uploadFileHandler(prodImageFile);

      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: prodCategory,
          name: prodName,
          price: Number(prodPrice),
          qnt: Number(prodQnt),
          image: imagePath,
          desc: prodDesc,
        }),
      });

      if (res.ok) {
        setMessage("✅ Product Added Successfully!");
        setProdName("");
        setProdCategory("");
        setProdPrice("");
        setProdQnt("");
        setProdImageFile(null);
        setProdDesc("");
        fetchData();
      }
    } catch (err) {
      setMessage("❌ Error adding product");
    } finally {
      setProdUploading(false);
    }
  };

  // EDIT PRODUCT SUBMIT (WITH CATEGORY ID PARSING 🚀)
  const handleUpdateProductSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let imagePath = editingProduct.image;

      if (editingProduct.newFile) {
        imagePath = await uploadFileHandler(editingProduct.newFile);
      }

      // Exact Category ID extraction
      const catId = editingProduct.category_id?._id || editingProduct.category_id;

      const res = await fetch(`${API_URL}/api/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: catId,
          name: editingProduct.name,
          price: Number(editingProduct.price),
          qnt: Number(editingProduct.qnt),
          image: imagePath,
          desc: editingProduct.desc,
        }),
      });

      if (res.ok) {
        setMessage("✏️ Product Updated Successfully!");
        setEditingProduct(null);
        fetchData();
      } else {
        setMessage("❌ Failed to update product");
      }
    } catch (err) {
      setMessage("❌ Error updating product");
    }
  };

  // DELETE PRODUCT
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("🗑️ Product Deleted!");
        fetchData();
      }
    } catch (err) {
      setMessage("❌ Error deleting product");
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

        {/* STATS */}
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

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="panel-card">
            <h2>Recent Activity & Inventory Summary</h2>
            <p style={{ color: "#64748b" }}>
              Welcome back Admin! Select <strong>Categories</strong> or <strong>Products</strong> from sidebar to manage inventory.
            </p>
          </div>
        )}

        {/* CATEGORIES TAB */}
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
                    <label>Upload Category Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setCatImageFile(e.target.files[0])}
                    />
                  </div>
                </div>
                <button type="submit" className="submit-btn" disabled={catUploading}>
                  {catUploading ? "Uploading & Saving..." : "Add Category"}
                </button>
              </form>
            </div>

            <div className="panel-card">
              <h2>Existing Categories ({categories.length})</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Category Name</th>
                    <th>Total Items</th>
                    <th>Actions</th>
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
                      <td>
                        <button
                          className="action-btn edit"
                          onClick={() => setEditingCategory(c)}
                          title="Edit Category"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteCategory(c._id)}
                          title="Delete Category"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
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
                  <label>Upload Product Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setProdImageFile(e.target.files[0])}
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

                <button type="submit" className="submit-btn" disabled={prodUploading}>
                  {prodUploading ? "Uploading & Saving..." : "Add Product"}
                </button>
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
                    <th>Actions</th>
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
                      <td>
                        <button
                          className="action-btn edit"
                          onClick={() => setEditingProduct(p)}
                          title="Edit Product"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteProduct(p._id)}
                          title="Delete Product"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EDIT CATEGORY MODAL */}
        {editingCategory && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2>Edit Category Details</h2>
              <form onSubmit={handleUpdateCategorySubmit}>
                <div className="admin-input-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label>Change Image (Optional File Select)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditingCategory({ ...editingCategory, newFile: e.target.files[0] })}
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="submit-btn">Save Changes</button>
                  <button type="button" className="cancel-btn" onClick={() => setEditingCategory(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT PRODUCT MODAL (ADDED CATEGORY SELECT DROPDOWN 🚀) */}
        {editingProduct && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2>Edit Product Details</h2>
              <form onSubmit={handleUpdateProductSubmit}>
                <div className="admin-input-group">
                  <label>Select Category</label>
                  <select
                    required
                    value={editingProduct.category_id?._id || editingProduct.category_id || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-input-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="admin-input-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.qnt}
                      onChange={(e) => setEditingProduct({ ...editingProduct, qnt: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-input-group">
                  <label>Change Image (Optional File Select)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditingProduct({ ...editingProduct, newFile: e.target.files[0] })}
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="submit-btn">Save Changes</button>
                  <button type="button" className="cancel-btn" onClick={() => setEditingProduct(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;