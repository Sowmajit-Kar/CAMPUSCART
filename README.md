# 🎓 CampusCart — Next-Gen Student Marketplace (Genesis-Inspired)

CampusCart is a college marketplace and peer skill exchange platform built with modern web aesthetics (Genesis-inspired design language, glassmorphism, procedural canvas reels, and cryptographic QR pickups), powered by **Vite + React 18** and **Tailwind CSS**.

---

## 📁 Repository Structure

The project is structured with a modern Vite + React frontend architecture prepared for standalone development and backend API integration:

```text
CAMPUSCART/
├── .gitignore                    # Excludes heavy media binaries, node_modules, dist/
├── Makefile                      # Make commands for local dev, build, and preview
├── package.json                  # Root npm runner scripts
├── README.md                     # Documentation & setup guide
├── backend/                      # Backend services
├── index.html                    # Root portal launcher
└── frontend/                     # Modern Vite + React Application
    ├── index.html                # Vite HTML module entry point
    ├── package.json              # React 18, Vite, Lucide, Tailwind dependencies
    ├── vite.config.js            # Vite build configuration
    ├── tailwind.config.js        # Custom brand theme & typography
    ├── postcss.config.js         # PostCSS pipeline
    └── src/
        ├── main.jsx              # React 18 createRoot mounting
        ├── App.jsx               # Core application state, modals & navigation
        ├── index.css             # Tailwind directives + Genesis watermarks & keyframes
        ├── data/
        │   └── mockData.js       # Campus marketplace mock database
        └── components/           # Modular React JSX Components
            ├── VideoShowcase.jsx         # Procedural 60fps canvas motion reel
            ├── CircularWheelShowcase.jsx # Interactive category rotating wheel
            ├── OverviewGatewayView.jsx   # Pre-login Genesis hero & comparison
            ├── HomrPageIdeaView.jsx      # Post-login marketplace dashboard
            ├── MarketplaceView.jsx       # Product catalog grid & search filter
            ├── SellItemView.jsx          # Listing creation & publish form
            ├── ServicesView.jsx          # Student tutoring & peer gigs
            ├── CourseView.jsx            # Course materials exchange
            └── CartView.jsx              # Shopping cart & QR token generator
```

---

## 🌟 Key Features

1. **Vite + React 18**: Instant Hot Module Replacement (HMR) and optimized Rollup production builds.
2. **Floating Island Pill Navigation**: Centered glassmorphism pill with geometric branding, dynamic route switching, and cart count badge.
3. **Hero Section with Giant Watermark Typography**: Translucent Genesis watermark, campus metric statistics, and call-to-actions.
4. **Interactive Procedural Showcase Reel**: HTML5 canvas engine rendering 60fps animated reels with chapter controls.
5. **Student Marketplace & Seller Mode**: Filter by mode (Buy/Rent/Exchange), search, seller trust score badges, and new item listing form.
6. **QR Handshake Confirmation**: Cryptographic pickup token generator with confetti celebration.

---

## 🚀 How to Run Locally

### Option 1: Using NPM
```bash
# 1. Install dependencies (first time only)
npm run install:frontend

# 2. Start Vite development server
npm run dev
# Launches http://localhost:3000 with instant HMR!
```

### Option 2: Using Make
```bash
# Start local Vite server
make dev

# Build production bundle
make build

# Preview production build
make preview
```

### Production Build
To create an optimized production build:
```bash
npm run build
# Compiles minified bundle into frontend/dist/
```
