// Vite Environment Check 🚀
export const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://aquagalaxy-backend.onrender.com";