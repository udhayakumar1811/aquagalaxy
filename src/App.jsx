import React from "react";
import { Routes, Route } from "react-router-dom";

// PAGES IMPORT
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/shop";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart"; // 👈 Import Cart Page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} /> {/* 👈 Add Cart Route */}
    </Routes>
  );
}

export default App;