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
            ├── SellerDashboard.jsx       # Seller active inventory, listing editor & sales stats
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

## 🔄 Interactive Project Workflow & Architecture

The following diagram illustrates CampusCart's end-to-end lifecycle—from institutional geo-location and stream filtering, through the dual-fulfillment routing engine, to the cryptographic QR handshake and circular re-listing loop:

```mermaid
flowchart TD
    %% Custom Vibrant Theme Styling
    classDef teal fill:#0f3b38,stroke:#14b8a6,stroke-width:2px,color:#f8fafc;
    classDef rose fill:#4c0519,stroke:#f43f5e,stroke-width:2px,color:#f8fafc;
    classDef indigo fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#f8fafc;
    classDef amber fill:#451a03,stroke:#f59e0b,stroke-width:2px,color:#f8fafc;
    classDef emerald fill:#022c22,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    classDef dark fill:#0b0f19,stroke:#334155,stroke-width:1.5px,color:#cbd5e1;
    classDef highlight fill:#134e4a,stroke:#2dd4bf,stroke-width:3px,color:#ffffff;

    subgraph PHASE1["🌐 Phase 1: Onboarding & Zonal Radar Mapping"]
        U["🎓 Verified Student User"]:::dark --> MAP["🗺️ West Bengal GIS Radar Map (Leaflet)"]:::teal
        MAP --> ZONES{"📍 Select Collegiate Zone"}:::indigo
        ZONES -->|Zone 1| Z1["Kolkata Metro & Urban Belt"]:::indigo
        ZONES -->|Zone 2| Z2["Kharagpur & Midnapore"]:::indigo
        ZONES -->|Zone 3| Z3["Durgapur, Burdwan & Bankura"]:::indigo
        ZONES -->|Zone 4| Z4["Kalyani & Nadia Knowledge Hub"]:::indigo
        ZONES -->|Zone 5| Z5["North Bengal & Siliguri"]:::indigo
    end

    subgraph PHASE2["📚 Phase 2: Academic Stream Catalog Discovery"]
        Z1 & Z2 & Z3 & Z4 & Z5 --> HUB["📌 Active Campus Hub Selected"]:::teal
        HUB --> STREAM{"🏷️ Filter Academic Stream"}:::dark
        STREAM -->|Medical Stream| MED["🩺 Medical Colleges (CMC, SSKM, NRS, RG Kar, AIIMS)"]:::rose
        STREAM -->|Engineering Stream| ENG["⚙️ Engineering & Tech Hubs (IIT KGP, JU, NIT DGP, IIEST)"]:::teal
        
        MED --> ITEMS_MED["🦴 Bone Sets, Dissection Kits, Robbins Books, Lab Coats"]:::rose
        ENG --> ITEMS_ENG["📐 Drafters, Scientific Calculators, GATE Notes, Dev Boards"]:::teal
    end

    subgraph PHASE3["⚡ Phase 3: Dual Logistics Fulfillment Engine"]
        ITEMS_MED & ITEMS_ENG --> CART["🛒 Shopping Cart & Checkout"]:::dark
        CART --> DISPATCH{"🚚 Select Delivery Mode"}:::amber
        
        DISPATCH -->|Inside Campus| IN_CAMPUS["⚡ Channel 1: In-Campus Senior Handover (₹0 Fee | 10-30 Mins)"]:::emerald
        DISPATCH -->|Outside Campus / Bulk| OUT_CAMPUS["📦 Channel 2: Inter-Campus E-Logistics (₹39-₹69 | 24-48 Hours)"]:::amber
    end

    subgraph PHASE4["🤝 Phase 4: Monitored Meetup & Verification"]
        IN_CAMPUS --> SPOTS["📍 Verified CCTV Safe Meetup Spots (Central Library, Canteen, Hostel Gate)"]:::emerald
        OUT_CAMPUS --> LOCKER["📫 Regional Transit Locker & Sealed Tamper-Evident Bag"]:::amber
        
        SPOTS --> INSPECT["🔍 Physical Inspection & Face-to-Face Verification"]:::emerald
        LOCKER --> OTP_VERIF["📱 Digital OTP Delivery Confirmation"]:::amber
    end

    subgraph PHASE5["🔐 Phase 5: Cryptographic Handshake & Circular Loop"]
        INSPECT --> QR["📲 Cryptographic QR Handshake Token Scan"]:::highlight
        OTP_VERIF --> QR
        QR --> RELEASE["💳 Instant Escrow Release & Verified Receipt"]:::emerald
        RELEASE --> LEDGER["📜 Order Logged to OrderHistory & Verified Ratings"]:::dark
        LEDGER --> CIRCULAR["🔄 Next Semester: 1-Click Circular Re-listing Loop"]:::teal
        CIRCULAR -.->|Next Junior Generation| ITEMS_MED & ITEMS_ENG
    end
```

