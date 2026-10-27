// Base API URL Config 🚀
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://aquagalaxy-backend.onrender.com");

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' font-family='sans-serif' font-size='13' fill='%2394a3b8' text-anchor='middle' dominant-baseline='middle'>UDHAYA AQUATICS</text></svg>";

// Helper function to handle image URLs safely
export const getImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER_IMAGE;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  return `${API_URL}/${imagePath.replace(/^\/+/, "")}`;
};