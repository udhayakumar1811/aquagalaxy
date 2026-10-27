import { useState, useEffect, useContext } from "react";
import { API_URL, getImageUrl } from "../../config";
import { safeParseResponse } from "../../utils/apiHandler";
import { getValidToken, getAuthUser, clearAuthSession } from "../../utils/auth";
import { ThemeContext } from "../../context/ThemeContext";
import { 
  FaTachometerAlt, 
  FaBoxOpen, 
  FaTags, 
  FaShoppingCart, 
  FaSignOutAlt,
  FaTrash,
  FaEdit,
  FaBars,
  FaTimes,
  FaImage,
  FaImages,
  FaEnvelope,
  FaFileCsv, 
  FaFileAlt,
  FaExclamationTriangle,
  FaDownload,
  FaSearch,
  FaMoneyBillWave,
  FaCog,
  FaTruck,
  FaTag,
  FaUserShield,
  FaUsers,
  FaChartBar,
  FaHistory,
  FaStore,
  FaStar,
  FaHeart,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import logoImg from "../../assets/udhaya-logo.png";
import { useNavigate } from "react-router-dom";
import AdminPayments from "./components/AdminPayments";
import AdminSettings from "./components/AdminSettings";
import AdminDeliveryRules from "./components/AdminDeliveryRules";
import AdminCouponsOffers from "./components/AdminCouponsOffers";
import AdminUsers from "./components/AdminUsers";
import AdminAnalytics from "./components/AdminAnalytics";
import AdminAuditLogs from "./components/AdminAuditLogs";
import ProductMediaManager from "./components/ProductMediaManager";

const TAB_TITLES = {
  overview: "Dashboard Overview",
  analytics: "Store Analytics & Insights",
  products: "Products Management",
  categories: "Categories Management",
  orders: "Orders Management",
  payments: "Payment Verification",
  delivery: "Delivery Rules & Rates",
  coupons: "Coupons & Promotional Offers",
  messages: "Customer Contact Messages",
  banner: "Offer Banner Management",
  gallery: "Gallery Management",
  customers: "Customer Accounts",
  reviews: "Product Reviews Moderation",
  wishlist: "Customer Wishlists & Demand",
  staff: "Staff & Admin Users",
  settings: "Store Settings",
  reports: "Store Reports & Exports",
  auditlog: "Admin Audit Trail",
};

function Dashboard() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [galleryList, setGalleryList] = useState([]); 
  const [contactMessages, setContactMessages] = useState([]); 
  const [message, setMessage] = useState("");
  const [dashboardApiError, setDashboardApiError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Order Search State
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  const navigate = useNavigate();

  // Category Form State
  const [catName, setCatName] = useState("");
  const [catImageFile, setCatImageFile] = useState(null);
  const [catUploading, setCatUploading] = useState(false);

  // Edit Category Modal State
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatImageFile, setEditCatImageFile] = useState(null);
  const [editCatExistingImage, setEditCatExistingImage] = useState("");
  const [editCatUpdating, setEditCatUpdating] = useState(false);

  // Product Form State
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDiscountPrice, setProdDiscountPrice] = useState("");
  const [prodQnt, setProdQnt] = useState("");
  const [prodImageFile, setProdImageFile] = useState(null);
  const [prodDesc, setProdDesc] = useState("");
  const [prodUploading, setProdUploading] = useState(false);
  const [mediaManagerProduct, setMediaManagerProduct] = useState(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProdName, setEditProdName] = useState("");
  const [editProdCategory, setEditProdCategory] = useState("");
  const [editProdPrice, setEditProdPrice] = useState("");
  const [editProdDiscountPrice, setEditProdDiscountPrice] = useState("");
  const [editProdQnt, setEditProdQnt] = useState("");
  const [editProdDesc, setEditProdDesc] = useState("");
  const [editProdIsActive, setEditProdIsActive] = useState(true);
  const [editProdImageFile, setEditProdImageFile] = useState(null);
  const [editProdExistingImage, setEditProdExistingImage] = useState("");
  const [editProdUpdating, setEditProdUpdating] = useState(false);
  // Client-side RENDER pagination for the admin products table (Priority 6).
  // NOTE: this caps how many rows React renders at once, which is the
  // actual DOM-performance bottleneck for a large table — it does NOT
  // reduce the network payload the way Shop.jsx's real backend pagination
  // does. A full backend-paginated rewrite of the admin product list was
  // judged too risky to make blind (fetchData() is called from ~11 mutation
  // handlers across the dashboard) without the ability to test against
  // live data; this is the safer, still-real improvement.
  const [productPage, setProductPage] = useState(1);
  const ADMIN_PAGE_SIZE = 20;

  // Real backend-driven pagination for the admin "All Products" table
  // (Prompt 3 continuation — replaces the old client-side slice-of-1000
  // pattern described above). `products` (full list, still fetched via
  // fetchAllProducts() below) stays as the source for the OTHER features
  // that genuinely need the complete catalog: the Total Products / Low
  // Stock stat cards further down, and the product picker inside
  // AdminCouponsOffers. Those are legitimately different from "the admin
  // product management UI" itself, so they're deliberately left on the
  // full-list path rather than being converted to single-page data.
  const [productPageData, setProductPageData] = useState([]);
  const [productPageInfo, setProductPageInfo] = useState({ page: 1, pages: 1, total: 0 });

  // Client-side render pagination for the admin Orders table (previously
  // absent entirely — filteredOrders rendered every matching row in one
  // unbounded table). The underlying fetch fix (bounded, paginated
  // requests replacing the old unbounded Order.find()) is in
  // fetchAllOrders() below; this just keeps the DOM from rendering
  // hundreds of rows at once, mirroring the existing product pattern.
  const [orderPage, setOrderPage] = useState(1);

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

  const token = getValidToken();
  const currentUser = getAuthUser();
  const isFullAdmin = currentUser && (currentUser.role === "admin" || currentUser.role === "superadmin");

  // Mirrors backend/middleware/rbac.js's ROLE_PERMISSIONS exactly. The
  // backend remains the actual access-control enforcement (this map going
  // stale would only ever hide/show a tab incorrectly, never grant real
  // access) — this exists purely so a scoped-role staff member doesn't see
  // tabs that will just 403 when they click in.
  const ROLE_PERMISSIONS = {
    order_manager: ["orders.view", "orders.update", "payments.verify", "delivery.manage"],
    product_manager: ["products.manage", "categories.manage", "coupons.manage", "offers.manage", "reviews.moderate"],
    support_manager: ["contacts.manage", "reviews.moderate"],
    content_manager: ["banner.manage", "gallery.manage"],
  };
  const can = (permission) => {
    if (isFullAdmin) return true;
    const perms = ROLE_PERMISSIONS[currentUser?.role];
    return Boolean(perms && perms.includes(permission));
  };

  // --- Product pagination helpers (Prompt 3 continuation) ---
  //
  // fetchAllProducts(): walks every backend page to assemble the COMPLETE
  // catalog, for the features that genuinely need it (Total Products/Low
  // Stock stats, AdminCouponsOffers' product picker). This replaces the old
  // `limit=1000` request — which silently lost everything past the
  // server's 100-per-page cap once the catalog passed 100 items — with a
  // loop of bounded, capped requests. It's permission-aware: only a user
  // with "products.manage" can request includeInactive=true (see
  // productController.getProducts' new authorization check), so a role
  // without that permission (order_manager, support_manager,
  // content_manager) transparently falls back to the public, active-only
  // listing instead of getting a 403 — their stats now reflect active
  // products only, which is a minor, correct narrowing rather than a break
  // (previously every role could see inactive-product counts too, whether
  // or not they were allowed to manage products).
  const fetchAllProducts = async () => {
    const canViewInactive = can("products.manage");
    const inactiveParam = canViewInactive ? "&includeInactive=true" : "";
    const currentToken = getValidToken();
    const headers = (canViewInactive && currentToken) ? { Authorization: `Bearer ${currentToken}` } : {};
    let page = 1;
    let all = [];
    for (let i = 0; i < 50; i++) { // safety ceiling: 50 x 100/page = 5,000 products
      try {
        const res = await fetch(`${API_URL}/api/products?page=${page}&limit=100${inactiveParam}`, { headers });
        if (!res.ok) {
          const errData = await safeParseResponse(res, `Products (page ${page})`).catch((e) => e);
          console.error(`Products page ${page} error:`, errData?.message || errData);
          break;
        }
        const data = await safeParseResponse(res, `Products (page ${page})`);
        const pageItems = Array.isArray(data.products) ? data.products : [];
        all = all.concat(pageItems);
        const totalPages = data.pages || 1;
        if (page >= totalPages || pageItems.length === 0) break;
        page += 1;
      } catch (err) {
        console.error("Error fetching all products (page " + page + "):", err);
        break;
      }
    }
    return all;
  };

  // loadProductPage(): real backend-driven pagination for the admin "All
  // Products" TABLE itself — fetches exactly one page per call, the same
  // pattern Shop.jsx already uses for the public catalog. Requires
  // products.manage, which is always true here in practice (the Products
  // tab is only reachable via can("products.manage") already).
  const loadProductPage = async (pageNum) => {
    if (!can("products.manage")) return;
    const currentToken = getValidToken();
    if (!currentToken) return;
    try {
      const res = await fetch(
        `${API_URL}/api/products?page=${pageNum}&limit=${ADMIN_PAGE_SIZE}&includeInactive=true`,
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );
      const data = await safeParseResponse(res, `Products Table (page ${pageNum})`);
      setProductPageData(Array.isArray(data.products) ? data.products : []);
      setProductPageInfo({ page: data.page || pageNum, pages: data.pages || 1, total: data.total || 0 });
    } catch (err) {
      console.error("Error loading products page:", err);
    }
  };

  // fetchAllOrders(): walks every backend page (each bounded to 200 items —
  // see orderController.getOrders) to assemble the complete order set used
  // by revenue, CSV export, the Pending-Verification sidebar badge,
  // AdminPayments, and the existing client-side order search box — all of
  // which need the full set, not one page. This replaces a single
  // unbounded `Order.find(filter).sort(...)` query with N bounded,
  // permission-gated requests; it never asks the database for "everything"
  // in one unbounded call.
  const fetchAllOrders = async () => {
    const currentToken = getValidToken();
    if (!currentToken) return [];
    let page = 1;
    let all = [];
    for (let i = 0; i < 100; i++) { // safety ceiling: 100 x 200/page = 20,000 orders
      try {
        const res = await fetch(`${API_URL}/api/orders?page=${page}&limit=200`, { headers: { Authorization: `Bearer ${currentToken}` } });
        if (!res.ok) {
          const errData = await safeParseResponse(res, `Orders (page ${page})`).catch((e) => e);
          console.error(`Orders page ${page} error:`, errData?.message || errData);
          break;
        }
        const data = await safeParseResponse(res, `Orders (page ${page})`);
        const pageItems = Array.isArray(data.orders) ? data.orders : [];
        all = all.concat(pageItems);
        const totalPages = data.pages || 1;
        if (page >= totalPages || pageItems.length === 0) break;
        page += 1;
      } catch (err) {
        console.error("Error fetching all orders (page " + page + "):", err);
        break;
      }
    }
    return all;
  };

  const fetchData = async () => {
    const currentToken = getValidToken();
    if (!currentToken) {
      clearAuthSession(true, "Your session has expired. Please log in again.");
      return;
    }
    try {
      const [
        resCatSettled,
        resBannerSettled,
        resGallerySettled,
        resContactsSettled,
        productsSettled,
        ordersSettled,
      ] = await Promise.allSettled([
        fetch(`${API_URL}/api/category`).then((r) => safeParseResponse(r, "Categories")),
        fetch(`${API_URL}/api/banner`).then((r) => safeParseResponse(r, "Banner")),
        fetch(`${API_URL}/api/gallery`).then((r) => safeParseResponse(r, "Gallery")),
        fetch(`${API_URL}/api/admin/contacts`, {
          headers: { Authorization: `Bearer ${currentToken}` }
        }).then((r) => safeParseResponse(r, "Contacts")),
        fetchAllProducts(),
        fetchAllOrders(),
      ]);

      const loadErrors = [];

      if (resCatSettled.status === "fulfilled") {
        setCategories(Array.isArray(resCatSettled.value) ? resCatSettled.value : []);
      } else {
        console.error("Categories load failed:", resCatSettled.reason?.message);
        loadErrors.push(`Categories: ${resCatSettled.reason?.message}`);
      }

      if (productsSettled.status === "fulfilled") {
        setProducts(productsSettled.value || []);
      } else {
        console.error("Products load failed:", productsSettled.reason?.message);
        loadErrors.push(`Products: ${productsSettled.reason?.message}`);
      }

      if (ordersSettled.status === "fulfilled") {
        setOrders(ordersSettled.value || []);
      } else {
        console.error("Orders load failed:", ordersSettled.reason?.message);
        loadErrors.push(`Orders: ${ordersSettled.reason?.message}`);
      }

      if (resGallerySettled.status === "fulfilled") {
        setGalleryList(Array.isArray(resGallerySettled.value) ? resGallerySettled.value : []);
      } else {
        console.error("Gallery load failed:", resGallerySettled.reason?.message);
        loadErrors.push(`Gallery: ${resGallerySettled.reason?.message}`);
      }

      if (resContactsSettled.status === "fulfilled") {
        setContactMessages(Array.isArray(resContactsSettled.value) ? resContactsSettled.value : []);
      } else {
        console.error("Contacts load failed:", resContactsSettled.reason?.message);
        loadErrors.push(`Contacts: ${resContactsSettled.reason?.message}`);
      }

      if (resBannerSettled.status === "fulfilled" && resBannerSettled.value) {
        const bannerResult = resBannerSettled.value;
        setBannerTitle(bannerResult.title || "");
        setBannerSubtitle(bannerResult.subtitle || "");
        setBannerDesc(bannerResult.description || "");
        setBannerExistingImage(bannerResult.image || "");
        setBannerEndDate(bannerResult.endDate ? bannerResult.endDate.substring(0, 16) : "");
      } else if (resBannerSettled.status === "rejected") {
        console.error("Banner load failed:", resBannerSettled.reason?.message);
        loadErrors.push(`Banner: ${resBannerSettled.reason?.message}`);
      }

      if (loadErrors.length > 0) {
        setDashboardApiError(loadErrors.join(" | "));
      } else {
        setDashboardApiError(null);
      }

      // Also load page 1 of the real paginated admin products table.
      await loadProductPage(1);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setDashboardApiError(err.message);
    }
  };

  // --- Scoped refetch helpers (Priority 7) ---
  // fetchData() above fetches ALL SIX resource types together — appropriate
  // for the initial page load, but wasteful when a single mutation (e.g.
  // adding one category) only actually changed one of them. These fetch
  // only what changed, used by the mutation handlers below instead of the
  // full fetchData(). fetchData() itself is left untouched (still used for
  // initial load) to avoid risking the one code path everything depends on.
  const refetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/category`);
      const data = await safeParseResponse(res, "Categories");
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error refreshing categories:", err);
    }
  };

  const refetchProducts = async () => {
    try {
      const [allProducts] = await Promise.all([
        fetchAllProducts(),
        loadProductPage(productPage),
      ]);
      setProducts(allProducts);
    } catch (err) {
      console.error("Error refreshing products:", err);
    }
  };

  const refetchOrders = async () => {
    try {
      const allOrders = await fetchAllOrders();
      setOrders(allOrders);
    } catch (err) {
      console.error("Error refreshing orders:", err);
    }
  };

  const refetchGallery = async () => {
    try {
      const res = await fetch(`${API_URL}/api/gallery`);
      const data = await safeParseResponse(res, "Gallery");
      setGalleryList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error refreshing gallery:", err);
    }
  };

  const refetchContacts = async () => {
    const currentToken = getValidToken();
    if (!currentToken) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/contacts`, { headers: { Authorization: `Bearer ${currentToken}` } });
      const data = await safeParseResponse(res, "Contacts");
      setContactMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error refreshing contact messages:", err);
    }
  };

  const refetchBanner = async () => {
    try {
      const res = await fetch(`${API_URL}/api/banner`);
      const bannerResult = await safeParseResponse(res, "Banner");
      if (bannerResult) {
        setBannerTitle(bannerResult.title || "");
        setBannerSubtitle(bannerResult.subtitle || "");
        setBannerDesc(bannerResult.description || "");
        setBannerExistingImage(bannerResult.image || "");
        setBannerEndDate(bannerResult.endDate ? bannerResult.endDate.substring(0, 16) : "");
      }
    } catch (err) {
      console.error("Error refreshing banner:", err);
    }
  };


  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Next/Prev on the admin products table triggers a real backend fetch
  // for that page (the `productPage > 1` guard just avoids double-fetching
  // page 1, which fetchData()/refetchProducts() already load).
  useEffect(() => {
    if (productPage > 1) {
      loadProductPage(productPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productPage]);

  // A new search term can leave the order table pointing at a page beyond
  // the new (smaller) result set, so reset to page 1 whenever it changes.
  useEffect(() => {
    setOrderPage(1);
  }, [orderSearchQuery]);

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

    const data = await safeParseResponse(res, "Upload Image");
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

      await safeParseResponse(res, "Add Category");
      setMessage("✅ Category Created Successfully!");
      setCatName("");
      setCatImageFile(null);
      refetchCategories();
    } catch (err) {
      setMessage("❌ Error adding category: " + err.message);
    } finally {
      setCatUploading(false);
    }
  };

  const startEditCategory = (c) => {
    setEditingCategory(c);
    setEditCatName(c.name || "");
    setEditCatExistingImage(c.image || "");
    setEditCatImageFile(null);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      setEditCatUpdating(true);
      let imagePath = editCatExistingImage;
      if (editCatImageFile) {
        imagePath = await uploadFileHandler(editCatImageFile);
      }
      const catId = editingCategory._id || editingCategory.id;
      const res = await fetch(`${API_URL}/api/category/${catId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editCatName, image: imagePath, isCategory: true }),
      });
      await safeParseResponse(res, "Update Category");
      setMessage("✅ Category Updated Successfully!");
      setEditingCategory(null);
      refetchCategories();
    } catch (err) {
      setMessage("❌ Error updating category: " + err.message);
    } finally {
      setEditCatUpdating(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${API_URL}/api/category/${id}`, { 
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await safeParseResponse(res, "Delete Category");
      setMessage("🗑️ Category Deleted!");
      refetchCategories();
    } catch (err) {
      setMessage("❌ Error deleting category: " + err.message);
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

      const payload = {
        category_id: prodCategory,
        name: prodName,
        price: Number(prodPrice),
        qnt: Number(prodQnt),
        image: imagePath,
        desc: prodDesc,
      };
      if (prodDiscountPrice !== "") {
        payload.discountPrice = Number(prodDiscountPrice);
      }

      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      await safeParseResponse(res, "Add Product");
      setMessage("✅ Product Added Successfully!");
      setProdName("");
      setProdCategory("");
      setProdPrice("");
      setProdDiscountPrice("");
      setProdQnt("");
      setProdImageFile(null);
      setProdDesc("");
      refetchProducts();
    } catch (err) {
      setMessage("❌ Error adding product: " + err.message);
    } finally {
      setProdUploading(false);
    }
  };

  const startEditProduct = (p) => {
    setEditingProduct(p);
    setEditProdName(p.name || "");
    const catId = p.category_id && typeof p.category_id === "object" ? (p.category_id._id || p.category_id.id) : p.category_id;
    setEditProdCategory(catId || "");
    setEditProdPrice(p.price !== undefined && p.price !== null ? p.price : "");
    setEditProdDiscountPrice(p.discountPrice !== undefined && p.discountPrice !== null ? p.discountPrice : "");
    setEditProdQnt(p.qnt !== undefined && p.qnt !== null ? p.qnt : "");
    setEditProdDesc(p.desc || "");
    setEditProdIsActive(p.isActive !== undefined ? p.isActive : true);
    setEditProdImageFile(null);
    setEditProdExistingImage(p.image || "");
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      setEditProdUpdating(true);
      let imagePath = editProdExistingImage;
      if (editProdImageFile) {
        imagePath = await uploadFileHandler(editProdImageFile);
      }
      const prodId = editingProduct._id || editingProduct.id;
      const payload = {
        name: editProdName,
        category_id: editProdCategory,
        price: Number(editProdPrice),
        discountPrice: editProdDiscountPrice !== "" ? Number(editProdDiscountPrice) : null,
        qnt: Number(editProdQnt),
        desc: editProdDesc,
        isActive: Boolean(editProdIsActive),
        image: imagePath,
      };
      const res = await fetch(`${API_URL}/api/products/${prodId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      await safeParseResponse(res, "Update Product");
      setMessage("✅ Product Updated Successfully!");
      setEditingProduct(null);
      refetchProducts();
    } catch (err) {
      setMessage("❌ Error updating product: " + err.message);
    } finally {
      setEditProdUpdating(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { 
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await safeParseResponse(res, "Delete Product");
      setMessage("🗑️ Product Deleted!");
      refetchProducts();
    } catch (err) {
      setMessage("❌ Error deleting product: " + err.message);
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

      await safeParseResponse(res, "Add Gallery");
      setMessage("✅ Gallery Image Added Successfully!");
      setGalleryName("");
      setGalleryCategory("");
      setGalleryDesc("");
      setGalleryImageFile(null);
      refetchGallery();
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
      await safeParseResponse(res, "Delete Gallery");
      setMessage("🗑️ Gallery Item Deleted!");
      refetchGallery();
    } catch (err) {
      setMessage("❌ Error deleting gallery item: " + err.message);
    }
  };

  const handleDeleteContactMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer message?")) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await safeParseResponse(res, "Delete Contact");
      setMessage("🗑️ Customer Message Deleted!");
      refetchContacts();
    } catch (err) {
      setMessage("❌ Error deleting message: " + err.message);
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

      await safeParseResponse(res, "Update Banner");
      setMessage("✨ Offer Banner Updated Successfully!");
      setBannerExistingImage(imagePath);
      setBannerImageFile(null);
      refetchBanner();
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

      await safeParseResponse(res, "Update Order Status");
      setMessage(`📦 Order Status updated to ${newStatus}!`);
      refetchOrders();
    } catch (err) {
      setMessage("❌ Error updating order status: " + err.message);
    }
  };

  const handleCancellationReview = async (orderId, action) => {
    const promptMsg = action === "approve"
      ? "Approve cancellation? Inventory will be restocked and order marked Cancelled. Add optional review note:"
      : "Reject cancellation? Enter reason for rejection (required for customer):";
    const reviewNotes = window.prompt(promptMsg);
    if (reviewNotes === null) return;
    if (action === "reject" && !reviewNotes.trim()) {
      alert("A rejection reason is required.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/cancellation-review`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, reviewNotes: reviewNotes.trim() }),
      });
      await safeParseResponse(res, "Cancellation Review");
      setMessage(action === "approve" ? "✅ Cancellation approved — order cancelled." : "❌ Cancellation request rejected.");
      refetchOrders();
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    }
  };

  const handleProcessRefund = async (order) => {
    const defaultAmount = order.pricing?.totalPrice ?? order.totalPrice;
    const amountStr = window.prompt(`Enter refund amount in ₹ (Total order was ₹${defaultAmount}):`, String(defaultAmount));
    if (amountStr === null) return;
    const amount = Number(amountStr);
    if (!amount || amount <= 0) {
      alert("Please enter a valid refund amount.");
      return;
    }

    const reason = window.prompt("Enter refund reason (e.g. Customer cancellation, DOA guarantee):", "Order cancellation refund");
    if (reason === null) return;

    let reference = "";
    if (order.paymentMethod !== "Razorpay") {
      const refInput = window.prompt("Enter bank/UPI transfer reference number for this refund (from your UPI/bank statement):");
      if (refInput === null) return;
      reference = refInput.trim();
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/${order._id}/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          reason: reason.trim(),
          method: order.paymentMethod === "Razorpay" ? "Razorpay" : "Manual UPI/Bank",
          reference,
        }),
      });
      await safeParseResponse(res, "Process Refund");
      setMessage(`💰 Refund processed successfully: ₹${amount}`);
      refetchOrders();
    } catch (err) {
      setMessage("❌ Refund error: " + err.message);
    }
  };

  // Creates a courier shipment via the Professional Courier abstraction —
  // runs in mock mode (clearly labeled) until real courier credentials are
  // configured in the backend .env. See utils/courierService.js.
  const handleCreateShipment = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/create-shipment`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await safeParseResponse(res, "Create Shipment");

      setMessage(
        data._mockShipment
          ? `📦 Mock tracking ID generated: ${data.shipment.trackingId} (Professional Courier not yet configured — replace with the real tracking ID once it is)`
          : `📦 Shipment created: ${data.shipment.trackingId}`
      );
      refetchOrders();
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };


  const formatOrderId = (order) => {
    if (order?.orderNumber) return order.orderNumber;
    if (!order?._id) return "#ORD-0000";
    return `#ORD-${order._id.substring(order._id.length - 6).toUpperCase()}`;
  };

  const exportOrdersToCSV = () => {
    if(orders.length === 0) return alert("No orders to export!");

    const headers = ["Order ID", "Customer Name", "Phone", "Email", "City", "State", "Date", "Total Price (INR)", "Payment Method", "UTR Number", "Payment Status", "Order Status"];
    
    const csvRows = orders.map(order => {
      return [
        formatOrderId(order),
        `"${order.shippingAddress?.fullName || 'Guest'}"`,
        `"${order.shippingAddress?.phone || 'N/A'}"`,
        `"${order.shippingAddress?.email || 'N/A'}"`,
        `"${order.shippingAddress?.city || 'N/A'}"`,
        `"${order.shippingAddress?.state || 'N/A'}"`,
        `"${new Date(order.createdAt).toLocaleDateString("en-GB")}"`,
        order.pricing?.totalPrice ?? order.totalPrice,
        `"${order.paymentMethod || 'N/A'}"`,
        `"${order.paymentDetails?.utr || order.upiTransactionId || 'N/A'}"`,
        `"${order.paymentStatus || 'N/A'}"`,
        `"${order.status || (order.isDelivered ? 'Delivered' : 'Pending Payment')}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `UDHAYA_AQUATICS_Orders_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportProductsToCSV = () => {
    if (products.length === 0) return alert("No products to export!");
    const headers = ["Product ID", "Name", "Category", "Price (INR)", "Quantity", "Rating", "Reviews Count", "Stock Status"];
    const csvRows = products.map((p) => [
      `"${p._id}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${renderCategoryName(p)}"`,
      p.price || 0,
      p.qnt || 0,
      p.rating || 0,
      p.numReviews || (p.reviews ? p.reviews.length : 0),
      `"${p.qnt <= 0 ? 'Out of Stock' : (p.qnt <= 5 ? 'Low Stock' : 'In Stock')}"`
    ].join(","));
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `UDHAYA_AQUATICS_Products_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteReview = async (productId, reviewId) => {
    if (!window.confirm("Are you sure you want to delete this customer review?")) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${productId}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      await safeParseResponse(res, "Delete Review");
      setMessage("🗑️ Review deleted successfully!");
      refetchProducts();
    } catch (err) {
      setMessage("❌ Error deleting review: " + err.message);
    }
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
    clearAuthSession(true);
  };

  // Revenue only counts orders whose payment has actually been verified —
  // Pending Verification orders aren't real revenue yet.
  const totalRevenue = orders
    .filter((order) => order.paymentStatus === "Verified" || order.isPaid)
    .reduce((acc, order) => acc + (order.pricing?.totalPrice ?? order.totalPrice ?? 0), 0);
  const lowStockProducts = products.filter(p => p.qnt <= 5);

  // Filtered Orders based on Search Query
  const filteredOrders = orders.filter((order) => {
    const orderIdStr = formatOrderId(order).toLowerCase();
    const customerName = (order.shippingAddress?.fullName || "").toLowerCase();
    const query = orderSearchQuery.toLowerCase().trim();

    return orderIdStr.includes(query) || customerName.includes(query);
  });

  // Client-side render pagination over the (already client-side-filtered)
  // search results — same ADMIN_PAGE_SIZE pattern as the products table,
  // so the orders table never renders hundreds of rows at once.
  const orderTotalPages = Math.max(1, Math.ceil(filteredOrders.length / ADMIN_PAGE_SIZE));
  const visibleOrders = filteredOrders.slice((orderPage - 1) * ADMIN_PAGE_SIZE, orderPage * ADMIN_PAGE_SIZE);

  return (
    <div className="admin-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-brand">
            <img src={logoImg} alt="UDHAYA AQUATICS" className="sidebar-logo" />
            <div className="sidebar-brand-text">
              <span className="brand-name">UDHAYA AQUATICS</span>
              <span className="brand-subtitle">Admin Panel</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Admin Menu"
            title="Close Menu"
          >
            <FaTimes />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li
            className={`sidebar-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
          >
            <FaTachometerAlt /> <span>Dashboard</span>
          </li>

          {can("orders.view") && (
            <li
              className={`sidebar-item ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => { setActiveTab("analytics"); setSidebarOpen(false); }}
            >
              <FaChartBar /> <span>Analytics</span>
            </li>
          )}

          {can("products.manage") && (
            <li
              className={`sidebar-item ${activeTab === "products" ? "active" : ""}`}
              onClick={() => { setActiveTab("products"); setSidebarOpen(false); }}
            >
              <FaBoxOpen /> <span>Products</span>
              {lowStockProducts.length > 0 && (
                <span className="sidebar-badge" title={`${lowStockProducts.length} low stock items`}>
                  {lowStockProducts.length}
                </span>
              )}
            </li>
          )}

          {can("categories.manage") && (
            <li
              className={`sidebar-item ${activeTab === "categories" ? "active" : ""}`}
              onClick={() => { setActiveTab("categories"); setSidebarOpen(false); }}
            >
              <FaTags /> <span>Categories</span>
            </li>
          )}

          {can("orders.view") && (
            <li
              className={`sidebar-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => { setActiveTab("orders"); setSidebarOpen(false); }}
            >
              <FaShoppingCart /> <span>Orders</span>
              {orders.length > 0 && (
                <span className="sidebar-badge" style={{ backgroundColor: "#3b82f6" }}>
                  {orders.length}
                </span>
              )}
            </li>
          )}

          {can("payments.verify") && (
            <li
              className={`sidebar-item ${activeTab === "payments" ? "active" : ""}`}
              onClick={() => { setActiveTab("payments"); setSidebarOpen(false); }}
            >
              <FaMoneyBillWave /> <span>Payments</span>
              {orders.filter((o) => o.paymentStatus === "Pending Verification").length > 0 && (
                <span className="sidebar-badge">
                  {orders.filter((o) => o.paymentStatus === "Pending Verification").length}
                </span>
              )}
            </li>
          )}

          {can("delivery.manage") && (
            <li
              className={`sidebar-item ${activeTab === "delivery" ? "active" : ""}`}
              onClick={() => { setActiveTab("delivery"); setSidebarOpen(false); }}
            >
              <FaTruck /> <span>Delivery</span>
            </li>
          )}

          {can("coupons.manage") && (
            <li
              className={`sidebar-item ${activeTab === "coupons" ? "active" : ""}`}
              onClick={() => { setActiveTab("coupons"); setSidebarOpen(false); }}
            >
              <FaTag /> <span>Coupons &amp; Offers</span>
            </li>
          )}

          {can("contacts.manage") && (
            <li
              className={`sidebar-item ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => { setActiveTab("messages"); setSidebarOpen(false); }}
            >
              <FaEnvelope /> <span>Messages</span>
              {contactMessages.length > 0 && (
                <span className="sidebar-badge" style={{ backgroundColor: "#0284c7" }}>
                  {contactMessages.length}
                </span>
              )}
            </li>
          )}

          {can("banner.manage") && (
            <li
              className={`sidebar-item ${activeTab === "banner" ? "active" : ""}`}
              onClick={() => { setActiveTab("banner"); setSidebarOpen(false); }}
            >
              <FaImage /> <span>Banner</span>
            </li>
          )}

          {can("gallery.manage") && (
            <li
              className={`sidebar-item ${activeTab === "gallery" ? "active" : ""}`}
              onClick={() => { setActiveTab("gallery"); setSidebarOpen(false); }}
            >
              <FaImages /> <span>Gallery</span>
            </li>
          )}

          {(isFullAdmin || can("orders.view")) && (
            <li
              className={`sidebar-item ${activeTab === "customers" ? "active" : ""}`}
              onClick={() => { setActiveTab("customers"); setSidebarOpen(false); }}
            >
              <FaUsers /> <span>Customers</span>
            </li>
          )}

          {(can("reviews.moderate") || can("products.manage")) && (
            <li
              className={`sidebar-item ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => { setActiveTab("reviews"); setSidebarOpen(false); }}
            >
              <FaStar /> <span>Reviews</span>
            </li>
          )}

          {(isFullAdmin || can("products.manage")) && (
            <li
              className={`sidebar-item ${activeTab === "wishlist" ? "active" : ""}`}
              onClick={() => { setActiveTab("wishlist"); setSidebarOpen(false); }}
            >
              <FaHeart /> <span>Wishlist</span>
            </li>
          )}

          {isFullAdmin && (
            <li
              className={`sidebar-item ${activeTab === "staff" ? "active" : ""}`}
              onClick={() => { setActiveTab("staff"); setSidebarOpen(false); }}
            >
              <FaUserShield /> <span>Users / Admin Users</span>
            </li>
          )}

          {isFullAdmin && (
            <li
              className={`sidebar-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
            >
              <FaCog /> <span>Settings</span>
            </li>
          )}

          {(can("orders.view") || isFullAdmin) && (
            <li
              className={`sidebar-item ${activeTab === "reports" ? "active" : ""}`}
              onClick={() => { setActiveTab("reports"); setSidebarOpen(false); }}
            >
              <FaFileAlt /> <span>Reports</span>
            </li>
          )}

          {isFullAdmin && (
            <li
              className={`sidebar-item ${activeTab === "auditlog" ? "active" : ""}`}
              onClick={() => { setActiveTab("auditlog"); setSidebarOpen(false); }}
            >
              <FaHistory /> <span>Audit Logs</span>
            </li>
          )}

          <li className="sidebar-item logout" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </li>
        </ul>
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MAIN DASHBOARD PANEL */}
      <main className="admin-main-content">
        <div className="dashboard-header">
          <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Admin Menu"
              title="Open Menu"
            >
              <FaBars />
            </button>
            <h1 style={{ margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {TAB_TITLES[activeTab] || "Dashboard Overview"}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-theme-toggle"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <FaSun color="#f59e0b" size={16} /> : <FaMoon color="#64748b" size={16} />}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-secondary"
              style={{
                background: "#0a2540",
                color: "white",
                border: "none",
                padding: "9px 14px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
              }}
            >
              <FaStore size={14} /> <span>View Store</span>
            </button>
            <button
              type="button"
              onClick={generateDashboardReport}
              className="btn-export"
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "9px 14px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
              }}
            >
              <FaDownload size={14} /> <span>Download Report</span>
            </button>
          </div>
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

        {dashboardApiError && (
          <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#991b1b", border: "1px solid #f87171", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <FaExclamationTriangle style={{ flexShrink: 0 }} />
            <div>
              <strong>API Warning:</strong> {dashboardApiError}
            </div>
          </div>
        )}

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
                <div className="admin-input-group"><label>End Date &amp; Time</label><input type="datetime-local" required value={bannerEndDate} onChange={(e) => setBannerEndDate(e.target.value)} /></div>
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
                        <td style={{ display: "flex", gap: "6px" }}>
                          <button className="action-btn edit" onClick={() => startEditCategory(c)} title="Edit Category"><FaEdit /></button>
                          <button className="action-btn delete" onClick={() => handleDeleteCategory(c._id || c.id)} title="Delete Category"><FaTrash /></button>
                        </td>
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
                    <label>Category *</label>
                    <select required value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                      <option value="">-- Select Category --</option>
                      {categories.map((c) => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="admin-input-group"><label>Product Name *</label><input type="text" required value={prodName} onChange={(e) => setProdName(e.target.value)} /></div>
                </div>
                <div className="form-grid-2">
                  <div className="admin-input-group"><label>Regular Price (₹) *</label><input type="number" required min="0" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} /></div>
                  <div className="admin-input-group"><label>Discount / Sale Price (₹) (Optional)</label><input type="number" min="0" placeholder="e.g. 299" value={prodDiscountPrice} onChange={(e) => setProdDiscountPrice(e.target.value)} /></div>
                </div>
                <div className="form-grid-2">
                  <div className="admin-input-group"><label>Stock Quantity *</label><input type="number" required min="0" value={prodQnt} onChange={(e) => setProdQnt(e.target.value)} /></div>
                  <div className="admin-input-group"><label>Upload Image *</label><input type="file" accept="image/*" required onChange={(e) => setProdImageFile(e.target.files[0])} /></div>
                </div>
                <div className="admin-input-group"><label>Description</label><textarea rows="3" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)}></textarea></div>
                <button type="submit" className="submit-btn" disabled={prodUploading}>{prodUploading ? "Uploading..." : "Add Product"}</button>
              </form>
            </div>

            <div className="panel-card">
              <h2>All Products ({productPageInfo.total})</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Media</th><th>Actions</th></tr></thead>
                  <tbody>
                    {productPageData.map((p) => (
                      <tr key={p._id || p.id}>
                        <td><img src={getImageUrl(p.image)} alt={p.name} width="45" height="45" style={{ objectFit: "cover", borderRadius: "6px" }} /></td>
                        <td><strong>{p.name}</strong></td>
                        <td>
                          {p.discountPrice != null && p.discountPrice < p.price ? (
                            <span>
                              <strong style={{ color: "#ff4d2d" }}>₹{p.discountPrice}</strong>{" "}
                              <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "12px" }}>₹{p.price}</span>
                            </span>
                          ) : (
                            <span>₹{p.price}</span>
                          )}
                        </td>
                        <td>{p.qnt <= 5 ? <span className="low-stock-alert" style={{ color: "#ef4444", fontWeight: "bold" }}><FaExclamationTriangle /> {p.qnt} Left</span> : <span>{p.qnt}</span>}</td>
                        <td><strong>{renderCategoryName(p)}</strong></td>
                        <td style={{ fontSize: "12px", color: "#64748b" }}>
                          {(p.images?.length || 0)} extra img{p.video ? " · video" : ""}
                        </td>
                        <td style={{ display: "flex", gap: "6px" }}>
                          <button className="action-btn edit" onClick={() => startEditProduct(p)} title="Edit Product">
                            <FaEdit />
                          </button>
                          <button className="action-btn" onClick={() => setMediaManagerProduct(p)} title="Manage Images & Video" style={{ background: "#e0f2fe", color: "#0284c7", border: "none", borderRadius: "4px", padding: "6px 8px", cursor: "pointer" }}>
                            <FaImage />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDeleteProduct(p._id || p.id)} title="Delete Product"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {productPageInfo.pages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "14px", marginTop: "16px" }}>
                  <button onClick={() => setProductPage((p) => Math.max(1, p - 1))} disabled={productPage <= 1} style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", background: productPage <= 1 ? "#f1f5f9" : "#fff", cursor: productPage <= 1 ? "not-allowed" : "pointer" }}>← Prev</button>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>Page {productPageInfo.page} of {productPageInfo.pages}</span>
                  <button onClick={() => setProductPage((p) => Math.min(productPageInfo.pages, p + 1))} disabled={productPage >= productPageInfo.pages} style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", background: productPage >= productPageInfo.pages ? "#f1f5f9" : "#fff", cursor: productPage >= productPageInfo.pages ? "not-allowed" : "pointer" }}>Next →</button>
                </div>
              )}
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
                    <th>Shipment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                        No orders found matching your search.
                      </td>
                    </tr>
                  ) : (
                    visibleOrders.map((order) => {
                      const currentStatus = order.status || (order.isDelivered ? "Delivered" : "Pending Payment");
                      const totalPrice = order.pricing?.totalPrice ?? order.totalPrice;
                      const utr = order.paymentDetails?.utr || order.upiTransactionId;
                      return (
                        <tr key={order._id}>
                          <td style={{ fontWeight: "700", color: "var(--text-primary)" }}>{formatOrderId(order)}</td>
                          <td><strong>{order.shippingAddress?.fullName || "Guest"}</strong></td>
                          <td>{new Date(order.createdAt).toLocaleDateString("en-GB")}</td>
                          <td style={{ fontWeight: "600", color: "#16a34a" }}>₹{totalPrice}</td>
                          <td>
                            <span style={{ display: "inline-block", fontSize: "12px", fontWeight: "600", padding: "4px 8px", borderRadius: "4px", backgroundColor: "#e0f2fe", color: "#0284c7" }}>
                              {order.paymentMethod || "N/A"}
                            </span>
                            {utr && (
                              <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px", fontWeight: "700" }}>UTR: {utr}</div>
                            )}
                            <div style={{ fontSize: "11px", marginTop: "4px", fontWeight: "700", color: order.paymentStatus === "Verified" ? "#16a34a" : order.paymentStatus === "Failed" ? "#dc2626" : "#b45309" }}>
                              {order.paymentStatus}
                            </div>
                            {order.refund?.status && (
                              <div style={{ fontSize: "11px", color: "#0369a1", marginTop: "4px", fontWeight: "600" }}>
                                💰 Refund {order.refund.status}: ₹{order.refund.amount}
                              </div>
                            )}
                          </td>
                          <td>
                            <span style={{
                              color: currentStatus === "Delivered" ? "#166534" : currentStatus === "Shipped" || currentStatus === "Out for Delivery" ? "#1d4ed8" : currentStatus === "Processing" || currentStatus === "Packed" ? "#7c2d12" : currentStatus === "Cancelled" || currentStatus === "Payment Failed" ? "#991b1b" : "#b45309",
                              background: currentStatus === "Delivered" ? "#dcfce7" : currentStatus === "Shipped" || currentStatus === "Out for Delivery" ? "#dbeafe" : currentStatus === "Processing" || currentStatus === "Packed" ? "#ffedd5" : currentStatus === "Cancelled" || currentStatus === "Payment Failed" ? "#fee2e2" : "#fef3c7",
                              padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px"
                            }}>
                              {currentStatus}
                            </span>
                            {order.cancellation?.status === "Requested" && (
                              <div style={{ marginTop: "6px", padding: "4px 8px", background: "#fef3c7", borderRadius: "4px", fontSize: "11px", color: "#92400e" }}>
                                <strong>Cancel Req:</strong> &quot;{order.cancellation.reason}&quot;
                                <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                                  <button
                                    onClick={() => handleCancellationReview(order._id, "approve")}
                                    style={{ background: "#16a34a", color: "white", border: "none", padding: "3px 6px", borderRadius: "3px", fontSize: "10px", cursor: "pointer", fontWeight: "600" }}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleCancellationReview(order._id, "reject")}
                                    style={{ background: "#dc2626", color: "white", border: "none", padding: "3px 6px", borderRadius: "3px", fontSize: "10px", cursor: "pointer", fontWeight: "600" }}
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            <select value={currentStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)} style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}>
                              <option value="Pending Payment">Pending Payment</option>
                              <option value="Payment Verified">Payment Verified</option>
                              <option value="Order Confirmed">Order Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Payment Failed">Payment Failed</option>
                              <option value="Refunded">Refunded</option>
                            </select>
                            {["Cancelled", "Payment Failed"].includes(currentStatus) && !order.refund?.status && (
                              <div style={{ marginTop: "6px" }}>
                                <button
                                  onClick={() => handleProcessRefund(order)}
                                  style={{ background: "#0284c7", color: "white", border: "none", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}
                                >
                                  Process Refund
                                </button>
                              </div>
                            )}
                          </td>
                          <td>
                            {order.shipment?.trackingId ? (
                              <div style={{ fontSize: "12px" }}>
                                <strong>{order.shipment.trackingId}</strong>
                                <div style={{ color: order.shipment.trackingId.startsWith("MOCK-PC-") ? "#b45309" : "#16a34a" }}>
                                  {order.shipment.trackingId.startsWith("MOCK-PC-") ? "Mock (courier not configured)" : order.shipment.courierName}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleCreateShipment(order._id)}
                                disabled={!["Order Confirmed", "Processing", "Packed"].includes(currentStatus)}
                                title={!["Order Confirmed", "Processing", "Packed"].includes(currentStatus) ? "Order must be confirmed first" : ""}
                                style={{ background: "#f1f5f9", border: "none", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}
                              >
                                Create Shipment
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {filteredOrders.length > ADMIN_PAGE_SIZE && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "14px", marginTop: "16px" }}>
                <button onClick={() => setOrderPage((p) => Math.max(1, p - 1))} disabled={orderPage <= 1} style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", background: orderPage <= 1 ? "#f1f5f9" : "#fff", cursor: orderPage <= 1 ? "not-allowed" : "pointer" }}>← Prev</button>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Page {orderPage} of {orderTotalPages}</span>
                <button onClick={() => setOrderPage((p) => Math.min(orderTotalPages, p + 1))} disabled={orderPage >= orderTotalPages} style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", background: orderPage >= orderTotalPages ? "#f1f5f9" : "#fff", cursor: orderPage >= orderTotalPages ? "not-allowed" : "pointer" }}>Next →</button>
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === "payments" && (
          <AdminPayments
            orders={orders}
            token={token}
            setMessage={setMessage}
            onOrderUpdated={(updatedOrder) => {
              setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)));
            }}
          />
        )}

        {/* DELIVERY RULES */}
        {activeTab === "delivery" && (
          <AdminDeliveryRules token={token} setMessage={setMessage} />
        )}

        {/* COUPONS & OFFERS */}
        {activeTab === "coupons" && (
          <AdminCouponsOffers token={token} categories={categories} products={products} setMessage={setMessage} />
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <AdminSettings token={token} setMessage={setMessage} />
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === "customers" && (
          <AdminUsers
            token={token}
            currentUserId={currentUser?._id}
            setMessage={setMessage}
            filterRole="user"
          />
        )}

        {/* STAFF & ROLES (admin/superadmin only) */}
        {activeTab === "staff" && isFullAdmin && (
          <AdminUsers
            token={token}
            currentUserId={currentUser?._id}
            setMessage={setMessage}
            filterRole="staff"
          />
        )}

        {/* REVIEWS MODERATION TAB */}
        {activeTab === "reviews" && (
          <div className="panel-card">
            <h2>Product Reviews Moderation</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
              Monitor and moderate customer reviews submitted on products across your store.
            </p>
            {(() => {
              const allReviews = products.flatMap((p) =>
                (p.reviews || []).map((r) => ({
                  ...r,
                  productId: p._id,
                  productName: p.name,
                  productImage: p.image,
                }))
              );
              if (allReviews.length === 0) {
                return (
                  <p style={{ color: "#94a3b8", padding: "20px 0" }}>
                    No customer reviews submitted yet. When customers submit reviews on product pages, they will appear here for moderation.
                  </p>
                );
              }
              return (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Customer</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allReviews.map((rev) => (
                        <tr key={rev._id || `${rev.productId}-${rev.name}`}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              {rev.productImage && (
                                <img
                                  src={getImageUrl(rev.productImage)}
                                  alt={rev.productName}
                                  width="36"
                                  height="36"
                                  style={{ objectFit: "cover", borderRadius: "4px" }}
                                />
                              )}
                              <strong>{rev.productName}</strong>
                            </div>
                          </td>
                          <td>
                            <div>{rev.name}</div>
                            {rev.verifiedPurchase && (
                              <span style={{ fontSize: "11px", color: "#16a34a" }}>✓ Verified Buyer</span>
                            )}
                          </td>
                          <td>
                            <div style={{ color: "#f59e0b", display: "flex", gap: "3px", alignItems: "center" }}>
                              <span>{rev.rating}</span>
                              <FaStar size={12} />
                            </div>
                          </td>
                          <td>{rev.comment}</td>
                          <td>{new Date(rev.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteReview(rev.productId, rev._id)}
                              title="Delete Review"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === "wishlist" && (
          <div className="panel-card">
            <h2>Customer Wishlists &amp; Demand Insights</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
              Catalog demand tracking and inventory health for items saved by customers.
            </p>
            <div className="stats-grid" style={{ marginBottom: "25px" }}>
              <div className="stat-card">
                <div className="stat-title">Tracked Catalog Items</div>
                <div className="stat-value">{products.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">High Demand / In Stock</div>
                <div className="stat-value" style={{ color: "#16a34a" }}>
                  {products.filter((p) => p.qnt > 5).length}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Restock Alert (&le; 5)</div>
                <div className="stat-value" style={{ color: "#ef4444" }}>
                  {lowStockProducts.length}
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img
                            src={getImageUrl(p.image)}
                            alt={p.name}
                            width="40"
                            height="40"
                            style={{ objectFit: "cover", borderRadius: "6px" }}
                          />
                          <div>
                            <strong>{p.name}</strong>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>SKU: {p.sku || p._id.substring(p._id.length - 6)}</div>
                          </div>
                        </div>
                      </td>
                      <td>{renderCategoryName(p)}</td>
                      <td>₹{(p.price || 0).toLocaleString("en-IN")}</td>
                      <td>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                            background: p.qnt <= 0 ? "#fee2e2" : p.qnt <= 5 ? "#fef3c7" : "#dcfce7",
                            color: p.qnt <= 0 ? "#991b1b" : p.qnt <= 5 ? "#92400e" : "#166534",
                          }}
                        >
                          {p.qnt <= 0 ? "Out of Stock" : p.qnt <= 5 ? `Low Stock (${p.qnt})` : `In Stock (${p.qnt})`}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/shop/${p._id}`)}
                          className="btn-secondary"
                          style={{
                            padding: "4px 10px",
                            fontSize: "12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          <FaStore size={11} /> View in Store
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div>
            <div className="panel-card" style={{ marginBottom: "25px" }}>
              <h2>Business Reports &amp; Data Exports</h2>
              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
                Generate official store reports, export order records, and download inventory CSV files.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "25px" }}>
                <button
                  onClick={generateDashboardReport}
                  className="btn-export"
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "11px 18px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13.5px",
                  }}
                >
                  <FaDownload size={15} /> Print / Save Store Report
                </button>
                <button
                  onClick={exportOrdersToCSV}
                  className="btn-export"
                  style={{
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    padding: "11px 18px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13.5px",
                  }}
                >
                  <FaFileCsv size={16} /> Export Orders (CSV)
                </button>
                <button
                  onClick={exportProductsToCSV}
                  className="btn-export"
                  style={{
                    background: "#ff4d2d",
                    color: "white",
                    border: "none",
                    padding: "11px 18px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13.5px",
                  }}
                >
                  <FaFileCsv size={16} /> Export Inventory (CSV)
                </button>
              </div>

              <h3>Store Snapshot</h3>
              <div className="stats-grid" style={{ marginTop: "15px" }}>
                <div className="stat-card">
                  <div className="stat-title">Verified Revenue</div>
                  <div className="stat-value" style={{ color: "#16a34a" }}>
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Total Orders</div>
                  <div className="stat-value">{orders.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Average Order Value</div>
                  <div className="stat-value">
                    ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString("en-IN") : 0}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Total Products in Catalog</div>
                  <div className="stat-value">{products.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <AdminAnalytics token={token} />
        )}

        {/* AUDIT LOG (admin/superadmin only) */}
        {activeTab === "auditlog" && isFullAdmin && (
          <AdminAuditLogs token={token} />
        )}

        {/* PRODUCT MEDIA MANAGER MODAL */}
        {mediaManagerProduct && (
          <ProductMediaManager
            product={mediaManagerProduct}
            token={token}
            setMessage={setMessage}
            onClose={() => setMediaManagerProduct(null)}
            onSaved={(updatedProduct) => {
              setProducts((prev) => prev.map((p) => ((p._id || p.id) === (updatedProduct._id || updatedProduct.id) ? updatedProduct : p)));
              setProductPageData((prev) => prev.map((p) => ((p._id || p.id) === (updatedProduct._id || updatedProduct.id) ? updatedProduct : p)));
            }}
          />
        )}

        {/* EDIT CATEGORY MODAL */}
        {editingCategory && (
          <div className="admin-modal-overlay" onClick={() => setEditingCategory(null)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>Edit Category</h2>
                <button className="admin-modal-close-btn" onClick={() => setEditingCategory(null)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleUpdateCategory}>
                <div className="admin-input-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    required
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                  />
                </div>
                {editCatExistingImage && (
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Current Category Image</label>
                    <img src={getImageUrl(editCatExistingImage)} alt="Current" width="70" height="70" style={{ objectFit: "cover", borderRadius: "6px" }} />
                  </div>
                )}
                <div className="admin-input-group">
                  <label>Replace Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditCatImageFile(e.target.files[0])}
                  />
                </div>
                <div className="admin-modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setEditingCategory(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={editCatUpdating}>
                    {editCatUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT PRODUCT MODAL */}
        {editingProduct && (
          <div className="admin-modal-overlay" onClick={() => setEditingProduct(null)}>
            <div className="admin-modal-card" style={{ maxWidth: "650px" }} onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>Edit Product</h2>
                <button className="admin-modal-close-btn" onClick={() => setEditingProduct(null)}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleUpdateProduct}>
                <div className="form-grid-2">
                  <div className="admin-input-group">
                    <label>Category</label>
                    <select required value={editProdCategory} onChange={(e) => setEditProdCategory(e.target.value)}>
                      <option value="">-- Select Category --</option>
                      {categories.map((c) => (
                        <option key={c._id || c.id} value={c._id || c.id}>
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
                      value={editProdName}
                      onChange={(e) => setEditProdName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="admin-input-group">
                    <label>Regular Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editProdPrice}
                      onChange={(e) => setEditProdPrice(e.target.value)}
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>Discount / Sale Price (₹) (Optional)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Leave blank if no discount"
                      value={editProdDiscountPrice}
                      onChange={(e) => setEditProdDiscountPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="admin-input-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editProdQnt}
                      onChange={(e) => setEditProdQnt(e.target.value)}
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>Status</label>
                    <select
                      value={editProdIsActive ? "active" : "inactive"}
                      onChange={(e) => setEditProdIsActive(e.target.value === "active")}
                    >
                      <option value="active">Active (Visible in Store)</option>
                      <option value="inactive">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>

                {editProdExistingImage && (
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Current Main Image</label>
                    <img src={getImageUrl(editProdExistingImage)} alt="Current" width="70" height="70" style={{ objectFit: "cover", borderRadius: "6px" }} />
                  </div>
                )}

                <div className="admin-input-group">
                  <label>Replace Main Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditProdImageFile(e.target.files[0])}
                  />
                </div>

                <div className="admin-input-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={editProdDesc}
                    onChange={(e) => setEditProdDesc(e.target.value)}
                  ></textarea>
                </div>

                <div className="admin-modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setEditingProduct(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={editProdUpdating}>
                    {editProdUpdating ? "Saving..." : "Save Changes"}
                  </button>
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
