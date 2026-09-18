import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import confetti from "canvas-confetti";
import { CAMPUS_DATA } from "./data/mockData";
import VideoShowcase from "./components/VideoShowcase";
import CircularWheelShowcase from "./components/CircularWheelShowcase";
import OverviewGatewayView from "./components/OverviewGatewayView";
import HomrPageIdeaView from "./components/HomrPageIdeaView";
import MarketplaceFullView from "./components/MarketplaceView";
import SellItemView from "./components/SellItemView";
import ServicesSection from "./components/ServicesView";
import CourseSection from "./components/CourseView";
import CartFullView from "./components/CartView";
import WishlistView from "./components/WishListView.jsx";
import OrderHistory from "./components/OrderHistory";
import WestBengalMapModal from "./components/WestBengalMapModal";
import SellerDashboard from "./components/SellerDashboard.jsx";
import {
  fetchProductsFromBackend,
  createProductOnBackend,
  updateProductOnBackend,
  deleteProductOnBackend,
  checkBackendHealth,
} from "./services/api";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return window.localStorage.getItem("campuscart-is-logged-in") === "true";
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = window.localStorage.getItem("campuscart-user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [extraProducts, setExtraProducts] = useState(() => {
    try {
      return JSON.parse(
        window.localStorage.getItem("campuscart-products") || "[]",
      );
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(
        window.localStorage.getItem("campuscart-orders") || "[]",
      );
    } catch {
      return [];
    }
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedCampusHub, setSelectedCampusHub] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [qrModalItem, setQrModalItem] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [localProducts, setLocalProducts] = useState([]);
  const [productToOpen, setProductToOpen] = useState(null);
  const [mongoProducts, setMongoProducts] = useState([]);
  const [dbStatus, setDbStatus] = useState("connecting"); // 'connected', 'offline', 'connecting'

  // Fetch live products from MongoDB Atlas on mount with graceful offline fallback
  useEffect(() => {
    let isMounted = true;
    async function loadMongoDBData() {
      try {
        const health = await checkBackendHealth();
        if (isMounted) {
          setDbStatus(health.connected ? "connected" : "offline");
        }

        const res = await fetchProductsFromBackend();
        if (isMounted && res.success && Array.isArray(res.products) && res.products.length > 0) {
          setMongoProducts(res.products);
          setDbStatus("connected");
        }
      } catch (err) {
        console.warn("MongoDB startup fetch error:", err);
        if (isMounted) setDbStatus("offline");
      }
    }
    loadMongoDBData();
    return () => {
      isMounted = false;
    };
  }, []);

  const [deletedProductIds, setDeletedProductIds] = useState(() => {
    try {
      return JSON.parse(
        window.localStorage.getItem("campuscart-deleted-products") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [inventoryOverrides, setInventoryOverrides] = useState(() => {
    try {
      return JSON.parse(
        window.localStorage.getItem("campuscart-inventory") || "{}"
      );
    } catch {
      return {};
    }
  });

  const [productOverrides, setProductOverrides] = useState(() => {
    try {
      return JSON.parse(
        window.localStorage.getItem("campuscart-product-overrides") || "{}"
      );
    } catch {
      return {};
    }
  });

  const allProducts = useMemo(() => {
    // Prefer real MongoDB Atlas items; fallback to mock data if offline/empty
    const baseProducts = (mongoProducts && mongoProducts.length > 0)
      ? mongoProducts
      : (CAMPUS_DATA?.products || []);

    const combined = [
      ...baseProducts,
      ...(extraProducts || []),
      ...(localProducts || []),
    ];

    // Deduplicate by ID to prevent key collisions
    const uniqueMap = new Map();
    for (const item of combined) {
      if (item && item.id && !uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    }

    return Array.from(uniqueMap.values())
      .filter((product) => !deletedProductIds.includes(product.id))
      .map((product) => ({
        ...product,
        ...(productOverrides[product.id] || {}),
      }));
  }, [
    mongoProducts,
    extraProducts,
    localProducts,
    deletedProductIds,
    productOverrides,
  ]);

  const getProductStock = (product) => {
  const originalStock = Math.max(
    0,
    Number(product?.stock) || 0
  );

  if (
    Object.prototype.hasOwnProperty.call(
      inventoryOverrides,
      product.id
    )
  ) {
    return Math.max(
      0,
      Number(inventoryOverrides[product.id]) || 0
    );
  }

  return originalStock;
};
  useEffect(() => {
    window.localStorage.setItem("campuscart-cart", JSON.stringify(cart));
  }, [cart]);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };
  const addToWishlist = (product) => {
    setWishlistItems((previous) => {
      if (previous.some((item) => item.id === product.id)) {
        return previous;
      }

      return [
        ...previous,
        {
          ...product,
          neededByMe: false,
        },
      ];
    });

    setToastMsg("Item added to your wishlist.");
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((previous) =>
      previous.filter((product) => product.id !== productId),
    );

    setToastMsg("Item removed from your wishlist.");
  };

  const toggleNeededByMe = (productId) => {
    setWishlistItems((previous) =>
      previous.map((product) =>
        product.id === productId
          ? {
              ...product,
              neededByMe: !product.neededByMe,
            }
          : product,
      ),
    );
  };
  const handleLogin = (customEmail) => {
    const email = customEmail || loginEmail || "2024cs1089@campus.edu";
    const roll = email.split("@")[0].toUpperCase();
    const userObj = {
      email: email,
      roll: roll,
      name: roll === "2024CS1089" ? "Aarav Patel" : "Verified Student",
      dept: "Computer Science & Engineering",
      hostel: "Hostel 4, Room 218",
    };
    setIsLoggedIn(true);
    setCurrentUser(userObj);
    try {
      window.localStorage.setItem("campuscart-is-logged-in", "true");
      window.localStorage.setItem("campuscart-user", JSON.stringify(userObj));
    } catch {}
    navigate("/home");
    setIsLoginOpen(false);
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 65, origin: { y: 0.5 } });
    }
    showToast(
      `🎉 Authenticated as ${roll}! Welcome to the CampusCart Main Portal.`,
    );
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    try {
      window.localStorage.removeItem("campuscart-is-logged-in");
      window.localStorage.removeItem("campuscart-user");
    } catch {}
    navigate("/");
    showToast("👋 Signed out. Returned to CampusCart Overview.");
  };

  const navigateTo = (target) => {
    let path = target;
    if (target === "overview") path = "/";
    else if (!target.startsWith("/")) path = `/${target}`;
    if (path === "/course") path = "/courses";

    if (!isLoggedIn && path !== "/") {
      setIsLoginOpen(true);
      showToast(
        "🔒 Please sign in with your college ID (@campus.edu) to access " +
          path.replace("/", "").toUpperCase(),
      );
      return;
    }
    navigate(path);
    setNavMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product, requestedQuantity = 1) => {
    const stock = getProductStock(product);
    const quantityToAdd = Math.max(1, Number(requestedQuantity) || 1);

    setCart((previousCart) => {
      const existingItem = previousCart.find((item) => item.id === product.id);

      const currentQuantity = existingItem?.qty || 0;
      const availableToAdd = stock - currentQuantity;

      if (stock <= 0) {
        showToast(`"${product.title}" is currently out of stock.`);
        return previousCart;
      }

      if (availableToAdd <= 0) {
        showToast(`"${product.title}" is already at the stock limit.`);
        return previousCart;
      }

      const finalQuantityToAdd = Math.min(quantityToAdd, availableToAdd);

      if (existingItem) {
        return previousCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + finalQuantityToAdd,
              }
            : item,
        );
      }

      const sellerName =
        typeof product.seller === "object"
          ? product.seller?.name || "Campus Seller"
          : product.seller || product.sellerName || "Campus Seller";

      return [
        ...previousCart,
        {
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          qty: finalQuantityToAdd,
          image: product.image,
          seller: sellerName,
          pickupLocation:
            typeof product.pickupLocation === "object"
              ? product.pickupLocation?.name || "Campus Safe Desk"
              : product.pickupLocation || "Campus Safe Desk",
        },
      ];
    });

    if (quantityToAdd > stock) {
      showToast(
        `Only ${stock} × "${product.title}" available. Added ${Math.min(
          quantityToAdd,
          stock,
        )}.`,
      );
    } else {
      showToast(`Added ${quantityToAdd} × "${product.title}" to cart!`);
    }
  };

  const handlePublishProduct = async (newProduct) => {
    // 1. Instant optimistic UI update
    setExtraProducts((previousProducts) => {
      const updatedProducts = [newProduct, ...previousProducts];
      window.localStorage.setItem(
        "campuscart-products",
        JSON.stringify(updatedProducts),
      );
      return updatedProducts;
    });

    navigate("/marketplace");
    showToast("Publishing listing... Syncing to MongoDB Atlas");

    // 2. Call live MongoDB backend API
    try {
      const result = await createProductOnBackend(newProduct);
      if (result.success) {
        showToast("🟢 Successfully saved in MongoDB Atlas!");
        setDbStatus("connected");
        if (result.data?.id) {
          const backendId = result.data.id;
          setExtraProducts((prev) =>
            prev.map((p) => (p.id === newProduct.id ? { ...p, id: backendId } : p))
          );
        }
      } else {
        showToast("⚠️ Saved locally (MongoDB sleeping / offline).");
      }
    } catch {
      showToast("⚠️ Saved locally (MongoDB connection error).");
    }
  };

  const handleEditProduct = async (updatedProduct) => {
    // 1. Instant optimistic UI update
    setProductOverrides((previousOverrides) => {
      const updatedOverrides = {
        ...previousOverrides,
        [updatedProduct.id]: updatedProduct,
      };
      window.localStorage.setItem(
        "campuscart-product-overrides",
        JSON.stringify(updatedOverrides)
      );
      return updatedOverrides;
    });

    setExtraProducts((previousProducts) => {
      const exists = previousProducts.some(
        (product) => product.id === updatedProduct.id
      );
      if (!exists) return previousProducts;
      const updatedProducts = previousProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      window.localStorage.setItem(
        "campuscart-products",
        JSON.stringify(updatedProducts)
      );
      return updatedProducts;
    });

    setMongoProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
      )
    );

    setLocalProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );

    if (updatedProduct.stock !== undefined) {
      setInventoryOverrides((previous) => {
        const updatedInventory = {
          ...previous,
          [updatedProduct.id]: Number(updatedProduct.stock) || 0,
        };
        window.localStorage.setItem(
          "campuscart-inventory",
          JSON.stringify(updatedInventory)
        );
        return updatedInventory;
      });
    }

    showToast("Updating listing in MongoDB Atlas...");

    // 2. Call live MongoDB backend API
    try {
      const result = await updateProductOnBackend(updatedProduct.id, updatedProduct);
      if (result.success) {
        showToast("🟢 Listing updated in MongoDB Atlas!");
        setDbStatus("connected");
      } else {
        showToast("⚠️ Updated locally (MongoDB sleeping / offline).");
      }
    } catch {
      showToast("⚠️ Updated locally (MongoDB connection error).");
    }
  };

  const handleDeleteProduct = async (productId) => {
    // 1. Instant optimistic UI update
    setDeletedProductIds((previousIds) => {
      const updatedIds = [...new Set([...previousIds, productId])];
      window.localStorage.setItem(
        "campuscart-deleted-products",
        JSON.stringify(updatedIds)
      );
      return updatedIds;
    });

    setExtraProducts((previousProducts) => {
      const updatedProducts = previousProducts.filter(
        (product) => product.id !== productId
      );
      window.localStorage.setItem(
        "campuscart-products",
        JSON.stringify(updatedProducts)
      );
      return updatedProducts;
    });

    setMongoProducts((prev) => prev.filter((product) => product.id !== productId));
    setLocalProducts((previousProducts) =>
      previousProducts.filter((product) => product.id !== productId)
    );

    setInventoryOverrides((previous) => {
      const updated = { ...previous };
      delete updated[productId];
      window.localStorage.setItem(
        "campuscart-inventory",
        JSON.stringify(updated)
      );
      return updated;
    });

    showToast("Deleting listing from MongoDB Atlas...");

    // 2. Call live MongoDB backend API
    try {
      const result = await deleteProductOnBackend(productId);
      if (result.success) {
        showToast("🗑️ Listing deleted from MongoDB Atlas!");
        setDbStatus("connected");
      } else {
        showToast("⚠️ Deleted locally (MongoDB sleeping / offline).");
      }
    } catch {
      showToast("⚠️ Deleted locally (MongoDB connection error).");
    }
  };

  const increaseCartQuantity = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const product = allProducts.find(
          (productItem) => productItem.id === id,
        );

       const stock = getProductStock(product);
        if (stock <= 0) {
          showToast(`"${item.title}" is out of stock.`);
          return item;
        }

        if (item.qty >= stock) {
          showToast(`Only ${stock} × "${item.title}" available.`);

          return item;
        }

        return {
          ...item,
          qty: item.qty + 1,
        };
      }),
    );
  };

  const decreaseCartQuantity = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const cancelOrder = (orderId) => {
    setOrders((previousOrders) => {
      const updatedOrders = previousOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "Cancelled",
              cancelledAt: new Date().toISOString(),
            }
          : order,
      );

      window.localStorage.setItem(
        "campuscart-orders",
        JSON.stringify(updatedOrders),
      );

      return updatedOrders;
    });
  };
  const startChat = (seller, item) => {
    setActiveChat({
      seller,
      item,
      messages: [
        {
          sender: "seller",
          text: `Hey! Thanks for inquiring about ${item.title}. Can you meet at the campus safe desk today?`,
        },
      ],
    });
  };
  const handlePublishListing = (product) => {
    setLocalProducts((previous) => [product, ...previous]);
    navigate("/marketplace");

    setToastMsg("Your listing was published successfully.");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty.");
      return;
    }
    for (const item of cart) {
      const product = allProducts.find(
        (productItem) => productItem.id === item.id,
      );

      const stock = Math.max(0, Number(product?.stock) || 0);

      if (item.qty > stock) {
        showToast(
          `"${item.title}" only has ${stock} available. Please update your cart.`,
        );
        return;
      }

      if (stock <= 0) {
        showToast(`"${item.title}" is currently out of stock.`);
        return;
      }
    }

    const updatedInventory = { ...inventoryOverrides };

