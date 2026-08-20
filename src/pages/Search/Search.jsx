import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { API_URL, getImageUrl } from "../../config";
import "./Search.css";
import { FaSearch } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL query மாறியதும் local state-ஐ அப்டேட் செய்ய
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const productList = Array.isArray(data) ? data : [];
        
        const filtered = productList.filter((p) => {
          const searchQuery = query.toLowerCase();
          const nameMatch = p.name?.toLowerCase().includes(searchQuery);
          const descMatch = p.desc?.toLowerCase().includes(searchQuery);
          
          const categoryName = typeof p.category_id === "object" 
            ? p.category_id?.name?.toLowerCase() 
            : "";
          const categoryMatch = categoryName.includes(searchQuery);

          return nameMatch || descMatch || categoryMatch;
        });

        setProducts(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setLoading(false);
      });
  }, [query]);

  // சர்ச் ஃபார்ம் சப்மிட் செய்யும்போது
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
    <div className="search-page">
      <h1>Search Products</h1>

      {/* 👈 Added Search Bar Box here */}
      <form onSubmit={handleSearchSubmit} className="search-bar-form" style={{ marginBottom: "35px" }}>
        <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}>
          <FaSearch style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input
            type="text"
            placeholder="Search for fishes, tanks, accessories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 20px 12px 45px",
              borderRadius: "8px",
              border: "1px solid #0284c7",
              fontSize: "16px",
              outline: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              boxSizing: "border-box"
            }}
          />
        </div>
      </form>

      <h2>Search Results for "{query}"</h2>
      
      {loading ? (
        <p>Searching...</p>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((p) => (
            <Link
              to={`/shop/${p._id || p.id}`}
              key={p._id || p.id}
              className="product-card"
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div className="card-img-wrap">
                <img src={getImageUrl(p.image)} alt={p.name} loading="lazy" />
              </div>
              <div style={{ padding: "15px", textAlign: "left" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "5px" }}>{p.name}</h3>
                <p style={{ fontSize: "18px", fontWeight: "800", color: "#ff6b00" }}>₹{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No products found matching "{query}".</p>
      )}
    </div>
    <Footer />
    </>
  );
}

export default Search;