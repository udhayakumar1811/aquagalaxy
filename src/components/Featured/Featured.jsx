import "./Featured.css";
import { FaHeart, FaSearch, FaShoppingCart } from "react-icons/fa";

import img1 from "../../assets/images/cat-fish.jpg"; 
import img2 from "../../assets/images/cat-plants.jpg";
import img3 from "../../assets/images/cat-food.jpg"; 
import img4 from "../../assets/images/cat-aquariums.jpg";
import img5 from "../../assets/images/cat-accessories.jpg";

const products = [
  { id: 1, name: "Yellow Goldfish", price: "$69.00", image: img1 },
  { id: 2, name: "Half Moon Betta Fish", price: "$49.00", image: img2 },
  { id: 3, name: "Light Moon Goldfish", price: "$79.00", image: img3 },
  { id: 4, name: "Red Moon Goldfish", price: "$79.00", image: img4 },
  { id: 5, name: "Yellow Goldfish", price: "$59.00", image: img5 },
  { id: 6, name: "Blue Neon Guppy", price: "$39.00", image: img1 },
  { id: 7, name: "Mini Desktop Tank", price: "$129.00", image: img4 },
  { id: 8, name: "Premium Flake Food", price: "$19.00", image: img3 }
];

function Featured() {
  return (
    <section className="featured">
      <div className="section-title-wrap">
        <span className="title-bg">Featured Products</span>
        <h2 className="title-main">Featured Products</h2>
      </div>

      <div className="featured-grid-container">
        {products.map((item) => (
          <div className="featured-card" key={item.id}>
            
            <div className="card-img-wrap">
              <img src={item.image} alt={item.name} />
            </div>

            <div className="card-details-row">
              <div className="details-left">
                <h3>{item.name}</h3>
                <span className="price">{item.price}</span>
              </div>

              <div className="details-right-actions">
                <button className="action-btn" aria-label="Add to Wishlist"><FaHeart /></button>
                <button className="action-btn" aria-label="Quick View"><FaSearch /></button>
                <button className="action-btn" aria-label="Add to Cart"><FaShoppingCart /></button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}

export default Featured;