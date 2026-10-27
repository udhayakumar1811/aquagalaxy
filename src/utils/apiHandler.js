import { clearAuthSession } from "./auth";

/**
 * Safely parse fetch API responses.
 * Prevents "Unexpected token '<', '<!DOCTYPE '... is not valid JSON" errors
 * when a backend route or proxy returns an HTML 404/500 error page.
 *
 * @param {Response} res - Fetch Response object
 * @param {string} endpointName - Human-readable name/endpoint for error reporting
 * @param {object} options - Optional settings { skipAuthRedirect: boolean }
 * @returns {Promise<any>} - Parsed JSON data
 * @throws {Error} - Descriptive error with HTTP status and details without throwing raw HTML parse errors
 */
export async function safeParseResponse(res, endpointName = "API request", options = {}) {
  if (!res) {
    throw new Error(`${endpointName}: No response received from server`);
  }

  const contentType = (res.headers && res.headers.get("content-type")) || "";
  let data;

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch (parseErr) {
      throw new Error(`${endpointName} returned malformed JSON: ${parseErr.message}`, { cause: parseErr });
    }
  } else {
    // Non-JSON response (e.g. HTML 404/500 error page from server or proxy)
    const rawText = await res.text().catch(() => "");
    const cleanText = rawText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const errorSnippet = cleanText ? cleanText.slice(0, 150) : "Non-JSON response";
    throw new Error(
      `${endpointName} failed (HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ""}): ${errorSnippet}`
    );
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `${endpointName} returned status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;

    // If request fails with 401 Unauthorized on an authenticated session,
    // clear the invalid/expired session and redirect to login.
    if (
      res.status === 401 &&
      !options.skipAuthRedirect &&
      typeof window !== "undefined" &&
      localStorage.getItem("token")
    ) {
      clearAuthSession(true, message);
    }

    throw err;
  }

  return data;
}
