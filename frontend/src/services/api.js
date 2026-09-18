// =============================================================================
// CampusCart API Client with Live MongoDB & Offline Fallback Architecture
// =============================================================================
import { CAMPUS_DATA } from "../data/mockData";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Fetch products from live MongoDB backend with fallback to mock data
 */
export async function fetchProductsFromBackend() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout for graceful fallback
    const res = await fetch(`${API_BASE_URL}/api/v1/products`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return { success: true, products: data, source: "mongodb" };
    }
    return { success: false, products: CAMPUS_DATA.products, source: "mock-fallback" };
  } catch (err) {
    console.warn("MongoDB backend sleeping or unreachable. Using mock data safety fallback:", err.message);
    return { success: false, products: CAMPUS_DATA.products, source: "mock-fallback" };
  }
}

/**
 * Check live backend & MongoDB health status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/health/mongodb`);
    if (!res.ok) return { connected: false };
    return await res.json();
  } catch {
    return { connected: false };
  }
}

/**
 * Create a new product in MongoDB
 */
export async function createProductOnBackend(productData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Could not save to remote MongoDB:", err.message);
    return null;
  }
}

/**
 * Update an existing product in MongoDB
 */
export async function updateProductOnBackend(productId, updateData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Could not update remote MongoDB:", err.message);
    return null;
  }
}

/**
 * Delete a product from MongoDB
 */
export async function deleteProductOnBackend(productId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Could not delete from remote MongoDB:", err.message);
    return null;
  }
}
