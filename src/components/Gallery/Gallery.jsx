import React, { useState, useEffect } from "react";
import { API_URL, getImageUrl } from "../../config";
import "./Gallery.css";
import { FaPlus, FaTimes } from "react-icons/fa";

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null); // Modal Popup State

  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then((res) => res.json())
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
        console.error("Error fetching gallery items:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="gallery">
      <div className="section-title-wrap">
        <span className="title-bg">Project Gallery</span>
        <h2 className="title-main">Project Gallery</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>Loading Gallery...</div>
      ) : galleryItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No gallery items found.</div>
      ) : (
        <div className="gallery-container">
          {galleryItems.slice(0, 6).map((item) => (
            <div 
              className={`gallery-card ${item.isLarge ? "large-card" : ""}`} 
              key={item.id}
            >
              <div className="image-box">
                <img src={getImageUrl(item.image)} alt={item.name} />
              </div>
              
              <div className="gallery-overlay-content">
                <h3>{item.name}</h3>
                <span>{item.category}</span>
                <button 
                  className="plus-btn" 
                  onClick={() => setSelectedProject(item)} 
                  aria-label="View Project Details"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL DETAILS MODAL POP-UP */}
      {selectedProject && (
        <div className="gallery-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="gallery-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProject(null)}>
              <FaTimes />
            </button>
            <div className="modal-img-box">
              <img src={getImageUrl(selectedProject.image)} alt={selectedProject.name} />
            </div>
            <div className="modal-info-box">
              <span className="modal-cat">{selectedProject.category}</span>
              <h2>{selectedProject.name}</h2>
              <p>{selectedProject.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;