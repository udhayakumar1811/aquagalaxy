import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess"; // 👈 Added Order Success page import
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import MyProfile from "./pages/Profile/MyProfile";
import Dashboard from "./pages/Admin/Dashboard";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Search from "./pages/Search/Search";
import Wishlist from "./pages/Wishlist/Wishlist";
import NotFound from "./pages/NotFound/NotFound";
import PrivacyPolicy from "./pages/Policies/PrivacyPolicy";
import TermsConditions from "./pages/Policies/TermsConditions";
import ShippingPolicy from "./pages/Policies/ShippingPolicy";
import RefundPolicy from "./pages/Policies/RefundPolicy";
import CancellationPolicy from "./pages/Policies/CancellationPolicy";
import PaymentPolicy from "./pages/Policies/PaymentPolicy";

function App() {
  return (
    <>
      {/* Global Navbar */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />{" "}
        {/* 👈 Added Order Success Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<ProtectedRoute> <MyProfile /> </ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly> <Dashboard /> </ProtectedRoute> } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/payment-policy" element={<PaymentPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
