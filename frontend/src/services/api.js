// CampusCart API client.
// MongoDB/FastAPI backend is the only persistent source of truth.

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// Token helpers — stored in localStorage so session survives page refresh
export function getStoredToken() {
  try { return localStorage.getItem("campuscart_token") || null; } catch { return null; }
}
export function setStoredToken(token) {
  try { if (token) localStorage.setItem("campuscart_token", token); else localStorage.removeItem("campuscart_token"); } catch {}
}

async function request(path, options = {}) {
  const token = getStoredToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    // Do NOT use credentials:"include" — it forces CORS preflight which Render blocks.
    // Instead send token in Authorization header (simple CORS request).
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = {
      detail: text,
    };
  }

  if (!res.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `HTTP ${res.status}`;

    const error = new Error(message);
    error.status = res.status;

    throw error;
  }

  return data;
}

/* =========================================================================
   HEALTH
   ========================================================================= */

export async function checkBackendHealth() {
  try {
    return await request("/api/v1/health/mongodb", {
      method: "GET",
    });
  } catch {
    return {
      connected: false,
      status: "offline",
    };
  }
}

/* =========================================================================
   AUTH
   ========================================================================= */

export async function getCurrentUser() {
  try {
    const data = await request("/api/v1/auth/me");

    const user = data?.user || data;

    const normalizedUser = {
      ...user,

      id:
        user?.id ||
        user?._id ||
        user?.userId ||
        user?.sub ||
        null,
    };

    return {
      success: true,
      user: normalizedUser,
    };
  } catch (error) {
    if (error.status === 401) {
      return {
        success: false,
        user: null,
      };
    }

    return {
      success: false,
      user: null,
      error: error.message,
    };
  }
}

