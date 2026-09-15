<img width="1500" height="350" alt="CampusCart Banner" src="https://github.com/user-attachments/assets/032f9923-3dcb-49eb-8381-fd6a98819bb3" />

# 🎓 CampusCart — Next-Gen Student Marketplace & Peer Logistics

CampusCart is a specialized collegiate marketplace, peer barter, and skill exchange network built for university and medical college ecosystems. Featuring a modern glassmorphic interface, dark-mode styling, real interactive collegiate zonal radar maps (West Bengal academic clusters), dual delivery logistics (senior in-campus meetup vs. regional e-logistics), and cryptographic handover tokens.

---

## 📁 Repository Structure

The codebase is structured as a modular full-stack application with a Vite + React frontend and a FastAPI backend service:

```text
CAMPUSCART/
├── .gitignore                          # Excludes heavy binaries, node_modules, temp files
├── LICENSE                             # MIT License
├── Makefile                            # Make commands for local dev, build, and tasks
├── package.json                        # Root npm orchestrator scripts
├── package-lock.json                   # Root package lockfile
├── README.md                           # Documentation & project guide
├── index.html                          # Root entry point with instant redirect to frontend
├── backend/                            # FastAPI backend service
│   ├── requirements.txt                # Python dependencies (FastAPI, Uvicorn, etc.)
│   └── app/                            # Application source code
│       ├── main.py                     # API entry point & route definitions
│       └── core/                       # Core backend configurations
│           ├── config.py               # Environment & app settings
│           └── database.py             # Database connector & session setup
└── frontend/                           # Modern Vite + React 18 Application
    ├── index.html                      # Vite HTML module entry point
    ├── package.json                    # Frontend scripts & dependencies (Leaflet, Lucide, Tailwind)
    ├── package-lock.json               # Frontend lockfile
    ├── vite.config.js                  # Vite bundler configuration
    ├── tailwind.config.js              # Tailwind styling & design tokens
    ├── postcss.config.js               # PostCSS pipeline
    └── src/
        ├── main.jsx                    # React 18 createRoot mount point
        ├── App.jsx                     # Application root state, routing, navbar & modals
        ├── index.css                   # Tailwind directives, custom sliding bars & dark map styling
        ├── data/                       # Static & mock datasets
        │   ├── mockData.js             # Marketplace listings, categories & dummy users
        │   └── westBengalColleges.js   # 23+ colleges (Medical & Engineering), zones & GPS coordinates
        └── components/                 # Modular UI Components & Views
            ├── OverviewGatewayView.jsx   # Pre-login hero showcase & feature breakdown
            ├── HomrPageIdeaView.jsx      # Post-login marketplace dashboard & live ticker
            ├── MarketplaceView.jsx       # Product catalog grid, search & category filters
            ├── SellItemView.jsx          # Listing creation & item publish form
            ├── ServicesView.jsx          # Peer tutoring, student gigs & skill exchange
            ├── CourseView.jsx            # Course materials & past exams exchange
            ├── CartView.jsx              # Shopping cart & checkout token generator
            ├── WishListView.jsx          # Saved wishlist items & price tracking
            ├── OrderHistory.jsx          # Past transactions, pickup tokens & order statuses
            ├── WestBengalMapModal.jsx    # Real Leaflet interactive map with zonal divisions
            ├── CircularWheelShowcase.jsx # Rotating interactive category wheel
            └── VideoShowcase.jsx         # Procedural 60fps canvas visual reel
```

---

## 🌟 Key Features

- **🗺️ Real West Bengal Zonal Radar Map**:
  - Built with Leaflet using **100% free, zero-API-key** tile services (ESRI Dark Canvas & OpenStreetMap).
  - Divided into 5 distinct collegiate zones: **Kolkata Metro**, **Kharagpur & Midnapore**, **Durgapur/Burdwan/Bankura**, **Kalyani & Nadia**, and **North Bengal**.
  - **Stream Filtering**: Instant toggle between **🩺 Medical Colleges** (CMC, SSKM, NRS, RG Kar, CNMC, AIIMS Kalyani, Burdwan Medical, Bankura Medical, Midnapore Medical, NBMCH, Malda Medical) and **⚙️ Engineering & Tech Hubs** (IIT KGP, JU, NIT DGP, IIEST, KGEC, UIT, etc.).
  - **Fluid Sliding Bar & Responsive Controls**: Pinned active campus hub button, compact `+` / `−` zoom controls, and smooth `flyTo` navigation.

- **⚡ Dual Delivery Logistics**:
  - **In-Campus (Direct Senior Handover)**: ₹0 fee, 10–30 min meetup at verified CCTV safe spots (libraries, main gates, central canteens).
  - **Out-of-Campus / Bulk (E-Logistics)**: Inter-district transit (24–48 hours) for off-campus scholars and bulk study bundles.

- **🛍️ Complete Marketplace Flow**:
  - Product listings, item selling wizard, peer tutoring/gigs (`ServicesView`), course materials archive (`CourseView`), wishlist bookmarking (`WishListView`), and order history with digital pickup token codes (`OrderHistory`).

---

## 🚀 How to Run Locally

### 1. Frontend (Vite + React)

```bash
# Install dependencies
npm run install:frontend
# or: cd frontend && npm install

# Start Vite development server (HMR enabled)
npm run dev
# or: make dev
# Launches at http://localhost:3000 (or http://localhost:5173)
```

To create an optimized production build:
```bash
npm run build
# or: cd frontend && npm run build
```

---

### 2. Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create & activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server with auto-reload
uvicorn app.main:app --reload
# API runs on http://127.0.0.1:8000
# Interactive Swagger docs at http://127.0.0.1:8000/docs
```

---

## 📦 Git & Deployment

CampusCart is configured for automatic deployment on platforms like Vercel or Render.

```bash
# Check status
git status

# Commit and push changes
git add .
git commit -m "feat: your descriptive commit message"
git push origin goat-branch

# To sync with production branch:
git checkout main
git merge goat-branch
git push origin main
git checkout goat-branch
```
