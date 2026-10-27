import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Seo from "../../components/Seo/Seo";
import { API_URL, getImageUrl } from "../../config";
import { CartContext } from "../../context/CartContext"; 
import { getValidToken } from "../../utils/auth";
import { FaStar } from "react-icons/fa"; 

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useContext(CartContext); 

  // Form States
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewErr, setReviewErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [qty, setQty] = useState(1);
  const [cartMsg, setCartMsg] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const isLoggedIn = !!getValidToken();

  const fetchProductDetails = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      setProduct(data);
      setReviews(data.reviews || []);
      setSelectedImage(data.image);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  // Submit Review to Database via Backend API (requires login)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewErr("");

    if (!comment.trim()) {
      setReviewErr("Please write a comment.");
      return;
    }

    const token = getValidToken();
    if (!token) {
      setReviewErr("Please log in to write a review.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: Number(rating), comment }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviewMsg("✅ Review submitted successfully!");
        setComment("");
        setRating(5);
        fetchProductDetails();
      } else {
        setReviewErr(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewErr("Error submitting review");
    } finally {
      setSubmitting(false);
      setTimeout(() => { setReviewMsg(""); setReviewErr(""); }, 3000);
    }
  };

  if (loading) {
    return (
      <>
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
          <h2 className="text-base font-semibold text-slate-500 dark:text-slate-400">Loading Product...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <div className="py-24 text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">Product Not Found!</h2>
          <Link to="/shop" className="text-sm font-bold text-sky-600 hover:underline">&larr; Back to Shop Page</Link>
        </div>
        <Footer />
      </>
    );
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 5.0;

  return (
    <>
      <Seo
        title={`${product.name} | UDHAYA AQUATICS`}
        description={product.shortDesc || product.desc?.slice(0, 155) || `Buy ${product.name} online at UDHAYA AQUATICS.`}
        canonical={window.location.origin + `/shop/${product.slug || product._id}`}
        image={getImageUrl(product.image)}
        type="product"
        structuredData={{
          "@context": "https://schema.org/",
          "@type": "Product",
          name: product.name,
          image: [getImageUrl(product.image), ...(product.images || []).map((img) => getImageUrl(img))],
          description: product.shortDesc || product.desc || product.name,
          sku: product.sku || product._id,
          brand: { "@type": "Brand", name: "UDHAYA AQUATICS" },
          aggregateRating: reviews.length > 0 ? {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount: reviews.length,
          } : undefined,
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.discountPrice ?? product.price,
            availability: product.qnt > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: window.location.href,
          },
        }}
      />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-16">
          <div className="w-full">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center">
              <img 
                src={getImageUrl(selectedImage || product.image)} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {(product.images?.length > 0 || product.video) && (
              <div className="flex gap-2.5 mt-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedImage(product.image)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    (selectedImage || product.image) === product.image ? "border-sky-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={getImageUrl(product.image)} alt="Main" loading="lazy" className="w-full h-full object-cover" />
                </button>
                {product.images?.map((img, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === img ? "border-sky-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={getImageUrl(img)} alt={`${product.name} ${i + 2}`} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {product.video && (
              <div className="mt-4">
                <video
                  src={getImageUrl(product.video)}
                  poster={product.videoThumbnail ? getImageUrl(product.videoThumbnail) : undefined}
                  controls
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full max-w-md rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  Your browser does not support video playback.
                </video>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-start">
            <span className="inline-block px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider mb-2 w-fit">
              {product.category_id?.name || "Aquarium Collection"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < Math.round(avgRating) ? "#f59e0b" : "#cbd5e1"} size={14} />
                ))}
              </div>
              <span className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                {avgRating} ({reviews.length} reviews)
              </span>
            </div>

            <div className="text-2xl font-extrabold mb-3">
              {product.discountPrice != null && product.discountPrice < product.price ? (
                <div className="flex items-center gap-3">
                  <span className="text-[#ff4d2d]">₹{product.discountPrice}</span>
                  <span className="line-through text-slate-400 text-base font-normal">₹{product.price}</span>
                </div>
              ) : (
                <span className="text-[#ff4d2d]">₹{product.price}</span>
              )}
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-3" />
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {product.desc || "No description available."}
            </p>

            {product.qnt > 0 ? (
              <p className={`text-xs font-semibold mb-4 ${product.qnt <= 5 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                {product.qnt <= 5 ? `⚠️ Only ${product.qnt} left in stock!` : `Available Stock: ${product.qnt} items`}
              </p>
            ) : (
              <p className="text-xs font-bold text-red-500 mb-4">
                ❌ Out of Stock
              </p>
            )}

            {cartMsg && (
              <div className="bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 p-3 rounded-xl border border-sky-200 dark:border-sky-800 text-xs font-semibold mb-4">
                {cartMsg}
              </div>
            )}

            {product.qnt > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Quantity:</label>
                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-bold cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(product.qnt, q + 1))}
                    className="w-9 h-9 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-bold cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={product.qnt <= 0}
              onClick={() => {
                const result = addToCart(product, qty);
                setCartMsg(result.message);
                setTimeout(() => setCartMsg(""), 3000);
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0077b6] hover:bg-sky-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {product.qnt <= 0 ? "Out of Stock" : "Add To Cart"}
            </button>

            <Link to="/shop" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-sky-600 mt-6 transition-colors">
              &larr; Back to Shop Page
            </Link>
          </div>
        </div>

        {/* REVIEWS & RATINGS SECTION */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-10">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
            Customer Reviews ({reviews.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Reviews List */}
            <div>
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-bold text-slate-900 dark:text-white">{rev.name}</strong>
                        <span className="text-[11px] text-slate-400">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={12} color={i < rev.rating ? "#f59e0b" : "#cbd5e1"} />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Write a Review</h3>
              
              {reviewMsg && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-semibold mb-4">
                  {reviewMsg}
                </div>
              )}
              {reviewErr && (
                <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 rounded-xl border border-red-200 dark:border-red-800 text-xs font-semibold mb-4">
                  {reviewErr}
                </div>
              )}

              {!isLoggedIn ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Please <Link to="/login" className="text-sky-600 font-bold hover:underline">log in</Link> to write a review.
                </p>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Rating</label>
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                      <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                      <option value="3">⭐⭐⭐ (3 - Good)</option>
                      <option value="2">⭐⭐ (2 - Fair)</option>
                      <option value="1">⭐ (1 - Poor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Your Comment</label>
                    <textarea 
                      rows="3" 
                      placeholder="Write your experience with this product..."
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)} 
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-y"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#0077b6] hover:bg-sky-600 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </section>
      <Footer />
    </>
  );
}

export default Product;

