import React from "react";
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
import MyProfile from "./pages/Profile/MyProfile";
import Dashboard from "./pages/Admin/Dashboard";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Search from "./pages/Search/Search";
import Wishlist from "./pages/Wishlist/Wishlist";
import NotFound from "./pages/NotFound/NotFound";

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
        <Route path="/profile" element={<ProtectedRoute> <MyProfile /> </ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly> <Dashboard /> </ProtectedRoute> } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
