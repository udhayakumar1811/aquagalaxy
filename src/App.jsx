import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/shop";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Auth/Login";   // 👈 Import Login
import Signup from "./pages/Auth/Signup"; // 👈 Import Signup

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />   {/* 👈 Auth Route */}
      <Route path="/signup" element={<Signup />} /> {/* 👈 Auth Route */}
    </Routes>
  );
}

export default App;