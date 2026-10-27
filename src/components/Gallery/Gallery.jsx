import { useState, useEffect } from "react";
import { API_URL, getImageUrl } from "../../config";
import { safeParseResponse } from "../../utils/apiHandler";
import { FaPlus, FaTimes } from "react-icons/fa";

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then((res) => safeParseResponse(res, "Gallery"))
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        const formattedItems = items.map((item, index) => ({
          id: item._id || item.id,
          name: item.name,
          category: item.category || "Aquarium Setup",
          description: item.description || "Detailed overview of this aquarium project and setup specifications.",
          image: item.image,
          isLarge: index === 0,
        }));
        setGalleryItems(formattedItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching gallery items:", err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 px-4 bg-[#f4f9fd] dark:bg-slate-900/60 w-full text-center">
      <div className="relative text-center mb-10 px-4">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-6xl font-extrabold text-orange-500/5 dark:text-orange-400/5 select-none whitespace-nowrap pointer-events-none">
          Project Gallery
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white relative z-10 m-0">
          Project Gallery
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">Loading Gallery...</div>
      ) : galleryItems.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">No gallery items found.</div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.slice(0, 6).map((item) => (
            <div 
              key={item.id}
              className={`group relative overflow-hidden rounded-xl bg-black aspect-square shadow-md ${
                item.isLarge ? "sm:col-span-2 sm:aspect-[2/1]" : ""
              }`} 
            >
              <img 
                src={getImageUrl(item.image)} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              
              <div className="absolute inset-2.5 bg-slate-950/85 rounded-lg flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 text-white p-4">
                <h3 className="text-base sm:text-lg font-bold mb-1 text-white">{item.name}</h3>
                <span className="text-xs text-sky-400 mb-3">{item.category}</span>
                <button 
                  type="button"
                  className="w-10 h-10 rounded-full bg-[#ff4d2d] hover:bg-orange-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md" 
                  onClick={() => setSelectedProject(item)} 
                  aria-label="View Project Details"
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL DETAILS MODAL POP-UP */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="relative bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer" 
              onClick={() => setSelectedProject(null)}
            >
              <FaTimes className="text-sm" />
            </button>
            <div className="md:w-1/2 aspect-video md:aspect-auto">
              <img 
                src={getImageUrl(selectedProject.image)} 
                alt={selectedProject.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="md:w-1/2 p-6 text-left flex flex-col justify-center">
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
                {selectedProject.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {selectedProject.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;

