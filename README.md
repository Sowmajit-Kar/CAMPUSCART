<img width="1500" height="350" alt="image" src="https://github.com/user-attachments/assets/032f9923-3dcb-49eb-8381-fd6a98819bb3" />

# 🎓 CampusCart — Next-Gen Student Marketplace 

CampusCart is a college marketplace and peer skill exchange platform built with modern web aesthetics (Genesis-inspired design language, glassmorphism, procedural canvas reels, and cryptographic QR pickups).

---


## 📁 Repository Structure

The project is structured with a modular architecture prepared for standalone use and backend API integration:

```text
CAMPUSCART/
├── .gitignore                    # Excludes heavy video binaries, node_modules, temp files
├── LICENSE                       # Project license
├── Makefile                      # Make commands for local dev, build, and tasks
├── package.json                  # Root npm orchestrator scripts
├── README.md                     # Documentation & git guide
├── index.html                    # Root entry point with instant redirect to frontend
├── backend/                      # Backend API service
│   ├── requirements.txt          # Python dependencies
│   └── app/                      # Application source code
│       ├── main.py               # API entry point
│       └── core/                 # Core backend configurations
└── frontend/                     # Modern Vite + React Application
    ├── index.html                # Vite HTML module entry point
    ├── package.json              # Frontend scripts & dependencies
    ├── vite.config.js            # Vite build configuration
    ├── tailwind.config.js        # Tailwind styling & theme
    ├── postcss.config.js         # PostCSS pipeline
    └── src/
        ├── main.jsx              # React 18 createRoot mount point
        ├── App.jsx               # Core application state, modals & routing
        ├── index.css             # Tailwind directives + watermarks & keyframes
        ├── data/
        │   └── mockData.js       # Campus marketplace database
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



## 🚀 How to Run Locally

### 1. Frontend (Vite + React)

```bash
# Install dependencies (first time only)
npm run install:frontend
# or: cd frontend && npm install

# Start Vite development server (with instant Hot Module Replacement)
npm run dev
# or: make dev
# Launches http://localhost:3000
```

To create an optimized production build:
```bash
npm run build
# or: make build
```

---

### 2. Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server with auto-reload
uvicorn app.main:app --reload
# API runs on http://127.0.0.1:8000
# Interactive docs at http://127.0.0.1:8000/docs
```

---

## 📦 Initial Git Push Instructions


To push this codebase to your remote GitHub or GitLab repository:

```bash
# 1. Check git status
git status

# 2. Add your remote repository URL (replace with your GitHub repo URL)
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 3. Rename branch to main if needed
git branch -M main

# 4. Push to remote
git push -u origin main
```
