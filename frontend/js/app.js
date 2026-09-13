const { useState, useEffect, useMemo, useRef } = React;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentRoute, setCurrentRoute] = useState("overview"); // overview | home | marketplace | services | course | cart
  const [cart, setCart] = useState([
    {
      id: 1,
      title: "Lab Notebook",
      price: 12.99,
      qty: 1,
      image: window.CAMPUS_DATA.products[0].image,
    },
  ]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [qrModalItem, setQrModalItem] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [localProducts, setLocalProducts] = useState([]);

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
    setIsLoggedIn(true);
    setCurrentUser({
      email: email,
      roll: roll,
      name: roll === "2024CS1089" ? "Aarav Patel" : "Verified Student",
      dept: "Computer Science & Engineering",
      hostel: "Hostel 4, Room 218",
    });
    setCurrentRoute("home");
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
    setCurrentRoute("overview");
    showToast("👋 Signed out. Returned to CampusCart Overview.");
  };

  const navigateTo = (route) => {
    if (!isLoggedIn && route !== "overview") {
      setIsLoginOpen(true);
      showToast(
        "🔒 Please sign in with your college ID (@campus.edu) to access " +
          route.toUpperCase(),
      );
      return;
    }
    setCurrentRoute(route);
    setNavMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          qty: 1,
          image: product.image,
        },
      ];
    });
    showToast(`Added "${product.title}" to cart!`);
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
    setCurrentRoute("marketplace");

    setToastMsg("Your listing was published successfully.");
  };
  return (
    <div class="relative min-h-screen flex flex-col bg-[#fcfcfd]">
      {/* =========================================================================
              FLOATING ISLAND PILL NAVBAR (Pre-Login vs Post-Login Responsive Modes)
             ========================================================================= */}
      <div class="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <header
  class={`floating-pill text-white px-4 sm:px-5 py-2.5 rounded-full shadow-2xl flex items-center justify-between gap-3 sm:gap-5 pointer-events-auto whitespace-nowrap ${
    isLoggedIn
      ? "w-[calc(100%-2rem)] max-w-[1800px]"
      : "w-fit max-w-[calc(100%-2rem)]"
  }`}
>
          {/* Minimal Geometric Logo */}
          <button
            onClick={() => navigateTo(isLoggedIn ? "home" : "overview")}
            class="flex items-center gap-2.5 group cursor-pointer flex-shrink-0"
          >
            <div class="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-white text-xs group-hover:rotate-45 transition-transform duration-300">
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
            <span class="font-display font-bold text-sm tracking-wider uppercase text-white">
              CampusCart
            </span>
          </button>

          {/* Navigation Links inside Pill */}
          {isLoggedIn ? (
           <div class="hidden sm:flex items-center gap-3 bg-white/10 p-1.5 rounded-full text-xs font-semibold flex-shrink-0">
              <button
                onClick={() => navigateTo("home")}
                class={`px-4 py-1.5 rounded-full transition-all ${currentRoute === "home" ? "bg-white text-black font-bold shadow" : "text-neutral-300 hover:text-white"}`}
              >
                HOME
              </button>
              <button
                onClick={() => navigateTo("marketplace")}
                class={`px-4 py-1.5 rounded-full transition-all ${currentRoute === "marketplace" ? "bg-white text-black font-bold shadow" : "text-neutral-300 hover:text-white"}`}
              >
                MARKETPLACE
              </button>
              <button
                onClick={() => navigateTo("sell")}
                class={`px-4 py-1.5 rounded-full transition-all ${
                  currentRoute === "sell"
                    ? "bg-white text-black font-bold shadow"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                SELL ITEM
              </button>
              <button
                onClick={() => navigateTo("services")}
                class={`px-4 py-1.5 rounded-full transition-all ${currentRoute === "services" ? "bg-white text-black font-bold shadow" : "text-neutral-300 hover:text-white"}`}
              >
                SKILLS
              </button>
              <button
                onClick={() => navigateTo("course")}
                class={`px-4 py-1.5 rounded-full transition-all ${currentRoute === "course" ? "bg-white text-black font-bold shadow" : "text-neutral-300 hover:text-white"}`}
              >
                COURSES
              </button>
              <button
                onClick={() => navigateTo("overview")}
                class={`px-4 py-1.5 rounded-full transition-all ${currentRoute === "overview" ? "bg-white text-black font-bold shadow" : "text-neutral-300 hover:text-white"}`}
              >
                OVERVIEW
              </button>

              <button
                onClick={() => navigateTo("wishlist")}
                class={`px-4 py-1.5 rounded-full transition-all ${
                  currentRoute === "wishlist"
                    ? "bg-white text-black font-bold shadow"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                WISHLIST
              </button>
            </div>
          ) : (
            <div class="hidden sm:flex items-center gap-2 bg-white/10 px-3.5 py-1 rounded-full text-xs font-semibold flex-shrink-0">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-white font-bold tracking-wider">
                OVERVIEW & TOUR
              </span>
              <span class="text-[10px] text-neutral-400 font-mono pl-1 border-l border-white/20">
                PRE-LOGIN GATEWAY
              </span>
            </div>
          )}

          {/* Right Menu / Cart & User Actions */}
          <div class="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {isLoggedIn && (
             <button
  onClick={() => navigateTo("cart")}
  class="relative flex items-center justify-center w-9 h-9 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition"
  title="Cart"
  aria-label="Shopping cart"
>
  {/* Shopping bag icon */}
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8h12l1 13H5L6 8Z"></path>
    <path d="M9 8V6a3 3 0 0 1 6 0v2"></path>
  </svg>

  {/* Cart item count */}
  {cart.length > 0 && (
    <span class="absolute -top-0.5 -right-0.5 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
      {cart.reduce((total, item) => total + item.qty, 0)}
    </span>
  )}
</button>
            )}

            {isLoggedIn ? (
              <div class="flex items-center gap-2">
                <div class="hidden md:flex items-center gap-1.5 bg-white/10 px-4 py-1.5 rounded-full text-xs text-neutral-300 border border-white/10">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span class="font-mono text-[11px] text-white font-bold">
                    {currentUser?.roll || "2024CS1089"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  class="text-xs bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white px-3 py-1 rounded-full font-medium transition flex items-center gap-1.5 cursor-pointer border border-white/15"
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
                  <span class="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                class="text-xs bg-white text-neutral-950 hover:bg-neutral-200 px-4 py-1.5 rounded-full font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
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
              class="text-neutral-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
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
        <div class="fixed inset-0 z-40 bg-neutral-950/80 backdrop-blur-md flex flex-col justify-center items-center gap-6 text-white text-2xl font-display font-bold animate-in fade-in duration-200">
          <button
            onClick={() => navigateTo("overview")}
            class="hover:text-neutral-400"
          >
            OVERVIEW / ABOUT
          </button>
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigateTo("home")}
                class="hover:text-neutral-400"
              >
                HOME
              </button>
              <button
                onClick={() => navigateTo("marketplace")}
                class="hover:text-neutral-400"
              >
                STUDENT MARKETPLACE
              </button>
              <button
                onClick={() => navigateTo("services")}
                class="hover:text-neutral-400"
              >
                PEER SKILLS & GIGS
              </button>
              <button
                onClick={() => navigateTo("course")}
                class="hover:text-neutral-400"
              >
                ACADEMIC COURSES
              </button>
              <button
                onClick={() => navigateTo("cart")}
                class="hover:text-neutral-400"
              >
                MY CART ({cart.length})
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setNavMenuOpen(false);
                }}
                class="mt-4 px-6 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-base"
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
              class="mt-4 px-6 py-2 bg-white text-black rounded-full text-base"
            >
              STUDENT SIGN IN
            </button>
          )}
          <button
            onClick={() => setNavMenuOpen(false)}
            class="text-sm font-sans text-neutral-400 mt-6 tracking-widest uppercase"
          >
            ✕ Close Menu
          </button>
        </div>
      )}

      {/* MAIN VIEW CONTROLLER */}
      <main class="flex-1">
        {currentRoute === "overview" && (
          <OverviewGatewayView
            isLoggedIn={isLoggedIn}
            onOpenLogin={() => setIsLoginOpen(true)}
            onExplore={() => navigateTo("marketplace")}
            onEnterHome={() => navigateTo("home")}
            onAddToCart={addToCart}
            onOpenSeller={setSelectedSeller}
          />
        )}

        {currentRoute === "home" && (
          <HomrPageIdeaView
            onExplore={() => navigateTo("marketplace")}
            onAddToCart={addToCart}
            onOpenSeller={setSelectedSeller}
            onStartChat={startChat}
            onOpenQr={setQrModalItem}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {currentRoute === "marketplace" && (
          <MarketplaceFullView
            extraProducts={localProducts}
            onAddToCart={addToCart}
            onOpenSeller={setSelectedSeller}
            onStartChat={startChat}
            onOpenQr={setQrModalItem}
            onSellItem={() => navigateTo("sell")}
            onAddToWishlist={addToWishlist}
          />
        )}

        {currentRoute === "sell" && (
          <SellItemView
            onBack={() => navigateTo("marketplace")}
            onPublish={handlePublishListing}
          />
        )}

        {currentRoute === "wishlist" && (
          <WishlistView
            wishlistItems={wishlistItems}
            onBack={() => navigateTo("marketplace")}
            onOpenProduct={(product) => {
              setSelectedProduct(product);
              navigateTo("marketplace");
            }}
            onRemove={removeFromWishlist}
            onToggleNeeded={toggleNeededByMe}
          />
        )}

        {currentRoute === "services" && (
          <ServicesSection
            onBook={(title) =>
              showToast(
                `Requested session for "${title}"! Check your college email for details.`,
              )
            }
          />
        )}

        {currentRoute === "course" && (
          <CourseSection
            onEnroll={() =>
              showToast("Enrolled in Academic Course! TA has been alerted.")
            }
          />
        )}

        {currentRoute === "cart" && (
          <CartFullView
            cart={cart}
            onRemove={(id) =>
              setCart((prev) => prev.filter((i) => i.id !== id))
            }
            onContinue={() => navigateTo("marketplace")}
            onCheckout={() => {
              confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
              setCart([]);
              showToast(
                "🎉 Order Placed! In-Campus QR Pickup Token has been created.",
              );
            }}
          />
        )}
      </main>

      {/* =========================================================================
              CLEAN EDITORIAL FOOTER WITH FROSTED WATERMARK (Video Timestamp 00:13 - 00:18)
             ========================================================================= */}
      <footer class="bg-neutral-950 text-white relative overflow-hidden pt-20 pb-12 px-6 sm:px-12 border-t border-neutral-900">
        {/* Massive Watermark from Video: "Genesis" -> "CampusCart" */}
        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-10">
          <span class="font-display font-black text-[14vw] tracking-tighter uppercase whitespace-nowrap">
            CampusCart
          </span>
        </div>

        <div class="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-neutral-800">
          <div class="md:col-span-2 space-y-4">
            <div class="font-display font-bold text-2xl tracking-wide flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              CampusCart AI
            </div>
            <p class="text-sm text-neutral-400 max-w-sm leading-relaxed">
              The peer-to-peer ecosystem designed exclusively for college
              students. Trade textbooks, lab instruments, electronics, and
              skills with trusted verification.
            </p>
            <div class="flex items-center gap-3 pt-2 text-xs text-neutral-400">
              <span class="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900">
                @campus.edu only
              </span>
              <span class="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900">
                CCTV Safe Handovers
              </span>
            </div>
          </div>

          <div>
            <h4 class="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-4">
              Marketplace
            </h4>
            <ul class="space-y-2 text-sm text-neutral-300">
              <li>
                <button
                  onClick={() => navigateTo("marketplace")}
                  class="hover:text-white"
                >
                  Engineering Drafters
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("marketplace")}
                  class="hover:text-white"
                >
                  Casio Calculators
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("marketplace")}
                  class="hover:text-white"
                >
                  Lab Manuals & Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("marketplace")}
                  class="hover:text-white"
                >
                  Hostel Living Essentials
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("marketplace")}
                  class="hover:text-white"
                >
                  Campus Cycles
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-4">
              Verification & Safety
            </h4>
            <ul class="space-y-2 text-sm text-neutral-300">
              <li>
                <a href="#" class="hover:text-white">
                  Library Safe Desk
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-white">
                  Canteen Meetup Zone
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-white">
                  Hostel Entrance Desks
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-white">
                  Graph Trust Score
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-white">
                  QR Handshake Protocol
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 relative z-10 gap-4">
          <div>© 2026 CampusCart System. All university rights reserved.</div>
          <div class="flex gap-6">
            <a href="#" class="hover:text-neutral-300">
              Privacy Policy
            </a>
            <a href="#" class="hover:text-neutral-300">
              Student Code of Conduct
            </a>
            <a href="#" class="hover:text-neutral-300">
              Campus Security Helpline
            </a>
          </div>
        </div>
      </footer>

      {/* =========================================================================
              MODAL: LOGIN DIALOG (Institutional Domain Access)
             ========================================================================= */}
      {isLoginOpen && (
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-neutral-100 text-center relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsLoginOpen(false)}
              class="absolute top-6 right-6 text-neutral-400 hover:text-neutral-800 text-2xl leading-none"
            >
              &times;
            </button>

            <div class="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-900">
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

            <h3 class="font-display text-2xl font-bold text-neutral-900 mb-1">
              Sign in with College ID
            </h3>
            <p class="text-xs text-neutral-500 mb-5">
              Access restricted to verified university domain accounts.
            </p>

            {/* 1-Click Fast Student Demo Login */}
            <button
              onClick={() => handleLogin("2024cs1089@campus.edu")}
              class="w-full mb-4 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>⚡ Instant Student ID Sign In (2024CS1089@campus.edu)</span>
            </button>

            <div class="relative flex py-2 items-center mb-3">
              <div class="flex-grow border-t border-neutral-200"></div>
              <span class="flex-shrink mx-3 text-[11px] text-neutral-400 font-mono uppercase">
                Or credentials
              </span>
              <div class="flex-grow border-t border-neutral-200"></div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(loginEmail);
              }}
              class="space-y-4 text-left"
            >
              <div>
                <label class="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                  College Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="rollnumber@campus.edu"
                  class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  class="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button
                type="submit"
                class="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-xl text-sm transition shadow-lg mt-2 cursor-pointer flex items-center justify-center gap-2"
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
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedSeller(null)}
              class="absolute top-6 right-6 text-neutral-400 text-2xl leading-none"
            >
              &times;
            </button>
            <div class="flex items-center gap-4 mb-6">
              <img
                src={selectedSeller.avatar}
                class="w-16 h-16 rounded-2xl object-cover border-2 border-neutral-900"
                alt=""
              />
              <div>
                <h4 class="font-display text-xl font-bold text-neutral-900">
                  {selectedSeller.name}
                </h4>
                <p class="text-xs text-neutral-500">
                  {selectedSeller.department}
                </p>
                <span class="inline-block mt-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Verified Student
                </span>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 mb-4 space-y-2 text-xs">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-neutral-700">
                  Mutual Graph Trust Score
                </span>
                <span class="font-black text-emerald-600 text-sm">
                  {selectedSeller.trustScore} / 100
                </span>
              </div>
              <div class="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  class="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${selectedSeller.trustScore}%` }}
                ></div>
              </div>
              <p class="text-[11px] text-neutral-400">
                Calculated from 0 report flags, 28 verified handovers, and
                in-person ratings.
              </p>
            </div>

            <button
              onClick={() => {
                startChat(selectedSeller, { title: "Seller Inquiry" });
                setSelectedSeller(null);
              }}
              class="w-full py-3 bg-neutral-900 text-white font-bold rounded-xl text-xs hover:bg-neutral-800 transition"
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
        <div class="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-neutral-200 flex flex-col">
          <div class="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div class="flex items-center gap-3">
              <img
                src={activeChat.seller.avatar}
                class="w-9 h-9 rounded-full object-cover"
                alt=""
              />
              <div>
                <h4 class="font-bold text-sm text-neutral-900">
                  {activeChat.seller.name}
                </h4>
                <p class="text-[10px] text-neutral-500 truncate max-w-[180px]">
                  Re: {activeChat.item.title}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveChat(null)}
              class="text-neutral-400 text-2xl"
            >
              &times;
            </button>
          </div>

          <div class="flex-1 p-4 overflow-y-auto space-y-3 text-xs custom-scroll bg-neutral-100/50">
            <div class="text-center text-[10px] text-neutral-400 py-1">
              🔒 In-Campus Verified Peer Chat
            </div>
            {activeChat.messages.map((m, idx) => (
              <div
                key={idx}
                class={`flex ${m.sender === "buyer" ? "justify-end" : "justify-start"}`}
              >
                <div
                  class={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${m.sender === "buyer" ? "bg-neutral-950 text-white rounded-br-xs" : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-xs"}`}
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
            class="p-3 border-t border-neutral-200 bg-white flex gap-2"
          >
            <input
              name="chatMsg"
              type="text"
              placeholder="Type message or counter offer..."
              class="flex-1 px-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-neutral-950 text-white font-bold rounded-xl text-xs hover:bg-neutral-800"
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
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setQrModalItem(null)}
              class="absolute top-4 right-4 text-neutral-400 text-2xl leading-none"
            >
              &times;
            </button>
            <span class="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Safe Pickup Token
            </span>
            <h3 class="font-display text-xl font-bold text-neutral-900">
              {qrModalItem.title}
            </h3>
            <p class="text-xs text-neutral-500">
              Show this QR code to <strong>{qrModalItem.seller.name}</strong> at{" "}
              <em>{qrModalItem.pickupLocation}</em>.
            </p>

            <div class="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CAMPUSCART-PICKUP-${qrModalItem.id}`}
                alt="Pickup QR Code"
                class="w-36 h-36 mx-auto rounded-lg"
              />
            </div>

            <div class="text-[11px] font-mono text-neutral-400">
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
              class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
            >
              Simulate QR Handshake Completed
            </button>
          </div>
        </div>
      )}

      {/* TOAST POPUP */}
      {toastMsg && (
        <div class="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

window.App = App;

// Render React App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
