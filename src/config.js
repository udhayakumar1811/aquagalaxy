export const API_URL = "https://aquagalaxy-backend.onrender.com";

// Helper function to dynamically build full image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/500";
  
  // Oru velai absolute URL-a irundha (e.g. Unsplash URL) direct-a return pannum
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  // Relative path (uploads/filename.jpg) ah irundha Render URL append pannum
  return `${API_URL}/${imagePath.replace(/^\//, "")}`;
};