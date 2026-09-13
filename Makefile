# =============================================================================
# CampusCart — Makefile
# Task automation for local development, building, and Git operations
# =============================================================================

.PHONY: help dev build preview install clean git-prep

# Default target
help:
	@echo ================================================================
	@echo CampusCart Developer CLI Commands (Vite + React)
	@echo ================================================================
	@echo   make dev       : Launch Vite HMR dev server (http://localhost:3000)
	@echo   make build     : Build production-ready bundle with Vite
	@echo   make preview   : Preview the production build locally
	@echo   make install   : Install frontend npm dependencies
	@echo   make git-prep  : Inspect git staging and verify .gitignore status
	@echo   make clean     : Remove temporary cache and log files
	@echo ================================================================

# Start Vite dev server
dev:
	npm --prefix frontend run dev

# Build production bundle
build:
	npm --prefix frontend run build

# Preview production build
preview:
	npm --prefix frontend run preview

# Install dependencies
install:
	npm --prefix frontend install

# Check git status
git-prep:
	git status

# Clean temporary files
clean:
	@echo Cleaning cache and build files...
	-rmdir /s /q frontend\dist 2>nul
	-rmdir /s /q frontend\node_modules\.vite 2>nul
	@echo Clean complete.
