import { Navigate } from "react-router-dom";
import { ADMIN_TIER_ROLES } from "../../constants/roles";
import { getValidToken, getAuthUser } from "../../utils/auth";

/**
 * Wrap a route element with this to require login (and optionally an admin-tier role).
 *
 * Usage:
 *   <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
 *   <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
 */
function ProtectedRoute({ children, adminOnly = false }) {
  const token = getValidToken();
  const user = getAuthUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !ADMIN_TIER_ROLES.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
