import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar"; // 👈 Navbar Import
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/shop";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import MyProfile from "./pages/Profile/MyProfile"; // 👈 Profile Page Import
import Dashboard from "./pages/Admin/Dashboard";

function App() {
  return (
    <>
      {/* 🟢 Navbar visible on all pages */}
      <Navbar /> 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* 🟢 Profile Route Added */}
        <Route path="/profile" element={<MyProfile />} /> 
        
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;