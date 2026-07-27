// Base API URL Config 🚀
export const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://aquagalaxy-backend.onrender.com";

// Helper function to handle image URLs safely
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/150";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${API_URL}/${imagePath.replace(/^\/+/, "")}`;
};