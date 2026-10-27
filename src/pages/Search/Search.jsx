import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { API_URL, getImageUrl } from "../../config";
import { FaSearch } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state with query changes
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/products?limit=200`)
      .then((res) => res.json())
      .then((data) => {
        const productList = Array.isArray(data) ? data : data.products || [];
        
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
          Search Products
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto mb-10">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
          <input
            type="text"
            placeholder="Search for fish, tanks, plants, accessories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400"
          />
        </form>

        {query && (
          <h2 className="text-base sm:text-lg font-bold text-slate-600 dark:text-slate-400 mb-8">
            Search Results for &ldquo;{query}&rdquo;
          </h2>
        )}
        
        {loading ? (
          <p className="text-center py-12 text-slate-500 dark:text-slate-400">Searching...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
            {products.map((p) => {
              const hasDiscount = p.discountPrice != null && p.discountPrice < p.price;
              const itemId = p._id || p.id;
              return (
                <Link
                  to={`/shop/${itemId}`}
                  key={itemId}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 mb-3 flex items-center justify-center">
                    <img 
                      src={getImageUrl(p.image)} 
                      alt={p.name} 
                      loading="lazy" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col flex-grow justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-500 line-clamp-1 mb-1.5 transition-colors" title={p.name}>
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {hasDiscount ? (
                        <>
                          <span className="text-base font-extrabold text-[#ff4d2d]">₹{p.discountPrice}</span>
                          <span className="text-xs line-through text-slate-400">₹{p.price}</span>
                        </>
                      ) : (
                        <span className="text-base font-extrabold text-[#ff4d2d]">₹{p.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-12 text-slate-500 dark:text-slate-400">No products found matching &ldquo;{query}&rdquo;.</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Search;

