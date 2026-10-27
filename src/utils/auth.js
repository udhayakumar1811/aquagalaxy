/**
 * Frontend Authentication Utilities
 * Handles token storage, JWT expiration checking, session cleanup, and auth headers.
 */

const TOKEN_KEY = "token";
const USER_KEY = "user";

/**
 * Safely parse a JWT's payload without external libraries.
 * @param {string} token
 * @returns {object|null}
 */
export function parseJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check if a token is expired (includes a 10s clock skew buffer).
 * @param {string} token
 * @returns {boolean}
 */
export function isTokenExpired(token) {
  if (!token || typeof token !== "string") return true;
  if (token === "null" || token === "undefined" || token.trim() === "") return true;

  const payload = parseJwtPayload(token);
  if (!payload) return true; // malformed token is considered expired/invalid

  // If payload does not contain an exp claim, treat as valid if signed
  if (!payload.exp) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  // 10s buffer for network latency and clock skew
  return payload.exp <= currentTime + 10;
}

/**
 * Clear authentication session and notify the application.
 * @param {boolean} redirect - Whether to navigate to login page
 * @param {string} reason - Optional message/reason
 */
export function clearAuthSession(redirect = false, reason = "") {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.error("Error clearing auth session:", err);
  }

  // Notify components (e.g. Navbar) that auth changed
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-changed"));
    if (redirect) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        const query = reason ? `?sessionExpired=1&msg=${encodeURIComponent(reason)}` : "?sessionExpired=1";
        window.location.href = `/login${query}`;
      }
    }
  }
}

/**
 * Get valid token from localStorage.
 * If token is missing, null-string, or expired, clears session and returns null.
 * @returns {string|null}
 */
export function getValidToken() {
  if (typeof window === "undefined") return null;
  const rawToken = localStorage.getItem(TOKEN_KEY);
  if (!rawToken || rawToken === "null" || rawToken === "undefined" || rawToken.trim() === "") {
    return null;
  }

  if (isTokenExpired(rawToken)) {
    console.warn("Auth token is expired. Clearing session.");
    clearAuthSession(false);
    return null;
  }

  return rawToken.trim();
}

/**
 * Get current authenticated user object.
 * Returns null if user is not logged in or token is expired.
 * @returns {object|null}
 */
export function getAuthUser() {
  const token = getValidToken();
  if (!token) {
    return null;
  }

  try {
    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) return null;
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

/**
 * Construct authorization headers cleanly.
 * Never produces "Bearer null" or "Bearer undefined".
 * @param {object} customHeaders - Optional existing headers
 * @returns {object}
 */
export function getAuthHeaders(customHeaders = {}) {
  const token = getValidToken();
  if (token) {
    return {
      ...customHeaders,
      Authorization: `Bearer ${token}`,
    };
  }
  return { ...customHeaders };
}
