import React, { useState, useEffect } from "react";
import { API_URL, getImageUrl } from "../../config";
import { 
  FaTachometerAlt, 
  FaBoxOpen, 
  FaTags, 
  FaShoppingCart, 
  FaSignOutAlt,
  FaTrash,
  FaBars,
  FaImage,
  FaEnvelope,
  FaFileCsv, 
  FaExclamationTriangle,
  FaDownload,
  FaSearch
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [galleryList, setGalleryList] = useState([]); 
  const [contactMessages, setContactMessages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Order Search State
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

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

  // Gallery Form State
  const [galleryName, setGalleryName] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("");
  const [galleryDesc, setGalleryDesc] = useState(""); 
  const [galleryImageFile, setGalleryImageFile] = useState(null);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Banner Form State
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerDesc, setBannerDesc] = useState("");
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerExistingImage, setBannerExistingImage] = useState("");
  const [bannerEndDate, setBannerEndDate] = useState("");
  const [bannerUpdating, setBannerUpdating] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [resCat, resProd, resOrders, resBanner, resGallery, resContacts] = await Promise.all([
        fetch(`${API_URL}/api/category`),
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/banner`),
        fetch(`${API_URL}/api/gallery`),
        fetch(`${API_URL}/api/admin/contacts`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);
      const catData = await resCat.json();
      const prodData = await resProd.json();
      const ordersData = await resOrders.json();
      const bannerResult = await resBanner.json();
      const galleryData = await resGallery.json();
      const contactsData = await resContacts.json();

      setCategories(Array.isArray(catData) ? catData : []);
      setProducts(Array.isArray(prodData) ? prodData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setGalleryList(Array.isArray(galleryData) ? galleryData : []);
      setContactMessages(Array.isArray(contactsData) ? contactsData : []);
      
      if (bannerResult) {
        setBannerTitle(bannerResult.title || "");
        setBannerSubtitle(bannerResult.subtitle || "");
        setBannerDesc(bannerResult.description || "");
        setBannerExistingImage(bannerResult.image || "");
        setBannerEndDate(bannerResult.endDate ? bannerResult.endDate.substring(0, 10) : "");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uploadFileHandler = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data.filePath;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (!catImageFile) return alert("Please select an image file");

      setCatUploading(true);
      const imagePath = await uploadFileHandler(catImageFile);

      const res = await fetch(`${API_URL}/api/category`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: catName, image: imagePath, isCategory: true }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Category Created Successfully!");
        setCatName("");
        setCatImageFile(null);
        fetchData();
      } else {
        setMessage(`❌ ${data.message || "Failed to add category"}`);
      }
    } catch (err) {
      setMessage("❌ Error adding category: " + err.message);
    } finally {
      setCatUploading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${API_URL}/api/category/${id}`, { 
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage("🗑️ Category Deleted!");
        fetchData();
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.message || "Failed to delete category"}`);
      }
    } catch (err) {
      setMessage("❌ Error deleting category");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!prodCategory || prodCategory.trim() === "") {
      alert("⚠️ Please select a Category from the dropdown!");
      return;
    }

    if (!prodImageFile) {
      alert("⚠️ Please upload a Product Image File!");
      return;
    }

    try {
      setProdUploading(true);
      const imagePath = await uploadFileHandler(prodImageFile);

      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_id: prodCategory,
          name: prodName,
          price: Number(prodPrice),
          qnt: Number(prodQnt),
          image: imagePath,
          desc: prodDesc,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Product Added Successfully!");
        setProdName("");
        setProdCategory("");
        setProdPrice("");
        setProdQnt("");
        setProdImageFile(null);
        setProdDesc("");
        fetchData();
      } else {
        setMessage(`❌ ${data.message || "Failed to add product"}`);
      }
    } catch (err) {
      setMessage("❌ Error adding product: " + err.message);
    } finally {
      setProdUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { 
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage("🗑️ Product Deleted!");
        fetchData();
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.message || "Failed to delete product"}`);
      }
    } catch (err) {
      setMessage("❌ Error deleting product");
    }
  };

  const handleAddGalleryItem = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!galleryImageFile) {
      alert("⚠️ Please select an image file for the gallery!");
      return;
    }

    try {
      setGalleryUploading(true);
      const imagePath = await uploadFileHandler(galleryImageFile);

      const res = await fetch(`${API_URL}/api/gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: galleryName,
          category: galleryCategory || "Aquarium Setup",
          description: galleryDesc || "Detailed overview of this aquarium project and setup specifications.",
          image: imagePath,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Gallery Image Added Successfully!");
        setGalleryName("");
        setGalleryCategory("");
        setGalleryDesc("");
        setGalleryImageFile(null);
        fetchData();
      } else {
        setMessage(`❌ ${data.message || "Failed to add gallery image"}`);
      }
    } catch (err) {
      setMessage("❌ Error adding gallery item: " + err.message);
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      const res = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMessage("🗑️ Gallery Item Deleted!");
        fetchData();
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.message || "Failed to delete gallery item"}`);
      }
    } catch (err) {
      setMessage("❌ Error deleting gallery item");
    }
  };

  const handleDeleteContactMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer message?")) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMessage("🗑️ Customer Message Deleted!");
        fetchData();
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.message || "Failed to delete message"}`);
      }
    } catch (err) {
      setMessage("❌ Error deleting message");
    }
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    setMessage("");
    setBannerUpdating(true);

    try {
      let imagePath = bannerExistingImage;

      if (bannerImageFile) {
        imagePath = await uploadFileHandler(bannerImageFile);
      }

      const res = await fetch(`${API_URL}/api/banner`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: bannerTitle,
          subtitle: bannerSubtitle,
          description: bannerDesc,
          image: imagePath,
          endDate: bannerEndDate,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✨ Offer Banner Updated Successfully!");
        setBannerExistingImage(imagePath);
        setBannerImageFile(null);
        fetchData();
      } else {
        setMessage(`❌ ${data.message || "Failed to update banner"}`);
      }
    } catch (err) {
      setMessage("❌ Error updating banner: " + err.message);
    } finally {
      setBannerUpdating(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setMessage(`📦 Order Status updated to ${newStatus}!`);
        fetchData();
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.message || "Failed to update order status"}`);
      }
    } catch (err) {
      setMessage("❌ Error updating order status");
    }
  };

  const formatOrderId = (id) => {
    if (!id) return "#ORD-0000";
    return `#ORD-${id.substring(id.length - 6).toUpperCase()}`;
  };

  const exportOrdersToCSV = () => {
    if(orders.length === 0) return alert("No orders to export!");

    const headers = ["Order ID", "Customer Name", "Phone", "Email", "City", "Date", "Total Price (INR)", "Payment Method", "UTR Number", "Status"];
    
    const csvRows = orders.map(order => {
      return [
        formatOrderId(order._id),
        `"${order.shippingAddress?.fullName || 'Guest'}"`,
        `"${order.shippingAddress?.phone || 'N/A'}"`,
        `"${order.shippingAddress?.email || 'N/A'}"`,
        `"${order.shippingAddress?.city || 'N/A'}"`,
        `"${new Date(order.createdAt).toLocaleDateString("en-GB")}"`,
        order.totalPrice,
        `"${order.paymentMethod || 'Cash on Delivery'}"`,
        `"${order.upiTransactionId || 'N/A'}"`,
        `"${order.status || (order.isDelivered ? 'Delivered' : 'Pending')}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Udhaya_Aquatics_Orders_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateDashboardReport = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Store Report - Udhaya Aquatics</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
            .report-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); border-radius: 10px; }
            h1 { color: #0f172a; text-align: center; margin-bottom: 5px; }
            .subtitle { text-align: center; color: #64748b; margin-bottom: 30px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background-color: #f8fafc; color: #475569; font-weight: bold; }
            .highlight { color: #16a34a; font-weight: bold; }
            .alert { color: #ef4444; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <h1>Udhaya Aquatics - Store Report</h1>
            <div class="subtitle">Report Generated on: ${new Date().toLocaleString()}</div>
            
            <h3>Business Overview</h3>
            <table>
              <thead><tr><th>Metric</th><th>Value</th></tr></thead>
              <tbody>
                <tr><td>Total Revenue</td><td class="highlight">₹${totalRevenue.toLocaleString("en-IN")}</td></tr>
                <tr><td>Total Orders</td><td>${orders.length}</td></tr>
                <tr><td>Total Products</td><td>${products.length}</td></tr>
                <tr><td>Total Categories</td><td>${categories.length}</td></tr>
                <tr><td>Low Stock Items (< 5)</td><td class="${lowStockProducts.length > 0 ? 'alert' : ''}">${lowStockProducts.length} Items</td></tr>
                <tr><td>Customer Messages</td><td>${contactMessages.length}</td></tr>
              </tbody>
            </table>
            
            <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8;">
              System generated report - Udhaya Aquatics.
            </div>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderCategoryName = (p) => {
    if (p.category_id && typeof p.category_id === "object" && p.category_id.name) {
      return p.category_id.name;
    }
    const catIdStr = String(p.category_id?._id || p.category_id?.id || p.category_id);
    const found = categories.find((c) => String(c._id || c.id) === catIdStr);
    return found ? found.name : "N/A";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const lowStockProducts = products.filter(p => p.qnt <= 5);

  // Filtered Orders based on Search Query
  const filteredOrders = orders.filter((order) => {
    const orderIdStr = formatOrderId(order._id).toLowerCase();
    const customerName = (order.shippingAddress?.fullName || "").toLowerCase();
    const query = orderSearchQuery.toLowerCase().trim();

    return orderIdStr.includes(query) || customerName.includes(query);
  });

  return (
    <div className="admin-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">Aquafy Admin</div>
        <ul className="sidebar-menu" onClick={() => setSidebarOpen(false)}>
          <li className={`sidebar-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
            <FaTachometerAlt /> Dashboard
          </li>
          <li className={`sidebar-item ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
            <FaBoxOpen /> Products
            {lowStockProducts.length > 0 && (
              <span className="sidebar-badge warning" style={{backgroundColor: "#ef4444", color: "white", padding: "2px 6px", borderRadius: "10px", fontSize: "11px", marginLeft: "8px"}}>
                <FaExclamationTriangle /> {lowStockProducts.length}
              </span>
            )}
          </li>
          <li className={`sidebar-item ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
            <FaTags /> Categories
          </li>
          <li className={`sidebar-item ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
            <FaShoppingCart /> Orders
          </li>
          <li className={`sidebar-item ${activeTab === "messages" ? "active" : ""}`} onClick={() => setActiveTab("messages")}>
            <FaEnvelope /> Messages ({contactMessages.length})
          </li>
          <li className={`sidebar-item ${activeTab === "banner" ? "active" : ""}`} onClick={() => setActiveTab("banner")}>
            <FaImage /> Banner
          </li>
          <li className={`sidebar-item ${activeTab === "gallery" ? "active" : ""}`} onClick={() => setActiveTab("gallery")}>
            <FaImage /> Gallery
          </li>
          <li className="sidebar-item logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </aside>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>}

      {/* MAIN DASHBOARD PANEL */}
      <main className="admin-main-content">
        <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: "15px", marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen((prev) => !prev)} style={{ marginRight: "15px" }}>
              <FaBars />
            </button>
            <h1 style={{ margin: 0 }}>Dashboard Overview</h1>
          </div>
          <button onClick={generateDashboardReport} className="btn-export" style={{ background: "#3b82f6", color: "white", border: "none", padding: "10px 15px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaDownload size={16} /> Download Report
          </button>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{products.length}</div>
          </div>
          <div className="stat-card" style={lowStockProducts.length > 0 ? { borderLeft: "4px solid #ef4444" } : {}}>
            <div className="stat-title">Low Stock Items</div>
            <div className="stat-value" style={{ color: lowStockProducts.length > 0 ? "#ef4444" : "#10b981" }}>{lowStockProducts.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Categories</div>
            <div className="stat-value">{categories.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Revenue</div>
            <div className="stat-value" style={{ color: "#22c55e" }}>₹{totalRevenue.toLocaleString("en-IN")}</div>
          </div>
        </div>

        {message && <div style={{ padding: "12px", background: "#dcfce7", color: "#166534", borderRadius: "8px", marginBottom: "20px" }}>{message}</div>}

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="panel-card">
            <h2>Recent Activity & Inventory Summary</h2>
            <p style={{ color: "#64748b" }}>Welcome back Admin! Select options from sidebar to manage your store.</p>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="panel-card">
            <h2>Customer Messages ({contactMessages.length})</h2>
            {contactMessages.length === 0 ? <p style={{ color: "#64748b" }}>No messages received yet.</p> : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Action</th></tr></thead>
                  <tbody>
                    {contactMessages.map((msg) => (
                      <tr key={msg._id}>
                        <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                        <td><strong>{msg.name}</strong></td>
                        <td><a href={`mailto:${msg.email}`} style={{ color: "#0284c7" }}>{msg.email}</a></td>
                        <td>{msg.phone || "N/A"}</td>
                        <td>{msg.message}</td>
                        <td><button className="action-btn delete" onClick={() => handleDeleteContactMessage(msg._id)}><FaTrash /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* BANNER TAB */}
        {activeTab === "banner" && (
          <div className="panel-card">
            <h2>Manage Offer Banner</h2>
            <form onSubmit={handleUpdateBanner}>
              <div className="form-grid-2">
                <div className="admin-input-group"><label>Title</label><input type="text" required value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} /></div>
                <div className="admin-input-group"><label>Subtitle</label><input type="text" required value={bannerSubtitle} onChange={(e) => setBannerSubtitle(e.target.value)} /></div>
              </div>
              <div className="admin-input-group"><label>Description</label><textarea rows="3" required value={bannerDesc} onChange={(e) => setBannerDesc(e.target.value)}></textarea></div>
              <div className="form-grid-2">
                <div className="admin-input-group"><label>Upload Banner</label><input type="file" accept="image/*" onChange={(e) => setBannerImageFile(e.target.files[0])} /></div>
                <div className="admin-input-group"><label>End Date</label><input type="date" required value={bannerEndDate} onChange={(e) => setBannerEndDate(e.target.value)} /></div>
              </div>
              <button type="submit" className="submit-btn" disabled={bannerUpdating}>{bannerUpdating ? "Updating..." : "Update Offer Banner"}</button>
            </form>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div>
            <div className="panel-card">
              <h2>Add New Gallery Image</h2>
              <form onSubmit={handleAddGalleryItem}>
                <div className="form-grid-2">
                  <div className="admin-input-group"><label>Project / Fish Name</label><input type="text" required value={galleryName} onChange={(e) => setGalleryName(e.target.value)} /></div>
                  <div className="admin-input-group"><label>Category</label><input type="text" value={galleryCategory} onChange={(e) => setGalleryCategory(e.target.value)} /></div>
                </div>
                <div className="admin-input-group"><label>Description</label><textarea rows="3" required value={galleryDesc} onChange={(e) => setGalleryDesc(e.target.value)}></textarea></div>
                <div className="admin-input-group"><label>Upload Image</label><input type="file" accept="image/*" required onChange={(e) => setGalleryImageFile(e.target.files[0])} /></div>
                <button type="submit" className="submit-btn" disabled={galleryUploading}>{galleryUploading ? "Uploading..." : "Add to Gallery"}</button>
              </form>
            </div>
            <div className="panel-card">
              <h2>Gallery Items ({galleryList.length})</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Actions</th></tr></thead>
                  <tbody>
                    {galleryList.map((item) => (
                      <tr key={item._id}>
                        <td><img src={getImageUrl(item.image)} alt={item.name} width="45" height="45" style={{ objectFit: "cover", borderRadius: "6px" }} /></td>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.category}</td>
                        <td><button className="action-btn delete" onClick={() => handleDeleteGalleryItem(item._id)}><FaTrash /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === "categories" && (
          <div>
            <div className="panel-card">
              <h2>Add New Category</h2>
              <form onSubmit={handleAddCategory}>
                <div className="form-grid-2">
                  <div className="admin-input-group"><label>Category Name</label><input type="text" required value={catName} onChange={(e) => setCatName(e.target.value)} /></div>
                  <div className="admin-input-group"><label>Upload Image</label><input type="file" accept="image/*" required onChange={(e) => setCatImageFile(e.target.files[0])} /></div>
                </div>
                <button type="submit" className="submit-btn" disabled={catUploading}>{catUploading ? "Uploading..." : "Add Category"}</button>
              </form>
            </div>
            <div className="panel-card">
              <h2>Existing Categories ({categories.length})</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Image</th><th>Name</th><th>Items</th><th>Actions</th></tr></thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c._id || c.id}>
                        <td><img src={getImageUrl(c.image)} alt={c.name} width="45" height="45" style={{ objectFit: "cover", borderRadius: "6px" }} /></td>
                        <td><strong>{c.name}</strong></td>
                        <td>{c.count || 0} Items</td>
                        <td><button className="action-btn delete" onClick={() => handleDeleteCategory(c._id || c.id)}><FaTrash /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                    <label>Category</label>
                    <select required value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                      <option value="">-- Select Category --</option>
                      {categories.map((c) => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="admin-input-group"><label>Product Name</label><input type="text" required value={prodName} onChange={(e) => setProdName(e.target.value)} /></div>
                </div>
                <div className="form-grid-2">
                  <div className="admin-input-group"><label>Price (₹)</label><input type="number" required value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} /></div>
                  <div className="admin-input-group"><label>Stock</label><input type="number" required value={prodQnt} onChange={(e) => setProdQnt(e.target.value)} /></div>
                </div>
                <div className="admin-input-group"><label>Upload Image</label><input type="file" accept="image/*" required onChange={(e) => setProdImageFile(e.target.files[0])} /></div>
                <div className="admin-input-group"><label>Description</label><textarea rows="3" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)}></textarea></div>
                <button type="submit" className="submit-btn" disabled={prodUploading}>{prodUploading ? "Uploading..." : "Add Product"}</button>
              </form>
            </div>

            <div className="panel-card">
              <h2>All Products ({products.length})</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id || p.id}>
                        <td><img src={getImageUrl(p.image)} alt={p.name} width="45" height="45" style={{ objectFit: "cover", borderRadius: "6px" }} /></td>
                        <td><strong>{p.name}</strong></td>
                        <td>₹{p.price}</td>
                        <td>{p.qnt <= 5 ? <span className="low-stock-alert" style={{ color: "#ef4444", fontWeight: "bold" }}><FaExclamationTriangle /> {p.qnt} Left</span> : <span>{p.qnt}</span>}</td>
                        <td><strong>{renderCategoryName(p)}</strong></td>
                        <td><button className="action-btn delete" onClick={() => handleDeleteProduct(p._id || p.id)}><FaTrash /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB WITH SEARCH BAR */}
        {activeTab === "orders" && (
          <div className="panel-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "15px" }}>
              <h2 style={{ margin: 0 }}>Customer Orders ({filteredOrders.length})</h2>
              <button onClick={exportOrdersToCSV} className="btn-export" style={{ background: "#10b981", color: "white", border: "none", padding: "10px 15px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaFileCsv size={18} /> Export Excel
              </button>
            </div>

            {/* Search Bar UI */}
            <div className="orders-search-container">
              <div style={{ position: "relative", width: "100%" }}>
                <FaSearch style={{ position: "absolute", top: "14px", left: "14px", color: "#94a3b8" }} />
                <input 
                  type="text"
                  placeholder="Search by Order ID (e.g., #ORD-123456) or Customer Name..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="order-search-input"
                  style={{ paddingLeft: "40px", width: "100%" }}
                />
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Date</th>
                    <th>Total Price</th>
                    <th>Payment Info</th>
                    <th>Status</th>
                    <th>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                        No orders found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const currentStatus = order.status || (order.isDelivered ? "Delivered" : "Pending");
                      return (
                        <tr key={order._id}>
                          <td style={{ fontWeight: "700", color: "#0f172a" }}>{formatOrderId(order._id)}</td>
                          <td><strong>{order.shippingAddress?.fullName || "Guest"}</strong></td>
                          <td>{new Date(order.createdAt).toLocaleDateString("en-GB")}</td>
                          <td style={{ fontWeight: "600", color: "#16a34a" }}>₹{order.totalPrice}</td>
                          <td>
                            <span style={{ display: "inline-block", fontSize: "12px", fontWeight: "600", padding: "4px 8px", borderRadius: "4px", backgroundColor: order.paymentMethod === "Cash on Delivery" ? "#f1f5f9" : "#e0f2fe", color: order.paymentMethod === "Cash on Delivery" ? "#475569" : "#0284c7" }}>
                              {order.paymentMethod || "Cash on Delivery"}
                            </span>
                            {order.paymentMethod === "Online UPI Payment" && order.upiTransactionId && (
                              <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px", fontWeight: "700" }}>UTR: {order.upiTransactionId}</div>
                            )}
                          </td>
                          <td>
                            <span style={{
                              color: currentStatus === "Delivered" ? "#166534" : currentStatus === "Shipping" ? "#1d4ed8" : currentStatus === "Packing" ? "#7c2d12" : currentStatus === "Cancelled" ? "#991b1b" : "#b45309",
                              background: currentStatus === "Delivered" ? "#dcfce7" : currentStatus === "Shipping" ? "#dbeafe" : currentStatus === "Packing" ? "#ffedd5" : currentStatus === "Cancelled" ? "#fee2e2" : "#fef3c7",
                              padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px"
                            }}>
                              {currentStatus}
                            </span>
                          </td>
                          <td>
                            <select value={currentStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)} style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}>
                              <option value="Pending">Pending</option>
                              <option value="Packing">Packing</option>
                              <option value="Shipping">Shipping</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
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