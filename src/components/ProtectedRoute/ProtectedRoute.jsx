import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Wrap a route element with this to require login (and optionally an admin role).
 *
 * Usage:
 *   <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
 *   <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
 */
function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
