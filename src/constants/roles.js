// Any of these roles has at least SOME admin-dashboard access — which
// specific tabs they can use is enforced by the backend's RBAC permissions
// (middleware/rbac.js) and mirrored in Dashboard.jsx's sidebar.
export const ADMIN_TIER_ROLES = [
  "admin",
  "superadmin",
  "order_manager",
  "product_manager",
  "support_manager",
  "content_manager",
];
