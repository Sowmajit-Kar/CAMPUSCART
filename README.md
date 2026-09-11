# 🎓 CampusCart — Next-Gen Student Marketplace 

CampusCart is a college marketplace and peer skill exchange platform built with modern web aesthetics (Genesis-inspired design language, glassmorphism, procedural canvas reels, and cryptographic QR pickups).

---

## 📁 Repository Structure

The project is structured with a modular frontend architecture prepared for standalone use and future backend API integration:

```text
CAMPUSCART/
├── .gitignore                    # Excludes heavy video binaries, node_modules, temp files
├── Makefile                      # Make commands for local dev, serving, and git operations
├── package.json                  # Root npm scripts
├── README.md                     # Documentation & git guide
├── index.html                    # Root entry point with instant redirect to frontend
└── frontend/                     # Modular Frontend Application
    ├── index.html                # Clean HTML entry point
    ├── package.json              # Frontend scripts
    ├── css/
    │   └── style.css             # Typography, watermarks, glassmorphism, animations
    └── js/
        ├── data/
        │   └── mockData.js       # Campus marketplace mock database
        ├── components/
        │   ├── VideoShowcase.js          # Procedural 60fps canvas motion reel
        │   ├── CircularWheelShowcase.js  # Interactive category rotating wheel
        │   ├── OverviewGatewayView.js    # Pre-login Genesis hero & comparison
        │   ├── HomrPageIdeaView.js       # Post-login marketplace dashboard
        │   ├── MarketplaceView.js        # Catalog grid & search filter
        │   ├── ServicesView.js           # Student tutoring & gigs
        │   ├── CourseView.js             # Course materials exchange
        │   └── CartView.js               # Shopping cart & QR token generator
        └── app.js                # Core App state, modals, and React mounting
```



## 🚀 How to Run Locally

You can run the project using **Make**, **NPM**, or **Python**:

### Option 1: Using Make (Recommended)
```bash
make dev
# Launches http://localhost:3000
```
Run `make help` to see all available commands (`make serve`, `make clean`, `make git-prep`).

### Option 2: Using NPM
```bash
npm run dev
# or
npm start
```

### Option 3: Using Python
```bash
python -m http.server 3000 --directory frontend
```

---

## 📦 Initial Git Push Instructions

The repository has been initialized with a comprehensive [`.gitignore`](file:///d:/CAMPUSCART/.gitignore) that automatically excludes heavy video screen recordings (`*.mp4`) to keep your remote repository lightweight and fast.

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