for (const item of cart) {
  const product = allProducts.find(
    (productItem) => productItem.id === item.id
  );

  const currentStock = getProductStock(product);

  updatedInventory[item.id] = Math.max(
    0,
    currentStock - item.qty
  );
}

setInventoryOverrides(updatedInventory);

window.localStorage.setItem(
  "campuscart-inventory",
  JSON.stringify(updatedInventory)
);
    const total = cart.reduce(
      (sum, item) => sum + Number(item.price || 0) * item.qty,
      0,
    );

    const orderId = `CC-${Date.now().toString().slice(-8)}`;

    const pickupToken = Math.random().toString(36).slice(2, 8).toUpperCase();

    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "Pending Pickup",
      pickupToken,
      pickupLocation: cart[0]?.pickupLocation || "Campus Safe Desk",
      items: cart,
      total,
      buyer: currentUser
        ? {
            name: currentUser.name,
            email: currentUser.email,
            roll: currentUser.roll,
          }
        : null,
    };

    setOrders((previousOrders) => {
      const nextOrders = [newOrder, ...previousOrders];

      window.localStorage.setItem(
        "campuscart-orders",
        JSON.stringify(nextOrders),
      );

      return nextOrders;
    });

    setCart([]);

    setQrModalItem(newOrder);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast(`🎉 Order ${orderId} created successfully!`);
  };
  return (
    <div className="relative min-h-screen flex flex-col bg-[#fcfcfd]">
      {/* =========================================================================
              FLOATING ISLAND PILL NAVBAR (Pre-Login vs Post-Login Responsive Modes)
             ========================================================================= */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <header
          className={`floating-pill text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-2xl flex items-center justify-between gap-3 sm:gap-6 pointer-events-auto whitespace-nowrap ${isLoggedIn ? "w-full max-w-7xl mx-auto" : "w-fit max-w-[calc(100%-2rem)]"}`}
        >
          {/* Minimal Geometric Logo */}
          <button
            onClick={() => navigateTo(isLoggedIn ? "/home" : "/")}
            className="flex items-center gap-2.5 group cursor-pointer flex-shrink-0"
          >
            <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-white text-xs group-hover:rotate-45 transition-transform duration-300">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m4.93 4.93 4.24 4.24"></path>
                <path d="m14.83 9.17 4.24-4.24"></path>
                <path d="m14.83 14.83 4.24 4.24"></path>
                <path d="m9.17 14.83-4.24 4.24"></path>
              </svg>
            </div>
            <span className="font-display font-bold text-sm tracking-wider uppercase text-white">
              CampusCart
            </span>
          </button>

          {/* Navigation Links inside Pill */}
          {isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 bg-white/10 p-1 rounded-full text-xs font-semibold flex-shrink-0">
              <button
                onClick={() => navigateTo("/home")}
                className={`px-3 py-1 sm:px-3.5 sm:py-1 rounded-full transition-all ${location.pathname === "/home" ? "bg-white text-black font-bold shadow" : "text-neutral-300 hover:text-white"}`}
              >
                HOME
              </button>
              <button
                onClick={() => navigateTo("/marketplace")}
                className={`px-3 py-1 sm:px-3.5 sm:py-1 rounded-full transition-all ${location.pathname === "/marketplace" ? "bg-white text-black font-bold shadow" : "text-neutral-300 hover:text-white"}`}
              >
                MARKETPLACE
              </button>
              <button
                onClick={() => navigateTo("/sell")}
                className={`px-3 py-1 sm:px-3.5 sm:py-1 rounded-full transition-all ${
                  location.pathname === "/sell"
                    ? "bg-white text-black font-bold shadow"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                SELL ITEM
              </button>
              <button
                onClick={() => navigateTo("/services")}
                className={`px-3 py-1 sm:px-3.5 sm:py-1 rounded-full transition-all ${location.pathname === "/services" ? "bg-white text-black font-bold shadow" : "text-neutral-300 hover:text-white"}`}
              >
                SKILLS
              </button>
              <button
                onClick={() => navigateTo("/courses")}
                className={`px-3 py-1 sm:px-3.5 sm:py-1 rounded-full transition-all ${location.pathname === "/courses" ? "bg-white text-black font-bold shadow" : "text-neutral-300 hover:text-white"}`}
              >
                COURSES
              </button>
              <button
                onClick={() => navigateTo("/orders")}
                className={`px-3 py-1 sm:px-3.5 sm:py-1 rounded-full transition-all ${
                  location.pathname === "/orders"
                    ? "bg-white font-bold text-black shadow"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                ORDERS
              </button>
              <button
                onClick={() => navigateTo("/wishlist")}
                className={`px-3 py-1 sm:px-3.5 sm:py-1 rounded-full transition-all ${
                  location.pathname === "/wishlist"
                    ? "bg-white text-black font-bold shadow"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                WISHLIST
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3.5 py-1 rounded-full text-xs font-semibold flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white font-bold tracking-wider">
                OVERVIEW & TOUR
              </span>
              <span className="text-[10px] text-neutral-400 font-mono pl-1 border-l border-white/20">
                PRE-LOGIN GATEWAY
              </span>
            </div>
          )}

          {/* Right Menu / Cart & User Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* Live MongoDB Atlas Cloud Indicator (for Teacher Viva / Live Demo) */}
            <a
              href={`${import.meta.env.VITE_API_URL || "https://campuscart-6m90.onrender.com"}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition flex-shrink-0 cursor-pointer ${
                dbStatus === "connected"
                  ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/80"
                  : dbStatus === "connecting"
                  ? "bg-amber-950/70 border-amber-500/50 text-amber-400 hover:bg-amber-900/80"
                  : "bg-neutral-900/80 border-neutral-700 text-neutral-400 hover:bg-neutral-800"
              }`}
              title="FastAPI + MongoDB Atlas Live Backend (Click to open Swagger Docs)"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus === "connected"
                    ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : dbStatus === "connecting"
                    ? "bg-amber-400 animate-ping"
                    : "bg-neutral-500"
                }`}
              ></span>
              <span className="font-bold">
                {dbStatus === "connected" ? "MongoDB Atlas" : dbStatus === "connecting" ? "Connecting..." : "DB Offline"}
              </span>
            </a>

            {/* West Bengal College Zonal Map Button (Left of Cart) */}
            <button
              onClick={() => setIsMapOpen(true)}
              className="relative text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 font-semibold transition px-2.5 py-1.5 rounded-full hover:bg-white/10 flex-shrink-0 cursor-pointer border border-white/10 hover:border-teal-400/40"
              title="West Bengal College Zonal Map & Logistics"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-teal-400"
              >
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
              <span className="hidden xl:inline text-[11px] font-mono text-teal-300 font-bold uppercase tracking-wider">
                {selectedCampusHub ? selectedCampusHub.shortName : "WB MAP"}
              </span>
            </button>

            {isLoggedIn && (
              <button
                onClick={() => navigateTo("cart")}
                className="relative text-xs text-neutral-300 hover:text-white flex items-center gap-1 font-semibold transition px-2 py-1 rounded-full hover:bg-white/10"
                title="Cart"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 8h14l1 13H4L5 8Z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
                {cart.length > 0 && (
                  <span className="bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cart.reduce((a, b) => a + b.qty, 0)}
                  </span>
                )}
              </button>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="hidden lg:flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-xs text-neutral-300 border border-white/10 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="font-mono text-[11px] text-white font-bold">
                    {currentUser?.roll || "2024CS1089"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white px-3 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 cursor-pointer border border-white/15 flex-shrink-0 whitespace-nowrap"
                  title="Sign Out"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-xs bg-white text-neutral-950 hover:bg-neutral-200 px-4 py-1.5 rounded-full font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Sign in with College ID</span>
              </button>
            )}

            {/* Hamburger dropdown toggle */}
            <button
              onClick={() => setNavMenuOpen(!navMenuOpen)}
              className="text-neutral-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
              title="Menu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="4" x2="20" y1="9" y2="9"></line>
                <line x1="4" x2="20" y1="15" y2="15"></line>
              </svg>
            </button>
          </div>
        </header>
      </div>

      {/* Mobile / Hamburger Overlay Menu */}
      {navMenuOpen && (
        <div className="fixed inset-0 z-40 bg-neutral-950/80 backdrop-blur-md flex flex-col justify-center items-center gap-6 text-white text-2xl font-display font-bold animate-in fade-in duration-200">
          {!isLoggedIn && (
            <button
              onClick={() => {
                navigateTo("/");
                setNavMenuOpen(false);
              }}
              className="hover:text-neutral-400"
            >
              OVERVIEW / ABOUT
            </button>
          )}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  navigateTo("/home");
                  setNavMenuOpen(false);
                }}
                className="hover:text-neutral-400"
              >
                HOME
              </button>
              <button
                onClick={() => {
                  navigateTo("/marketplace");
                  setNavMenuOpen(false);
                }}
                className="hover:text-neutral-400"
              >
                STUDENT MARKETPLACE
              </button>
              <button
                onClick={() => {
                  navigateTo("/services");
                  setNavMenuOpen(false);
                }}
                className="hover:text-neutral-400"
              >
                PEER SKILLS & GIGS
              </button>
              <button
                onClick={() => {
                  navigateTo("/courses");
                  setNavMenuOpen(false);
                }}
                className="hover:text-neutral-400"
              >
                ACADEMIC COURSES
              </button>
              <button
                onClick={() => {
                  navigateTo("/cart");
                  setNavMenuOpen(false);
                }}
                className="hover:text-neutral-400"
              >
                MY CART ({cart.length})
              </button>
              <button
                onClick={() => {
                  navigateTo("/orders");
                  setNavMenuOpen(false);
                }}
                className="hover:text-neutral-400"
              >
                ORDER HISTORY
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setNavMenuOpen(false);
                }}
                className="mt-4 px-6 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-base"
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsLoginOpen(true);
                setNavMenuOpen(false);
              }}
              className="mt-4 px-6 py-2 bg-white text-black rounded-full text-base"
            >
              STUDENT SIGN IN
            </button>
          )}
          <button
            onClick={() => setNavMenuOpen(false)}
            className="text-sm font-sans text-neutral-400 mt-6 tracking-widest uppercase"
          >
            ✕ Close Menu
          </button>
        </div>
      )}

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <OverviewGatewayView
                isLoggedIn={isLoggedIn}
                onOpenLogin={() => setIsLoginOpen(true)}
                onExplore={() => navigateTo("/marketplace")}
                onEnterHome={() => navigateTo("/home")}
                onAddToCart={addToCart}
                onOpenSeller={setSelectedSeller}
              />
            }
          />
          <Route
            path="/home"
            element={
              <HomrPageIdeaView
                onExplore={() => navigateTo("/marketplace")}
                onAddToCart={addToCart}
                onOpenSeller={setSelectedSeller}
                onStartChat={startChat}
                onOpenQr={setQrModalItem}
                onOpenLogin={() => setIsLoginOpen(true)}
              />
            }
          />
          <Route
            path="/marketplace"
            element={
              <MarketplaceFullView
                onAddToCart={addToCart}
                onOpenSeller={setSelectedSeller}
                onStartChat={startChat}
                onOpenQr={setQrModalItem}
                onSellItem={() => navigateTo("/sell")}
                onAddToWishlist={addToWishlist}
                onRemoveFromWishlist={removeFromWishlist}
                wishlistItems={wishlistItems}
                initialProduct={productToOpen}
                extraProducts={extraProducts}
                inventoryOverrides={inventoryOverrides}
                productOverrides={productOverrides}
              />
            }
          />
          <Route
            path="/sell"
            element={
              <SellItemView
                onBack={() => navigateTo("/marketplace")}
                onPublish={handlePublishProduct}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <OrderHistory
                orders={orders}
                onBack={() => navigateTo("/marketplace")}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <WishlistView
                wishlistItems={wishlistItems}
                onBack={() => navigateTo("/marketplace")}
                onOpenProduct={(product) => {
                  setProductToOpen(product);
                  navigateTo("/marketplace");
                }}
                onRemove={removeFromWishlist}
                onToggleNeeded={toggleNeededByMe}
              />
            }
          />
          <Route
            path="/services"
            element={
              <ServicesSection
                onBook={(title) =>
                  showToast(
                    `Requested session for "${title}"! Check your college email for details.`,
                  )
                }
              />
            }
          />
          <Route
            path="/courses"
            element={
              <CourseSection
                onEnroll={() =>
                  showToast("Enrolled in Academic Course! TA has been alerted.")
                }
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartFullView
                cart={cart}
                onRemove={(id) =>
                  setCart((previousCart) =>
                    previousCart.filter((item) => item.id !== id),
                  )
                }
                onIncrease={increaseCartQuantity}
                onDecrease={decreaseCartQuantity}
                onContinue={() => navigateTo("/marketplace")}
                onCheckout={handleCheckout}
              />
            }
          />

          <Route
  path="/seller-dashboard"
  element={
    <SellerDashboard
      products={allProducts}
      currentUser={currentUser}
      onDeleteProduct={handleDeleteProduct}
      onEditProduct={handleEditProduct}
    />
  }
