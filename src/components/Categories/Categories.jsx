import "./Categories.css";
import catImg1 from "../../assets/images/cat-aquariums.jpg"; 
import catImg2 from "../../assets/images/cat-fish.jpg";
import catImg3 from "../../assets/images/cat-food.jpg";
import catImg4 from "../../assets/images/cat-plants.jpg"; 
import catImg5 from "../../assets/images/cat-accessories.jpg"; 

function Categories() {
  return (
    <section className="categories">
      <div className="section-title-wrap">
        <span className="title-bg">Categories</span>
        <h2 className="title-main">Categories</h2>
      </div>

      <div className="container">
        
        {/* Card 1 */}
        <div className="category-card">
          <div className="card-header-text">
            <h3>Aquariums</h3>
            <span className="item-count">40 Items</span>
          </div>
          <div className="category-img-wrapper">
            <img src={catImg1} alt="Aquariums" />
          </div>
          <button className="category-btn">
            <span className="btn-text">Shop Now </span>→
          </button>
        </div>

        {/* Card 2 */}
        <div className="category-card">
          <div className="card-header-text">
            <h3>Aquarium Fish</h3>
            <span className="item-count">90 Items</span>
          </div>
          <div className="category-img-wrapper">
            <img src={catImg2} alt="Aquarium Fish" />
          </div>
          <button className="category-btn">
            <span className="btn-text">Shop Now </span>→
          </button>
        </div>

        {/* Card 3 */}
        <div className="category-card">
          <div className="card-header-text">
            <h3>Fish Food</h3>
            <span className="item-count">60 Items</span>
          </div>
          <div className="category-img-wrapper">
            <img src={catImg3} alt="Fish Food" />
          </div>
          <button className="category-btn">
            <span className="btn-text">Shop Now </span>→
          </button>
        </div>

        {/* Card 4 */}
        <div className="category-card">
          <div className="card-header-text">
            <h3>Aquatic Plants</h3>
            <span className="item-count">35 Items</span>
          </div>
          <div className="category-img-wrapper">
            <img src={catImg4} alt="Aquatic Plants" />
          </div>
          <button className="category-btn">
            <span className="btn-text">Shop Now </span>→
          </button>
        </div>

        {/* Card 5 */}
        <div className="category-card">
          <div className="card-header-text">
            <h3>Accessories</h3>
            <span className="item-count">120 Items</span>
          </div>
          <div className="category-img-wrapper">
            <img src={catImg5} alt="Accessories" />
          </div>
          <button className="category-btn">
            <span className="btn-text">Shop Now </span>→
          </button>
        </div>

      </div>
    </section>
  );
}

export default Categories;