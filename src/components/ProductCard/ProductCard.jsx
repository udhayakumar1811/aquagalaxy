import "./ProductCard.css";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";

function ProductCard() {
  return (
    <section className="products">
      <div className="container">

        <div className="product-card">

          <div className="product-image">
            <img
              src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=500"
              alt="Fish"
            />
          </div>

          <div className="product-content">

            <h3>Betta Fish</h3>

            <div className="rating">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <h4>₹499</h4>

            <div className="product-icons">
              <button>
                <FaHeart />
              </button>

              <button>
                <FaShoppingCart />
              </button>
            </div>

          </div>

        </div>

        <div className="product-card">

          <div className="product-image">
            <img
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500"
              alt="Fish"
            />
          </div>

          <div className="product-content">

            <h3>Guppy Fish</h3>

            <div className="rating">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <h4>₹299</h4>

            <div className="product-icons">
              <button>
                <FaHeart />
              </button>

              <button>
                <FaShoppingCart />
              </button>
            </div>

          </div>

        </div>

        <div className="product-card">

          <div className="product-image">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500"
              alt="Tank"
            />
          </div>

          <div className="product-content">

            <h3>Glass Tank</h3>

            <div className="rating">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <h4>₹1,999</h4>

            <div className="product-icons">
              <button>
                <FaHeart />
              </button>

              <button>
                <FaShoppingCart />
              </button>
            </div>

          </div>

        </div>

        <div className="product-card">

          <div className="product-image">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500"
              alt="Food"
            />
          </div>

          <div className="product-content">

            <h3>Fish Food</h3>

            <div className="rating">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <h4>₹249</h4>

            <div className="product-icons">
              <button>
                <FaHeart />
              </button>

              <button>
                <FaShoppingCart />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ProductCard;