/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* =========================================================================
              CLEAN EDITORIAL FOOTER WITH FROSTED WATERMARK (Video Timestamp 00:13 - 00:18)
             ========================================================================= */}
      <footer className="bg-neutral-950 text-white relative overflow-hidden pt-20 pb-12 px-6 sm:px-12 border-t border-neutral-900">
        {/* Massive Watermark from Video: "Genesis" -> "CampusCart" */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-10">
          <span className="font-display font-black text-[14vw] tracking-tighter uppercase whitespace-nowrap">
            CampusCart
          </span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-neutral-800">
          <div className="md:col-span-2 space-y-4">
            <div className="font-display font-bold text-2xl tracking-wide flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              CampusCart AI
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              The peer-to-peer ecosystem designed exclusively for college
              students. Trade textbooks, lab instruments, electronics, and
              skills with trusted verification.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-neutral-400">
              <span className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900">
                @campus.edu only
              </span>
              <span className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900">
                CCTV Safe Handovers
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <button
                  onClick={() => navigateTo("marketplace")}
                  className="hover:text-white"
                >
                  Engineering Drafters
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("marketplace")}
                  className="hover:text-white"
                >
                  Casio Calculators
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("marketplace")}
                  className="hover:text-white"
                >
                  Lab Manuals & Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("marketplace")}
                  className="hover:text-white"
                >
                  Hostel Living Essentials
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("marketplace")}
                  className="hover:text-white"
                >
                  Campus Cycles
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-4">
              Verification & Safety
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <a href="#" className="hover:text-white">
                  Library Safe Desk
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Canteen Meetup Zone
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Hostel Entrance Desks
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Graph Trust Score
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  QR Handshake Protocol
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 relative z-10 gap-4">
          <div>© 2026 CampusCart System. All university rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neutral-300">
              Student Code of Conduct
            </a>
            <a href="#" className="hover:text-neutral-300">
              Campus Security Helpline
            </a>
          </div>
        </div>
      </footer>

      {/* =========================================================================
              MODAL: LOGIN DIALOG (Institutional Domain Access)
             ========================================================================= */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-neutral-100 text-center relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-800 text-2xl leading-none"
            >
              &times;
            </button>

            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-900">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>

            <h3 className="font-display text-2xl font-bold text-neutral-900 mb-1">
              Sign in with College ID
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Access restricted to verified university domain accounts.
            </p>

            {/* 1-Click Fast Student Demo Login */}
            <button
              onClick={() => handleLogin("2024cs1089@campus.edu")}
              className="w-full mb-4 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>⚡ Instant Student ID Sign In (2024CS1089@campus.edu)</span>
            </button>

            <div className="relative flex py-2 items-center mb-3">
              <div className="flex-grow border-t border-neutral-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-neutral-400 font-mono uppercase">
                Or credentials
              </span>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(loginEmail);
              }}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                  College Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="rollnumber@campus.edu"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-xl text-sm transition shadow-lg mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Authenticate & Enter Main Portal</span>
                <span>→</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
              MODAL: SELLER TRUST PROFILE
             ========================================================================= */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedSeller(null)}
              className="absolute top-6 right-6 text-neutral-400 text-2xl leading-none"
            >
              &times;
            </button>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedSeller.avatar}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-neutral-900"
                alt=""
              />
              <div>
                <h4 className="font-display text-xl font-bold text-neutral-900">
                  {selectedSeller.name}
                </h4>
                <p className="text-xs text-neutral-500">
                  {selectedSeller.department}
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Verified Student
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 mb-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-neutral-700">
                  Mutual Graph Trust Score
                </span>
                <span className="font-black text-emerald-600 text-sm">
                  {selectedSeller.trustScore} / 100
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${selectedSeller.trustScore}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-neutral-400">
                Calculated from 0 report flags, 28 verified handovers, and
                in-person ratings.
              </p>
            </div>

            <button
              onClick={() => {
                startChat(selectedSeller, { title: "Seller Inquiry" });
                setSelectedSeller(null);
              }}
              className="w-full py-3 bg-neutral-900 text-white font-bold rounded-xl text-xs hover:bg-neutral-800 transition"
            >
              Send Direct Campus Message
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
              DRAWER: REAL-TIME BUYER-SELLER CHAT
             ========================================================================= */}
      {activeChat && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-neutral-200 flex flex-col">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div className="flex items-center gap-3">
              <img
                src={activeChat.seller.avatar}
                className="w-9 h-9 rounded-full object-cover"
                alt=""
              />
              <div>
                <h4 className="font-bold text-sm text-neutral-900">
                  {activeChat.seller.name}
                </h4>
                <p className="text-[10px] text-neutral-500 truncate max-w-[180px]">
                  Re: {activeChat.item.title}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveChat(null)}
              className="text-neutral-400 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs custom-scroll bg-neutral-100/50">
            <div className="text-center text-[10px] text-neutral-400 py-1">
              🔒 In-Campus Verified Peer Chat
            </div>
            {activeChat.messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === "buyer" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${m.sender === "buyer" ? "bg-neutral-950 text-white rounded-br-xs" : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-xs"}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const inp = e.target.elements.chatMsg;
              if (!inp.value.trim()) return;
              const text = inp.value;
              setActiveChat((prev) => ({
                ...prev,
                messages: [...prev.messages, { sender: "buyer", text }],
              }));
              inp.value = "";
              setTimeout(() => {
                setActiveChat((prev) =>
                  prev
                    ? {
                        ...prev,
                        messages: [
                          ...prev.messages,
                          {
                            sender: "seller",
                            text: "Deal! I will bring it to the Library Safe Desk at 4 PM.",
                          },
                        ],
                      }
                    : null,
                );
              }, 1100);
            }}
            className="p-3 border-t border-neutral-200 bg-white flex gap-2"
          >
            <input
              name="chatMsg"
              type="text"
              placeholder="Type message or counter offer..."
              className="flex-1 px-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-950 text-white font-bold rounded-xl text-xs hover:bg-neutral-800"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
              MODAL: QR PICKUP VERIFICATION
             ========================================================================= */}
      {qrModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setQrModalItem(null)}
              className="absolute top-4 right-4 text-neutral-400 text-2xl leading-none"
            >
              &times;
            </button>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Safe Pickup Token
            </span>
            <h3 className="font-display text-xl font-bold text-neutral-900">
              Order #{qrModalItem.id}
            </h3>
            <p>
              Show this QR code at{" "}
              <strong>
                {qrModalItem.pickupLocation || "Campus Safe Desk"}
              </strong>
              .
            </p>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CAMPUSCART-PICKUP-${qrModalItem.id}`}
                alt="Pickup QR Code"
                className="w-36 h-36 mx-auto rounded-lg"
              />
            </div>

            <div className="text-[11px] font-mono text-neutral-400">
              HASH #CP-{Math.floor(1000 + Math.random() * 9000)}
            </div>

            <button
              onClick={() => {
                confetti({ particleCount: 80, spread: 60 });
                setQrModalItem(null);
                showToast(
                  "🎉 QR Handover Verified! Both buyer & seller trust score increased.",
                );
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
            >
              Simulate QR Handshake Completed
            </button>
          </div>
        </div>
      )}

      {/* WEST BENGAL COLLEGE ZONAL MAP MODAL */}
      <WestBengalMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectCollege={(college) => {
          setSelectedCampusHub(college);
          showToast(`📍 Active Campus Hub set to: ${college.name}`);
        }}
      />

      {/* TOAST POPUP */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

export default App;
