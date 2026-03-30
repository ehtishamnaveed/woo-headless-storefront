import createApiClient from "@ehtisham/headless-api-sdk";

// ─── Configuration ────────────────────────────────────────────────────────────
// Set this to your WordPress site URL (no trailing slash).
// Example: "https://mystore.com" or "https://mystore.com/store"
const SITE_URL = "https://your-wordpress-site.com";

export const siteConfigError =
  !SITE_URL || SITE_URL === "https://your-wordpress-site.com"
    ? "WordPress site URL is not configured. Open src/api.js and set your SITE_URL."
    : null;

const api = SITE_URL ? createApiClient(SITE_URL) : null;

export async function registerCustomer({ username, email, password }) {
  try {
    const res = await fetch(`${SITE_URL}/wp-json/headless/v1/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Registration failed." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export default api;
export { SITE_URL };
