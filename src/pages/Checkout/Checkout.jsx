import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { CartContext } from "../../context/CartContext";
import { getValidToken } from "../../utils/auth";
import Footer from "../../components/Footer/Footer";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Puducherry", "Chandigarh", "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
];

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: "", phone: "", whatsapp: "", email: "",
    address: "", city: "", district: "", state: "", pincode: "",
  });

  // Saved Addresses state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [utr, setUtr] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPublicId, setScreenshotPublicId] = useState("");
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  // --- UPI QR / app-button robustness ---
  const [qrImageFailed, setQrImageFailed] = useState(false);
  const [showDesktopUpiHint, setShowDesktopUpiHint] = useState(false);
  const [upiIdCopied, setUpiIdCopied] = useState(false);

  const [settings, setSettings] = useState(null);
  const [delivery, setDelivery] = useState({ charge: null, isServiceable: true, message: "" });
  const [checkingDelivery, setCheckingDelivery] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + (item.discountPrice ?? item.price) * (item.quantity || item.qty || 1),
    0
  );
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0);

  // --- Load business settings (UPI/bank details, GST) once ---
  useEffect(() => {
    fetch(`${API_URL}/api/settings/public`)
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  // --- Load user's saved addresses for logged-in customer ---
  useEffect(() => {
    const token = getValidToken();
    if (token) {
      fetch(`${API_URL}/api/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setSavedAddresses(data);
            const def = data.find((a) => a.isDefault) || data[0];
            setSelectedAddressId(def._id);
            setShowNewAddressForm(false);
            const userStr = localStorage.getItem("user");
            const userObj = userStr ? JSON.parse(userStr) : {};
            setShipping({
              fullName: def.fullName || userObj.name || "",
              phone: def.mobile || userObj.mobile || "",
              whatsapp: def.mobile || "",
              email: userObj.email || "",
              address: `${def.houseFlat}, ${def.streetArea}${def.landmark ? ", Near " + def.landmark : ""}`,
              city: def.city || "",
              district: def.district || "",
              state: def.state || "",
              pincode: def.pincode || "",
            });
          } else {
            setShowNewAddressForm(true);
            const userStr = localStorage.getItem("user");
            if (userStr) {
              const u = JSON.parse(userStr);
              setShipping((prev) => ({
                ...prev,
                fullName: u.name || prev.fullName,
                phone: u.mobile || prev.phone,
                email: u.email || prev.email,
              }));
            }
          }
        })
        .catch(() => setShowNewAddressForm(true));
    } else {
      setShowNewAddressForm(true);
    }
  }, []);

  // If the default-selected method ("UPI") turns out not to actually be
  // configured once settings load, silently leaving it selected means the
  // customer lands on checkout already pointed at a dead end — they'd see
  // "UPI ID not configured yet" with a still-required UTR field and no way
  // to actually pay. Switch to whichever method genuinely works instead.
  // Only runs once settings first arrive, and only touches the selection
  // if it's still on the untouched "UPI" default (never overrides an
  // explicit choice the customer already made).
  useEffect(() => {
    if (!settings) return;
    const upiAvailable = Boolean(settings?.payment?.upiId || settings?.payment?.upiQrImage);
    if (paymentMethod === "UPI" && !upiAvailable) {
      if (settings?.payment?.razorpayEnabled) {
        setPaymentMethod("Razorpay");
      } else if (settings?.payment?.bankAccountNumber) {
        setPaymentMethod("BankTransfer");
      }
      // If nothing is configured at all, leave it on "UPI" — the box below
      // will show the clear "unavailable" message rather than a silent
      // no-op with nothing selected.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // A newly saved QR URL in Admin Settings deserves a fresh load attempt —
  // don't leave the failure flag stuck from a previous bad URL.
  useEffect(() => {
    setQrImageFailed(false);
  }, [settings?.payment?.upiQrImage]);

  // --- Live delivery-charge preview whenever state/pincode changes ---
  const checkDelivery = useCallback(async (state, pincode) => {
    if (!state || !pincode || pincode.length !== 6) {
      setDelivery({ charge: null, isServiceable: true, message: "" });
      return;
    }
    setCheckingDelivery(true);
    try {
      const res = await fetch(
        `${API_URL}/api/delivery/check?state=${encodeURIComponent(state)}&pincode=${pincode}&quantity=${totalQuantity}&subtotal=${subtotal}`
      );
      const data = await res.json();
      setDelivery(data);
    } catch {
      setDelivery({ charge: null, isServiceable: true, message: "Could not check delivery — will confirm at checkout." });
    } finally {
      setCheckingDelivery(false);
    }
  }, [totalQuantity, subtotal]);

  useEffect(() => {
    const timer = setTimeout(() => checkDelivery(shipping.state, shipping.pincode), 500);
    return () => clearTimeout(timer);
  }, [shipping.state, shipping.pincode, checkDelivery]);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setShowNewAddressForm(false);
    const userStr = localStorage.getItem("user");
    const userObj = userStr ? JSON.parse(userStr) : {};
    setShipping({
      fullName: addr.fullName,
      phone: addr.mobile,
      whatsapp: addr.mobile,
      email: userObj.email || shipping.email || "",
      address: `${addr.houseFlat}, ${addr.streetArea}${addr.landmark ? ", Near " + addr.landmark : ""}`,
      city: addr.city,
      district: addr.district || "",
      state: addr.state,
      pincode: addr.pincode,
    });
  };

  const handleScreenshotUpload = async (file) => {
    setScreenshotFile(file);
    setUploadingScreenshot(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("screenshot", file);
      const res = await fetch(`${API_URL}/api/upload/payment-screenshot`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      // The upload endpoint stores this privately (Cloudinary "private"
      // delivery type) — filePath is not a viewable public URL, only
      // publicId (used later by admin to view it via a signed URL) matters.
      setScreenshotPublicId(data.publicId);
    } catch (err) {
      setError("Screenshot upload failed: " + err.message);
      setScreenshotFile(null);
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponResult(null);
    try {
      const res = await fetch(`${API_URL}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          cartItems: cart.map((item) => ({ product: item._id || item.id, quantity: item.quantity || item.qty || 1 })),
        }),
      });
      const data = await res.json();
      setCouponResult(data);
    } catch {
      setCouponResult({ valid: false, message: "Could not validate coupon right now" });
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponResult(null);
  };

  const gstRate = settings?.tax?.gstEnabled ? settings.tax.gstRate : 0;
  const couponDiscount = couponResult?.valid ? couponResult.discount : 0;
  const subtotalAfterCoupon = Math.max(0, subtotal - couponDiscount);
  const isFreeDelivery = (couponResult?.valid && couponResult.freeDelivery) || delivery.isFreeDelivery;
  const deliveryCharge = isFreeDelivery ? 0 : (delivery.charge ?? 0);
  const gstAmount = Math.round(((subtotalAfterCoupon + deliveryCharge) * gstRate) / 100);
  const estimatedTotal = subtotalAfterCoupon + deliveryCharge + gstAmount;

  // Dynamically loads the Razorpay checkout script (not an npm package —
  // it's a hosted widget script, per Razorpay's own integration model).
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpayPayment = async () => {
    setLoading(true);
    const token = getValidToken();

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Could not load payment gateway. Check your connection and try again.");

      const orderItems = cart.map((item) => ({
        product: item._id || item.id,
        quantity: item.quantity || item.qty || 1,
      }));

      const createRes = await fetch(`${API_URL}/api/payments/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          orderItems,
          shippingAddress: shipping,
          couponCode: couponResult?.valid ? couponCode.trim() : undefined,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.message || "Could not start payment");

      const razorpay = new window.Razorpay({
        key: createData.keyId,
        amount: createData.amount,
        currency: createData.currency,
        order_id: createData.razorpayOrderId,
        name: settings?.website?.name || "UDHAYA AQUATICS",
        description: "Order Payment",
        prefill: { name: shipping.fullName, email: shipping.email, contact: shipping.phone },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_URL}/api/payments/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message || "Payment verification failed");

            if (clearCart) clearCart();
            navigate("/order-success", { state: { order: verifyData } });
          } catch (err) {
            setError(err.message);
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
        theme: { color: "#0a2540" },
      });

      razorpay.open();
    } catch (err) {
      setError(err.message || "Something went wrong starting the payment.");
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!delivery.isServiceable) {
      setError(delivery.message || "Delivery is not available for this location.");
      return;
    }

    // Defense in depth: the radio buttons are already disabled for an
    // unconfigured method, but guard the actual submit too rather than
    // relying on the UI alone.
    if (paymentMethod === "UPI" && !upiConfigured) {
      setError("UPI payment is currently unavailable. Please choose another payment method.");
      return;
    }
    if (paymentMethod === "BankTransfer" && !bankConfigured) {
      setError("Bank transfer is currently unavailable. Please choose another payment method.");
      return;
    }

    if (paymentMethod === "Razorpay") {
      return handleRazorpayPayment();
    }

    if (!utr.trim()) {
      setError("Please enter the UTR / transaction reference number after making the payment.");
      return;
    }

    if ((paymentMethod === "UPI" || paymentMethod === "BankTransfer") && !screenshotPublicId) {
      setError("Please upload your payment screenshot/receipt so we can verify your transaction.");
      return;
    }

    setLoading(true);
    const token = getValidToken();

    const orderData = {
      orderItems: cart.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity || item.qty || 1,
      })),
      shippingAddress: shipping,
      paymentMethod,
      utr: utr.trim(),
      paymentScreenshotPublicId: screenshotPublicId || null,
      couponCode: couponResult?.valid ? couponCode.trim() : undefined,
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to place order");

      if (clearCart) clearCart();
      navigate("/order-success", { state: { order: data } });
    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <>
        <div className="empty-cart-container">
          <h2>Your cart is empty!</h2>
          <button onClick={() => navigate("/shop")} className="btn-go-shop">
            Go to Shop
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const upiConfigured = Boolean(settings?.payment?.upiId || settings?.payment?.upiQrImage);
  const bankConfigured = Boolean(settings?.payment?.bankAccountNumber);

  const upiLink = settings?.payment?.upiId
    ? `upi://pay?pa=${settings.payment.upiId}&pn=${encodeURIComponent(settings.payment.upiDisplayName || "UDHAYA AQUATICS")}&am=${estimatedTotal}&cu=INR`
    : null;

  // Fallback QR, generated from the exact same UPI deep link (pa/pn/am/cu —
  // all from Admin Settings + the live server-priced total, nothing
  // hardcoded). Only used when the admin-uploaded QR is missing or fails to
  // load. Rendered as a plain <img>, so no new dependency and no secrets.
  const upiFallbackQrUrl = upiLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(upiLink)}`
    : null;

  const isMobileDevice = () =>
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || "");

  // Never an <a href="upi://...">: a desktop browser has no handler for that
  // scheme and shows ERR_UNKNOWN_URL_SCHEME. On a phone we attempt the deep
  // link; everywhere else we just tell the customer to scan the QR.
  const handleUpiAppClick = () => {
    if (!upiLink) return;
    if (isMobileDevice()) {
      try {
        window.location.href = upiLink;
      } catch (err) {
        console.error("Could not open UPI app:", err);
        setShowDesktopUpiHint(true);
      }
    } else {
      setShowDesktopUpiHint(true);
    }
  };

  // Clipboard API where available, hidden-textarea execCommand otherwise.
  // Fully try/catch'd so this can never become an uncaught rejection.
  const handleCopyUpiId = async () => {
    const upiId = settings?.payment?.upiId;
    if (!upiId) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(upiId);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = upiId;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!ok) throw new Error("execCommand copy failed");
      }
      setUpiIdCopied(true);
      setTimeout(() => setUpiIdCopied(false), 2000);
    } catch (err) {
      console.error("Could not copy UPI ID:", err);
      setUpiIdCopied(false);
    }
  };

  return (
    <>
      <div className="checkout-page-container">
        <h1 className="checkout-title">Checkout</h1>

        {error && <div className="checkout-error-banner">{error}</div>}

        <div className="checkout-grid">
          <form onSubmit={handlePlaceOrder} className="checkout-form-card">
            <h2>Shipping Details</h2>

            {savedAddresses.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "10px" }}>
                  Select from your saved addresses:
                </p>
                <div className="checkout-saved-addresses-grid">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr._id && !showNewAddressForm;
                    return (
                      <div
                        key={addr._id}
                        className={`checkout-address-card ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSelectSavedAddress(addr)}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={isSelected}
                          onChange={() => handleSelectSavedAddress(addr)}
                        />
                        <div className="checkout-addr-details">
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <strong>{addr.fullName}</strong>
                            <span style={{ fontSize: "11px", fontWeight: "700", background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border-color)", padding: "2px 6px", borderRadius: "4px" }}>
                              {addr.addressType || "Home"}
                            </span>
                          </div>
                          <div>+91 {addr.mobile}</div>
                          <div>{addr.houseFlat}, {addr.streetArea}</div>
                          <div>{addr.city}, {addr.state} - <strong>{addr.pincode}</strong></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="checkout-toggle-new-btn"
                  onClick={() => {
                    setShowNewAddressForm((prev) => !prev);
                    if (!showNewAddressForm) {
                      setSelectedAddressId(null);
                    }
                  }}
                >
                  {showNewAddressForm ? "← Use a Saved Address" : "+ Deliver to a Different / New Address"}
                </button>
              </div>
            )}

            {(showNewAddressForm || savedAddresses.length === 0) && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="fullName" value={shipping.fullName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={shipping.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number (For Courier Tracking) *</label>
                    <input type="tel" name="phone" value={shipping.phone} onChange={handleChange} required placeholder="10-digit number" maxLength={10} />
                  </div>
                  <div className="form-group">
                    <label>WhatsApp Number (optional)</label>
                    <input type="tel" name="whatsapp" value={shipping.whatsapp} onChange={handleChange} placeholder="Leave blank to use mobile number" />
                  </div>
                </div>

                <div className="form-group">
                  <label>House / Flat No. & Street Address *</label>
                  <textarea name="address" rows="2" value={shipping.address} onChange={handleChange} required placeholder="Building name, flat number, street name"></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City / Town *</label>
                    <input type="text" name="city" value={shipping.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>District (optional)</label>
                    <input type="text" name="district" value={shipping.district} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>State *</label>
                    <select name="state" value={shipping.state} onChange={handleChange} required>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={shipping.pincode}
                      onChange={handleChange}
                      required
                      maxLength={6}
                      placeholder="6-digit pincode"
                    />
                  </div>
                </div>

                {getValidToken() && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "10px 0 16px" }}>
                    <input
                      type="checkbox"
                      id="saveAddrCheck"
                      checked={saveAddressForFuture}
                      onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <label htmlFor="saveAddrCheck" style={{ margin: 0, fontSize: "13.5px", color: "var(--text-secondary)", cursor: "pointer" }}>
                      Save this address to My Addresses for future orders
                    </label>
                  </div>
                )}
              </>
            )}

            {checkingDelivery && (
              <p style={{ fontSize: "13px", color: "#64748b" }}>Checking delivery charge…</p>
            )}
            {!checkingDelivery && delivery.charge !== null && delivery.isServiceable && (
              <p style={{ fontSize: "13px", color: "#16a34a", fontWeight: "600" }}>
                ✅ Delivery available — ₹{delivery.charge} to this location
              </p>
            )}
            {!checkingDelivery && !delivery.isServiceable && shipping.pincode.length === 6 && (
              <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: "600" }}>
                ❌ {delivery.message || "Delivery not available for this location"}
              </p>
            )}

            <h2 style={{ marginTop: "20px" }}>Select Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option-label ${paymentMethod === "UPI" ? "selected" : ""}`} style={!upiConfigured ? { opacity: 0.5, cursor: "not-allowed" } : {}}>
                <input type="radio" name="paymentMethod" value="UPI" checked={paymentMethod === "UPI"} disabled={!upiConfigured} onChange={(e) => setPaymentMethod(e.target.value)} />
                <div>
                  <span className="payment-text">UPI Payment</span>
                  <span className="payment-subtext">
                    {upiConfigured ? "Pay via GPay / PhonePe / Paytm, then submit your UTR" : "Currently unavailable"}
                  </span>
                </div>
              </label>

              <label className={`payment-option-label ${paymentMethod === "BankTransfer" ? "selected" : ""}`} style={!bankConfigured ? { opacity: 0.5, cursor: "not-allowed" } : {}}>
                <input type="radio" name="paymentMethod" value="BankTransfer" checked={paymentMethod === "BankTransfer"} disabled={!bankConfigured} onChange={(e) => setPaymentMethod(e.target.value)} />
                <div>
                  <span className="payment-text">Bank Transfer</span>
                  <span className="payment-subtext">
                    {bankConfigured ? "Transfer to our bank account, then submit your UTR" : "Currently unavailable"}
                  </span>
                </div>
              </label>

              <label className={`payment-option-label ${paymentMethod === "Razorpay" ? "selected" : ""}`} style={!settings?.payment?.razorpayEnabled ? { opacity: 0.5, cursor: "not-allowed" } : {}}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === "Razorpay"}
                  disabled={!settings?.payment?.razorpayEnabled}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <span className="payment-text">Card / UPI / Netbanking (Razorpay)</span>
                  <span className="payment-subtext">
                    {settings?.payment?.razorpayEnabled ? "Instant, automatically verified" : "Temporarily unavailable — please use UPI or Bank Transfer"}
                  </span>
                </div>
              </label>
            </div>

            {paymentMethod === "UPI" && (
              <div className="upi-box">
                {upiConfigured ? (
                  <>
                    <p className="upi-title">Step 1: Pay ₹{estimatedTotal} using UPI</p>
                    {settings?.payment?.upiId && (
                      <>
                        <p className="upi-id-display">UPI ID: {settings.payment.upiId}</p>
                        <div className="upi-btn-wrapper">
                          <button type="button" className="upi-copy-btn" onClick={handleCopyUpiId}>
                            {upiIdCopied ? "✓ Copied!" : "Copy UPI ID"}
                          </button>
                        </div>
                      </>
                    )}

                    {/* Admin-uploaded QR when it actually loads; otherwise a QR
                        generated from the UPI ID + current amount. */}
                    {settings?.payment?.upiQrImage && !qrImageFailed ? (
                      <img
                        src={settings.payment.upiQrImage}
                        alt="UPI QR code"
                        className="upi-qr-image"
                        onError={() => setQrImageFailed(true)}
                      />
                    ) : upiFallbackQrUrl ? (
                      <img src={upiFallbackQrUrl} alt={`UPI QR code for ₹${estimatedTotal}`} className="upi-qr-image" />
                    ) : null}
                    {(settings?.payment?.upiQrImage || upiFallbackQrUrl) && (
                      <p className="upi-qr-caption">Scan this QR using GPay / PhonePe / Paytm / BHIM</p>
                    )}

                    {upiLink && (
                      <div className="upi-btn-wrapper">
                        <button type="button" className="upi-pay-btn" onClick={handleUpiAppClick}>
                          Pay ₹{estimatedTotal} via UPI App
                        </button>
                        {showDesktopUpiHint && (
                          <p className="upi-desktop-hint" role="status">
                            Please scan the QR code using GPay, PhonePe, Paytm or another UPI app.
                          </p>
                        )}
                      </div>
                    )}
                    <p style={{ fontSize: "13px", color: "#64748b", marginTop: "10px" }}>
                      Step 2: After paying, enter the UPI transaction/reference number shown in your
                      payment app below, then upload a screenshot and place your order.
                    </p>
                  </>
                ) : (
                  // Root cause of the reported "UPI ID not configured yet" +
                  // still-demanded transaction ID dead end: this method used
                  // to render its instructions box (and the required UTR
                  // field below) unconditionally, even with nothing
                  // configured in Settings. The radio above is now disabled
                  // in that case too, so this branch is now a fallback
                  // rather than the default experience.
                  <p style={{ color: "#b91c1c", fontWeight: 600 }}>
                    UPI payment is currently unavailable. Please choose another payment method.
                  </p>
                )}
              </div>
            )}

            {paymentMethod === "BankTransfer" && (
              <div className="upi-box">
                {bankConfigured ? (
                  <>
                    <p className="upi-title">Bank Transfer Details:</p>
                    <p>Account Name: {settings?.payment?.bankAccountName || "—"}</p>
                    <p>Account Number: {settings?.payment?.bankAccountNumber}</p>
                    <p>IFSC: {settings?.payment?.bankIfsc || "—"}</p>
                    <p>Bank: {settings?.payment?.bankName || "—"}</p>
                  </>
                ) : (
                  <p style={{ color: "#b91c1c", fontWeight: 600 }}>
                    Bank transfer is currently unavailable. Please choose another payment method.
                  </p>
                )}
              </div>
            )}

            {((paymentMethod === "UPI" && upiConfigured) || (paymentMethod === "BankTransfer" && bankConfigured)) && (
              <>
                <div className="form-group" style={{ marginTop: "15px" }}>
                  <label>Enter UPI Transaction / Reference Number (UTR)</label>
                  <input
                    type="text"
                    placeholder="e.g. 4152xxxxxxxx"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    required
                  />
                  <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                    Enter the UPI transaction/reference number shown after successful payment.
                  </p>
                </div>

                <div className="form-group">
                  <label>Upload Payment Screenshot (required for verification) <span style={{ color: "#dc2626" }}>*</span></label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleScreenshotUpload(e.target.files[0])}
                  />
                  {uploadingScreenshot && <p style={{ fontSize: "13px" }}>Uploading…</p>}
                  {screenshotPublicId && (
                    <p style={{ fontSize: "13px", color: "#16a34a" }}>
                      ✅ Screenshot attached {screenshotFile?.name ? `(${screenshotFile.name})` : ""}
                    </p>
                  )}
                </div>

                <p style={{ fontSize: "13px", color: "#64748b", marginTop: "10px" }}>
                  Your order will show as <strong>Pending Verification</strong> until we confirm your
                  payment. You'll be notified once it's approved.
                </p>
              </>
            )}

            {paymentMethod === "Razorpay" && (
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "10px" }}>
                You'll be redirected to a secure payment window. Your order is confirmed automatically
                once payment succeeds — no UTR needed.
              </p>
            )}

            <div style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "14px 0", lineHeight: "1.5" }}>
              By placing this order, you agree to UDHAYA AQUATICS&apos;s{" "}
              <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="checkout-legal-link">Terms &amp; Conditions</a>,{" "}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="checkout-legal-link">Privacy Policy</a>,{" "}
              <a href="/shipping-policy" target="_blank" rel="noopener noreferrer" className="checkout-legal-link">Shipping Policy</a>, and{" "}
              <a href="/refund-policy" target="_blank" rel="noopener noreferrer" className="checkout-legal-link">Return &amp; Refund Policy</a>.
            </div>

            <button type="submit" disabled={loading || uploadingScreenshot} className="place-order-btn">
              {loading ? "Processing..." : paymentMethod === "Razorpay" ? "Pay Now" : "Place Order"}
            </button>
          </form>

          <div className="order-summary-card">
            <h2>Order Summary</h2>

            <div className="summary-items-list">
              {cart.map((item, index) => (
                <div key={index} className="summary-item-row">
                  <span>{item.name} x {item.quantity || item.qty || 1}</span>
                  <span className="item-price">₹{(item.discountPrice ?? item.price) * (item.quantity || item.qty || 1)}</span>
                </div>
              ))}
            </div>

            <div className="summary-total-row" style={{ fontWeight: "400" }}>
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>

            <div style={{ margin: "14px 0" }}>
              {!couponResult?.valid ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Have a coupon code?"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--text-primary)", borderRadius: "6px", fontSize: "13px" }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode.trim()}
                    style={{ padding: "8px 14px", background: "var(--primary)", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}
                  >
                    {applyingCoupon ? "..." : "Apply"}
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "8px 12px", borderRadius: "6px" }}>
                  <span style={{ color: "#166534", fontWeight: "600", fontSize: "13px" }}>✅ {couponCode} applied</span>
                  <button type="button" onClick={handleRemoveCoupon} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                    Remove
                  </button>
                </div>
              )}
              {couponResult && !couponResult.valid && (
                <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "6px" }}>{couponResult.message}</p>
              )}
            </div>

            {couponDiscount > 0 && (
              <div className="summary-total-row" style={{ fontWeight: "400", color: "#16a34a" }}>
                <span>Coupon Discount:</span>
                <span>-₹{couponDiscount}</span>
              </div>
            )}
            <div className="summary-total-row" style={{ fontWeight: "400" }}>
              <span>Delivery:</span>
              <span>{isFreeDelivery ? "FREE" : delivery.charge !== null ? `₹${delivery.charge}` : "Enter address to calculate"}</span>
            </div>
            {gstRate > 0 && (
              <div className="summary-total-row" style={{ fontWeight: "400" }}>
                <span>GST ({gstRate}%):</span>
                <span>₹{gstAmount}</span>
              </div>
            )}
            <div className="summary-total-row">
              <span>Total to Pay:</span>
              <span className="total-amount-val">₹{estimatedTotal}</span>
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
              Final amount is confirmed by our server when you place the order.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Checkout;

