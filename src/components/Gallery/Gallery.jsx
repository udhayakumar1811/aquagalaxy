import "./Gallery.css";

// Import your actual local image assets here
import img1 from "../../assets/images/cat-fish.jpg"; 
import img2 from "../../assets/images/cat-plants.jpg";
import img3 from "../../assets/images/cat-food.jpg"; 
import img4 from "../../assets/images/cat-aquariums.jpg";
import img5 from "../../assets/images/cat-accessories.jpg";

const galleryItems = [
  { id: 1, name: "Yellow Gold Fish", category: "Aquarium Fish", image: img1, isLarge: true },
  { id: 2, name: "Spotted Puffer Fish", category: "Aquarium Fish", image: img2, isLarge: false },
  { id: 3, name: "Half Moon Betta", category: "Aquarium Fish", image: img3, isLarge: false },
  { id: 4, name: "Mandarin Dragonet", category: "Aquarium Fish", image: img4, isLarge: false },
  { id: 5, name: "Angelfish Exotic", category: "Aquarium Fish", image: img5, isLarge: false },
];

function Gallery() {
  return (
    <section className="gallery">
      {/* Watermark Section Header */}
      <div className="section-title-wrap">
        <span className="title-bg">Project Gallery</span>
        <h2 className="title-main">Project Gallery</h2>
      </div>

      {/* Mosaic Grid Container */}
      <div className="gallery-container">
        {galleryItems.map((item) => (
          <div 
            className={`gallery-card ${item.isLarge ? "large-card" : ""}`} 
            key={item.id}
          >
            <div className="image-box">
              <img src={item.image} alt={item.name} />
            </div>
            
            {/* Interactive Dark Hover Content Box Overlay */}
            <div className="gallery-overlay-content">
              <h3>{item.name}</h3>
              <span>{item.category}</span>
              <button className="plus-btn" aria-label="View Project">+</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;