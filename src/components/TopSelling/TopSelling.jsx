import { useState } from "react";
import "./TopSelling.css";
import { FaHeart, FaShoppingCart, FaStar, FaSearch } from "react-icons/fa";

// 1. IMPORT YOUR LOCAL IMAGES FIRST
import catFish from "../../assets/images/cat-fish.jpg";
import catFood from "../../assets/images/cat-food.jpg";
import catAquariums from "../../assets/images/cat-aquariums.jpg";
import catPlants from "../../assets/images/cat-plants.jpg";
import catAccessories from "../../assets/images/cat-accessories.jpg";

// 2. ASSIGN THE IMPORTED VARIABLES TO YOUR PRODUCTS ARRAY
const products = [
  { id: 1, name: "Goldfish", price: "$89.00", image: catFish },
  { id: 2, name: "guppy", price: "$89.00", image: catFood },
  { id: 3, name: "Tank", price: "$89.00", image: catFood },
  { id: 4, name: "Plant", price: "$89.00", image: catAquariums },
  { id: 5, name: "Betta", price: "$89.00", image: catPlants },
  { id: 6, name: "Farm Food", price: "$89.00", image: catAccessories }
  
];

function TopSelling() {
  const [activeTab, setActiveTab] = useState("Aquariums");
  const tabs = ["All", "Aquariums", "Aquarium Fish", "Fish Food"];

  return (
    <section className="top-selling">
      
      <div className="section-title-wrap">
        <span className="title-bg">Top Products</span>
        <h2 className="title-main">Top Selling Products</h2>

        <ul className="tabs">
          {tabs.map((tab) => (
            <li 
              key={tab} 
              className={activeTab === tab ? "active" : ""} 
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      <div className="container">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            
            <div className="product-img-box">
              <img src={item.image} alt={item.name} />
            </div>

            <div className="product-details-row">
              <div className="details-left">
                <h3>{item.name}</h3>
                <h4 className="price">{item.price}</h4>
                <div className="stars">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
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

      <div className="see-more-wrap">
        <button className="see-more-btn">See More &rarr;</button>
      </div>

    </section>
  );
}

export default TopSelling;