export async function loginUser(email, password) {
  try {
    const data = await request("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // Save token to localStorage so all future requests are authenticated
    if (data?.token) {
      setStoredToken(data.token);
    }

    const user = data?.user || data;

    const normalizedUser = {
      ...user,
      id:
        user?.id ||
        user?._id ||
        user?.userId ||
        user?.sub ||
        null,
    };

    return {
      success: true,
      ...data,
      user: normalizedUser,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function logoutUser() {
  // Clear stored token immediately
  setStoredToken(null);
  try {
    const data = await request("/api/v1/auth/logout", {
      method: "POST",
    });

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function registerUser({ email, password, name, roll, department, campus }) {
  try {
    const data = await request("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name, roll, department, campus }),
    });

    if (data?.token) {
      setStoredToken(data.token);
    }

    const user = data?.user || data;
    const normalizedUser = {
      ...user,
      id: user?.id || user?._id || user?.userId || user?.sub || null,
    };

    return { success: true, ...data, user: normalizedUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/* =========================================================================
   PRODUCTS
   ========================================================================= */

export async function fetchProductsFromBackend() {
  try {
    const data = await request(
      "/api/v1/products?limit=100&status=all",
      {
        method: "GET",
      }
    );

    const products = Array.isArray(data)
      ? data
      : Array.isArray(data?.products)
        ? data.products
        : [];

    return {
      success: true,
      products,
      source: "mongodb",
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      source: "offline",
      error: error.message,
    };
  }
}

export async function createProductOnBackend(productData) {
  try {
    const payload = {
      title: productData?.title || "Campus Listing",

      category:
        productData?.category || "Notes & Material",

      stream:
        productData?.stream || "engineering",

      price:
        Number(productData?.price) || 0,

      originalPrice:
        productData?.originalPrice !== undefined &&
        productData?.originalPrice !== null &&
        productData?.originalPrice !== ""
          ? Number(productData.originalPrice)
          : null,

      mode:
        productData?.mode || "BUY",

      condition:
        productData?.condition || "Like New",

      stock:
        Math.max(
          0,
          Number(productData?.stock) || 1
        ),

      campus:
        productData?.campus ||
        "Jadavpur University",

      pickupLocation:
        productData?.pickupLocation ||
        "Central Library Foyer",

      image:
        productData?.image ||
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80",

      description:
        productData?.description || "",

      sellerId:
        productData?.sellerId || null,

      seller:
        productData?.seller || null,

      rentalRate:
        productData?.rentalRate || "",

      exchangeWish:
        productData?.exchangeWish || "",
    };

    const data = await request(
      "/api/v1/products",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateProductOnBackend(
  productId,
  updateData
) {
  try {
    const fields = [
      "title",
      "category",
      "stream",
      "price",
      "originalPrice",
      "mode",
      "condition",
      "stock",
      "status",
      "campus",
      "pickupLocation",
      "image",
      "description",
      "rentalRate",
      "exchangeWish",
    ];

    const payload = Object.fromEntries(
      fields
        .filter(
          (key) =>
            updateData?.[key] !== undefined
        )
        .map((key) => [
          key,
          ["price", "originalPrice", "stock"].includes(
            key
          )
            ? Number(updateData[key])
            : updateData[key],
        ])
    );

    const data = await request(
      `/api/v1/products/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deleteProductOnBackend(
  productId
) {
  try {
    const data = await request(
      `/api/v1/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/* =========================================================================
   CART
   ========================================================================= */

export async function fetchCart() {
  try {
    const data = await request("/api/v1/cart", {
      method: "GET",
    });

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      items: [],
      error: error.message,
    };
  }
}

export async function saveCart(items) {
  try {
    const data = await request("/api/v1/cart", {
      method: "PUT",
      body: JSON.stringify({
        items,
      }),
    });

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      items,
      error: error.message,
    };
  }
}

/* =========================================================================
   WISHLIST
   ========================================================================= */

export async function fetchWishlist() {
  try {
    const data = await request(
      "/api/v1/wishlist",
      {
        method: "GET",
      }
    );

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      items: [],
      error: error.message,
    };
  }
}

export async function saveWishlist(items) {
  try {
    const data = await request(
      "/api/v1/wishlist",
      {
        method: "PUT",
        body: JSON.stringify({
          items,
        }),
      }
    );

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      items,
      error: error.message,
    };
  }
}

/* =========================================================================
   ORDERS
   ========================================================================= */

export async function fetchOrders() {
  try {
    const data = await request(
      "/api/v1/orders",
      {
        method: "GET",
      }
    );

    const orders = Array.isArray(data)
      ? data
      : Array.isArray(data?.orders)
        ? data.orders
        : [];

    return {
      success: true,
      orders,
    };
  } catch (error) {
    return {
      success: false,
      orders: [],
      error: error.message,
    };
  }
}

export async function checkoutOnBackend(items) {
  try {
    const data = await request(
      "/api/v1/orders/checkout",
      {
        method: "POST",
        body: JSON.stringify({
          items,
        }),
      }
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function cancelOrderOnBackend(
  orderId
) {
  try {
    const data = await request(
      `/api/v1/orders/${orderId}/cancel`,
      {
        method: "POST",
      }
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Authenticate student login with backend & MongoDB Atlas (alias for loginUser)
 */
export async function loginUserOnBackend(email, password = "student123") {
  return loginUser(email, password);
}

/* =========================================================================
   NOTIFICATIONS (SELLER ALERTS)
   ========================================================================= */

export async function fetchNotifications() {
  try {
    const data = await request("/api/v1/notifications");
    return {
      success: true,
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
}

export async function markNotificationRead(notificationId) {
  try {
    const data = await request(`/api/v1/notifications/${notificationId}/read`, {
      method: "PATCH",
    });
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function markAllNotificationsRead() {
  try {
    const data = await request("/api/v1/notifications/read-all", {
      method: "POST",
    });
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/* =========================================================================
   CAMPUSBOT AI CHAT (Google Gemini API with Live Catalog Grounding)
   ========================================================================= */

/**
 * Direct client-side Google Gemini REST API call (useful fallback if backend
 * server is on remote Render without key or during fast frontend testing)
 */
async function callGeminiDirect({ apiKey, message, history = [], campus = "Jadavpur University", userName = "Student", products = [] }) {
  const catalogContext = products.slice(0, 35).map(p => 
    `• ${p.title} [₹${p.price}${p.originalPrice ? ` (Orig: ₹${p.originalPrice})` : ""}] - Mode: ${p.mode || "BUY"} | Cat: ${p.category} | Cond: ${p.condition || "Good"} | Campus: ${p.campus || campus} | Pickup: ${p.pickupLocation || "Campus Hub"}`
  ).join("\n");

  const systemInstruction = `
You are "CampusBot", the helpful and friendly AI peer companion on CampusCart — a collegiate marketplace where students buy, rent, and trade textbooks, notes, lab items, hostel gear, and electronics.

Current Student User: ${userName}
Campus: ${campus}

REAL-TIME INVENTORY (Currently available in the CampusCart catalog):
${catalogContext || "Catalog is loading or empty."}

Instructions:
1. Ground your answers in the REAL INVENTORY above. If the user asks about an item or price, reference exact titles, prices, and locations from this list.
2. If an item is NOT in the inventory, politely explain that no student has posted it yet, and advise them to list a request or check back.
3. Keep answers concise, helpful, and student-friendly with collegiate emojis (📚, 💻, 🎒, ⚡).
4. Explain the QR Handshake Protocol if they ask about safety: buyers only share verification codes after inspecting goods in-person.
`;

  const contents = [];
  if (Array.isArray(history) && history.length > 0) {
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text || h.content || "" }]
      });
    }
  }

  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
      }
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gemini API returned status ${res.status}`);
  }

  const json = await res.json();
  const replyText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!replyText) throw new Error("No response generated by Gemini model.");
  return replyText;
}

/**
 * Ask CampusBot: Primary strategy uses FastAPI (/api/v1/chat) for full backend RAG.
 * If backend key is not configured or offline, falls back to direct Gemini client if VITE_GEMINI_API_KEY is available.
 */
export async function askCampusBot({
  message,
  history = [],
  campus = "Jadavpur University",
  userName = "Student",
  clientProducts = [],
}) {
  const clientKey = import.meta.env.VITE_GEMINI_API_KEY;

  // 1. Try Backend FastAPI Endpoint
  try {
    const data = await request("/api/v1/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        history,
        campus,
        user_name: userName,
      }),
    });

    if (data?.reply) {
      return {
        success: true,
        reply: data.reply,
        source: "backend-rag",
      };
    }
  } catch (backendError) {
    console.warn("Backend chat endpoint issue:", backendError.message);

    // 2. If clientKey is available in frontend (.env), fallback gracefully
    if (clientKey) {
      try {
        const directReply = await callGeminiDirect({
          apiKey: clientKey,
          message,
          history,
          campus,
          userName,
          products: clientProducts,
        });
        return {
          success: true,
          reply: directReply,
          source: "client-gemini",
        };
      } catch (directErr) {
        console.error("Direct Gemini call failed:", directErr);
      }
    }

    // 3. Informative fallback with clear guide
    const isKeyError = backendError.message?.includes("GEMINI_API_KEY") || backendError.status === 503;
    if (isKeyError) {
      return {
        success: false,
        keyMissing: true,
        reply: "🔑 **Gemini API Key Required**:\n\nTo activate real-time AI responses, please add your Google Gemini API key to either:\n• `backend/.env` as `GEMINI_API_KEY=your_key_here`, OR\n• `frontend/.env` as `VITE_GEMINI_API_KEY=your_key_here`\n\nGet a free key in 30 seconds at [Google AI Studio](https://aistudio.google.com/app/apikey)! 🤖",
      };
    }

    // If backend is completely offline and no frontend key
    return {
      success: false,
      reply: `🤖 I'm currently unable to reach the campus AI server (${backendError.message}). Please ensure your backend is running or set \`VITE_GEMINI_API_KEY\` in \`frontend/.env\`!`,
    };
  }
}
