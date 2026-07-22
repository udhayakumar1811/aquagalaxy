import React from "react";
import { Routes, Route } from "react-router-dom";

// PAGES IMPORT
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/shop";
import Product from "./pages/Product/Product";

function App() {
  return (
    // REMOVED <Router> wrappers from here since it's already in main.jsx
    <Routes>
      {/* Home Page route */}
      <Route path="/" element={<Home />} />
      
      {/* Shop List Page route */}
      <Route path="/shop" element={<Shop />} />
      
      {/* Dynamic Route configuration for single product details page */}
      <Route path="/shop/:id" element={<Product />} />
    </Routes>
  );
}

export default App;