<br/>

### 📱 Interactive Lifecycle Stages (Click to Expand)

<details open>
<summary><b>🗺️ Stage 1: Institutional Onboarding & GIS Radar Pinning</b></summary>
<br/>

- **Campus Radar Mapping**: Students launch the high-contrast Leaflet map powered by zero-API-key **ESRI Dark Canvas** and **OpenStreetMap** layers.
- **5 Zonal Divisions**: Real-time coverage across **Kolkata Metro**, **Kharagpur / Midnapore**, **Durgapur / Burdwan**, **Kalyani / Nadia**, and **North Bengal**.
- **Dynamic Fly-To Navigation**: Clicking any zone or campus executes smooth camera gliding with polygon boundary highlights and student population counters.

> [!NOTE]
> All collegiate data includes verified geolocation coordinates (WGS84 Lat/Lng), pincodes, and active student verification badges.
</details>

<details>
<summary><b>🩺 Stage 2: Academic Stream Specialization & Inventory Barter</b></summary>
<br/>

- **Medical & Healthcare Stream**: High-demand circulation of human osteology bone sets, anatomy dissection manuals, stethoscope kits, and clinical surgery books across Calcutta Medical College, IPGMER/SSKM, NRS, RG Kar, AIIMS Kalyani, and Burdwan Medical.
- **Engineering & Technology Stream**: Rapid semester trade of mini-drafters, Casio fx-991EX calculators, GATE study bundles, and micro-controller dev boards across IIT Kharagpur, Jadavpur University, NIT Durgapur, IIEST Shibpur, and KGEC.
- **Peer Tutoring & Student Gigs**: Direct peer exchange of semester exam revision sessions, CAD drafting assistance, and coding tutoring.
</details>

<details>
<summary><b>⚡ Stage 3: Dual-Channel Fulfillment Engine</b></summary>
<br/>

CampusCart dynamically bifurcates order routing based on collegiate proximity and order weight:

| Metric | Channel 1: In-Campus Senior Handover | Channel 2: Regional Inter-Campus E-Logistics |
| :--- | :--- | :--- |
| **Delivery Cost** | **₹0.00 (100% Free Peer Meetup)** | **₹39 – ₹69 (Free on Bulk > ₹499)** |
| **ETA** | **10 – 30 Minutes** | **24 – 48 Hours** |
| **Fulfillment Agent** | Senior student / batchmate on campus | Regional collegiate courier & transit lockers |
| **Location** | Verified CCTV landmark safe spots | Off-campus home address or campus locker |
| **Packaging** | Zero waste (hands-on peer handover) | Tamper-evident sealed barcode bag |
| **Ideal For** | Urgent exam books, single calculators, lab coats | Bulky semester book sets, cross-city transfers |
</details>

<details>
<summary><b>🛡️ Stage 4: CCTV-Monitored Safe Zones & Physical Verification</b></summary>
<br/>

- **Eliminating Stranger Risk**: Unlike generic classifieds (OLX) that force students to meet unknown people off-campus, CampusCart enforces transactions at monitored collegiate landmarks:
  - *Jadavpur University*: World View Staff Canteen, Subarna Jayanti Bhavan Lawn.
  - *Calcutta Medical College*: Council Hall Portico, Administrative Lawn.
  - *IIT Kharagpur*: Tech Market Clock Tower, Central Library Steps.
  - *NIT Durgapur*: Student Activity Center (SAC), Hall 11 Entrance.
- **Pre-Payment Inspection**: The buyer examines the physical condition, page markings, and instrument calibration before authorizing payment.
</details>

<details>
<summary><b>🔐 Stage 5: Cryptographic QR Handshake & Circular Loop</b></summary>
<br/>

- **Dynamic QR Handshake**: The seller displays a time-sensitive, single-use encrypted QR token generated by the checkout engine.
- **Instant Escrow Settlement**: The buyer scans the token via CampusCart, instantly confirming physical custody and releasing funds or peer barter credits.
- **The Circular Economy Engine**: When the junior completes that semester's examinations, the item is preserved in their `OrderHistory` with a **"Re-list for Next Batch"** button, creating an infinite, sustainable circular inventory loop.
</details>

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
